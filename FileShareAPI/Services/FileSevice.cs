using FileShareAPI.Data;
using FileShareAPI.Dtos;
using FileShareAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace FileShareAPI.Services;

public class FileService(ApplicationDbContext db) : IFileService
{
    private readonly ApplicationDbContext _db = db;

    public async Task<FileResponseDto> UploadAsync(IFormFile file, Guid userId)
    {
        var uploadFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "Storage/uploads"
        );

        Directory.CreateDirectory(uploadFolder);

        var storageFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

        var fullPath = Path.Combine(
            uploadFolder,
            storageFileName
        );

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileRecord = new FileRecord
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            OriginalFileName = file.FileName,
            StoredFileName = storageFileName,
            ContentType = file.ContentType,
            Size = file.Length,
        };

        _db.Files.Add(fileRecord);
        await _db.SaveChangesAsync();

        return new FileResponseDto(
            fileRecord.Id,
            fileRecord.OriginalFileName,
            fileRecord.Size,
            fileRecord.DownloadCount
        );
    }

    public async Task<List<FileListDto>> GetFileListAsync(Guid userId)
    {
        var fileList = await _db.Files
            .Where(file => file.UserId == userId)
            .ToListAsync();
        return [.. fileList.Select(f => new FileListDto(
            f.Id,
            f.OriginalFileName,
            f.Size,
            f.DownloadCount
        ))];
    }

    public async Task DeleteFileAsync(Guid id, Guid userId)
    {
        var fileRecord = await _db.Files.FirstOrDefaultAsync(file => file.Id == id && file.UserId == userId);

        if (fileRecord == null)
        {
            throw new FileNotFoundException();
        }

        var fullPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "Storage/uploads",
            fileRecord.StoredFileName
        );

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }

        _db.Files.Remove(fileRecord);

        await _db.SaveChangesAsync();
    }

    public async Task<FileResponseDto?> GetFileAsync(Guid id, Guid userId)
    {
        var filedata = await _db.Files.FirstOrDefaultAsync(file => file.Id == id && file.UserId == userId);
        if (filedata == null) return null;
        return new FileResponseDto(
            filedata.Id,
            filedata.OriginalFileName,
            filedata.Size,
            filedata.DownloadCount
        );
    }

    public async Task<FileRecord?> GetDownloadFileAsync(Guid id, Guid userId)
    {
        var file = await _db.Files.FirstOrDefaultAsync(file => file.Id == id && file.UserId == userId);

        if (file == null)
        {
            return null;
        }

        file.DownloadCount++;

        await _db.SaveChangesAsync();

        return file;
    }

}