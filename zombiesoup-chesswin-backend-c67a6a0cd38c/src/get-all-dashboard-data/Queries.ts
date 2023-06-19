export const SELECT_ALL_DASHBOARD_DATA =
  " select 'monthly' as type, sum(games) as games, sum(commission) as commissions, sum(players) as players from ( " +
  " select count(*) as games, SUM(commission) AS commission, 0 as players  from chess_games where start_date >= %MONTHTIME% " +
  " union " +
  " select  0 as games, 0 as commission,  count(*) as players from players where created_date >= %MONTHTIME% ) as t " +
  " union " +
  " select 'weekly' as type, sum(games) as games, sum(commission) as commissions, sum(players) as players from ( " +
  " select count(*) as games, SUM(commission) AS commission, 0 as players  from chess_games where start_date >= %WEEKTIME% " +
  " union " +
  " select  0 as games, 0 as commission,  count(*) as players from players where created_date >= %WEEKTIME% ) as t " +
  " union " +
  " select 'daily' as type, sum(games) as games, sum(commission) as commissions, sum(players) as players from ( " +
  " select count(*) as games, SUM(commission) AS commission, 0 as players  from chess_games where start_date >= %DAYTIME% " +
  " union " +
  " select  0 as games, 0 as commission,  count(*) as players from players where created_date >= %DAYTIME% ) as t ";
