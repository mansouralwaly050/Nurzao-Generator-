import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "wouter";
import { BarChart3, Calendar, DollarSign, Star, Users, Clock } from "lucide-react";
import { useState } from "react";

export default function ExpertDashboard() {
  const { user } = useAuth();
  const [, navigate] = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "consultations" | "earnings" | "profile">("overview");

  // Mock data
  const stats = {
    totalEarnings: 15750,
    monthlyEarnings: 3200,
    completedConsultations: 145,
    rating: 4.8,
    upcomingConsultations: 5,
    totalClients: 89,
  };

  const upcomingConsultations = [
    {
      id: 1,
      clientName: "أحمد محمد",
      title: "استشارة تسويق رقمي",
      time: "2026-03-02 14:00",
      type: "video_call",
      price: 50,
    },
    {
      id: 2,
      clientName: "فاطمة علي",
      title: "استشارة تطوير ويب",
      time: "2026-03-02 16:30",
      type: "chat",
      price: 30,
    },
  ];

  const recentReviews = [
    {
      id: 1,
      clientName: "محمود حسن",
      rating: 5,
      comment: "استشارة رائعة جداً، ساعدني كثيراً في فهم المفاهيم",
      date: "2026-03-01",
    },
    {
      id: 2,
      clientName: "سارة أحمد",
      rating: 4,
      comment: "جيدة جداً، لكن كان يمكن أن تكون أطول قليلاً",
      date: "2026-02-28",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container flex items-center justify-between px-4 py-4">
          <div className="text-2xl font-bold text-blue-600">ConsultHub</div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              الرئيسية
            </Button>
            <Button variant="outline" onClick={() => navigate("/logout")}>
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b bg-white py-6">
        <div className="container px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            مرحباً، {user?.name}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            لوحة التحكم الخاصة بك كخبير
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="container px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الأرباح</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.totalEarnings}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الاستشارات المكتملة</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.completedConsultations}
                </p>
              </div>
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">التقييم</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.rating}⭐
                </p>
              </div>
              <Star className="h-12 w-12 text-yellow-600" />
            </div>
          </Card>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b bg-white">
        <div className="container px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab("consultations")}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === "consultations"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              الاستشارات
            </button>
            <button
              onClick={() => setActiveTab("earnings")}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === "earnings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              الأرباح
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === "profile"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              الملف الشخصي
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="container px-4 py-8">
        {activeTab === "overview" && (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Upcoming Consultations */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-bold">الاستشارات القادمة</h2>
              <div className="space-y-4">
                {upcomingConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {consultation.clientName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {consultation.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {consultation.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        ${consultation.price}
                      </p>
                      <Button size="sm" className="mt-2">
                        انضم الآن
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Reviews */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-bold">التقييمات الأخيرة</h2>
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b pb-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">
                        {review.clientName}
                      </p>
                      <p className="text-yellow-600">{"⭐".repeat(review.rating)}</p>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">{review.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "consultations" && (
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold">جميع الاستشارات</h2>
            <div className="space-y-4">
              {upcomingConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {consultation.clientName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {consultation.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ${consultation.price}
                    </p>
                    <Button size="sm" variant="outline">
                      التفاصيل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "earnings" && (
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-bold">الأرباح والدفعات</h2>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600">الأرباح هذا الشهر</p>
                <p className="text-2xl font-bold text-green-900">
                  ${stats.monthlyEarnings}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">إجمالي الأرباح</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${stats.totalEarnings}
                </p>
              </div>
            </div>
            <Button className="w-full">طلب سحب الأرباح</Button>
          </Card>
        )}

        {activeTab === "profile" && (
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-bold">تحديث الملف الشخصي</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  المسمى الوظيفي
                </label>
                <input
                  type="text"
                  placeholder="مثال: مستشار تسويق رقمي"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  السعر بالساعة ($)
                </label>
                <input
                  type="number"
                  placeholder="50"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  السيرة الذاتية
                </label>
                <textarea
                  placeholder="اكتب نبذة عن نفسك وخبراتك..."
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <Button className="w-full">حفظ التغييرات</Button>
            </form>
          </Card>
        )}
      </section>
    </div>
  );
}
