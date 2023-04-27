using Microsoft.AspNetCore.Mvc;
using Line2u.DTO;
using Line2u.Helpers;
using Line2u.Services;
using Syncfusion.JavaScript;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using static Line2u.DTO.ProductsDto;

namespace Line2u.Controllers
{
    public class ProductsController : ApiControllerBase
    {
        private readonly IProductsService _service;

        public ProductsController(IProductsService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult> GetWebNews()
        {
            return Ok(await _service.GetWebNews());
        }
        [HttpGet]
        public async Task<ActionResult> GetProducts(string id, string cusGuid, int storeId)
        {
            return Ok(await _service.GetProducts(id, cusGuid, storeId));
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
        public async Task<ActionResult> AddAsync([FromBody] ProductsDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] ProductsDto model)
        {
            return StatusCodeResult(await _service.UpdateAsync(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddFormAsync([FromForm] ProductsDto model)
        {

            var producSize = Request.Form["ProductSize"];
           
            //model.ProductSize.AddRange(producSize);

            var producOption = Request.Form["ProductOption"];
            //model.ProductSize.AddRange(producOption);

            return Ok(await _service.AddFormAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFormAsync([FromForm] ProductsDto model)
        {

            var producSize = Request.Form["ProductSize"];
            
            //model.ProductSize.AddRange(producSize);

            var producOption = Request.Form["ProductOption"];
            //model.ProductOption.AddRange(producOption);

            return Ok(await _service.UpdateFormAsync(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddSize(List<ProductSizeModel> model)
        {

            return Ok(await _service.AddSize(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddOption(List<ProductOptionModel> model)
        {

            return Ok(await _service.AddOption(model));
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
        public async Task<ActionResult> LoadData([FromBody] DataManager request, string lang,string uid)
        {

            var data = await _service.LoadData(request, lang, uid);
            return Ok(data);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> LoadDataAdmin([FromBody] DataManager request, string lang, string uid,int storeId)
        {

            var data = await _service.LoadDataAdmin(request, lang, uid,storeId);
            return Ok(data);
        }
    }
}
