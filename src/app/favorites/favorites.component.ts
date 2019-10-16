import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/shared/services/api.service';
import { forkJoin } from 'rxjs';
import { UnsplashApiService } from 'src/shared/services/unsplash-api.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})

export class FavoritesComponent implements OnInit {
  isLaoding=false;
  favoriteCitiesKeys:string[];
  favoriteCities = [];
  errorMsg:string;
  
  constructor(private router: Router, private service: ApiService,private unsplash:UnsplashApiService) { }
  
  ngOnInit() {
    this.favoriteCitiesKeys=JSON.parse(window.localStorage.getItem("favorites"));
    this.getFavoritesCondoitions();
  }

  getFavoritesCondoitions() {
    let observables = [];
    for (let i in this.favoriteCitiesKeys) {
      observables.push(this.service.getCityByKey(this.favoriteCitiesKeys[i]));
    }
    forkJoin(observables)
    .subscribe(
      res => {
        this.isLaoding=true;
        for (let i in res) {
          this.favoriteCities[i] = res[i]
          this.unsplash.search(this.favoriteCities[i].LocalizedName)
          .subscribe(
            res=>{
              if (res && res.results.length && res.results[0] && res.results[0].urls.small) {
                this.isLaoding=false;
                let smallUrl = res.results[0].urls.small;
                smallUrl = smallUrl.replace("w=400", "w=400&h=300").replace("fit=max", "fit=min");
                this.favoriteCities[i].imageUrl = smallUrl;
              }
            },err=>{
              this.service.handleError("occured on fetching city image")
            }
          )

        }
      },
      err => {
        this.service.handleError("fetching favorite cities conditions. favorites.component.ts 40");
      }
    )
  }

  showCurrentConditions(cityKey) {
    this.router.navigate(['home', cityKey]);
  }
  

}
