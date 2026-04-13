import { inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

// متغير خارج الدالة للحفاظ على حالته طوال مدة فتح الموقع
let hasShownSpinner = false;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const ngxSpinnerService = inject(NgxSpinnerService);
  const pLATFORM_ID = inject(PLATFORM_ID); 

  // 1. لا نفعل شيئاً لو كنا على السيرفر (SSR)
  if (!isPlatformBrowser(pLATFORM_ID)) {
    return next(req);
  }

  // 2. التحقق: هل هذه أول مرة يخرج فيها طلب HTTP؟
  if (!hasShownSpinner) {
    ngxSpinnerService.show('main-spiner');
    hasShownSpinner = true; // نغير الحالة فوراً لمنع ظهوره مرة أخرى

    return next(req).pipe(
      finalize(() => {
        // نخفيه بمجرد انتهاء أول طلب (أو أول مجموعة طلبات)
        ngxSpinnerService.hide('main-spiner');
      })
    );
  }

  // 3. أي طلب آخر بعد المرة الأولى يمر بهدوء بدون Spinner
  return next(req);
};