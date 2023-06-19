using MySql.Data.MySqlClient;
using Amazon.Lambda.Core;

namespace GameEvent
{
	public class Game
	{
		public string id { get; set; }

		public int gameTimeType { get; set; }
		public int status { get; set; }

		public int type { get; set; }

		public double points { get; set; }
		public double winnerPoints { get; set; }
		public double commission { get; set; }

		public long endDate { get; set; }

		public string whitePlayerId { get; set; }
		public string blackPlayerId { get; set; }

		public string winnerId { get; set; }
		public GameState gameState { get; set; }

		public void loadGameAndGameStateFromDb(string gameId)
		{
			this.gameState = new GameState();

			MySqlCommand command = new MySqlCommand();
			command.CommandText = "SELECT ch_g_s.*,ch_g.winner_id,ch_g.type,ch_g.game_time_type,ch_g.black_player_id,ch_g.white_player_id,ch_g.points,ch_g.commission from chess_games_state ch_g_s INNER JOIN chess_games ch_g ON ch_g.id=ch_g_s.game_id WHERE ch_g.id=@gameId;";
			command.Parameters.Add("@gameId", MySqlDbType.String).Value = gameId;
			command.Connection = MysqlConnectionCustom.getConnection();

			using (MySql.Data.MySqlClient.MySqlDataReader reader = command.ExecuteReader())
			{

				while (reader.Read())
				{
					this.id = gameId;
					this.gameTimeType = reader.GetInt32("game_time_type");
					this.blackPlayerId = reader.GetString("black_player_id");
					this.whitePlayerId = reader.GetString("white_player_id");
					this.winnerId = reader.GetString("winner_id");
					this.type = reader.GetInt32("type");
					this.points = reader.GetDouble("points");


					//fill gamestate infos
					this.gameState.from = reader.GetString("from");
					this.gameState.to = reader.GetString("to");
					this.gameState.moveBy = reader.GetString("move_by");
					this.gameState.promotion = reader.GetString("promotion");
					this.gameState.movesCount = reader.GetInt32("moves_count");
					this.gameState.whitePLastMoveTime = reader.GetInt64("white_player_last_move_time");
					this.gameState.whitePTimeLeftInSec = reader.GetInt32("white_player_sec_left");
					this.gameState.blackPLastMoveTime = reader.GetInt64("black_player_last_move_time");
					this.gameState.blackPTimeLeftInSec = reader.GetInt32("black_player_sec_left");
					this.gameState.lastMoveTime = reader.GetInt64("last_move_time");
					this.gameState.gameId = gameId;
					this.gameState.fen = reader.GetString("fen");
				}

				reader.Close();
			}
		}


		public void loadOnlyGame(string gameId)
		{
			this.gameState = new GameState();

			MySqlCommand command = new MySqlCommand();
			command.CommandText = "SELECT ch_g.black_player_id,ch_g.white_player_id,ch_g.type,ch_g.points from chess_games ch_g WHERE ch_g.id=@gameId;";
			command.Parameters.Add("@gameId", MySqlDbType.String).Value = gameId;
			command.Connection = MysqlConnectionCustom.getConnection();

			using (MySql.Data.MySqlClient.MySqlDataReader reader = command.ExecuteReader())
			{

				while (reader.Read())
				{
					this.id = gameId;
					this.blackPlayerId = reader.GetString("black_player_id");
					this.whitePlayerId = reader.GetString("white_player_id");
					this.type = reader.GetInt32("type");
					this.points = reader.GetDouble("points");
				}

				reader.Close();
			}
		}


		public void updateGame()
		{
			MySqlCommand command = new MySqlCommand();
			command.CommandText = "UPDATE chess_games SET status=@status, end_date=@endDate,winner_id = @winnerId,winner_points = @winerPoints,commission=@commission WHERE id=@gameId";
			command.Parameters.Add("@status", MySqlDbType.String).Value = this.status;
			command.Parameters.Add("@endDate", MySqlDbType.String).Value = this.endDate;
			command.Parameters.Add("@winnerId", MySqlDbType.String).Value = this.winnerId;
			command.Parameters.Add("@gameId", MySqlDbType.String).Value = this.id;
			command.Parameters.Add("@winerPoints", MySqlDbType.Double).Value = this.winnerPoints;
			command.Parameters.Add("@commission", MySqlDbType.Double).Value = this.commission;
			command.Connection = MysqlConnectionCustom.getConnection();

			command.ExecuteNonQuery();
		}

		public void updateGameByAbort()
		{
			MySqlCommand command = new MySqlCommand();
			command.CommandText = "UPDATE chess_games SET status=@status, end_date=@endDate,winner_id = @winnerId,winner_points = @winerPoints,commission=@commission WHERE id=@gameId";
			command.Parameters.Add("@status", MySqlDbType.String).Value = this.status;
			command.Parameters.Add("@endDate", MySqlDbType.String).Value = this.endDate;
			command.Parameters.Add("@winnerId", MySqlDbType.String).Value = this.winnerId;
			command.Parameters.Add("@gameId", MySqlDbType.String).Value = this.id;
			command.Parameters.Add("@winerPoints", MySqlDbType.Double).Value = this.winnerPoints;
			command.Parameters.Add("@commission", MySqlDbType.Double).Value = this.commission;
			command.Connection = MysqlConnectionCustom.getConnection();

			command.ExecuteNonQuery();
		}

		public void updateGameByDraw()
		{
			MySqlCommand command = new MySqlCommand();
			command.CommandText = "UPDATE chess_games SET status=@status, end_date=@endDate WHERE id=@gameId";
			command.Parameters.Add("@status", MySqlDbType.String).Value = this.status;
			command.Parameters.Add("@endDate", MySqlDbType.String).Value = this.endDate;
			command.Parameters.Add("@gameId", MySqlDbType.String).Value = this.id;
			command.Connection = MysqlConnectionCustom.getConnection();

			command.ExecuteNonQuery();
		}
	}
}