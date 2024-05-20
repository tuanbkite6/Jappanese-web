import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnFlashcardComponent } from './learn-flashcard.component';

describe('LearnFlashcardComponent', () => {
  let component: LearnFlashcardComponent;
  let fixture: ComponentFixture<LearnFlashcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnFlashcardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
