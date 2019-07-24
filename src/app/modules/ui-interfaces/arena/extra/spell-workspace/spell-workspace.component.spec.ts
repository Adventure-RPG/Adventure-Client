import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellWorkspaceComponent } from './spell-workspace.component';

describe('SpellWorkspaceComponent', () => {
  let component: SpellWorkspaceComponent;
  let fixture: ComponentFixture<SpellWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpellWorkspaceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
