import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})

export class AboutComponent {
  bride_name: string = "Cassie Michelle";
  bride_heritance: string = "1st";
  bride_father: string = "Jasin Sowandi";
  bride_mother: string = "Erwani Merry S.";

  groom_name: string = "Kevin Yovan H."
  groom_heritance: string = "1st"
  groom_father: string = "Yoecef Hermanto";
  groom_mother: String = "Anita Hermawan"
}
