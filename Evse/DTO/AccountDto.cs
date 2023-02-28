using Microsoft.AspNetCore.Http;
using Evse.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Evse.DTO
{
    public class AccountDto
    {
        public decimal Id { get; set; }
        public string HallGuid { get; set; }
        public string Uid { get; set; }
        public string Upwd { get; set; }
        public string AccountNo { get; set; }
        public string AccountName { get; set; }
        public string AccountRfid { get; set; }
        public string AccountRole { get; set; }
        public string AccountLevel { get; set; }
        public string AccountGroup { get; set; }
        public string LicensePath { get; set; }
        public string PhotoPath { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? Lastlogin { get; set; }
        public DateTime? Lastuse { get; set; }
        public string Comment { get; set; }
        public DateTime? CreateDate { get; set; }
        public decimal? CreateBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public decimal? UpdateBy { get; set; }
        public DateTime? DeleteDate { get; set; }
        public decimal? DeleteBy { get; set; }
        public decimal? Status { get; set; }
        public string Guid { get; set; }
        public string PageSizeSetting { get; set; }
        public List<IFormFile> File { get; set; }
    }
    public class UploadAvatarRequest
    {
        public IFormFile File { get; set; }
        public decimal Key { get; set; }

    }
    public class ChangePasswordDto
    {
        public decimal ID { get; set; }
        public string Upwd { get; set; }
    }
    public class XChangePasswordDto
    {
        public decimal ID { get; set; }
        public string Upwd { get; set; }
        public string OldPassword { get; set; }
    }
    public class AccountLoginDto
    {
        public decimal ID { get; set; }

        public string Username { get; set; }
        public string Password { get; set; }

        public string FullName { get; set; }

        public string GroupCode { get; set; }

    }
}
