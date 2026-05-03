import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MesModel } from "../models/month.model";
import { environment } from "../../environments/environment";

@Injectable()
export class MesService {
    
    constructor(
        private http: HttpClient
    ) {

    }

    getMesByDate(inicio: Date, fim: Date): Observable<MesModel> {
        return this.http.get<MesModel>(`${environment.monthContext}GetMesByDate?inicio=${inicio.toISOString()}&fim=${fim.toISOString()}`);
    }

    updateMes(mes: MesModel): Observable<MesModel> {
        return this.http.put<MesModel>(`${environment.monthContext}UpdateMes`, mes);
    }
}