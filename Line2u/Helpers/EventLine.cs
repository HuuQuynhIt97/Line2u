using isRock.LineBot;

namespace isRock.LineBot
{
    public class EventLine
    {
        public string type { get; set; }

        public string replyToken { get; set; }
        public string mode { get; set; }
        public string webhookEventId { get; set; }
        public string deliveryContext { get; set; }

        public Source source { get; set; }

        public long timestamp { get; set; }

        public Message message { get; set; }

        public Postback postback { get; set; }

        public Beacon beacon { get; set; }

        public SourceUser[] members { get; set; }

        public Members left { get; set; }

        public Members joined { get; set; }

        public Link link { get; set; }
    }
}
