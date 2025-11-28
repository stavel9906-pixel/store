import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UsersRole } from "src/enums/userRole.enum";
import { UnauthorizedError } from "src/errors/unauthorizedError";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async register(
    name: string,
    email: string,
    password: string | undefined
  ): Promise<any> {
    // Check if user already exists
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
      { name: user.userName, role: user.role, id: user.userId },
      process.env.SECRET_KEY
    );
    // Create new user
    console.info(`User registered: ${email}`);

    return {
      message: "User registered successfully",
      token,
    };
  }

  async login(email: string, password: string | undefined): Promise<any> {
    // Find user by email
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedError("there is no user with this email register");
    }

    const isValid = await bcrypt.compare(password || "", user.password || "");
    if (!isValid) {
      //!password לא נחשב כי הוא כנראה נכנס הפעם מגוגל ואם לא היה מכניס סיסמא לא היה מגיע לפה בכלל
      throw new UnauthorizedError("Invalid Password For This User");
    }
    // } else {
    //   // משתמש ללא סיסמה = כניסה דרך Google
    //   if (!password) {
    //     console.info(`Google login for user: ${email}`);
    //   } else {
    //     throw new UnauthorizedError(
    //       "User registered via Google, password not exist"
    //     );
    //   }

    const token = jwt.sign(
      { name: user.userName, role: user.role, id: user.userId },
      process.env.SECRET_KEY
    );
    console.info(`User logged in: ${email}`);

    return {
      message: "Login successful",
      token,
      // user: {
      //   userName: user.userName,
      //   email: user.email,
      //   role: user.role,
      // },
    };
  }

  async googleSignIn(email: string, userName: string): Promise<any> {
    // Find user by email
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      const newUser = this.usersRepository.create({
        userName,
        email,
        role: UsersRole.USER,
      });

      await this.usersRepository.save(newUser);
    }

    const token = jwt.sign(
      { name: userName, role: !user ? UsersRole.USER : user.role, id: user?.userId },
      process.env.SECRET_KEY
    );
    console.info(`User signed in with google: ${email}`);

    return {
      message: "Sign in successful",
      token,
    };
  }
}
