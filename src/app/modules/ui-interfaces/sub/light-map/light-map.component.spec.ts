import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LightMapComponent} from './light-map.component';

describe('LightMapComponent', () => {
  let component: LightMapComponent;
  let fixture: ComponentFixture<LightMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LightMapComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
