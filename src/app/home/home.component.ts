import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Event, Router } from '@angular/router';
import { TitleComponent } from '../title/title.component';
import { AboutComponent } from '../about/about.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { RsvpComponent } from '../rsvp/rsvp.component';
import { AddComponent } from '../add/add.component';
import { WishComponent } from '../wish/wish.component';
import * as AOS from 'aos';

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

export class HomeComponent implements OnInit, AfterViewInit {

    guestName: string | null = null;
    date: string | null = null;
    id: string | null = null;
    homeData: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {}

    ngAfterViewInit(){
        if (isPlatformBrowser(this.platformId)) {
           AOS.init({
                duration: 800,
                once: false,   // set true if you want animation only once
            });

            // Important: refresh after init to catch Angular rendering
            setTimeout(() => {
                AOS.refresh();
            }, 100);
            // this.router.events.subscribe((event: Event) => {
            //     if (event instanceof NavigationEnd) {
            //     AOS.refresh();
            //     }
            // });
        }
    }

    ngOnInit(): void {
        this.guestName = this.route.snapshot.paramMap.get('name');
        this.id = this.route.snapshot.paramMap.get('id');
        this.date = '17.01.2026'
        this.homeData = {
            guestName : this.guestName, 
            date: this.date,
            id: this.id 
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
