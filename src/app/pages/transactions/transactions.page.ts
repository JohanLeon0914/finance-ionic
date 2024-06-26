import { group, transition } from '@angular/animations';
import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, IonHeader, IonIcon, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonSelect, IonButtons, IonInput, IonSelectOption, IonLabel, IonCheckbox, IonText, IonDatetime, IonItemDivider } from '@ionic/angular/standalone';
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
  imports: [IonItemDivider, IonDatetime, IonText, IonCheckbox, IonLabel, FormsModule, ReactiveFormsModule, IonInput, IonButtons, IonModal, IonCardContent, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonList, IonItem, IonSelect, IonSelectOption],
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
  today = new Date();
  formattedToday = `${this.today.getFullYear()}-${String(this.today.getMonth() + 1).padStart(2, '0')}-${String(this.today.getDate()).padStart(2, '0')}`;
  transactionSelected: Transaction = {
    date: this.formattedToday,
    description: '',
    amount: 0,
    type: '',
    repeat: '',
    walletId: 0,
    categoryId: 0,
    active: true
  };
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
  groupTransitionsByDates: { date: string; transactions: Transaction[] }[] = [];

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
        this.transactions = this.transactions.map(transaction => {
          const date = new Date(transaction.date);
          transaction.date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          
          if (transaction.next_date) {
            const nextDate = new Date(transaction.next_date);
            transaction.next_date = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
          }
          return transaction;
        });
  
        // Agrupar transacciones por fecha
        const transactionsByDate = this.transactions.reduce((acc: { [key: string]: Transaction[] }, transaction: Transaction) => {
          if (!acc[transaction.date]) {
            acc[transaction.date] = [];
          }
          acc[transaction.date].push(transaction);
          return acc;
        }, {});
  
        this.groupTransitionsByDates = Object.keys(transactionsByDate).map(date => ({
          date,
          transactions: transactionsByDate[date]
        }));
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
    this.transactionSelected = transaction;
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
          color: 'success',
          position: 'top',
          icon: 'checkmark-circle-outline',
          duration: 2000,
        });
        this.getUserWallets();
      },
      error => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: `Error: ${error.error.data}`,
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
      if (this.transactionSelected.id) {
        const transaction = {
          id: this.transactionSelected.id,
          date: this.transactionSelected.date,
          description: this.transactionSelected.description,
          amount: this.transactionSelected.amount,
          type: this.transactionSelected.type,
          repeat: this.transactionSelected.repeat,
          walletId: this.transactionSelected.walletId,
          categoryId: this.transactionSelected.categoryId,
          active: this.transactionSelected.active,
        } 
        this.createOrUpdateTransaction(transaction, false, form);
      } else {
        this.createOrUpdateTransaction(this.transactionSelected, true, form);
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
          message: `Error: ${error.error.data}`,
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

  truncateDescription(description: string | null | undefined, maxLength: number): string {
    if (!description) {
      return ''; 
    }
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '...';
    }
    return description;
  }

  cancel() {
    this.transactionSelected = {
      date: this.formattedToday,
      description: '',
      amount: 0,
      type: '',
      repeat: '',
      walletId: 0,
      categoryId: 0,
      active: true
    };
    this.modal.dismiss(null, 'cancel');
  }


}
