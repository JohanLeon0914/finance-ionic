import { NgClass } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, IonHeader, IonIcon, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonSelect, IonButtons, IonInput, IonSelectOption, IonLabel, IonCheckbox, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pricetagOutline, closeCircleOutline, checkmarkCircleOutline, alertCircleOutline, pencilOutline, trashOutline, addCircleOutline, airplaneOutline, alarmOutline, albumsOutline, analyticsOutline, apertureOutline, appsOutline, archiveOutline, arrowBackCircleOutline, arrowDownCircleOutline, arrowForwardCircleOutline, arrowUpCircleOutline, atCircleOutline, bagOutline, balloonOutline, barChartOutline, barcodeOutline, basketOutline, batteryChargingOutline, batteryDeadOutline, batteryFullOutline, beakerOutline, bedOutline, beerOutline, bicycleOutline, bluetoothOutline, boatOutline, bookOutline, bookmarkOutline, briefcaseOutline, brushOutline, bugOutline, buildOutline, bulbOutline, busOutline, businessOutline, cafeOutline, calculatorOutline, calendarOutline, callOutline, cameraOutline, carOutline, cardOutline, cartOutline, cashOutline, chatbubbleOutline, checkmarkDoneOutline, cloudDownloadOutline, cloudUploadOutline } from 'ionicons/icons';
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
  imports: [NgClass, IonIcon ,IonText, IonCheckbox, IonLabel, FormsModule, ReactiveFormsModule, IonInput, IonButtons, IonModal, IonCardContent, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonList, IonItem, IonSelect, IonSelectOption],
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
  categoryIcon: string = '';
  iconNames: string[] = [
    'pricetag-outline',
    'close-circle-outline',
    'checkmark-circle-outline',
    'alert-circle-outline',
    'pencil-outline',
    'trash-outline',
    'add-circle-outline',
    'airplane-outline',
    'alarm-outline',
    'albums-outline',
    'analytics-outline',
    'aperture-outline',
    'apps-outline',
    'archive-outline',
    'arrow-back-circle-outline',
    'arrow-down-circle-outline',
    'arrow-forward-circle-outline',
    'arrow-up-circle-outline',
    'at-circle-outline',
    'bag-outline',
    'balloon-outline',
    'bar-chart-outline',
    'barcode-outline',
    'basket-outline',
    'battery-charging-outline',
    'battery-dead-outline',
    'battery-full-outline',
    'beaker-outline',
    'bed-outline',
    'beer-outline',
    'bicycle-outline',
    'bluetooth-outline',
    'boat-outline',
    'book-outline',
    'bookmark-outline',
    'briefcase-outline',
    'brush-outline',
    'bug-outline',
    'build-outline',
    'bulb-outline',
    'bus-outline',
    'business-outline',
    'cafe-outline',
    'calculator-outline',
    'calendar-outline',
    'call-outline',
    'camera-outline',
    'car-outline',
    'card-outline',
    'cart-outline',
    'cash-outline',
    'chatbubble-outline',
    'checkmark-done-outline',
    'cloud-download-outline',
    'cloud-upload-outline'
  ];
  constructor() {
    addIcons({
      pricetagOutline, closeCircleOutline, checkmarkCircleOutline, alertCircleOutline, pencilOutline, trashOutline,
      addCircleOutline, airplaneOutline, alarmOutline, albumsOutline, analyticsOutline, apertureOutline, appsOutline, 
      archiveOutline, arrowBackCircleOutline, arrowDownCircleOutline, arrowForwardCircleOutline, arrowUpCircleOutline, 
      atCircleOutline, bagOutline, balloonOutline, barChartOutline, barcodeOutline, basketOutline, batteryChargingOutline, 
      batteryDeadOutline, batteryFullOutline, beakerOutline, bedOutline, beerOutline, bicycleOutline, bluetoothOutline, 
      boatOutline, bookOutline, bookmarkOutline, briefcaseOutline, brushOutline, bugOutline, buildOutline, bulbOutline, 
      busOutline, businessOutline, cafeOutline, calculatorOutline, calendarOutline, callOutline, cameraOutline, 
      carOutline, cardOutline, cartOutline, cashOutline, chatbubbleOutline, checkmarkDoneOutline, cloudDownloadOutline, 
      cloudUploadOutline
    });
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
          icon: this.categoryIcon,
          id: this.categorySelected.id
        } 
        this.createOrUpdateCategory(category, false, form);
      } else {
        const category: Category = {
          name: this.categoryName,
          icon: this.categoryIcon
        } 
        this.createOrUpdateCategory(category, true, form);
      }
      this.categoryName = '';
      this.categoryIcon = '';
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

  onSelectIcon(icon: string) {
    this.categoryIcon = icon;
  }

  cancel() {
    this.categoryName = '';
    this.modal.dismiss(null, 'cancel');
  }


}
