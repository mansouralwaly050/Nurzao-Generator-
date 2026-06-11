import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "wouter";
import { Send, Phone, Video, MoreVertical, Paperclip } from "lucide-react";

interface Message {
  id: number;
  sender: "expert" | "client";
  content: string;
  timestamp: Date;
  type: "text" | "file" | "system";
}

export default function ChatBox() {
  const [, navigate] = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "expert",
      content: "مرحباً! كيف يمكنني مساعدتك؟",
      timestamp: new Date(Date.now() - 5 * 60000),
      type: "text",
    },
    {
      id: 2,
      sender: "client",
      content: "أريد استشارة حول استراتيجية التسويق الرقمي",
      timestamp: new Date(Date.now() - 4 * 60000),
      type: "text",
    },
    {
      id: 3,
      sender: "expert",
      content: "تمام! دعني أساعدك في هذا الموضوع المهم",
      timestamp: new Date(Date.now() - 3 * 60000),
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "client",
      content: inputValue,
      timestamp: new Date(),
      type: "text",
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate expert response
    setTimeout(() => {
      const expertResponse: Message = {
        id: messages.length + 2,
        sender: "expert",
        content: "شكراً على السؤال! هذه نقطة مهمة جداً...",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, expertResponse]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  };

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

      {/* Chat Container */}
      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="h-screen max-h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="border-b bg-white p-4 flex items-center justify-between rounded-t-lg">
              <div>
                <h2 className="font-bold text-gray-900">د. أحمد محمود</h2>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isOnline ? "bg-green-600" : "bg-gray-400"
                    }`}
                  />
                  {isOnline ? "متصل الآن" : "غير متصل"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost">
                  <Video className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "client" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "client"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "client"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4 rounded-b-lg">
              <div className="flex gap-2">
                <Button size="icon" variant="ghost">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <input
                  type="text"
                  placeholder="اكتب رسالتك..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
