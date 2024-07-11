import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { authGuard } from './shared-auth/auth.guard';
import { unauthGuard } from './shared-auth/unauth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [unauthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [unauthGuard] },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [unauthGuard],
  },
  {
    path: 'administrator',
    canActivate: [authGuard],
    loadChildren: () =>
      import(
        './administrator/administrator-base/administrator-base.module'
      ).then((m) => m.AdministratorBaseModule),
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./reports/reports-base/reports-base.module').then(
        (m) => m.ReportsBaseModule
      ),
  },
  {
    path: 'archive',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./archive/archive-base/archive-base.module').then(
        (m) => m.ArchiveBaseModule
      ),
  },
  {
    path: 'current-report',
    canActivate: [authGuard],
    loadChildren: () =>
      import(
        './current-reports/current-reports-base/current-reports-base.module'
      ).then((m) => m.CurrentReportsBaseModule),
  },
  { path: '**', component: NotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
