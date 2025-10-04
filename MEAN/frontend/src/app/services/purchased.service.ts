import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PurchasedService {
  private items: any[] = [];

  setItems(items: any[]) {
    this.items = items;
  }

  getItems(): any[] {
    return this.items;
  }
}
