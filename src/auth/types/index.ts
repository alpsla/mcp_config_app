// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}
