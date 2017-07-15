import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeightMapComponent } from './height-map.component';

describe('HeightMapComponent', () => {
  let component: HeightMapComponent;
  let fixture: ComponentFixture<HeightMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeightMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeightMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
