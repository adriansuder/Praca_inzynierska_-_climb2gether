using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Data;
using climb2gether___backend.Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Swashbuckle.SwaggerUi;
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

        public async Task<bool> AddAttatchments(List<IFormFile> objectFile, string objectTypeName, int objectTypeNumber)
        {
            var assetsPath = "D:\\Repositories\\climb2gether_INZYNIERKA\\climb2gether - frontend\\dist\\climb2gether\\assets";
            var created = 0;
            try
            {
                if (objectFile.Count > 0)
                {
                    if (!Directory.Exists(assetsPath + "\\Upload\\"))
                    {
                        Directory.CreateDirectory(assetsPath + "\\Upload\\");
                    }
                    foreach (var file in objectFile)
                    {
                        var guid = Guid.NewGuid();
                        Directory.CreateDirectory(assetsPath + $"\\Upload\\{guid}\\");
                        using (FileStream fileStream = File.Create(assetsPath + $"\\Upload\\{guid}\\" + file.FileName))
                        {
                            file.CopyTo(fileStream);
                            fileStream.Flush();
                        }
                        var attatchment = new Attatchment
                        {
                            FilePath = $"\\Upload\\{guid}\\" + file.FileName,
                            ObjectTypeName = objectTypeName,
                            ObjectTypeNumber = objectTypeNumber
                        };
                        _dataContext.Attatchments.Add(attatchment);
                    }
                    created = await _dataContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                
            }

            return objectFile.Count == created;
        }
    }
}
