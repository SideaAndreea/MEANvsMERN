import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  private baseUrl = 'http://localhost:5000/api/bills';

  constructor(private http: HttpClient) {}

  getBills(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getbills`);
  }

  getBillById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getbills/${id}`);
  }

  getBillsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getbills/${userId}`);
  }

  addBill(bill: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addbills`, bill);
  }

  updateBill(id: string, bill: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updatebills/${id}`, bill);
  }

  deleteBill(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deletebills/${id}`);
  }
}
