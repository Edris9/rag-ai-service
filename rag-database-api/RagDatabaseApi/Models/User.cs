namespace RagDatabaseApi.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<Document> Documents { get; set; } = new List<Document>();
    public ICollection<ChatHistory> ChatHistories { get; set; } = new List<ChatHistory>();
}