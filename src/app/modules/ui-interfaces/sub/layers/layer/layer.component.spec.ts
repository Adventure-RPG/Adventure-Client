import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerComponent } from './layer.component';

describe('LayerComponent', () => {
  let component: LayerComponent;
  let fixture: ComponentFixture<LayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LayerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
