import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {AddCategoryModalComponent} from '../add-category-modal/add-category-modal.component';

@Component({
  selector: 'app-category-dropdown',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    AddCategoryModalComponent
  ],
  templateUrl: './category-dropdown.component.html',
  styleUrls: ['./category-dropdown.component.css']
})
export class CategoryDropdownComponent implements OnInit {
  @Input() type: 'income' | 'expense' = 'income';
  @Input() placeholder: string = 'All Categories';
  @Input() asList: boolean = false;
  @Input() allowAddCategory: boolean = false;
  @Input() selectedCategory: string | number | null = null;
  @Output() selectedCategoryChange = new EventEmitter<string | number | null>();

  categories: Category[] = [];
  showAddModal = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getCategoriesByType(this.type, this.asList).subscribe((categories) => {
      this.categories = categories;
    });
  }

  onCategoryChange(): void {
    if (this.selectedCategory === '__add__') {
      this.showAddModal = true;
      // Reset the selection to prevent the "__add__" option from staying selected
      this.selectedCategory = null;
    } else {
      this.selectedCategoryChange.emit(this.selectedCategory);
    }
  }

  onAddCategory(category: Category) {
    this.fetchCategories(); // Refresh the categories list
    this.selectedCategory = category.id;
    this.selectedCategoryChange.emit(this.selectedCategory);
    this.showAddModal = false;
  }
}
