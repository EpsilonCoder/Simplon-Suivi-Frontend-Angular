import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotificationType } from '../enum/notification-type.enum';
import { CustomHttpResponse } from '../model/custom-http-response';
import { entreprise } from '../model/entreprise';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.css']
})
export class EntrepriseComponent implements OnInit {
  entreprise: entreprise[] | any;
  subcriptions: any;

  constructor(private router: Router, public userService: UserService, private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }


  public getEntreprise(showNotification: boolean): void {
    this.userService.getEntreprise()
      .subscribe
      ((data: entreprise[]) => {
        this.entreprise = data;
      }, err => {
        this.sendNotification(NotificationType.ERROR, `Une erreur c est produit lors de l ajout de votre promotion`);
      })
  }

  public async onDeleteEntreprise(id: entreprise): Promise<void> {


    this.userService.deleteEntreprise(id.id).subscribe(
      (response: CustomHttpResponse) => {
        Swal.fire(
          'Supprimé!',
          'Cet utilisateur a été supprimé avec succes',
          'success'
        )
        //this.sendNotification(NotificationType.SUCCESS, "La promotion a bien été supprimée");
        this.getEntreprise(true);
      },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, error.error.message);
      }
    )

  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur c est produit veuillez réessayer , s il vou plait');
    }
  }

  clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }


  saveNewAnnonce() {
    this.clickButton('new-promo-save');
  }

  public onAddNewEntreprise(data: any) {
    console.warn(data)
    this.userService.addentreprise(data).subscribe((result) => {
      console.warn(result);
      this.getEntreprise(true);
      this.clickButton('closePromoModalButton');
      Swal.fire(
        'Promotion!',
        'Promotion ajouté avec succés',
        'success'
      )
      this.getEntreprise(true);
    },
      (error: HttpErrorResponse) => {
        Swal.fire(
          'Promotion!',
          'L entreprise est deja partenaire de simplon',
          'error'
        )
      })
  }



  ngOnInit(): void {
    this.getEntreprise(true);
  }

}
