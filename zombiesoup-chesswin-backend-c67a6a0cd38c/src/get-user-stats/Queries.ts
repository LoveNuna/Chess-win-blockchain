export const LOAD_USER_STATS =
  " SELECT g.id AS game_id, g.status, g.fair_play_enabled, g.game_time_type, g.points, " +
  " g.type, g.start_date, g.winner_id, p2.id as player_id, p2.name, p2.email, p2.profile_picture, p2.country, " +
  " g.white_player_id, g.winner_points, g.end_date " +
  " FROM players p " +
  " INNER JOIN chess_games g ON (p.id = g.black_player_id OR p.id = g.white_player_id) " +
  " INNER JOIN players p2 ON (p2.id != p.id AND (p2.id = g.black_player_id OR p2.id = g.white_player_id))" +
  " WHERE p.id = :userId " +
  " ORDER BY g.end_date DESC ";
