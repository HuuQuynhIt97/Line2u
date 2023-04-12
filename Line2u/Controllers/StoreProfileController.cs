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
        public async Task<ActionResult> GetMultiUserAccessStore(int accountId, int storeId)
        {
            return Ok(await _service.GetMultiUserAccessStore(accountId, storeId));
        }
        [HttpGet]
        public async Task<ActionResult> GetAll(int start)
        {
            return Ok(await _service.GetAll(start));
        }

        [HttpGet]
        public async Task<ActionResult> GetAllAccountAccess()
        {
            return Ok(await _service.GetAllAccountAccess());
        }

        [HttpGet]
        public async Task<ActionResult> GetAllCounty()
        {
            return Ok(await _service.GetAllCounty());
        }

        [HttpGet]
        public async Task<ActionResult> GetAllTowship()
        {
            return Ok(await _service.GetAllTowship());
        }

        [HttpGet]
        public async Task<ActionResult> GetTowshipByCounty(string CountyID)
        {
            return Ok(await _service.GetTowshipByCounty(CountyID));
        }

        [HttpGet]
        public async Task<ActionResult> GetAllStoreByCountyAndTownShip(string countyID, string townShipID, int star)
        {
            return Ok(await _service.GetAllStoreByCountyAndTownShip(countyID, townShipID, star));
        }
        [HttpPost]
        public async Task<ActionResult> AddAsync([FromBody] StoreProfilesDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddStoreTable([FromBody] StoreTableDto model)
        {
            return StatusCodeResult(await _service.AddTable(model));
        }

        [HttpPost]
        public async Task<ActionResult> UpdateStoreTable([FromBody] StoreTableDto model)
        {
            return StatusCodeResult(await _service.UpdateStoreTable(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddRatingComment([FromBody] StoreRatingCommentDto model)
        {
            return StatusCodeResult(await _service.AddRatingComment(model));
        }

        [HttpGet]
        public async Task<ActionResult> GetRatingAndComment(string storeGuid)
        {
            return Ok(await _service.GetRatingAndComment(storeGuid));
        }


        [HttpGet]
        public async Task<ActionResult> GetAllStoreTable(int storeId)
        {
            return Ok(await _service.GetAllStoreTable(storeId));
        }
        [HttpGet]
        public async Task<ActionResult> CheckRatingAndComment(string storeGuid,int userId)
        {
            return Ok(await _service.CheckRatingAndComment(storeGuid, userId));
        }
        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] StoreProfilesDto model)
        {
            return StatusCodeResult(await _service.UpdateAsync(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddFormAsync([FromForm] StoreProfilesDto model)
        {
            //var multiStore = Request.Form["MultiStores"];
            //model.MultiStores.AddRange(multiStore);
            return Ok(await _service.AddFormAsync(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddFormAdmin([FromForm] StoreProfilesDto model)
        {
            var multiStore = Request.Form["MultiStores"];
            model.MultiStores.AddRange(multiStore);
            return Ok(await _service.AddFormAdmin(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFormAsync([FromForm] StoreProfilesDto model)
        {
            
            return Ok(await _service.UpdateFormAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFormMobileAsync([FromForm] StoreProfilesDto model)
        {
            var multiStore = Request.Form["MultiStores"];
            model.MultiStores.AddRange(multiStore);
            return Ok(await _service.UpdateFormMobileAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFormAdmin([FromForm] StoreProfilesDto model)
        {
            var multiStore = Request.Form["MultiStores"];
            model.MultiStores.AddRange(multiStore);
            return Ok(await _service.UpdateFormAdmin(model));
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
        public async Task<ActionResult> DeleteUploadFile([FromQuery] decimal key)
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
