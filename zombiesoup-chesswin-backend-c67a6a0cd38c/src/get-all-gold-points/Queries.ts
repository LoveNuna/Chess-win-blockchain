export const SELECT_ALL_GOLD_COINS =
  " select player.id, player.name, player.email, player.country, sum(goldPointBy.gold_coins) as goldCoins, sum(goldPointBy.gold_coins_price) as price, goldPointBy.source" +
  " from players  as player " +
  " join gold_points_buy as goldPointBy on player.id = goldPointBy.player_id " +
  " where goldPointBy.transaction_date >= ? " +
  " group by goldPointBy.player_id , goldPointBy.source" +
  " order by  goldPointBy.transaction_date desc";
