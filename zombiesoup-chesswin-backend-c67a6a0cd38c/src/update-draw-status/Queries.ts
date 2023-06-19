  export const UPDATE_DRAW_STATUS=
  "UPDATE draw_requests SET draw_status = :drawStatus, draw_change_date = :drawChangeDate WHERE player_id = :playerId";

  export const GET_PLAYER="SELECT * from players p WHERE p.id = :playerId";

  export const UPDATE_PLAYER_POINTS =
  "UPDATE players SET gold_points = :goldPoints WHERE id = :userId";
