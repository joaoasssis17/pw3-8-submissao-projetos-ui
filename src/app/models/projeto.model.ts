export type TipoStatus = 'APROVADO' | 'REVISAR';

// Espelha a entidade Projeto do Spring Boot
export interface Projeto {
  id?: number;
  titulo: string;
  areaConhecimento: string;
  notaInovacao?: number | null;
  notaApresentacao?: number | null;
  mediaFinal?: number | null;
  status?: TipoStatus | null;
}

// Espelha o ProjetoDTO usado no PATCH /avaliar
export interface ProjetoDTO {
  notaInovacao: number;
  notaApresentacao: number;
}
