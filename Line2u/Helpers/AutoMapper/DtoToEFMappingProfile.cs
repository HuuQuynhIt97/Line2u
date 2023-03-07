using AutoMapper;
using Line2u.DTO;
using Line2u.DTO.auth;
using Line2u.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Line2u.Helpers.AutoMapper
{
    public class DtoToEFMappingProfile : Profile
    {
        public DtoToEFMappingProfile()
        {
         
            CreateMap<EmployeeDto, Employee>();
            CreateMap<EmployeeDto, Employee>();
            CreateMap<SystemLanguageDto, SystemLanguage>();
            CreateMap<XAccountDto, XAccount>();
            CreateMap<XAccountGroupDto, XAccountGroup>();
            CreateMap<SysMenuDto, SysMenu>();
            CreateMap<CodePermissionDto, CodePermission>();
            CreateMap<ChartSettingDto, SysMenu>();
            CreateMap<CodeTypeDto, CodeType>();
            CreateMap<SystemConfigDto, SystemConfig>();
            CreateMap<SiteDto, Site>();
            CreateMap<MemberDto, Member>();
            CreateMap<LandLordDto, LandLord>();
            CreateMap<EngineerDto, Engineer>();
            CreateMap<DeviceDto, Device>();
            CreateMap<ParkingLotDto, ParkingLot>();

            CreateMap<BankDto, Bank>();
            CreateMap<WebBannerDto, WebBanner>();
            CreateMap<WebBannerUserDto, WebBannerUser>();
            CreateMap<ContractDto, Contract>();
            CreateMap<WebNewsDto, WebNews>();
            CreateMap<WebNewsUserDto, WebNewsUser>();
            CreateMap<User2BankDto, User2Bank>();
            CreateMap<User2Bank, User2BankDto>();
            CreateMap<User2Message, User2MessageDto>();
            CreateMap<ChatDto, Chat>();


        }
    }
}
