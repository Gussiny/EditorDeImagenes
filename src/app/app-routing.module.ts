import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'editor',
    loadChildren: () => import('./pages/editor/editor.module').then( m => m.EditorPageModule)
  },
  {
    path: 'guardar',
    loadChildren: () => import('./pages/guardar/guardar.module').then( m => m.GuardarPageModule)
  },
  {
    path: 'filtros',
    loadChildren: () => import('./pages/filtros/filtros.module').then( m => m.FiltrosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
