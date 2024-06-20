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
        this.transactions = response.data;
      },
      error => {
        console.log(error)
      }
    )
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


  onWalletChange(event: any) {

  }

  editTransaction(transaction: Transaction) {

  }

  confirmDeleteTransaction(transaction: Transaction) {

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
      console.log(transaction)
      this.walletService.createTransaction(transaction).subscribe(
        () => {
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
      )
    }
  }

  cancel() {
    // if (this.walletSelected) {
    //   this.walletName = '';
    //   this.walletDescription = '';
    //   this.walletSelected = null;
    // }
    this.modal.dismiss(null, 'cancel');
  }

}
