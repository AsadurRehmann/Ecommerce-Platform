import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams,useSearchParams } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { fetchProductsByFilters } from "@/redux/slices/productsSlice";

function CollectionPage() {
  const {collection}=useParams();
  const [searchParams]=useSearchParams();
  const dispatch=useDispatch();
  const {loading,error,products}=useSelector((state)=>state.products);

  const queryParams=Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(()=>{
    dispatch(fetchProductsByFilters({collection,...queryParams}));
  },[dispatch,collection,searchParams]);

  const handleClickOutside = (e) => {
    // close sidebar if clicked outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    // event listner for clicks
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mouse", handleClickOutside);
    };
  });


  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile filter button  */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" /> Filters
      </button>

      {/* filter sidebar  */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300
      lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        {/* sort options  */}
        <SortOptions />
        <ProductGrid products={products} loading={loading} error={error}/>
      </div>
    </div>
  );
}

export default CollectionPage;
