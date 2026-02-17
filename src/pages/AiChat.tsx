import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Trash2, Loader2, Plus, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";
import { streamChat } from "@/lib/ai";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Message { role: "user" | "assistant"; content: string; }

const AiChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your StudyFlix AI assistant. Ask me anything about Math, Science, History, Languages, Programming, or any subject!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (user) loadConversations();
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    const { data } = await supabase.from("chat_conversations").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
    setConversations(data || []);
  };

  const loadConversation = async (convId: string) => {
    const { data } = await supabase.from("chat_messages").select("*").eq("conversation_id", convId).order("created_at", { ascending: true });
    if (data) {
      setMessages(data.map((m: any) => ({ role: m.role, content: m.content })));
      setCurrentConvId(convId);
      setShowHistory(false);
    }
  };

  const saveMessage = async (convId: string, role: string, content: string) => {
    if (!user) return;
    await supabase.from("chat_messages").insert({ conversation_id: convId, user_id: user.id, role, content });
  };

  const newChat = () => {
    setMessages([{ role: "assistant", content: "Hello! I'm your StudyFlix AI assistant. Ask me anything!" }]);
    setCurrentConvId(null);
    setShowHistory(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let convId = currentConvId;
    if (!convId && user) {
      const { data } = await supabase.from("chat_conversations").insert({ user_id: user.id, title: input.slice(0, 50) }).select().single();
      if (data) { convId = data.id; setCurrentConvId(data.id); }
    }

    if (convId && user) await saveMessage(convId, "user", input);

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
        onDone: async () => {
          setIsLoading(false);
          if (convId && user) await saveMessage(convId, "assistant", assistantSoFar);
          loadConversations();
        },
      });
    } catch (e: any) {
      setIsLoading(false);
      toast.error(e.message || "Failed");
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    }
  };

  return (
    <PageShell title="AI Assistant" subtitle="Ask any doubt, get instant help" icon={<MessageCircle className="w-7 h-7 text-foreground" />} gradientClass="from-emerald-500 to-teal-500">
      <div className="glass rounded-2xl flex flex-col" style={{ height: "65vh" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between p-3 border-b border-border/30">
          <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)} className="text-muted-foreground text-xs gap-1.5">
            <History className="w-3.5 h-3.5" /> History
          </Button>
          <Button variant="ghost" size="sm" onClick={newChat} className="text-muted-foreground text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New Chat
          </Button>
        </div>

        {/* History panel */}
        {showHistory && (
          <div className="border-b border-border/30 max-h-48 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 ? (
              <p className="text-muted-foreground text-xs text-center py-3">No chat history yet</p>
            ) : conversations.map((conv) => (
              <button key={conv.id} onClick={() => loadConversation(conv.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${currentConvId === conv.id ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"}`}>
                <p className="font-semibold truncate">{conv.title}</p>
                <p className="text-[10px] opacity-60">{new Date(conv.updated_at).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
                }`}>{msg.content}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/30 flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a question..." className="bg-muted/50 border-border/50 h-11 text-foreground placeholder:text-muted-foreground" disabled={isLoading} />
          <Button onClick={handleSend} disabled={isLoading} className="h-11 w-11 p-0 bg-primary hover:bg-primary/90"><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </PageShell>
  );
};

export default AiChat;
