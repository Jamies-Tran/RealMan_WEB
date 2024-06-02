import { Route } from "@angular/router";
import { HomepageLayoutComponent } from "../share/ui/home-page-layout.component";

const HOME_PAGE_ROUTES: Route[] = [
    {
      path: '',
      redirectTo: 'overview',
      pathMatch: 'full',
    },
    {
      path: 'overview',
      loadComponent: () => import('./feature/overview.component').then(m => m.OverviewComponent),
    },
    {
      path: 'profile',
      loadComponent: () => import('./feature/profile.component').then(m => m.ProfileComponent),
    },
]
export default HOME_PAGE_ROUTES;
