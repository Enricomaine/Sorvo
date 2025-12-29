import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { CartSheet } from "@/components/CartSheet";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <AppSidebar>
      <div className="p-4 sm:p-6 lg:p-8 animate-fade-in pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Marketplace
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Clique em um produto para ver mais detalhes
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-large pl-12"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleProductClick(product.id)}
              className="card-elevated overflow-hidden group animate-scale-in cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{product.unit}</p>
                <p className="text-xl font-bold text-primary">
                  R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhum produto encontrado para "{searchTerm}"
            </p>
          </div>
        )}

        {/* Cart Sheet */}
        <CartSheet
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onClear={clearCart}
        />
      </div>
    </AppSidebar>
  );
};

export default Marketplace;
