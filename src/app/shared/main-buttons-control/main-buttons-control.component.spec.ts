import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainButtonsControlComponent } from './main-buttons-control.component';

describe('MainButtonsControlComponent', () => {
  let component: MainButtonsControlComponent;
  let fixture: ComponentFixture<MainButtonsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainButtonsControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainButtonsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
