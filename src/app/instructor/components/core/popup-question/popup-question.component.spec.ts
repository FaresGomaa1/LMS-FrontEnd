import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupQuestionComponent } from './popup-question.component';

describe('PopupQuestionComponent', () => {
  let component: PopupQuestionComponent;
  let fixture: ComponentFixture<PopupQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupQuestionComponent]
    });
    fixture = TestBed.createComponent(PopupQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
