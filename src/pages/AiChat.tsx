import { useState } from "react";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your StudyFlix AI assistant. Ask me anything about Math, Science, History, Languages, Programming, or any subject!" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }, { role: "assistant", content: "This is a demo response. Connect AI backend to enable real answers!" }]);
    setInput("");
  };

  return (
    <PageShell title="AI Assistant" subtitle="Ask any doubt, get instant help" icon={<MessageCircle className="w-7 h-7 text-foreground" />} gradientClass="from-emerald-500 to-teal-500">
      <div className="glass rounded-2xl flex flex-col" style={{ height: "60vh" }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/30 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a question..."
            className="bg-muted/50 border-border/50 h-11 text-foreground placeholder:text-muted-foreground"
          />
          <Button onClick={handleSend} className="h-11 w-11 p-0 bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
          <Button onClick={() => setMessages([])} variant="outline" className="h-11 w-11 p-0 border-border/50 text-muted-foreground">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </PageShell>
  );
};

export default AiChat;
