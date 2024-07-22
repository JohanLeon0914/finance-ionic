import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonRow, IonCardSubtitle, IonModal, IonHeader, IonIcon, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonSelect, IonButtons, IonInput, IonSelectOption, IonLabel, IonCheckbox, IonText, IonCol, IonGrid } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/utils.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { alertCircleOutline, calendarClearOutline, checkmarkCircleOutline, closeCircleOutline, pencilOutline, pricetagOutline, trashOutline } from 'ionicons/icons';
import { BudgetService } from 'src/app/services/budget.service';
import { Budget } from 'src/models/budget.model';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { Category } from 'src/models/category.model';
import { WalletService } from 'src/app/services/wallet.service';
import { Wallet } from 'src/models/wallet.model';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.page.html',
  styleUrls: ['./budgets.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonCardSubtitle, IonModal, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonSelect, IonButtons, IonInput, IonSelectOption, IonLabel, IonCheckbox, IonText, HeaderComponent]
})
export class BudgetsPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;
  authService = inject(AuthService)
  utilsSvc = inject(UtilService)
  subscription: Subscription;
  router = inject(Router)
  budgetService = inject(BudgetService)
  budgets: Budget[] = [];
  categories: Category[] = [];
  userWallets: Wallet[] = [];
  repeatOptions: string[] = [
    "NEVER",
    "EVERY DAY",
    "EVERY WEEK",
    "EVERY TWO WEEKS",
    "EVERY MONTH",
    "EVERY TWO MONTHS",
    "EVERY THREE MONTHS",
    "EVERY SIX MONTHS",
    "EVERY YEAR"
  ];
  budgetSelected: Budget = {
    limit_amount: 0,
    current_amount: 0,
    repeat: '',
    categories: '',
    wallets: '',
    description: '',
    end_date: '',
    initial_date: '',
    name: '',
  };
  walletService = inject(WalletService)
  walletsIds: string[] = [];
  categoriesIds: string[] = [];

  constructor() {
    addIcons({ pricetagOutline, closeCircleOutline, checkmarkCircleOutline, alertCircleOutline, pencilOutline, trashOutline, calendarClearOutline })
  }

  currencyFormatter(value: number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      minimumFractionDigits: 2,
      currency: 'USD'
    })
    return formatter.format(value)
  }

  ngOnInit(): void {
    this.getUserBudgets();
    this.getTransactionCategories();
    this.getUserWallets();
    this.subscription = this.authService._refresh$.subscribe(
      () => {
        this.getUserBudgets();
        this.getTransactionCategories();
        this.getUserWallets();
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

  getUserBudgets() {
    this.budgetService.getUserBudgets().subscribe(
      response => {
        this.budgets = response.data;
        this.budgets = this.budgets.map(budget => {
          const initialDate = new Date(budget.initial_date);
          budget.initial_date = `${initialDate.getFullYear()}-${String(initialDate.getMonth() + 1).padStart(2, '0')}-${String(initialDate.getDate()).padStart(2, '0')}`;

          const endDate = new Date(budget.end_date);
          budget.end_date = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
          return budget;
        });
      },
      error => {
        console.log(error)
      }
    )
  }

  confirmDeleteBudget() {
    this.utilsSvc.presentAlert({
      header: 'Delete category!',
      message: 'Are you sure you want to delete this budget?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, delete it',
          handler: () => {
            this.deleteBudget(this.budgetSelected);
          },
        },
      ],
    })
  }

  deleteBudget(budget: Budget) {
    this.utilsSvc.presentLoading();
    this.budgetService.deleteBudget(budget).subscribe(
      () => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: 'Budget Deleted Success',
          color: 'success',
          position: 'top',
          icon: 'checkmark-circle-outline',
          duration: 2000,
        });
        this.getUserBudgets();
      },
      error => {
        this.utilsSvc.presentToast({
          message: `Error: ${error.error.data}`,
          color: 'warning',
          position: 'top',
          icon: 'alert-circle-outline',
          duration: 2000,
        });
        this.utilsSvc.dismissLoading();
        console.log(error)
      }
    )
    this.utilsSvc.dismissLoading();
    this.cancel();
  }

  onSubmit(form: NgForm) {
    if (this.budgetSelected.id) {
      const budget: Budget = {
        id: this.budgetSelected.id,
        name: this.budgetSelected.name,
        description: this.budgetSelected.description,
        limit_amount: this.budgetSelected.limit_amount,
        repeat: this.budgetSelected.repeat,
      }
      this.createOrUpdateCategory(budget, false, form);
    } else {
      this.budgetSelected.categories = this.joinIds(this.categoriesIds);
      this.createOrUpdateCategory(this.budgetSelected, true, form);
    }
  }

  joinIds(ids: string[]): string {
    return ids.join(',');
  }

  editBudget(budget: Budget) {
    this.budgetSelected = budget;
    console.log(budget)
    this.modal.present();
  }

  formatedDate(d: string) {
    const date = new Date(d);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  truncateText(description: string | null | undefined, maxLength: number): string {
    if (description == null) {
      return '';
    }
  
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '...';
    }
  
    return description;
  }

  createOrUpdateCategory(budget: Budget, create: boolean, form: NgForm) {
    this.utilsSvc.presentLoading();
    this.budgetService.createOrUpdateBudget(budget, create).subscribe(
      () => {
        this.utilsSvc.dismissLoading();
        const message = create ? 'Budget Created successfully' : 'Budget updated successfully'
        this.utilsSvc.presentToast({
          message: message,
          color: 'success',
          position: 'top',
          icon: 'checkmark-circle-outline',
          duration: 2000,
        });
        form.resetForm();
        this.getUserBudgets();
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
  cancel() {
    this.budgetSelected = {
      limit_amount: 0,
      current_amount: 0,
      repeat: '',
      categories: '',
      wallets: '',
      id: '',
      description: '',
      end_date: '',
      initial_date: '',
      name: '',
    }
    this.modal.dismiss(null, 'cancel');
  }

}
