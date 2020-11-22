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
    public class OfferController : Controller
    {
        private readonly IOfferService _offerService;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;

        public OfferController(IOfferService offerService, IMapper mapper, IIdentityService identityService)
        {
            _offerService = offerService;
            _mapper = mapper;
            _identityService = identityService;
        }

        [HttpPost(ApiRoutes.Offers.Create)]
        public async Task<IActionResult> Create([FromBody] CreateOfferRequest offerRequest)
        {
            var token = Request.Headers["Authorization"][0].ToString();
            token = token.Substring(token.IndexOf(" ") + 1);
            var userId = _identityService.GetUserIdFromJWT(token);
            var offer = new Offer
            {
                Date = offerRequest.Date,
                Location = offerRequest.Location,
                MaxParticipants = offerRequest.MaxParticipants,
                Price = offerRequest.Price,
                Describe = offerRequest.Describe,
                OfferType = offerRequest.OfferType,
                CreationDate = DateTime.UtcNow,
                OfferOwnerUserId = userId
            };

            var response = await _offerService.CreateOfferAsync(offer);

            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host.ToUriComponent()}";
            var locationUri = baseUrl + "/" + ApiRoutes.Offers.Get.Replace("{postId}", offer.Id.ToString());
            //var response = _mapper.Map<PostResponse>(post);

            return Created(locationUri, response);
        }

        [HttpGet(ApiRoutes.Offers.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var token = Request.Headers["Authorization"][0].ToString();
            token = token.Substring(token.IndexOf(" ") + 1);
            var userId = _identityService.GetUserIdFromJWT(token);
            var offers = await _offerService.GetOffersAsync(userId);

            return Ok(offers);
        }

        [HttpGet(ApiRoutes.Offers.GetOfferDetails)]
        public async Task<IActionResult> GetOfferDetails(int offerId)
        {
            //var token = Request.Headers["Authorization"][0].ToString();
            //token = token.Substring(token.IndexOf(" ") + 1);
            //var userId = _identityService.GetUserIdFromJWT(token);
            var details = await _offerService.GetOfferDetails(offerId);

            return Ok(details);
        }
    }
}