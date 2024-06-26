import { Component, Input, OnInit, inject } from '@angular/core';
// import { UtilService } from 'src/app/services/util.service';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonBackButton, IonTitle } from '@ionic/angular/standalone';
import { NgClass } from '@angular/common';
import { UtilService } from 'src/app/services/utils.service';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar, IonButtons, IonButton, IonIcon, IonBackButton, IonTitle, NgClass],
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  @Input() backButton: string;
  @Input() isModal: boolean;
  @Input() color: string;
  @Input() centerTitle: boolean;

  utilSvc = inject(UtilService)

  constructor() {
    addIcons({closeCircleOutline})
   }

  ngOnInit() {
  }

  dismissModal() {
    // this.utilSvc.dismissModal({ success: true });
  }

}
