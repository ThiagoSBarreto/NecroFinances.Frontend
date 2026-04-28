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

    getGastoByRange(inicio: Date, fim: Date): Observable<GastosModel[]> {
        return this.http.get<GastosModel[]>(`${environment.gastosContext}GetGastosByDate?inicio=${inicio.toISOString()}&fim=${fim.toISOString()}`);
    }

    addNewGasto(gasto: GastosModel): Observable<GastosModel> {
        return this.http.post<GastosModel>(`${environment.gastosContext}AddNewGasto`, gasto);
    }

    updateGasto(gasto: GastosModel): Observable<boolean> {
        return this.http.put<boolean>(`${environment.gastosContext}UpdateGasto`, gasto);
    }

    deleteGasto(id?: number): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.gastosContext}DeleteGasto?gastoID=${id}`);
    }

    maskAsPaid(id: number): Observable<boolean> {
        return this.http.post<boolean>(`${environment.gastosContext}MarkAsPaid?gastoID=${id}`, {});
    }

    pagarCartao(inicio: Date, fim: Date): Observable<boolean> {
        return this.http.post<boolean>(`${environment.gastosContext}PagarCartao?inicio=${inicio.toISOString()}&fim=${fim.toISOString()}`, {});
    }
}