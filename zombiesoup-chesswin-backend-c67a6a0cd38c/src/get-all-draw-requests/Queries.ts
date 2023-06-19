export const SELECT_ALL_DRAW_REQUESTS ="Select * From draw_requests dr " +
                                        "Join players p on  dr.player_id = p.id Order by dr.draw_change_date desc";
