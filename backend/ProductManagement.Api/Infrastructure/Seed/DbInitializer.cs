using ProductManagement.Api.Domain.Entities;
using ProductManagement.Api.Infrastructure.Data;

namespace ProductManagement.Api.Infrastructure.Seed;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (!context.Categories.Any())
        {
            var categories = new[]
            {
                new Category { Name = "Electrónica" },
                new Category { Name = "Ropa" },
                new Category { Name = "Hogar" }
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }
    }
}
