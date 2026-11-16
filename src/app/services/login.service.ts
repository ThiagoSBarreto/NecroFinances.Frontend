import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserModel } from "../models/user.model";
import { environment } from "../../environments/environment";
import { LoginResponseModel } from "../models/login.response.model";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    
    constructor (
        private http: HttpClient
    ) {

    }

    login(username: string, password: string): Observable<LoginResponseModel> {
        const user: UserModel = {
            username: username,
            password: password
        };

        return this.http.post<LoginResponseModel>(`${environment.loginContext}login`, user);
    }

    logout(refreshToken: string): Observable<void> {
        return this.http.post<void>(`${environment.loginContext}logout`, { refreshToken });
    }

    registrar(username: string, password: string): Observable<UserModel> {
        const user: UserModel = {
            username: username,
            password: password
        };

        return this.http.post<UserModel>(`${environment.loginContext}register`, user);
    }

    refresh(tokenResponse: LoginResponseModel): Observable<LoginResponseModel> {
        return this.http.post<LoginResponseModel>(`${environment.loginContext}refreshToken`, tokenResponse);
    }
}
