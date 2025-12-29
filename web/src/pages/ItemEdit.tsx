import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, ProductData } from "../data/products";
import { ImageSelector, SelectedImage } from "@/components/ui/image-selector";

const ItemEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState<ProductData | null>(null);

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<SelectedImage[]>([]);

  useEffect(() => {
    if (id) {
      const found = getProductById(id);
      setItem(found || null);
    }
  }, [id]);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setUnit(item.unit);
      setPrice(String(item.price));
      setDescription(item.description);
  // Prefill images from product images URLs, set first as primary
  const prefilled = (item.images || []).slice(0, 5).map((url, idx) => ({ id: `${item.id}-${idx}`, url, primary: idx === 0 }));
  setImages(prefilled);
    }
  }, [item]);

  const handleSave = () => {
    if (images.length === 0 || !images.some((i) => i.primary)) {
      return;
    }
    // TODO: integrate with backend
    navigate("/itens");
  };

  const handleCancel = () => navigate("/itens");

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Editar item</h1>
          <p className="text-muted-foreground mt-1">Atualize os dados do item</p>
        </div>

        {item ? (
          <Card className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="unit">Unidade</Label>
                <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <ImageSelector value={images} onChange={setImages} max={5} />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleCancel}>Cancelar</Button>
              <Button className="w-full sm:w-auto" onClick={handleSave}>Salvar</Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 text-center text-muted-foreground">Item não encontrado</Card>
        )}
      </div>
    </AppSidebar>
  );
};

export default ItemEdit;
