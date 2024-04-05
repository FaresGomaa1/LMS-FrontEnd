import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewQuesComponent } from './add-new-ques.component';

describe('AddNewQuesComponent', () => {
  let component: AddNewQuesComponent;
  let fixture: ComponentFixture<AddNewQuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewQuesComponent]
    });
    fixture = TestBed.createComponent(AddNewQuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
