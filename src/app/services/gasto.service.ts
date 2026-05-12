import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GastosModel } from "../models/gasto.model";
import { environment } from "../../environments/environment";

@Injectable()
export class GastoService {

    constructor(
        private http: HttpClient
    ) {

    }

    addGasto(gasto: GastosModel): Observable<GastosModel> {
        return this.http.post<GastosModel>(`${environment.gastosContext}AddGasto`, gasto);
    }

    updateGasto(gasto: GastosModel): Observable<boolean> {
        return this.http.put<boolean>(`${environment.gastosContext}UpdateGasto`, gasto);
    }

    deleteGasto(id?: number): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.gastosContext}DeleteGasto?gastoID=${id}`);
    }
}