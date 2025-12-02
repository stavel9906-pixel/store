import { UsersRole } from "src/enums/userRole.enum";

export interface UserTokenDTO {
  id: number;
  name: string;
  email: string;
  role: UsersRole;
  profile?: string;
}