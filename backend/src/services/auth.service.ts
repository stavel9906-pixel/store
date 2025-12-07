import {
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UsersRole } from "src/enums/userRole.enum";
import { UnauthorizedError } from "src/errors/unauthorizedError";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CloudinaryService } from "./cloudinary.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private cloudinaryService: CloudinaryService
  ) {}

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
    googleProfileUrl: string | undefined
  ): Promise<any> {
    let user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      user = this.usersRepository.create({
        userName,
        email,
        role: UsersRole.USER,
        profile: googleProfileUrl,
      });

      await this.usersRepository.save(user);
    }

    if (googleProfileUrl) {
      try {
        const uploaded = await this.cloudinaryService.uploadImage(
          googleProfileUrl,
          `user_${user.userId}`
        );

        user.profile = uploaded.secure_url;

        await this.usersRepository.save(user);
      } catch (err) {
        Logger.error("Cloudinary upload failed:", err);
      }
    }

    const token = jwt.sign(
      {
        name: userName,
        role: user.role,
        id: user.userId,
        profile: user.profile,
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
}
