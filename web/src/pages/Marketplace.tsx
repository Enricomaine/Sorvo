import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { CartSheet } from "@/components/CartSheet";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { fetchItems, ItemDTO } from "@/lib/items";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const [items, setItems] = useState<ItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchItems()
      .then((data) => { if (active) setItems(data); })
      .catch((err) => {
        if (!active) return;
        const msg = err?.message || "Falha ao carregar produtos";
        setError(msg);
        toast({ title: "Erro", description: msg, variant: "destructive" });
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [toast]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return items.filter((it) =>
      `${it.description} ${it.code}`.toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  const handleProductClick = (productId: number | string) => {
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

        {loading && <Card className="p-6 text-center">Carregando produtos...</Card>}
        {error && !loading && <Card className="p-6 text-center text-destructive">{error}</Card>}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!loading && !error && filteredProducts.map((it, index) => {
            const price = (it as any).price ?? it.base_price ?? 0;
            return (
            <div
              key={it.id}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleProductClick(it.id)}
              className="card-elevated overflow-hidden group animate-scale-in cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                {it.main_image_url ? (
                  <img
                    src={it.main_image_url}
                    alt={it.description}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">Sem imagem</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-2">
                  {it.description}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">un</p>
                <p className="text-xl font-bold text-primary">
                  R$ {Number(price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            );
          })}
        </div>

        {!loading && !error && filteredProducts.length === 0 && (
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
