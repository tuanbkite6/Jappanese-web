import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSystemComponent } from './word-system.component';

describe('WordSystemComponent', () => {
  let component: WordSystemComponent;
  let fixture: ComponentFixture<WordSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordSystemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
