using MySql.Data.MySqlClient;
using System;

namespace GameEvent
{
    public class PlayerModel
    {
        public string id { get; set; }
        public double silverPoints { get; set; }

        public double playerRating { get; set; }

        public double oponentRating { get; set; }

        public void getPlayer(string playerId)
        {
            MySqlCommand command = new MySqlCommand();
            command.CommandText = "SELECT p.id, p.silver_points from players p WHERE p.id=@playerId;";
            command.Parameters.Add("@playerId", MySqlDbType.String).Value = playerId;
            command.Connection = MysqlConnectionCustom.getConnection();

            using (MySql.Data.MySqlClient.MySqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    this.id = playerId;
                    this.silverPoints = reader.GetDouble("silver_points");
                }

                reader.Close();
            }
        }

        private double Probability(double rating1,
                                         double rating2)
        {
            return 1 / (1 + Math.Pow(10, (rating1 - rating2) / 400));
        }

        // Function to calculate Elo rating 
        // K is a constant. 
        // d determines whether Player A wins or 
        // Player B.  
        public PlayerModel EloRating(double Ra, double Rb,
                                    int K, bool d)
        {

            // To calculate the Winning 
            // Probability of Player B 
            double Pb = Probability(Ra, Rb);

            // To calculate the Winning 
            // Probability of Player A 
            double Pa = Probability(Rb, Ra);

            // Case -1 When Player A wins 
            // Updating the Elo Ratings 
            if (d == true)
            {
                Ra = Ra + K * (1 - Pa);
                Rb = Rb + K * (0 - Pb);
            }

            // Case -2 When Player B wins 
            // Updating the Elo Ratings 
            else
            {
                Ra = Ra + K * (0 - Pa);
                Rb = Rb + K * (1 - Pb);
            }

            Console.Write("Updated Ratings:-\n");

            Console.Write("Ra = " + (Math.Round(Ra
                         * 1000000.0) / 1000000.0)
                        + " Rb = " + Math.Round(Rb
                         * 1000000.0) / 1000000.0);

            PlayerModel player = new PlayerModel();
            player.playerRating = (Math.Round(Ra * 1000000.0) / 1000000.0);
            player.oponentRating = (Math.Round(Rb * 1000000.0) / 1000000.0);

            return player;
        }
    }
}