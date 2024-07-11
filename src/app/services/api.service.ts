import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserCookiesService } from '../services/user-cookies.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string = environment.APIBACKEND;
  constructor(
    public http: HttpClient,
    public UserCookies: UserCookiesService
  ) {}

  get(endpoint: string) {
    return this.http.get(`${this.apiUrl}/${endpoint}`);
  }

  getPerPageCount() {
    return [10, 20, 30, 40, 50, 100];
  }

  getSearch(endpoint: string, params: any) {
    const queryParams = new HttpParams({ fromObject: params });
    return this.http.get(`${this.apiUrl}/${endpoint}`, { params: queryParams });
  }
  getSearchExport(endpoint: string, params: any) {
    const queryParams = new HttpParams({ fromObject: params });
    return this.http.get(`${this.apiUrl}/${endpoint}`, { params: queryParams, observe: 'response',
    responseType: 'arraybuffer' }, );
  }

  getVesselExport(endpoint: string) {
    return this.http.get(`${this.apiUrl}/${endpoint}`, { observe: 'response',
    responseType: 'arraybuffer' }, );
  }

  getShipPortTrade(endpoint: string, data:any) {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data, { observe: 'response',
    responseType: 'arraybuffer' }, );
  }

  delete(endpoint: string) {
    return this.http.delete(`${this.apiUrl}/${endpoint}`);
  }

  deleteWithData(endpoint: string, data: any) {
    return this.http.delete(`${this.apiUrl}/${endpoint}`, { body: data });
  }

  getWithPaginate(endpoint: string, params: any = false) {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return this.http.get(`${endpoint}`);
    } else {
      if (params) {
        return this.http.get(`${this.apiUrl}/${endpoint}`);
      } else {
        return this.http.get(`${this.apiUrl}/${endpoint}?paginate=1`);
      }
    }
  }

  getWithPerPage(
    endpoint: string,
    limit: any,
    params: any = false,
    search: boolean = false
  ) {
    if (params && search == false) {
      return this.http.get(
        `${this.apiUrl}/${endpoint}?paginate=1&limit=${params.perPage}&archivedYear=${params.archivedYear}&archivedMonth=${params.archivedMonth}`
      );
    }
    if (params && search) {
      let queryParams = '';
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          queryParams += `${key}=${params[key]}&`;
        }
      }
      queryParams = queryParams.slice(0, -1);
      return this.http.get(`${this.apiUrl}/${endpoint}?${queryParams}`);
    } else {
      return this.http.get(
        `${this.apiUrl}/${endpoint}?paginate=1&limit=${limit.perPage}`
      );
    }
  }

  post(endpoint: string, data: any) {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data);
  }

  update(endpoint: string, data: any) {
    return this.http.put(`${this.apiUrl}/${endpoint}`, data);
  }

  showAllValidationErrors(form: FormGroup) {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
