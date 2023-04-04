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
    public class LinePayController : ApiControllerBase
    {
        readonly IConfiguration _config;
        static private HttpClient _httpClient;
        private readonly ILinePayService _linePayService;
        
        private HttpClient httpClient
        {
            get
            {
                if (_httpClient == null)
                    _httpClient = new HttpClient();

                return _httpClient;
            }
        }


        public LinePayController(
            IConfiguration config, 
            ILinePayService linePayService
          
            )
        {
            _config = config;
            _linePayService = linePayService;
        }


        [HttpPost]
        public async Task<PaymentResponseDto> Create(PaymentRequestDto dto)
        {
            return await _linePayService.SendPaymentRequest(dto);
        }

        [HttpPost]
        public async Task<PaymentConfirmResponseDto> Confirm([FromQuery] string transactionId, [FromQuery] string orderId, PaymentConfirmDto dto)
        {
            return await _linePayService.ConfirmPayment(transactionId, orderId, dto);
        }

        //[HttpGet("CheckRegKey/{regKey}")]
        //public async Task<PaymentConfirmResponseDto> CheckRegKey(string regKey)
        //{
        //    return await _linePayService.CheckRegKey(regKey);
        //}

        //[HttpPost("PayPreapproved/{regKey}")]
        //public async Task<PaymentConfirmResponseDto> PayPreapproved([FromRoute] string regKey, PayPreapprovedDto dto)
        //{
        //    return await _linePayService.PayPreapproved(regKey, dto);
        //}

        //[HttpPost("ExpireRegKey/{regKey}")]
        //public async Task<PaymentConfirmResponseDto> ExpireRegKey(string regKey)
        //{
        //    return await _linePayService.ExpireRegKey(regKey);
        //}

        //[HttpGet("Cancel")]
        //public async void CancelTransaction([FromQuery] string transactionId)
        //{
        //    _linePayService.TransactionCancel(transactionId);
        //}




    }
}