using Microsoft.AspNetCore.Mvc;
using Line2u.DTO;
using Line2u.Helpers;
using Line2u.Services;
using Syncfusion.JavaScript;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Line2u.Controllers
{
    public class WebBannerUserController : ApiControllerBase
    {
        private readonly IWebBannerUserService _service;

        public WebBannerUserController(IWebBannerUserService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult> GetWebBanners()
        {
            return Ok(await _service.GetWebBanners());
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
        public async Task<ActionResult> AddAsync([FromBody] WebBannerUserDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] WebBannerUserDto model)
        {
            return StatusCodeResult(await _service.UpdateAsync(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddFormAsync([FromForm] WebBannerUserDto model)
        {
            return Ok(await _service.AddFormAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFormAsync([FromForm] WebBannerUserDto model)
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

        [HttpGet]
        public async Task<ActionResult> GetByUserID(int userID)
        {
            return Ok(await _service.GetByUserID(userID));
        }


        [HttpGet]
        public async Task<ActionResult> GetByStoreId(int storeId)
        {
            return Ok(await _service.GetByStoreId(storeId));
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> LoadData([FromBody] DataManager request, string lang,int userID)
        {

            var data = await _service.LoadData(request, lang, userID);
            return Ok(data);
        }
    }
}
