import { Injectable } from '@angular/core';
import { APIExercisesResponse, Exercise } from '../models/Exercise';

@Injectable({
  providedIn: 'root',
})
export class ExerciseAdapter {
  adapt(response: APIExercisesResponse): Exercise {
    return {
      message: response.message,
      totalExercises: response.totalExercises,
      exercises: response.exercises,
    };
  }
}
