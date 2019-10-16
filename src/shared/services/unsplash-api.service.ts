import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnsplashApiService {
imageUrl:string;
baseUrl="https://api.unsplash.com"
clientId="ec1b906f27ee38863a055285dbf8d5160cb2bbd7caf2b23087dfcf73c96a4ca0"
  constructor(private http:HttpClient) { }

  search(cityName:string):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/search/photos?query=${cityName}&client_id=${this.clientId}`)
}
}
