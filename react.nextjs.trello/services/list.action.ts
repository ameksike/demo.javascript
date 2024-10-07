import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

const entity = db.list;

export type SelectOptions = {
    where?: Prisma.ListWhereInput;
    order?: Prisma.ListOrderByWithRelationInput;
    include?: Prisma.ListInclude;
};

export async function list(options?: SelectOptions) {
    return await entity.findMany({
        where: options?.where,
        orderBy: options?.order,
        include: options?.include,
    });
}

export async function select(options?: SelectOptions) {
    return await entity.findFirst({
        where: options?.where,
        include: options?.include,
    });
}

export async function remove(id: string) {
    return await entity.delete({ where: { id } });
}
