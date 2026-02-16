export interface muscles {
  message: string;
  musclesGroup: MusclesGroup[];
}

export interface MusclesGroup {
  _id: string;
  name: string;
}

export interface MuscleGroupDetail {
  _id: string;
  name: string;
  muscles: Muscle[];
}

export interface Muscle {
  _id: string;
  name: string;
  image: string;
}

export interface MuscleGroupDetailResponse {
  message: string;
  muscleGroup: MuscleGroupDetail;
}

// Updated to match the actual API response structure
export type APImusclesResponse = muscles;
