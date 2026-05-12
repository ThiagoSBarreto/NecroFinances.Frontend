import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SettingsModel } from "../models/settings.model";
import { environment } from "../../environments/environment";

@Injectable()
export class SettingsService {

    constructor(
        private http: HttpClient
    ) {

    }

    getSettingsByDate(inicio: Date, fim: Date): Observable<SettingsModel> {
        return this.http.get<SettingsModel>(`${environment.settingsContext}GetSettingsByDate?inicio=${inicio.toISOString()}&fim=${fim.toISOString()}`);
    }

    updateSettings(model: SettingsModel): Observable<SettingsModel> {
        return this.http.post<SettingsModel>(`${environment.settingsContext}updateSettings`, model);
    }
}