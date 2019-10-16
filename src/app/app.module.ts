import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule,
  MatCardModule,
  MatToolbarModule,
  MatChipsModule,
  MatButtonToggleModule,
  MatSlideToggleModule,
  MatTableModule,
} from "@angular/material";
import { SearchBoxComponent } from './search-box/search-box.component';
import { WeatherComponent } from './weather/weather.component';
import { ForecastsComponent } from './forecasts/forecasts.component';
import { FavoritesComponent } from './favorites/favorites.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { StoreModule } from '@ngrx/store';
import { tempUnitReducer, currentConditionsReducer } from './stateManagment/reducers';
import { ExceptionsComponent } from './exceptions/exceptions.component';


export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home/:cityKey", component: SearchBoxComponent },
  { path: "favorites", component: FavoritesComponent },
  { path: "home", component: SearchBoxComponent },
  { path:"weather",component: WeatherComponent},
  { path: "error", component: ExceptionsComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    SearchBoxComponent,
    WeatherComponent,
    ForecastsComponent,
    FavoritesComponent,
    ExceptionsComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({changeTempUnit:tempUnitReducer,setCurrentConditions:currentConditionsReducer}),
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatCardModule,
    MatToolbarModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
