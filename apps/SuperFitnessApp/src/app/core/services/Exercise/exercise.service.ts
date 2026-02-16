import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Exercise, APIExercisesResponse } from '../../models/Exercise';
import { ApiEndpoint } from '../../enums/api.endpoints';
import { ExerciseAdapter } from '../../adapters/exercise.adapters';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  constructor(
    private http: HttpClient,
    private adapter: ExerciseAdapter
  ) {}

  getRandomExercises(
    targetMuscleGroupId: string,
    difficultyLevelId: string,
    limit: number = 10
  ): Observable<Exercise> {
    const params = {
      targetMuscleGroupId,
      difficultyLevelId,
      limit: limit.toString(),
    } as any;

    return this.http
      .get<APIExercisesResponse>(ApiEndpoint.RandomExercises, { params })
      .pipe(map((res) => this.adapter.adapt(res)));
  }
}
