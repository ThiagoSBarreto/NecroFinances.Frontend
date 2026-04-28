import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {

    private _loading = new BehaviorSubject<boolean>(false);
    loading$ = this._loading.asObservable();

    private requestsAtivas = 0;

    mostrar(): void {
        this.requestsAtivas++;
        this._loading.next(true);
    }

    esconder(): void {
        this.requestsAtivas = Math.max(0, this.requestsAtivas - 1);
        if (this.requestsAtivas === 0) {
            this._loading.next(false);
        }
    }
}