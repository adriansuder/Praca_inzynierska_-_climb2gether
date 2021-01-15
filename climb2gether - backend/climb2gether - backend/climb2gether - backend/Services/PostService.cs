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
        private readonly IFileService _fileService;

        public PostService(DataContext dataContext, IFileService fileService)
        {
            _dataContext = dataContext;
            _fileService = fileService;
        }
        /// <summary>
        ///  Funkcja jako parametr przyjmuje Id użytkownika i
        ///  zwraca listę obiektów PostResponse. UserId niezbędny jest do tego, by 
        ///  zwrócić informację czy post został polubiony przez użytkownika
        /// </summary>
        /// <param name="userId">Id użytkownika</param>
        /// <returns>Funkcja zwraca listę obiektów PostResponse</returns>
        public async Task<List<PostResponse>> GetPostsAsync(int userId)
        {
            var query = await (from post in _dataContext.Posts
                               select new PostResponse
                               {
                                   Id = post.Id,
                                   Title = post.Title,
                                   Subtitle = post.Subtitle,
                                   ImgURL = (from Attatchment in _dataContext.Attatchments where Attatchment.ObjectTypeNumber == post.Id && Attatchment.ObjectTypeName == "post" select Attatchment.Id.ToString()).FirstOrDefault(),
                                   Content = post.Content,
                                   UserId = post.UserId,
                                   UserNameSurname = (post.User.FirstName + " " + post.User.Surname),
                                   CreationDate = post.CreationDate,
                                   LikeCounter = (from like in _dataContext.PostLikes where like.PostId == post.Id select like).Count(),
                                   PostLikedByLoggedUser = (from like in _dataContext.PostLikes where like.UserId == userId && like.PostId == post.Id select like).Any(),
                                   LoggedUserPostLikeId = (from like in _dataContext.PostLikes where like.UserId == userId && like.PostId == post.Id select like.Id).SingleOrDefault(),
                                   ImgBlob = ""
                               }
                          ).ToListAsync();

            foreach(var post in query)
            {
                if (post.ImgURL != null)
                {
                    post.ImgBlob = await _fileService.GetAttatchment(Int32.Parse(post.ImgURL));
                }

            }
            return query;
        }
        /// <summary>
        ///  Funkcja jako parametr przyjmuje Id postu, który ma zostać usunięty,
        ///  następnie sprawdza czy taki rekord istnieje i usuwa taką krotkę.
        /// </summary>
        /// <param name="postId">Id posta z tabeli Posts</param>
        /// <returns>Funkcja zwraca wartość boolean - true, jeżeli post został usunięty</returns>
        public async Task<bool> DeletePostAsync(int postId)
        {
            var post = await _dataContext.Posts.Where(p => p.Id == postId).FirstOrDefaultAsync();
            if (post == null)
                return false;
            var like = await _dataContext.PostLikes.Where(l => l.PostId == postId).ToListAsync();
            _dataContext.PostLikes.RemoveRange(like);
            _dataContext.Posts.Remove(post);

            var deleted = await _dataContext.SaveChangesAsync();
            return deleted > 0;
        }
        /// <summary>
        ///  Funkcja jako parametr przyjmuje Id postu, którego szczegóły mają zostać zwrócone.
        /// </summary>
        /// <param name="postId">Id posta z tabeli Posts</param>
        /// <returns>Funkcja zwraca obiekt Post</returns>
        public async Task<Post> GetPostByIdAsync(int postId)
        {
            var post = await _dataContext.Posts.Include(p => p.User).SingleOrDefaultAsync(x => x.Id == postId);
            post.ImgUrl = (from Attatchment in _dataContext.Attatchments where Attatchment.ObjectTypeNumber == post.Id && Attatchment.ObjectTypeName == "post" select Attatchment.Id.ToString()).FirstOrDefault();
            return post;
        }
        /// <summary>
        ///  Funkcja jako parametr przyjmuje obiekt Post, który zostanie zaktualizowany.
        /// </summary>
        /// <param name="postToUpdate">Obiekt Post (domain)</param>
        /// <returns>Funkcja zwraca wartość boolean - true, jeżeli post został zaktualizowany</returns>
        public async Task<bool> UpdatePostAsync(Post postToUpdate)
        {
             _dataContext.Posts.Update(postToUpdate);
            var updated = await _dataContext.SaveChangesAsync();

            return updated > 0;
        }
        /// <summary>
        ///  Funkcja jako parametr przyjmuje obiekt Post, który zostanie dodany do bazy.
        /// </summary>
        /// <param name="post">Obiekt Post (domain)</param>
        /// <returns>Funkcja zwraca wartość boolean - true, jeżeli post został dodany</returns>
        public async Task<int> CreatePostAsync(Post post)
        {
            //var result = post;
            await _dataContext.Posts.AddAsync(post);
            var created = await _dataContext.SaveChangesAsync();
            if(created <= 0)
            {
                return 0; 
            }
            return post.Id;
        }
        /// <summary>
        ///  Funkcja sprawdza czy użytkownik jest właścicielem wskazanego posta.
        /// </summary>
        /// <param name="postId">Id posta</param>
        /// <param name="userId">Id użytkownika</param>
        /// <returns>Funkcja zwraca wartość boolean - true, jeżeli użytkownik jest twórcą posta.</returns>
        public async Task<bool> UserOwnsPost(int postId, int userId)
        {
            var post =  _dataContext.Posts.Where(x => x.Id == postId && x.UserId == userId ).Any();

   

            return post;
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
            PostLike like = new PostLike{
                PostId = postId,
                UserId = userId
            };
            await _dataContext.PostLikes.AddAsync(like);
            var created = await _dataContext.SaveChangesAsync();
            return like.Id;
        }

        public async Task<bool> DislikePost(int postLikeId)
        {
            PostLike like = await _dataContext.PostLikes.SingleOrDefaultAsync(x => x.Id == postLikeId);
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
