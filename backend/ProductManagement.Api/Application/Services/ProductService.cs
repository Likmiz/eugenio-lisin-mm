namespace ProductManagement.Api.Application.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _dbContext;

    public ProductService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync(string? search, int? categoryId)
    {
        var query = _dbContext.Products
            .Include(p => p.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var lowered = search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(lowered) ||
                p.Description.ToLower().Contains(lowered));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        var products = await query.ToListAsync();

        return products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name ?? string.Empty
        });
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var p = await _dbContext.Products
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (p == null) return null;

        return new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name ?? string.Empty
        };
    }

    public async Task<ProductDto> CreateAsync(ProductCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ArgumentException("Name is required", nameof(dto.Name));

        if (dto.Price <= 0)
            throw new ArgumentException("Price must be greater than 0", nameof(dto.Price));

        var categoryExists = await _dbContext.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
            throw new ArgumentException("Category does not exist", nameof(dto.CategoryId));

        var entity = new Product
        {
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            Price = dto.Price,
            CategoryId = dto.CategoryId
        };

        _dbContext.Products.Add(entity);
        await _dbContext.SaveChangesAsync();

        await _dbContext.Entry(entity).Reference(p => p.Category).LoadAsync();

        return new ProductDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Price = entity.Price,
            CategoryId = entity.CategoryId,
            CategoryName = entity.Category?.Name ?? string.Empty
        };
    }

    public async Task<ProductDto?> UpdateAsync(int id, ProductUpdateDto dto)
    {
        var entity = await _dbContext.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (entity == null) return null;

        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ArgumentException("Name is required", nameof(dto.Name));

        if (dto.Price <= 0)
            throw new ArgumentException("Price must be greater than 0", nameof(dto.Price));

        var categoryExists = await _dbContext.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
            throw new ArgumentException("Category does not exist", nameof(dto.CategoryId));

        entity.Name = dto.Name.Trim();
        entity.Description = dto.Description.Trim();
        entity.Price = dto.Price;
        entity.CategoryId = dto.CategoryId;

        await _dbContext.SaveChangesAsync();

        await _dbContext.Entry(entity).Reference(p => p.Category).LoadAsync();

        return new ProductDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Price = entity.Price,
            CategoryId = entity.CategoryId,
            CategoryName = entity.Category?.Name ?? string.Empty
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _dbContext.Products.FindAsync(id);
        if (entity == null) return false;

        _dbContext.Products.Remove(entity);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}