import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/CartSheet";
import { useCart } from "@/contexts/CartContext";
import { getProductById } from "@/data/products";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity, removeItem, clearCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);

  const productData = getProductById(id || "");

  if (!productData) {
    return (
      <AppSidebar>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Produto não encontrado</h1>
          <Button onClick={() => navigate("/marketplace")} className="mt-4">
            Voltar ao Marketplace
          </Button>
        </div>
      </AppSidebar>
    );
  }

  const product = {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    image: productData.images[0],
    unit: productData.unit,
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate("/marketplace");
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <AppSidebar>
      <div className="p-4 sm:p-6 lg:p-8 animate-fade-in pb-24">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/marketplace")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar ao Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Carousel */}
          <div className="w-full">
            <Carousel className="w-full">
              <CarouselContent>
                {productData.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                      <img
                        src={image}
                        alt={`${productData.name} - Imagem ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>

            {/* Thumbnail Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {productData.images.map((image, index) => (
                <div
                  key={index}
                  className="w-16 h-16 rounded-lg overflow-hidden border-2 border-muted hover:border-primary transition-colors cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {productData.name}
            </h1>
            <p className="text-muted-foreground mb-4">{productData.unit}</p>
            
            <p className="text-3xl font-bold text-primary mb-6">
              R$ {productData.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>

            <p className="text-foreground/80 mb-6 text-lg leading-relaxed">
              {productData.description}
            </p>

            {/* Details */}
            <div className="mb-8">
              <h3 className="font-semibold text-foreground mb-3 text-lg">Detalhes do Produto</h3>
              <ul className="space-y-2">
                {productData.details.map((detail, index) => (
                  <li key={index} className="flex items-center text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-foreground font-medium">Quantidade:</span>
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  className="h-10 w-10 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  className="h-10 w-10 hover:bg-primary/10 hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button onClick={handleAddToCart} size="lg" className="w-full sm:w-auto text-lg h-14">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>

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

export default ProductDetail;
