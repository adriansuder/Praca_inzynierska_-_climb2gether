using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IUserService
    {
        Task<PrivateUserInfoResponse> GetPrivateUserInfo(int userId);
        Task<bool> UpdateUserInfo(UpdateUserInfoRequest request, int userId);
        Task<List<UsersSearchResponse>> UsersSearch(string queryString);
        Task<int> CreateReview(int userId, CreateReviewRequest reviewRequest);
        Task<bool> DeleteReview(int authorId, int reviewId);
        Task<List<UserReviewsResponse>> GetUsersReviews(int userId);
    }

}
