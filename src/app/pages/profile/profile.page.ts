import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonText, IonInput, IonList, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAvatar, IonItem, IonIcon, IonLabel, IonModal, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, mailOutline, personCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/utils.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { UserInfo } from 'src/models/user.info.model';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, IonText, IonInput, IonList ,IonButtons, IonModal, IonLabel, IonIcon, IonItem, IonAvatar, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonButton],
})
export class ProfilePage {
  @ViewChild(IonModal) modal: IonModal;
  authService = inject(AuthService)
  utilsSvc = inject(UtilService)
  router = inject(Router);
  user: UserInfo = {
    id: '',
    name: '',
    email: '',
    emailValidated: false,
    email_sent: false,
  };
  confirmDeleteMessage = '';
  subscription: Subscription;
  isModalUpdateOpen: boolean = false;
  constructor() {
    addIcons({mailOutline, checkmarkCircleOutline, personCircleOutline, alertCircleOutline})
  }
  userInfoToUpdate: any = { }

  ngOnInit(): void {
    this.getUserInfo();
    this.subscription = this.authService._refresh$.subscribe(
      () => {
        this.getUserInfo();
      })
  }

  setOpenUpdateModal(isOpen: boolean) {
    this.isModalUpdateOpen = isOpen;
  }

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

  getUserInfo() {
    this.authService.getUserInfo().subscribe(
      res => {
        this.user = res.data;
        this.userInfoToUpdate.name = res.data.name;
      },
      error => {
        console.log(error)
      }
    );
  }

  onSubmitDeleteAccount(): void {
    this.authService.deleteUserAccount().subscribe(
      () => {
        this.authService.logout()
        this.utilsSvc.presentToast({
          message: 'Account deleted successfully',
          color: 'success',
          position: 'top',
          icon: 'checkmark-circle-outline',
          duration: 2000,
        });
        this.router.navigate(['/signin']);
      },
      error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Failed to delete account',
          color: 'danger',
          position: 'top',
          icon: 'alert-circle-outline',
          duration: 2000,
        });
      },
    );
  }

  onSubmitUpdateAccountInfo(): void {
    this.authService.updateUserAccountInfo(this.userInfoToUpdate).subscribe(
      () => {
        this.authService.logout()
        this.utilsSvc.presentToast({
          message: 'Account updated successfully',
          color: 'success',
          position: 'top',
          icon: 'checkmark-circle-outline',
          duration: 2000,
        });
        this.router.navigate(['/signin']);
      },
      error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Failed to update account info',
          color: 'danger',
          position: 'top',
          icon: 'alert-circle-outline',
          duration: 2000,
        });
      },
    );
  }

  isDeleteMessageValid(): boolean {
    return this.confirmDeleteMessage.toLowerCase() === 'delete';
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
