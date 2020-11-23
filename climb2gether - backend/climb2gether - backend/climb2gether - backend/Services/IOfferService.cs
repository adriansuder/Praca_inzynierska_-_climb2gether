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
        Task<bool> CreateOfferAsync(Offer offer);
        Task<List<OfferResponse>> GetOffersAsync(int userId);
        Task<OfferDetailsResponse> GetOfferDetails(int offerId);
        Task<List<Offer>> GetUserOffersAsync(int userId);
        Task<bool> UserOwnsOffer(int offerId, int userId);
        Task<bool> DeleteOfferAsync(int offerId);
    }
}
