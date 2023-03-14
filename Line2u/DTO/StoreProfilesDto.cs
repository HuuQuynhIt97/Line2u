
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
        public string StoreAddress { get; set; }
        public string StoreOpenTime { get; set; }
        public string StoreCloseTime { get; set; }
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
        public List<IFormFile> File { get; set; }

    }
}
