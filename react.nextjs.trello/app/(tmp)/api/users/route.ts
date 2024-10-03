import { NextResponse } from "next/server";

export function GET() {
    return NextResponse.json({
        hello: "trello"
    })
}

export function POST() {
    return NextResponse.json({
        hello: "trello"
    })
}