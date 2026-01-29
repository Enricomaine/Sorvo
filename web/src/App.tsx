import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Marketplace from "./pages/Marketplace.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import Customers from "./pages/Customers.tsx";
import CustomerCreate from "./pages/CustomerCreate.tsx";
import CustomerEdit from "./pages/CustomerEdit.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import FirstAccess from "./pages/FirstAccess.tsx";
import OrderView from "./pages/OrderView.tsx";
import MyOrders from "./pages/MyOrders.tsx";
import OrderReadOnly from "./pages/OrderReadOnly.tsx";
import Items from "./pages/Items.tsx";
import ItemCreate from "./pages/ItemCreate.tsx";
import ItemEdit from "./pages/ItemEdit.tsx";
import PriceTables from "./pages/PriceTables.tsx";
import PriceTableCreate from "./pages/PriceTableCreate.tsx";
import PriceTableEdit from "./pages/PriceTableEdit.tsx";
import Sellers from "./pages/Sellers.tsx";
import SellerCreate from "./pages/SellerCreate.tsx";
import SellerEdit from "./pages/SellerEdit.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/clientes" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              <Route path="/recuperar-senha" element={<ResetPassword />} />
              <Route path="/primeiro-acesso" element={<FirstAccess />} />
              <Route path="/pedido/:id" element={<ProtectedRoute><OrderView /></ProtectedRoute>} />
              <Route path="/meus-pedidos" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="/meus-pedidos/:id" element={<ProtectedRoute><OrderReadOnly /></ProtectedRoute>} />
              <Route path="/clientes/novo" element={<ProtectedRoute><CustomerCreate /></ProtectedRoute>} />
              <Route path="/clientes/:id/editar" element={<ProtectedRoute><CustomerEdit /></ProtectedRoute>} />
              <Route path="/itens" element={<ProtectedRoute><Items /></ProtectedRoute>} />
              <Route path="/itens/novo" element={<ProtectedRoute><ItemCreate /></ProtectedRoute>} />
              <Route path="/itens/:id/editar" element={<ProtectedRoute><ItemEdit /></ProtectedRoute>} />
              <Route path="/tabelas-preco" element={<ProtectedRoute><PriceTables /></ProtectedRoute>} />
              <Route path="/tabelas-preco/nova" element={<ProtectedRoute><PriceTableCreate /></ProtectedRoute>} />
              <Route path="/tabelas-preco/:id/editar" element={<ProtectedRoute><PriceTableEdit /></ProtectedRoute>} />
              <Route path="/vendedores" element={<ProtectedRoute><Sellers /></ProtectedRoute>} />
              <Route path="/vendedores/novo" element={<ProtectedRoute><SellerCreate /></ProtectedRoute>} />
              <Route path="/vendedores/:id/editar" element={<ProtectedRoute><SellerEdit /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
