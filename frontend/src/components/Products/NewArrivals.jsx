import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewArrivals() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
        setNewArrivals(response.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleProductClick = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 50);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      const clientWidth = container.clientWidth;
      const rightScrollable = leftScroll + clientWidth < container.scrollWidth - 1;

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();

      // Add touch event listeners for mobile
      container.addEventListener('touchstart', handleMouseDown, { passive: false });
      container.addEventListener('touchmove', handleMouseMove, { passive: false });
      container.addEventListener('touchend', handleMouseUpOrLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButtons);
        container.removeEventListener('touchstart', handleMouseDown);
        container.removeEventListener('touchmove', handleMouseMove);
        container.removeEventListener('touchend', handleMouseUpOrLeave);
      }
    };
  }, [newArrivals]);

  return (
    <section className="py-16 px-4 lg:px-0 overflow-hidden">
      <div className="container mx-auto text-center mb-10 relative">
        <h3 className="text-3xl font-bold mb-4">Explore New Arrivals</h3>
        <p className="text-lg text-gray-800 mb-8">
          Discover the latest styles straight off the runway ,freshly added to
          keep your wardrobe on the cutting edge of fashion.
        </p>
        {/* Scroll buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded border ${
              canScrollLeft
                ? "bg-white text-black"
                : "cursor-not-allowed text-gray-400 bg-gray-200"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded border ${
              canScrollRight
                ? "bg-white text-black"
                : "cursor-not-allowed text-gray-400 bg-gray-200"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>
      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative scrollbar-hide ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <button
              onClick={(e) => handleProductClick(product._id, e)}
              onTouchStart={(e) => e.stopPropagation()}
              className="w-full text-left focus:outline-none"
            >
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className="w-full h-[500px] object-cover rounded-lg pointer-events-none"
                draggable="false"
              />
              <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md text-white/50 p-4 rounded-b-lg">
                <h4 className="font-medium select-none">{product.name}</h4>
                <p className="mt-1 select-none">$ {product.price}</p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NewArrivals;