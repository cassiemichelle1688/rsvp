import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { CountdownComponent } from '../countdown/countdown.component';

@Component({
  selector: 'app-add',
  standalone: true, // Add this line
  imports: [NgOptimizedImage, CountdownComponent],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

  constructor(private modalService: ModalService) {}

  openModalGift() {
    this.modalService.open({
      type: 'GIFT', 
      copyText: 'Bandung, Setra Duta Permai'
    });
  }

  openModalTransfer() {
    this.modalService.open({
      type: 'TRANSFER', 
      copyText: '0860840081'
    });
  }

  // Data acara Anda
  eventTitle: string = 'Wedding Kevin & Cassie';
  eventDescription: string = 'Holy Matrimony & Wedding Ceremony';
  eventLocation: string = 'St. Laurentius Bandung';
  
  // Tanggal dan waktu dalam format JavaScript Date
  startDate: Date = new Date('2026-01-17T09:00:00');
  endDate: Date = new Date('2026-01-17T14:00:00');

  saveToCalendar() {
    // Format tanggal ke format iCalendar (YYYYMMDDTHHMMSSZ)
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      // 'Z' menandakan format UTC (Universal Coordinated Time)
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };

    const formattedStartDate = formatDate(this.startDate);
    const formattedEndDate = formatDate(this.endDate);
    
    // UUID (Universally Unique Identifier) memastikan acara unik
    const uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    // Konten file .ics
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Angular//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatDate(new Date())}
DTSTART:${formattedStartDate}
DTEND:${formattedEndDate}
SUMMARY:${this.eventTitle}
DESCRIPTION:${this.eventDescription}
LOCATION:${this.eventLocation}
END:VEVENT
END:VCALENDAR`;

    this.downloadICS(icsContent);
  }

  downloadICS(content: string) {
    // Membuat Blob dari konten .ics
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Membuat link sementara dan mengkliknya secara otomatis
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'event.ics');
    document.body.appendChild(link);
    link.click();

    // Membersihkan link dan URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

}
