export interface Veiculo {
  id: number;
  marca: number;
  nome_marca: string;
  modelo: string;
  ano: number;
  cor: number;
  nome_cor: string;
  combustivel: number;
  nome_combustivel: string;
  foto: string | null;
}