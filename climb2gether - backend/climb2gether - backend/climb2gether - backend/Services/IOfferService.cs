using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IOfferService
    {
        Task<int> CreateOfferAsync(Offer offer);
        Task<List<OfferResponse>> GetOffersAsync(int userId);
        Task<OfferDetailsResponse> GetOfferDetailsAsync(int offerId);
        Task<List<UserOffersResponse>> GetUserOffersAsync(int userId);
        Task<bool> UserOwnsOfferAsync(int offerId, int userId);
        Task<bool> DeleteOfferAsync(int offerId);
        Task<bool> UpdateOfferAsync(Offer offer);
        Task<bool> CreateEnrollmentAsync(OfferEnrollment offerEnrollment);
        Task<bool> IsUserAlreadyEnrolledAsync(int offerId, int userId);
        Task<bool> DeleteEnrollmentAsync(int offerId, int userId);
        Task<List<ParticipantResponse>> GetParticipantsListAsync(int offerId);
        Task<UserOffersResponse> GetUserOfferById(int userId, int offerId);
    }
}
