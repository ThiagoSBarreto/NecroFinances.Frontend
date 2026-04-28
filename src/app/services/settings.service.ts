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

    getSettingsByDate(date: Date): Observable<SettingsModel> {
        return this.http.get<SettingsModel>(`${environment.settingsContext}GetSettings?date=${date.toISOString()}`);
    }

    addNewSetting(settings: SettingsModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.settingsContext}AddNewSetting`, settings);
    }

    updateSetting(settings: SettingsModel): Observable<boolean> {
        return this.http.put<boolean>(`${environment.settingsContext}UpdateSetting`, settings);
    }

    deleteSetting(id: string): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.settingsContext}DeleteSetting/${id}`);
    }
}