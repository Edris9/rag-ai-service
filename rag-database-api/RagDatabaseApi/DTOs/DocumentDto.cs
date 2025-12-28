namespace RagDatabaseApi.DTOs;

public class CreateDocumentDto
{
    public string DocumentId { get; set; } = string.Empty;
    public string Filename { get; set; } = string.Empty;
    public int ChunksCount { get; set; }
    public int UserId { get; set; }
}

public class DocumentResponseDto
{
    public int Id { get; set; }
    public string DocumentId { get; set; } = string.Empty;
    public string Filename { get; set; } = string.Empty;
    public int ChunksCount { get; set; }
    public DateTime UploadedAt { get; set; }
}