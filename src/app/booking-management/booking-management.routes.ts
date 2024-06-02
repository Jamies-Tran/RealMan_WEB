import { Route } from '@angular/router';
import { HomepageLayoutComponent } from '../share/ui/home-page-layout.component';
import { roleGuard } from '../share/guard/role-guard';

const BOOKING_MANAGEMENT_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'booking-list',
    pathMatch: 'full',
  },
  {
    path: 'booking-list',
    loadComponent: () =>
      import('./feature/booking-list.component').then(
        (m) => m.BookingListComponent
      ),
      data: { role: ['RECEPTIONIST'] },
      canActivate: [roleGuard]
  },
  {
    path: 'create-booking',
    loadComponent: () =>
      import('./feature/booking.component').then(
        (m) => m.BookingComponent
      ),
      data: { role: ['RECEPTIONIST'] },
      canActivate: [roleGuard]
  },
];
export default BOOKING_MANAGEMENT_ROUTES;
