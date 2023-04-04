using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Line2u.Constants;
using Line2u.Data;
using Line2u.DTO;
using Line2u.Helpers;
using Line2u.Models;
using Line2u.Services.Base;
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
using Line2u.Helpers.Line;
using System.Text.Json.Serialization;
using System.Diagnostics;
using Line2u.Providers;
using isRock.MsQnAMaker;
using System.Threading.Channels;

namespace Line2u.Services
{
    
    public interface ILinePayService
    {
      
        Task<PaymentResponseDto> SendPaymentRequest(PaymentRequestDto dto);
        Task<PaymentConfirmResponseDto> ConfirmPayment(string transactionId, string orderId, PaymentConfirmDto dto);

    }
    public class LinePayService : ILinePayService
    {
        private readonly IConfiguration _config;
        private readonly string _baseAddress;
        private readonly string _channelId;
        private readonly string _channelSecret;
        private readonly string _confirmUrl;
        private readonly JsonProvider _jsonProvider;
        private HttpClient _client;
        //private readonly LineUtility _line;

        public LinePayService(IConfiguration config)
        {
            _client = new HttpClient();
            _config = config;
            _jsonProvider = new JsonProvider();
            var lineConfig = _config.GetSection("LinePay");
            _baseAddress = lineConfig.GetValue<string>("BaseAddress");
            _channelId = lineConfig.GetValue<string>("ChannelId");
            _channelSecret = lineConfig.GetValue<string>("ChannelSecret");
            _confirmUrl = lineConfig.GetValue<string>("ConfirmUrl");

        }



      
        public async Task<PaymentResponseDto> SendPaymentRequest(PaymentRequestDto dto)
        {

            //dto.Packages.Add
            //(
            //    new PackageDto { Id = Guid.NewGuid().ToString(), Amount = 100, Products = dto.Products }
            //);

            dto.RedirectUrls.ConfirmUrl = _confirmUrl;
            dto.RedirectUrls.CancelUrl = "https://localhost:58/api/LinePay/cancel";

            var json = _jsonProvider.Serialize(dto);
            // 產生 GUID Nonce
            var nonce = Guid.NewGuid().ToString();
            // 要放入 signature 中的 requestUrl
            var requestUrl = "/v3/payments/request";

            //使用 channelSecretKey & requestUrl & jsonBody & nonce 做簽章
            var signature = SignatureProvider.HMACSHA256(_channelSecret, _channelSecret + requestUrl + json + nonce);

            var request = new HttpRequestMessage(HttpMethod.Post, _baseAddress + requestUrl)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
            // 帶入 Headers
            _client.DefaultRequestHeaders.Add("X-LINE-ChannelId", _channelId);
            _client.DefaultRequestHeaders.Add("X-LINE-Authorization-Nonce", nonce);
            _client.DefaultRequestHeaders.Add("X-LINE-Authorization", signature);

            var response = await _client.SendAsync(request);
            var linePayResponse = _jsonProvider.Deserialize<PaymentResponseDto>(await response.Content.ReadAsStringAsync());

            Console.WriteLine(nonce);
            Console.WriteLine(signature);

            return linePayResponse;
        }

        public async Task<PaymentConfirmResponseDto> ConfirmPayment(string transactionId, string orderId, PaymentConfirmDto dto)
        {
            var json = _jsonProvider.Serialize(dto);

            var nonce = Guid.NewGuid().ToString();
            var requestUrl = string.Format("/v3/payments/{0}/confirm", transactionId);
            var signature = SignatureProvider.HMACSHA256(_channelSecret, _channelSecret + requestUrl + json + nonce);

            var request = new HttpRequestMessage(HttpMethod.Post, String.Format(_baseAddress + requestUrl, transactionId))
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            _client.DefaultRequestHeaders.Add("X-LINE-ChannelId", _channelId);
            _client.DefaultRequestHeaders.Add("X-LINE-Authorization-Nonce", nonce);
            _client.DefaultRequestHeaders.Add("X-LINE-Authorization", signature);

            var response = await _client.SendAsync(request);
            var responseDto = _jsonProvider.Deserialize<PaymentConfirmResponseDto>(await response.Content.ReadAsStringAsync());
            return responseDto;
        }
    }
}