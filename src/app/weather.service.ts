import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey = '3cac524057eb4d1582795741240602';
  geocodingApiKey = '65ba2165024d5660860737spwaae037';
  geocodingApiUrl = 'https://geocode.maps.co/search';
  weatherApiUrl = 'https://api.weatherapi.com/v1/current.json';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const geocodingUrl = `${this.geocodingApiUrl}?q=${city}&api_key=${this.geocodingApiKey}`;

    return this.http.get(geocodingUrl).pipe(
      switchMap((geocodingData: any) => {
        console.log('Geocoding API Response:', geocodingData);

        if (geocodingData && Array.isArray(geocodingData) && geocodingData.length > 0) {
          
          const firstResult = geocodingData[0];
          
          if (firstResult && firstResult && firstResult.lat && firstResult.lon) {
            const lat = firstResult.lat;
            const lon = firstResult.lon;
            
            const weatherUrl = `${this.weatherApiUrl}?key=${this.apiKey}&q=${lat},${lon}`;
            
            return this.http.get(weatherUrl);
          }
        }

        console.error('Error in geocoding data:', geocodingData);
        return of(null);
      }),
      catchError((error) => {
        console.error('Error in HTTP request:', error);
        return of(null);
      })
    );
  }
}