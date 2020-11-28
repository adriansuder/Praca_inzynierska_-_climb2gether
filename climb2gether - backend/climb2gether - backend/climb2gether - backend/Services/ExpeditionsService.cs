using climb2gether___backend.Data;
using climb2gether___backend.Domain;
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

        public async Task<bool> CreateExpeditionAsync(Expedition expedition)
        {
            await _dataContext.Expeditions.AddAsync(expedition);
            var created = await _dataContext.SaveChangesAsync();
            return created > 0;
        }
    }
}
