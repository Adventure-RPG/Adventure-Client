import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEmailAcceptenceComponent } from './login-email-acceptence.component';

describe('LoginEmailAcceptenceComponent', () => {
  let component: LoginEmailAcceptenceComponent;
  let fixture: ComponentFixture<LoginEmailAcceptenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginEmailAcceptenceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEmailAcceptenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
