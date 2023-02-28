using Evse.Models.Interface;
using System;

namespace Evse.Models.Abstracts
{
    public abstract class AuditEntity: IDateTracking
    {
        public bool? Status { get; set; }

        public int CreateBy { get; set; }
        public int? UpdateBy { get; set; }
        public int? DeleteBy { get; set; }

        public DateTime CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public DateTime? DeleteDate { get; set; }
    
    }
}
