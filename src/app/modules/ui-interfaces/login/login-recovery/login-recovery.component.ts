import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../login.service";

@Component({
  selector: 'adventure-login-recovery',
  templateUrl: './login-recovery.component.html',
  styleUrls: ['./login-recovery.component.scss']
})
export class LoginRecoveryComponent implements OnInit {

  constructor(
    public formBuilder: FormBuilder,
    public loginService: LoginService
  ) {  }

  public loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required]]
    });
  }

  public loginFormSubmit(){
    this.loginService.httpRecovery(this.loginForm.value);
  }
}
