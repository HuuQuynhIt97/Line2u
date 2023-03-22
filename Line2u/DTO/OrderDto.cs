﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using Line2u.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Line2u.DTO
{
    public partial class OrderDto
    {
        public decimal? TotalPrice { get; set; }
        public bool? IsDelete { get; set; }
        public string FullName { get; set; }
        public bool ByingStatus { get; set; }
        public bool CompleteStatus { get; set; }
        public bool PendingStatus { get; set; }
        public decimal Id { get; set; }
        public DateTime? CreateDate { get; set; }
        public decimal? CreateBy { get; set; }
        public int? Quantity { get; set; }
        public DateTime? UpdateDate { get; set; }
        public decimal? UpdateBy { get; set; }
        public decimal? Status { get; set; }
        public string Guid { get; set; }
        public string AccountId { get; set; }
        public string ProductGuid { get; set; }
        public string StoreGuid { get; set; }
        public string CustomerAdress { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerEmail { get; set; }
        public string PaymentType { get; set; }
        public string IsPayment { get; set; }
        public string Delivery { get; set; }

        public List<ProductsDto> Products { get; set; }

    }
}