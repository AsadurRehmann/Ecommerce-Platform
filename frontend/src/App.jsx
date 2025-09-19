import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./Pages/Home.jsx";
import { Toaster } from "sonner";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Profile from "./Pages/Profile.jsx";
import CollectionPage from "./Pages/CollectionPage.jsx";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./Pages/OrderConfirmationPage";
import OrderDetailsPage from "./Pages/OrderDetailsPage";
import MyOrdersPage from "./Pages/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminHomePage from "./Pages/AdminHomePage";
import UserManagment from "./components/Admin/UserManagment";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="collections/:collection" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route
            path="order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          {/*user layout*/}
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage/>} />
          <Route path="users" element={<UserManagment/>}/>
          {/* <Route path="orders" element={<AdminOrders />} /> */}
          {/* admin layout */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
