export const GET_PLAYERS =
  "SELECT * FROM players p WHERE(p.id = :userId OR p.id =:opponentId) AND p.status = 1 AND p.playing = 0 AND if(:type = 1, p.gold_points >= :points, p.silver_points >= :points);";
export const GET_RANDOM_PLAYER =
  " (SELECT p.*, TRUE AS user FROM players p WHERE p.id = :id) " +
  " UNION ALL " +
  " (SELECT p.*, FALSE AS user FROM players p WHERE p.id != :id AND p.status = 1 AND p.playing = 0 AND if(:type = 1, p.gold_points >= :points, p.silver_points >= :points) AND p.allow_random = 1 ORDER BY RAND() LIMIT 1) ";
// export const GET_RANDOM_PLAYER = "SELECT p.*, IF(p.id = :id, TRUE, FALSE) AS user FROM players p WHERE p.status = 1 AND p.playing = 0 AND if(:type = 1, p.gold_points >= :points, p.silver_points >= :points) AND p.allow_random = 1 ORDER BY user DESC LIMIT 2;"
