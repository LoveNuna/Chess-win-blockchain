export const UPDATE_PLAYER_POINTS =
  "UPDATE players SET gold_points = :goldPoints, silver_points = :silverPoints WHERE id = :userId";
export const LOAD_GAME_INFOS =
  " SELECT ch_g.winner_id, ch_g.winner_points, ch_g.black_player_id, ch_g.white_player_id, ch_g.points, ch_g.type," +
  " exists (select id from friends  where (user_id =white_player_id and friend_id =black_player_id) or (friend_id = black_player_id and user_id=white_player_id)" +
  " limit 1) friendship_exists" +
  " FROM chess_games ch_g" +
  " WhERE ch_g.id=:gameId";
