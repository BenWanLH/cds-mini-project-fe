import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import Cookies from "js-cookie";
import { throwError } from 'rxjs';
import { AppService } from '../../services/app.service';
import { LoginPageService } from './login-page.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {

  usernameFormControl = new FormControl('', [Validators.required])
  passwordFormControl = new FormControl('', [Validators.required])
  matcher = new MyErrorStateMatcher();


  constructor(
    private loginService: LoginPageService,
    private appService: AppService,
    private router: Router) { }

  async onLogin() {
    if (this.usernameFormControl.value && this.passwordFormControl.value) {
      this.loginService.login(this.usernameFormControl.value, this.passwordFormControl.value).subscribe(
        {
          next: (response) => {
            if (response.jwt) {
              Cookies.set('authorization', response.jwt)
              this.router.navigate(["/dashboard"])
            } else {
              this.appService.updateSnackBar(`"Something went wrong. Please try again"`)
            }
          },
          error: error => {
            if (error.error && error.error.code === "2001") {
              this.appService.updateSnackBar("Invalid Credentials.")
            }
            else {
              this.appService.updateSnackBar(`${error.error.message}`)
            }
            return throwError(() => new Error())
          }
        }
      )
    }
  }
}
