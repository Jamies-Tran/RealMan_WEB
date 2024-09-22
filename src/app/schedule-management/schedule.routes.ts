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

  // {
  //   path: 'plan-daily/:id',
  //   loadComponent: () =>
  //     import('./feature/plan-daily.component').then(
  //       (m) => m.PlanDailyComponent
  //     ),
  // },
];
export default SCHEDULE_MANAGEMENT_ROUTES;
