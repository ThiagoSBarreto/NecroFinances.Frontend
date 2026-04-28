import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PatrimonioModel } from "../models/patrimonio.model";
import { environment } from "../../environments/environment";

@Injectable()
export class PatrimonioService {

    constructor (
        private http: HttpClient
    ) {

    }

    getPatrimonio(): Observable<PatrimonioModel> {
        return this.http.get<PatrimonioModel>(`${environment.patrimonioContext}GetPatrimonio`);
    }

    adicionarPatrimonio(patrimonio: PatrimonioModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.patrimonioContext}AdicionarPatrimonio`, patrimonio);
    }

    getPatrimonios(): Observable<PatrimonioModel[]> {
        return this.http.get<PatrimonioModel[]>(`${environment.patrimonioContext}GetPatrimonios`);
    }
}