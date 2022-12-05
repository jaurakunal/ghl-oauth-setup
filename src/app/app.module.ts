import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {HttpClientModule} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoaderComponent} from './components/loader/loader.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {GhlAppComponent} from './components/ghl-app/ghl-app.component';
import {GhlMarketplaceComponent} from './pages/ghl-marketplace/ghl-marketplace.component';
import {GhlAppDetailComponent} from './components/ghl-app-detail/ghl-app-detail.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {SearchPipe} from './pages/ghl-marketplace/search.pipe';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import { LocationsComponent } from './components/locations/locations.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoaderComponent,
    GhlAppComponent,
    GhlMarketplaceComponent,
    GhlAppDetailComponent,
    SearchPipe,
    LocationsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatRadioModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    MatListModule,
    MatGridListModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }, {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
