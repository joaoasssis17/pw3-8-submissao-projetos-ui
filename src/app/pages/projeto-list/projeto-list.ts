import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Projeto } from '../../models/projeto.model';
import { ProjetoService } from '../../services/projeto.service';
import { mensagemDeErro } from '../../utils/erro-http';

@Component({
  selector: 'app-projeto-list',
  imports: [RouterLink],
  templateUrl: './projeto-list.html',
  styleUrl: './projeto-list.css'
})
export class ProjetoList implements OnInit {
  private service = inject(ProjetoService);

  projetos = signal<Projeto[]>([]);
  feedback = signal<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  ngOnInit(): void {
    this.carregar();
  }


  carregar(): void {
    this.service.listar().subscribe({
      next: dados => this.projetos.set(dados),
      error: erro => this.mostrar('erro', mensagemDeErro(erro, 'Não foi possível carregar os projetos.'))
    });
  }

  avaliar(projeto: Projeto, notaInovacao: string, notaApresentacao: string): void {
    this.feedback.set(null);

    if (notaInovacao === '' || notaApresentacao === '') {
      this.mostrar('erro', 'Informe as duas notas antes de avaliar.');
      return;
    }

    this.service
      .avaliar(projeto.id!, {
        notaInovacao: Number(notaInovacao),
        notaApresentacao: Number(notaApresentacao)
      })
      .subscribe({
        next: atualizado => {
          this.mostrar('sucesso', `Projeto "${atualizado.titulo}" avaliado: ${atualizado.status}.`);
          this.carregar();
        },
        error: erro => this.mostrar('erro', mensagemDeErro(erro, 'Erro ao avaliar o projeto.'))
      });
  }

                 
  excluir(projeto: Projeto): void {
    this.feedback.set(null);

    if (!confirm(`Excluir o projeto "${projeto.titulo}"?`)) {
      return;
    }

    this.service.excluir(projeto.id!).subscribe({
      next: () => {
        this.projetos.update(lista => lista.filter(p => p.id !== projeto.id));
        this.mostrar('sucesso', 'Projeto excluído com sucesso.');
      },
      error: erro => this.mostrar('erro', mensagemDeErro(erro, 'Erro ao excluir o projeto.'))
    });
  }

  fecharFeedback(): void {
    this.feedback.set(null);
  }

  private mostrar(tipo: 'sucesso' | 'erro', texto: string): void {
    this.feedback.set({ tipo, texto });
  }
}