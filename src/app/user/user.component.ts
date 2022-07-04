import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { CustomHttpResponse } from '../model/custom-http-response';
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


  public users!: User[];
  public refreshing: boolean | undefined;
  private subcriptions: Subscription[] = [];
  selectedUser: User | undefined;
  fileName: string | undefined;
  public profileImage!: File | any;
  public editUser = new User();
  private currentUsername!: string;

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
    const formData: FormData = this.userService.createUserFromData('', userForm.value, this.profileImage!);
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

  public searchUsers(searchTerm: string): void {
    console.log(searchTerm);
    const results: User[] = [];
    for (const user of this.userService.getUsersFromLocalCache() || []) {
      if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        // user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        results.push(user);
      }
    }
    this.users = results;
    if (results.length == 0 || !searchTerm) {
      this.users = this.userService.getUsersFromLocalCache() || [];

    }
  }

  onEditUser(epsilon: User): void {
    this.editUser = this.editUser;
    this.currentUsername = this.editUser.username;
    this.clickButton('openUserEdit');


  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserFromData(this.currentUsername, this.editUser, this.profileImage);
    this.subcriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          this.fileName = '';
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} La mise a jour a été effectué avec succés`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
        }
      )
    );
  }

  public onDeleteUser(username: User): void {
    this.subcriptions.push(
      this.userService.deleteUser(username.username).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationType.SUCCESS, "L'utilisateur a bien été supprimée");
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }


  public onResetPassword(emailForm: NgForm): void {

    this.refreshing = false;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subcriptions.push(
      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationType.SUCCESS, 'Le mot de passe de l utilisateur a bien été mis a jour');
          this.refreshing = false;
          emailForm.resetForm();
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.INFO, error.error.message);
          emailForm.resetForm();
        },

      )
    )
  }


}
