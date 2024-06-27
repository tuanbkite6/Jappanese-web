import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassCourseLearnComponent } from './class-course-learn.component';

describe('ClassCourseLearnComponent', () => {
  let component: ClassCourseLearnComponent;
  let fixture: ComponentFixture<ClassCourseLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassCourseLearnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassCourseLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
