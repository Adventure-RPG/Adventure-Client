import { Component, OnInit } from '@angular/core';
import {LoginService} from "../login.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'adventure-login-reg',
  templateUrl: './login-reg.component.html',
  styleUrls: ['./login-reg.component.scss']
})
export class LoginRegComponent implements OnInit {

  constructor(
    public formBuilder: FormBuilder,
    public loginService: LoginService
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
    this.loginService.httpRegistrate(this.loginForm.value);
  }

}
