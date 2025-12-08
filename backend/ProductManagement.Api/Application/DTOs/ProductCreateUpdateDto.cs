using System.ComponentModel.DataAnnotations;

namespace ProductManagement.Api.Application.DTOs
{
    public class ProductCreateUpdateDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor que 0.")]
        public decimal Price { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}
