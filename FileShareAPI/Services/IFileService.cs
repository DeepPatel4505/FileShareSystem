using FileShareAPI.Dtos;
using FileShareAPI.Models;

namespace FileShareAPI.Services;

public interface IFileService
{
    Task<FileResponseDto> UploadAsync(IFormFile file, Guid userId);
    Task<List<FileListDto>> GetFileListAsync(Guid userId);
    Task DeleteFileAsync(Guid id, Guid userId);
    Task<FileResponseDto?> GetFileAsync(Guid id, Guid userId);

    Task<FileRecord?> GetDownloadFileAsync(Guid id, Guid userId);
}