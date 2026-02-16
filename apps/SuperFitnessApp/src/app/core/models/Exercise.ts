export interface ExerciseGroup {
    _id: string;
    exercise: string;
    short_youtube_demonstration: string;
    in_depth_youtube_explanation?: string;
    difficulty_level: string;
    target_muscle_group: string;
    prime_mover_muscle: string;
    tertiary_muscle: any;
    primary_equipment: string;
    _primary_items: number;
    secondary_equipment?: string;
    _secondary_items: number;
    posture: string;
    single_or_double_arm: string;
    continuous_or_alternating_arms: string;
    grip: string;
    load_position_ending: string;
    continuous_or_alternating_legs: string;
    foot_elevation: string;
    combination_exercises: string;
    movement_pattern_1: string;
    movement_pattern_2: any;
    movement_pattern_3: any;
    plane_of_motion_1: string;
    plane_of_motion_2: any;
    plane_of_motion_3: any;
    body_region: string;
    force_type: string;
    mechanics: string;
    laterality: string;
    primary_exercise_classification: string;
    short_youtube_demonstration_link: string;
    in_depth_youtube_explanation_link?: string;
    secondary_muscle: any;
  }
  
  export interface Exercise {
    message: string;
    totalExercises: number;
    exercises: ExerciseGroup[];
  }
  export type APIExercisesResponse = Exercise;