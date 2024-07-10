import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordUserComponent } from './word-user.component';

describe('WordUserComponent', () => {
  let component: WordUserComponent;
  let fixture: ComponentFixture<WordUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
