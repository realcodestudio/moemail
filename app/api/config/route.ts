import { Role, ROLES } from "@/lib/permissions"
import { getRequestContext } from "@cloudflare/next-on-pages"

export const runtime = "edge"

export async function GET() {
  const env = getRequestContext().env
  const [defaultRole, emailDomains] = await Promise.all([
    env.SITE_CONFIG.get("DEFAULT_ROLE"),
    env.SITE_CONFIG.get("EMAIL_DOMAINS")
  ])

  return Response.json({ 
    defaultRole: defaultRole || ROLES.CIVILIAN,
    emailDomains: emailDomains || ""
  })
}

export async function POST(request: Request) {
  const { defaultRole, emailDomains } = await request.json() as { 
    defaultRole: Exclude<Role, typeof ROLES.EMPEROR>,
    emailDomains: string
  }
  
  if (![ROLES.KNIGHT, ROLES.CIVILIAN].includes(defaultRole)) {
    return Response.json({ error: "无效的角色" }, { status: 400 })
  }

  const env = getRequestContext().env
  await Promise.all([
    env.SITE_CONFIG.put("DEFAULT_ROLE", defaultRole),
    env.SITE_CONFIG.put("EMAIL_DOMAINS", emailDomains)
  ])

  return Response.json({ success: true })
} 