import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/utils.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonButton],
})
export class ProfilePage {
  authService = inject(AuthService)
  utilsSvc = inject(UtilService)
  router = inject(Router);
  constructor() {}

  confirmLogout(): void {
    this.utilsSvc.presentAlert({
      header: 'Logout!',
      message: 'Are you sure you want to logout?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, logout',
          handler: () => {
            this.logout()
          },
        },
      ],
    })
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
