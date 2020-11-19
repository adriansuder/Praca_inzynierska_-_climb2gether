using climb2gether___backend.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IPostService
    {
        Task<List<Post>> GetPostsAsync();

        Task<Post> GetPostByIdAsync(int PostId);

        Task<bool> UpdatePostAsync(Post postToUpdate);

        Task<bool> DeletePostAsync(int postId);
        Task<bool> CreatePostAsync(Post post);
        Task<bool> UserOwnsPost(int postId, int userId);
        Task<bool> IsPostAlreadyLiked(int postId, int userId);
        Task<bool> LikePost(int postId, int userId);
        Task<bool> DislikePost(int postLikeId);
    }
}
