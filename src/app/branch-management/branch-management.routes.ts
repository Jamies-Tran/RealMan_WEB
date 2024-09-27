import { Route } from '@angular/router';
import { HomepageLayoutComponent } from '../share/ui/home-page-layout.component';
import { roleGuard } from '../share/guard/role-guard';

const BRANCH_MANAGEMENT_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'branch-list',
    pathMatch: 'full',
  },
  {
    path: 'branch-list',
    loadComponent: () =>
      import('./feature/branch-list.component').then(
        (m) => m.BranchListComponent
      ),
      data: { role: ['SHOPOWNER'] },
      canActivate: [roleGuard]
  },
  {
    path: 'create-branch',
    loadComponent: () =>
      import('./feature/branch.component').then((m) => m.BranchComponent),
    data: { role: ['SHOPOWNER'] },
    canActivate: [roleGuard]
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./feature/branch-update.component').then(
        (m) => m.BranchUpdateComponent
      ),
      data: { role: ['SHOPOWNER'] },
      canActivate: [roleGuard]
  },
];
export default BRANCH_MANAGEMENT_ROUTES;
