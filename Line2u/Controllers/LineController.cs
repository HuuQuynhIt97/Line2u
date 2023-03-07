using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Line2u.DTO;
using Line2u.DTO.Line;
using Line2u.Helpers;
using Line2u.Hubs;
using Line2u.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using NetUtility;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml.FormulaParsing.LexicalAnalysis;
using OpenAI_API;
using OpenAI_API.Completions;

namespace Line2u.Controllers
{
    //[Route("api/[controller]")]
    //[ApiController]
    public class LineController : ApiControllerBase
    {
        private readonly string _authorizeUrl;
        private readonly string _tokenUrl;
        private readonly string _profileUrl;
        private readonly string _clientId;
        private readonly string _clientSecret;
        private readonly string _redirectUri;
        private readonly string _state;
        private readonly string _successUri;
        readonly IConfiguration _config;
        static private HttpClient _httpClient;
        private readonly IXAccountService _accountService;
        private readonly ILineService _service;
        private readonly IAuthService _authService;
        private readonly IXAccountGroupService _accountGroupService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IChatService _chatService;
        private readonly IHubContext<Line2uHub> _hubContext;
        private readonly string _QRUrl;
        private HttpClient httpClient
        {
            get
            {
                if (_httpClient == null)
                    _httpClient = new HttpClient();

                return _httpClient;
            }
        }


        public LineController(
            IConfiguration config, 
            ILineService service, 
            IXAccountService accountService, 
            IAuthService authService, 
            IXAccountGroupService accountGroupService,
            IHttpContextAccessor httpContextAccessor,
            IChatService chatService,
            IHubContext<Line2uHub> hubContext
            )
        {
            _config = config;
            _hubContext = hubContext;
            _chatService = chatService;
            _service = service;
            var lineConfig = _config.GetSection("LineNotifyConfig");
            _accountService = accountService;
            _authorizeUrl = lineConfig.GetValue<string>("authorizeUrl");
            _tokenUrl = lineConfig.GetValue<string>("tokenUrl");
            _profileUrl = lineConfig.GetValue<string>("profileUrl");
            _clientId = lineConfig.GetValue<string>("client_id");
            _clientSecret = lineConfig.GetValue<string>("client_secret");
            _redirectUri = lineConfig.GetValue<string>("redirect_uri");
            _state = lineConfig.GetValue<string>("state");
            _successUri = lineConfig.GetValue<string>("successUri");
            _authService = authService;
            _accountGroupService = accountGroupService;
            _QRUrl = lineConfig.GetValue<string>("urlLineQr");
            _httpContextAccessor = httpContextAccessor;
        }
        // GET: api/Authorize
        [HttpGet]
        public IActionResult GetAuthorize()
        {
            var uri = Uri.EscapeUriString(
                _authorizeUrl + "?" +
                "response_type=code" +
                "&client_id=" + _clientId +
                "&redirect_uri=" + _redirectUri +
                "&scope=openid" +
                "&state=" + _state
            );
            Response?.Redirect(uri);

            return new EmptyResult();
        }

        // GET: api/Authorize/Callback
        /// <summary>Nhận mã người dùng </summary>
        /// <param name="code">Mã ủy quyền được sử dụng để nhận Mã thông báo truy cập</param>
        /// <param name="state">Để xác minh. Tránh các cuộc tấn công CSRF</param>
        /// <param name="error"> Thông báo lỗi</param>
        /// <param name="errorDescription">Mô tả lỗi </param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> Callback(
            [FromQuery]string code,
            [FromQuery]string state,
            [FromQuery]string error,
            [FromQuery][JsonProperty("error_description")]string errorDescription)
        {
            if (!string.IsNullOrEmpty(error))
                return new JsonResult(new
                {
                    error,
                    state,
                    errorDescription
                });

            //get token 
            var token = await FetchToken(code);
           
            Response.Redirect(_successUri + "?tokenLogin=" + token);

            return new EmptyResult();
        }

        /// <summary>Nhận mã thông báo người dùng</summary>
        /// <param name="code">Mã ủy quyền được sử dụng để nhận Mã thông báo truy cập </param>
        /// <returns></returns>
        private async Task<string> FetchToken(string code)
        {
            using var client = new HttpClient
            {
                Timeout = new TimeSpan(0, 0, 60),
                BaseAddress = new Uri(_tokenUrl)
            };

            var content = new FormUrlEncodedContent(new[]
            {
                    new KeyValuePair<string, string>("grant_type", "authorization_code"),
                    new KeyValuePair<string, string>("code", code),
                    new KeyValuePair<string, string>("redirect_uri", _redirectUri),
                    new KeyValuePair<string, string>("client_id", _clientId),
                    new KeyValuePair<string, string>("client_secret", _clientSecret)
                });
            var response = await client.PostAsync("", content);
            var data = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<JObject>(data)["access_token"].ToString();
        }

