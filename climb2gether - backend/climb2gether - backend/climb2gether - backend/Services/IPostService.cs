using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IPostService
    {
        Task<List<PostResponse>> GetPostsAsync(int userId);
        Task<Post> GetPostByIdAsync(int PostId);
        Task<bool> UpdatePostAsync(Post postToUpdate);
        Task<bool> DeletePostAsync(int postId);
        Task<bool> CreatePostAsync(Post post);
        Task<bool> UserOwnsPost(int postId, int userId);
        Task<bool> IsPostAlreadyLiked(int postId, int userId);
        Task<int> LikePost(int postId, int userId);
        Task<bool> DislikePost(int postLikeId);
    }
}
