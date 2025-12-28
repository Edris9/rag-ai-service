using Microsoft.EntityFrameworkCore;
using RagDatabaseApi.Models;

namespace RagDatabaseApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<ChatHistory> ChatHistories { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
            
        modelBuilder.Entity<Document>()
            .HasIndex(d => d.DocumentId)
            .IsUnique();
    }
}