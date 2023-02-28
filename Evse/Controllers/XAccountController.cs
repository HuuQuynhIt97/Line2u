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
    public class XAccountController : ApiControllerBase
    {
        private readonly IXAccountService _service;

        public XAccountController(IXAccountService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult> GetXAccountsToSendMessage()
        {
            return Ok(await _service.GetXAccountsToSendMessage());
        }
        [HttpGet]
        public async Task<ActionResult> GetAllAsync()
        {
            return Ok(await _service.GetAllAsync());
        }
        [HttpGet]
        public async Task<ActionResult> GetXAccounts()
        {
            return Ok(await _service.GetXAccounts());
        }

        [HttpPost]
        public async Task<ActionResult> AddAsync([FromBody] XAccountDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] XAccountDto model)
        {
            return StatusCodeResult(await _service.UpdateAsync(model));
        }

        [HttpPost]
        public async Task<ActionResult> AddFormAsync([FromForm] XAccountDto model)
        {
            return Ok(await _service.AddFormAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFormAsync([FromForm] XAccountDto model)
        {
            return Ok(await _service.UpdateFormAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> LockAsync(decimal id)
        {
            return StatusCodeResult(await _service.LockAsync(id));
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
        public async Task<ActionResult> DeleteUploadFile([FromForm] decimal key)
        {
            return Ok(await _service.DeleteUploadFile(key));
        }
        [HttpPost]
        public async Task<ActionResult> UploadAvatar([FromQuery] decimal key)
        {
            return Ok(await _service.UploadAvatar(key));
        }

         [HttpPost]
        public async Task<ActionResult> UploadAvatarForMobile(IFormFile file, [FromQuery] decimal key)
        {
            return Ok(await _service.UploadAvatarForMobile(file, key));
        }
        [HttpPost]
        public async Task<ActionResult> ShowPassword([FromForm] decimal key)
        {
            return Ok(await _service.ShowPassword(key));
        }

        [HttpPut]
        public async Task<ActionResult> ChangePassword(XChangePasswordDto changePassword)
        {
            return Ok(await _service.ChangePassword(changePassword));
        }
        [HttpPost]
        public async Task<ActionResult> StorePermission([FromBody] StorePermissionDto model)
        {
            return Ok(await _service.StorePermission(model));
        }
        [HttpGet]
        public async Task<ActionResult> GetPermissionsDropdown(string lang, string accountGuid)
        {
            return Ok(await _service.GetPermissionsDropdown(accountGuid, lang));
        }

        [HttpGet]
        public async Task<ActionResult> GetPermissions(string lang, string accountGuid)
        {
            return Ok(await _service.GetPermissions(accountGuid, lang));
        }
        [HttpGet]
        public async Task<ActionResult> GetProfile(string key)
        {
            return Ok(await _service.GetProfile(key));
        }
        [HttpPut]
        public async Task<ActionResult> StoreProfile([FromBody] StoreProfileDto model)
        {
            return Ok(await _service.StoreProfile(model));
        }
        [HttpPost]
        public async Task<ActionResult> LoadData([FromBody] DataManager request, string farmGuid, string lang)
        {

            var data = await _service.LoadData(request, farmGuid, lang);
            return Ok(data);
        }


        [HttpGet]
        public async Task<ActionResult> GetRejectsByAcceptance(string farmGuid)
        {

            var data = await _service.GetRejectsByAcceptance(farmGuid);
            return Ok(data);
        }

        [HttpGet]
        public async Task<ActionResult> GetRejectsByRequisition(string farmGuid)
        {

            var data = await _service.GetRejectsByRequisition(farmGuid);
            return Ok(data);
        }

        [HttpGet]
        public async Task<ActionResult> GetRejectsByRepair(string farmGuid)
        {

            var data = await _service.GetRejectsByRepair(farmGuid);
            return Ok(data);
        }

        [HttpGet]
        public async Task<ActionResult> GetRejectsBySalesOrder(string farmGuid)
        {

            var data = await _service.GetRejectsBySalesOrder(farmGuid);
            return Ok(data);
        }

        [HttpGet]
        public async Task<ActionResult> GetRejectsByPigDisease(string farmGuid)
        {

            var data = await _service.GetRejectsByPigDisease(farmGuid);
            return Ok(data);
        }

        [HttpGet]
        public async Task<ActionResult> GetApproveByPigDisease(string farmGuid)
        {

            var data = await _service.GetApproveByPigDisease(farmGuid);
            return Ok(data);
        }

        [HttpGet]
        public async Task<ActionResult> GetRecordByPigDisease(string farmGuid)
        {

            var data = await _service.GetRecordByPigDisease(farmGuid);
            return Ok(data);
        }
        [HttpGet]
        public async Task<ActionResult> GetXAccountsForDropdown(string farmGuid)
        {

            var data = await _service.GetXAccountsForDropdown(farmGuid);
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
        [HttpGet]
        public async Task<IActionResult> UpdateTokenLine(string token, decimal id)
        {
            return Ok(await _service.UpdateTokenLine(token, id));
        }
        [HttpGet]
        public async Task<IActionResult> RemoveTokenLine(decimal id)
        {
            return Ok(await _service.RemoveTokenLine(id));
        }
        [HttpGet]
        public async Task<IActionResult> SP_Record_AccountCheck_Born(string recordGuid)
        {
            return Ok(await _service.SP_Record_AccountCheck_Born(recordGuid));
        }
         [HttpGet]
        public async Task<IActionResult> SP_Record_AccountCheck_Remove(string recordGuid)
        {
            return Ok(await _service.SP_Record_AccountCheck_Remove(recordGuid));
        }
        [HttpGet]
        public async Task<IActionResult> SP_Record_AccountCheck_Confirm(string accountGuid)
        {
            return Ok(await _service.SP_Record_AccountCheck_Confirm(accountGuid));
        }

        [HttpGet]
        public async Task<IActionResult> SP_Record_AccountCheck_NeedCheck(string accountGuid)
        {
            return Ok(await _service.SP_Record_AccountCheck_NeedCheck(accountGuid));
        }

    }
}
