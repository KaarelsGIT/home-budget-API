import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAddFormComponent } from './transaction-add-form.component';

describe('TransactionFormComponent', () => {
  let component: TransactionAddFormComponent;
  let fixture: ComponentFixture<TransactionAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAddFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
