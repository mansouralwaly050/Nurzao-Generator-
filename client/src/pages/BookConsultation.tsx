import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "wouter";
import { useState } from "react";
import { Calendar, Clock, Video, MessageCircle, Mail, Phone } from "lucide-react";

export default function BookConsultation() {
  const [, navigate] = useRouter();
  const [step, setStep] = useState<"type" | "time" | "payment">("type");
  const [consultationType, setConsultationType] = useState<"video_call" | "audio_call" | "chat" | "email">("video_call");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Mock expert data
  const expert = {
    id: 1,
    name: "د. أحمد محمود",
    title: "مستشار تسويق رقمي",
    rating: 4.9,
    hourlyRate: 50,
    bio: "خبرة 10 سنوات في التسويق الرقمي",
  };

  const consultationTypes = [
    {
      id: "video_call",
      name: "مكالمة فيديو",
      icon: Video,
      duration: 60,
      price: expert.hourlyRate,
      description: "استشارة وجهاً لوجه عبر الفيديو",
    },
    {
      id: "audio_call",
      name: "مكالمة صوتية",
      icon: Phone,
      duration: 60,
      price: expert.hourlyRate * 0.8,
      description: "استشارة عبر الهاتف",
    },
    {
      id: "chat",
      name: "دردشة نصية",
      icon: MessageCircle,
      duration: 120,
      price: expert.hourlyRate * 0.6,
      description: "استشارة عبر الدردشة النصية",
    },
    {
      id: "email",
      name: "بريد إلكتروني",
      icon: Mail,
      duration: 48,
      price: expert.hourlyRate * 0.5,
      description: "رد بريد إلكتروني مفصل",
    },
  ];

  const selectedType = consultationTypes.find(t => t.id === consultationType);
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container flex items-center justify-between px-4 py-4">
          <div className="text-2xl font-bold text-blue-600">ConsultHub</div>
          <Button variant="outline" onClick={() => navigate("/")}>
            العودة
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Expert Card */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {expert.name}
                </h2>
                <p className="text-gray-600">{expert.title}</p>
              </div>
              <div className="mb-4 space-y-2">
                <p className="text-sm text-gray-600">⭐ {expert.rating} ({expert.hourlyRate} تقييم)</p>
                <p className="text-sm text-gray-600">${expert.hourlyRate}/ساعة</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-4">{expert.bio}</p>
              </div>
              {selectedType && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">السعر المتوقع</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${selectedType.price}
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            {step === "type" && (
              <Card className="p-8">
                <h2 className="mb-6 text-2xl font-bold">اختر نوع الاستشارة</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {consultationTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => {
                          setConsultationType(type.id as any);
                          setStep("time");
                        }}
                        className={`p-6 border-2 rounded-lg transition text-left ${
                          consultationType === type.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <Icon className="h-8 w-8 text-blue-600 mb-2" />
                        <h3 className="font-bold text-gray-900">{type.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {type.description}
                        </p>
                        <p className="text-sm font-semibold text-green-600 mt-2">
                          ${type.price}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}

            {step === "time" && (
              <Card className="p-8">
                <h2 className="mb-6 text-2xl font-bold">اختر التاريخ والوقت</h2>

                {/* Date Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    الوقت
                  </label>
                  <div className="grid gap-2 md:grid-cols-4">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 border rounded-lg transition ${
                          selectedTime === time
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <Clock className="h-4 w-4 inline mr-2" />
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    موضوع الاستشارة
                  </label>
                  <input
                    type="text"
                    placeholder="اكتب موضوع الاستشارة..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Description */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    وصف تفصيلي (اختياري)
                  </label>
                  <textarea
                    placeholder="اكتب تفاصيل أكثر عن احتياجاتك..."
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("type")}
                  >
                    السابق
                  </Button>
                  <Button
                    onClick={() => setStep("payment")}
                    disabled={!selectedDate || !selectedTime}
                  >
                    التالي
                  </Button>
                </div>
              </Card>
            )}

            {step === "payment" && (
              <Card className="p-8">
                <h2 className="mb-6 text-2xl font-bold">تأكيد الحجز والدفع</h2>

                {/* Summary */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="font-bold text-gray-900 mb-4">ملخص الحجز</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">نوع الاستشارة:</span>
                      <span className="font-semibold">{selectedType?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التاريخ والوقت:</span>
                      <span className="font-semibold">{selectedDate} {selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المدة:</span>
                      <span className="font-semibold">{selectedType?.duration} دقيقة</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-bold">المجموع:</span>
                      <span className="font-bold text-green-600 text-lg">
                        ${selectedType?.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    طريقة الدفع
                  </label>
                  <div className="space-y-3">
                    <button className="w-full p-4 border-2 border-blue-600 rounded-lg bg-blue-50 text-left">
                      <p className="font-semibold text-gray-900">بطاقة ائتمان</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, Amex</p>
                    </button>
                    <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 text-left">
                      <p className="font-semibold text-gray-900">PayPal</p>
                      <p className="text-sm text-gray-600">الدفع الآمن عبر PayPal</p>
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      رقم البطاقة
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        تاريخ الانتهاء
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("time")}
                  >
                    السابق
                  </Button>
                  <Button className="flex-1" onClick={() => navigate("/consultation-confirmed")}>
                    تأكيد الحجز والدفع
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
