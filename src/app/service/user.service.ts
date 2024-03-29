import { Entreprise } from './../model/entreprise';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../model/custom-http-response';
import { Promo } from '../model/promo';
import { Annonce } from '../model/annonce';


@Injectable({ providedIn: 'root' })
export class UserService {
  public host = environment.apiUrl;

  constructor(public http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/list`);
  }

  public getUsersAlafabrique(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/Alafabrique`);
  }

  public getUsersEnEntreprise(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/EnEntreprise`);
  }

  public addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/user/reset-password/${email}`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
      {
        reportProgress: true,
        observe: 'events'
      });
  }

  public deleteUser(username: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/delete/${username}`);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  getUsersFromLocalCache(): User[] | null {
    return localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')!) : null;
  }

  createUserFromData(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('telephone', user.telephone);
    formData.append('promo',JSON.stringify(user.promo?.id));
    formData.append('entreprise',JSON.stringify(user.entreprise?.id));
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNotLocked', JSON.stringify(user.isNotLocked));
    formData.append('situations', JSON.stringify(user.situations));
    formData.append('entretien', JSON.stringify(user.entretien));
    return formData;
  }


  /**
   * Service pour la  gestion des promotions
   *
   * **/


  public addPromo(formData: FormData): Observable<Promo> {
    return this.http.post<any>(`${this.host}/addPromo`, formData);
  }
  public getPromo(): Observable<Promo[]> {
    return this.http.get<Promo[]>(`${this.host}/getPromo`);
  }

  public updatePromo(formData: FormData): Observable<Promo> {
    return this.http.post<any>(`${this.host}/promoes`, formData);
  }

  public deletePromo(id: number): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/deletePromo/${id}`);
  }

  createPromoFromData(id: number, promo: Promo): FormData {
    const formData = new FormData();
    formData.append('id', promo.id);
    formData.append('libelle', promo.libelle);
    return formData;
  }

  /**
  * Service pour la  gestion des annonces
  * **/
  public addAnnonce(formData: FormData): Observable<Annonce> {
    return this.http.post<any>(`${this.host}/addAnnonce`, formData);
  }

  public getAnnonce(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.host}/getAnnonce`);
  }

  public updateAnnonce(formData: FormData): Observable<Annonce> {
    return this.http.post<any>(`${this.host}/annonces`, formData);
  }

  public deleteAnnonce(id: number): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/deleteAnnonce/${id}`);
  }

  createAnnonceFromData(id: number, annonce: Annonce): FormData {
    const formData = new FormData();
    formData.append('id', annonce.id);
    formData.append('description', annonce.description);
    formData.append('libelle', annonce.libelle);
    formData.append('lien', annonce.lien);
    formData.append('cible', annonce.cible);
    return formData;
  }

  /**
  * Service pour la  gestion des entreprises
  **/
  public addentreprise(formData: FormData): Observable<Entreprise> {
    return this.http.post<any>(`${this.host}/addEntreprise`, formData);
  }

  public getEntreprise(): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(`${this.host}/getEntreprise`);
  }

  public updateEntreprise(formData: FormData): Observable<Entreprise> {
    return this.http.post<any>(`${this.host}/entrepriseAcceuil`, formData);
  }

  public deleteEntreprise(id: number): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/deleteEntreprise/${id}`);
  }

  createEntrepriseFromData(id: number, entreprise: Entreprise): FormData {
    const formData = new FormData();
    formData.append('id', entreprise.id);
    formData.append('raisonSocial', entreprise.raisonSocial);
    formData.append('nomPersonneContat', entreprise.nomPersonneContat);
    formData.append('prenomPersonneContact', entreprise.prenomPersonneContact);
    formData.append('telephone', entreprise.telephone);
    formData.append('email', entreprise.email);
    return formData;
  }


}
