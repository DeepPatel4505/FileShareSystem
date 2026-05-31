using FileShareAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using FileShareAPI.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace FileShareAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FileController : ControllerBase
{
    private readonly IFileService _fileService;

    public FileController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpGet("test")]
    [AllowAnonymous]
    public IActionResult Test()
    {
        return Ok("API Working...");
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest("No file Uploaded");
        }

        var fileRecord = await _fileService.UploadAsync(file, userId.Value);
        return Ok(fileRecord);
    }

    [HttpGet]
    public async Task<ActionResult> FileList()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var fileList = await _fileService.GetFileListAsync(userId.Value);
        return Ok(fileList);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> Getfile(Guid id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var filedata = await _fileService.GetFileAsync(id, userId.Value);

        if (filedata == null)
        {
            return NotFound("File not found");
        }

        return Ok(filedata);
    }

    [HttpGet("download/{id}")]
    public async Task<ActionResult> DownloadFile(Guid id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var file = await _fileService.GetDownloadFileAsync(id, userId.Value);

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
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        try
        {
            await _fileService.DeleteFileAsync(id, userId.Value);

            return Ok("File deleted successfully.");
        }
        catch (FileNotFoundException)
        {
            return NotFound("File not found.");
        }
    }

    private Guid? GetCurrentUserId()
    {
        var userIdValue = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(userIdValue, out var userId) ? userId : null;
    }
}