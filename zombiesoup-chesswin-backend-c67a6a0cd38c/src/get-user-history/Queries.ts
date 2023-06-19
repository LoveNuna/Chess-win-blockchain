export const SELEC_USER_HISTORY =
  " select game.id, game.white_player_id," +
  " game.status,game.type, game.game_time_type, game.winner_points, game.winner_id," +
  " game.start_date, game.end_date, p2.profile_picture, p2.name, p2.email, p2.country" +
  " FROM players player" +
  " INNER JOIN chess_games game ON (player.id = game.black_player_id OR player.id = game.white_player_id)" +
  " INNER JOIN players p2 ON (p2.id != player.id AND (p2.id = game.black_player_id OR p2.id = game.white_player_id))" +
  " where player.id = ?" +
  " order by  game.end_date DESC" +
  " limit 100";
