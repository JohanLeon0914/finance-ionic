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
  selector: 'app-wallets',
  templateUrl: 'wallets.page.html',
  styleUrls: ['wallets.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, IonInput, IonButtons, IonModal, IonCardContent, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel],
})
export class WalletsPage {
  @ViewChild(IonModal) modal: IonModal;
  authService = inject(AuthService)
  utilsSvc = inject(UtilService)
  subscription: Subscription;
  router = inject(Router)
  walletService = inject(WalletService)
  userWallets: Wallet[] = [];
  walletName: string = '';
  walletBalance: number = 0;
  walletSelected: Wallet | null = null;
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
      },
      error => {
        console.log(error)
      }
    )
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.walletSelected) {
        const wallet: Wallet = {
          id: this.walletSelected.id,
          name: this.walletName,
          description: this.walletDescription,
          balance: this.walletBalance,
        }
        this.walletService.updateWallet(wallet).subscribe(
          () => {
            this.utilsSvc.dismissLoading();
            this.utilsSvc.presentToast({
              message: 'Wallet Updated Success',
              color: 'success',
              position: 'top',
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
        )
      } else {
        const wallet: Wallet = {
          name: this.walletName,
          description: this.walletDescription,
          balance: this.walletBalance
        }
        this.walletService.createWallet(wallet).subscribe(
          () => {
            this.utilsSvc.dismissLoading();
            this.utilsSvc.presentToast({
              message: 'Wallet Created Success',
              color: 'success',
              position: 'top',
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
  }

  editWallet(wallet: Wallet): void {
    this.walletSelected = wallet;
    this.walletName = wallet.name;
    this.walletDescription = wallet.description;
    this.walletBalance = wallet.balance;
    this.modal.present();
  }

  confirmDeleteWallet(wallet: Wallet): void {
    this.utilsSvc.presentAlert({
      header: 'Delete Wallet!',
      message: 'Are you sure you want to delete this wallet?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, delete it',
          handler: () => {
            this.deleteWallet(wallet)
          },
        },
      ],
    })
  }

  deleteWallet(wallet: Wallet): void {
    this.utilsSvc.presentLoading();
    this.walletService.deleteWallet(wallet).subscribe(
      () => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: 'Wallet Deleted Success',
          color:'success',
          position: 'top',
          icon: 'checkmark-circle-outline',
          duration: 2000,
        });
        this.getUserWallets();
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
    )
  }

  currencyFormatter(value: number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      minimumFractionDigits: 2,
      currency: 'USD'
    }) 
    return formatter.format(value)
  }

  cancel() {
      this.walletName = '';
      this.walletDescription = '';
      this.walletBalance = 0;
      this.walletSelected = null;
    this.modal.dismiss(null, 'cancel');
  }


}
