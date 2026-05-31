using FileShareAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using FileShareAPI.Services;

namespace FileShareAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FileController : ControllerBase
{
    private readonly IFileService _fileService;

    public FileController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("API Working...");
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file Uploaded");
        }

        var fileRecord = await _fileService.UploadAsync(file);
        return Ok(fileRecord);
    }

    [HttpGet]
    public async Task<ActionResult> FileList()
    {
        var fileList = await _fileService.GetFileListAsync();
        return Ok(fileList);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> Getfile(Guid id)
    {
        var filedata = await _fileService.GetFileAsync(id);

        if (filedata == null)
        {
            return NotFound("File not found");
        }

        return Ok(filedata);
    }

    [HttpGet("download/{id}")]
    public async Task<ActionResult> DownloadFile(Guid id)
    {
        var file = await _fileService.GetDownloadFileAsync(id);

        if (file == null)
        {
            return NotFound("File not found");
        }

        var fullPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "Storage/uploads",
            file.StoredFileName
        );

        if (!System.IO.File.Exists(fullPath))
        {
            return NotFound("File does not exist");
        }

        Response.Headers.CacheControl = "no-store";

        return PhysicalFile(
            fullPath,
            file.ContentType,
            file.OriginalFileName
        );
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFile(Guid id)
    {
        try
        {
            await _fileService.DeleteFileAsync(id);

            return Ok("File deleted successfully.");
        }
        catch (FileNotFoundException)
        {
            return NotFound("File not found.");
        }
    }
}