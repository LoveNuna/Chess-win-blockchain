namespace GameEvent
{

    public class Move
    {
        public long timestampUtc { get; set; }
        public int timeLeftInSec { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string promotion { get; set; }

    }
}