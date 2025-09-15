import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapModalComponent } from './map-modal/map-modal.component';
import { GiftModalComponent } from './gift-modal/gift-modal.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './core/loader.service';
// import * as AOS from 'aos';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MapModalComponent, GiftModalComponent, LoaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rsvp';
  isLoading = false;
  
  constructor(private loader: LoaderService) {}

  ngOnInit() {
    // AOS.init({ duration: 800, once: true });
    this.loader.isLoading$.subscribe(state => {
      this.isLoading = state;
    });
  }
}
