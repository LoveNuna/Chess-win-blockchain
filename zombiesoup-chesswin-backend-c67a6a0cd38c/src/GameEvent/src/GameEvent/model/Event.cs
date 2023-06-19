namespace GameEvent
{

    public class Event
    {
        public GameEvent gameEvent { get; set; }
        public ChatEvent chatEvent { get; set; }
        public EventType eventType { get; set; }
        public string userId { get; set; }
        public string playerId { get; set; }
        public string gameId { get; set; }
    }
}