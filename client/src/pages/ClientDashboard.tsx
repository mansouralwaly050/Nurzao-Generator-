import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "wouter";
import { Search, Clock, DollarSign, Star } from "lucide-react";
import { useState } from "react";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [, navigate] = useRouter();
  const [activeTab, setActiveTab] = useState<"search" | "consultations" | "history">("search");
  const [searchQuery, setSearchQuery] = useState("");

  const experts = [
    {
      id: 1,
      name: "د. أحمد محمود",
      title: "مستشار تسويق رقمي",
      rating: 4.9,
      reviews: 234,
      hourlyRate: 50,
      bio: "خبرة 10 سنوات في التسويق الرقمي والعلامات التجارية",
      specializations: ["تسويق رقمي", "إدارة وسائل التواصل", "تحليل البيانات"],
      isAvailable: true,
    },
    {
      id: 2,
      name: "فاطمة علي",
      title: "مهندسة تطوير ويب",
      rating: 4.8,
      reviews: 189,
      hourlyRate: 60,
      bio: "متخصصة في تطوير تطبيقات الويب والموبايل",
      specializations: ["React", "Node.js", "تطوير الواجهات"],
      isAvailable: true,
    },
    {
      id: 3,
      name: "محمد حسن",
      title: "مستشار أعمال",
      rating: 4.7,
      reviews: 156,
      hourlyRate: 75,
      bio: "خبرة في إدارة المشاريع والتطوير الاستراتيجي",
      specializations: ["إدارة المشاريع", "التطوير الاستراتيجي", "ريادة الأعمال"],
      isAvailable: false,
    },
  ];

  const myConsultations = [
    {
      id: 1,
      expertName: "د. أحمد محمود",
      title: "استشارة تسويق رقمي",
      status: "scheduled",
      time: "2026-03-02 14:00",
      price: 50,
    },
    {
      id: 2,
      expertName: "فاطمة علي",
      title: "استشارة تطوير ويب",
      status: "completed",
      time: "2026-02-28 10:00",
      price: 60,
    },
  ];

  const filteredExperts = experts.filter(expert =>
    expert.name.includes(searchQuery) ||
    expert.title.includes(searchQuery) ||
    expert.specializations.some(spec => spec.includes(searchQuery))
  );

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
            ابحث عن الخبراء واحجز استشاراتك
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b bg-white">
        <div className="container px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("search")}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === "search"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              البحث عن خبير
            </button>
            <button
              onClick={() => setActiveTab("consultations")}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === "consultations"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              استشاراتي
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === "history"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              السجل
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="container px-4 py-8">
        {activeTab === "search" && (
          <div>
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن خبير أو تخصص..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Experts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredExperts.map((expert) => (
                <Card key={expert.id} className="p-6 hover:shadow-lg transition">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {expert.name}
                    </h3>
                    <p className="text-sm text-gray-600">{expert.title}</p>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-gray-900">
                        {expert.rating}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({expert.reviews} تقييم)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        ${expert.hourlyRate}/ساعة
                      </span>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-gray-600">{expert.bio}</p>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {expert.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!expert.isAvailable}
                    onClick={() => navigate(`/book-consultation/${expert.id}`)}
                  >
                    {expert.isAvailable ? "احجز استشارة" : "غير متاح حالياً"}
                  </Button>
                </Card>
              ))}
            </div>

            {filteredExperts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">لم يتم العثور على خبراء</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "consultations" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">استشاراتي</h2>
            {myConsultations.map((consultation) => (
              <Card key={consultation.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {consultation.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      مع {consultation.expertName}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {consultation.time}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        ${consultation.price}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        consultation.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {consultation.status === "completed"
                        ? "مكتملة"
                        : "مجدولة"}
                    </span>
                    <Button size="sm" className="mt-2" variant="outline">
                      التفاصيل
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">سجل الاستشارات</h2>
            {myConsultations
              .filter((c) => c.status === "completed")
              .map((consultation) => (
                <Card key={consultation.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {consultation.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        مع {consultation.expertName}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {consultation.time}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      اترك تقييم
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
