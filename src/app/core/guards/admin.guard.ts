import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, take } from 'rxjs/operators';

export const AdminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getCurrentUser().pipe(
    take(1),
    map(user => {
      const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('ROLE_ADMIN');


      if (isAdmin) {
        return true;
      }

      router.navigate(['/home']);
      return false;
    })
  )
}
