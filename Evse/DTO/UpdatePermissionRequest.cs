using System.Collections.Generic;


namespace Evse.DTO
{
    public class UpdatePermissionRequest
    {
        public List<PermissionDto> Permissions { get; set; } = new List<PermissionDto>();
    }
}
