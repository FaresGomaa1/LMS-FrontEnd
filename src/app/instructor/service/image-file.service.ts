import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageFileService {
  constructor(private http: HttpClient) { }

  // Method to download the image data from the URL and convert it into a File
  urlToFile(url: string, fileName: string): Observable<File> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map(blob => new File([blob], fileName)) // Create a File object with the given blob and filename
    );
  }
}