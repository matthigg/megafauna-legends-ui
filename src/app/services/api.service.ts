import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getStudents() {
    return this.http.get<any>('http://localhost:8080/api/v1/student');
  }
}
