import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { RouterLink } from '@angular/router';
import { UtilService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [RouterLink, IonLabel, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonCard, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonButton]
})
export class SignInComponent implements OnInit {

  private utilsSvc = inject(UtilService);

  constructor() { }

  ngOnInit() { }

  signIn() {
    this.utilsSvc.presentLoading();
    setTimeout(() => {
      this.utilsSvc.dismissLoading();
      this.utilsSvc.presentToast({
        message: 'Welcome ',
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline',
        duration: 2000,
      });
    }, 2000);
  }

}
