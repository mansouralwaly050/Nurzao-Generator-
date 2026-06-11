import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getAdminByEmail,
  createAdminCredential,
  updateAdminLastLogin,
  getExpert,
  getAllExperts,
  createExpert,
  updateExpert,
  getConsultation,
  getExpertConsultations,
  getClientConsultations,
  createConsultation,
  updateConsultationStatus,
  createPayment,
  getPayment,
  getExpertPayments,
  updatePaymentStatus,
  createReview,
  getExpertReviews,
  createMessage,
  getConsultationMessages,
  getPlatformSettings,
  updatePlatformSettings,
} from "./db";
import bcrypt from "bcrypt";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie("session", { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  experts: router({
    list: publicProcedure.query(async () => {
      return await getAllExperts();
    }),
    get: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await getExpert(input.userId);
      }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        specializations: z.array(z.string()),
        experience: z.number(),
        hourlyRate: z.number(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await createExpert({
          userId: ctx.user.id,
          ...input,
          specializations: input.specializations as any,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        title: z.string().optional(),
        hourlyRate: z.number().optional(),
        bio: z.string().optional(),
        isAvailable: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await updateExpert(ctx.user.id, input);
      }),
  }),

  consultations: router({
    create: protectedProcedure
      .input(z.object({
        expertId: z.number(),
        title: z.string(),
        description: z.string(),
        consultationType: z.enum(["video_call", "audio_call", "chat", "email"]),
        scheduledTime: z.date().optional(),
        duration: z.number(),
        price: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await createConsultation({
          ...input,
          clientId: ctx.user.id,
          status: "pending",
        });
      }),
    getMyConsultations: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      return await getClientConsultations(ctx.user.id);
    }),
    updateStatus: protectedProcedure
      .input(z.object({
        consultationId: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await updateConsultationStatus(input.consultationId, input.status);
      }),
  }),

  payments: router({
    create: protectedProcedure
      .input(z.object({
        consultationId: z.number(),
        expertId: z.number(),
        amount: z.number(),
        platformFee: z.number(),
        expertAmount: z.number(),
        paymentMethod: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await createPayment({
          ...input,
          clientId: ctx.user.id,
          status: "pending",
        });
      }),
    confirm: protectedProcedure
      .input(z.object({ paymentId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await updatePaymentStatus(input.paymentId, "completed");
      }),
    getMyPayments: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      return await getExpertPayments(ctx.user.id);
    }),
  }),

  reviews: router({
    create: protectedProcedure
      .input(z.object({
        consultationId: z.number(),
        expertId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await createReview({
          ...input,
          clientId: ctx.user.id,
        });
      }),
    getExpertReviews: publicProcedure
      .input(z.object({ expertId: z.number() }))
      .query(async ({ input }) => {
        return await getExpertReviews(input.expertId);
      }),
  }),

  messages: router({
    send: protectedProcedure
      .input(z.object({
        consultationId: z.number(),
        recipientId: z.number(),
        content: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await createMessage({
          ...input,
          senderId: ctx.user.id,
        });
      }),
    getMessages: protectedProcedure
      .input(z.object({ consultationId: z.number() }))
      .query(async ({ input }) => {
        return await getConsultationMessages(input.consultationId);
      }),
  }),

  settings: router({
    getPlatformSettings: publicProcedure.query(async () => {
      return await getPlatformSettings();
    }),
    updatePlatformSettings: protectedProcedure
      .input(z.object({
        platformFeePercentage: z.number().optional(),
        minConsultationPrice: z.number().optional(),
        maxConsultationPrice: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await updatePlatformSettings(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
