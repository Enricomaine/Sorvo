export interface SellerData {
  id: string;
  name: string;
  document: string; // CPF/CNPJ
  email: string;
  phone: string;
  region: string;
  status: "ativo" | "inativo";
}

export const sellers: SellerData[] = [
  {
    id: "s1",
    name: "Ana Souza",
    document: "123.456.789-00",
    email: "ana@sorvo.com",
    phone: "(11) 99999-0001",
    region: "SP - Capital",
    status: "ativo",
  },
  {
    id: "s2",
    name: "Bruno Lima",
    document: "987.654.321-00",
    email: "bruno@sorvo.com",
    phone: "(21) 98888-0002",
    region: "RJ - Capital",
    status: "ativo",
  },
  {
    id: "s3",
    name: "Carla Mendes",
    document: "12.345.678/0001-99",
    email: "carla@sorvo.com",
    phone: "(31) 97777-0003",
    region: "MG - Belo Horizonte",
    status: "inativo",
  },
];
