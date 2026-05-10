import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient) { }

  createContent(payload: any) {
    return this.http.post('http://localhost:8000/api/content/', payload);
  }

  createChatBody(payload: any) {
    return this.http.post('http://localhost:8000/api/chatbodies/', payload);
  }

  /**
   * Send chat message with file using FormData (multipart/form-data)
   * This properly handles file uploads for the backend
   */
  createChatBodyWithFile(formData: FormData) {
    return this.http.post('http://localhost:8000/api/chatbodies/', formData);
  }

  /**
   * Update chat message with file using FormData
   */
  updateChatBody(messageId: any, formData: FormData) {
    return this.http.patch(`http://localhost:8000/api/chatbodies/${messageId}/`, formData);
  }

  /**
   * Update chat message with JSON (text-only or metadata updates)
   */
  updateChatBodyJson(messageId: any, payload: any) {
    return this.http.patch(`http://localhost:8000/api/chatbodies/${messageId}/`, payload);
  }

  chatBYContentId(contentId: string) {
    return this.http.get(`http://localhost:8000/api/chatbodies/?content_id=${contentId}`);
  }

  getContent() {
    return this.http.get('http://localhost:8000/api/content/');
  }

  contentById(contentId: string) {
    return this.http.get(`http://localhost:8000/api/content/${contentId}/`);
  }

  deleteContent(contentId: number) {
    return this.http.delete(`http://localhost:8000/api/content/${contentId}/`);
  }
}
