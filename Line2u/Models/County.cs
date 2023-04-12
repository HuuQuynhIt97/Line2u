﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Line2u.Models
{
    public partial class County
    {
        /// <summary>
        /// 縣市代號
        /// </summary>
        public string CountyId { get; set; }
        /// <summary>
        /// 縣市名稱
        /// </summary>
        public string CountyName { get; set; }
        /// <summary>
        /// 備註
        /// </summary>
        public string Cmt { get; set; }
        /// <summary>
        /// 刪除旗標；Y -刪除,N - 未刪除
        /// </summary>
        public string CancelFlag { get; set; }
        /// <summary>
        /// 建立日期
        /// </summary>
        public DateTime? CreateDate { get; set; }
        /// <summary>
        ///  建立人員
        /// </summary>
        public decimal? CreateBy { get; set; }
        /// <summary>
        ///  更新日期
        /// </summary>
        public DateTime? UpdateDate { get; set; }
        /// <summary>
        ///  更新人員
        /// </summary>
        public decimal? UpdateBy { get; set; }
        public decimal? SigningId { get; set; }
        /// <summary>
        /// 舊縣市名稱
        /// </summary>
        public string CountyNameOld { get; set; }
    }
}