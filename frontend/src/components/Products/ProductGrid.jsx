import { Link, useNavigate } from "react-router-dom";

function ProductGrid({ products, loading, error }) {
  const navigate = useNavigate();

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error loading products: {error}</p>;
  }

  const handleProductClick = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    // Use setTimeout to prevent scroll jumps
    setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 50);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 py-4">
      {products.map((product, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <button
            onClick={(e) => handleProductClick(product._id, e)}
            onTouchStart={(e) => e.stopPropagation()}
            className="w-full text-left focus:outline-none select-none"
          >
            <div className="w-full h-96 mb-4">
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="w-full rounded-lg h-full object-cover pointer-events-none"
                draggable="false"
              />
            </div>
            <h3 className="text-sm mb-2 select-none">{product.name}</h3>
            <p className="text-gray-500 font-medium text-sm tracking-tighter select-none">
              $ {product.price}
            </p>
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;