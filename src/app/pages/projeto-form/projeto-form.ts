import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Projeto } from '../../models/projeto.model';
import { ProjetoService } from '../../services/projeto.service';
import { mensagemDeErro } from '../../utils/erro-http';

@Component({
  selector: 'app-projeto-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './projeto-form.html',
  styleUrl: './projeto-form.css'
})
export class ProjetoForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ProjetoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  salvando = signal(false);
  mensagem = signal('');
  tipoMensagem = signal<'sucesso' | 'erro' | ''>('');

  form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    areaConhecimento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]]
  });

  get editando(): boolean {
    return this.id !== null;
  }

  ngOnInit(): void {
    const idRota = this.route.snapshot.paramMap.get('id');
    if (idRota) {
      this.id = Number(idRota);
      this.carregar(this.id);
    }
  }


  private carregar(id: number): void {
    this.service.buscarPorId(id).subscribe({
      next: projeto =>
        this.form.patchValue({
          titulo: projeto.titulo,
          areaConhecimento: projeto.areaConhecimento
        }),
      error: (erro) => this.mostrar('erro', mensagemDeErro(erro, 'Projeto não encontrado.'))
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mostrar('erro', 'Corrija os campos destacados antes de salvar.');
      return;
    }

    const dados: Projeto = this.form.getRawValue();
    this.salvando.set(true);

    const requisicao = this.editando
      ? this.service.atualizar(this.id!, dados)
      : this.service.cadastrar(dados);

    requisicao.subscribe({
      next: () => {
        this.salvando.set(false);
        this.mostrar(
          'sucesso',
          this.editando ? 'Projeto atualizado com sucesso!' : 'Projeto cadastrado com sucesso!'
        );
        setTimeout(() => this.router.navigate(['/projetos']), 1200);
      },
      error: (erro) => {
        this.salvando.set(false);
        this.mostrar('erro', mensagemDeErro(erro, 'Erro ao salvar o projeto.'));
      }
    });
  }


  invalido(campo: 'titulo' | 'areaConhecimento'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  private mostrar(tipo: 'sucesso' | 'erro', texto: string): void {
    this.tipoMensagem.set(tipo);
    this.mensagem.set(texto);
  }
}
