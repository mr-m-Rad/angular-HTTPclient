import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import {
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { tap } from 'rxjs';

function logIntercept(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  console.log(request);
  return next(request).pipe(
    tap({
      next: (next) => {
        if (next.type === HttpEventType.Response) {
          console.log('coming res');
          console.log(next.status);
          console.log(next.body);
        }
      },
    })
  );
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptors([logIntercept]))],
}).catch((err) => console.error(err));
