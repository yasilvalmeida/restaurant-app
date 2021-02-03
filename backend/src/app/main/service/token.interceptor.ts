import { Injectable } from '@angular/core';
import { 
    HttpRequest, 
    HttpHandler, 
    HttpEvent, 
    HttpInterceptor, 
    HttpResponse, 
    HttpErrorResponse 
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor
    (
        public _authService: AuthService
    ) 
    {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //console.log("interceptor", request)
        if (request.url.includes("profile")) {
            request = request.clone({
                setHeaders: {
                    ContentType: 'multipart/data-form'
                }
            });
        }
        if (this._authService.getToken() != null) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${this._authService.getToken()}`
                }
            });
        }
        return next.handle(request);
    }
}