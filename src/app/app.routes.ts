import { Routes } from '@angular/router';
import { ProjetoList } from './pages/projeto-list/projeto-list';
import { ProjetoForm } from './pages/projeto-form/projeto-form';

export const routes: Routes = [
    { path: '', redirectTo: 'projetos', pathMatch: 'full' },
    { path: 'projetos', component: ProjetoList },
    { path: 'projetos/novo', component: ProjetoForm },
    { path: 'projetos/editar/:id', component: ProjetoForm }
];
