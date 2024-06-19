import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';


@Component({
  selector: 'app-transactions',
  templateUrl: 'transactions.page.html',
  styleUrls: ['transactions.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent]
})
export class TransactionsPage {

  constructor() {}

}
