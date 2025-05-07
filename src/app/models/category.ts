import {CategoryType} from './category-type';

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  description: string;
  recurringPayment: boolean;

}
