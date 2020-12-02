using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Data;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public class FileService : IFileService
    {
        private readonly DataContext _dataContext;
        private static IWebHostEnvironment _webHostEnviorment;

        public FileService(DataContext dataContext, IWebHostEnvironment webHostEnvironment)
        {
            _dataContext = dataContext;
            _webHostEnviorment = webHostEnvironment;
        }

        public async Task<bool> AddAttatchment(FileUploadRequest objectFile)
        {
            var created = 0;
            try
            {
                if (objectFile.files.Length > 0)
                {
                    if (!Directory.Exists(_webHostEnviorment.ContentRootPath + "\\Upload\\"))
                    {
                        Directory.CreateDirectory(_webHostEnviorment.ContentRootPath + "\\Upload\\");
                    }
                    foreach (var file in objectFile.files)
                    {
                        var guid = Guid.NewGuid();
                        Directory.CreateDirectory(_webHostEnviorment.ContentRootPath + $"\\Upload\\{guid}\\");
                        using (FileStream fileStream = System.IO.File.Create(_webHostEnviorment.ContentRootPath + $"\\Upload\\{guid}\\" + file.FileName))
                        {

                            file.CopyTo(fileStream);
                            fileStream.Flush();
                        }
                        created++;
                    }

                }
            }
            catch (Exception ex)
            {
                
            }

            return objectFile.files.Length == created;
        }
    }
}
