import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, experts, consultations, payments, reviews, messages, 
  platformSettings, adminCredentials, InsertExpert, InsertConsultation, 
  InsertPayment, InsertReview, InsertMessage 
} from "../drizzle/schema";
import { ENV } from './_core/env';
import { eq, desc, and } from "drizzle-orm";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== Users ====================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
      userType: user.userType || "client",
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "bio", "profileImage"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      updateSet.lastSignedIn = user.lastSignedIn;
    }

    await db
      .insert(users)
      .values(values)
      .onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Error upserting user:", error);
    throw error;
  }
}

export async function getUser(openId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  
  return result[0] || null;
}

// ==================== Experts ====================
export async function createExpert(expert: InsertExpert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(experts).values(expert);
  return result;
}

export async function getExpert(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(experts)
    .where(eq(experts.userId, userId))
    .limit(1);
  
  return result[0] || null;
}

export async function getAllExperts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(experts)
    .where(eq(experts.isActive, true));
}

export async function updateExpert(userId: number, data: Partial<InsertExpert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(experts)
    .set(data)
    .where(eq(experts.userId, userId));
}

// ==================== Consultations ====================
export async function createConsultation(consultation: InsertConsultation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(consultations).values(consultation);
  return result;
}

export async function getConsultation(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(consultations)
    .where(eq(consultations.id, id))
    .limit(1);
  
  return result[0] || null;
}

export async function getExpertConsultations(expertId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(consultations)
    .where(eq(consultations.expertId, expertId))
    .orderBy(desc(consultations.createdAt));
}

export async function getClientConsultations(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(consultations)
    .where(eq(consultations.clientId, clientId))
    .orderBy(desc(consultations.createdAt));
}

export async function updateConsultationStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(consultations)
    .set({ status: status as any })
    .where(eq(consultations.id, id));
}

// ==================== Payments ====================
export async function createPayment(payment: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(payments).values(payment);
  return result;
}

export async function getPayment(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))
    .limit(1);
  
  return result[0] || null;
}

export async function getExpertPayments(expertId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(payments)
    .where(eq(payments.expertId, expertId))
    .orderBy(desc(payments.createdAt));
}

export async function updatePaymentStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(payments)
    .set({ status: status as any })
    .where(eq(payments.id, id));
}

// ==================== Reviews ====================
export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(reviews).values(review);
}

export async function getExpertReviews(expertId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.expertId, expertId))
    .orderBy(desc(reviews.createdAt));
}

// ==================== Messages ====================
export async function createMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(messages).values(message);
}

export async function getConsultationMessages(consultationId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(messages)
    .where(eq(messages.consultationId, consultationId))
    .orderBy(desc(messages.createdAt));
}

// ==================== Platform Settings ====================
export async function getPlatformSettings() {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(platformSettings)
    .limit(1);
  
  return result[0] || null;
}

export async function updatePlatformSettings(data: Partial<typeof platformSettings.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const settings = await getPlatformSettings();
  if (!settings) {
    return await db.insert(platformSettings).values(data as any);
  }
  
  return await db
    .update(platformSettings)
    .set(data)
    .where(eq(platformSettings.id, settings.id));
}

// ==================== Admin Credentials ====================
export async function getAdminByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(adminCredentials)
    .where(eq(adminCredentials.email, email))
    .limit(1);
  
  return result[0] || null;
}

export async function createAdminCredential(admin: InsertAdminCredential) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(adminCredentials).values(admin);
}

export async function updateAdminLastLogin(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(adminCredentials)
    .set({ lastLogin: new Date() })
    .where(eq(adminCredentials.id, id));
}
