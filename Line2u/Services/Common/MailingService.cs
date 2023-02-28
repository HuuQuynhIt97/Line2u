using AutoMapper;
using Line2u.Data;
using Line2u.DTO;
using Line2u.Models;
using Line2u.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Line2u.Services
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
private readonly ILine2uLoggerService _logger;
        public MailingService(
            IRepositoryBase<MailingDto> repo, 
            IUnitOfWork unitOfWork,
            IMapper mapper, 
            MapperConfiguration configMapper,
ILine2uLoggerService logger
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
