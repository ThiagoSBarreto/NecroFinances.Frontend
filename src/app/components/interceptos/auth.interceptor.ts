import { HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import { BehaviorSubject, switchMap, catchError, filter, take, throwError } from "rxjs";

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const loginService = inject(LoginService);

    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    const addToken = (request: HttpRequest<any>, token: string) => {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    };

    if (req.url.includes('/refreshToken')) {
        return next(req);
    }

    if (!token) {
        return next(req);
    }

    if (!isTokenExpired(token)) {
        return next(addToken(req, token));
    }
    
    if (isRefreshing) {
        return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(newToken => next(addToken(req, newToken!)))
        );
    }
    
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return loginService.refresh({ accessToken: '', refreshToken: refreshToken || '' }).pipe(
        switchMap((response: any) => {
            isRefreshing = false;

            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            refreshTokenSubject.next(response.accessToken);

            return next(addToken(req, response.accessToken));
        }),
        catchError((err) => {
            isRefreshing = false;

            localStorage.clear();
            router.navigate(['/login']);

            return throwError(() => err);
        })
    );

    function isTokenExpired(token: string | null): boolean {
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000;
            return Date.now() > exp;
        } catch {
            return true;
        }
    }
};