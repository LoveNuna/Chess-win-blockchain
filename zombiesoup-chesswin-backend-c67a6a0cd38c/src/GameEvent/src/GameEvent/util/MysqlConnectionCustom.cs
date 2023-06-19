
using System.Data;
using MySql.Data.MySqlClient;

namespace GameEvent
{
    public class MysqlConnectionCustom
    {
        private static MySqlConnection connection;
        private static string CONNECTION_STRING = "server=chess-online-players.chfwjguhjjia.us-east-1.rds.amazonaws.com;database=chess_online_players;uid=chess_master;pwd=chess_password;";


        public MysqlConnectionCustom()
        {
            try
            {
                connection = new MySqlConnection(CONNECTION_STRING);

                connection.Open();
            }
            catch (MySqlException)
            {

            }

        }

        public static MySqlConnection getConnection()
        {
            if (connection == null ||
                connection.State == ConnectionState.Broken ||
                connection.State == ConnectionState.Closed)
            {

                if (connection != null && connection.State == ConnectionState.Open)
                {
                    connection.Close();
                }

                try
                {
                    connection = new MySqlConnection(CONNECTION_STRING);
                    connection.Open();
                }
                catch (MySqlException)
                {

                }
            }

            return connection;
        }
    }
}