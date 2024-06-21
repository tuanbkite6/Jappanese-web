import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDashboardReviewComponent } from './course-dashboard-review.component';

describe('CourseDashboardReviewComponent', () => {
  let component: CourseDashboardReviewComponent;
  let fixture: ComponentFixture<CourseDashboardReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseDashboardReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseDashboardReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
