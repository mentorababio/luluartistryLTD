"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, MessageCircle, ChevronRight, Send, X } from "lucide-react";

type Tab = "contact" | "faqs" | "returns";

const CATEGORIES = [
  "Order Issues",
  "Payment Problems",
  "Product Questions",
  "Technical Support",
  "Other",
];

const FAQS = [
  {
    section: "General Information",
    items: [
      { q: "Where are you located?", a: "We are based in Calabar, Nigeria. All orders are shipped from our studio." },
      { q: "Do you ship nationwide?", a: "Yes, we deliver to all states in Nigeria." },
      { q: "How long does delivery take?", a: "2–4 business days after processing, depending on your location." },
      { q: "Do you offer same-day delivery?", a: "Yes, within Calabar for orders placed before 12 PM." },
      { q: "Can I pick up my order?", a: "Yes, choose 'Pickup' at checkout and we'll notify you when it's ready." },
    ],
  },
  {
    section: "Payments",
    items: [
      { q: "What payment methods do you accept?", a: "Bank transfers, debit/credit cards, and Paystack." },
      { q: "Do you offer payment on delivery?", a: "No, all orders must be prepaid to confirm processing." },
    ],
  },
  {
    section: "Product Info",
    items: [
      { q: "What's the difference between Easy Fan and Classic lashes?", a: "Easy Fans (0.07) bloom into fans for volume sets; Classic (0.15) are for single-strand natural looks." },
      { q: "What lash curls do you have?", a: "Easy Fans: J, B, L, C, Cc, D, Dd, M\nClassic: C, Cc, D" },
      { q: "What lash lengths are available?", a: "Single trays: 8mm–25mm\nMixed trays: 8–14mm, 14–20mm, 20–25mm\nBottom lashes: 5–10mm" },
      { q: "How long does your lash glue last?", a: "4–8 weeks retention. Available in 5ml and 10ml." },
      { q: "Are your products safe?", a: "Yes, all products are tested and safe for professional use." },
    ],
  },
  {
    section: "Training",
    items: [
      { q: "Do you offer lash or brow training?", a: "Yes! We offer both online and in-person classes." },
      { q: "Will I get a certificate?", a: "Yes, you'll receive a Certificate of Completion after your training." },
    ],
  },
  {
    section: "Returns & Support",
    items: [
      { q: "Can I return or exchange a product?", a: "All sales are final. If you receive a damaged or wrong item, contact us within 24 hours." },
      { q: "What if my order is missing an item?", a: "Message us via WhatsApp or email within 24 hours and we'll resolve it quickly." },
    ],
  },
];

