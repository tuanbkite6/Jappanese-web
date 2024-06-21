import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassAnalysisComponent } from './class-analysis.component';

describe('ClassAnalysisComponent', () => {
  let component: ClassAnalysisComponent;
  let fixture: ComponentFixture<ClassAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
