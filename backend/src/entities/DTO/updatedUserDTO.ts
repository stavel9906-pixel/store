export interface UpdateUserDTO {
  id: number;
  name: string;
  oldPassword: string;
  newPassword: string;
  profile: string;
}
