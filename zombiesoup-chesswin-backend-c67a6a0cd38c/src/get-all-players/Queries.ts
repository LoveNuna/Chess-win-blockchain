export const SELECT_ALL_PLAYERS =
  " SELECT p.* , (select count(id) from  players) as totalCount " +
  " FROM players p " +
  " ORDER BY p.created_date " +
  " DESC LIMIT ? OFFSET ? ";

export const SELECT_ALL_PLAYERS_BY_SEARCH =
  " SELECT  p.* , " +
  "(select count(id) from  players where name like '#filter#%') as totalCount " +
  " FROM players p " +
  " WHERE p.name like '#filter#%' " +
  " ORDER BY p.created_date " +
  " DESC LIMIT ? OFFSET ? ";
