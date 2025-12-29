import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: Map<string, CartItem>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  cartItems: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const { toast } = useToast();

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      const existing = newCart.get(product.id);
      if (existing) {
        newCart.set(product.id, {
          ...existing,
          quantity: existing.quantity + quantity,
        });
      } else {
        newCart.set(product.id, { product, quantity });
      }
      return newCart;
    });
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const removeFromCart = (product: Product) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      const existing = newCart.get(product.id);
      if (existing && existing.quantity > 1) {
        newCart.set(product.id, {
          ...existing,
          quantity: existing.quantity - 1,
        });
        toast({
          title: "Quantidade reduzida",
          description: `${product.name} quantidade atualizada.`,
        });
      } else {
        newCart.delete(product.id);
        toast({
          title: "Produto removido",
          description: `${product.name} foi removido do carrinho.`,
        });
      }
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      const existing = newCart.get(productId);
      if (quantity === 0) {
        newCart.delete(productId);
        if (existing) {
          toast({
            title: "Produto removido",
            description: `${existing.product.name} foi removido do carrinho.`,
          });
        }
      } else if (existing) {
        newCart.set(productId, { ...existing, quantity });
        toast({
          title: "Quantidade atualizada",
          description: `${existing.product.name} atualizado para ${quantity} unidades.`,
        });
      }
      return newCart;
    });
  };

  const removeItem = (productId: string) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      const existing = newCart.get(productId);
      newCart.delete(productId);
      if (existing) {
        toast({
          title: "Produto removido",
          description: `${existing.product.name} foi removido do carrinho.`,
        });
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart(new Map());
  };

  const cartItems = Array.from(cart.values());

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
