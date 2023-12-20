import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizeComponent } from './realize.component';

describe('RealizeComponent', () => {
  let component: RealizeComponent;
  let fixture: ComponentFixture<RealizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealizeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
