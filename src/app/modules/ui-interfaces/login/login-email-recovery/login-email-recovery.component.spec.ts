import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginEmailRecoveryComponent} from './login-email-recovery.component';

describe('LoginEmailRecoveryComponent', () => {
  let component: LoginEmailRecoveryComponent;
  let fixture: ComponentFixture<LoginEmailRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginEmailRecoveryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEmailRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
