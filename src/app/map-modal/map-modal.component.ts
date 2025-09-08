import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core'; // 1. Import Inject, PLATFORM_ID
import { isPlatformBrowser, CommonModule } from '@angular/common'; // 2. Import isPlatformBrowser
import { Subscription } from 'rxjs';
import { MapLocation, MapModalService } from '../services/map-modal.service';
import { ModalService } from '../services/modal.service';


// We will import Leaflet dynamically to avoid loading it on the server at all
// import * as L from 'leaflet'; // <-- REMOVE the static import at the top

@Component({
  selector: 'app-map-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements AfterViewInit, OnDestroy {
  isMapVisible = false;

  // These will only be defined on the browser, so use the 'any' type or define them as potentially undefined
  private L: any; 
  private map: any; // L.Map;
  private marker: any; // L.Marker;
  private icon: any; // L.Icon;
  private textToCopy!: string;
  private modalSubscription!: Subscription;

  // 3. Inject PLATFORM_ID to determine the current platform
  constructor(
    private mapModalService: MapModalService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit(): void {
    // 4. Check if we are in the browser before doing ANYTHING with Leaflet
    if (isPlatformBrowser(this.platformId)) {
      this.modalSubscription = this.mapModalService.openModal$.subscribe((location) => {
        this.isMapVisible = true;
        // Use a timeout to ensure the div is visible before initializing the map
        setTimeout(() => this.initMap(location), 0);
      });
    }
  }

  private async initMap(location: MapLocation): Promise<void> {
    // 5. Dynamically import Leaflet ONLY when it's needed (and we're in the browser)
    if (!this.L) {
      this.textToCopy = location.link;
      this.L = await import('leaflet');
      // Configure the icon after the library is loaded
      this.icon = this.L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    }

    if (this.map) {
      console.log('already initialize');
      this.map.setView([location.lat, location.lng], location.zoom || 15);
      this.marker.setLatLng([location.lat, location.lng]);
    } else {
      this.map = this.L.map('leaflet-map-container').setView([location.lat, location.lng], location.zoom || 15);

      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.marker = this.L.marker([location.lat, location.lng], { icon: this.icon }).addTo(this.map);
    }
  }

  closeMap(): void {
    this.isMapVisible = false;
    this.ngOnDestroy();
  }

  // ngOnDestroy(): void {
  //   // Also guard the subscription, as it's only created on the browser
  //   if (this.modalSubscription) {
  //     this.modalSubscription.unsubscribe();
  //   }
  //   // Clean up the map instance on the browser
  //   if (isPlatformBrowser(this.platformId) && this.map) {
  //     this.map.remove();
  //   }
  // }

  ngOnDestroy(): void {
    // This is the correct place to clean up the map
    if (this.map) {
      this.map.off();
      this.map.remove();

      // --- FIX #2: Reset the variable ---
      // This is the most important fix for the '_leaflet_pos' error
      this.map = undefined;
    }
  }

  // 2. A flag to give user feedback
  isCopied: boolean = false;

  // 3. The copy function
  copyText() {
    // The Clipboard API is asynchronous and returns a Promise
    navigator.clipboard.writeText(this.textToCopy).then(
      () => {
        // 4. On success, update the flag
        this.isCopied = true;

        // 5. Reset the flag after a timeout
        setTimeout(() => {
          this.isCopied = false;
        }, 2000); // Reset after 2 seconds
      },
      (err) => {
        // Handle potential errors
        console.error('Failed to copy text: ', err);
      }
    );
  }

}