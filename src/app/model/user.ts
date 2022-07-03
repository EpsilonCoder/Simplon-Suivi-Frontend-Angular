export class User {

    public userId: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public email: string;
    public lastLoginDate: Date | undefined;
    public lastLoginDateDisplay: Date | undefined;
    public joinDate: Date | undefined;
    public profileImageUrl: string;
    public active: boolean;
    public isNotLocked: boolean;
    public role: string;
    public authorities: [];

    constructor() {
        this.userId = '';
        this.firstName = '';
        this.lastName = '';
        this.username = '';
        this.email = '';
        this.profileImageUrl = '';
        this.active = false;
        this.isNotLocked = false;
        this.role = '';
        this.authorities = [];
    }

}