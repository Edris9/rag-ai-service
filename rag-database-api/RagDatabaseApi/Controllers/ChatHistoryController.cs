using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RagDatabaseApi.Data;
using RagDatabaseApi.DTOs;
using RagDatabaseApi.Models;

namespace RagDatabaseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatHistoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public ChatHistoryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<ChatResponseDto>> Create(CreateChatDto dto)
    {
        var chat = new ChatHistory
        {
            Question = dto.Question,
            Answer = dto.Answer,
            UserId = dto.UserId
        };

        _context.ChatHistories.Add(chat);
        await _context.SaveChangesAsync();

        return Ok(new ChatResponseDto
        {
            Id = chat.Id,
            Question = chat.Question,
            Answer = chat.Answer,
            CreatedAt = chat.CreatedAt
        });
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<ChatResponseDto>>> GetByUser(int userId)
    {
        var chats = await _context.ChatHistories
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ChatResponseDto
            {
                Id = c.Id,
                Question = c.Question,
                Answer = c.Answer,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(chats);
    }
}