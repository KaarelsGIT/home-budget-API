import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CategoryService} from '../../../services/category.service';
import {Category} from '../../../models/category';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-add-category-modal',
  imports: [
    FormsModule
  ],
  templateUrl: './add-category-modal.component.html',
  styleUrl: './add-category-modal.component.css'
})
export class AddCategoryModalComponent {
  @Output() categoryAdded = new EventEmitter<Category>();
  @Output() closeModal = new EventEmitter<void>();

  categoryName: string = '';
  categoryDescription: string = '';
  categoryType: 'income' | 'expense' = 'income';

  constructor(private categoryService: CategoryService) {}

  addCategory() {
    if (!this.categoryName) {
      alert('Category name is required!');
      return;
    }

    this.categoryService.getCategoriesByType(this.categoryType, true).subscribe(categories => {
      const exists = categories.some(category => category.name === this.categoryName);

      if (exists) {
        alert('Category already exists!');
        return;
      }

      const newCategory: Category = {
        id: 0,
        name: this.categoryName,
        description: this.categoryDescription,
        type: this.categoryType,
        recurringPayment: false
      };

      this.categoryService.addCategory(newCategory).subscribe({
        next: (category) => {
          alert('Category added successfully!');
          this.categoryAdded.emit(category);
          this.closeModal.emit();
        },
        error: (err) => {
          console.error('Error adding category:', err);
          alert('Failed to add category.');
        }
      });
    });
  }

  close() {
    this.closeModal.emit();
  }
}
