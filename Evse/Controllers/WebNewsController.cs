using Microsoft.AspNetCore.Mvc;
using Evse.DTO;
using Evse.Helpers;
using Evse.Services;
using Syncfusion.JavaScript;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Evse.Controllers
{
    public class WebNewsController : ApiControllerBase
    {
        private readonly IWebNewsService _service;

        public WebNewsController(IWebNewsService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult> GetWebNews()
        {
            return Ok(await _service.GetWebNews());
        }
        [HttpGet]
        public async Task<ActionResult> GetWebPages()
        {
            return Ok(await _service.GetWebPages());
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
        public async Task<ActionResult> AddAsync([FromBody] WebNewsDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] WebNewsDto model)
        {
            return StatusCodeResult(await _service.UpdateAsync(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddFormAsync([FromForm] WebNewsDto model)
        {
            return Ok(await _service.AddFormAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFormAsync([FromForm] WebNewsDto model)
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

        [HttpGet]
        public async Task<ActionResult> GetAudit(decimal id)
        {
            return Ok(await _service.GetAudit(id));
        }
        [HttpGet]
        public async Task<ActionResult> GetByGuid(string guid)
        {
            return Ok(await _service.GetByGuid(guid));
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> LoadData([FromBody] DataManager request, string lang)
        {

            var data = await _service.LoadData(request, lang);
            return Ok(data);
        }
    }
}
