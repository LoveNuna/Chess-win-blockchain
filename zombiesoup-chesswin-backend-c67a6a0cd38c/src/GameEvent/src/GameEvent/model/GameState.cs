using MySql.Data.MySqlClient;
using Amazon.Lambda.Core;

namespace GameEvent
{
    public class GameState
    {
        public string fen { get; set; }
        public string winnerId { get; set; }
        public double winnerPoints { get; set; }
        public double commission { get; set; }
        public string gameId { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string promotion { get; set; }
        public string moveBy { get; set; }
        public int movesCount { get; set; }
        public bool stalemated { get; set; } = false;
        public long whitePLastMoveTime { get; set; }
        public int whitePTimeLeftInSec { get; set; }
        public long blackPLastMoveTime { get; set; }
        public int blackPTimeLeftInSec { get; set; }

        public long lastMoveTime { get; set; }

        public void updateGameState()
        {
            // LambdaLogger.Log("Seconds left: " + this.blackPTimeLeftInSec.ToString());
            // LambdaLogger.Log("Seconds left: " + this.whitePTimeLeftInSec.ToString());

            MySqlCommand command = new MySqlCommand();
            command.CommandText = "UPDATE chess_games_state SET `from` = @from, `to` = @to, move_by = @moveBy, promotion = @promotion, moves_count = @movesCount, white_player_last_move_time = @whitePlayerLastMoveTime, white_player_sec_left = @whitePlayerSecLeft, black_player_last_move_time = @blackPlayerLastMoveTime, black_player_sec_left = @blackPlayerSecLeft, last_move_time = @lastMoveTime, fen = @fen WHERE game_id = @gameId;";
            command.Parameters.Add("@from", MySqlDbType.String).Value = this.from;
            command.Parameters.Add("@to", MySqlDbType.String).Value = this.to;
            command.Parameters.Add("@moveBy", MySqlDbType.String).Value = this.moveBy;
            command.Parameters.Add("@promotion", MySqlDbType.String).Value = this.promotion;
            command.Parameters.Add("@movesCount", MySqlDbType.String).Value = this.movesCount;
            command.Parameters.Add("@whitePlayerLastMoveTime", MySqlDbType.String).Value = this.whitePLastMoveTime;
            command.Parameters.Add("@blackPlayerLastMoveTime", MySqlDbType.String).Value = this.blackPLastMoveTime;
            command.Parameters.Add("@whitePlayerSecLeft", MySqlDbType.String).Value = this.whitePTimeLeftInSec;
            command.Parameters.Add("@blackPlayerSecLeft", MySqlDbType.String).Value = this.blackPTimeLeftInSec;
            command.Parameters.Add("@lastMoveTime", MySqlDbType.String).Value = this.lastMoveTime;
            command.Parameters.Add("@fen", MySqlDbType.String).Value = this.fen;
            command.Parameters.Add("@gameId", MySqlDbType.String).Value = this.gameId;
            command.Connection = MysqlConnectionCustom.getConnection();

            command.ExecuteNonQuery();

        }
    }
}