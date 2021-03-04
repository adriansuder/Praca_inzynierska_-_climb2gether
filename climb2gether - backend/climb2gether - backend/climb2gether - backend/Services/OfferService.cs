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
        private readonly INotificationsService _notificationsService;
        private readonly IFileService _fileService;

        public OfferService(DataContext dataContext, INotificationsService notificationsService, IFileService fileService)
        {
            _dataContext = dataContext;
            _notificationsService = notificationsService;
            _fileService = fileService;
        }

        public async Task<int> CreateOfferAsync(Offer offer)
        {
            await _dataContext.Offers.AddAsync(offer);
            await _dataContext.SaveChangesAsync();

            return offer.Id;
        }

        public async Task<List<OfferResponse>> GetOffersAsync(int userId)
        {
            var query = await (
                               from user in _dataContext.Users
                               join role in _dataContext.ApplicationUserRoles on user.RoleId equals role.RoleId
                               join offer in _dataContext.Offers on user.Id equals offer.OfferOwnerUserId
                               where offer.Date >= DateTime.UtcNow
                               orderby offer.CreationDate descending
                               select new OfferResponse
                               {
                                   UserNameSurname = user.FirstName + " " + user.Surname,
                                   userRole = role.RoleName,
                                   UserId = user.Id,
                                   Grade = 0,
                                   Offers = (from userOffer in _dataContext.Offers
                                             where userOffer.OfferOwnerUserId == user.Id && userOffer.Date >= DateTime.UtcNow
                                             select new OfferResponseItem
                                             {
                                                 Id = userOffer.Id,
                                                 Date = userOffer.Date,
                                                 Location = userOffer.Location,
                                                 MaxParticipants = userOffer.MaxParticipants,
                                                 Price = userOffer.Price,
                                                 Describe = userOffer.Describe,
                                                 OfferType = userOffer.OfferType,
                                                 OfferOwnerUserId = userOffer.OfferOwnerUserId,
                                                 UserEnrollmentId = (from offEnr in _dataContext.OfferEnrollments
                                                                     where offEnr.OfferId == userOffer.Id && offEnr.ParticipantUserId == userId
                                                                     select offEnr.Id).First(),
                                                 Attatchments = (from att in _dataContext.Attatchments
                                                                 where att.ObjectTypeName == "oferta" && att.ObjectTypeNumber == userOffer.Id
                                                                 select att).ToList()
                                             }
                                             ).ToList<OfferResponseItem>()
                               }
                          ).Distinct().ToListAsync();

            foreach(var item in query)
            {
                var reviews = await _dataContext.Reviews.Where(r => r.UserId == item.UserId).ToListAsync();
                if(reviews.Count > 0)
                {
                    foreach (var rev in reviews)
                    {
                        item.Grade += rev.Grade;
                    }
                    item.Grade /= reviews.Count;
                }
                else
                {
                    item.Grade = 0;
                }

            }

            return query;
        }

        public async Task<OfferDetailsResponse> GetOfferDetailsAsync(int offerId)
        {
            var offer = await _dataContext.Offers.Where(offer => offer.Id == offerId).SingleOrDefaultAsync();
            var result = new OfferDetailsResponse { Description = offer.Describe };

            return result;
        }

        public async Task<List<UserOffersResponse>> GetUserOffersAsync(int userId)
        {
            var result = await _dataContext.Offers.Where(offer => offer.OfferOwnerUserId == userId).Select(x => new UserOffersResponse
            {
                Id = x.Id,
                Date = x.Date,
                Location = x.Location,
                MaxParticipants = x.MaxParticipants,
                Price = x.Price,
                Describe = x.Describe,
                OfferType = x.OfferType,
                CreationDate = x.CreationDate,
                OfferOwnerUserId = x.OfferOwnerUserId,
                Attatchments = _dataContext.Attatchments.Where(y => y.ObjectTypeNumber == x.Id && y.ObjectTypeName == "oferta").ToList()

            }).ToListAsync();

            return result;
        }

        public async Task<UserOffersResponse> GetUserOfferById(int userId, int offerId)
        {
            var result = await _dataContext.Offers.Where(offer => offer.Id == offerId && offer.OfferOwnerUserId == userId).Select(x => new UserOffersResponse
            {
                Id = x.Id,
                Date = x.Date,
                Location = x.Location,
                MaxParticipants = x.MaxParticipants,
                Price = x.Price,
                Describe = x.Describe,
                OfferType = x.OfferType,
                CreationDate = x.CreationDate,
                OfferOwnerUserId = x.OfferOwnerUserId,
                Attatchments = _dataContext.Attatchments.Where(y => y.ObjectTypeNumber == x.Id && y.ObjectTypeName == "oferta").ToList()

            }).FirstOrDefaultAsync();

            return result;
        }

        public async Task<bool> UserOwnsOfferAsync(int offerId, int userId)
        {
            var result = _dataContext.Offers
                                        .Where(x => x.Id == offerId && x.OfferOwnerUserId == userId).Count();
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

            var InstructorOffer = await _dataContext.Offers.Where(x => x.Id == offerEnrollment.OfferId).FirstOrDefaultAsync();
            var notification = new Notification
            {
                Message = "Nowy użytkownik zapisał się na kurs w terminie: " + InstructorOffer.Date,
                IsReaded = false,
                UserId = InstructorOffer.OfferOwnerUserId,
                CreationDate = DateTime.UtcNow
            };
            await _notificationsService.AddNotification(notification);
            await _dataContext.OfferEnrollments.AddAsync(offerEnrollment);
            var result = await _dataContext.SaveChangesAsync();

            return result > 0;
        }

        public async Task<bool> IsUserAlreadyEnrolledAsync(int offerId, int userId)
        {
            var result = await _dataContext.OfferEnrollments
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

        public async Task<List<OfferResponse>> SearchOffers(string query, int userId, string? dateFrom, string? dateTo)
        {
            var queryString = query.Trim();
            var result = await (
                               from user in _dataContext.Users
                               join role in _dataContext.ApplicationUserRoles on user.RoleId equals role.RoleId
                               join offer in _dataContext.Offers on user.Id equals offer.OfferOwnerUserId
                               where (offer.Location.Contains(queryString) || offer.OfferType.Contains(queryString) ||
                                        offer.Describe.Contains(queryString) || offer.User.Email.Contains(queryString) ||
                                        offer.User.Surname.Contains(queryString)) && offer.Date >= DateTime.UtcNow &&
                                        (
                                            (dateFrom != null) ? offer.Date >= DateTime.Parse(dateFrom) : offer.Date >= DateTime.UtcNow  &&
                                            (dateTo != null) ? offer.Date <= DateTime.Parse(dateTo) : offer.Date <= DateTime.Parse("31.12.2100")
                                       )
                               select new OfferResponse
                               {
                                   UserNameSurname = user.FirstName + " " + user.Surname,
                                   userRole = role.RoleName,
                                   UserId = user.Id,
                                   Offers = (from userOffer in _dataContext.Offers
                                             where userOffer.OfferOwnerUserId == user.Id && userOffer.Date >= DateTime.UtcNow &&
                                             (offer.Location.Contains(queryString) || offer.OfferType.Contains(queryString) ||
                                                offer.Describe.Contains(queryString) || offer.User.Email.Contains(queryString) ||
                                                 offer.User.Surname.Contains(queryString)) &&
                                                 (
                                                    (dateFrom != null) ? offer.Date >= DateTime.Parse(dateFrom) : offer.Date >= DateTime.UtcNow &&
                                                    (dateTo != null) ? offer.Date <= DateTime.Parse(dateTo) : offer.Date <= DateTime.Parse("31.12.2100")
                                                )
                                             select new OfferResponseItem
                                             {
                                                 Id = userOffer.Id,
                                                 Date = userOffer.Date,
                                                 Location = userOffer.Location,
                                                 MaxParticipants = userOffer.MaxParticipants,
                                                 Price = userOffer.Price,
                                                 Describe = userOffer.Describe,
                                                 OfferType = userOffer.OfferType,
                                                 OfferOwnerUserId = userOffer.OfferOwnerUserId,
                                                 UserEnrollmentId = (from offEnr in _dataContext.OfferEnrollments
                                                                     where offEnr.OfferId == userOffer.Id && offEnr.ParticipantUserId == userId
                                                                     select offEnr.Id).SingleOrDefault(),
                                                 Attatchments = (from att in _dataContext.Attatchments
                                                                 where att.ObjectTypeName == "oferta" && att.ObjectTypeNumber == userOffer.Id
                                                                 select att).ToList()
                                             }
                                             ).ToList<OfferResponseItem>()
                               }
                          ).Distinct().ToListAsync();

            return result;
        }
    }
}
