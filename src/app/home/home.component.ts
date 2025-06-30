import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleComponent } from '../title/title.component';
import { AboutComponent } from '../about/about.component';

@Component({
    selector: 'app-home',
    imports: [
        TitleComponent, 
        AboutComponent
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
