import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getproducts`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getproducts/${id}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addproducts`, product);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateproducts/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteproducts/${id}`);
  }
}
