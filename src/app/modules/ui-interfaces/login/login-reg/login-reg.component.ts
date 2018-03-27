import { Component, OnInit } from '@angular/core';
import {LoginService} from "../login.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginResponse} from "../login";
import {SnotifyService} from "ng-snotify";
import {AppService} from "../../../../app.service";

@Component({
  selector: 'adventure-login-reg',
  templateUrl: './login-reg.component.html',
  styleUrls: ['./login-reg.component.scss']
})
export class LoginRegComponent implements OnInit {

  constructor(
    public formBuilder: FormBuilder,
    public loginService: LoginService,
    private appSerivce: AppService
  ) {  }

  public loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required]],
      username: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  public loginFormSubmit(){
    this.loginService
      .httpRegistrate(this.loginForm.value)
      .subscribe(
        (res:LoginResponse) =>{
          console.log(res)
          this.appSerivce.snotifyService.success('Example body content', {
            timeout: 2000,
            showProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true
          })
        }
      )
    ;
  }

}
