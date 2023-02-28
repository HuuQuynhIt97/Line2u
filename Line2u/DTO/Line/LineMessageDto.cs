
using Line2u.Models.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Line2u.DTO
{
    public class LineMessageDto
    {
        public string Content { get; set; }
        public List<object> ListUserLine { get; set; }
    }
}
