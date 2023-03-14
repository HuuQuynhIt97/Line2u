using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Line2u.DTO;
using Line2u.Helpers;
using Line2u.Services;
using Syncfusion.JavaScript;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Line2u.Controllers
{
    public class StoreProfileController : ApiControllerBase
    {
        private readonly IStoreProfileService _service;

        public StoreProfileController(IStoreProfileService service)
        {
            _service = service;
        }


        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            return Ok(await _service.GetAll());
        }
        [HttpPost]
        public async Task<ActionResult> AddAsync([FromBody] StoreProfilesDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] StoreProfilesDto model)
        {
            return StatusCodeResult(await _service.UpdateAsync(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddFormAsync([FromForm] StoreProfilesDto model)
        {
            return Ok(await _service.AddFormAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFormAsync([FromForm] StoreProfilesDto model)
        {
            return Ok(await _service.UpdateFormAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFormMobileAsync([FromForm] StoreProfilesDto model)
        {
            return Ok(await _service.UpdateFormMobileAsync(model));
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
        public async Task<ActionResult> GetWithGuidAsync(string guid)
        {
            return Ok(await _service.GetByIDWithGuidAsync(guid));
        }

        [HttpGet]
        public async Task<ActionResult> GetInforByStoreName(string name)
        {
            return Ok(await _service.GetInforByStoreName(name));
        }

        [HttpGet]
        public async Task<ActionResult> GetWithPaginationsAsync(PaginationParams paramater)
        {
            return Ok(await _service.GetWithPaginationsAsync(paramater));
        }
        [HttpPost]
        public async Task<ActionResult> DeleteUploadFile([FromForm] decimal key)
        {
            return Ok(await _service.DeleteUploadFile(key));
        }

         [HttpPost]
        public async Task<ActionResult> UploadAvatarForMobile(IFormFile file, [FromQuery] decimal key)
        {
            return Ok(await _service.UploadAvatarForMobile(file, key));
        }
    


         [HttpPost]
        public async Task<ActionResult> GetDataDropdownlist([FromBody] DataManager request)
        {
           
            return Ok(await _service.GetDataDropdownlist(request));
        }
        

    }
}
