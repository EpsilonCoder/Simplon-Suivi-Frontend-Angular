export class User {

    public userId: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public email: string;
    public telephone: string;
    public lastLoginDate: Date | undefined;
    public lastLoginDateDisplay: Date | undefined;
    public joinDate: Date | undefined;
    public profileImageUrl: string;
    public active: boolean;
    public isNotLocked: boolean;
    public situations: boolean;
    public entretien: boolean;
    public role: string;
    public authorities: [];

    constructor() {
        this.userId = '';
        this.firstName = '';
        this.lastName = '';
        this.username = '';
        this.email = '';
        this.telephone = '';
        this.profileImageUrl = '';
        this.active = false;
        this.isNotLocked = false;
        this.situations = false;
        this.entretien = false;
        this.role = '';
        this.authorities = [];

    }

}