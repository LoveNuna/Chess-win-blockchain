using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.DynamoDBv2;
using Amazon.Lambda;
using Amazon.Lambda.Model;
using ChessDotNet;
using Newtonsoft.Json;
using MySql.Data.MySqlClient;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
namespace GameEvent
{
    public class Function
    {
        AmazonDynamoDBClient dynamoDBClient = new AmazonDynamoDBClient();
        AmazonLambdaClient lambdaClient = new AmazonLambdaClient(region: Amazon.RegionEndpoint.USEast1);

        public async Task<Response> FunctionHandler(Event inputEvent, ILambdaContext context)
        {
            try
            {
                string gameId = inputEvent.gameId;
                Console.WriteLine($"Game Id: {gameId}. Event:\n{JsonConvert.SerializeObject(inputEvent)}");

                switch (inputEvent.eventType)
                {
                    case EventType.GAME_MOVE:
                        await this.newGameMove(gameId, inputEvent.gameEvent, inputEvent.userId);
                        break;
                    case EventType.GAME_ABORT:
                        await this.abortGame(gameId, inputEvent.userId);
                        break;
                    case EventType.CHAT_MESSAGE:
                        await this.sendChatMessage(gameId, inputEvent.userId, inputEvent.chatEvent.message);
                        break;
                    case EventType.DRAW_REQUEST:
                        await this.drawRequest(gameId, inputEvent.userId, inputEvent.playerId);
                        break;
                    case EventType.DRAW_REQUEST_DECLINE:
                        await this.drawRequestDeclined(gameId, inputEvent.userId, inputEvent.playerId);
                        break;
                    case EventType.DRAW_REQUEST_ACCEPT:
                        await this.drawRequestAccepted(gameId, inputEvent.userId, inputEvent.playerId);
                        break;
                    default:
                        Console.WriteLine("default");
                        break;
                }
            }
            catch (Exception e)
            {
                LambdaLogger.Log(Newtonsoft.Json.JsonConvert.SerializeObject(e));
                Console.WriteLine("lambda-error : ", e.Message);
                return new Response(false, e.Message);
            }

            Console.WriteLine("No error");
            return new Response(true, "");
        }

