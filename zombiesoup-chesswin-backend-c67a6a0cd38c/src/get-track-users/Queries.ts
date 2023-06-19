//export const SELECT_TRACK_USERS = `call pgs(?, ?)`;

export const SELECT_TRACK_USERS =
  "select p.name, p.preferred_username, p.email, p.country, player_id,sum(is_win = 1) win, sum(is_win = 0) lost " +
  " from game_player_statuses s " +
  " inner join  players p on s.player_id = p.id " +
  " where game_id != '' and player_id != '' " +
  " and timestamp > date_sub(current_date(), INTERVAL ? DAY) " +
  " group by player_id " +
  " order by win desc,  player_id " +
  " limit 100";
