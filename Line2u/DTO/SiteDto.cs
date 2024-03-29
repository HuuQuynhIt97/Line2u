﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Line2u.DTO
{
    public partial class SiteDto
    {
        public decimal Id { get; set; }
        public string Type { get; set; }
        public string SiteNo { get; set; }
        public string SiteName { get; set; }
        public string SitePrincipal { get; set; }
        public string SiteTel { get; set; }
        public string SiteAddress { get; set; }
        public string SiteLocation { get; set; }
        public string SitePhoto { get; set; }
        public string Comment { get; set; }
        public DateTime? CreateDate { get; set; }
        public decimal? CreateBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public decimal? UpdateBy { get; set; }
        public DateTime? DeleteDate { get; set; }
        public decimal? DeleteBy { get; set; }
        public decimal? Status { get; set; }
        public string Guid { get; set; }
        public string TypeName { get; set; }
        public string SiteLocationName { get; set; }

        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public string LandlordGuid { get; set; }
        public List<IFormFile> File { get; set; }
    }
}