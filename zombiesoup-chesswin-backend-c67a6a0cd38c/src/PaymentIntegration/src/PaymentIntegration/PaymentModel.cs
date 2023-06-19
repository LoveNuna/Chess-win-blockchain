namespace PaymentIntegration
{
	public class PaymentModel
	{
		public string playerId { get; set; }
		public string amount { get; set; }
		public string paymentToken { get; set; }
		public string firstname { get; set; }
		public string lastname { get; set; }
		public string address { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string zip { get; set; }
	}
}