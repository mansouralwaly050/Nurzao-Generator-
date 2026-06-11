import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "wouter";
import { Send, Phone, Video, MoreVertical, Paperclip, Loader } from "lucide-react";
import { useChat } from "@/hooks/useChat";

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: Date;
}

export default function RealtimeChat() {
  const [, navigate] = useRouter();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock data - in real app, get from URL params
  const consultationId = 1;
  const userId = 1;
  const recipientId = 2;
  const expertName = "د. أحمد محمود";

  const { messages, isConnected, typingUsers, sendMessage, setTyping } = useChat({
    consultationId,
    userId,
  });

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    sendMessage(inputValue, recipientId);
    setInputValue("");
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setTyping(true);
    
    // Reset typing indicator after 1 second of inactivity
    setTimeout(() => {
      setTyping(false);
    }, 1000);
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
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
                <h2 className="font-bold text-gray-900">{expertName}</h2>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isConnected ? "bg-green-600" : "bg-gray-400"
                    }`}
                  />
                  {isConnected ? "متصل الآن" : "جاري الاتصال..."}
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
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>لا توجد رسائل بعد. ابدأ المحادثة!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.senderId === userId
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === userId
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {/* Typing Indicator */}
              {typingUsers.size > 0 && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 border border-gray-200 rounded-lg rounded-bl-none px-4 py-2">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}

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
                  onChange={handleTyping}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  disabled={!isConnected}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || !isConnected}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isConnected ? (
                    <Send className="h-5 w-5" />
                  ) : (
                    <Loader className="h-5 w-5 animate-spin" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
