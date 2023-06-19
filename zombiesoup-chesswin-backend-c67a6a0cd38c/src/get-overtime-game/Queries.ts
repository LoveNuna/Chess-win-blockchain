export const SELECT_OVERTIME_GAME =
  " select * FROM chess_games as game " +
  " join chess_games_state as gamestate on (game.id = gamestate.game_id and game.status = 1)";
