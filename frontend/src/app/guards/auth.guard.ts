import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    // Check if user is authenticated
    if (authService.isAuthenticated()) {
        return true;
    }

    // Store the attempted URL for redirecting after login
    const returnUrl = state.url;
    
    // Redirect to login page with return url
    router.navigate(['/login'], { 
        queryParams: { returnUrl } 
    });
    
    return false;
};
