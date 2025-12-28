namespace RagDatabaseApi.Models;

public class Document
{
    public int Id { get; set; }
    public string DocumentId { get; set; } = string.Empty;
    public string Filename { get; set; } = string.Empty;
    public int ChunksCount { get; set; }
    public int UserId { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    
    public User? User { get; set; }
}