import { Component, OnInit } from '@angular/core';
import { IFiveDayForecasts } from 'src/shared/models/IFiveDayForecasts.model';
import { ApiService } from 'src/shared/services/api.service';
import { IWeather } from 'src/shared/models/IWeather.model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-forecasts',
  templateUrl: './forecasts.component.html',
  styleUrls: ['./forecasts.component.scss']
})
export class ForecastsComponent implements OnInit {

  fiveDayForcasts: IFiveDayForecasts;
  currentConditions: IWeather;
  errorMsg: string;
  key:string;
  changeTempUnit$: Observable<string>;
  setCurrentConditions$:Observable<any>
  constructor(private store: Store<{ changeTempUnit: string,setCurrentConditions:any }>,private service: ApiService) {
    this.changeTempUnit$ = store.pipe(select('changeTempUnit'));
    this.setCurrentConditions$=store.pipe(select('setCurrentConditions'))
  }

  ngOnInit() {

    this.setCurrentConditions$.subscribe(
      res=>{
        if(res && res.currentCity){
          this.key=res.currentCity.Key;
          this.setForecasts();
        }
      },err=>{
       this.service.handleError("occured on fetching five day forecasts. forecasts.component.ts 36")   
      }
    )
    
  }

  setForecasts():void{
    this.service.get5DayForcasts(this.key)
      .subscribe(
        res => {
          for (let day in res.DailyForecasts) {
            const temp = res.DailyForecasts[day].Temperature;
            let vals = ['Maximum', 'Minimum'];
            for (let j in vals) {
              let metric = Math.floor(temp[vals[j]].Value);
              let imperial = Math.floor((metric*9/5)+32);
              temp[vals[j]].Imperial = { Value: imperial, Unit: 'F' };
              temp[vals[j]].Metric = { Value: metric, Unit: 'C' };
            }
          }
          this.fiveDayForcasts = res;
        },
        err => {
          this.service.handleError("fetching five day forecasts. forecasts.component.ts 59");
        }
      );
  }

  getDay(oldDate: string): Date {
    let date = new Date(oldDate);
    return date;
  }
}
