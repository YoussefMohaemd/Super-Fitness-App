export interface Category {
    idCategory: string
    strCategory: string
    strCategoryThumb: string
    strCategoryDescription: string
  }
  
  export interface Meals {
    strMeal: string
    strMealThumb: string
    idMeal: string
  } 

  export interface MealDetails {
    [key: string]: any; // 👈 إضافة دي
  
    meals: any;
    idMeal: string;
    strMeal: string;
    strMealAlternate: any;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strTags: string;
    strYoutube: string;
    strIngredient1: string;
    // ... باقي الحقول
    strMeasure20: string;
    strSource: string;
    strImageSource: any;
    strCreativeCommonsConfirmed: any;
    dateModified: any;
  }
  