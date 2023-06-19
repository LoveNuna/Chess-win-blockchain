export const UPDATE_PLAYER_POINTS =
  "UPDATE players SET gold_points = if(:type = 1, :points, gold_points), silver_points = if(:type = 2, :points, silver_points) WHERE id = :id";

export const INSERT_GOLD_POINTS_BY =
  "insert into gold_points_buy (player_id, gold_coins, gold_coins_price, transaction_date, source) " +
  "value (:userId, :goldPoints, :goldPointsPrice, :transactionDate, :source)";
