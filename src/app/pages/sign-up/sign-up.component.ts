import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonButton, IonText } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { UtilService } from 'src/app/services/utils.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/models/users.model';
import { cloudyNight } from 'ionicons/icons';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [IonText, ReactiveFormsModule, FormsModule, RouterLink, IonLabel, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonCard, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonButton]
})
export class SignUpComponent implements OnInit {
  email: string = "";
  confirmEmail: string = "";
  name: string = "";
  password: string = "";
  authService = inject(AuthService)
  utilsSvc = inject(UtilService);
  router = inject(Router);

  constructor() {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.utilsSvc.presentLoading();

    const user: User = {
      email: this.email,
      name: this.name,
      password: this.password
    };

    this.authService.signUp(user).subscribe(
      response => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: 'Sign up success, we send you a verification email',
          color: 'success',
          position: 'bottom',
          icon: 'checkmark-circle-outline',
          duration: 5000,
        });
        form.resetForm(); 
        this.router.navigate(['/signin']);
      },
      error => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: 'Sign Up Failed',
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline',
          duration: 2000,
        });
        console.error('Registration failed', error);
      }
    );
  }
}