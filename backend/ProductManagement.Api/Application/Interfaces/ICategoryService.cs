using ProductManagement.Api.Application.DTOs;

namespace ProductManagement.Api.Application.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();
}