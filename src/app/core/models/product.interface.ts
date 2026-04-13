// export interface Product {
//   sold: number;
//   images: string[];
//   subcategory: Subcategory[];
//   ratingsQuantity: number;
//   _id: string;
//   title: string;
//   slug: string;
//   description: string;
//   quantity: number;
//   price: number;
//   imageCover: string;
//   category: Category;
//   brand: Category;
//   ratingsAverage: number;
//   createdAt: string;
//   updatedAt: string;
//   id: string;
// }

// export interface  Category {
//   _id: string;
//   name: string;
//   slug: string;
//   image: string;
// }

// export interface  Subcategory {
//   _id: string;
//   name: string;
//   slug: string;
//   category: string;
// }
export interface Product {
  sold: number;
  images: string[];
  subcategory: Subcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  // السطر اللي كان ناقص ومهم جداً للخصم
  priceAfterDiscount?: number; 
  imageCover: string;
  category: Category;
  brand: Category;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}