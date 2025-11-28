using ProductManagement.Api.Application.DTOs;

namespace ProductManagement.Api.Application.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync(string? search, int? categoryId);
    Task<ProductDto?> GetByIdAsync(int id);
    Task<ProductDto> CreateAsync(ProductCreateDto dto);
    Task<ProductDto?> UpdateAsync(int id, ProductUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}