import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category';
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
  @Input() isInModal: boolean = false;
  @Output() selectedCategoryChange = new EventEmitter<string | number | null>();

  categories: Category[] = [];
  showAddModal = false;
  lastValidSelection: string | number | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.lastValidSelection = this.selectedCategory;
  }

  fetchCategories(): void {
    this.categoryService.getCategoriesByType(this.type, this.asList).subscribe((categories) => {
      this.categories = categories;
    });
  }

  onCategoryChange(): void {
    if (this.selectedCategory === '__add__') {
      this.showAddModal = true;
    } else {
      this.lastValidSelection = this.selectedCategory;
      this.selectedCategoryChange.emit(this.selectedCategory);
    }

  }

  onAddCategory(category: Category) {
    this.fetchCategories();
    this.selectedCategory = category.id;
    this.lastValidSelection = category.id;
    this.selectedCategoryChange.emit(category.id);
    this.showAddModal = false;
  }

  onModalClose() {
    this.showAddModal = false;
    this.selectedCategory = this.lastValidSelection;
  }
}
