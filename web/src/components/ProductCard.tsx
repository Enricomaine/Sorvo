import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  unit: string;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove,
  onUpdateQuantity,
}: ProductCardProps) {
  return (
    <div className="card-elevated overflow-hidden group animate-scale-in">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{product.unit}</p>
        <p className="text-xl font-bold text-primary mb-4">
          R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>

        {quantity === 0 ? (
          <Button
            onClick={onAdd}
            className="w-full h-11 text-base font-medium"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Adicionar
          </Button>
        ) : (
          <div className="flex items-center justify-between gap-2 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onUpdateQuantity(Math.max(0, val));
              }}
              className="w-16 text-center text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
              min="0"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onAdd}
              className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
