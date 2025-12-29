export interface ProductData {
  id: string;
  name: string;
  price: number;
  images: string[];
  unit: string;
  description: string;
  details: string[];
}

export const products: ProductData[] = [
  {
    id: "1",
    name: "Café Especial Premium 500g",
    price: 45.9,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop",
    ],
    unit: "Pacote 500g",
    description: "Café 100% arábica, torrado e moído, com sabor intenso e aroma marcante.",
    details: [
      "Origem: Sul de Minas",
      "Torra: Média",
      "Tipo: Arábica 100%",
      "Validade: 12 meses",
    ],
  },
  {
    id: "2",
    name: "Açúcar Refinado 1kg",
    price: 8.5,
    images: [
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1598343672916-cecad6f06f77?w=400&h=400&fit=crop",
    ],
    unit: "Pacote 1kg",
    description: "Açúcar refinado de alta qualidade, ideal para uso culinário e bebidas.",
    details: [
      "Tipo: Refinado",
      "Peso Líquido: 1kg",
      "Validade: 24 meses",
      "Sem glúten",
    ],
  },
  {
    id: "3",
    name: "Leite Integral UHT 1L",
    price: 6.9,
    images: [
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop",
    ],
    unit: "Caixa 1L",
    description: "Leite integral UHT, rico em nutrientes e vitaminas essenciais.",
    details: [
      "Tipo: Integral",
      "Volume: 1 Litro",
      "Validade: 4 meses fechado",
      "Rico em Cálcio",
    ],
  },
  {
    id: "4",
    name: "Arroz Tipo 1 Premium 5kg",
    price: 32.0,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1594312915251-48db9280c8f1?w=400&h=400&fit=crop",
    ],
    unit: "Pacote 5kg",
    description: "Arroz tipo 1, grãos selecionados e uniforme para um cozimento perfeito.",
    details: [
      "Tipo: Agulhinha",
      "Peso: 5kg",
      "Safra: 2024",
      "Grãos Inteiros: 90%",
    ],
  },
  {
    id: "5",
    name: "Feijão Carioca 1kg",
    price: 9.9,
    images: [
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1548062464-c9c6e8e0b72c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1585996965911-42bfdb15c05f?w=400&h=400&fit=crop",
    ],
    unit: "Pacote 1kg",
    description: "Feijão carioca selecionado, cozimento rápido e sabor tradicional.",
    details: [
      "Tipo: Carioca",
      "Peso: 1kg",
      "Safra: 2024",
      "Grãos Selecionados",
    ],
  },
  {
    id: "6",
    name: "Óleo de Soja 900ml",
    price: 7.5,
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1612187279082-f9a129d7f33e?w=400&h=400&fit=crop",
    ],
    unit: "Garrafa 900ml",
    description: "Óleo de soja refinado, ideal para frituras e preparos culinários.",
    details: [
      "Tipo: Refinado",
      "Volume: 900ml",
      "Validade: 12 meses",
      "Livre de Gordura Trans",
    ],
  },
  {
    id: "7",
    name: "Macarrão Espaguete 500g",
    price: 4.5,
    images: [
      "https://images.unsplash.com/photo-1551462147-ff96c27b0f5c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1621996346565-e3dbc353d2c5?w=400&h=400&fit=crop",
    ],
    unit: "Pacote 500g",
    description: "Macarrão espaguete de sêmola, textura al dente perfeita.",
    details: [
      "Tipo: Espaguete",
      "Peso: 500g",
      "Tempo de Cozimento: 8min",
      "Com Ovos",
    ],
  },
  {
    id: "8",
    name: "Molho de Tomate 340g",
    price: 3.9,
    images: [
      "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556909114-44e3e9a3f6c8?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e4?w=400&h=400&fit=crop",
    ],
    unit: "Sachê 340g",
    description: "Molho de tomate tradicional, prático e saboroso para suas receitas.",
    details: [
      "Tipo: Tradicional",
      "Peso: 340g",
      "Validade: 12 meses",
      "Sem Conservantes",
    ],
  },
];

export function getProductById(id: string): ProductData | undefined {
  return products.find((p) => p.id === id);
}
