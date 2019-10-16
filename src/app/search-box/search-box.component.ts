import { Component, OnInit } from '@angular/core';
import { ICity } from 'src/shared/models/ICity.model';
import { ApiService } from 'src/shared/services/api.service';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { CHANGE_TEMP_UNIT, SET_CURRENT_CONDITIONS } from '../stateManagment/actions';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  currentCity: ICity;
  searchCitiesCtrl = new FormControl();
  filteredCities: any;
  isLoading = false;
  errorMsg: string;
  changeTempUnit$: Observable<string>;
  setCurrentConditions$: Observable<any>;

  constructor(private store: Store<{ changeTempUnit: string, setCurrentConditions: any }>,
    private service: ApiService, private router: Router) {
    this.changeTempUnit$ = store.pipe(select('changeTempUnit'));
    this.setCurrentConditions$ = store.pipe(select('setCurrentConditions'));
  }

  ngOnInit() {
    this.searchCitiesCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredCities = [];
          this.isLoading = true;
        }),
        switchMap(value => this.service.autocompleteCity(value)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )))
      .subscribe(data => {
        this.filteredCities = data;
      },
        err => {
          this.service.handleError("autocompleting search. search-box.component.ts 50");
        });
  }

  displayFn(city) {
    return city ? city.LocalizedName + ", " + city.Country.LocalizedName : "";
  }

  returnFn(city): number {
    return city ? city.Key : "";
  }

  onHumanSelected(option): void {
    if (!option) {
      return;
    }
    this.currentCity = option.value;
    this.service.currentCity = this.currentCity;
    window.localStorage.setItem("currentCity", JSON.stringify(this.currentCity));
    this.store.dispatch(SET_CURRENT_CONDITIONS({ currentCity: this.currentCity }));
  }

  changeTempSystem(): void {
    this.store.dispatch(CHANGE_TEMP_UNIT());

  }

}
