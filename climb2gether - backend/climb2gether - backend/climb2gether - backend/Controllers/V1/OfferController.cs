using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using climb2gether___backend.Contracts;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Domain;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;


namespace climb2gether___backend.Controllers.V1
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class OfferController : Controller
    {
        private readonly IOfferService _offerService;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;
        private readonly IFileService _fileService;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public OfferController(IOfferService offerService, IMapper mapper, IIdentityService identityService, IFileService fileService, IHttpContextAccessor httpContextAccessor)
        {
            _offerService = offerService;
            _mapper = mapper;
            _identityService = identityService;
            _fileService = fileService;
            _httpContextAccessor = httpContextAccessor;
        }


        [HttpPost(ApiRoutes.Offers.Create)]
        public async Task<IActionResult> Create([FromForm] CreateOfferRequest offerRequest)
        {
            // var token = Request.Headers["Authorization"][0].ToString();
            // token = token.Substring(token.IndexOf(" ") + 1);
            //var userId = _identityService.GetUserIdFromJWT(token);
            List<IFormFile> files = offerRequest.Img;
            var offer = new Offer
            {
                Date = offerRequest.Date,
                Location = offerRequest.Location,
                MaxParticipants = offerRequest.MaxParticipants,
                Price = offerRequest.Price,
                Describe = offerRequest.Describe,
                OfferType = offerRequest.OfferType,
                CreationDate = DateTime.UtcNow,
                OfferOwnerUserId = offerRequest.OfferOwnerUserId
            };

            var addedOfferId = await _offerService.CreateOfferAsync(offer);
            await _fileService.AddAttatchments(files, "oferta", addedOfferId);

            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host.ToUriComponent()}";
            var locationUri = baseUrl + "/" + ApiRoutes.Offers.Get.Replace("{postId}", offer.Id.ToString());
            //var response = _mapper.Map<PostResponse>(post);

            return Created(locationUri, addedOfferId);
        }

        [HttpGet(ApiRoutes.Offers.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);

            var offers = await _offerService.GetOffersAsync(userId);

            return Ok(offers);
        }

        [HttpGet(ApiRoutes.Offers.GetUserOffers)]
        public async Task<IActionResult> GetUserOffers()
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);

            var offers = await _offerService.GetUserOffersAsync(userId);

            return Ok(offers);
        }

        [HttpGet(ApiRoutes.Offers.GetUserOfferById)]
        public async Task<IActionResult> GetUserOfferById([FromRoute] int offerId)
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);

            var offers = await _offerService.GetUserOfferById(userId, offerId);

            return Ok(offers);
        }


        [HttpGet(ApiRoutes.Offers.GetOfferDetails)]
        public async Task<IActionResult> GetOfferDetails(int offerId)
        {

            var details = await _offerService.GetOfferDetailsAsync(offerId);

            return Ok(details);
        }

        [HttpDelete(ApiRoutes.Offers.Delete)]
        public async Task<IActionResult> Delete(int offerId)
        {
            var token = Request.Headers["Authorization"][0].ToString();
            token = token.Substring(token.IndexOf(" ") + 1);
            var userId = _identityService.GetUserIdFromJWT(token);

            var userOwnsOffer = await _offerService.UserOwnsOfferAsync(offerId, userId);

            if (userOwnsOffer)
            {
                var offers = await _offerService.DeleteOfferAsync(offerId);
                return Ok(offers);
            }
            return BadRequest();
        }

        [HttpPut(ApiRoutes.Offers.Update)]
        public async Task<IActionResult> UpdateOffer([FromBody] UpdateOfferRequest offerRequest)
        {
            var offer = new Offer
            {   
                Id = offerRequest.Id,
                Date = offerRequest.Date,
                Location = offerRequest.Location,
                MaxParticipants = offerRequest.MaxParticipants,
                Price = offerRequest.Price,
                Describe = offerRequest.Describe,
                OfferType = offerRequest.OfferType,
                CreationDate = offerRequest.Date,
                OfferOwnerUserId = offerRequest.OfferOwnerUserId
            };

            var isUpdated = await _offerService.UpdateOfferAsync(offer);
            if (!isUpdated)
            {
                return BadRequest();
            }
            return Ok(isUpdated);
        }
        [HttpPost(ApiRoutes.Offers.CreateEnrollment)]
        public async Task<IActionResult> CreateEnrollment([FromBody] AddEnrollmentRequest request)
        {
            var isUserAlreadyAddedToEvent = await _offerService.IsUserAlreadyEnrolledAsync(request.OfferId, request.UserId);
            if (isUserAlreadyAddedToEvent)
            {
                return BadRequest("User is already enrolled");
            }
            var offerEnrollment = new OfferEnrollment
            {
                ParticipantUserId = request.UserId,
                OfferId = request.OfferId
            };
            var result = await _offerService.CreateEnrollmentAsync(offerEnrollment);
            if (!result)
            {
                return BadRequest();
            }

            return Ok(result);
        }

        [HttpDelete(ApiRoutes.Offers.DeleteEnrollment)]
        public async Task<IActionResult> DeleteEnrollment([FromQuery] int offerId, [FromQuery] int userId)
        {
            var result = await _offerService.DeleteEnrollmentAsync(offerId, userId);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }
        [HttpGet(ApiRoutes.Offers.ParticipantsList)]
        public async Task<IActionResult> GetParticipantsList([FromQuery] int offerId)
        {
            var participantsList = await _offerService.GetParticipantsListAsync(offerId);

            return Ok(participantsList);
        }

        [HttpGet(ApiRoutes.Offers.SearchOffers)]
        public async Task<IActionResult> SearchOffers([FromQuery] string query)
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);

            var result = await _offerService.SearchOffers(query, userId);

            return Ok(result);
        }


    }
}