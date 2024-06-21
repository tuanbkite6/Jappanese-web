import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassResultComponent } from './class-result.component';

describe('ClassResultComponent', () => {
  let component: ClassResultComponent;
  let fixture: ComponentFixture<ClassResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
