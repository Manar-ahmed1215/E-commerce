import { WishListService } from './../../core/services/wish-list.service';
import { FlowbiteService } from './../../core/services/flowbite.service';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../core/models/category.interface';
import { jwtDecode } from 'jwt-decode';
import { UserDetails } from '../../core/models/user-details.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly cartService = inject(CartService)
  private readonly wishListService = inject(WishListService)
  private readonly categoriesService = inject(CategoriesService)
  private readonly pLATFORM_ID = inject(PLATFORM_ID)
  readonly router = inject(Router);
  logged = computed(() => this.authService.isLogged())
  count = computed(() => this.cartService.cartCount())
  wishListCount = computed(() => this.wishListService.wishListCount())
  categories = signal<Category[]>([]);
  userName = signal<string>('')
  constructor(private FlowbiteService: FlowbiteService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        this.authService.isLogged.set(true);
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode<UserDetails>(token!);
        this.userName.set(decodedToken.name);
      }
      this.getCartCount();
      this.getWishListCount();
    }

    this.FlowbiteService.loadFlowbite(() => {
      initFlowbite();
    });
    this.getCategortName()
  }

  logOut(): void {
    this.authService.signOut()
  }
  getCartCount(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.cartService.cartCount.set(0);
      return;
    }

    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
      },
      error: (err) => {

        this.cartService.cartCount.set(0);
      }
    });
  }
  getWishListCount(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.wishListService.wishListCount.set(0)
      return;
    }

    this.wishListService.getLoggedWishlist().subscribe({
      next: (res) => {
        this.wishListService.wishListCount.set(res.count);
      },
      error: (err) => {
        console.log(err);
        this.wishListService.wishListCount.set(0);
      }
    });
  }
  getCategortName(): void {


    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data)

      },
      error: (err) => {
        console.log(err);
      }
    });
  }
onNavbarSearch(value: string): void {
  if (value.trim()) {
    this.router.navigate(['/search'], { 
      queryParams: { keyword: value } 
    });
  }
}
}