        private async Task<bool> newGameMove(string gameId, GameEvent gameEvent, string userId)
        {
            Console.WriteLine($"Game Id: {gameId}. New game move.");

            //extract what we need
            string fen = gameEvent.fen;
            Move move = gameEvent.move;
            long timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            //create new chess game if isnt valid fen will throw exception
            ChessGame chessGame = new ChessGame(fen);

            //load state with gameId (GameState and LastMoveTime)
            Game currentGame = loadGame(gameId, true);

            //get new game state
            GameState newGameState = loadNewGameState(currentGame, timestamp, move, userId, fen);
            newGameState.lastMoveTime = timestamp;

            newGameState.stalemated = chessGame.IsStalemated(Player.Black) || chessGame.IsStalemated(Player.White);
            bool blackPlayerWinner = chessGame.IsWinner(Player.Black);
            bool whitePlayerWinner = chessGame.IsWinner(Player.White);
            string winnerId = newGameState.winnerId;


            if ((blackPlayerWinner || whitePlayerWinner) && string.IsNullOrEmpty(winnerId) && !newGameState.stalemated)
            {
                winnerId = currentGame.whitePlayerId == userId ? currentGame.whitePlayerId : currentGame.blackPlayerId;
            }

            if (!string.IsNullOrEmpty(winnerId)) // we have a winner and it's not stalemated
            {
                newGameState.winnerId = winnerId;

                currentGame.status = newGameState.stalemated ? 2 : 5;
                currentGame.endDate = newGameState.lastMoveTime;
                currentGame.winnerId = winnerId;

                Console.WriteLine("Game statusi : " + currentGame.status);


                if (currentGame.type == 1)
                {
                    double totalPoints = currentGame.points * 2;
                    currentGame.commission = Math.Round(2.5 * (totalPoints / 100), 2);
                    currentGame.winnerPoints = Math.Round(currentGame.points - currentGame.commission, 2);
                    // currentGame.winnerPoints = Math.Round((currentGame.points - (2.5 * currentGame.points / 100)), 2);
                    // currentGame.commission = Math.Round(currentGame.points - currentGame.winnerPoints, 2);

                    newGameState.commission = currentGame.commission;
                    newGameState.winnerPoints = currentGame.winnerPoints;
                }
                else
                {
                    string looserId = winnerId == currentGame.whitePlayerId ? currentGame.blackPlayerId : currentGame.whitePlayerId;

                    PlayerModel winner = new PlayerModel();
                    PlayerModel looser = new PlayerModel();

                    winner = getUserPlayer(currentGame.winnerId);//winner player
                    looser = getUserPlayer(looserId);//looser player

                    Console.WriteLine($"Game Id: {gameId}. Winner silver points: {winner.silverPoints}. Looser silver points: {looser.silverPoints}.");

                    PlayerModel player = new PlayerModel();
                    player = player.EloRating(winner.silverPoints, looser.silverPoints, 20, true);

                    player.playerRating = Math.Round(player.playerRating, MidpointRounding.AwayFromZero);
                    player.oponentRating = Math.Round(player.oponentRating, MidpointRounding.AwayFromZero);

                    Console.WriteLine($"Winner silver points after Elo : {player.playerRating}. Looser silver points after Elo: {player.oponentRating}.");

                    newGameState.commission = 0;
                    newGameState.winnerPoints = player.playerRating - winner.silverPoints;

                    currentGame.winnerPoints = newGameState.winnerPoints;

                    Console.WriteLine("Current winner points : " + currentGame.winnerPoints);
                }

                currentGame.updateGame();
            }

            newGameState.updateGameState();

            if (string.IsNullOrEmpty(winnerId)) // we don't have winner - just move on
            {
                await notifyAboutGameMove(gameId, newGameState);
            }
            else // it's over
            {
                await notifyAboutWinner(gameId, newGameState);
                await notifyGameFinished(gameId);

                //update playing status of player after new game
                updatePlayingStatusOfPlayer(currentGame.blackPlayerId);
                updatePlayingStatusOfPlayer(currentGame.whitePlayerId);

                //insert data for staus game and palyes in game_status_players table
                insertDataInGamePlayerStatusesTable(gameId, currentGame.blackPlayerId, currentGame.blackPlayerId == currentGame.winnerId);
                insertDataInGamePlayerStatusesTable(gameId, currentGame.whitePlayerId, currentGame.whitePlayerId == currentGame.winnerId);
            }

            return true;
        }

        private PlayerModel getUserPlayer(string playerId)
        {
            PlayerModel player = new PlayerModel();
            player.getPlayer(playerId);
            return player;
        }

        private Game loadGame(string gameId, bool loadGameState)
        {
            Game game = new Game();
            if (loadGameState)
            {
                game.loadGameAndGameStateFromDb(gameId);
            }
            else
            {
                game.loadOnlyGame(gameId);
            }

            return game;
        }

