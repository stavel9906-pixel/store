import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UsersRole } from "src/enums/userRole.enum";
import { UnauthorizedError } from "src/errors/unauthorizedError";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

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
    if (existingUser) {
      throw new UnauthorizedError("User already exists");
    }

    let hashedPassword: string | undefined = undefined;
    if (password && password !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    console.info("hereeee " + hashedPassword)
    // Create new user
    const user = this.usersRepository.create({
      userName: name,
      email,
      password: hashedPassword,
      role: UsersRole.USER,
    });

    await this.usersRepository.save(user);

    console.info(`User registered: ${email}`);

    return {
      message: "User registered successfully",
      user: {
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(email: string, password: string | undefined): Promise<any> {
    // Find user by email
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError("there is no user with this email register");
    }

    if (user.password) {
      if (!bcrypt.compare(password, user.password)) {
        //!password לא נחשב כי הוא כנראה נכנס הפעם מגוגל ואם לא היה מכניס סיסמא לא היה מגיע לפה בכלל
        throw new UnauthorizedError("Invalid password");
      }
    } else {
      // משתמש ללא סיסמה = כניסה דרך Google
      if (!password) {
        console.info(`Google login for user: ${email}`);
      } else {
        throw new UnauthorizedError(
          "User registered via Google, password not exist"
        );
      }
    }

    console.info(`User logged in: ${email}`);

    return {
      message: "Login successful",
      user: {
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
