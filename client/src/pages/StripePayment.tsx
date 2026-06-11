import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "wouter";
import { AlertCircle, CheckCircle2, Lock } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_demo");

function PaymentForm({ consultationId, amount, expertName, onSuccess }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      // Create payment method
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: "Customer",
        },
      });

      if (methodError) {
        setError(methodError.message || "Payment failed");
        setLoading(false);
        return;
      }

      // Simulate payment confirmation
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تم الدفع بنجاح!</h2>
        <p className="text-gray-600">سيتم توجيهك قريباً...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">الخبير</p>
        <p className="font-semibold text-gray-900">{expertName}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">المبلغ</p>
        <p className="text-2xl font-bold text-green-600">${amount}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          بيانات البطاقة
        </label>
        <div className="border rounded-lg p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
      >
        <Lock className="h-4 w-4 mr-2" />
        {loading ? "جاري المعالجة..." : "تأكيد الدفع"}
      </Button>

      <p className="text-xs text-gray-600 text-center">
        الدفع آمن وسري باستخدام Stripe
      </p>
    </form>
  );
}

export default function StripePayment() {
  const [, navigate] = useRouter();
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Mock data
  const consultation = {
    id: 1,
    expertName: "د. أحمد محمود",
    amount: 50,
    title: "استشارة تسويق رقمي",
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">تم الدفع بنجاح! 🎉</h1>
            <p className="text-gray-600 mb-6">
              تم حجز استشارتك مع {consultation.expertName}
            </p>
            <Button onClick={() => navigate("/client-dashboard")}>
              العودة إلى لوحة التحكم
            </Button>
          </div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">تأكيد الدفع</h1>

            <Elements stripe={stripePromise}>
              <PaymentForm
                consultationId={consultation.id}
                amount={consultation.amount}
                expertName={consultation.expertName}
                onSuccess={() => setPaymentComplete(true)}
              />
            </Elements>

            {/* Payment Info */}
            <div className="mt-8 pt-8 border-t space-y-4">
              <h2 className="font-semibold text-gray-900">ملخص الحجز</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">الخبير:</span>
                  <span className="font-medium">{consultation.expertName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الخدمة:</span>
                  <span className="font-medium">{consultation.title}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">المجموع:</span>
                  <span className="font-bold text-green-600">${consultation.amount}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
