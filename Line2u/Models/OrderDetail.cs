﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Line2u.Models
{
    public partial class OrderDetail
    {
        public decimal? Price { get; set; }
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
        public string OrderGuid { get; set; }
        public string ProductGuid { get; set; }
        public string StoreGuid { get; set; }
    }
}