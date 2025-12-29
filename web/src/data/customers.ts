export type CustomerSegment = "varejo" | "atacado" | "servicos";
export type CustomerStatus = "ativo" | "inativo";

export interface Customer {
  id: string;
  name: string;
  document: string; // CPF/CNPJ
  email: string;
  phone: string;
  segment: CustomerSegment;
  status: CustomerStatus;
}

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Mercado São João",
    document: "12.345.678/0001-90",
    email: "contato@saojoao.com.br",
    phone: "(11) 98765-4321",
    segment: "varejo",
    status: "ativo",
  },
  {
    id: "c2",
    name: "Distribuidora Boa Vista",
    document: "98.765.432/0001-10",
    email: "vendas@boavista.com.br",
    phone: "(21) 91234-5678",
    segment: "atacado",
    status: "ativo",
  },
  {
    id: "c3",
    name: "Padaria do Centro",
    document: "123.456.789-09",
    email: "contato@padariadocentro.com",
    phone: "(31) 99876-5432",
    segment: "servicos",
    status: "inativo",
  },
];
