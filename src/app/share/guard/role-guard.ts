import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('role$')
  let isHavePermissions = false;
  const _router = inject(Router);

  route.data['role'].forEach((role: string) => {
    if (roles?.includes(role) || roles?.includes('SHOPOWNER')) {
      isHavePermissions = true;
    }
  });

  if (isHavePermissions) {
    return true;
  } else {
    return _router.createUrlTree(['/none']);
  }
};
