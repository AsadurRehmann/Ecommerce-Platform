import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
    const [checkoutId,setCheckoutId]=useState()
  const cart = {
    Products: [
      {
        name: "T-shirt",
        size: "M",
        color: "Red",
        price: 15,
        image: "https://picsum.photos/150?random=1",
      },
      {
        name: "Jeans",
        size: "M",
        color: "Blue",
        price: 20,
        image: "https://picsum.photos/150?random=2",
      },
    ],
    totalPrice: 35,
  };

  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const handleCreateCheckout=(e)=>{
    e.preventDefault();
    // setCheckoutId(1234);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-3 ">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value="user@example.com"
              className="w-full p-2 rounded border"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                className="w-full p-2 rounded border"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                className="w-full p-2 rounded border"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-gray-700 block">Address</h3>
            <input
              type="text"
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 rounded border"
              required
            />
          </div>
          <div className="gap-4 mb-4 grid grid-cols-2">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                className="w-full p-2 rounded border"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                className="w-full p-2 rounded border"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-gray-700 block">Country</h3>
            <input
              type="text"
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 rounded border"
              required
            />
          </div>
          <div className="mb-4">
            <h3 className="text-gray-700 block">Phone</h3>
            <input
              type="text"
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 rounded border"
              required
            />
          </div>

          <div className="mt-6">
            {
                checkoutId ? (
                    <button type="submit" className="w-full bg-black text-white py-3 rounded">Continue to Payment</button>
                ):(
                    <div>
                        <h3 className="text-lg mb-4">Pay with Paypal</h3>
                        {/* paypal component  */}
                    </div>
                )
            }
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
