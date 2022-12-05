import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhlAppDetailComponent } from './ghl-app-detail.component';

describe('GhlAppDetailComponent', () => {
  let component: GhlAppDetailComponent;
  let fixture: ComponentFixture<GhlAppDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GhlAppDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GhlAppDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
