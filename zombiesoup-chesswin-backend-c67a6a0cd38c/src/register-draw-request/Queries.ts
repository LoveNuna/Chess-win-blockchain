export const INSERT_DRAW_REQUEST =
  "insert into draw_requests (player_id, draw_status, draw_gold_points, paypal_email, created_date, draw_change_date) " +
  "values (:playerId, :drawStatus, :drawGoldPoints, :paypalEmail, :createdDate, :drawChangeDate)";
