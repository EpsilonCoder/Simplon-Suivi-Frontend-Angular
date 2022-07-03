import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private titleSubject = new BehaviorSubject<string>('Profile');
  public titleAction$ = this.titleSubject.asObservable();


  public users: User[] | undefined;
  public refreshing: boolean | undefined;
  private subcriptions: Subscription[] = [];
  selectedUser: User | undefined;
  fileName!: string;
  profileImage: File | undefined;


  constructor(private router: Router, private userService: UserService, private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    } else {
      this.router.navigateByUrl('/login');
    }

    this.getUsers(true);
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subcriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} utilisateurs chargés avec Succes`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur c est produit veuillez réessayer , s il vou plait');
    }
  }

  //fonction permettant d'avoir les details de l'utilisateurs selectionée.

  public onSelectUser(selectedUser: User): void {

    this.selectedUser = selectedUser;
    document.getElementById('openUserInfo')?.click();

  }


  onProfileImageChange(event: Event): void {
    const target = (event.target as HTMLInputElement);
    this.fileName = target.files![0].name;
    this.profileImage = target.files![0];
  }


  saveNewUser() {
    this.clickButton('new-user-save');
  }

  onAddNewUser(userForm: NgForm): void {
    const formData: FormData = this.userService.createUserFormDate('', userForm.value, this.profileImage!);
    const userSaveSubscription = this.userService.addUser(formData)
      .subscribe({
        next: (user: User) => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          this.fileName = '';
          this.profileImage != null;
          userForm.reset();
          userForm.form.controls['role'].setValue('ROLE_USER');
          this.sendNotification(NotificationType.SUCCESS, `${user.firstName} ${user.lastName} a bien été ajouté`);
        },
        error: (err: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, err.error.message);
          this.profileImage != null;
        }
      });
  }

  clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }

}
