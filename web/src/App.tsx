import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/clientes" element={<Customers />} />
            <Route path="/esqueci-senha" element={<ForgotPassword />} />
            <Route path="/recuperar-senha" element={<ResetPassword />} />
            <Route path="/primeiro-acesso" element={<FirstAccess />} />
            <Route path="/pedido/:id" element={<OrderView />} />
            <Route path="/meus-pedidos" element={<MyOrders />} />
            <Route path="/meus-pedidos/:id" element={<OrderReadOnly />} />
            <Route path="/clientes/novo" element={<CustomerCreate />} />
            <Route path="/clientes/:id/editar" element={<CustomerEdit />} />
            <Route path="/itens" element={<Items />} />
            <Route path="/itens/novo" element={<ItemCreate />} />
            <Route path="/itens/:id/editar" element={<ItemEdit />} />
            <Route path="/tabelas-preco" element={<PriceTables />} />
            <Route path="/tabelas-preco/nova" element={<PriceTableCreate />} />
            <Route path="/tabelas-preco/:id/editar" element={<PriceTableEdit />} />
            <Route path="/vendedores" element={<Sellers />} />
            <Route path="/vendedores/novo" element={<SellerCreate />} />
            <Route path="/vendedores/:id/editar" element={<SellerEdit />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
