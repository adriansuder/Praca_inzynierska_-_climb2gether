using AutoMapper;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Domain;
using Swashbuckle.Swagger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.AutoMapper
{
    public class RequestToDomain : Profile
    {
        public RequestToDomain()
        {
            CreateMap<CreateExpeditionRequest, Expedition>();
            CreateMap<AddExpeditionEnrollmentRequest, ExpeditionEnrollment>();
        }
    }
}
