import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";
import { streamChat } from "@/lib/ai";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your StudyFlix AI assistant. Ask me anything about Math, Science, History, Languages, Programming, or any subject!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        mode: "doubt",
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
      });
    } catch (e: any) {
      setIsLoading(false);
      toast.error(e.message || "Failed to get response");
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    }
  };

  return (
    <PageShell title="AI Assistant" subtitle="Ask any doubt, get instant help" icon={<MessageCircle className="w-7 h-7 text-foreground" />} gradientClass="from-emerald-500 to-teal-500">
      <div className="glass rounded-2xl flex flex-col" style={{ height: "60vh" }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border/30 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a question..."
            className="bg-muted/50 border-border/50 h-11 text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading} className="h-11 w-11 p-0 bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
          <Button onClick={() => setMessages([{ role: "assistant", content: "Chat cleared. Ask me anything!" }])} variant="outline" className="h-11 w-11 p-0 border-border/50 text-muted-foreground">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </PageShell>
  );
};

export default AiChat;
