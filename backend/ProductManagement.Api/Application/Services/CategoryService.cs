using Microsoft.EntityFrameworkCore;
using ProductManagement.Api.Application.DTOs;
using ProductManagement.Api.Application.Interfaces;
using ProductManagement.Api.Infrastructure.Data;

namespace ProductManagement.Api.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _dbContext;

    public CategoryService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await _dbContext.Categories
            .OrderBy(c => c.Name)
            .ToListAsync();

        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name
        });
    }
}