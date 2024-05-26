import { User } from "../../../models/User";
export interface UserServiceInterface {
  findWithPage(
    page: number,
    limit: number,
    orderColumn: string,
    orderType: string,
    filter: {
      fullname?: string, 
      email?: string
    }
  ): Promise<{ userEntries: Array<User>; userCount: number }>;
  isExistsByEmail(email: string): Promise<boolean>;
  isExistsById(userId: number): Promise<boolean>;
  findOneByEmail(
    email: string,
    selectAttributes?: Array<string>
  ): Promise<User | null>;
  findOneById(
    userId: number,
    selectAttributes?: Array<string>
  ): Promise<User | null>;
  insert(data: any): Promise<User | null>;
  isVerified(email: string): Promise<boolean>;
  verifyEmail(email: string, userId: number): Promise<boolean>;
  checkPassword(email: string, password: string): Promise<boolean>;
  updatePasswordByEmail(email: string, newPassword: string): Promise<boolean>;
  promoteToAdmin(userId: number): Promise<boolean>;
  demoteToNormalUser(userId: number): Promise<boolean>;
  deleteById(userId: number): Promise<boolean>;
  updateById(userId: number, data: any): Promise<boolean>;
}
