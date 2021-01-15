using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IExpeditionsService
    {
        Task<bool> CreateExpeditionAsync(Expedition expedition);
        Task<List<ExpeditionResponse>> GetExpeditionsAsync(int userId);
        Task<bool> CheckIfUserIsAlreadyEnrolled(ExpeditionEnrollment expeditionEnrollment);
        Task<bool> CreateEnrollmentAsync(ExpeditionEnrollment expeditionEnrollment);
        Task<List<ExpeditionResponse>> SearchExpeditions(string query);
        Task<List<ExpeditionResponse>> GetUserExpeditions(int userId);
        bool CheckIsExpeditionOwner(int userId, int expeditionId);
        Task<bool> DeleteExpedition(int expeditionId);
        Task<bool> DeleteExpeditionEnrollment(int expEnrollmentId, int userId);
        Task<List<ParticipantResponse>> GetParticipants(int userId, int expeditionId);



    }
}
