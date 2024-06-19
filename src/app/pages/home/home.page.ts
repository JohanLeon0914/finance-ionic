import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, IonHeader, IonIcon, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonButtons, IonInput } from '@ionic/angular/standalone';
import { alertCircleOutline, checkmarkCircleOutline, closeCircleOutline, pencilOutline, trashBinOutline, trashOutline, walletOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { WalletService } from 'src/app/services/wallet.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { Wallet } from 'src/models/wallet.model';
import { addIcons } from 'ionicons';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { UtilService } from 'src/app/services/utils.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, IonInput, IonButtons, IonModal, IonCardContent, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel],
})
export class HomePage {
  @ViewChild(IonModal) modal: IonModal;
  authService = inject(AuthService)
  utilsSvc = inject(UtilService)
  subscription: Subscription;
  router = inject(Router)
  walletService = inject(WalletService)
  userWallets: Wallet[] = [];
  walletName: string = '';
  walletDescription: string = '';

  constructor() {
    addIcons({ walletOutline, closeCircleOutline, checkmarkCircleOutline, alertCircleOutline, pencilOutline, trashOutline })
  }

  ngOnInit(): void {
    this.getUserWallets();
    this.subscription = this.authService._refresh$.subscribe(
      () => {
        this.getUserWallets();
      })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }

  getUserWallets() {
    this.walletService.getUserWallets().subscribe(
      response => {
        this.userWallets = response.data;
        console.log(response)
      },
      error => {
        console.log(error)
      }
    )
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const wallet: Wallet = {
        name: this.walletName,
        description: this.walletDescription,
      }
      this.walletService.createWallet(wallet).subscribe(
        response => {
          this.utilsSvc.dismissLoading();
          this.utilsSvc.presentToast({
            message: 'Wallet Created Success',
            color: 'success',
            position: 'bottom',
            icon: 'checkmark-circle-outline',
            duration: 2000,
          });
          form.resetForm();
          this.getUserWallets();
          this.modal.dismiss();
        },
        error => {
          this.utilsSvc.dismissLoading();
          this.utilsSvc.presentToast({
            message: `Error: ${error}`,
            color: 'warning',
            position: 'top',
            icon: 'alert-circle-outline',
            duration: 2000,
          });
          console.log(error)
        }
      );
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }


}
