import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneTestComponent } from './scene-test.component';

describe('SceneTestComponent', () => {
  let component: SceneTestComponent;
  let fixture: ComponentFixture<SceneTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
