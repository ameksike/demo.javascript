import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient |undefined;
}
export const db = globalThis.prisma || new PrismaClient();

// Avoiding multi open contentions by Hot reload process
if(process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}