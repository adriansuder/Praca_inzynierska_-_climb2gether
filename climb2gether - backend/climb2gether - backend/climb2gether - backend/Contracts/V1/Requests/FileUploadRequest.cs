using Microsoft.AspNetCore.Http;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class FileUploadRequest
    {
        public IFormFile file { get; set; }
    }
}
