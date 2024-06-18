import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { UtilService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, IonLabel, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonCard, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonButton]
})
export class SignInComponent implements OnInit {

  private utilsSvc = inject(UtilService);
  private authSvc = inject(AuthService);
  email: string = "";
  password: string = "";
  private router = inject(Router);

  constructor() { }

  ngOnInit() { }

  signIn() {
    this.utilsSvc.presentLoading();
    this.authSvc.getAuthenticate({ email: this.email, password: this.password }).subscribe(
      response => {
        console.log(response)
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: 'Welcome',
          color: 'success',
          position: 'bottom',
          icon: 'checkmark-circle-outline',
          duration: 2000,
        });
        this.router.navigate(['/tabs/home']);
      },
      error => {
        console.log(error)
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: `Error: ${error}`,        
          color: 'warning',
          position: 'top',
          icon: 'alert-circle-outline',
          duration: 2000,
        });
      }
    );
  }

}
