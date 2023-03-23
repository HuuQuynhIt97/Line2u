using Microsoft.AspNetCore.Mvc;
using Line2u.DTO;
using Line2u.Helpers;
using Line2u.Services;
using Syncfusion.JavaScript;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Line2u.Controllers
{
    public class CartController : ApiControllerBase
    {
        private readonly ICartService _service;

        public CartController(ICartService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult> GetWebNews()
        {
            return Ok(await _service.GetWebNews());
        }
        [HttpGet]
        public async Task<ActionResult> GetProducts(string id)
        {
            return Ok(await _service.GetProducts(id));
        }

        [HttpGet]
        public async Task<ActionResult> GetProductsInCart(string accountGuid)
        {
            return Ok(await _service.GetProductsInCart(accountGuid));
        }

        [HttpGet]
        public async Task<ActionResult> CartAmountTotal(string accountGuid)
        {
            return Ok(await _service.CartAmountTotal(accountGuid));
        }

        [HttpGet]
        public async Task<ActionResult> CartCountTotal(string accountGuid)
        {
            return Ok(await _service.CartCountTotal(accountGuid));
        }

        [HttpGet]
        public async Task<ActionResult> GetTrackingOrderUser(int id)
        {
            return Ok(await _service.GetTrackingOrderUser(id));
        }

        [HttpGet]
        public async Task<ActionResult> GetTrackingOrderForStore(string id)
        {
            return Ok(await _service.GetTrackingOrderForStore(id));
        }
        [HttpGet]
        public async Task<ActionResult> GetDetailOrder(string id)
        {
            return Ok(await _service.GetDetailOrder(id));
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
        public async Task<ActionResult> AddAsync([FromBody] CartDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] CartDto model)
        {
            return StatusCodeResult(await _service.UpdateAsync(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddFormAsync([FromForm] CartDto model)
        {
            //var products = Request.Form["Products"];
            //model.Products.AddRange(products);
            return Ok(await _service.AddFormAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFormAsync([FromForm] CartDto model)
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
        public async Task<ActionResult> LoadData([FromBody] DataManager request, string lang,string uid)
        {

            var data = await _service.LoadData(request, lang, uid);
            return Ok(data);
        }
    }
}
