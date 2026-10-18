import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

function createRequest(body: unknown) {
  return new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;
}

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a user with valid data", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user_1",
      email: "test@example.com",
    } as any);

    const request = createRequest({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(prisma.user.create).toHaveBeenCalledOnce();
  });

  it("returns 409 when the email already exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user_2",
      email: "existing@example.com",
    } as any);

    const request = createRequest({
      name: "Existing User",
      email: "existing@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toContain("already exists");
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid input", async () => {
    const request = createRequest({
      name: "",
      email: "not-an-email",
      password: "short",
      confirmPassword: "different",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
