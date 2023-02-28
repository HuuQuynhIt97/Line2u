using System.Collections.Generic;


namespace Line2u.DTO
{
    public class UpdatePermissionRequest
    {
        public List<PermissionDto> Permissions { get; set; } = new List<PermissionDto>();
    }
}
