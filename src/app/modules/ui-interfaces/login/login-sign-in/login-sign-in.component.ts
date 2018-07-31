import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {LoginResponse} from '../login';
import {AppService} from '../../../../app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'adventure-login-sign-in',
  templateUrl: './login-sign-in.component.html',
  styleUrls: ['./login-sign-in.component.scss']
})
export class LoginSignInComponent implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    public loginService: LoginService,
    private appSerivce: AppService,
    private router: Router
  ) {}

  public loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  public loginFormSubmit() {
    this.loginService.httpSignIn(this.loginForm.value).subscribe(
      (res: LoginResponse) => {
        this.router.navigate(['../main']);
        console.log(res);
      },
      error => {
        this.appSerivce.snotifyService.error(error, {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true
        });
        console.log(error);
      }
    );
  }
}
