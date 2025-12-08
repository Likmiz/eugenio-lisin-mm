using System.ComponentModel.DataAnnotations;

namespace ProductManagement.Api.Application.DTOs
{
    public class ProductUpdateDto
    {
        /// <summary>
        /// Nombre del producto.
        /// </summary>
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [MaxLength(150, ErrorMessage = "El nombre no puede superar los 150 caracteres.")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Descripción del producto.
        /// </summary>
        [Required(ErrorMessage = "La descripción es obligatoria.")]
        [MaxLength(500, ErrorMessage = "La descripción no puede superar los 500 caracteres.")]
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Precio del producto.
        /// </summary>
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor que 0.")]
        public decimal Price { get; set; }

        /// <summary>
        /// Identificador de la categoría.
        /// </summary>
        [Required(ErrorMessage = "La categoría es obligatoria.")]
        public int CategoryId { get; set; }
    }
}