import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {GhlMarketplaceComponent} from './pages/ghl-marketplace/ghl-marketplace.component';
import {AddAppComponent} from './pages/add-app/add-app.component';

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
  },
  {
    path: 'add-app/:appId',
    component: AddAppComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
