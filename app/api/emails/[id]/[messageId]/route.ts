import { NextResponse } from "next/server"
import { createDb } from "@/lib/db"
import { messages } from "@/lib/schema"
import { and, eq } from "drizzle-orm"

export const runtime = "edge"

export async function GET(request: Request, { params }: { params: Promise<{ id: string; messageId: string }> }) {
  try {
    const { id, messageId } = await params
    const db = createDb()
    const message = await db.query.messages.findFirst({
      where: and(
        eq(messages.id, messageId),
        eq(messages.emailId, id)
      )
    })
    
    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      message: {
        id: message.id,
        from_address: message.fromAddress,
        subject: message.subject,
        content: message.content,
        html: message.html,
        received_at: message.receivedAt.getTime()
      }
    })
  } catch (error) {
    console.error('Failed to fetch message:', error)
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    )
  }
} 