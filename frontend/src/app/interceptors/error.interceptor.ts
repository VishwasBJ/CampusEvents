import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 401:
                        // Unauthorized - clear token and redirect to login
                        // But don't redirect if we're on login or register pages
                        errorMessage = 'Unauthorized. Please log in again.';
                        const currentUrl = router.url;
                        if (!currentUrl.includes('/login') && !currentUrl.includes('/register')) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            router.navigate(['/login']);
                        }
                        break;
                    case 403:
                        // Forbidden
                        errorMessage = 'Access denied. You do not have permission to perform this action.';
                        break;
                    case 404:
                        // Not found
                        errorMessage = 'Resource not found.';
                        break;
                    case 500:
                        // Server error
                        errorMessage = 'Server error. Please try again later.';
                        break;
                    default:
                        // Extract error message from response if available
                        if (error.error?.message) {
                            errorMessage = error.error.message;
                        } else {
                            errorMessage = `Error ${error.status}: ${error.statusText}`;
                        }
                }
            }

            // Log error to console for debugging
            console.error('HTTP Error:', {
                status: error.status,
                message: errorMessage,
                error: error.error,
                url: req.url
            });

            // Show toast notification for errors (but not for 401 on auth endpoints)
            const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');
            if (!(error.status === 401 && isAuthEndpoint)) {
                toastService.error(errorMessage);
            }

            // Return error with user-friendly message
            return throwError(() => ({
                status: error.status,
                message: errorMessage,
                originalError: error
            }));
        })
    );
};
