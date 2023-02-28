using Microsoft.AspNetCore.Mvc;
using Evse.DTO;
using Evse.Helpers;
using Evse.Services;
using Syncfusion.JavaScript;
using System.Threading.Tasks;

namespace Evse.Controllers
{
    public class EngineerController : ApiControllerBase
    {
        private readonly IEngineerService _service;

        public EngineerController(IEngineerService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllAsync()
        {
            return Ok(await _service.GetAllAsync());
        }
        [HttpPost]
        public async Task<ActionResult> DeleteUploadFile([FromForm] decimal key)
        {
            return Ok(await _service.DeleteUploadFile(key));
        }
        [HttpPost]
        public async Task<ActionResult> AddAsync([FromBody] EngineerDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] EngineerDto model)
        {
            return StatusCodeResult(await _service.UpdateAsync(model));
        }

    [HttpPost]
        public async Task<ActionResult> AddFormAsync([FromForm] EngineerDto model)
        {
            return Ok(await _service.AddFormAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFormAsync([FromForm] EngineerDto model)
        {
            return Ok(await _service.UpdateFormAsync(model));
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteAsync(decimal id)
        {
            return StatusCodeResult(await _service.DeleteAsync(id));
        }

        [HttpGet]
        public async Task<ActionResult> GetByIDAsync(decimal id)
        {
            return Ok(await _service.GetByIDAsync(id));
        }

        [HttpGet]
        public async Task<ActionResult> GetWithPaginationsAsync(PaginationParams paramater)
        {
            return Ok(await _service.GetWithPaginationsAsync(paramater));
        }
        [HttpPost]
        public async Task<ActionResult> LoadData([FromBody] DataManager request, string lang)
        {

            var data = await _service.LoadData(request, lang);
            return Ok(data);
        }
        [HttpGet]
        public async Task<ActionResult> GetByGuid(string guid)
        {
            return Ok(await _service.GetByGuid(guid));
        }
        [HttpGet]
        public async Task<ActionResult> GetAudit(decimal id)
        {
            return Ok(await _service.GetAudit(id));
        }
    }
}
