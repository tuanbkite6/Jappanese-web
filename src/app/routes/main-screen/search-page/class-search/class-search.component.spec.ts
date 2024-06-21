import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSearchComponent } from './class-search.component';

describe('ClassSearchComponent', () => {
  let component: ClassSearchComponent;
  let fixture: ComponentFixture<ClassSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
