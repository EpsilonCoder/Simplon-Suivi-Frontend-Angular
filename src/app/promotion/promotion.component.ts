import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NotificationType } from '../enum/notification-type.enum';
import { CustomHttpResponse } from '../model/custom-http-response';
import { Promo } from '../model/promo';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
  private subcriptions: Subscription[] = [];
  promo: any;
  fileName: string | undefined;
  promoForm: any;
  currentId: any;
  editLibelle: any;
  public editPromo = new Promo();

  constructor(private router: Router, public userService: UserService, private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getPromo(true);
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur c est produit veuillez réessayer , s il vou plait');
    }
  }

  public getPromo(showNotification: boolean): void {
    this.userService.getPromo()
      .subscribe
      ((data: Promo[]) => {
        this.promo = data;
      }, err => {
        // this.sendNotification(NotificationType.ERROR, `Une erreur c est produit lors de l ajout de votre promotion`);
      })
  }

  public async onDeletePromo(id: Promo): Promise<void> {

    this.subcriptions.push(
      this.userService.deletePromo(id.id).subscribe(
        (response: CustomHttpResponse) => {
          Swal.fire(
            'Supprimé!',
            'Cet utilisateur a été supprimé avec succes',
            'success'
          )
          this.sendNotification(NotificationType.SUCCESS, "La promotion a bien été supprimée");
          this.getPromo(true);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  public onUpdatePromo(data: any): void {
    this.userService.updatePromo(data).subscribe(
      (response: Promo) => {
        this.clickButton('new-user-close');
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    )

  }






  public onEditPromo(editPromo: Promo): void {
    this.editPromo = editPromo;
    this.currentId = this.editPromo.id;
    this.clickButton('openUserEdit');


  }


  clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }

  saveNewPromo() {
    this.clickButton('new-promo-save');
  }

  public onAddNewPromo(data: any) {
    console.warn(data)
    this.userService.addPromo(data).subscribe((result) => {
      console.warn(result);
      this.getPromo(true);
      this.clickButton('closePromoModalButton');
      Swal.fire(
        'Promotion!',
        'Promotion ajouté avec succés',
        'success'
      )
      this.router.navigate(['/promotion']);
    },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, error.error.message);
      })
  }

}
