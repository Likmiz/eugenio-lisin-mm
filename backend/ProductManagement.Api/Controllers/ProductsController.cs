namespace ProductManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService productService, ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene el listado de productos.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> Get([FromQuery] string? search, [FromQuery] int? categoryId)
    {
        var products = await _productService.GetAllAsync(search, categoryId);
        return Ok(products);
    }

    /// <summary>
    /// Obtiene un producto por id.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetById(int id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    /// <summary>
    /// Crea un nuevo producto.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create([FromBody] ProductCreateDto dto)
    {
        try
        {
            var created = await _productService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while creating product");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Actualiza un producto existente.
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductDto>> Update(int id, [FromBody] ProductUpdateDto dto)
    {
        try
        {
            var updated = await _productService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while updating product");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Elimina un producto.
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _productService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}