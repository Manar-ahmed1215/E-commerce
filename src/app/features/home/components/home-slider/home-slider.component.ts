import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-slider',
  imports: [RouterLink],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeSliderComponent {}
