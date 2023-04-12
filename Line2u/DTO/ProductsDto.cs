﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Line2u.DTO
{
    public partial class ProductsDto
    {
        public decimal Id { get; set; }
        public string ProductName { get; set; }
        public string CategoryGuid { get; set; }
        public string ProductDescription { get; set; }
        public string ProductPrice { get; set; }
        public string ProductPriceDiscount { get; set; }
        public string PhotoPath { get; set; }
        public string Body { get; set; }
        public string Comment { get; set; }
        public int? Quantity { get; set; }
        public DateTime? CreateDate { get; set; }
        public decimal? CreateBy { get; set; }
        public decimal? StoreId { get; set; }
        public DateTime? UpdateDate { get; set; }
        public decimal? UpdateBy { get; set; }
        public decimal? Status { get; set; }
        public string Guid { get; set; }
        public string ProductGuid { get; set; }
        public string Delivery { get; set; }
        public string accountUid { get; set; }
        public string storeGuid { get; set; }
        public List<IFormFile> File { get; set; }
    }
}