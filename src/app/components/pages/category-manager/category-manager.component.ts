import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { CategoryType } from '../../../models/category-type';
import { AddCategoryModalComponent } from '../../shared/category/add-category-modal/add-category-modal.component';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, AddCategoryModalComponent],
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css']
})
export class CategoryManagerComponent implements OnInit {
  categories: Category[] = [];
  incomeCategories: Category[] = [];
  expenseCategories: Category[] = [];

  editingCategoryId: number | null = null;
  editForm: Partial<Category> = {};

  isAddModalVisible = false;
  addModalType: 'income' | 'expense' = 'income';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategoriesByType('income').subscribe({
      next: (data) => this.incomeCategories = data,
      error: (err) => console.error('Error loading income categories', err)
    });

    this.categoryService.getCategoriesByType('expense').subscribe({
      next: (data) => this.expenseCategories = data,
      error: (err) => console.error('Error loading expense categories', err)
    });
  }

  startEdit(category: Category): void {
    this.editingCategoryId = category.id;
    this.editForm = { ...category };
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.editForm = {};
  }

  saveEdit(): void {
    if (this.editingCategoryId && this.editForm.name) {
      this.categoryService.updateCategory(this.editingCategoryId, this.editForm).subscribe({
        next: () => {
          this.editingCategoryId = null;
          this.editForm = {};
          this.loadCategories();
          this.categoryService.refreshCategories();
        },
        error: (err) => {
          console.error('Error updating category', err);
          alert('Failed to update category');
        }
      });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.categoryService.refreshCategories();
        },
        error: (err) => {
          console.error('Error deleting category', err);
          alert('Failed to delete category');
        }
      });
    }
  }

  openAddModal(type: 'income' | 'expense'): void {
    this.addModalType = type;
    this.isAddModalVisible = true;
  }

  closeAddModal(): void {
    this.isAddModalVisible = false;
  }

  onCategoryAdded(): void {
    this.loadCategories();
    this.categoryService.refreshCategories();
    this.closeAddModal();
  }
}
