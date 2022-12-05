import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {GhlMarketplaceComponent} from './pages/ghl-marketplace/ghl-marketplace.component';

const routes: Routes = [
  {
    path: '',
    component: GhlMarketplaceComponent
  },
  {
    path: 'marketplace',
    component: GhlMarketplaceComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
