import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "../../../src/application/use-cases/auth/AuthService";
import { UserEntity } from "../../../src/domain/entities/User";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";

// ─────────────────────────────────────────────────────────────
// MOCKED USER REPOSITORY (TDD: Dependency Injection)
// ─────────────────────────────────────────────────────────────
const mockUserRepository: IUserRepository = {
  findById: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findAllByEnterprise: vi.fn(),
  storeRefreshToken: vi.fn(),
  findByRefreshToken: vi.fn(),
};

const makeUser = (overrides: Partial<UserEntity> = {}): UserEntity => ({
  id: "user-uuid-1",
  email: "test@example.com",
  passwordHash: "$2b$12$hashed",
  firstName: "Test",
  lastName: "User",
  role: "ENTERPRISE_MANAGER",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// ─────────────────────────────────────────────────────────────
// ENV SETUP for JWT
// ─────────────────────────────────────────────────────────────
process.env.JWT_ACCESS_SECRET = "test-access-secret-32-chars-minimum!!";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-32-chars-minimum!!";
process.env.JWT_ACCESS_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService(mockUserRepository);
  });

  // ───────────────────────────────────────────────────────────
  // register()
  // ───────────────────────────────────────────────────────────
  describe("register()", () => {
    it("should successfully register a new user and return tokens", async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockUserRepository.create).mockResolvedValue(makeUser());

      const result = await authService.register({
        email: "new@example.com",
        password: "Password123!",
        firstName: "Jane",
        lastName: "Doe",
        role: "ENTERPRISE_MANAGER",
      });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe("test@example.com");
      expect(result.user).not.toHaveProperty("passwordHash");
    });

    it("should throw if email is already taken", async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(makeUser());

      await expect(
        authService.register({
          email: "existing@example.com",
          password: "Password123!",
          firstName: "Jane",
          lastName: "Doe",
          role: "ENTERPRISE_MANAGER",
        }),
      ).rejects.toThrow("A user with this email already exists");
    });
  });

  // ───────────────────────────────────────────────────────────
  // login()
  // ───────────────────────────────────────────────────────────
  describe("login()", () => {
    it("should return tokens for valid credentials", async () => {
      // Use actual bcrypt hash for "Password123!"
      const bcrypt = await import("bcryptjs");
      const hash = await bcrypt.hash("Password123!", 12);
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(
        makeUser({ passwordHash: hash }),
      );
      vi.mocked(mockUserRepository.storeRefreshToken).mockResolvedValue(
        undefined,
      );

      const result = await authService.login({
        email: "test@example.com",
        password: "Password123!",
      });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(mockUserRepository.storeRefreshToken).toHaveBeenCalledWith(
        "user-uuid-1",
        expect.any(String),
      );
    });

    it("should throw for non-existent email", async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

      await expect(
        authService.login({ email: "ghost@example.com", password: "wrong" }),
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw for incorrect password", async () => {
      const bcrypt = await import("bcryptjs");
      const hash = await bcrypt.hash("CorrectPassword!", 12);
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(
        makeUser({ passwordHash: hash }),
      );

      await expect(
        authService.login({
          email: "test@example.com",
          password: "WrongPassword",
        }),
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw for inactive user", async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(
        makeUser({ isActive: false }),
      );

      await expect(
        authService.login({ email: "test@example.com", password: "anything" }),
      ).rejects.toThrow("Invalid credentials");
    });
  });

  // ───────────────────────────────────────────────────────────
  // refreshAccessToken()
  // ───────────────────────────────────────────────────────────
  describe("refreshAccessToken()", () => {
    it("should issue a new access token for a valid refresh token", async () => {
      const jwt = await import("jsonwebtoken");
      const validRefreshToken = jwt.sign(
        { sub: "user-uuid-1" },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" },
      );
      vi.mocked(mockUserRepository.findByRefreshToken).mockResolvedValue(
        makeUser(),
      );

      const result = await authService.refreshAccessToken(validRefreshToken);

      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe("string");
    });

    it("should throw if refresh token is not found in storage", async () => {
      vi.mocked(mockUserRepository.findByRefreshToken).mockResolvedValue(null);

      await expect(
        authService.refreshAccessToken("invalid-token"),
      ).rejects.toThrow("Invalid or expired refresh token");
    });
  });

  // ───────────────────────────────────────────────────────────
  // logout()
  // ───────────────────────────────────────────────────────────
  describe("logout()", () => {
    it("should clear the refresh token from storage", async () => {
      vi.mocked(mockUserRepository.storeRefreshToken).mockResolvedValue(
        undefined,
      );

      await authService.logout("user-uuid-1");

      expect(mockUserRepository.storeRefreshToken).toHaveBeenCalledWith(
        "user-uuid-1",
        "",
      );
    });
  });
});
