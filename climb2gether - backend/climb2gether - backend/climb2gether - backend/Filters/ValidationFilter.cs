using climb2gether___backend.Contracts.V1.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Filters
{
    public class ValidationFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!context.ModelState.IsValid)
            {
                var errors = context.ModelState
                    .Where(x => x.Value.Errors.Count > 0)
                    .ToDictionary(keyValue => keyValue.Key, keyValue => keyValue.Value.Errors.Select(err => err.ErrorMessage)).ToArray();
                var errResponse = new ErrorResponse();
                foreach(var err in errors)
                {
                    foreach(var subErr in err.Value)
                    {
                        var errModel = new ErrorModel
                        {
                            FieldName = err.Key,
                            FriendlyMessage = subErr
                        };

                        errResponse.Errors.Add(errModel);
                    }
                }
                context.Result = new BadRequestObjectResult(errResponse);
                return;
            }
            await next();
        }
    }
}
