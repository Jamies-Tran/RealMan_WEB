import { Route } from '@angular/router';

const SCHEDULE_MANAGEMENT_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'schedule',
    pathMatch: 'full',
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./feature/schedule.component').then(
        (m) => m.ScheduleComponent
      ),
  },
];
export default SCHEDULE_MANAGEMENT_ROUTES;
