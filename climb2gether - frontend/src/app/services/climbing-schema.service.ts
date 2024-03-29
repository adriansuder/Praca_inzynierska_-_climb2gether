import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { RockSchema } from '../_models/RockSchema';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SchemaDetails } from '../_models/SchemaDetails';

@Injectable({
  providedIn: 'root'
})
export class ClimbingSchemaService {
  
  schemasChanged = new Subject<RockSchema[]>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  createSchema(schema: RockSchema, img: File | Blob) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    let formData = new FormData();
    formData.append('userId', this.authService.loggedUser.userId.toString());
    formData.append('isPublic', schema?.isPublic?.toString());
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

  getUserSchemas(routeName?: string, routeLocation?: string, isPublic?: boolean){
    let name = routeName ? routeName : '';
    let location = routeLocation ? routeLocation : '';
    let publicSchema = isPublic ? isPublic : false;
    const userId = this.authService.loggedUser.userId;
    return this.http.get<RockSchema[]>(
      `${environment.apiUrl}/rockSchemas/${userId}?routeName=${name}&routeLocation=${location}&isPublic=${publicSchema}`
    ).pipe(
      map( res => { return res;}, err => {return err.error})
    ).toPromise();

  }

  deleteSchema(schemaId: number){
    return this.http.delete<any>(
      `${environment.apiUrl}/rockSchemas/${schemaId}`
    ).toPromise();
  }

  getSchemaDetailsById(schemaId: number){
    return this.http.get<SchemaDetails>(
      `${environment.apiUrl}/rockSchemas/${schemaId}/details`
    ).toPromise();
  }
}
