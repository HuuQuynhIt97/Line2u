using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Line2u.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Line2u.DTO;
using System.Net.Http.Headers;
using Line2u.DTO.Line;
using static Org.BouncyCastle.Math.EC.ECCurve;
using Microsoft.AspNetCore.SignalR;
using Line2u.Hubs;
using Line2u.Models;

namespace isRock.Template
{
    public class LineWebHookController : isRock.LineBot.LineWebHookControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILineService _service;
        private readonly IXAccountService _accountService;
        static private HttpClient _httpClient;
        private readonly IChatService _chatService;
        private readonly IHubContext<Line2uHub> _hubContext;
        private HttpClient httpClient
        {
            get
            {
                if (_httpClient == null)
                    _httpClient = new HttpClient();

                return _httpClient;
            }
        }
        public LineWebHookController(
            IConfiguration configuration, 
            ILineService service,
            IXAccountService accountService,
            IChatService chatService,
            IHubContext<Line2uHub> hubContext
            )
        {
            _configuration = configuration;
            _service = service;
            _accountService = accountService;
            _hubContext = hubContext;
            _chatService = chatService;
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
                
                
                //配合Line Verify
                
                if (ReceivedMessage.events == null || ReceivedMessage.events.Count() <= 0 ||
                    ReceivedMessage.events.FirstOrDefault().replyToken == "00000000000000000000000000000000") return Ok();
                //取得Line Event
                var LineEvent = this.ReceivedMessage.events.FirstOrDefault();
                var _accessToken = await FetAccessToken(ReceivedMessage.destination);
                this.ChannelAccessToken = _accessToken.LineChannelAccessToken;
                var botProfile = await GetBotInfo(_accessToken.LineChannelAccessToken);
                //var events = await LineEvent.GetWebhookEventsAsync(LineEvent,channelSecret);
                //var app = new LineBotApp(lineMessagingClient);
                //await app.RunAsync(events);
                var responseMsg = "Welcome To Channel";
                var chat = new ChatDto();
                //準備回覆訊息
                if (LineEvent.type.ToLower() == "message" && LineEvent.message.type == "text")
                {
                    //responseMsg = $"you said: {LineEvent.message.text}";
                    var textResult = await _service.GetMessageFromGPT(LineEvent.message.text);
                    // add message to DB and refresh chat
                    chat.Message = LineEvent.message.text;
                    chat.OfficialId = botProfile.UserId;
                    chat.OfficialName = botProfile.DisplayName;
                    chat.Sender = LineEvent.source.userId;
                    chat.Receive = botProfile.UserId;
                    await AddMessage(chat);
                    string result = Regex.Replace(textResult, @"\t|\n", "");
                    responseMsg = $"{result}";
                }else if (LineEvent.type.ToLower() == "message")
                    responseMsg = $"receive event : {LineEvent.type} type: {LineEvent.message.type} ";
                else if (LineEvent.type.ToLower() == "follow")
                    await AddAccount(LineEvent.source.userId, _accessToken);
                else
                    responseMsg = $"receive event : {LineEvent.type} ";
                //回覆訊息
                this.ReplyMessage(LineEvent.replyToken, responseMsg);
                //after revieve to user add message to Db
                chat.Message = responseMsg;
                chat.OfficialId = botProfile.UserId;
                chat.OfficialName = botProfile.DisplayName;
                chat.Receive = LineEvent.source.userId;
                chat.Sender = botProfile.UserId;
                await AddMessage(chat);
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
        public async Task<bool> AddMessage([FromBody] ChatDto chat)
        {
            var res = await _chatService.AddMessageFromGPT(chat);
            //var result_content = getSignarlRefresh(res.SignarlData);
            //await _hubContext.Clients.All.SendAsync("ReceiveMessage", result_content, "reload");
            return true;
        }
        private object getSignarlRefresh(SignarlLoadUseDto result)
        {
            var result_content = new object();
            result_content = new
            {
                loadUserFrom = result.loadUserFrom,
                loadUserTo = result.loadUserTo
            };
            return result_content;
        }
        private async Task<Profile> GetBotInfo(string _accessToken)
        {
            //https://www.line2you.com/api/LineBotWebHook
            string channelAccessTokenMessage = _configuration.GetSection("LineNotifyConfig").GetSection("channelAccessTokenMessage").Value;
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);
            var response = await httpClient.GetAsync("https://api.line.me/v2/bot/info");
            var userProfile = JsonConvert.DeserializeObject<Profile>(await response.Content.ReadAsStringAsync());
            return userProfile;
            // after create account -> login
        }
        private async Task<bool> AddAccount(string uid,XAccount _model)
        {
            string channelAccessTokenMessage = _configuration.GetSection("LineNotifyConfig").GetSection("channelAccessTokenMessage").Value;
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _model.LineChannelAccessToken);
            var response = await httpClient.GetAsync($"https://api.line.me/v2/bot/profile/{uid}");
            var userProfile = JsonConvert.DeserializeObject<Profile>(await response.Content.ReadAsStringAsync());
            try
            {
                var model = new XAccountDto();
                model.Uid = userProfile.UserId;
                model.AccountNo = userProfile.DisplayName;
                model.AccountName = userProfile.DisplayName;
                model.LineID = userProfile.UserId;
                model.LineName = userProfile.DisplayName;
                model.LinePicture = userProfile.PictureUrl;
                model.LineParentId = _model.Uid;
                model.Upwd = "0000";
                model.IsLineAccount = "1";
                //check exist
                var existAccount = await _accountService.CheckExistUsernameLineCustomer(userProfile.UserId);
                if (!existAccount.Success)
                {
                    await _accountService.AddFormAsync(model);
                }
                else
                {
                    await _accountService.UpdateFormAsync(model);
                }
                return true;
            }
            catch (Exception)
            {
                return false;
                //throw;
            }
            
        }

        private async Task<XAccount> FetAccessToken(string destination)
        {
            return await _accountService.getChannelAccess(destination);
        }
    }
}