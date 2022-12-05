import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppComponent } from './add-app.component';

describe('AddAppComponent', () => {
  let component: AddAppComponent;
  let fixture: ComponentFixture<AddAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