        private GameState loadNewGameState(Game currentGame, long currentTimestamp, Move move, string userId, string fen)
        {
            GameState newGameState = currentGame.gameState;
            int gameTimeType = currentGame.gameTimeType;

            // Console.WriteLine($"Game Id:{newGameState.gameId}. Game time type:{gameTimeType}. Loading new game state.");

            //load game time type infos
            int maxSecAllowed = ChessTimeUtils.gameTimeTypeToSec(gameTimeType);
            int additionalSec = ChessTimeUtils.getAdditionalSec(gameTimeType);

            //fill new game state
            string lastMoveBy = newGameState.moveBy;
            newGameState.from = move.from;
            newGameState.to = move.to;
            newGameState.moveBy = userId;
            newGameState.fen = fen;
            newGameState.promotion = move.promotion;
            newGameState.movesCount = newGameState.movesCount + 1;

            //extract fields you play with
            long timestampUtc = move.timestampUtc;
            int timeLeftInSec = move.timeLeftInSec;

            //load previous seconds left initialy load maximum allowed seconds
            int previousLeftInSec = maxSecAllowed;

            // Betim, Sun, Mar 29, 2020 - changed from 3 to 2
            if (newGameState.movesCount < 2)
            {
                return newGameState;
            }

            if (newGameState.movesCount > 4)
            {
                previousLeftInSec = fen.IndexOf(" b ") >= 0 ? newGameState.whitePTimeLeftInSec : newGameState.blackPTimeLeftInSec;
            }

            //check if deviation is large // difference in seconds between 2 timestamps lastMoveTimeUtc & timestampUtc
            //also check timeleftinSec and see difference between first and this one
            // var difference = (lastMoveTimeUtc - timestampUtc).Seconds;
            long lastMoveTime = newGameState.lastMoveTime;
            // Console.WriteLine($"Game Id: {newGameState.gameId}. Last move time: {lastMoveTime}. Current time: {currentTimestamp}. Difference: {currentTimestamp - lastMoveTime}.");

            int secLeft = timeLeftInSec;

            //get server calculatioon
            // THIS WAS WHEN WE CALCULATED ON SECONDS!
            int secPassedServer = (int)((currentTimestamp - lastMoveTime) / 1000);
            int secLeftServer = (previousLeftInSec - secPassedServer);


            //additional check -  if difference between server seconds left and client seconds left is more than 1 sec then choose server correction
            // Console.WriteLine($"Game Id: {newGameState.gameId}. Abs: {Math.Abs(timeLeftInSec - secLeftServer)}");

            if (Math.Abs(timeLeftInSec - secLeftServer) > 2)
            {
                // Console.WriteLine($"Game Id: {newGameState.gameId}. Enahancing from server. Left: {secLeft}. Server:{secLeftServer}.");
                secLeft = secLeftServer;
            }
            else
            {
                secLeft = secLeft - 1;
            }

            //check if seconds are over
            if (secLeft <= 0) //lose
            {
                newGameState.winnerId = lastMoveBy;
            }

            var addition = secLeft + additionalSec;
            if (fen.IndexOf(" b ") >= 0)
            {
                // Console.WriteLine($"Game Id: {newGameState.gameId}. White. Current ts: {currentTimestamp}. Addition: {addition}.");
                newGameState.whitePLastMoveTime = currentTimestamp;
                newGameState.whitePTimeLeftInSec = addition;
            }
            else
            {
                // Console.WriteLine($"Game Id: {newGameState.gameId}. Black. Current ts: {currentTimestamp}. Addition: {addition}.");
                newGameState.blackPLastMoveTime = currentTimestamp;
                newGameState.blackPTimeLeftInSec = addition;
            }

            return newGameState;
        }

        private async Task<bool> notifyAboutWinner(string gameId, GameState gameState)
        {
            Console.WriteLine($"Game Id: {gameId}. Notification about game ended.");

            Dictionary<string, object> message = new Dictionary<string, object>();
            message.Add("type", EventType.GAME_ENDED.ToString());
            message.Add("payload", gameState);
            message.Add("gameId", gameId);

            Dictionary<string, object> sendMessageEvent = new Dictionary<string, object>();
            sendMessageEvent.Add("message", message);
            sendMessageEvent.Add("gameId", gameId);

            await sendWSMessage(sendMessageEvent);

            return true;
        }

        private async Task<bool> notifyAboutGameMove(string gameId, GameState gameState)
        {
            Console.WriteLine($"Game Id: {gameId}. New game move.");

            Dictionary<string, object> messagePayload = new Dictionary<string, object>();
            messagePayload.Add("type", EventType.GAME_MOVE.ToString());
            messagePayload.Add("payload", gameState);
            messagePayload.Add("gameId", gameId);


            Dictionary<string, object> messageEvent = new Dictionary<string, object>();
            messageEvent.Add("message", messagePayload);
            messageEvent.Add("gameId", gameId);

            await sendWSMessage(messageEvent);

            return true;
        }

