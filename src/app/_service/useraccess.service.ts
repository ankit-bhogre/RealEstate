import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpErrorResponse,HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import {throwError, Observable,BehaviorSubject,Subject } from 'rxjs';
import { retry,catchError,map } from 'rxjs/operators';
// var emailsubject = new Subject<any>();


@Injectable({
  providedIn: 'root'
})



export class UseraccessService {
  userRole: any;
  loggeduser = new BehaviorSubject<any>( localStorage.getItem('userrole'));
  isloggdin =new BehaviorSubject<any>( localStorage.getItem('loginkey'));
   userprofile = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('userprofile')));
  
    results: Observable<any>;
  constructor(private http: HttpClient, private router: Router) { }
  
        //  for post 
          post(url, body): Observable<any> {
              let options = {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
            };
              return this.http.post<any>(url,  body.toString(),options)
                .pipe(
                  map(res => {
                  if (!!res) {
                    // For login 
                    if(res.status == true && res.message == "User login successful."){
                      localStorage.setItem("loginkey", JSON.stringify(res.data.id));
                      localStorage.setItem("userrole", res.data.admin_type);
                      this.loggeduser.next(res.data.admin_type);
                      this.isloggdin.next(res.data.id);
                      this.userRole = res.data.admin_type;
                      this.results =  res.data.admin_type;
                      localStorage.setItem("userprofile", JSON.stringify(res.data));
                      this.userprofile.next( res.data);
                      this.router.navigate(['/servicelisting']);
                    }
                  
                   
                  
                    return res;
                  }
                
                  return false;
                }),
                catchError(this.handleError)
                );
            }


              //  for post image
          imagepostservice(url, body): Observable<any> {
        
            return this.http.post<any>(url,  body)
              .pipe(
                map(res => {
                if (!!res) {
                  // For login 
                  return res;
                }
               
                return false;
              }),
              catchError(this.handleError)
              );
          }

        // for get
            get(url): Observable<any> {
             
              let options = {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
            };
              return this.http.get<any>(url)
                .pipe(
                  map(res => {
                  if (!!res) {
                    return res;
                  }
                  return false;
                }),
                catchError(this.handleError)
                );
            }
        
        // for handle unknown error  
            handleError(error) {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
         
              // client-side error
              errorMessage = `Error: ${error.error.message}`;
          } else {
           
              // server-side error
              errorMessage = error.error.error;
              // errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
        
            window.alert(errorMessage);
            return throwError(errorMessage);
            }
         
        // for logout
            logoutwindow(){
              localStorage.clear();
              this.loggeduser.next('');
              this.isloggdin.next('');
              this.router.navigate(['/login']);
            }

}
