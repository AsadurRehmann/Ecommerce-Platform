import React from "react";
import MyOrdersPage from "./MyOrdersPage";

function Profile() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow mx-auto container p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 md:space-y-0 space-x-6">
          {/* Left content  */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Jhon Doe</h1>
            <p className="text-lg text-gray-600 mb-4">jhondoe@gmail.com</p>
            <button className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
          {/* Right section orders table  */}
          <div className="w-full md:w-2/3 lg-w3/2">
            <MyOrdersPage/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
