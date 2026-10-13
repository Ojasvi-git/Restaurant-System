import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import CustomerDashboard from "./pages/customer/CustomerDashboard";

function App() {
  return (
  <CartProvider> 
    <div className="min-h-screen bg-white text-gray-900"> 
  <Navbar />


    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/menu" element={<MenuManagement />} />
      <Route path="/customer/dashboard" element={<CustomerDashboard />} />
    </Routes>

    <Footer />
  </div>
  </CartProvider>


  );
}

export default App;
