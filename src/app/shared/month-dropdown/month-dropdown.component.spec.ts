import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthDropdownComponent } from './month-dropdown.component';

describe('MonthDropdownComponent', () => {
  let component: MonthDropdownComponent;
  let fixture: ComponentFixture<MonthDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
