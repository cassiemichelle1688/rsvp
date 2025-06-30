import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title',
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

}
