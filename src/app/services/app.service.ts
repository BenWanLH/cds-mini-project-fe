import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _snackbar: BehaviorSubject<string | null> = new BehaviorSubject(null);

  public readonly snackbar: Observable<string | null> = this._snackbar.asObservable();

  constructor() {
  }

  updateSnackBar(message: string) {
    this._snackbar.next(message)
  }


}
