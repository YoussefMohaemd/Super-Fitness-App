import { Observable } from "rxjs";
import { Exercise } from "../models/Exercise";

export abstract class ExerciseResApi {
  abstract getRandomExercises(
    targetMuscleGroupId: string,
    difficultyLevelId: string,
    limit?: number
  ): Observable<Exercise>;
}