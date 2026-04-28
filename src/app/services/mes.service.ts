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

    getMonthAtual(date: Date): Observable<MesModel> {
        return this.http.get<MesModel>(`${environment.monthContext}GetMesAtual?date=${date.toISOString()}`);
    }

    updateMonth(mes: MesModel): Observable<MesModel> {
        return this.http.put<MesModel>(`${environment.monthContext}UpdateMes`, mes);
    }
}