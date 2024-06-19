import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonButton, IonText } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { UtilService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, IonLabel, IonText, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonCard, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonButton]
})
export class SignInComponent implements OnInit {

  private utilsSvc = inject(UtilService);
  private authSvc = inject(AuthService);
  email: string = "";
  password: string = "";
  private router = inject(Router);

  constructor() { 
    addIcons({checkmarkCircleOutline, alertCircleOutline})
  }

  ngOnInit() { }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.utilsSvc.presentLoading();

    const credentials = {
      email: this.email,
      password: this.password
    };

    this.authSvc.getAuthenticate(credentials).subscribe(
      response => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: 'Sign In Success',
          color: 'success',
          position: 'bottom',
          icon: 'checkmark-circle-outline',
          duration: 2000,
        });
        form.resetForm(); 
        this.router.navigateByUrl('/tabs/home')
      },
      error => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: 'Sign In Failed',
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline',
          duration: 2000,
        });
        console.error('Authentication failed', error);
      }
    );
  }

}
