//secret infos
export const SECRET_ACCESS_KEY = "Cn1kUbveG/itlP9M6TwlOslAxVMFhOujA32P7rL9";
export const ACCESS_KEY_ID = "AKIATZKQT5EWNZ7ESZ7T";

//mysql connection infos
export const CHESSF_MYSQL_HOST =
  "chess-online-players.chfwjguhjjia.us-east-1.rds.amazonaws.com";
export const CHESSF_MYSQL_USER = "chess_master";
export const CHESSF_MYSQL_PASSWORD = "chess_password";
export const CHESSF_MYSQL_DATABASE = "chess_online_players";

//dynamo db tables
export const CONNECTED_FRIENDS_TABLE_NAME = "ConnectedPlayers";
export const CHESS_GAMES_TABLE_NAME = "chess_games";
export const CHESS_GAMES_DYNAMO_TABLE_NAME = "ChessGames";
export const GAME_SUBSCRIPTIONS_TABLE_NAME = "GameSubscriptions";

//cognito user pool infos
export const USER_POOL_ID = "us-east-1_rri38aeY3";
export const IDENTITY_POOL_ID =
  "us-east-1:e09e7ff1-17da-4d2a-b0f2-7148ca30fb30";

//cognito triggers infos
export const POST_CONFIRM_SIGNUP = "PostConfirmation_ConfirmSignUp";
export const APP_UPDATE_USER = "App_update_user";

//api gateway infos
export const WEBSOCKET_REGION = "us-east-1";
export const WEBSOCKET_HOST = "3yd2l51t28.execute-api.us-east-1.amazonaws.com";
iiiiiiiiiiiiiii
//game message types
export const CONNECTION_ID = "CONNECTION_ID";
export const NEW_GAME_REQUEST = "NEW_GAME_REQUEST";
export const GAME_REQUEST_DECLINED = "GAME_REQUEST_DECLINED";
export const GAME_REQUEST_ACCEPTED = "GAME_REQUEST_ACCEPTED";
export const POINTS_UPDATED = "POINTS_UPDATED";

//send friend request
export const NEW_FRIEND_REQUEST = "NEW_FRIEND_REQUEST";

//1 game in progress
//2 someone is winner
//3 game drawed
//4 game aborted
//5 stalemated
