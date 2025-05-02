import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-category-dropdown',
  templateUrl: './category-dropdown.component.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./category-dropdown.component.css']
})
export class CategoryDropdownComponent implements OnInit {
  @Input() type: 'income' | 'expense' = 'income';
  @Input() placeholder: string = 'All Categories';
  @Input() asList: boolean = false;
  @Input() allowAddCategory:  boolean = false;
  @Input() selectedCategory: string | number | null = null;
  @Output() selectedCategoryChange = new EventEmitter<string | number | null>();

  categories: Category[] = [];

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
    this.selectedCategoryChange.emit(this.selectedCategory);
  }
}
