using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Data;
using climb2gether___backend.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public class OfferService : IOfferService
    {
        private readonly DataContext _dataContext;

        public OfferService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<bool> CreateOfferAsync(Offer offer)
        {
            await _dataContext.Offers.AddAsync(offer);
            var created = await _dataContext.SaveChangesAsync();
            return created > 0;
        }

        public async Task<List<OfferResponse>> GetOffersAsync(int userId)
        {
            var query = await (//from offer in _dataContext.Offers
                               from user in _dataContext.Users //on offer.OfferOwnerUserId equals user.Id
                               join role in _dataContext.ApplicationUserRoles on user.RoleId equals role.RoleId
                               join offer in _dataContext.Offers on user.Id equals offer.OfferOwnerUserId
                               select new OfferResponse
                               {
                                   UserNameSurname = user.FirstName + " " + user.Surname,
                                   userRole = role.RoleName,
                                   UserId = user.Id,
                                   Offers = (from userOffer in _dataContext.Offers
                                             where userOffer.OfferOwnerUserId == user.Id
                                             select new Offer
                                             {
                                                 Id = userOffer.Id,
                                                 Date = userOffer.Date,
                                                 Location = userOffer.Location,
                                                 MaxParticipants = userOffer.MaxParticipants,
                                                 Price = userOffer.Price,
                                                 Describe = userOffer.Describe,
                                                 OfferType = userOffer.OfferType,
                                                 OfferOwnerUserId = userOffer.OfferOwnerUserId,
                                                 IsUserAlreadyEnrolled = (from offEnr in _dataContext.OfferEnrollments 
                                                                          where offEnr.OfferId == userOffer.Id && offEnr.ParticipantUserId == userId 
                                                                          select offEnr.Id).Any(),
                                                 UserEnrollmentId = (from offEnr in _dataContext.OfferEnrollments 
                                                                     where offEnr.OfferId == userOffer.Id && offEnr.ParticipantUserId == userId 
                                                                     select offEnr.Id).SingleOrDefault()
                                             }
                                             ).ToList<Offer>()
                               }
                          ).Distinct().ToListAsync();

            return query;
        }

        public async Task<OfferDetailsResponse> GetOfferDetailsAsync(int offerId)
        {
            var offer = await _dataContext.Offers.Where(offer => offer.Id == offerId).SingleOrDefaultAsync();
            var result = new OfferDetailsResponse { Description = offer.Describe };

            return result;
        }

        public async Task<List<Offer>> GetUserOffersAsync(int userId)
        {
            return await _dataContext.Offers.Where(offer => offer.OfferOwnerUserId == userId).ToListAsync();
        }

        public async Task<bool> UserOwnsOfferAsync(int offerId, int userId)
        {
            var result = _dataContext.Offers.Where(x => x.Id == offerId && x.OfferOwnerUserId == userId).Count();
            return result > 0;
        }

        public async Task<bool> DeleteOfferAsync(int offerId)
        {
            var offerToDelete = await _dataContext.Offers.SingleOrDefaultAsync(offer => offer.Id == offerId);
             _dataContext.Offers.Remove(offerToDelete);
            var result = await _dataContext.SaveChangesAsync();

                return result > 0;
        }
        public async Task<bool> UpdateOfferAsync(Offer offer)
        {
            var fetchedOffer = await _dataContext.Offers.SingleOrDefaultAsync(x => x.Id == offer.Id);
            var temp = fetchedOffer;
            temp.Date = offer.Date;
            temp.Location = offer.Location;
            temp.Price = offer.Price;
            temp.Describe = offer.Describe;
            temp.OfferType = offer.OfferType;
            _dataContext.Offers.Update(temp);
            var result = await _dataContext.SaveChangesAsync();

            return result > 0;

        }

        public async Task<bool> CreateEnrollmentAsync(OfferEnrollment offerEnrollment)
        {
            _dataContext.OfferEnrollments.Add(offerEnrollment);
            var result = await _dataContext.SaveChangesAsync();

            return result > 0;
        }

        public async Task<bool> IsUserAlreadyEnrolledAsync(int offerId, int userId)
        {
            var result = await  _dataContext.OfferEnrollments
                .SingleOrDefaultAsync(x => x.OfferId == offerId && x.ParticipantUserId == userId);
            return result != null;
        }

        public async Task<bool> DeleteEnrollmentAsync(int offerId, int userId)
        {
            var offerToDelete = await _dataContext.OfferEnrollments.SingleOrDefaultAsync(x => x.ParticipantUserId == userId && x.OfferId == offerId);
            if (offerToDelete == null)
            {
                return false;
            }
            _dataContext.OfferEnrollments.Remove(offerToDelete);
            var result = await _dataContext.SaveChangesAsync();
            return result > 0;
        }

        public async Task<List<ParticipantResponse>> GetParticipantsListAsync(int offerId)
        {
            var query = await (from offEnr in _dataContext.OfferEnrollments
                         join user in _dataContext.Users on offEnr.ParticipantUserId equals user.Id
                         where offEnr.OfferId == offerId
                         select new ParticipantResponse
                         {
                             Id = user.Id,
                             FirstName = user.FirstName,
                             Surname = user.Surname,
                             Phone = user.Phone,
                             Email = user.Email
                         }
                        ).ToListAsync();
            return query;
        }
    }
}
