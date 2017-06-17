import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../login.service";

@Component({
  selector: 'adventure-login-sign-in',
  templateUrl: './login-sign-in.component.html',
  styleUrls: ['./login-sign-in.component.scss']
})
export class LoginSignInComponent implements OnInit {

  constructor(
    public formBuilder: FormBuilder,
    public loginService: LoginService
  ) {  }

  public loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  public loginFormSubmit(){
    this.loginService.httpSignIn(this.loginForm.value);
  }

}
