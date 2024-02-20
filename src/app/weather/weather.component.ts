import { Component } from '@angular/core';
import { WeatherService } from '../weather.service';
import { throwError, interval, of, Observable } from 'rxjs';
import { mergeMap, retryWhen, catchError, take, delay } from 'rxjs/operators';


@Component({
  selector: 'weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {
  city: string = '';
  loading: boolean = false;
  weatherData: any;

  constructor(private weatherService: WeatherService) {}

  getWeather() {
    this.loading = true;
  
    const geocodingEndpoint = `https://geocode.maps.co/search?q=${this.city}&api_key=65ba2165024d5660860737spwaae037`;
  
    this.weatherService.getWeather(this.city)
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            mergeMap((error, i) => {
              if (error.status === 429 && i < 3) {
                const delayMs = Math.pow(2, i) * 1000;
                return of(error).pipe(delay(delayMs));
              }
              return throwError(error);
            }),
            take(3) 
          )
        ),
        catchError((error: any) => {
          console.error('Error fetching geocoding data:', error);
          this.loading = false;
          return throwError(error);
        })
      )
      .subscribe(
        (weatherData: any) => {
          this.weatherData = weatherData;
          this.loading = false;
        },
        (weatherError: any) => {
          console.error('Error fetching weather data:', weatherError);
          this.loading = false;
        }
      );
  }

  
  
}

