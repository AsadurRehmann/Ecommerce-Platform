import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./Pages/Home.jsx";

const App = () => {
  return (
    <BrowserRouter>
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
