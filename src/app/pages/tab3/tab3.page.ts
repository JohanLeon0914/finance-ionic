import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/utils.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonButton],
})
export class Tab3Page {
  authService = inject(AuthService)
  utilsSvc = inject(UtilService)
  router = inject(Router);
  constructor() {}
  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
