import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import subjectsSeed from "@/data/subjects.json";
import type { Deadline, Subject } from "./types";
import type { SessionRole } from "./permissions";

/**
 * Lớp dữ liệu: đọc/ghi file JSON phía server.
 * Trên Vercel thư mục dự án chỉ đọc, nên dữ liệu được sao sang /tmp ở lần đọc đầu tiên.
 */
const SEED_DIR = path.join(process.cwd(), "data");
const DATA_DIR = process.env.VERCEL ? "/tmp/deadline-hub" : SEED_DIR;

export class DataError extends Error {
  constructor(public code: string, file: string) {
    super(`${code}: ${file}`);
  }
}

async function readJson<T>(file: string): Promise<T> {
  const target = path.join(DATA_DIR, file);
  try {
    return JSON.parse(await fs.readFile(target, "utf8")) as T;
  } catch (err) {
    if (DATA_DIR !== SEED_DIR && (err as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.copyFile(path.join(SEED_DIR, file), target);
      return JSON.parse(await fs.readFile(target, "utf8")) as T;
    }
    throw new DataError("DATA_READ_FAILED", file);
  }
}

// Ghi tuần tự để hai request ghi cùng lúc không đè lên nhau
let writeQueue: Promise<unknown> = Promise.resolve();

function writeJson(file: string, data: unknown) {
  const run = async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const target = path.join(DATA_DIR, file);
    const tmp = `${target}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
    await fs.rename(tmp, target);
  };
  const next = writeQueue.then(run, run);
  writeQueue = next.catch(() => undefined);
  return next;
}

/* ---------- Môn học (tĩnh) ---------- */

const subjects = subjectsSeed as Subject[];

export function getSubjects(): Subject[] {
  return subjects;
}

export function getSubject(slug: string): Subject | undefined {
  return subjects.find((s) => s.slug === slug);
}

/* ---------- Deadline ---------- */

export const getDeadlines = cache(async (): Promise<Deadline[]> => {
  const list = await readJson<Deadline[]>("deadlines.json");
  return [...list].sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime() || a.id - b.id);
});

export async function getDeadline(id: number): Promise<Deadline | undefined> {
  return (await getDeadlines()).find((d) => d.id === id);
}

export async function addDeadline(input: Omit<Deadline, "id">): Promise<Deadline> {
  const list = await readJson<Deadline[]>("deadlines.json");
  const created: Deadline = { id: list.reduce((max, d) => Math.max(max, d.id), 0) + 1, ...input };
  await writeJson("deadlines.json", [...list, created]);
  return created;
}

export async function removeDeadline(id: number): Promise<boolean> {
  const list = await readJson<Deadline[]>("deadlines.json");
  const next = list.filter((d) => d.id !== id);
  if (next.length === list.length) return false;
  await writeJson("deadlines.json", next);

  // Xoá luôn trạng thái "đã xong" trỏ tới deadline này
  const progress = await readJson<Record<string, number[]>>("progress.json");
  for (const key of Object.keys(progress)) progress[key] = progress[key].filter((x) => x !== id);
  await writeJson("progress.json", progress);
  return true;
}

/* ---------- Tiến độ của sinh viên ---------- */

export async function getDoneIds(userId: string): Promise<number[]> {
  const progress = await readJson<Record<string, number[]>>("progress.json");
  return progress[userId] ?? [];
}

export async function setDone(userId: string, deadlineId: number, done: boolean): Promise<number[]> {
  const progress = await readJson<Record<string, number[]>>("progress.json");
  const current = new Set(progress[userId] ?? []);
  if (done) current.add(deadlineId);
  else current.delete(deadlineId);
  progress[userId] = [...current].sort((a, b) => a - b);
  await writeJson("progress.json", progress);
  return progress[userId];
}

/* ---------- Tài khoản ---------- */

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: SessionRole;
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const users = await readJson<UserRecord[]>("users.json");
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
