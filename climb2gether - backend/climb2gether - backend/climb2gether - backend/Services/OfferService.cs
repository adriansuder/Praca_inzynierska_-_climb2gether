﻿using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Data;
using climb2gether___backend.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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
                                   Offers = (from userOffer in _dataContext.Offers where userOffer.OfferOwnerUserId == user.Id select userOffer).ToList<Offer>()
                               }
                          ).Distinct().ToListAsync();

            return query;
        }

        public async Task<OfferDetailsResponse> GetOfferDetails(int offerId)
        {
            var offer = await _dataContext.Offers.Where(offer => offer.Id == offerId).SingleOrDefaultAsync();
            var result = new OfferDetailsResponse { Description = offer.Describe };

            return result;
        }

        public async Task<List<Offer>> GetUserOffersAsync(int userId)
        {
            return await _dataContext.Offers.Where(offer => offer.OfferOwnerUserId == userId).ToListAsync();
        }

        public async Task<bool> UserOwnsOffer(int offerId, int userId)
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
    }
}
