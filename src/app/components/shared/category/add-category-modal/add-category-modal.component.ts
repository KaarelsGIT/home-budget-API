import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CategoryService} from '../../../../services/category.service';
import {Category} from '../../../../models/category';
import {FormsModule} from '@angular/forms';
import {NgIf, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-add-category-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    TitleCasePipe
  ],
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.css']
})
export class AddCategoryModalComponent {
  @Input() isVisible = false;
  @Input() type: 'income' | 'expense' = 'income';
  @Input() isInModal = false;
  @Output() categoryAdded = new EventEmitter<Category>();
  @Output() closeModal = new EventEmitter<void>();

  categoryName: string = '';
  categoryDescription: string = '';
  recurringPayment: boolean = false;

  constructor(private categoryService: CategoryService) {}

  addCategory() {
    if (!this.categoryName) {
      alert('Category name is required!');
      return;
    }

    const newCategory = {
      name: this.categoryName,
      type: this.type.toUpperCase(),
      description: this.categoryDescription,
      recurringPayment: this.recurringPayment,
    };

    console.log('Sending category data:', newCategory); // Debug log

    this.categoryService.addCategory(newCategory).subscribe({
      next: (category) => {
        alert('Category added successfully!');
        this.categoryAdded.emit(category);
        this.close();
      },
      error: (err) => {
        console.error('Error adding category:', err);
        alert(`Failed to add category: ${err.error?.message || 'Unknown error'}`);
      }
    });
  }

  close() {
    this.categoryName = '';
    this.categoryDescription = '';
    this.recurringPayment = false;
    this.closeModal.emit();
  }
}
