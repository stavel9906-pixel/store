import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UpdateUserDTO } from "src/entities/DTO/updatedUserDTO";
import { CloudinaryService } from "./cloudinary.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private cloudinaryService: CloudinaryService
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  getUserFromToken(authHeader: string) {
    if (!authHeader) {
      throw new HttpException(
        "Authorization header is missing",
        HttpStatus.FORBIDDEN
      );
    }
    const token = authHeader.split(" ")[1];
    
    try {
      return jwt.verify(token, process.env.SECRET_KEY || "default_secret");
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  async updateUser(newUser: UpdateUserDTO, file?: Express.Multer.File) {
    const currentUser = await this.usersRepository.findOne({
      where: { userId: newUser.id },
    });

    if (!currentUser) throw new NotFoundException("User not found");

    if (currentUser.password) {
      // אם יש סיסמא קיימת נבדוק התאמה
      const isMatch = await bcrypt.compare(
        newUser.oldPassword,
        currentUser.password
      );
      if (!isMatch)
        throw new UnauthorizedException("Current password is incorrect");
    }

    // אם אין סיסמא (Google login) או הסיסמא נכונה, נעדכן
    const hashedPassword = await bcrypt.hash(newUser.newPassword, 10);
    currentUser.password = hashedPassword;

    if (file) {
      try {
        const result = await this.cloudinaryService.uploadFileImage(file);
        currentUser.profile = result.secure_url;
      } catch (error) {
        Logger.error("Cloudinary upload failed:", error);
      }
    }
    currentUser.userName = newUser.name;

    await this.usersRepository.save(currentUser);

    // --- יצירת token חדש ---
    const token = jwt.sign(
      {
        name: currentUser.userName,
        role: currentUser.role,
        id: currentUser.userId,
        profile: currentUser.profile,
        email: currentUser.email,
      },
      process.env.SECRET_KEY
    );

    return { message: "Profile updated successfully", token };
  }
}
