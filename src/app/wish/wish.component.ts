import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-wish',
  imports: [NgOptimizedImage],
  templateUrl: './wish.component.html',
  styleUrl: './wish.component.scss'
})
export class WishComponent {

  @Input() dataFromHome: any; 
  guestName:string | null = null;
  date:string | null = null;

  ngOnInit(): void {
    this.guestName = this.dataFromHome.guestName;
    this.date = this.dataFromHome.date;
  }

}
