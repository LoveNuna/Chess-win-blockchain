namespace GameEvent
{

    public class Response
    {
        public Response(bool success, string error)
        {
            this.success = success;
            this.error = error;
        }
        public bool success { get; set; }
        public string error { get; set; }
    }

}