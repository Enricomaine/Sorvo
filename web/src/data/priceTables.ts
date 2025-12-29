export interface PriceTable {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  itemsCount: number;
  createdAt: string; // ISO date
}

export const priceTables: PriceTable[] = [
  {
    id: "pt1",
    name: "Tabela Padrão",
    description: "Tabela base para varejo",
    active: true,
    itemsCount: 128,
    createdAt: "2025-01-01T10:00:00.000Z",
  },
  {
    id: "pt2",
    name: "Tabela Atacado",
    description: "Descontos progressivos",
    active: true,
    itemsCount: 54,
    createdAt: "2025-02-15T14:30:00.000Z",
  },
  {
    id: "pt3",
    name: "Tabela Serviços",
    description: "Serviços e mão de obra",
    active: false,
    itemsCount: 23,
    createdAt: "2024-11-10T09:20:00.000Z",
  },
];
