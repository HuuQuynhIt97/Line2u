
using Microsoft.AspNetCore.Mvc;
using Line2u.DTO;

namespace Line2u.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ApiControllerBase: ControllerBase
    {
        [NonAction] //Set not Tracking http method
        public ObjectResult StatusCodeResult(OperationResult result)
        {
            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return StatusCode((int)result.StatusCode, result.Message);
            }
        }
    }
}
