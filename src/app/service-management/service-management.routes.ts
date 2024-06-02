import { Route } from '@angular/router';
import { roleGuard } from '../share/guard/role-guard';

const SERVICE_MANAGEMENT_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'service-list',
    pathMatch: 'full',
  },
  {
    path: 'service-list',
    loadComponent: () =>
      import('./feature/service-list.component').then(
        (m) => m.ServiceListComponent
      ),
      data: { role: ['SHOP_OWNER', 'BRANCH_MANAGER'] },
      canActivate: [roleGuard]
  },
  {
    path: 'create-service',
    loadComponent: () =>
      import('./feature/service.component').then((m) => m.ServiceComponent),
      data: { role: ['SHOP_OWNER'] },
      canActivate: [roleGuard]
  },
  {
    path: ':serviceId',
    loadComponent: () =>
      import('./feature/service-update.component').then((m) => m.ServiceUpdateComponent),
      data: { role: ['SHOP_OWNER', 'BRANCH_MANAGER'] },
      canActivate: [roleGuard]
  },
];
export default SERVICE_MANAGEMENT_ROUTES;
