using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RagDatabaseApi.Data;
using RagDatabaseApi.DTOs;
using RagDatabaseApi.Models;

namespace RagDatabaseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public DocumentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<DocumentResponseDto>> Create(CreateDocumentDto dto)
    {
        var document = new Document
        {
            DocumentId = dto.DocumentId,
            Filename = dto.Filename,
            ChunksCount = dto.ChunksCount,
            UserId = dto.UserId
        };

        _context.Documents.Add(document);
        await _context.SaveChangesAsync();

        return Ok(new DocumentResponseDto
        {
            Id = document.Id,
            DocumentId = document.DocumentId,
            Filename = document.Filename,
            ChunksCount = document.ChunksCount,
            UploadedAt = document.UploadedAt
        });
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<DocumentResponseDto>>> GetByUser(int userId)
    {
        var documents = await _context.Documents
            .Where(d => d.UserId == userId)
            .Select(d => new DocumentResponseDto
            {
                Id = d.Id,
                DocumentId = d.DocumentId,
                Filename = d.Filename,
                ChunksCount = d.ChunksCount,
                UploadedAt = d.UploadedAt
            })
            .ToListAsync();

        return Ok(documents);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var document = await _context.Documents.FindAsync(id);
        if (document == null) return NotFound();

        _context.Documents.Remove(document);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}