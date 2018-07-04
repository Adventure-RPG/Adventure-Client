import { Component, OnInit } from '@angular/core';
import { LoginResponse } from '../login';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'adventure-login-email-verification',
  templateUrl: './login-email-verification.component.html',
  styleUrls: ['./login-email-verification.component.scss']
})
export class LoginEmailVerificationComponent implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    public loginService: LoginService,
    private appSerivce: AppService,
    private route: ActivatedRoute
  ) {}

  public form: FormGroup;
  public routerSub;

  ngOnInit() {
    this.form = this.formBuilder.group({
      token: ['', [Validators.required]]
    });

    this.route.params
      .subscribe(params => {
        if (params.token) {
          this.form.setValue(params);
          this.formAction();
        }
      })
      .unsubscribe();
  }

  public formAction() {
    this.loginService.httpEmailVerification(this.form.value).subscribe((res: LoginResponse) => {
      console.log(res);
      this.appSerivce.snotifyService.success('User confirmed', {
        timeout: 2000,
        showProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true
      });
    });
  }

  // ngOnDestroy() {
  //   // this.sub.unsubscribe();
  // }
}
