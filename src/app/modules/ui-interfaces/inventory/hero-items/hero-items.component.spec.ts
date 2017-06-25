import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroItemsComponent } from './hero-items.component';

describe('HeroItemsComponent', () => {
  let component: HeroItemsComponent;
  let fixture: ComponentFixture<HeroItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