        private async Task<bool> abortGame(string gameId, string userId)
        {
            Console.WriteLine($"Game Id: {gameId}. Aborting game.");

            Game game = loadGame(gameId, false);
            game.winnerId = game.blackPlayerId == userId ? game.whitePlayerId : game.blackPlayerId;
            game.status = 4;
            game.endDate = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            if (game.type == 1) // gold game
            {
                // this is for gold games
                double totalPoints = game.points * 2;
                game.commission = Math.Round(2.5 * (totalPoints / 100), 2);
                game.winnerPoints = Math.Round(game.points - game.commission, 2);
                // game.winnerPoints = Math.Round((game.points - (2.5 * game.points / 100)), 2);
                // game.commission = Math.Round(game.points - game.winnerPoints, 2);
            }
            else    // calculate EloRating for std players
            {
                string looserId = game.winnerId == game.whitePlayerId ? game.blackPlayerId : game.whitePlayerId;

                PlayerModel winner = new PlayerModel();
                PlayerModel looser = new PlayerModel();

                winner = getUserPlayer(game.winnerId); //winner player  
                looser = getUserPlayer(looserId); //looser player

                Console.WriteLine($"Game Id: {gameId}. Winner silver points: {winner.silverPoints}. Looser silver points: {looser.silverPoints}.");

                PlayerModel player = new PlayerModel();
                player = player.EloRating(winner.silverPoints, looser.silverPoints, 20, true);

                player.playerRating = Math.Round(player.playerRating, MidpointRounding.AwayFromZero);
                player.oponentRating = Math.Round(player.oponentRating, MidpointRounding.AwayFromZero);

                // double looserPoints = player2.silverPoints - player.oponentRating;

                game.winnerPoints = player.playerRating - winner.silverPoints;
                game.commission = 0;
            }

            Console.WriteLine($"Game Id: {gameId}. Game type is {game.type}. Winner points: {game.winnerPoints}");

            game.updateGameByAbort();

            //notify another lambda that game is finished
            Console.WriteLine($"Game Id: {gameId}. Notifying game finished.");
            await notifyGameFinished(gameId);

            //update playing status of player after abort game
            updatePlayingStatusOfPlayer(game.blackPlayerId);
            updatePlayingStatusOfPlayer(game.whitePlayerId);

            //insert data for staus game and players in game_status_players table
            insertDataInGamePlayerStatusesTable(gameId, game.blackPlayerId, game.blackPlayerId == game.winnerId);
            insertDataInGamePlayerStatusesTable(gameId, game.whitePlayerId, game.whitePlayerId == game.winnerId);

            //Send Message to Subscription to notify about game abort
            Console.WriteLine($"Game Id: {gameId}. Notifying by wsmessage.");

            Dictionary<string, object> messagePayload = new Dictionary<string, object>();
            messagePayload.Add("type", EventType.GAME_ABORT.ToString());
            messagePayload.Add("userId", userId);
            messagePayload.Add("gameId", gameId);
            messagePayload.Add("winnerPoints", game.winnerPoints);
            messagePayload.Add("commission", game.commission);

            Dictionary<string, object> messageEvent = new Dictionary<string, object>();
            messageEvent.Add("message", messagePayload);
            messageEvent.Add("gameId", gameId);

            await sendWSMessage(messageEvent);
            return true;
        }

        private async Task<bool> sendChatMessage(string gameId, string userId, string txtMessage)
        {
            Dictionary<string, object> message = new Dictionary<string, object>();
            message.Add("type", EventType.CHAT_MESSAGE.ToString());
            message.Add("payload", txtMessage);
            message.Add("userId", userId);
            message.Add("gameId", gameId);


            Dictionary<string, object> sendMessageEvent = new Dictionary<string, object>();
            sendMessageEvent.Add("message", message);
            sendMessageEvent.Add("gameId", gameId);

            Console.WriteLine("sending message");

            await sendWSMessage(sendMessageEvent);

            return true;
        }

        private async Task<bool> drawRequest(string gameId, string userId, string playerId)
        {

            Dictionary<string, object> message = new Dictionary<string, object>();
            message.Add("type", EventType.DRAW_REQUEST.ToString());
            message.Add("userId", userId);
            message.Add("gameId", gameId);


            Dictionary<string, object> sendMessageEvent = new Dictionary<string, object>();
            sendMessageEvent.Add("message", message);
            sendMessageEvent.Add("userId", playerId);

            Console.WriteLine("sending message");

            await sendWSMessage(sendMessageEvent);

            return true;
        }

        private async Task<bool> drawRequestDeclined(string gameId, string userId, string playerId)
        {
            Dictionary<string, object> message = new Dictionary<string, object>();
            message.Add("type", EventType.DRAW_REQUEST_DECLINE.ToString());
            message.Add("userId", userId);
            message.Add("gameId", gameId);


            Dictionary<string, object> sendMessageEvent = new Dictionary<string, object>();
            sendMessageEvent.Add("message", message);
            sendMessageEvent.Add("userId", playerId);

            Console.WriteLine("sending message");

            await sendWSMessage(sendMessageEvent);

            return true;
        }

