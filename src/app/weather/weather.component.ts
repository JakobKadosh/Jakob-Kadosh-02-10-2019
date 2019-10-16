import { Component, OnInit } from '@angular/core';
import { ICity } from 'src/shared/models/ICity.model';
import { IWeather } from 'src/shared/models/IWeather.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/shared/services/api.service';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SET_CURRENT_CONDITIONS } from '../stateManagment/actions';
import { UnsplashApiService } from 'src/shared/services/unsplash-api.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  isLoading = false;
  isPicLaoding = false;
  currentConditions: IWeather;
  favoritCity: number;
  cityKey: string;
  favorites: string[];
  currentCity: ICity;
  errorMsg: string;
  changeTempUnit$: Observable<string>;
  setCurrentConditions$: Observable<any>;
  imageUrl: string;

  constructor(private store: Store<{ changeTempUnit: string, setCurrentConditions: any }>,
    private service: ApiService, private unsplashService: UnsplashApiService,
    private route: ActivatedRoute) {
    this.changeTempUnit$ = store.pipe(select('changeTempUnit'));
    this.setCurrentConditions$ = store.pipe(select('setCurrentConditions'));
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        this.cityKey = params.get("cityKey");
        if (this.cityKey) {
          this.getCityByKey(this.cityKey).subscribe(
            res => {
              this.store.dispatch(SET_CURRENT_CONDITIONS({ currentCity: res }));
            }
          )
        }
        else {
          this.currentCity = JSON.parse(window.localStorage.getItem("currentCity"));
          if (this.currentCity) {
            this.store.dispatch(SET_CURRENT_CONDITIONS({ currentCity: this.currentCity }));
          }
          else {
            this.getCityByKey("215854").subscribe(
              res => {
                this.store.dispatch(SET_CURRENT_CONDITIONS({ currentCity: res }));
              }
            )
          }
        }
      }, err => {
        this.service.handleError("occured on getting city weather. wheather.component.ts 63")
      });
    this.setCurrentConditions$
      .subscribe(
        res => {
          if (res && res.currentCity) {
            this.currentCity = res.currentCity;
            this.unsplashService.search(this.currentCity.LocalizedName).subscribe(
              res => {
                if (res && res.results.length && res.results[0] && res.results[0].urls.small) {
                  let smallUrl = res.results[0].urls.small;
                  smallUrl = smallUrl.replace("w=400", "w=400&h=300").replace("fit=max", "fit=min");
                  this.imageUrl = smallUrl;
                }
              }
            )
            this.getCurrentConditions(this.currentCity.Key)
          }
        }, err => {
          this.service.handleError("occured on getting city from searchbox. wheather.component.ts 84")
        }
      )

  }

  getCurrentConditions(key: string): void {
    this.isLoading = true;
    this.isPicLaoding = true;
    this.getCityByKey(key);
    this.service.getCurrentConditions(key)
      .subscribe(
        res => {
          this.isLoading = false;
          this.isPicLaoding = false;
          this.currentConditions = res[0];
          this.currentConditions.LocalObservationDateTime = new Date(this.currentConditions.EpochTime * 1000);
          this.service.currentConditions = this.currentConditions;
        },
        err => {
          this.service.handleError("fetching currnet conditions. wheather.component.ts 100")
        }
      )
  }

  getCityByKey(key: string): Observable<any> {
    let obs = this.service.getCityByKey(key);
    obs.subscribe(
      res => {
        this.currentCity = res;
        this.service.currentCity = res;

      },
      err => {
        this.service.handleError("fetching a city by key. wheather.component.ts 114");
      }
    )
    return obs;
  }

  addToFavorites(cityKey: string) {
    this.favorites = JSON.parse(window.localStorage.getItem('favorites'));
    if (!this.favorites) {
      this.favorites = this.favorites || [];
      this.favorites.push(cityKey);
      window.localStorage.setItem('favorites', JSON.stringify(this.favorites));
      return;
    }
    if (this.favorites.includes(cityKey)) {
      return;
    }
    this.favorites.push(cityKey);
    window.localStorage.setItem('favorites', JSON.stringify(this.favorites));

  }
}
