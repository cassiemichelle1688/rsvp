import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() targetDate!: string; // Example: "2025-12-31T23:59:59"

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  eventStarted = false;

  private sub?: Subscription;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.sub = interval(1000).subscribe(() => {
        // Run the state update back inside Angular's zone
        this.ngZone.run(() => this.updateCountdown());
      });
    });
    this.updateCountdown();
  }

  updateCountdown() {
    const now = new Date().getTime();
    const target = new Date(this.targetDate).getTime();
    const distance = target - now;

    if (distance <= 0) {
      this.eventStarted = true;
      this.sub?.unsubscribe();
      return;
    }

    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
