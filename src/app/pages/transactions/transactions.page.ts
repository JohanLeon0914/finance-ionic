import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, IonHeader, IonIcon, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonSelect, IonButtons, IonInput, IonSelectOption, IonLabel, IonCheckbox, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, cashOutline, checkmarkCircleOutline, closeCircleOutline, pencilOutline, trashOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/utils.service';
import { WalletService } from 'src/app/services/wallet.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { Category } from 'src/models/category.model';
import { Transaction } from 'src/models/transaction.model';
import { Wallet } from 'src/models/wallet.model';


@Component({
  selector: 'app-transactions',
  templateUrl: 'transactions.page.html',
  styleUrls: ['transactions.page.scss'],
  standalone: true,
  imports: [IonText, IonCheckbox, IonLabel, FormsModule, ReactiveFormsModule, IonInput, IonButtons, IonModal, IonCardContent, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonList, IonItem, IonSelect, IonSelectOption],
})
export class TransactionsPage {

  @ViewChild(IonModal) modal: IonModal;
  authService = inject(AuthService)
  utilsSvc = inject(UtilService)
  subscription: Subscription;
  router = inject(Router)
  walletService = inject(WalletService)
  userWallets: Wallet[] = [];
  categories: Category[] = [];
  idWalletSelected: number | null = null;
  transactions: Transaction[] = [];
  transactionDate: Date = new Date();
  transactionAmount: number = 0;
  transactionDescription: string = '';
  transactionType: string = '';
  repeat: string = '';
  transactionCategoryIdSelected: number | null = 0;
  transactionSelected: Transaction | null = null;
  categoryName: string = '';
  repeatOptions: string[] = [
    "NEVER",
    "EVERY DAY",
    "EVERY TWO DAYS",
    "EVERY WORKING DAY",
    "EVERY WEEK",
    "EVERY TWO WEEKS",
    "EVERY MONTH",
    "EVERY TWO MONTHS",
    "EVERY THREE MONTHS",
    "EVERY SIX MONTHS",
    "EVERY YEAR"
  ];
  selectedWalletIdToFilterTransactions: number | null = null;

  constructor() {
    addIcons({ cashOutline, closeCircleOutline, checkmarkCircleOutline, alertCircleOutline, pencilOutline, trashOutline })
  }

  ngOnInit(): void {
    this.getUserWallets();
    this.getUserTransactions();
    this.getTransactionCategories();
    this.subscription = this.authService._refresh$.subscribe(
      () => {
        this.getUserWallets();
        this.getUserTransactions();
      })
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

  getUserTransactions() {
    this.walletService.getUserTransactions().subscribe(
      response => {
        if (this.selectedWalletIdToFilterTransactions) {
          this.transactions = response.data.filter((transaction: Transaction) => 
            transaction.walletId === this.selectedWalletIdToFilterTransactions
          );
        } else {
          this.transactions = response.data;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getTransactionCategories() {
    this.walletService.getTransactionCategories().subscribe(
      response => {
        this.categories = response.data;
      },
      error => {
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

  editTransaction(transaction: Transaction) {
    this.transactionAmount = transaction.amount;
    this.transactionSelected = transaction;
    this.idWalletSelected = transaction.walletId;
    this.transactionDescription = transaction.description;
    this.transactionType = transaction.type;
    this.repeat = transaction.repeat;
    this.transactionCategoryIdSelected = transaction.categoryId;
    this.transactionDate = transaction.date;
    this.modal.present();
  }

  confirmDeleteTransaction(transaction: Transaction) {
    this.utilsSvc.presentAlert({
      header: 'Delete transaction!',
      message: 'Are you sure you want to delete this transaction?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, delete it',
          handler: () => {
            this.deleteTransaction(transaction)
          },
        },
      ],
    })
  }

  deleteTransaction(transaction: Transaction) {
    this.utilsSvc.presentLoading();
    this.walletService.deleteTransaction(transaction).subscribe(
      () => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: 'Transaction Deleted Success',
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

  onSubmit(form: NgForm) {
    if (form.valid) {
      const transaction: Transaction = {
        date: this.transactionDate,
        amount: this.transactionAmount,
        type: this.transactionType,
        repeat: this.repeat,
        walletId: this.idWalletSelected,
        categoryId: this.transactionCategoryIdSelected,
        active: true,
        description: this.transactionDescription,
      } 
      if(this.transactionSelected) {
        this.createOrUpdateTransaction(transaction, false, form);
      } else {
        this.createOrUpdateTransaction(transaction, true, form);
      }
    }
  }

  createOrUpdateTransaction(transaction: Transaction, create: boolean, form: NgForm) {
    this.utilsSvc.presentLoading();
    this.walletService.createOrUpdateTransaction(transaction, create).subscribe(
      () => {
        this.utilsSvc.dismissLoading();
        const message = create ? 'Transaction Created successfully' : 'Transaction updated successfully'
         this.utilsSvc.presentToast({
          message: message,
          color: 'success',
          position: 'top',
          icon: 'checkmark-circle-outline',
          duration: 2000,
        });
        form.resetForm();
        this.getTransactionCategories();
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
  }

  filterTransactionsByWalletId(event: any) {
    this.getUserTransactions();
  }

  getWalletNameById(walletId: number | string): string {
    const wallet = this.userWallets.find(w => w.id === walletId);
    return wallet ? wallet.name : 'Wallet not found';
  }

  truncateDescription(description: string, maxLength: number): string {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '...';
    }
    return description;
  }

  cancel() {
      this.transactionAmount = 0;
      this.transactionDescription = '';
      this.transactionType = '';
      this.repeat = '';
      this.transactionCategoryIdSelected = 0;
      this.transactionDate = new Date();
      this.idWalletSelected = null;
      this.transactionSelected = null;
    this.modal.dismiss(null, 'cancel');
  }


}
