import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePages from "./pages/HomePages.jsx";
import CustomLayout from "./components/CustomLayout.jsx";
import "../src/App.css";
import Orders from "./pages/Orders.jsx";
import Invoices from "./pages/Invoices.jsx";
import Taple from "./pages/Taple.jsx";
import MenuPage from "./pages/ItemPages.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import InvoiceDetails from "./pages/InvoiceDetails.jsx";
import TableDetails from "./pages/TableDetails.jsx";
import { ToastContainer } from "react-toastify";
import AddOrder from "./pages/AddOrder.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";  // استوردها
import OneProduct from "./pages/OneProduct.jsx";
import UpdateProduct from "./pages/UpdateProduct.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import AddTaple from "./pages/AddTaple.jsx";
import CreateInvoice from "./pages/CreateInvoice.jsx";
import UpdateTaple from "./pages/UpdateTaple.jsx";
import UpdateOrder from "./pages/UpdateOrder.jsx";
import CloseInvoice from "./pages/CloseInvoice.jsx";
import OrderPrint from "./pages/OrderPrint.jsx";
import EditInvoice from "./pages/EditInvoice.jsx";
import Dashboard from "./pages/Dashboard.jsx";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CustomLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePages />} />

            {/* items section */}
            <Route path="/items" element={<MenuPage />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/product/:id" element={<OneProduct />} />
            <Route path="/update-product/:id" element={<UpdateProduct />} />
            <Route path="/print-order/:id" element={<OrderPrint />} />
            {/* invoice section */}
            <Route path="/editInvoice/:id" element={<EditInvoice />} />
            <Route path="/dashboard" element={<Dashboard />} />


            {/* orders section */}
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/update/:id" element={<UpdateOrder />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/order/add-order" element={<AddOrder />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/:id" element={<CreateInvoice />} />

            {/* taple section */}
            <Route path="/taples" element={<Taple />} />
            <Route path="/addTable" element={<AddTaple />} />
            <Route path="/taple/:id" element={<TableDetails />} />
            <Route path="/taple/update/:id" element={<UpdateTaple />} />
            <Route path="/invoice-details/:id" element={<InvoiceDetails />} />
            <Route path="/closeInvoice/:id" element={<CloseInvoice />} />

          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </>
  );
}

export default App;
