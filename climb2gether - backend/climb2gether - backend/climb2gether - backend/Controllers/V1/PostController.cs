using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using climb2gether___backend.Contracts;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Domain;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace climb2gether___backend.Controllers.V1
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class PostController : Controller
    {
        private readonly IPostService _postService;
        private readonly IMapper _mapper;

        public PostController(IPostService postService, IMapper mapper)
        {
            _postService = postService;
            _mapper = mapper;
        }
        [HttpGet(ApiRoutes.Posts.GetAll)]
        public async Task<IActionResult> GetAll()
        {
           var posts = await _postService.GetPostsAsync();
            var postResponse = posts.Select(post => new PostResponse
            {  
                Id = post.Id,
                Title = post.Title,
                Subtitle = post.Subtitle,
                ImgURL = post.ImgUrl,
                Content = post.Content,
                UserId = post.UserId,
                UserNameSurname = (post.User.FirstName + " " + post.User.Surname),
                CreationDate = post.CreationDate
            });
    

            return Ok(postResponse);

        }

        [HttpPut(ApiRoutes.Posts.Update)]
        public async Task<IActionResult> Update([FromRoute] int postId, [FromBody] UpdatePostRequest request)
        {
            var userOwnsPost = await _postService.UserOwnsPost(postId, request.UserId);

            if (!userOwnsPost)
            {
                return BadRequest(new { error = "You do not own this post" });
            }

            var post = await _postService.GetPostByIdAsync(postId);
            post.Title = request.Title;
            post.Subtitle = request.Subtitle;
            post.ImgUrl = request.ImgUrl;
            post.Content = request.Content;


            var updated = await _postService.UpdatePostAsync(post);
            
            if(updated)
                return Ok(_mapper.Map<PostResponse>(post));

            return NotFound();
        }

        [HttpGet(ApiRoutes.Posts.Get)]
        public async Task<IActionResult> Get([FromRoute] int postId)
        {
            var post = await _postService.GetPostByIdAsync(postId);
            if (post == null)
            {
                return NotFound();
            }
            var postResponse =  new PostResponse
            {
                Title = post.Title,
                Subtitle = post.Subtitle,
                ImgURL = post.ImgUrl,
                Content = post.Content,
                UserId = post.UserId,
                UserNameSurname = (post.User.FirstName + " " + post.User.Surname),
                CreationDate = post.CreationDate
            };

            return Ok(postResponse);
        }

        [HttpDelete(ApiRoutes.Posts.Delete)]
        public async Task<IActionResult> Delete([FromRoute] int postId, [FromHeader] int userId)
        {
            var userOwnsPost = await _postService.UserOwnsPost(postId, userId);

            if (!userOwnsPost)
            {
                return BadRequest(new { error = "You do not own this post" });
            }

            var deleted = await _postService.DeletePostAsync(postId);

            if (deleted)
                return NoContent();

            return NotFound();
        }

        [HttpPost(ApiRoutes.Posts.Create)]
        public async Task<IActionResult> Create([FromBody] CreatePostRequest postRequest)
        {
            var post = new Post {
                Title = postRequest.Title,
                Subtitle = postRequest.Subtitle,
                ImgUrl = postRequest.ImgUrl,
                Content = postRequest.Content,
                UserId = postRequest.UserId,
                CreationDate = postRequest.CreationDate
            };

            await _postService.CreatePostAsync(post);

            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host.ToUriComponent()}";
            var locationUri = baseUrl + "/" + ApiRoutes.Posts.Get.Replace("{postId}", post.Id.ToString());
            var response = _mapper.Map<PostResponse>(post);

            return Created(locationUri, response);
        }
        [HttpPut(ApiRoutes.Posts.Like)]
        public async Task<IActionResult> LikePost([FromQuery] int postId, [FromQuery] int userId)
        {
            var isAlreadyLiked = await _postService.IsPostAlreadyLiked(postId, userId);

            if (isAlreadyLiked)
            {
                return BadRequest(new { error = "Post already liked by this user" });
            }

            var result = await _postService.LikePost(postId, userId);
            if (!result)
            {
                return BadRequest(new { error = "Sth went wrong - add like" });
            }

            return Ok(result);
        }
        [HttpPut(ApiRoutes.Posts.Dislike)]
        public async Task<IActionResult> DislikePost([FromQuery] int postLikeId)
        {
            var result = await _postService.DislikePost(postLikeId);
            if (!result)
            {
                return BadRequest(new { error = "Sth went wrong - add like" });
            }

            return Ok(result);
        }
    }
}