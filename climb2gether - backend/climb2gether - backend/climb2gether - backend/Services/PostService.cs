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
    public class PostService : IPostService
    {
        private readonly DataContext _dataContext;

        public PostService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<List<PostResponse>> GetPostsAsync(int userId)
        {
            var query = await (from post in _dataContext.Posts
                               select new PostResponse
                               {
                                   Id = post.Id,
                                   Title = post.Title,
                                   Subtitle = post.Subtitle,
                                   ImgURL = post.ImgUrl,
                                   Content = post.Content,
                                   UserId = post.UserId,
                                   UserNameSurname = (post.User.FirstName + " " + post.User.Surname),
                                   CreationDate = post.CreationDate,
                                   LikeCounter = (from like in _dataContext.PostLikes where like.PostId == post.Id select like).Count(),
                                   PostLikedByLoggedUser = (from like in _dataContext.PostLikes where like.UserId == userId && like.PostId == post.Id select like).Any(),
                                   LoggedUserPostLikeId = (from like in _dataContext.PostLikes where like.UserId == userId && like.PostId == post.Id select like.Id).FirstOrDefault()
                               }
                          ).ToListAsync();
            return query;
                          
            //return await _dataContext.PostLikes.Include(p => p.User)
            //    .Join(_dataContext.Posts,
            //            like => like.PostId,
            //            post => post.Id,
            //            (like, post) => new PostResponse
            //            //{
            //            //    Id = post.Id,
            //            //    Title = post.Title,
            //            //    Subtitle = post.Subtitle,
            //            //    ImgURL = post.ImgUrl,
            //            //    Content = post.Content,
            //            //    UserId = post.UserId,
            //            //    UserNameSurname = (post.User.FirstName + " " + post.User.Surname),
            //            //    CreationDate = post.CreationDate,
            //            //    LikeCounter = like.Id.Count(),
            //            //    PostLikedByLoggedUser = true

            //            //}
            //    )
            //    .ToListAsync();

        }

        public async Task<bool> DeletePostAsync(int postId)
        {
            var post = await GetPostByIdAsync(postId);
            if (post == null)
                return false;

            _dataContext.Posts.Remove(post);
            var deleted = await _dataContext.SaveChangesAsync();
            return deleted > 0;
        }

        public async Task<Post> GetPostByIdAsync(int postId)
        {
            return await _dataContext.Posts.Include(p => p.User).SingleOrDefaultAsync(x => x.Id == postId);
        }

        public async Task<bool> UpdatePostAsync(Post postToUpdate)
        {
             _dataContext.Posts.Update(postToUpdate);
            var updated = await _dataContext.SaveChangesAsync();

            return updated > 0;
        }

        public async Task<bool> CreatePostAsync(Post post)
        {
            //var result = post;
            await _dataContext.Posts.AddAsync(post);
            var created = await _dataContext.SaveChangesAsync();
            return created > 0;
        }

        public async Task<bool> UserOwnsPost(int postId, int userId)
        {
            var post = await _dataContext.Posts.AsNoTracking().SingleOrDefaultAsync(predicate: x => x.Id.ToString() == postId.ToString());

            if (post == null)
            {
                return false;
            }

            if(post.UserId.ToString() != userId.ToString())
            {
                return false;
            }

            return true;
        }

        public async Task<bool> IsPostAlreadyLiked(int postId, int userId)
        {
            var liked =  await _dataContext.PostLikes.SingleOrDefaultAsync(like => like.UserId == userId && like.PostId == postId);

            if(liked == null)
            {
                return false;
            }
            return true;
        }

        public async Task<int> LikePost(int postId, int userId)
        {
            PostLikes like = new PostLikes{
                PostId = postId,
                UserId = userId
            };
            await _dataContext.PostLikes.AddAsync(like);
            var created = await _dataContext.SaveChangesAsync();
            return like.Id;
        }

        public async Task<bool> DislikePost(int postLikeId)
        {
            PostLikes like = await _dataContext.PostLikes.SingleOrDefaultAsync(x => x.Id == postLikeId);
            if (!(like != null))
            {
                return false;
            }
            _dataContext.PostLikes.Remove(like);
            var deleted = await _dataContext.SaveChangesAsync();
            return deleted > 0;
        }
    }
}
