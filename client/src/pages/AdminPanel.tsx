import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "wouter";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  MessageSquare,
  Star,
} from "lucide-react";

export default function AdminPanel() {
  const [, navigate] = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = {
    totalExperts: 145,
    totalClients: 892,
    totalConsultations: 3456,
    totalRevenue: 45230,
    platformFee: 6784,
    monthlyGrowth: 12.5,
  };

  const recentTransactions = [
    {
      id: 1,
      expert: "د. أحمد محمود",
      client: "محمود حسن",
      amount: 150,
      date: "2026-03-02",
      status: "completed",
    },
    {
      id: 2,
      expert: "أ. سارة علي",
      client: "فاطمة أحمد",
      amount: 100,
      date: "2026-03-02",
      status: "pending",
    },
    {
      id: 3,
      expert: "د. محمد سالم",
      client: "علي محمود",
      amount: 200,
      date: "2026-03-01",
      status: "completed",
    },
  ];

  const topExperts = [
    { id: 1, name: "د. أحمد محمود", rating: 4.9, consultations: 234 },
    { id: 2, name: "أ. سارة علي", rating: 4.8, consultations: 189 },
    { id: 3, name: "د. محمد سالم", rating: 4.7, consultations: 156 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container flex items-center justify-between px-4 py-4">
          <div className="text-2xl font-bold text-blue-600">ConsultHub Admin</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              الموقع
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigate("/");
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="border-b bg-white">
        <div className="container px-4">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "نظرة عامة", icon: BarChart3 },
              { id: "experts", label: "الخبراء", icon: Users },
              { id: "transactions", label: "المعاملات", icon: DollarSign },
              { id: "settings", label: "الإعدادات", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">إجمالي الخبراء</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalExperts}
                    </p>
                  </div>
                  <Users className="h-12 w-12 text-blue-600 opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">إجمالي العملاء</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalClients}
                    </p>
                  </div>
                  <Users className="h-12 w-12 text-green-600 opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">الاستشارات</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalConsultations}
                    </p>
                  </div>
                  <MessageSquare className="h-12 w-12 text-purple-600 opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">إجمالي الإيرادات</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ${stats.totalRevenue}
                    </p>
                  </div>
                  <DollarSign className="h-12 w-12 text-green-600 opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">رسوم المنصة</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ${stats.platformFee}
                    </p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-orange-600 opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">النمو الشهري</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.monthlyGrowth}%
                    </p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-blue-600 opacity-20" />
                </div>
              </Card>
            </div>

            {/* Top Experts */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">أفضل الخبراء</h2>
              <div className="space-y-3">
                {topExperts.map((expert) => (
                  <div
                    key={expert.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{expert.name}</p>
                      <p className="text-sm text-gray-600">
                        {expert.consultations} استشارة
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                      <span className="font-bold text-gray-900">
                        {expert.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                آخر المعاملات
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-2 px-4 font-semibold">الخبير</th>
                      <th className="text-right py-2 px-4 font-semibold">العميل</th>
                      <th className="text-right py-2 px-4 font-semibold">المبلغ</th>
                      <th className="text-right py-2 px-4 font-semibold">التاريخ</th>
                      <th className="text-right py-2 px-4 font-semibold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{tx.expert}</td>
                        <td className="py-3 px-4">{tx.client}</td>
                        <td className="py-3 px-4 font-semibold">${tx.amount}</td>
                        <td className="py-3 px-4">{tx.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              tx.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {tx.status === "completed" ? "مكتملة" : "قيد الانتظار"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <Card className="p-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">إعدادات المنصة</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  نسبة رسوم المنصة (%)
                </label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  أقل سعر استشارة ($)
                </label>
                <input
                  type="number"
                  defaultValue="25"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  أعلى سعر استشارة ($)
                </label>
                <input
                  type="number"
                  defaultValue="500"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                حفظ الإعدادات
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
