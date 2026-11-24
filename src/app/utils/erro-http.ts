import { HttpErrorResponse } from '@angular/common/http';

export function mensagemDeErro(erro: HttpErrorResponse, padrao: string): string {
  if (erro.status === 0) {
    return 'Não foi possível conectar ao servidor. Tente novamente mais tarde ';
  }
  return erro.error?.mensagem ?? padrao;
}