using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Evse.DTO;
using Evse.Helpers;
using Evse.Services;
using Syncfusion.JavaScript;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Evse.Controllers
{
    public class ContractController : ApiControllerBase
    {
        private readonly IContractService _service;

        public ContractController(IContractService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllAsync()
        {
            return Ok(await _service.GetAllAsync());
        }
      
        [HttpPost]
        public async Task<ActionResult> AddAsync([FromBody] ContractDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] ContractDto model)
        {
            return StatusCodeResult(await _service.UpdateAsync(model));
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
        public async Task<ActionResult> GetByGuidV2(string guid)
        {
            return Ok(await _service.GetByGuid(guid));
        }
        [HttpPost]
        public async Task<ActionResult> LoadData([FromBody] DataManager request, string lang)
        {

            var data = await _service.LoadData(request, lang);
            return Ok(data);
        }


        [HttpGet]
        public async Task<ActionResult> GetAudit(decimal id)
        {
            return Ok(await _service.GetAudit(id));
        }

         [HttpPost]
        public async Task<ActionResult> GetDataDropdownlist([FromBody] DataManager request)
        {
           
            return Ok(await _service.GetDataDropdownlist(request));
        }
       

    }
}
