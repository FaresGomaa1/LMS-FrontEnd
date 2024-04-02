import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageFileService {
  constructor(private http: HttpClient) { }

  urlToFile(url: string, fileName: string): Observable<File> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map(blob => new File([blob], fileName)) 
    );
  }
}