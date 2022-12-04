import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhlAppComponent } from './ghl-app.component';

describe('GhlAppComponent', () => {
  let component: GhlAppComponent;
  let fixture: ComponentFixture<GhlAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GhlAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GhlAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
