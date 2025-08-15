import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true, // Add this line
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent implements OnInit {

  @Input() dataFromHome: any; 
  guestName:string | null = null;
  date:string | null = null;

  ngOnInit(): void {
    this.guestName = this.dataFromHome.guestName;
    this.date = this.dataFromHome.date;
  }

  // Create an event emitter named 'scrollToAbout'. The parent will listen for this.
  @Output() scrollToAbout = new EventEmitter<void>();

  notifyParentToScroll(): void {
    // When the button is clicked, emit the event.
    this.scrollToAbout.emit();
  }

}
