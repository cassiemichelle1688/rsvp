import { Injectable } from '@angular/core'; // <-- 1. Make sure this import exists.
import { Subject } from 'rxjs';

export interface MapLocation {
  lat: number;
  lng: number;
  zoom?: number;
  link: string;
}

@Injectable({ // <-- 2. This decorator is ESSENTIAL.
  providedIn: 'root'
})
export class MapModalService {
  // A Subject is like an event emitter. Components can subscribe to it.
  private openModalSource = new Subject<MapLocation>();

  // Expose the Subject as an Observable so components can listen but not emit.
  openModal$ = this.openModalSource.asObservable();

  /**
   * Any component can call this method to open the map modal.
   * @param location The coordinates and optional zoom level for the map.
   */
  open(location: MapLocation): void {
    this.openModalSource.next(location);
  }
}