        /// <summary>
        /// Get user profile
        /// Gets a user's display name, profile image, and status message.
        /// https://developers.line.me/en/reference/social-api/#get-user-profile
        /// </summary>
        /// <param name="accessToken"></param>
        /// <returns></returns>
        /// 
        [HttpGet]
        public async Task<IActionResult>  GetProfile(string accessToken,string userID)
        {
            //https://www.line2you.com/api/LineBotWebHook

            string token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            var accountId = JWTExtensions.GetDecodeTokenByID(token).ToDecimal();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var response = await httpClient.GetAsync("https://api.line.me/v2/profile");
            var userProfile = JsonConvert.DeserializeObject<Profile>(await response.Content.ReadAsStringAsync());
            // get group-code normal user
            //var group_guid = _accountGroupService.getGuidLineGroupNormal();
            //add new account 
            if(accessToken != "undefined")
            {
                var model = new XAccountDto();
                model.Uid = userProfile.UserId;
                //model.AccountId = accountId;
                model.AccountNo = userProfile.DisplayName;
                model.AccountName = userProfile.DisplayName;
                model.LineID = userProfile.UserId;
                model.LineName = userProfile.DisplayName;
                model.LinePicture = userProfile.PictureUrl;
                model.Upwd = "0000";
                model.IsLineAccount = "1";
                //model.AccountGroup = group_guid;
                //check exist
                var existAccount = await _accountService.CheckExistUsernameLine(userProfile.UserId);
                if (!existAccount.Success)
                {
                    await _accountService.AddFormAsync(model);
                }else
                {
                    await _accountService.UpdateFormAsync(model);
                }
                var result = await _authService.LoginWithlineAccountAsync(userProfile.UserId);
                return StatusCodeResult(result);
            }else
            {
                return Ok(userProfile);
            }
            // after create account -> login
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMessage(string officialID, string userLineID)
        {
            return Ok(await _chatService.GetAllMessage(officialID, userLineID));
            // after create account -> login
        }
        [HttpPost]
        public async Task<IActionResult> AddMessage([FromBody]ChatDto chat)
        {
            var res = await _chatService.AddMessage(chat);
            var result_content = getSignarlRefresh(res.SignarlData);
            
            return Ok(res);
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
        [HttpGet]
        public async Task<IActionResult> GetBotInfo()
        {
            //https://www.line2you.com/api/LineBotWebHook
            string channelAccessTokenMessage = _config.GetSection("LineNotifyConfig").GetSection("channelAccessTokenMessage").Value;
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", channelAccessTokenMessage);
            var response = await httpClient.GetAsync("https://api.line.me/v2/bot/info");
            var userProfile = JsonConvert.DeserializeObject<Profile>(await response.Content.ReadAsStringAsync());
            return Ok(userProfile);
            // after create account -> login
        }
        [HttpGet]
        public async Task<IActionResult> AddOfficialAccount(string userIds, string OfficialAccountLineUserId, string accessToken)
        {
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var response = await httpClient.GetAsync("https://api.line.me/v2/add");
            var userProfile = JsonConvert.DeserializeObject<Profile>(await response.Content.ReadAsStringAsync());

            // get group-code normal user
            //var group_guid = _accountGroupService.getGuidLineGroupNormal();
            //add new account 

            //if (accessToken != "undefined")
            //{
            //    var model = new XAccountDto();
            //    model.Uid = userProfile.UserId;
            //    model.AccountNo = userProfile.DisplayName;
            //    model.AccountName = userProfile.DisplayName;
            //    model.IsLineAccount = "1";
            //    //model.AccountGroup = group_guid;
            //    await _accountService.AddFormAsync(model);
            //    var result = await _authService.LoginWithlineAccountAsync(userProfile.UserId);
            //    return StatusCodeResult(result);
            //}
            //else
            //{
            //    return Ok(userProfile);
            //}
            return Ok();
            // after create account -> login
        }

        [HttpGet]
        public async Task<IActionResult> GetLineQrCodeLink()
        {
            string url = $"{_QRUrl}";
            var data = new Profile
            {
                PictureUrl = _QRUrl
            };
            return Ok(data);
            // after create account -> login
        }


        [HttpGet]
        public async Task<IActionResult> LoginWithlineAccountAgain(string accountID)
        {
            var result = await _authService.LoginWithlineAccountAsync(accountID);
            return StatusCodeResult(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetProfileFake(string accessToken)
        {
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var response = await httpClient.GetAsync("https://api.line.me/v2/profile");
            var userProfile = JsonConvert.DeserializeObject<Profile>(await response.Content.ReadAsStringAsync());
            return Ok(userProfile);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessageFromGPT(string msg)
        {
            string api_key = _config.GetSection("LineNotifyConfig").GetSection("chatGPTKey").Value;
            string apiKey = api_key;
            string response = "";
            OpenAIAPI openai = new OpenAIAPI(apiKey);
            CompletionRequest completion = new CompletionRequest();
            completion.Prompt = msg;
            completion.Model = "text-davinci-003";
            //completion.Model = OpenAI_API.Models.Model.DavinciText;
            completion.MaxTokens = 4000;
            var output = await openai.Completions.CreateCompletionAsync(completion);
            if (output != null)
            {
                foreach (var item in output.Completions)
                {
                    response = item.Text;
                }
                return Ok(response);
            }
            else
            {
                //return response;
                throw new NotImplementedException();
            }
        }

        [HttpPost]
        public async Task<ActionResult> SendFormMessage([FromForm] LineMessageDto model)
        {
            var listUserLine = Request.Form["ListUserLine"];
            if (listUserLine.Count > 0)
            {
                model.ListUserLine.AddRange(listUserLine);
            }
            return Ok(await _service.SendFormMessage(model));
        }


    }
}