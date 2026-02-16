import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category, Meals, MealDetails } from '../../models/healthy-Interfaces';

@Injectable({ providedIn: 'root' })
export class HealthyServiceService {
    constructor(private http: HttpClient) { }

    // Categories
    public getCategories(): Observable<Category[]> {
        return this.http
          .get<{ categories: Category[] }>('https://www.themealdb.com/api/json/v1/1/categories.php')
          .pipe(map(res => res.categories ?? []));
      }
      

    // Meal details by id
    public getMealsByCategory(category: string): Observable<Meals[]> {
        return this.http
          .get<{ meals: Meals[] }>(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
          .pipe(map(res => res.meals ?? []));
      }
      
     // Meals by category
     public getMealDetails(id: string): Observable<MealDetails | null> {
        return this.http
          .get<{ meals: MealDetails[] }>(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
          .pipe(map(res => res.meals && res.meals[0] ? res.meals[0] : null));
      }
      
}
