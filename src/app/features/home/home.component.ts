import { Component } from '@angular/core';
import { HomeSliderComponent } from './components/home-slider/home-slider.component';
import { HomeProductsComponent } from './components/home-products/home-products.component';
import { HomeCategoriesComponent } from './components/home-categories/home-categories.component';
import { HomeNewsletterComponent } from "../home-newsletter/home-newsletter.component";

@Component({
  selector: 'app-home',
  imports: [HomeSliderComponent, HomeProductsComponent, HomeCategoriesComponent, HomeNewsletterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
