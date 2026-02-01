import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import type { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  fetchingError = signal('');
  private destroy = inject(DestroyRef);
  placesService = inject(PlacesService);

  ngOnInit() {
    this.isFetching.set(true);
    const placesSub = this.placesService.loadAvailablePlaces().subscribe({
      next: (places) => this.places.set(places),
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
  onAddPlace(place: Place) {
    const sub = this.placesService.addPlaceToUserPlaces(place).subscribe({
      next: (response) => {
        return console.log(response);
      },
    });
    this.destroy.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}
