export type UserRole = "ADMIN" | "PROFESSOR";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
