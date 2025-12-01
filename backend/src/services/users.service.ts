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
import { UsersRole } from "src/enums/userRole.enum";
import { UnauthorizedError } from "src/errors/unauthorizedError";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UpdateUserDTO } from "src/entities/DTO/updatedUserDTO";
import { CloudinaryService } from "./cloudinary.service";
import { profile } from "console";

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

  async register(
    name: string,
    email: string,
    password: string | undefined
  ): Promise<any> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser && existingUser.password) {
      throw new UnauthorizedError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      userName: name,
      email,
      password: hashedPassword,
      role: UsersRole.USER,
    });

    if (existingUser) {
      await this.usersRepository
        .createQueryBuilder()
        .update(User)
        .set({ password: hashedPassword })
        .where("email = :email", { email })
        .execute();
    } else {
      await this.usersRepository.save(user);
    }

    const token = jwt.sign(
      {
        name: user.userName,
        role: user.role,
        id: user.userId,
        email: user.email,
      },
      process.env.SECRET_KEY
    );
    Logger.log(`User registered: ${email}`);

    return {
      message: "User registered successfully",
      token,
    };
  }

  async login(email: string, password: string | undefined): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedError("there is no user with this email register");
    }

    const isValid = await bcrypt.compare(password || "", user.password || "");
    if (!isValid) {
      //!password לא נחשב כי הוא כנראה נכנס הפעם מגוגל ואם לא היה מכניס סיסמא לא היה מגיע לפה בכלל
      throw new UnauthorizedError("Invalid Password For This User");
    }

    const token = jwt.sign(
      {
        name: user.userName,
        role: user.role,
        id: user.userId,
        email: user.email,
        profile: user.profile,
      },
      process.env.SECRET_KEY
    );
    Logger.log(`User logged in: ${email}`);

    return {
      message: "Login successful",
      token,
    };
  }

  async googleSignIn(
    email: string,
    userName: string,
    profile: string | undefined
  ): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      const newUser = this.usersRepository.create({
        userName,
        email,
        role: UsersRole.USER,
        profile,
      });

      await this.usersRepository.save(newUser);
    } else {
      await this.usersRepository
        .createQueryBuilder("user")
        .update(User)
        .set({
          profile,
        })
        .where("user_id = :userId", { userId: user.userId })
        .execute();
    }

    const token = jwt.sign(
      {
        name: userName,
        role: !user ? UsersRole.USER : user.role,
        id: user?.userId,
        profile: user?.profile,
        email,
      },
      process.env.SECRET_KEY
    );
    Logger.log(`User signed in with google: ${email}`);

    return {
      message: "Sign in successful",
      token,
    };
  }

  getUserFromToken(authHeader: string) {
    if (!authHeader) {
      throw new HttpException(
        "Authorization header is missing",
        HttpStatus.FORBIDDEN
      );
    }

    const token = authHeader.split(" ")[1];
    return jwt.verify(token, process.env.SECRET_KEY || "default_secret");
  }

  async updateUser(newUser: UpdateUserDTO, file?: Express.Multer.File) {
    const currentUser = await this.usersRepository.findOne({
      where: { userId: newUser.id },
    });

    if (!currentUser) throw new NotFoundException("User not found");

    // --- סיסמא ---
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

    // --- תמונת פרופיל ---
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
