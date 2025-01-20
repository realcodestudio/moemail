"use client"

import { Button } from "@/components/ui/button"
import { Sword, Loader2, UserMinus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ROLES } from "@/lib/permissions"

export function PromotePanel() {
  const [searchText, setSearchText] = useState("")
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<"promote" | "demote">("promote")
  const { toast } = useToast()

  const handleAction = async () => {
    if (!searchText) return

    setLoading(true)
    try {
      const res = await fetch("/api/roles/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchText })
      })
      const data = await res.json() as { 
        user?: { 
          id: string
          name?: string
          username?: string
          email: string
          role?: string 
        }
        error?: string 
      }

      if (!res.ok) throw new Error(data.error || "未知错误")

      if (!data.user) {
        toast({
          title: "未找到用户",
          description: "请确认邮箱地址是否正确",
          variant: "destructive"
        })
        return
      }

      if (action === "promote" && data.user.role === ROLES.KNIGHT) {
        toast({
          title: "用户已是骑士",
          description: "无需重复册封",
        })
        return
      }

      if (action === "demote" && data.user.role === ROLES.CIVILIAN) {
        toast({
          title: "用户已是平民",
          description: "无需重复贬为平民",
        })
        return
      }

      const promoteRes = await fetch('/api/roles/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: data.user.id,
          roleName: action === "promote" ? ROLES.KNIGHT : ROLES.CIVILIAN
        })
      })

      const result = await promoteRes.json() as { error: string }
      if (!promoteRes.ok) throw new Error(result.error)

      toast({
        title: action === "promote" ? "册封成功" : "贬为平民",
        description: `已将 ${data.user.email || data.user.username} ${action === "promote" ? "册封为骑士" : "贬为平民"}`
      })
      setSearchText("")

    } catch (error) {
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background rounded-lg border-2 border-primary/20 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sword className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">角色管理</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            placeholder="输入用户名或邮箱"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex gap-2 sm:flex-shrink-0">
          <Button 
            onClick={() => {
              setAction("promote")
              handleAction()
            }}
            disabled={!searchText || loading}
            className="flex-1 sm:flex-initial gap-2"
          >
            {loading && action === "promote" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sword className="w-4 h-4" />
            )}
            册封骑士
          </Button>
          <Button 
            onClick={() => {
              setAction("demote")
              handleAction()
            }}
            disabled={!searchText || loading}
            variant="destructive"
            className="flex-1 sm:flex-initial gap-2"
          >
            {loading && action === "demote" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserMinus className="w-4 h-4" />
            )}
            贬为平民
          </Button>
        </div>
      </div>
    </div>
  )
} 