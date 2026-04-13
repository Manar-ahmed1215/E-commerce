import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

let isFirstRequest = true;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const ngxSpinnerService = inject(NgxSpinnerService);
  const pLATFORM_ID = inject(PLATFORM_ID); 
  if (isPlatformBrowser(pLATFORM_ID) && isFirstRequest) {
    
    ngxSpinnerService.show('main-spiner');
    
    return next(req).pipe(
      finalize(() => {
        ngxSpinnerService.hide('main-spiner');
        isFirstRequest = false; 
      })
    );
  }

  return next(req);
};