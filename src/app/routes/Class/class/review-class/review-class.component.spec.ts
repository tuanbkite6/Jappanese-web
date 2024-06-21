import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewClassComponent } from './review-class.component';

describe('ReviewClassComponent', () => {
  let component: ReviewClassComponent;
  let fixture: ComponentFixture<ReviewClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewClassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
