import { Component, Input, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapModalService } from '../services/map-modal.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-schedule',
  standalone: true, // Add this line
  imports: [GoogleMapsModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit{
  isBothEvent: boolean | undefined;

  constructor(private mapModalService: MapModalService) {}

  @Input() dataFromHome: any; 

  ngOnInit(): void {
    const id = this.dataFromHome.id;
    if (id == environment.all_token) {
      this.isBothEvent = true;
    } else if (id == environment.m_only_token) {
      this.isBothEvent = false;
    }
  }

  showLocation1OnMap(): void {
    // Call the service's open method with the desired coordinates
    this.mapModalService.open({
      lat: -6.8757842,
      lng: 107.5959631,
      zoom: 17, 
      link: "https://maps.app.goo.gl/sygcpMD9DP1wq3TB9"
    });
  }

  showLocation2OnMap(): void {
    // Call the service's open method with the desired coordinates
    this.mapModalService.open({
      lat: -6.9196941,
      lng: 107.595312,
      zoom: 17, 
      link: "https://maps.app.goo.gl/hcWiyuCwxdHG1cUS8"
    });
  }

}
