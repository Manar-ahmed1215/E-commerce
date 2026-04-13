import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
    {
        path: "", 
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent), 
        title: "FreshCart | Home"
    },
    {
        path: "shop", 
        loadComponent: () => import('./features/shop/shop.component').then(m => m.ShopComponent), 
        title: "Shop Our Collection"
    },
    {
        path: "brands", 
        loadComponent: () => import('./features/brands/brands.component').then(m => m.BrandsComponent), 
        title: "Top Brands"
    },
    {
        path: "categories", 
        loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent), 
        title: "Browse Categories"
    },
    {
        path: "cart", 
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent), 
        title: "Your Shopping Cart",
        canActivate:[authGuard]
    },
    {
        path: "search", 
        loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent), 
        title: "Search Products",
    },
    {
        path: "wishlist", 
        loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent), 
        title: "My Wishlist",
        canActivate:[authGuard]
    },
    {
        path: "product-details/:id/:slug",
        loadComponent: () => import('./features/product-details/product-details.component').then(m => m.ProductDetailsComponent), 
        title: "Product Details"
    },
    {
        path: "brand-details/:id/:slug",
        loadComponent: () => import('./features/brands-details/brands-details.component').then(m => m.BrandsDetailsComponent), 
        title: "Product Details"
    },
    {
        path: "product-on-category/:id",
        loadComponent: () => import('./features/product-on-category/product-on-category.component').then(m => m.ProductOnCategoryComponent), 
        title: "Product On Category"
    },
    {
        path: "product-on-subcategory/:id",
        loadComponent: () => import('./features/product-on-subcategory/product-on-subcategory.component').then(m => m.ProductOnSubcategoryComponent), 
        title: "Product On Subcategory"
    },
    {
        path: "category-details/:id/:slug",
        loadComponent: () => import('./features/category-details/category-details.component').then(m => m.CategoryDetailsComponent), 
        title: "category Details"
    },
    {
        path: "checkout/:id", 
        loadComponent: () => import('./features/check-out/check-out.component').then(m => m.CheckOutComponent), 
        title: "Secure Checkout",
        canActivate:[authGuard]
    },
    {
        path: "allorders", 
        loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent), 
        title: "My Orders",
        canActivate:[authGuard]
    },
    {
        path: "profile", 
        loadComponent: () => import('./layouts/profil-layout/profile/profile.component').then(m => m.ProfileComponent), 
        title: "My Profile",
        canActivate:[authGuard],
        children:[
             {
        path: "address", 
        loadComponent: () => import('./features/addresses/addresses.component').then(m => m.AddressesComponent), 
        title: "My Adresses",
        canActivate:[authGuard]
    },
    {
        path: "setting", 
        loadComponent: () => import('./features/setting/setting.component').then(m => m.SettingComponent), 
        title: "Settings",
        canActivate:[authGuard]
    }
        ]
    },

    {
        path: "login", 
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent), 
        title: "Login to Your Account"
    },
    {
        path: "register", 
        loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent), 
        title: "Create an Account"
    },
    {
        path: "forget-password", 
        loadComponent: () => import('./features/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent), 
        title: "Reset Password"
    },
    {
        path: "**", 
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent), 
        title: "404 - Page Not Found"
    },
];