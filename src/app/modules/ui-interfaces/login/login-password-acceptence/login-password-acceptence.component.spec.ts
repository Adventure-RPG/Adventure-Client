import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPasswordAcceptenceComponent } from './login-password-acceptence.component';

describe('LoginPasswordAcceptenceComponent', () => {
  let component: LoginPasswordAcceptenceComponent;
  let fixture: ComponentFixture<LoginPasswordAcceptenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPasswordAcceptenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPasswordAcceptenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
