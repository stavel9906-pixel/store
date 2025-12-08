import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UsersRole } from "src/enums/userRole.enum";
import { UnauthorizedError } from "src/errors/unauthorizedError";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CloudinaryService } from "./cloudinary.service";
import axios from "axios";
import { UserTokenDTO } from "src/entities/DTO/UserTokenDTO";

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

    const token = await this.generateToken(user);
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
      throw new UnauthorizedError("Invalid Password For This User");
    }

    const token = await this.generateToken(user);
    Logger.log(`User logged in: ${email}`);

    return {
      message: "Login successful",
      token,
    };
  }

  async validateGoogleUser(accessToken: string): Promise<User> {
    try {
      // Verify token with Google
      const googleResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const { email, name, picture } = googleResponse.data;

      // Find or Create User
      let user = await this.usersRepository.findOne({ where: { email } });

      if (!user) {
        user = this.usersRepository.create({
          userName: name,
          email,
          role: UsersRole.USER,
          profile: picture,
        });
        await this.usersRepository.save(user);
      }

      // Upload image to Cloudinary if needed 
      if (picture && !user.profile?.includes("cloudinary")) {
        try {
          const uploaded = await this.cloudinaryService.uploadImage(
            picture,
            `user_${user.userId}`
          );
          user.profile = uploaded.secure_url;
          await this.usersRepository.save(user);
        } catch (err) {
          Logger.error("Cloudinary upload failed", err);
        }
      }
      Logger.log(`User signed in with google: ${email}`);

      return user;
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedError("Invalid Google Token");
    }
  }

  async generateToken(user: User): Promise<string> {
    const token = jwt.sign(
      {
        name: user.userName,
        role: user.role,
        id: user.userId,
        email: user.email,
        profile: user.profile,
      },
      process.env.SECRET_KEY!
    );

    return token
  }
}
