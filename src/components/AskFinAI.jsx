import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Loader2 } from "lucide-react";

// ─── Knowledge Base ───────────────────────────────────────────────
const getLocalResponse = (input) => {
  const text = input.toLowerCase();
  if (text.includes("sip") || text.includes("mutual fund")) {
    return "SIP (Systematic Investment Plan) lets you invest a fixed amount regularly in mutual funds. It averages costs and harnesses compounding. Start early for best results.";
  }
  if (text.includes("tax") || text.includes("gst")) {
    return "Tax planning can save you money. Under Section 80C, you can invest up to ₹1.5L in ELSS, PPF, etc. Always consult a CA for personalised advice.";
  }
  if (text.includes("fd") || text.includes("fixed deposit")) {
    return "Fixed Deposits offer guaranteed returns with low risk. Rates vary by bank. Use our FD Calculator to estimate maturity amounts.";
  }
  if (text.includes("emi") || text.includes("loan")) {
    return "EMI is your monthly loan repayment. It depends on loan amount, rate, and tenure. Use our EMI Calculator to plan your borrowings.";
  }
  if (text.includes("retirement") || text.includes("pension")) {
    return "Retirement planning ensures you have enough corpus to maintain your lifestyle. The earlier you start, the more compounding helps. Try our Retirement Calculator.";
  }
  if (text.includes("cagr")) {
    return "CAGR measures the average annual growth of your investment. It's better than absolute returns for long‑term comparisons.";
  }
  if (text.includes("inflation")) {
    return "Inflation reduces purchasing power. Your investments should beat inflation to grow real wealth. Equities have historically outperformed inflation.";
  }
  return null;
};

// ─── Finance‑only filter (expanded to allow greetings) ──────────
const isFinanceTopic = (text) => {
  const keywords = [
    "sip", "mutual fund", "tax", "gst", "income tax", "fd", "fixed deposit",
    "emi", "loan", "retirement", "pension", "cagr", "inflation", "invest",
    "stock", "share", "nifty", "sensex", "price", "market", "bond", "gold",
    "real estate", "insurance", "ppf", "epf", "elss", "debt", "equity",
    "portfolio", "return", "dividend", "interest"
  ];
  return keywords.some(kw => text.toLowerCase().includes(kw));
};

// ─── Greeting detection ──────────────────────────────────────────
const isGreeting = (text) => {
  const greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy"];
  return greetings.some(g => text.toLowerCase().includes(g));
};

// ─── Live Data Helpers ────────────────────────────────────────────
const fetchStockPrice = async (symbol) => {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Stock not found");
  const data = await res.json();
  const price = data.chart.result[0].meta.regularMarketPrice;
  const currency = data.chart.result[0].meta.currency;
  return { price, currency };
};

// Common Indian symbols
const symbolMap = {
  "nifty": "^NSEI",
  "sensex": "^BSESN",
  "reliance": "RELIANCE.NS",
  "tata": "TATAMOTORS.NS",
  "hdfc": "HDFCBANK.NS",
  "infosys": "INFY.NS",
  "icici": "ICICIBANK.NS",
  "sbi": "SBIN.NS",
  "bajaj": "BAJFINANCE.NS",
  "wipro": "WIPRO.NS",
  "asian paints": "ASIANPAINT.NS",
  "hcl": "HCLTECH.NS",
  "kotal": "KOTAKBANK.NS",
  // add more as needed
};

// ─── Component ─────────────────────────────────────────────────────
export default function AskFinAI() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I'm FinAI. Ask me about finance, investments, or a live stock price (e.g., 'Reliance price')." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping || isFetching) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    try {
      // 1. Check if it's a greeting
      if (isGreeting(trimmed)) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "Hello! 👋 How can I assist you with your financial questions today?" },
          ]);
          setIsTyping(false);
        }, 400);
        return;
      }

      // 2. Check topic filter (only finance topics allowed)
      if (!isFinanceTopic(trimmed)) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "I'm here to help with finance and investment topics. Could you please ask something about personal finance, investing, taxes, or markets?" },
          ]);
          setIsTyping(false);
        }, 500);
        return;
      }

      // 3. Check if it's a stock price query
      const lower = trimmed.toLowerCase();
      let stockSymbol = null;
      let stockName = null;
      for (const [key, sym] of Object.entries(symbolMap)) {
        if (lower.includes(key)) {
          stockSymbol = sym;
          stockName = key;
          break;
        }
      }

      if (stockSymbol) {
        setIsTyping(false);
        setIsFetching(true);
        try {
          const { price, currency } = await fetchStockPrice(stockSymbol);
          const reply = `The current price of ${stockName.toUpperCase()} is ₹${price.toFixed(2)} (${currency}).`;
          setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
        } catch (err) {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: `Sorry, I couldn't fetch the price for "${stockName}". Please check the symbol or try again later.` },
          ]);
        }
        setIsFetching(false);
        return;
      }

      // 4. Fallback to local knowledge
      const localReply = getLocalResponse(trimmed);
      setTimeout(() => {
        if (localReply) {
          setMessages((prev) => [...prev, { sender: "ai", text: localReply }]);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "That's an interesting question. I'm still learning, but you can explore our calculators and resources for more detailed insights. Ask me about SIP, EMI, FD, taxes, retirement, or a stock price." },
          ]);
        }
        setIsTyping(false);
      }, 600);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Something went wrong. Please try again later." },
      ]);
      setIsTyping(false);
    }
  };

  // Scroll only the chat container, not the whole page
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-blue-200/50">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20 backdrop-blur-sm text-white">
          <Bot size={28} />
        </div>
        <div>
          <h3 className="text-xl font-black">Ask FinAI</h3>
          <p className="text-sm text-blue-100">Live market data • Offline knowledge</p>
        </div>
      </div>

      {/* Chat Messages – with ref for scrolling */}
      <div
        ref={chatContainerRef}
        className="mt-4 h-56 overflow-y-auto rounded-xl bg-white/10 p-3 backdrop-blur-sm space-y-3 scrollbar-thin scrollbar-thumb-white/20"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[80%] items-start gap-2 rounded-2xl px-4 py-2 text-sm ${
                msg.sender === "user"
                  ? "bg-white/20 text-white"
                  : "bg-white/30 text-white"
              }`}
            >
              {msg.sender === "ai" && <Bot size={16} className="mt-0.5 shrink-0" />}
              <span className="leading-relaxed">{msg.text}</span>
              {msg.sender === "user" && <User size={16} className="mt-0.5 shrink-0" />}
            </div>
          </div>
        ))}
        {(isTyping || isFetching) && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-white/30 px-4 py-2 text-sm">
              {isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white/70"></span>
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white/50 delay-150"></span>
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white/30 delay-300"></span>
                </>
              )}
              <span className="ml-1 text-white/80">
                {isFetching ? "Fetching live data..." : "FinAI is thinking..."}
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="mt-4 flex h-11 items-center rounded-xl bg-white/10 backdrop-blur-sm pl-4 ring-1 ring-white/20 focus-within:ring-white/40">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-blue-200"
          placeholder='e.g., "Reliance price" or "What is SIP?"'
          disabled={isTyping || isFetching}
        />
        <button
          type="submit"
          className="grid h-11 w-11 place-items-center text-blue-200 hover:text-white transition disabled:opacity-50"
          aria-label="Send"
          disabled={isTyping || isFetching || !input.trim()}
        >
          <Send size={18} />
        </button>
      </form>

      <p className="mt-3 text-xs text-blue-200/70">
        ✦ Live data from Yahoo Finance • No API key required • Finance‑only
      </p>
    </div>
  );
}