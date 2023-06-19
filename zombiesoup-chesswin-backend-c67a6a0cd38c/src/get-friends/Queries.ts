export const SELECT_ALL_FRIENDS =
  "SELECT p.*,f.status as friend_status FROM friends f INNER JOIN players p ON f.friend_id = p.id WHERE f.user_id = ? ORDER BY p.status DESC, p.playing DESC;";
