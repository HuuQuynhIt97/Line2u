using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Line2u.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace isRock.Template
{
    public class LineWebHookController : isRock.LineBot.LineWebHookControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILineService _service;
        public LineWebHookController(IConfiguration configuration, ILineService service)
        {
            _configuration = configuration;
            _service = service;
        }


        [Route("api/LineBotWebHook")]
        [HttpPost]
        public async Task<IActionResult> POST()
        {
            string channelAccessTokenMessage = _configuration.GetSection("LineNotifyConfig").GetSection("channelAccessTokenMessage").Value;
            //var AdminUserId = "Ua536016d141459cc41bdd2bacfaac5ae";

            try
            {
                //設定ChannelAccessToken
                this.ChannelAccessToken = channelAccessTokenMessage;
                //配合Line Verify

                if (ReceivedMessage.events == null || ReceivedMessage.events.Count() <= 0 ||
                    ReceivedMessage.events.FirstOrDefault().replyToken == "00000000000000000000000000000000") return Ok();
                //取得Line Event
                var LineEvent = this.ReceivedMessage.events.FirstOrDefault();
                //var events = await LineEvent.GetWebhookEventsAsync(LineEvent,channelSecret);
                //var app = new LineBotApp(lineMessagingClient);
                //await app.RunAsync(events);
                var responseMsg = "";
                var textResult = await _service.GetMessageFromGPT(LineEvent.message.text);
                string result = Regex.Replace(textResult, @"\t|\n", "");
                //準備回覆訊息
                if (LineEvent.type.ToLower() == "message" && LineEvent.message.type == "text")
                    //responseMsg = $"you said: {LineEvent.message.text}";
                    responseMsg = $"{result}";
                else if (LineEvent.type.ToLower() == "message")
                    responseMsg = $"receive event : {LineEvent.type} type: {LineEvent.message.type} ";
                else
                    responseMsg = $"receive event : {LineEvent.type} ";
                //回覆訊息
                this.ReplyMessage(LineEvent.replyToken, responseMsg);
                //response OK
                return Ok();
            }
            catch (Exception ex)
            {
                //回覆訊息
                //this.PushMessage(AdminUserId, "An error occurred:\n" + ex.Message);
                //response OK
                return Ok();
            }
        }
    }
}