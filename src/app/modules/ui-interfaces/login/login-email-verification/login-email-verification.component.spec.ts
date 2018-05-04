import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEmailVerificationComponent } from './login-email-verification.component';

describe('LoginEmailVerificationComponent', () => {
  let component: LoginEmailVerificationComponent;
  let fixture: ComponentFixture<LoginEmailVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginEmailVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
