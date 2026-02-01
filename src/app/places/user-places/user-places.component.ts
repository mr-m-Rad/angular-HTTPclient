import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal(false);
  fetchingError = signal('');
  private placesService = inject(PlacesService);
  private destroy = inject(DestroyRef);
  places = this.placesService.loadedUserPlaces;

  ngOnInit() {
    this.isFetching.set(true);
    const placesSub = this.placesService.loadUserPlaces().subscribe({
      // next: (places) => this.places.set(places),
      error: (error) => {
        this.fetchingError.set('error');
        console.error(error.message);
      },
      complete: () => this.isFetching.set(false),
    });
    this.destroy.onDestroy(() => {
      placesSub.unsubscribe();
    });
  }

  removePlace(place: Place) {
    const sub = this.placesService.removeUserPlace(place).subscribe({});
    this.destroy.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}
