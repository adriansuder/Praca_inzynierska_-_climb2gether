using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface INotificationsService
    {
        Task<bool> AddNotification(Notification notification);
        Task<List<UserNotificationsResponse>> GetNotifications(int userId);
    }
}
