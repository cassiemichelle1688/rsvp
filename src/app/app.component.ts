import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapModalComponent } from './map-modal/map-modal.component';
import { GiftModalComponent } from './gift-modal/gift-modal.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MapModalComponent, GiftModalComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rsvp';
}
