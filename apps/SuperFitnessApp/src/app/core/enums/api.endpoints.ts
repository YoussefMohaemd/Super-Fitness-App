import { environment } from './../../../../../../Environments/environment.prod';
export class ApiEndpoint {
  static AllMuscles = `${environment.baseUrl}/api/v1/muscles`;
  static MuscleGroupDetail = `${environment.baseUrl}/api/v1/musclesGroup`;
  static RandomExercises = `${environment.baseUrl}/api/v1/exercises/random`;
}
