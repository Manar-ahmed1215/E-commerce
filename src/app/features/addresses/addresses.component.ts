import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { initFlowbite, Modal } from 'flowbite';
import { AddressService } from '../../core/services/address.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserAddress } from '../../core/models/user-address.interface';

@Component({
  selector: 'app-addresses',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css',
})
export class AddressesComponent implements OnInit {
  private readonly addressService = inject(AddressService)
  private readonly formBuilder = inject(FormBuilder)
  private readonly toastrService = inject(ToastrService)
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  addressesList = signal<UserAddress[]>([])
  isLoading = signal<boolean>(false)
  isLoadingRemove = signal<string | null>(null)
  currentAddressId = signal<string | null>(null);
  ngOnInit(): void {

    if (isPlatformBrowser(this.pLATFORM_ID)) {
      initFlowbite();
      this.getAllAddresses();
    }

  }
  addresseForm: FormGroup = this.formBuilder.group({
    name: ["", [Validators.required, Validators.minLength(3)]],
    details: ["", [Validators.required, Validators.minLength(5)]],
    phone: ["", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ["", [Validators.required, Validators.minLength(5)]]
  }
  )

  getAllAddresses(): void {
    this.isLoading.set(true);
    this.addressService.getAllAddresses().subscribe({
      next: (res) => {
        console.log("ree", res)
        this.addressesList.set(res.data)
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log("ree", err)
        this.isLoading.set(false);
      }
    })
  }
  submitForm(): void {
    if (this.addresseForm.valid) {
      this.isLoading.set(true);

      if (this.currentAddressId()) {
        this.addressService.removeAddress(this.currentAddressId()!).subscribe({
          next: () => {
            this.addressService.addAddresse(this.addresseForm.value).subscribe({
              next: (res) => {
                this.toastrService.success('Address Updated Successfully!');
                this.final();
              },
              error: (err) => {
                this.isLoading.set(false);
                this.toastrService.error('Failed to add new data');
              }
            });
          },
          error: (err) => {
            this.isLoading.set(false);
            this.toastrService.error('Failed to remove old address');
          }
        });
      } else {
        this.addressService.addAddresse(this.addresseForm.value).subscribe({
          next: (res) => {
            this.toastrService.success('Address Added Successfully!');
            this.final();
          }
        });
      }
    }
  }
  final(): void {
    this.isLoading.set(false);
    this.currentAddressId.set(null);
    this.addresseForm.reset();
    this.closeModal();
    this.getAllAddresses();
  }
closeModal(): void {
  if (isPlatformBrowser(this.pLATFORM_ID)) {
    const $modalElement: HTMLElement | null = document.querySelector('#address-modal');
    
    if ($modalElement) {
      const modal = new Modal($modalElement);
      modal.hide();
      const backdrops = document.querySelectorAll('[shadow-backdrop], .modal-backdrop, [at-modal-backdrop]');
      backdrops.forEach(el => el.remove());
      document.body.style.overflow = 'auto';
      document.body.classList.remove('overflow-hidden');
    }
  }
}

  updateAddresse(address: UserAddress): void {
    this.currentAddressId.set(address._id);
    this.addresseForm.patchValue({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city
    });
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const $modalElement: HTMLElement | null = document.querySelector('#address-modal');
      if ($modalElement) {
        const modal = new Modal($modalElement);
        modal.show();
      }
    }
  }
  removeAddresse(id: string): void {
    this.isLoadingRemove.set(id)
    this.addressService.removeAddress(id).subscribe({
      next: (res) => {
        console.log("uppp", res)
        this.getAllAddresses()
        this.isLoadingRemove.set(null)
      },
      error: (err) => {
        this.isLoadingRemove.set(null)
      }
    })
  }


}
