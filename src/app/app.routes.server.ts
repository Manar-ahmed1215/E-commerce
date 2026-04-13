import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'product-details/:id/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'product-on-subcategory/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'brand-details/:id/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'checkout/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'category-details/:id/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'product-on-category/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**', 
    renderMode: RenderMode.Prerender
  }
];
