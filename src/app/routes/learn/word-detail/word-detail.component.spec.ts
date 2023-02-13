import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordDetailComponent } from './word-detail.component';

describe('WordDetailComponent', () => {
  let component: WordDetailComponent;
  let fixture: ComponentFixture<WordDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
