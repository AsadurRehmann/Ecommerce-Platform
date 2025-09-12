import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./Pages/Home.jsx";
import {Toaster} from "sonner";

const App = () => {
  return (
    <BrowserRouter>
    <Toaster position="top-right"/>
      <Routes>
        <Route path="/" element={<UserLayout />}>
        <Route index element={<Home/>} />
          {/*user lauout*/}
        </Route>
        <Route>{/*Admin lauout*/}</Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