// ── Modal Component ─────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("contact");
  const [form, setForm] = useState({ subject: "", category: "Order Issues", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Modals
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{ from: "user" | "agent"; text: string }[]>([
    { from: "agent", text: "👋 Hi! I'm a Lulu Artistry support agent. How can I help you today?" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.subject || !form.message) {
      setError("Please fill in subject and message.");
      return;
    }

    const message =
      `*Support Ticket - Lulu Artistry*%0A%0A` +
      `*Subject:* ${encodeURIComponent(form.subject)}%0A` +
      `*Category:* ${encodeURIComponent(form.category)}%0A` +
      `*Message:* ${encodeURIComponent(form.message)}`;

   const link = document.createElement("a");
link.href = `https://wa.me/2347031002094?text=${message}`;
link.target = "_blank";
link.rel = "noopener noreferrer";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);

    setSubmitted(true);
    setForm({ subject: "", category: "Order Issues", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessages((prev) => [...prev, { from: "user", text: chatMessage }]);
    setChatMessage("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { from: "agent", text: "Thanks for your message! A support agent will follow up shortly. You can also reach us at lulusartistry321@gmail.com." },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Support Center</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-100 pb-1">
          {[
            { key: "contact", label: "Contact Us" },
            { key: "faqs", label: "FAQs" },
            { key: "returns", label: "Returns & Refunds" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-[#C9A84C] text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Contact Us Tab ─────────────────────────────── */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">

              {/* Phone */}
              <button
                onClick={() => setShowPhone(true)}
                className="w-full bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md hover:border-[#C9A84C] transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Phone Support</p>
                    <p className="text-[#C9A84C] text-sm">+1 (800) 123-4567</p>
                    <p className="text-gray-400 text-xs mt-0.5">Mon–Fri, 9am–6pm EST</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 mt-1" />
              </button>

              {/* Email */}
              <button
                onClick={() => setShowEmail(true)}
                className="w-full bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md hover:border-[#C9A84C] transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Email Support</p>
                    <p className="text-[#C9A84C] text-sm">lulusartistry321@gmail.com</p>
                    <p className="text-gray-400 text-xs mt-0.5">Response within 24 hours</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 mt-1" />
              </button>

              {/* Live Chat */}
              <button
                onClick={() => setShowChat(true)}
                className="w-full bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md hover:border-[#C9A84C] transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={18} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Live Chat</p>
                    <p className="text-gray-500 text-sm">Chat with an agent</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-green-500 text-xs font-medium">Available now</p>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 mt-1" />
              </button>
            </div>

            {/* Ticket Form */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-5">Submit a Support Ticket</h2>

              {submitted && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                  ✓ Ticket submitted! We'll get back to you within 24 hours.
                </div>
              )}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] bg-white"
                  >
                    {CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Please describe your issue in detail..."
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                 disabled={false}
                  className="w-full bg-[#C9A84C] text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send size={16} />
                  Submit Ticket
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── FAQs Tab ───────────────────────────────────── */}
        {activeTab === "faqs" && (
          <div className="space-y-8">
            {FAQS.map((section) => (
              <div key={section.section}>
                <h2 className="text-base font-bold text-gray-800 mb-4 text-center">{section.section}</h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.q} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === item.q ? null : item.q)}
                        className="w-full text-left px-5 py-4 flex items-start justify-between gap-3"
                      >
                        <p className="text-sm font-medium text-gray-800">Q: {item.q}</p>
                        <ChevronRight
                          size={16}
                          className={`text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${openFaq === item.q ? "rotate-90" : ""}`}
                        />
                      </button>
                      {openFaq === item.q && (
                        <div className="px-5 pb-4 border-t border-gray-50">
                          <p className="text-sm text-gray-600 mt-3 whitespace-pre-line">A: {item.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm font-medium">Still Have Questions?</p>
              <p className="text-sm text-gray-400 mt-1">
                Email: <a href="mailto:hello@luluartistry.com" className="text-[#C9A84C] hover:underline">hello@luluartistry.com</a>
              </p>
            </div>
          </div>
        )}

        {/* ── Returns & Refunds Tab ──────────────────────── */}
        {activeTab === "returns" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Return & Refund</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Due to the hygienic nature of our beauty products, we do not accept returns or exchanges once items have been opened or used.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                If your item arrives damaged or incorrect, please contact us within 48 hours of delivery for a quick resolution.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Contact us anytime:</p>
              <a href="mailto:hello@luluartistry.com" className="flex items-center gap-2 text-[#C9A84C] text-sm font-medium hover:underline">
                <Mail size={16} />
                hello@luluartistry.com
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "No Returns on Used Items", desc: "Once opened or used, items cannot be returned due to hygiene standards.", icon: "🚫" },
                { title: "Damaged Items", desc: "Contact us within 48 hours of receiving a damaged or incorrect item.", icon: "📦" },
                { title: "Quick Resolution", desc: "We'll work quickly to resolve any issues with your order.", icon: "✅" },
              ].map((card) => (
                <div key={card.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <p className="text-sm font-semibold text-gray-800 mb-2">{card.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Phone Modal ─────────────────────────────────── */}
      {showPhone && (
        <Modal title="Phone Support" onClose={() => setShowPhone(false)}>
          <div className="flex flex-col items-center text-center py-4 gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Phone size={28} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">+1 (800) 123-4567</p>
              <p className="text-gray-400 text-sm mt-1">Mon–Fri, 9am–6pm EST</p>
            </div>
            <a
              href="tel:+18001234567"
              className="w-full bg-[#C9A84C] text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              Call Now
            </a>
            <button onClick={() => setShowPhone(false)} className="text-sm text-gray-400 hover:text-gray-600">
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* ── Email Modal ─────────────────────────────────── */}
      {showEmail && (
        <Modal title="Email Support" onClose={() => setShowEmail(false)}>
          <div className="flex flex-col items-center text-center py-4 gap-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <Mail size={28} className="text-green-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">lulusartistry321@gmail.com</p>
              <p className="text-gray-400 text-sm mt-1">We respond within 24 hours</p>
            </div>
            <a
              href="mailto:lulusartistry321@gmail.com"
              className="w-full bg-[#C9A84C] text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              <Mail size={16} />
              Send Email
            </a>
            <button onClick={() => setShowEmail(false)} className="text-sm text-gray-400 hover:text-gray-600">
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* ── Live Chat Modal ──────────────────────────────── */}
      {showChat && (
        <Modal title="Live Chat" onClose={() => setShowChat(false)}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-500 font-medium">Agent is online</span>
          </div>
          <div className="h-56 overflow-y-auto space-y-3 mb-4 bg-gray-50 rounded-lg p-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.from === "user"
                    ? "bg-[#C9A84C] text-white rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-700 rounded-bl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            />
            <button
              onClick={sendChatMessage}
              className="bg-[#C9A84C] text-white px-4 py-2.5 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}