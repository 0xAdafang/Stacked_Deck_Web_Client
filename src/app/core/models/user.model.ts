export interface User {
  id?: number;
  username: string;
  email: string;
  accessToken?: string;
  roles?: string[];
}
