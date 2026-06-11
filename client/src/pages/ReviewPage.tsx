import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "wouter";
import { Star, Send } from "lucide-react";

export default function ReviewPage() {
  const [, navigate] = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const expert = {
    name: "د. أحمد محمود",
    title: "مستشار تسويق رقمي",
    consultationTitle: "استشارة تسويق رقمي",
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("يرجى اختيار تقييم");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      navigate("/client-dashboard");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">شكراً لتقييمك!</h1>
          <p className="text-gray-600 mb-6">
            سيتم استخدام تقييمك لتحسين جودة الخدمة
          </p>
          <p className="text-sm text-gray-500">جاري التوجيه...</p>
        </Card>
      </div>
    );
  }

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
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              قيّم الاستشارة
            </h1>
            <p className="text-gray-600 mb-6">
              ساعدنا في تحسين الخدمة بتقييمك
            </p>

            {/* Expert Info */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">الخبير</p>
              <p className="font-bold text-gray-900">{expert.name}</p>
              <p className="text-sm text-gray-600">{expert.title}</p>
              <p className="text-sm text-gray-500 mt-2">{expert.consultationTitle}</p>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                التقييم
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-600 text-yellow-600"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  {rating === 5 && "ممتاز جداً! 🌟"}
                  {rating === 4 && "جيد جداً! 👍"}
                  {rating === 3 && "جيد 😊"}
                  {rating === 2 && "مقبول 👌"}
                  {rating === 1 && "يحتاج تحسين 😔"}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                تعليقك (اختياري)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="شارك رأيك وملاحظاتك..."
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              إرسال التقييم
            </Button>

            {/* Additional Reviews */}
            <div className="mt-8 pt-8 border-t">
              <h2 className="font-bold text-gray-900 mb-4">تقييمات أخرى</h2>
              <div className="space-y-4">
                {[
                  {
                    name: "محمود حسن",
                    rating: 5,
                    comment: "استشارة رائعة جداً، ساعدني كثيراً",
                    date: "2026-03-01",
                  },
                  {
                    name: "سارة أحمد",
                    rating: 4,
                    comment: "جيدة جداً، لكن كان يمكن أن تكون أطول",
                    date: "2026-02-28",
                  },
                ].map((review, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-yellow-600">
                        {"⭐".repeat(review.rating)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
