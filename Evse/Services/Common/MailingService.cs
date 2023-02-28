using AutoMapper;
using Evse.Data;
using Evse.DTO;
using Evse.Models;
using Evse.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Evse.Services
{
    public interface IMailingService: IServiceBase<MailingDto, MailingDto>
    {
    }
    public class MailingService : ServiceBase<MailingDto, MailingDto>, IMailingService
    {
        private readonly IRepositoryBase<MailingDto> _repo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
private readonly IEvseLoggerService _logger;
        public MailingService(
            IRepositoryBase<MailingDto> repo, 
            IUnitOfWork unitOfWork,
            IMapper mapper, 
            MapperConfiguration configMapper,
IEvseLoggerService logger
            )
            : base(repo,logger, unitOfWork, mapper,  configMapper)
        {
            _repo = repo;
_logger = logger;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
        }
    }
}
