using FileShareAPI.Dtos;
using FileShareAPI.Models;

namespace FileShareAPI.Services;

public interface IFileService
{
    Task<FileResponseDto> UploadAsync(IFormFile file);
    Task<List<FileListDto>> GetFileListAsync();
    Task DeleteFileAsync(Guid id);
    Task<FileResponseDto?> GetFileAsync(Guid id);

    Task<FileRecord?> GetDownloadFileAsync(Guid id);
}