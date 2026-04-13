import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';
import { DatePipe, isPlatformBrowser, NgClass } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { UserDetails } from '../../core/models/user-details.interface';
import { Orders } from '../../core/models/orders.interface';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CartItems } from '../../core/models/cart-items.interface';

@Component({
  selector: 'app-orders',
  imports: [NgClass, RouterLink, RouterLinkActive , DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private readonly odersService = inject(OrdersService)
  private readonly pLATFORM_ID = inject(PLATFORM_ID)
  ordersList = signal<Orders[]>([])
  items = signal<CartItems[]>([])
  viewDetails= signal<boolean> (false);
  openedOrderId = signal<string | null>(null);
  isLoadingOrders=signal<boolean>(false)

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode<UserDetails>(token!);
        const userId = decodedToken.id;
        this.getOrders(userId);
      }
    }


  }

  getOrders(userId: string) {
    this.isLoadingOrders.set(true);
    this.odersService.getuserOrders(userId).subscribe({
      next: (res) => {
        this.isLoadingOrders.set(false);
        this.ordersList.set(res);
        console.log("ordersr", res)
      },
      error: (err) => {
        this.isLoadingOrders.set(false);
      },
    });
  }


toggleDetails(orderId: string) {
  this.openedOrderId.update(currentId => 
    currentId === orderId ? null : orderId
  );
}
}
