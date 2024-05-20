import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerGameComponent } from './speaker-game.component';

describe('SpeakerGameComponent', () => {
  let component: SpeakerGameComponent;
  let fixture: ComponentFixture<SpeakerGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeakerGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeakerGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
