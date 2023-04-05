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
    public class EFToDtoMappingProfile : Profile
    {
        public EFToDtoMappingProfile()
        {
            var list = new List<int> { };
        
            CreateMap<XAccount, UserForDetailDto>()
                .ForMember(d => d.Username, o => o.MapFrom(x => x.Uid))
                .ForMember(d => d.ID, o => o.MapFrom(x => x.AccountId));

             CreateMap<LandLord, UserForDetailDto>()
                .ForMember(d => d.Username, o => o.MapFrom(x => x.Uid));
            CreateMap<Employee, EmployeeDto>();
            CreateMap<Employee, EmployeeDto>();
            CreateMap<SystemLanguage, SystemLanguageDto>();
            CreateMap<XAccount, XAccountDto>();
            CreateMap<XAccountGroup, XAccountGroupDto>();
            CreateMap<SysMenu, SysMenuDto>();
            CreateMap<CodePermission, CodePermissionDto>();
            CreateMap<SysMenu, ChartSettingDto>();
            CreateMap<CodeType, CodeTypeDto>();
            CreateMap<SystemConfig, SystemConfigDto>();
            CreateMap<Site, SiteDto>();
               CreateMap<Member, MemberDto>();
            CreateMap<LandLord, LandLordDto>();
            CreateMap<Engineer, EngineerDto>();
            CreateMap<Device, DeviceDto>();
            CreateMap<ParkingLot, ParkingLotDto>();

            CreateMap<Bank, BankDto>();
            CreateMap<Chat, ChatDto>();
            CreateMap<WebBanner, WebBannerDto>();
            CreateMap<WebBannerUser, WebBannerUserDto>();
            CreateMap<Contract, ContractDto>();
            CreateMap<WebNews, WebNewsDto>();
            CreateMap<WebNewsUser, WebNewsUserDto>();
            CreateMap<User2MessageDto, User2Message>();

            CreateMap<StoreProfile, StoreProfilesDto>();
            CreateMap<Product, ProductsDto>();
            CreateMap<MainCategory, MainCategoryDto>();
            CreateMap<Order, OrderDto>();
            CreateMap<OrderDetail, OrderDetailDto>();
            CreateMap<Cart, CartDto>();
            CreateMap<StoreRatingComment, StoreRatingCommentDto>();

        }

    }
}
