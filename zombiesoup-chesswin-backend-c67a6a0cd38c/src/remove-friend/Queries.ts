export const DELETE_FRIEND_RECORD =
  " delete from friends" +
  " where (user_id = :userId and friend_id  = :friendId)" +
  " or (user_id = :friendId and friend_id  = :userId)";
