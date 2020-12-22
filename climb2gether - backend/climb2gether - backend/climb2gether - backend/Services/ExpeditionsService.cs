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
    }
}
