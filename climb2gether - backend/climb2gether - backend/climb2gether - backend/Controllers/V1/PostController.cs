﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using climb2gether___backend.Contracts;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Domain;
using climb2gether___backend.Extensions;
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

        public PostController(IPostService postService)
        {
            _postService = postService;
        }
        [HttpGet(ApiRoutes.Posts.GetAll)]
        public async Task<IActionResult> GetAll()
        {
             return Ok(await _postService.GetPostsAsync());
        }

        [HttpPut(ApiRoutes.Posts.Update)]
        public async Task<IActionResult> Update([FromRoute] Guid postId, [FromBody] UpdatePostRequest request)
        {
            var userOwnsPost = await _postService.UserOwnsPost(postId, GetUserId());

            if (!userOwnsPost)
            {
                return BadRequest(new { error = "You do not own this post" });
            }

            var post = await _postService.GetPostByIdAsync(postId);
            post.Name = request.Name;


            var updated = await _postService.UpdatePostAsync(post);
            
            if(updated)
                return Ok(post);

            return NotFound();
        }

        private string GetUserId()
        {
            throw new NotImplementedException();
        }

        [HttpGet(ApiRoutes.Posts.Get)]
        public async Task<IActionResult> Get([FromRoute] Guid postId)
        {
            var post = _postService.GetPostByIdAsync(postId);

            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
        }

        [HttpDelete(ApiRoutes.Posts.Delete)]
        public async Task<IActionResult> Delete([FromRoute] Guid postId)
        {
            var userOwnsPost = await _postService.UserOwnsPost(postId, GetUserId());

            if (!userOwnsPost)
            {
                return BadRequest(new { error = "You do not own this post" });
            }

            var deleted = await _postService.DeletePostAsync(postId);

            if(deleted)
                return NoContent();

            return NotFound();
        }

        [HttpPost(ApiRoutes.Posts.Create)]
        public async Task<IActionResult> Create([FromBody] CreatePostRequest postRequest)
        {
            var post = new Post {
                Name = postRequest.Name,
                UserId = HttpContext.GetUserId()
            };

            await _postService.CreatePostAsync(post);

            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host.ToUriComponent()}";
            var locationUri = baseUrl + "/" + ApiRoutes.Posts.Get.Replace("{postId}", post.Id.ToString());
            var response = new PostResponse { Id = post.Id };

            return Created(locationUri, response);
        }
    }
}