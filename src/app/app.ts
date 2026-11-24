import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjetoService } from './services/projeto.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private service = inject(ProjetoService);

  ngOnInit() {
    this.service.listar().subscribe(projetos => console.log(projetos));
  }
}
