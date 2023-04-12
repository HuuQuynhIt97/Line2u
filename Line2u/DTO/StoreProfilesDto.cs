
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Line2u.DTO
{
    public class StoreProfilesDto
    {
        public decimal Id { get; set; }
        public string StoreName { get; set; }
        public string CreateName { get; set; }
        public string StoreAddress { get; set; }
        public string StoreOpenTime { get; set; }
        public string StoreCloseTime { get; set; }
        public string StoreTel { get; set; }
        public string StoreEmail { get; set; }
        public string Facebook { get; set; }
        public string Twitter { get; set; }
        public string Instagram { get; set; }
        public string Pinterest { get; set; }
        public string Youtube { get; set; }
        public string StoreLowPrice { get; set; }
        public string StoreHightPrice { get; set; }
        public string Body { get; set; }
        public string PhotoPath { get; set; }
        public string Comment { get; set; }
        public string CancelFlag { get; set; }
        public DateTime? CreateDate { get; set; }
        public decimal? CreateBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public decimal? UpdateBy { get; set; }
        public decimal? Status { get; set; }
        public string Guid { get; set; }
        public string AccountGuid { get; set; }
        public string TownShipId { get; set; }
        public string CountyId { get; set; }
        public int RatingAVG { get; set; }
        public int RatingCount { get; set; }
        public object bannerList { get; set; }
        public List<IFormFile> File { get; set; }
        public List<object> MultiStores { get; set; }

    }
}
