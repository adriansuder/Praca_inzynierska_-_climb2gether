using AutoMapper;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Data;
using climb2gether___backend.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public class ExpeditionsService : IExpeditionsService
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        private readonly INotificationsService _notifications;

        public ExpeditionsService(DataContext dataContext, IMapper mapper, INotificationsService notifications)
        {
            _dataContext = dataContext;
            _mapper = mapper;
            _notifications = notifications;
        }

        public async Task<bool> CheckIfUserIsAlreadyEnrolled(ExpeditionEnrollment expeditionEnrollment)
        {
            var result = await _dataContext.ExpeditionEnrollments
                .AnyAsync(x => x.ParticipantUserId == expeditionEnrollment.ParticipantUserId && x.ExpeditionId == expeditionEnrollment.ExpeditionId);
            return result;
        }

        public bool CheckIsExpeditionOwner(int userId, int expeditionId)
        {
            var isOwner = _dataContext.Expeditions.Where(x => x.UserId == userId && x.Id == expeditionId).Any();
            return isOwner;
        }

        public async Task<bool> CreateEnrollmentAsync(ExpeditionEnrollment expeditionEnrollment)
        {
            _dataContext.ExpeditionEnrollments.Add(expeditionEnrollment);
            var result = await _dataContext.SaveChangesAsync();

            return result > 0;
        }

        public async Task<bool> CreateExpeditionAsync(Expedition expedition)
        {
            await _dataContext.Expeditions.AddAsync(expedition);
            var created = await _dataContext.SaveChangesAsync();
            return created > 0;
        }

        public async Task<bool> DeleteExpedition(int expeditionId)
        {
            var expedition = _dataContext.Expeditions.Where(x => x.Id == expeditionId).Single();
            var enrollments = _dataContext.ExpeditionEnrollments.Where(x => x.ExpeditionId == expeditionId).ToList();
            foreach(var enr in enrollments)
            { 
                var notification = new Notification
                {
                    Message = $"Prywatna oferta {expedition.DescriptionTitle} w terminie {expedition.ExpeditionDate} została anulowana.",
                    IsReaded = false,
                    UserId = enr.ParticipantUserId,
                    CreationDate = DateTime.UtcNow
                };
                await _notifications.AddNotification(notification);
            }
            _dataContext.ExpeditionEnrollments.RemoveRange(enrollments);

            _dataContext.Expeditions.Remove(expedition);
            var result = await _dataContext.SaveChangesAsync();

            return result > 0;
        }

        public async Task<bool> DeleteExpeditionEnrollment(int expEnrollmentId, int userId)
        {
            var enrollment = await _dataContext.ExpeditionEnrollments.Where(x => x.Id == expEnrollmentId && x.ParticipantUserId == userId).FirstOrDefaultAsync();
            if (enrollment == null)
            {
                return false;
            }
            _dataContext.ExpeditionEnrollments.Remove(enrollment);
            var result = await _dataContext.SaveChangesAsync();

            return result > 0;
        }

        public async Task<List<ExpeditionResponse>> GetExpeditionsAsync(int userId)
        {
            var expeditionItemList = await _dataContext.Expeditions.Include(exp => exp.User)
                                                            .ThenInclude(user => user.Role)
                                                            .Where(x => x.ExpeditionDate >= DateTime.UtcNow)
                                                            .ToListAsync();

            var result = expeditionItemList.Select(x => new ExpeditionResponse
            {
                Id = x.Id,
                User = new UserPublicDetailResponse
                {
                    Id = x.User.Id,
                    FirstName = x.User.FirstName,
                    Surname = x.User.Surname,
                    Sex = x.User.Sex,
                    RoleName = x.User.Role.RoleName,
                    Phone = x.User.Phone,
                    Email = x.User.Email,
                    City = x.User.City
                },
                DestinationCity = x.DestinationCity,
                Destination = x.Destination,
                DestinationRegion = x.DestinationRegion,
                DepartureCity = x.DepartureCity,
                MaxParticipants = x.MaxParticipants,
                CreationDate = x.CreationDate,
                ExpeditionDate = x.ExpeditionDate,
                DescriptionTitle = x.DescriptionTitle,
                Description = x.Description,
                UserEnrollmentId = 0
        }).ToList();
            foreach (var x in result)
            {
                var temp = _dataContext.ExpeditionEnrollments.Where(e => e.ExpeditionId == x.Id && e.ParticipantUserId == userId).Select(x => x.Id).FirstOrDefault();
                x.UserEnrollmentId = temp != null ? temp : 0;
            }
            return result;
        }

        public async Task<List<ExpeditionResponse>> GetUserExpeditions(int userId)
        {
            var result = await _dataContext.Expeditions.Where(x => x.UserId == userId).Select(x => new ExpeditionResponse
            {
                Id = x.Id,
                User = new UserPublicDetailResponse
                {
                    Id = x.User.Id,
                    FirstName = x.User.FirstName,
                    Surname = x.User.Surname,
                    Sex = x.User.Sex,
                    RoleName = x.User.Role.RoleName,
                    Phone = x.User.Phone,
                    Email = x.User.Email,
                    City = x.User.City
                },
                DestinationCity = x.DestinationCity,
                Destination = x.Destination,
                DestinationRegion = x.DestinationRegion,
                DepartureCity = x.DepartureCity,
                MaxParticipants = x.MaxParticipants,
                CreationDate = x.CreationDate,
                ExpeditionDate = x.ExpeditionDate,
                DescriptionTitle = x.DescriptionTitle,
                Description = x.Description
            }).ToListAsync();
            List<ExpeditionResponse> expResponse = new List<ExpeditionResponse>();

            return result;
        }

        public async Task<List<ExpeditionResponse>> SearchExpeditions(string querySearch)
        {
            var query = querySearch.Trim();
            var expeditionItemList = await _dataContext.Expeditions.Include(exp => exp.User)
                                                            .ThenInclude(user => user.Role)
                                                            .Where(x =>
                                                                    x.ExpeditionDate >= DateTime.UtcNow &&
                                                                        (
                                                                            x.DestinationRegion.Contains(query) ||
                                                                            x.DepartureCity.Contains(query) ||
                                                                            x.DescriptionTitle.Contains(query) ||
                                                                            x.Destination.Contains(query)
                                                                        )

                                                                    ).ToListAsync();
            var result = expeditionItemList.Select(x => new ExpeditionResponse
            {
                Id = x.Id,
                User = new UserPublicDetailResponse
                {
                    Id = x.User.Id,
                    FirstName = x.User.FirstName,
                    Surname = x.User.Surname,
                    Sex = x.User.Sex,
                    RoleName = x.User.Role.RoleName,
                    Phone = x.User.Phone,
                    Email = x.User.Email,
                    City = x.User.City
                },
                DestinationCity = x.DestinationCity,
                Destination = x.Destination,
                DestinationRegion = x.DestinationRegion,
                DepartureCity = x.DepartureCity,
                MaxParticipants = x.MaxParticipants,
                CreationDate = x.CreationDate,
                ExpeditionDate = x.ExpeditionDate,
                DescriptionTitle = x.DescriptionTitle,
                Description = x.Description
            }).ToList();

            return result;
        }
    }
}
