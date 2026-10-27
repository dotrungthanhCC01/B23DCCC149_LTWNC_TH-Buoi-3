/**
 * Ma trận phân quyền — nơi DUY NHẤT định nghĩa ai được làm gì.
 * Middleware, trang /admin, Server Action và UI đều gọi can(role, action).
 */
export const ROLES = ["guest", "user", "admin"] as const;
export type Role = (typeof ROLES)[number];

/** Vai trò của tài khoản đã đăng nhập (guest không bao giờ nằm trong session) */
export type SessionRole = Exclude<Role, "guest">;

export const ACTIONS = ["deadline:view", "deadline:complete", "deadline:create", "deadline:delete"] as const;
export type Action = (typeof ACTIONS)[number];

const MATRIX: Record<Action, readonly Role[]> = {
  "deadline:view": ["guest", "user", "admin"],
  "deadline:complete": ["user", "admin"],
  "deadline:create": ["admin"],
  "deadline:delete": ["admin"],
};

export function can(role: Role | null | undefined, action: Action): boolean {
  return MATRIX[action]?.includes(role ?? "guest") ?? false;
}

export function isSessionRole(value: unknown): value is SessionRole {
  return value === "user" || value === "admin";
}

export const ROLE_LABELS: Record<Role, string> = {
  guest: "Khách",
  user: "Sinh viên",
  admin: "Lớp trưởng",
};
