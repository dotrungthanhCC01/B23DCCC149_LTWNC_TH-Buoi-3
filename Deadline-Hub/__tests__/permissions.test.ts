import { ACTIONS, can, isSessionRole, type Action, type Role } from "@/lib/permissions";

describe("can(role, action) — ma trận phân quyền", () => {
  const expected: Record<Role, Record<Action, boolean>> = {
    guest: { "deadline:view": true, "deadline:complete": false, "deadline:create": false, "deadline:delete": false },
    user: { "deadline:view": true, "deadline:complete": true, "deadline:create": false, "deadline:delete": false },
    admin: { "deadline:view": true, "deadline:complete": true, "deadline:create": true, "deadline:delete": true },
  };

  for (const role of Object.keys(expected) as Role[]) {
    for (const action of ACTIONS) {
      it(`${role} ${expected[role][action] ? "được" : "không được"} ${action}`, () => {
        expect(can(role, action)).toBe(expected[role][action]);
      });
    }
  }

  it("không có vai trò (null/undefined) được xử lý như guest", () => {
    for (const action of ACTIONS) {
      expect(can(undefined, action)).toBe(can("guest", action));
      expect(can(null, action)).toBe(can("guest", action));
    }
  });

  it("vai trò hoặc hành động lạ luôn bị từ chối", () => {
    expect(can("superadmin" as Role, "deadline:delete")).toBe(false);
    expect(can("admin", "deadline:hack" as Action)).toBe(false);
  });

  it("isSessionRole chỉ chấp nhận user/admin", () => {
    expect(isSessionRole("user")).toBe(true);
    expect(isSessionRole("admin")).toBe(true);
    expect(isSessionRole("guest")).toBe(false);
    expect(isSessionRole("root")).toBe(false);
    expect(isSessionRole(undefined)).toBe(false);
  });
});