        private async Task<bool> drawRequestAccepted(string gameId, string userId, string playerId)
        {
            Game game = new Game();
            game.id = gameId;
            game.status = 3;
            game.endDate = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            game.updateGameByDraw();


            Dictionary<string, object> message = new Dictionary<string, object>();
            message.Add("type", EventType.DRAW_REQUEST_ACCEPT.ToString());
            message.Add("userId", userId);
            message.Add("gameId", gameId);

            Dictionary<string, object> sendMessageEvent = new Dictionary<string, object>();
            sendMessageEvent.Add("message", message);
            sendMessageEvent.Add("gameId", gameId);

            Console.WriteLine("sending message");

            await sendWSMessage(sendMessageEvent);

            await notifyUnsubscribeGame(gameId);

            //update playing status of player after draw accepted game
            updatePlayingStatusOfPlayer(userId);
            updatePlayingStatusOfPlayer(playerId);

            return true;
        }

        private async Task<bool> sendWSMessage(Dictionary<string, object> sendMessageEvent)
        {
            Console.WriteLine($"Invoking send-mesage.");

            InvokeRequest invokeRequest = new InvokeRequest();
            invokeRequest.FunctionName = "send-messages";
            invokeRequest.InvocationType = InvocationType.Event;
            invokeRequest.Payload = Newtonsoft.Json.JsonConvert.SerializeObject(sendMessageEvent);

            await lambdaClient.InvokeAsync(invokeRequest);

            return true;
        }

        private async Task<bool> notifyGameFinished(string gameId)
        {
            Console.WriteLine($"Game Id: {gameId}. Invoking game-finished.");

            Dictionary<string, object> sendMessageEvent = new Dictionary<string, object>();
            sendMessageEvent.Add("gameId", gameId);

            InvokeRequest invokeRequest = new InvokeRequest();
            invokeRequest.FunctionName = "game-finished";
            invokeRequest.InvocationType = InvocationType.Event;
            invokeRequest.Payload = Newtonsoft.Json.JsonConvert.SerializeObject(sendMessageEvent);

            await lambdaClient.InvokeAsync(invokeRequest);

            return true;
        }

        private async Task<bool> notifyUnsubscribeGame(string gameId)
        {
            Dictionary<string, object> sendMessageEvent = new Dictionary<string, object>();
            sendMessageEvent.Add("gameId", gameId);

            InvokeRequest invokeRequest = new InvokeRequest();
            invokeRequest.FunctionName = "unsubscribe-game";
            invokeRequest.InvocationType = InvocationType.Event;
            invokeRequest.Payload = Newtonsoft.Json.JsonConvert.SerializeObject(sendMessageEvent);

            Console.WriteLine("invoking unsubscribe-game");
            await lambdaClient.InvokeAsync(invokeRequest);
            Console.WriteLine("invoking unsubscribe-game-done");

            return true;
        }

        private void updatePlayingStatusOfPlayer(string playerId)
        {
            MySqlCommand command = new MySqlCommand();
            command.CommandText = "UPDATE players SET playing=@playing WHERE id=@playerId;";
            command.Parameters.Add("@playing", MySqlDbType.Int32).Value = 0;
            command.Parameters.Add("@playerId", MySqlDbType.String).Value = playerId;
            command.Connection = MysqlConnectionCustom.getConnection();

            command.ExecuteNonQuery();
        }

        private void insertDataInGamePlayerStatusesTable(string gameId, string playerId, bool isWin)
        {
            MySqlCommand command = new MySqlCommand();

            command.CommandText = "INSERT INTO game_player_statuses (game_id, player_id, is_win, timestamp) VALUES (@GameId, @PlayerId, @IsWin, @Timestamp)";
            command.Parameters.Add("@GameId", MySqlDbType.String).Value = gameId;
            command.Parameters.Add("@PlayerId", MySqlDbType.String).Value = playerId;
            command.Parameters.Add("@IsWin", MySqlDbType.Bit).Value = isWin;
            command.Parameters.Add("@Timestamp", MySqlDbType.Int64).Value = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            command.Connection = MysqlConnectionCustom.getConnection();

            command.ExecuteNonQuery();
        }
    }
}
