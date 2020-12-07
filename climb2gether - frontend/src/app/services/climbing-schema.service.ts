import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { RockSchema } from '../_models/RockSchema';

@Injectable({
  providedIn: 'root'
})
export class ClimbingSchemaService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  createSchema(schema: RockSchema, img: File | Blob) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    let formData = new FormData();
    formData.append('userId', this.authService.loggedUser.userId.toString());
    formData.append('isPublic', schema.isPublic.toString());
    formData.append('routeDescription', schema.routeDescription);
    formData.append('routeLocation', schema.routeLocation);
    formData.append('routeName', schema.routeName);
    formData.append('routeScale', schema.routeScale);
    formData.append('img', img, `${schema.routeName}.jpeg`);
    console.log(formData);
    return this.http.post<any>(
      `${environment.apiUrl}/rockSchemas`,
      formData,
      {headers}
    ).toPromise();
  }
}
