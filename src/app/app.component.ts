import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapModalComponent } from './map-modal/map-modal.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MapModalComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rsvp';
}
