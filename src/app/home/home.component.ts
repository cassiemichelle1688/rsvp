import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleComponent } from '../title/title.component';
import { AboutComponent } from '../about/about.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { RsvpComponent } from '../rsvp/rsvp.component';
import { AddComponent } from '../add/add.component';
import { WishComponent } from '../wish/wish.component';

@Component({
    selector: 'app-home',
    standalone: true, // Add this line
    imports: [
        TitleComponent, 
        AboutComponent, 
        ScheduleComponent, 
        RsvpComponent, 
        AddComponent, 
        WishComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {

    guestName: string | null = null;
    date: string | null = null;
    homeData: any;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.guestName = this.route.snapshot.paramMap.get('name');
        this.date = '17.01.2026'
        this.homeData = {
            guestName : this.guestName, 
            date: this.date
        }
    }

    // Use @ViewChild to get a reference to the element with #aboutSection
    @ViewChild('aboutSection', { read: ElementRef }) aboutSection!: ElementRef;

    // This method is called when the (scrollToAbout) event is emitted from app-title
    onScrollToAbout(): void {
        console.log('Scrolling to about section...');
        this.aboutSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
        });
    }
    
}
