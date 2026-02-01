import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { fetchItem, removeItemImage, setItemMainImage, updateItem } from "@/lib/items";
import { ImageSelector, SelectedImage } from "@/components/ui/image-selector";
import { useToast } from "@/hooks/use-toast";

const ItemEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [initialImageIds, setInitialImageIds] = useState<string[]>([]);
  const [mainImageFromServer, setMainImageFromServer] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchItem(id)
      .then((data) => {
        setName(data.code || "");
        setDescription(data.description || "");
        setUnit("");
        setPrice(data.base_price != null ? String(data.base_price) : "");
        setMainImageFromServer(data.main_image?.url || null);
        const remoteImgs: SelectedImage[] = [
          ...(data.main_image?.url
            ? [{ id: "main", url: data.main_image.url, primary: true } as SelectedImage]
            : []),
          ...data.images.map((img) => ({ id: String(img.id), url: img.url })),
        ];
        // ensure only one marked primary (main image)
        const normalized = remoteImgs.map((img, idx) => ({ ...img, primary: idx === 0 }));
        setImages(normalized);
        setInitialImageIds(remoteImgs.map((i) => i.id));
      })
      .catch((err: any) => {
        toast({ title: "Erro", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [id, toast]);

  const handleSave = async () => {
    if (!id) return;
  const primary = images.find((i) => i.primary);
  if (!primary && images.length > 0) {
      toast({ title: "Imagem principal", description: "Selecione uma imagem principal.", variant: "destructive" });
      return;
    }
    const base_price = Number(String(price).replace(/[^0-9.,]/g, "").replace(".", "").replace(",", "."));
    if (!name.trim() || isNaN(base_price)) {
      toast({ title: "Campos inválidos", description: "Preencha nome e preço válidos.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const currentIds = images.filter((i) => !i.file).map((i) => i.id);
      const removedIds = initialImageIds.filter((rid) => !currentIds.includes(rid));
      const removedMain = removedIds.includes("main");
      for (const rid of removedIds) {
        if (rid !== "main") {
          await removeItemImage(id, rid);
        }
      }

      const newMainFile = primary?.file;
      // If user removed old main, we should purge it rather than demote
      if (!removedMain && primary && !newMainFile && primary.id !== "main") {
        await setItemMainImage(id, primary.id);
      }
      const additionalFiles = images
        .filter((i) => i.file && (!primary || i.id !== primary.id))
        .map((i) => i.file!)

      await updateItem(id, {
        code: name.trim(),
        description,
        base_price,
        active: true,
        ...(images.length === 0 || removedMain
          ? { main_image: "" }
          : newMainFile
            ? { main_image: newMainFile }
            : {}),
        images: additionalFiles,
      });
      toast({ title: "Item atualizado", description: "As alterações foram salvas." });
      navigate("/itens");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/itens");

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Editar item</h1>
          <p className="text-muted-foreground mt-1">Atualize os dados do item</p>
        </div>

    {!loading ? (
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
        <Button className="w-full sm:w-auto" onClick={handleSave} disabled={saving}>Salvar</Button>
            </div>
          </Card>
        ) : (
      <Card className="p-6 text-center text-muted-foreground">Carregando...</Card>
        )}
      </div>
    </AppSidebar>
  );
};

export default ItemEdit;
