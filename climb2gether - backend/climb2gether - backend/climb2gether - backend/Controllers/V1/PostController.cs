﻿using System;
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
using Microsoft.AspNetCore.Http;

namespace climb2gether___backend.Controllers.V1
{
 
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class PostController : Controller
    {
        private readonly IPostService _postService;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;
        private readonly IFileService _fileService;

        public PostController(IPostService postService, IMapper mapper, IIdentityService identityService, IFileService fileService)
        {
            _postService = postService;
            _mapper = mapper;
            _identityService = identityService;
            _fileService = fileService;
        }
        [HttpGet(ApiRoutes.Posts.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var token = Request.Headers["Authorization"][0].ToString();
            token = token.Substring(token.IndexOf(" ")+1);
            var userId = _identityService.GetUserIdFromJWT(token);

            var posts = await _postService.GetPostsAsync(userId);
    

            return Ok(posts);

        }

        [HttpPut(ApiRoutes.Posts.Update)]
        public async Task<IActionResult> Update([FromRoute] int postId, [FromForm] UpdatePostRequest request)
        {
            var userOwnsPost = await _postService.UserOwnsPost(postId, request.UserId);
            List<IFormFile> files = request.Img;
            if (!userOwnsPost)
            {
                return BadRequest(new { error = "You do not own this post" });
            }

            if(files != null)
            {
                await _fileService.UpdateAttatchments(files, "post", postId);
            }


            var post = await _postService.GetPostByIdAsync(postId);
            post.Title = request.Title;
            post.Subtitle = request.Subtitle;
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
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost(ApiRoutes.Posts.Create)]
        public async Task<IActionResult> Create([FromForm] CreatePostRequest postRequest)
        {
            List<IFormFile> files =  postRequest.Img ;

            var post = new Post(){
            Title = postRequest.Title,
                Subtitle = postRequest.Subtitle,
                Content = postRequest.Content,
                UserId = postRequest.UserId,
                CreationDate = DateTime.UtcNow
            };

            var postId = await _postService.CreatePostAsync(post);
            await _fileService.AddAttatchments(files, "post", postId);

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
            if (result == null)
            {
                return BadRequest(new { error = "Sth went wrong - add like" });
            }

            return Ok(result);
        }
        [HttpPut(ApiRoutes.Posts.Unlike)]
        public async Task<IActionResult> DislikePost([FromQuery] int likeId)
        {   
            var result = await _postService.DislikePost(likeId);
            if (!result)
            {
                return BadRequest(new { error = "Sth went wrong - add like" });
            }

            return Ok(result);
        }
    }
}