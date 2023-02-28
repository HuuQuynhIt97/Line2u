using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Evse.Constants;
using Evse.Data;
using Evse.DTO;
using Evse.Helpers;
using Evse.Models;
using Evse.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Syncfusion.JavaScript;
using Syncfusion.JavaScript.DataSources;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NetUtility;
using System.Text;
using System.Net.Http.Headers;
using Evse.Helpers.Line;
using System.Text.Json.Serialization;
using System.Diagnostics;

namespace Evse.Services
{
    public class MessageParams
    {
        public string Token { get; set; }
        public string Message { get; set; }
        public string StickerPackageId { get; set; }
        public string StickerId { get; set; }
        public string FileUri { get; set; }
        public string Filename { get; set; }
    }
    public interface ILineService
    {
        //Task SendMessage(MessageParams msg);
        //Task<string> FetchToken(string code);
        Task<string> GetMessageFromGPT(string msg);
        Task<OperationResult> SendFormMessage(LineMessageDto model);
    }
    public class LineService : ILineService
    {
        private readonly IConfiguration _config;
        private readonly string _notifyUrl;
        private readonly string _tokenUrl;
        private HttpClient _client;
        private readonly string _clientId;
        private readonly string _clientSecret;
        private readonly string _redirectUri;
        private readonly string _pushMessage;
        private readonly string _pushMessageMulti;
        private readonly string _channelAccessTokenMessage;
        private readonly string _chatGPTKey;
        //private readonly LineUtility _line;

        public LineService(IConfiguration config)
        {
            _client = new HttpClient();
            _config = config;
            var lineConfig = _config.GetSection("LineNotifyConfig");
            _notifyUrl = lineConfig.GetValue<string>("notifyUrl");
            _pushMessage = lineConfig.GetValue<string>("pushMessage");
            _pushMessageMulti = lineConfig.GetValue<string>("pushMessageMulti");
            _tokenUrl = lineConfig.GetValue<string>("notifyLinetokenUrl");
            _clientId = lineConfig.GetValue<string>("notifyClient_id");
            _clientSecret = lineConfig.GetValue<string>("notifyClient_secret");
            _redirectUri = lineConfig.GetValue<string>("notifyRedirect_uri");
            _channelAccessTokenMessage = lineConfig.GetValue<string>("channelAccessTokenMessage");
            _chatGPTKey = lineConfig.GetValue<string>("chatGPTKey");
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _channelAccessTokenMessage);
            //_line = new LineUtility(_notifyUrl, _tokenUrl, _redirectUri, _successUri);
            //_line.OnInit(_clientId, _clientSecret);

        }

        //public async Task SendMessage(MessageParams msg)
        //{
        //    _line.SetToken(msg.Token);
        //    await _line.SendMessageAsync(msg.Message);
        //    _line.SetToken(_secret);
        //    await _line.SendMessageAsync(msg.Message);
        //}

        //public async Task<string> FetchToken(string code)
        //{
        //  return  await _line.FetchTokenAsync("authorization_code", code);
        //}
        public class ChatGPTUsage
        {
            [JsonPropertyName("prompt_tokens")]
            public int PromptTokens
            {
                get;
                set;
            }
            [JsonPropertyName("completion_token")]
            public int CompletionTokens
            {
                get;
                set;
            }
            [JsonPropertyName("total_tokens")]
            public int TotalTokens
            {
                get;
                set;
            }
        }
        [DebuggerDisplay("Text = {Text}")]
        public class ChatGPTChoice
        {
            [JsonPropertyName("text")]
            public string? Text
            {
                get;
                set;
            }
        }
        public class CompletionResponse
        {
            [JsonPropertyName("choices")]
            public List<ChatGPTChoice>? Choices
            {
                get;
                set;
            }
            [JsonPropertyName("usage")]
            public ChatGPTUsage? Usage
            {
                get;
                set;
            }
        }
        public async Task<string> GetMessageFromGPT(string msg)
        {

            string OutPutResult = "";

            var content = new StringContent("{\"model\": \"text-davinci-003\", \"prompt\": \"" + msg + "\",\"temperature\": 1,\"max_tokens\": 100}",
                Encoding.UTF8, "application/json");
            CompletionResponse completionResponse = new CompletionResponse();
            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_chatGPTKey}");
                using (HttpResponseMessage? httpResponse = await httpClient.PostAsync("https://api.openai.com/v1/completions", content))
                {
                    if (httpResponse is not null)
                    {
                        if (httpResponse.IsSuccessStatusCode)
                        {
                            string responseString = await httpResponse.Content.ReadAsStringAsync();
                            {
                                if (!string.IsNullOrWhiteSpace(responseString))
                                {
                                    completionResponse = JsonConvert.DeserializeObject<CompletionResponse>(responseString);
                                }
                            }
                        }
                    }
                    if (completionResponse is not null)
                    {
                        string? completionText = completionResponse.Choices?[0]?.Text;
                        httpClient.DefaultRequestHeaders.ConnectionClose = true;
                        return completionText;
                        //Console.WriteLine(completionText);
                    }
                }

            }
            return OutPutResult.Trim();

            //string apiKey = _chatGPTKey;
            //string response = "";
            //OpenAIAPI openai = new OpenAIAPI(apiKey);
            //CompletionRequest completion = new CompletionRequest();
            //completion.Prompt = msg;
            //completion.Model = "text-davinci-003";
            ////completion.Model = OpenAI_API.Models.Model.DavinciText;
            //completion.MaxTokens = 4000;
            //var output = await openai.Completions.CreateCompletionAsync(completion);
            //if (output != null)
            //{
            //    foreach (var item in output.Completions)
            //    {
            //        response = item.Text;
            //    }
            //    return response;
            //}
            //else
            //{
            //    return response;
            //}
            //throw new NotImplementedException();
        }
        public virtual async Task MultiCastMessageWithJsonAsync(IList<string> to, string messages)
        {
            //_client.DefaultRequestHeaders.Add("Authorization", "Bearer " + _channelAccessTokenMessage);
            var request = new HttpRequestMessage(HttpMethod.Post, _pushMessageMulti);
            var json =
            $@"{{ 
                ""to"" : [{string.Join(", ", to.Select(x => "\"" + x + "\""))}], 
                ""messages"" : [
                {{
                    ""type"":""text"",
                    ""text"":""{messages}""
                }}] 
            }}";

            request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.SendAsync(request).ConfigureAwait(false);
            await response.EnsureSuccessStatusCodeAsync().ConfigureAwait(false);
        }
        public async Task<OperationResult> SendFormMessage(LineMessageDto model)
        {
            var list_token = model.ListUserLine.Select(o => o.ToString()).ToList();
            if (list_token.Count > 0)
            {

                await MultiCastMessageWithJsonAsync(list_token, model.Content);
                //await SendPushMessage(list_token, model.Content);
                //await SendPushMessage(new MessageParams { Message = model.Content, Token = list_token.First() });
            }

            var operationResult = new OperationResult
            {
                StatusCode = HttpStatusCode.OK,
                Message = MessageReponse.AddSuccess,
                Success = true
            };
            return operationResult;
        }
    }
}