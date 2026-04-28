import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserModel } from "../models/user.model";
import { environment } from "../../environments/environment";

@Injectable()
export class LoginService {
    
    constructor (
        private http: HttpClient
    ) {

    }

    login(username: string, password: string): Observable<any> {
        const user: UserModel = {
            username: username,
            password: password
        };

        return this.http.post<any>(`${environment.loginContext}login`, user);
    }

    registrar(username: string, password: string): Observable<UserModel> {
        const user: UserModel = {
            username: username,
            password: password
        };

        return this.http.post<UserModel>(`${environment.loginContext}register`, user);
    }
}