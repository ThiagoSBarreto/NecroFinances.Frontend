import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, finalize, map, tap } from "rxjs";
import { environment } from "../../environments/environment";

interface ValueVisibilityResponse {
    hideValues: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ValueVisibilityService {
    readonly isHidden = signal(true);
    readonly isLoaded = signal(false);

    private readonly endpoint = `${environment.loginContext}valueVisibility`;

    constructor(private http: HttpClient) { }

    load(): Observable<boolean> {
        this.isHidden.set(true);
        this.isLoaded.set(false);

        return this.http.get<ValueVisibilityResponse>(this.endpoint).pipe(
            tap(response => this.isHidden.set(response.hideValues)),
            map(response => response.hideValues),
            finalize(() => this.isLoaded.set(true))
        );
    }

    update(hideValues: boolean, password?: string): Observable<void> {
        if (hideValues) {
            this.isHidden.set(true);
        }

        return this.http.put<ValueVisibilityResponse>(this.endpoint, { hideValues, password }).pipe(
            tap(response => this.isHidden.set(response.hideValues)),
            map(() => undefined)
        );
    }
}
