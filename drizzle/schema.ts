import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table - يحتفظ بجميع المستخدمين (خبراء وعملاء)
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  profileImage: text("profileImage"),
  bio: text("bio"),
  userType: mysqlEnum("userType", ["expert", "client"]).notNull(), // نوع المستخدم
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * جدول الخبراء - معلومات تفصيلية عن الخبراء
 */
export const experts = mysqlTable("experts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 100 }).notNull(), // المسمى الوظيفي
  specializations: json("specializations").notNull(), // التخصصات (JSON array)
  experience: int("experience").notNull(), // سنوات الخبرة
  hourlyRate: decimal("hourlyRate", { precision: 10, scale: 2 }).notNull(), // السعر بالساعة
  bio: text("bio"),
  certificates: json("certificates"), // الشهادات (JSON array)
  rating: decimal("rating", { precision: 3, scale: 2 }).default(0), // التقييم
  reviewCount: int("reviewCount").default(0), // عدد التقييمات
  isActive: boolean("isActive").default(true).notNull(),
  isAvailable: boolean("isAvailable").default(true).notNull(),
  totalEarnings: decimal("totalEarnings", { precision: 15, scale: 2 }).default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Expert = typeof experts.$inferSelect;
export type InsertExpert = typeof experts.$inferInsert;

/**
 * جدول الاستشارات
 */
export const consultations = mysqlTable("consultations", {
  id: int("id").autoincrement().primaryKey(),
  expertId: int("expertId").notNull(),
  clientId: int("clientId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
  consultationType: mysqlEnum("consultationType", ["video_call", "audio_call", "chat", "email"]).notNull(),
  scheduledTime: timestamp("scheduledTime"),
  duration: int("duration").notNull(), // بالدقائق
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;

/**
 * جدول الدفوعات
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  consultationId: int("consultationId").notNull(),
  clientId: int("clientId").notNull(),
  expertId: int("expertId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platformFee", { precision: 10, scale: 2 }).notNull(), // رسوم المنصة
  expertAmount: decimal("expertAmount", { precision: 10, scale: 2 }).notNull(), // المبلغ للخبير
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }).notNull(), // stripe, paypal, etc
  transactionId: varchar("transactionId", { length: 100 }),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * جدول التقييمات والمراجعات
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  consultationId: int("consultationId").notNull(),
  expertId: int("expertId").notNull(),
  clientId: int("clientId").notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  isAnonymous: boolean("isAnonymous").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * جدول الرسائل والدردشة
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  consultationId: int("consultationId").notNull(),
  senderId: int("senderId").notNull(),
  receiverId: int("receiverId").notNull(),
  message: text("message").notNull(),
  attachments: json("attachments"), // روابط الملفات
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * جدول إعدادات المنصة
 */
export const platformSettings = mysqlTable("platform_settings", {
  id: int("id").autoincrement().primaryKey(),
  platformFeePercentage: decimal("platformFeePercentage", { precision: 5, scale: 2 }).default(20), // نسبة رسوم المنصة
  minHourlyRate: decimal("minHourlyRate", { precision: 10, scale: 2 }).default(10),
  maxHourlyRate: decimal("maxHourlyRate", { precision: 10, scale: 2 }).default(500),
  supportEmail: varchar("supportEmail", { length: 320 }),
  supportPhone: varchar("supportPhone", { length: 20 }),
  bankAccount: json("bankAccount"), // بيانات الحساب البنكي
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlatformSettings = typeof platformSettings.$inferSelect;
export type InsertPlatformSettings = typeof platformSettings.$inferInsert;

/**
 * جدول بيانات اعتماد الإدارة
 */
export const adminCredentials = mysqlTable("admin_credentials", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  role: varchar("role", { length: 20 }).default("super_admin").notNull(),
  lastLogin: timestamp("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminCredential = typeof adminCredentials.$inferSelect;
export type InsertAdminCredential = typeof adminCredentials.$inferInsert;
