export interface UserView {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User extends UserView {
  id: number;
}

export interface UserDTO {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
}
