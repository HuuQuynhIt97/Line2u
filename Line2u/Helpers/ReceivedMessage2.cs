using System.Collections.Generic;

namespace isRock.LineBot
{
    public class ReceivedMessage2
    {
        public string destination { get; set; }

        public List<EventLine> events_line { get; set; }
    }
}