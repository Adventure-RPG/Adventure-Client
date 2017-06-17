import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginRegComponent } from './login-reg/login-reg.component';
import {Routes, RouterModule} from "@angular/router";
import { LoginSignInComponent } from './login-sign-in/login-sign-in.component';
import { LoginRecoveryComponent } from './login-recovery/login-recovery.component';
import { LoginEmailRecoveryComponent } from './login-email-recovery/login-email-recovery.component';
import { LoginEmailAcceptenceComponent } from './login-email-acceptence/login-email-acceptence.component';
import { LoginPasswordAcceptenceComponent } from './login-password-acceptence/login-password-acceptence.component';
import {SharedModule} from "../../../shared/shared-module.module";
import {LoginService} from "./login.service";
import {LoginRoutingModule} from "./login-routing.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoginRoutingModule
  ],
  providers: [
    LoginService
  ],
  declarations: [LoginComponent, LoginFormComponent, LoginRegComponent, LoginSignInComponent, LoginRecoveryComponent, LoginEmailRecoveryComponent, LoginEmailAcceptenceComponent, LoginPasswordAcceptenceComponent]
})
export class LoginModule { }
