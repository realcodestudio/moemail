export const EMAIL_CONFIG = {
  MAX_ACTIVE_EMAILS: 30, // Maximum number of active emails
  POLL_INTERVAL: 10_000, // Polling interval in milliseconds
  DEFAULT_DAILY_SEND_LIMITS: {
    emperor: 0,   // 皇帝无限制
    duke: 15,      // 公爵每日15封
    knight: 5,    // 骑士每日5封
    civilian: -1, // 平民禁止发件
  },
} as const

export type EmailConfig = typeof EMAIL_CONFIG 