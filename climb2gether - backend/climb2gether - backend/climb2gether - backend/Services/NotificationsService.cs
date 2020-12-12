using AutoMapper;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Data;
using climb2gether___backend.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public class NotificationsService : INotificationsService
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;

        public NotificationsService(DataContext dataContext, IMapper mapper)
        {
            _dataContext = dataContext;
            _mapper = mapper;
        }


        public async Task<bool> AddNotification(Notification notification)
        {
            _dataContext.Notifications.Add(notification);
            var result = await _dataContext.SaveChangesAsync();

            return result > 0;
        }

        public async Task<List<UserNotificationsResponse>> GetNotifications(int userId)
        {
            var notifications = await _dataContext.Notifications.Where(x => x.UserId == userId).ToListAsync();
            return _mapper.Map<List<Notification>, List<UserNotificationsResponse>>(notifications);
        }

        public async Task<bool> SetReaded(int userId)
        {
            var notificationsToUpdate = _dataContext.Notifications.Where(x => x.UserId == userId && x.IsReaded == false);
            foreach(var element in notificationsToUpdate)
            {
                element.IsReaded = true;
                _dataContext.Notifications.Update(element);
            }
            var result = await _dataContext.SaveChangesAsync();

            return result > 0;
        }
    }
}
