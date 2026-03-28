import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateUserDTO, UserEntity } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserRole } from "../../../domain/value-objects/enums";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: Omit<UserEntity, "passwordHash" | "refreshToken">;
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  enterpriseId?: string;
}

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(dto: RegisterDTO): Promise<AuthTokens> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error("A user with this email already exists");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const createDTO: CreateUserDTO = {
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      enterpriseId: dto.enterpriseId,
    };

    const user = await this.userRepository.create(createDTO);
    return this.generateTokens(user);
  }

  async login(dto: LoginDTO): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const tokens = this.generateTokens(user);
    await this.userRepository.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByRefreshToken(refreshToken);
    if (!user) {
      throw new Error("Invalid or expired refresh token");
    }

    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    } catch {
      throw new Error("Refresh token has expired");
    }

    const accessToken = this.createAccessToken(user);
    return { accessToken };
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.storeRefreshToken(userId, "");
  }

  private generateTokens(user: UserEntity): AuthTokens {
    const accessToken = this.createAccessToken(user);
    const refreshToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? "7d") as any },
    );

    const { passwordHash, refreshToken: _, ...safeUser } = user;
    return { accessToken, refreshToken, user: safeUser };
  }

  private createAccessToken(user: UserEntity): string {
    return jwt.sign(
      { sub: user.id, role: user.role, enterpriseId: user.enterpriseId },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as any },
    );
  }
}
