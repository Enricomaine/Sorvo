import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ImageSelector, SelectedImage } from "@/components/ui/image-selector";

const ItemCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<SelectedImage[]>([]);

  const handleSave = () => {
    if (images.length === 0 || !images.some((i) => i.primary)) {
      // Minimal validation: require at least one primary image
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Cadastrar item</h1>
          <p className="text-muted-foreground mt-1">Preencha os dados do item</p>
        </div>

  <Card className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do item" />
            </div>
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Ex: Pacote 1kg" />
            </div>
            <div>
              <Label htmlFor="price">Preço</Label>
              <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 19,90" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes do item" />
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
      </div>
    </AppSidebar>
  );
};

export default ItemCreate;
