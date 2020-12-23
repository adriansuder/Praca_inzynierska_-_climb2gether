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

        public ExpeditionsService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<bool> CheckIfUserIsAlreadyEnrolled(ExpeditionEnrollment expeditionEnrollment)
        {
            var result = await _dataContext.ExpeditionEnrollments
                .AnyAsync(x => x.ParticipantUserId == expeditionEnrollment.ParticipantUserId && x.ExpeditionId == expeditionEnrollment.ExpeditionId);
            return result;
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

        public async Task<List<Expedition>> GetExpeditionsAsync()
        {
            var expeditionItemList = await _dataContext.Expeditions.Include(exp => exp.User)
                                                            .ThenInclude(user => user.Role)
                                                            .Where(x => x.ExpeditionDate >= DateTime.UtcNow)
                                                            .ToListAsync();
            return expeditionItemList;
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
