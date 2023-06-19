
using Amazon.Lambda.Core;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
namespace PaymentIntegration
{
	public class Function
	{
		// AmazonDynamoDBClient dynamoDBClient = new AmazonDynamoDBClient();
		// AmazonLambdaClient lambdaClient = new AmazonLambdaClient(region: Amazon.RegionEndpoint.USEast1);

		public async Task<int> FunctionHandler(PaymentModel payment)
		{
			Console.WriteLine("##token : " + payment.paymentToken);
			Console.WriteLine("##playerId  : " + payment.playerId);
			Console.WriteLine("##amount : " + payment.amount);
			Console.WriteLine("##firstname : " + payment.firstname);
			Console.WriteLine("##lastname  : " + payment.lastname);
			Console.WriteLine("##address : " + payment.address);
			Console.WriteLine("##state : " + payment.state);
			Console.WriteLine("##zip  : " + payment.zip);

			string result = "";
			string security_key = "ZAdwTv47F5hZ4VjYqteXWM6747mazkRB";
			string type = "sale";
			string url = $"https://secure.t1paymentsgateway.com/api/transact.php";

			using (HttpClient httpClient = GetHttpClient())
			{
				string contentType = "application/x-www-form-urlencoded";
				httpClient.DefaultRequestHeaders.Accept.Clear();
				httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(contentType));


				var stringContent = new FormUrlEncodedContent(new Dictionary<string, string>
					{
						{"security_key", security_key},
						{"type", type},
						{"payment_token", payment.paymentToken},
						{"amount", payment.amount},
						{"firstname", payment.firstname},
						{"lastname", payment.lastname},
						{"address1", payment.address},
						{"city", payment.city},
						{"state",payment.state},
						{"zip", payment.zip}
					});

				HttpResponseMessage response = await httpClient.PostAsync(url, stringContent);


				result = await response.Content.ReadAsStringAsync();

				// 1 = Transaction Approved
				// 2 = Transaction Declined
				// 3 = Error in transaction data or system error

				if (result.Contains("response=1"))
				{
					// string source = "Merchant";
					// updateSourcePaymentPlayer(payment.playerId, source);
					Console.WriteLine("##success : " + result);
					return 1;
				}
				else if (result.Contains("response=2"))
				{
					Console.WriteLine("##error : " + result);
					return 2;
				}
				else
				{
					Console.WriteLine("##error : " + result);
					return 3;
				}
			}
		}

		private void updateSourcePaymentPlayer(string playerId, string source)
		{
			MySqlCommand command = new MySqlCommand();
			command.CommandText = "UPDATE players SET source=@source WHERE id=@playerId;";
			command.Parameters.Add("@source", MySqlDbType.String).Value = source;
			command.Parameters.Add("@playerId", MySqlDbType.String).Value = playerId;
			command.Connection = MysqlConnectionCustom.getConnection();

			command.ExecuteNonQuery();
		}

		private static HttpClient GetHttpClient()
		{
			ServicePointManager.ServerCertificateValidationCallback +=
			 (sender, cert, chain, error) =>
			 {
				 return true;
			 };

			HttpClient httpClient = new HttpClient();
			return httpClient;
		}
	}
}

