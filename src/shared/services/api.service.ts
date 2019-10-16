import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IWeather } from '../models/IWeather.model';
import { ICity } from '../models/ICity.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  currentCity:ICity;
  currentConditions: IWeather;
  searchText: string = '';
  errorCode:string;
  // apiKey = "BX5B2IpMXvd87AQCjBinaCW2PXLxfzdW"
  apiKey="oC8qGK1amMvNHB2UgBbmQDqPq9E8M49s"
  baseUrl = "https://dataservice.accuweather.com"
  errorMsg:string;

  constructor(private http: HttpClient,private router:Router) { 
  }


  autocompleteCity(cityName: string): Observable<ICity> {
    return this.http.get<ICity>(`${this.baseUrl}/locations/v1/cities/autocomplete?apikey=${this.apiKey}&q=${cityName}`);
    // 
    // "http://localhost:4200/assets/fakeResponce/autoComplete.json"
  }

  getCurrentConditions(key: string): Observable<IWeather> {
    return this.http.get<IWeather>(`${this.baseUrl}/currentconditions/v1/${key}?apikey=${this.apiKey}`);
    // 
    // "http://localhost:4200/assets/fakeResponce/currentCondition.json"
  }

  get5DayForcasts(key: string, ): Observable<any> {
  
    return this.http.get<any>(`${this.baseUrl}/forecasts/v1/daily/5day/${key}?apikey=${this.apiKey}&metric=true`);
    
   //  "http://localhost:4200/assets/fakeResponce/fiveDay.json"
  }
  getCityByKey(key:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/locations/v1/${key}?apikey=${this.apiKey}`);
  }

  handleError(errorMsg:string){
    this.errorMsg=errorMsg;
    console.error(errorMsg);
    this.router.navigate(['/error'])
  }

}

