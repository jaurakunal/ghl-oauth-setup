import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhlMarketplaceComponent } from './ghl-marketplace.component';

describe('GhlMarketplaceComponent', () => {
  let component: GhlMarketplaceComponent;
  let fixture: ComponentFixture<GhlMarketplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GhlMarketplaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GhlMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
