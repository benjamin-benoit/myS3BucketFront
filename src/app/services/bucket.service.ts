import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bucket } from '../interfaces/bucket.interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { toLower } from 'lodash';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BucketService {

  private httpOptions;

  constructor(private httpClient: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      })
    };
  }

  public addBucket({ name, parentId }: Bucket): Observable<any> {
    return this.httpClient
      .post(`${environment.backEndApi}/bucket`, {
          name: toLower(name),
          parentId
        },
        this.httpOptions
      )
      .pipe(
        map(res => {
            return res;
          },
          catchError(err => {
            return err;
          })
        )
      );
  }

  public editBucket({ id, name }: Bucket): Observable<any> {
    return this.httpClient
      .put(`${environment.backEndApi}/bucket/${id}`, {
          name: toLower(name),
        },
        this.httpOptions
      )
      .pipe(
        map(res => {
            return res;
          },
          catchError(err => {
            return err;
          })
        )
      );
  }

  public deleteBucket({ id }: Bucket): Observable<any> {
    return this.httpClient
      .delete(`${environment.backEndApi}/bucket/${id}`,
        this.httpOptions
      )
      .pipe(
        map(res => {
            return res;
          },
          catchError(err => {
            return err;
          })
        )
      );
  }

  public getAllBucket(): Observable<any> {
    return this.httpClient
      .get(`${environment.backEndApi}/bucket`,
        this.httpOptions
      )
      .pipe(
        map(res => {
            return res;
          },
          catchError(err => {
            return err;
          })
        )
      );
  }

  public getBucketById({ id }: Bucket): Observable<any> {
    return this.httpClient
      .get(`${environment.backEndApi}/bucket/${id}`,
        this.httpOptions
      )
      .pipe(
        map(res => {
            return res;
          },
          catchError(err => {
            return err;
          })
        )
      );
  }
}
