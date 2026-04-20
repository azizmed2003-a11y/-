import { Book, Category, Coupon, Testimonial } from './types';

export const STORE_NAME = 'المكتبة الذهبية';

export const CATEGORIES: { id: Category; labelAr: string; labelEn: string }[] = [
  { id: 'Self-Development', labelAr: 'تطوير الذات', labelEn: 'Self Development' },
  { id: 'Money & Investment', labelAr: 'المال والاستثمار', labelEn: 'Money & Investment' },
  { id: 'Religious', labelAr: 'كتب دينية', labelEn: 'Religious' },
  { id: 'Science', labelAr: 'كتب علمية', labelEn: 'Science' },
  { id: 'Motivation', labelAr: 'كتب تحفيزية', labelEn: 'Motivation' },
  { id: 'Magazines', labelAr: 'مجلات ونشرات', labelEn: 'Magazines' },
  { id: 'Novels', labelAr: 'روايات', labelEn: 'Novels' },
  { id: 'Children', labelAr: 'أطفال', labelEn: 'Children' },
  { id: 'English Books', labelAr: 'كتب إنجليزية', labelEn: 'English Books' },
  { id: 'Best Sellers', labelAr: 'الأكثر مبيعاً', labelEn: 'Best Sellers' },
  { id: 'Offers', labelAr: 'عروض', labelEn: 'Offers' },
];

export const BOOKS: Book[] = [];

export const COUPONS: Coupon[] = [
  { code: 'BOOK10', discountType: 'percentage', value: 10, minSpend: 30 }
];

export const SHIPPING_RULES = {
  flatRate: 0,
  freeThreshold: 0,
  targetZone: 'Mauritania'
};

export const CONTACT_INFO = {
  phone: '42204545',
  phoneFull: '22242204545',
  email: 'azizmed2003@gmail.com',
  address: 'نواكشوط، موريتانيا',
  bankilyNumber: '42204545'
};

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    userName: 'Sarah J.',
    rating: 5,
    content: 'Best bookstore I have used! Delivery was super fast and the books arrived in perfect condition.',
    date: '2024-03-15',
    isFeatured: true
  },
  {
    id: 't2',
    userName: 'Omar K.',
    rating: 5,
    content: 'Highly recommended for anyone looking for self-development books in both Arabic and English.',
    date: '2024-03-20',
    isFeatured: true
  }
];
