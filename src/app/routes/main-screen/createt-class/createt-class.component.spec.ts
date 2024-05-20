import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatetClassComponent } from './createt-class.component';

describe('CreatetClassComponent', () => {
  let component: CreatetClassComponent;
  let fixture: ComponentFixture<CreatetClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatetClassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatetClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
