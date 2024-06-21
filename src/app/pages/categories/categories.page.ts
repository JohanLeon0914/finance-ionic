import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, IonHeader, IonIcon, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonSelect, IonButtons, IonInput, IonSelectOption, IonLabel, IonCheckbox, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircleOutline, closeCircleOutline, pencilOutline, pricetagOutline, trashOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/utils.service';
import { WalletService } from 'src/app/services/wallet.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { Category } from 'src/models/category.model';
import { Wallet } from 'src/models/wallet.model';

@Component({
  selector: 'app-categorties',
  templateUrl: 'categories.page.html',
  styleUrls: ['categories.page.scss'],
  standalone: true,
  imports: [IonText, IonCheckbox, IonLabel, FormsModule, ReactiveFormsModule, IonInput, IonButtons, IonModal, IonCardContent, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonList, IonItem, IonSelect, IonSelectOption],
})
export class CategoriesPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;
  authService = inject(AuthService)
  utilsSvc = inject(UtilService)
  subscription: Subscription;
  router = inject(Router)
  walletService = inject(WalletService)
  userWallets: Wallet[] = [];
  categories: Category[] = [];
  categorySelected: Category | null = null;
  categoryName: string = '';

  constructor() {
    addIcons({ pricetagOutline, closeCircleOutline, checkmarkCircleOutline, alertCircleOutline, pencilOutline, trashOutline })
  }

  ngOnInit(): void {
    this.getTransactionCategories();
    this.subscription = this.authService._refresh$.subscribe(
      () => {
        this.getTransactionCategories();
      })
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

  confirmDeleteCategory(category: Category) {
    this.utilsSvc.presentAlert({
      header: 'Delete category!',
      message: 'Are you sure you want to delete this category?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, delete it',
          handler: () => {
            // this.deleteCategory(category)
          },
        },
      ],
    })
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if(this.categorySelected) {
        const category: Category = {
          name: this.categorySelected.name,
          id: this.categorySelected.id
        } 
        this.createOrUpdateCategory(category, false, form);
      } else {
        const category: Category = {
          name: this.categoryName
        } 
        this.createOrUpdateCategory(category, true, form);
      }
    }
  }

  createOrUpdateCategory(category: Category, create: boolean, form: NgForm) {
    this.utilsSvc.presentLoading();
    this.walletService.createOrUpdateCategory(category, create).subscribe(
      () => {
        this.utilsSvc.dismissLoading();
        const message = create ? 'Category Created successfully' : 'Category updated successfully'
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
  cancel() {
    this.categoryName = '';
    this.modal.dismiss(null, 'cancel');
  }


}
