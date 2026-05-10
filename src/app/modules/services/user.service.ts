import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Character } from 'src/app/models/charactes';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  fetchUsers() {
    return this.http.get<Character[]>('http://localhost:8000/api/characters/');
  }

  deleteUser(userId: number) {
    return this.http.delete(`http://localhost:8000/api/characters/${userId}/`);
  }
  createUser(formData: FormData) {
    return this.http.post('http://localhost:8000/api/characters/', formData);
  }

  updateUser(userId: number, formData: FormData) {
    return this.http.patch(`http://localhost:8000/api/characters/${userId}/`, formData);
  }

  getUserById(userId: number) {
    return this.http.get(`http://localhost:8000/api/characters/${userId}/`);
  }
}
