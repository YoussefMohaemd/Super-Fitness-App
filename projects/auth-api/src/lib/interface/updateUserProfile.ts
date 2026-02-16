export interface UpdateUserProfileData {
    firstName?: string;
    lastName?: string;
    email?: string;
    gender?: 'male' | 'female';
    age?: number;
    weight?: number;
    height?: number;
    activityLevel?: string;
    goal?: string;
  }