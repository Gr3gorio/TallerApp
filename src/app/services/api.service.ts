import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //WHATSAPP CLOUD API
  // public apiUrl = 'https://graph.facebook.com/v17.0/136058459599030/messages';
  // public authToken = 'EAAQFNjDzlWQBO05HPWPsxXHC0wXTXy6YsQwkjDo3kJFI5mnmJFKzOW0vh1DBnj4eSdEpktFQLRrYPvonsQq7DAIxkZCcwWW4fYNktQMDITvZAkfwPpKYLjROLZBMYBoYJBGwaFYLVCJc6gXpxaNzGZA86SSFu244ZAhCzEts2HtKIMWZAfwoQZAYyH4G2GuenarDXIkovjbXwzFtYisPQUZD'; 

  constructor( public http: HttpClient) { }

  //==== CLOUD API WHATSAPP ====
  // sendMessage(data: any) {
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.authToken}`
  //   });

  //   return this.http.post(`${this.apiUrl}`, data, { headers });
  // }
}
