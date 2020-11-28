using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using climb2gether___backend.Contracts;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Domain;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace climb2gether___backend.Controllers.V1
{
    public class ExpeditionsController : Controller
    {
        private readonly IExpeditionsService _expeditionsService;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;

        public ExpeditionsController(IExpeditionsService expeditionsService, IMapper mapper, IIdentityService identityService)
        {
            _expeditionsService = expeditionsService;
            _mapper = mapper;
            _identityService = identityService;
        }

        [HttpPost(ApiRoutes.Expeditions.Create)]
        public async Task<IActionResult> Create([FromBody] CreateExpeditionRequest request )
        {

            var expedition = _mapper.Map<Expedition>(request);
            var result = await _expeditionsService.CreateExpeditionAsync(expedition);
            if (!result)
            {
                return BadRequest();
            }

            return Ok(result);
        }
    }
}