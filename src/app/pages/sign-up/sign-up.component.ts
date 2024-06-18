import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { RouterLink } from '@angular/router';
import { UtilService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [RouterLink, IonLabel, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonCard, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonButton]
})
export class SignUpComponent  implements OnInit {

  constructor() { }

  private utilsSvc = inject(UtilService);

  ngOnInit() {}

  signUp() {
    this.utilsSvc.presentLoading();
    setTimeout(() => {
      this.utilsSvc.dismissLoading();
      this.utilsSvc.presentToast({
        message: 'Sign Up Success',
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline',
        duration: 2000,
      });
    }, 2000);
  }

}
