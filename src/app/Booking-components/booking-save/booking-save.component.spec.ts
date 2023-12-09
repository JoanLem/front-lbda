import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSaveComponent } from './booking-save.component';

describe('BookingSaveComponent', () => {
  let component: BookingSaveComponent;
  let fixture: ComponentFixture<BookingSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
