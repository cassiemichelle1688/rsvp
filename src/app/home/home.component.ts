import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleComponent } from '../title/title.component';
import { AboutComponent } from '../about/about.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { RsvpComponent } from '../rsvp/rsvp.component';
import { AddComponent } from '../add/add.component';
import { WishComponent } from '../wish/wish.component';

@Component({
    selector: 'app-home',
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

}
