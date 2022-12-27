import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { OpenWorldComponent } from './components/open-world/open-world.component';

const routes: Routes = [
  { path: 'battlefield', component: BattlefieldComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'open-world', component: OpenWorldComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true }
    ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
