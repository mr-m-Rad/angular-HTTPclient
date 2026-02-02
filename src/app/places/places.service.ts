import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private http = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places');
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places').pipe(
      tap((userPlaces) => {
        this.userPlaces.set(userPlaces);
      }),
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();
    if (!prevPlaces.some((e) => e.id === place.id)) {
      this.userPlaces.set([...prevPlaces, place]);
    }
    return this.http
      .put('http://localhost:3000/user-places', {
        placeId: place.id,
      })
      .pipe(
        catchError((error) => {
          this.userPlaces.set(prevPlaces);
          return throwError(() => new Error('error'));
        }),
      );
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();
    this.userPlaces.update((places) => places.filter((i) => i.id !== place.id));
    return this.http
      .delete(`http://localhost:3000/user-places/${place.id}`)
      .pipe(
        catchError(() => {
          this.userPlaces.set(prevPlaces);
          return throwError(() => new Error('error Removing a place'));
        }),
      );
  }

  fetchPlaces(url: string) {
    return this.http
      .get<{ places: Place[] }>(url)
      .pipe(map((response) => response.places));
  }
}
