using Microsoft.EntityFrameworkCore;
using ProductManagement.Api.Domain.Entities;

namespace ProductManagement.Api.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Category");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Product");
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(p => p.Description)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            entity.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}