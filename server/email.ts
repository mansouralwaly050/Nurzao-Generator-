import nodemailer from "nodemailer";

// Configure email service (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `ConsultHub <${process.env.EMAIL_USER || "noreply@consulthub.com"}>`,
      ...options,
    });
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

// Email templates
export const emailTemplates = {
  // تأكيد الحجز
  bookingConfirmation: (expertName: string, clientName: string, date: string, time: string) => ({
    subject: `تأكيد الحجز - استشارة مع ${expertName}`,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>تأكيد الحجز</h2>
        <p>مرحباً ${clientName},</p>
        <p>تم تأكيد حجزك للاستشارة مع <strong>${expertName}</strong></p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>التاريخ:</strong> ${date}</p>
          <p><strong>الوقت:</strong> ${time}</p>
          <p><strong>الخبير:</strong> ${expertName}</p>
        </div>
        <p>يرجى الدخول إلى حسابك قبل 5 دقائق من الموعد المحدد.</p>
        <p>شكراً لاستخدامك ConsultHub!</p>
      </div>
    `,
  }),

  // تذكير قبل الاستشارة
  consultationReminder: (expertName: string, clientName: string, timeRemaining: string) => ({
    subject: `تذكير: استشارتك مع ${expertName} بعد ${timeRemaining}`,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>تذكير الاستشارة</h2>
        <p>مرحباً ${clientName},</p>
        <p>تذكير: استشارتك مع <strong>${expertName}</strong> ستبدأ بعد <strong>${timeRemaining}</strong></p>
        <p>تأكد من أن لديك اتصال إنترنت جيد وأن جهازك مستعد.</p>
        <a href="https://consulthub.com/realtime-chat" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          الدخول إلى الاستشارة
        </a>
      </div>
    `,
  }),

  // شكر بعد الاستشارة
  postConsultationThank: (clientName: string, expertName: string) => ({
    subject: `شكراً لاستخدامك خدماتنا`,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>شكراً لك!</h2>
        <p>مرحباً ${clientName},</p>
        <p>شكراً لك على استخدام خدماتنا والاستشارة مع <strong>${expertName}</strong></p>
        <p>نأمل أن تكون الاستشارة مفيدة لك.</p>
        <p>يمكنك الآن تقييم الخدمة والخبير لمساعدتنا في التحسن.</p>
        <a href="https://consulthub.com/review" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          اترك تقييماً
        </a>
      </div>
    `,
  }),

  // طلب التقييم
  reviewRequest: (clientName: string, expertName: string) => ({
    subject: `شارك رأيك عن استشارتك مع ${expertName}`,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>نريد رأيك</h2>
        <p>مرحباً ${clientName},</p>
        <p>كيف كانت تجربتك مع <strong>${expertName}</strong>؟</p>
        <p>تقييمك يساعدنا على تحسين الخدمة وتقديم أفضل الخبراء.</p>
        <a href="https://consulthub.com/review" style="background-color: #ffc107; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          اترك تقييماً الآن
        </a>
      </div>
    `,
  }),

  // إشعار الدفع الناجح
  paymentSuccess: (clientName: string, amount: number, invoiceId: string) => ({
    subject: `تأكيد الدفع - الفاتورة #${invoiceId}`,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>تم استلام الدفع</h2>
        <p>مرحباً ${clientName},</p>
        <p>تم استلام دفعتك بنجاح!</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>المبلغ:</strong> $${amount}</p>
          <p><strong>رقم الفاتورة:</strong> ${invoiceId}</p>
          <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString("ar-SA")}</p>
        </div>
        <p>شكراً لاستخدامك ConsultHub!</p>
      </div>
    `,
  }),

  // إشعار للخبير - استشارة جديدة
  newConsultationNotification: (expertName: string, clientName: string, topic: string) => ({
    subject: `استشارة جديدة من ${clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>استشارة جديدة</h2>
        <p>مرحباً ${expertName},</p>
        <p>لديك استشارة جديدة من <strong>${clientName}</strong></p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>الموضوع:</strong> ${topic}</p>
          <p><strong>العميل:</strong> ${clientName}</p>
        </div>
        <a href="https://consulthub.com/expert-dashboard" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          عرض الاستشارة
        </a>
      </div>
    `,
  }),
};

// Notification service
export async function notifyBookingConfirmation(
  clientEmail: string,
  expertName: string,
  clientName: string,
  date: string,
  time: string
) {
  const template = emailTemplates.bookingConfirmation(expertName, clientName, date, time);
  return sendEmail({
    to: clientEmail,
    ...template,
  });
}

export async function notifyConsultationReminder(
  clientEmail: string,
  expertName: string,
  clientName: string,
  timeRemaining: string
) {
  const template = emailTemplates.consultationReminder(expertName, clientName, timeRemaining);
  return sendEmail({
    to: clientEmail,
    ...template,
  });
}

export async function notifyPostConsultation(
  clientEmail: string,
  clientName: string,
  expertName: string
) {
  const template = emailTemplates.postConsultationThank(clientName, expertName);
  return sendEmail({
    to: clientEmail,
    ...template,
  });
}

export async function notifyReviewRequest(
  clientEmail: string,
  clientName: string,
  expertName: string
) {
  const template = emailTemplates.reviewRequest(clientName, expertName);
  return sendEmail({
    to: clientEmail,
    ...template,
  });
}

export async function notifyPaymentSuccess(
  clientEmail: string,
  clientName: string,
  amount: number,
  invoiceId: string
) {
  const template = emailTemplates.paymentSuccess(clientName, amount, invoiceId);
  return sendEmail({
    to: clientEmail,
    ...template,
  });
}

export async function notifyNewConsultation(
  expertEmail: string,
  expertName: string,
  clientName: string,
  topic: string
) {
  const template = emailTemplates.newConsultationNotification(expertName, clientName, topic);
  return sendEmail({
    to: expertEmail,
    ...template,
  });
}
