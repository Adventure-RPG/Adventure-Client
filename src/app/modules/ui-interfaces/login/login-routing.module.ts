import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPasswordAcceptenceComponent } from './login-password-acceptence/login-password-acceptence.component';
import { LoginEmailAcceptenceComponent } from './login-email-acceptence/login-email-acceptence.component';
import { LoginEmailRecoveryComponent } from './login-email-recovery/login-email-recovery.component';
import { LoginRecoveryComponent } from './login-recovery/login-recovery.component';
import { LoginRegComponent } from './login-reg/login-reg.component';
import { LoginSignInComponent } from './login-sign-in/login-sign-in.component';
import { LoginComponent } from './login.component';
import { LoginEmailVerificationComponent } from './login-email-verification/login-email-verification.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      {
        path: '',
        component: LoginSignInComponent
      },
      {
        path: 'login-reg',
        component: LoginRegComponent
      },
      {
        path: 'login-recovery',
        component: LoginRecoveryComponent
      },
      {
        path: 'login-email-recovery',
        component: LoginEmailRecoveryComponent
      },
      {
        path: 'login-email-verification',
        component: LoginEmailVerificationComponent
      },
      {
        path: 'login-email-verification/:token',
        component: LoginEmailVerificationComponent
      },
      {
        path: 'login-email-acceptence',
        component: LoginEmailAcceptenceComponent
      },
      {
        path: 'login-password-acceptence',
        component: LoginPasswordAcceptenceComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LoginRoutingModule {}
