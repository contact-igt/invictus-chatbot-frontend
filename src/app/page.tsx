import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, CalendarCheck, Globe, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <div className="text-2xl font-bold text-primary">MedChat<span className="text-secondary">AI</span></div>
        <div className="flex gap-4">
          <Link href="/login"><Button variant="ghost">Login</Button></Link>
          <Link href="/signup"><Button>Start Free Trial</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 text-center px-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
          AI WhatsApp Chatbot for Hospitals
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Answer patient doubts, manage appointments, and chat in any language — automatically and 24/7.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="rounded-full px-8 text-lg">Start Free Trial</Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 text-lg">Book Demo</Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: MessageCircle, title: "24/7 AI Replies", desc: "Instantly answer common patient questions." },
            { icon: CalendarCheck, title: "Auto Booking", desc: "Schedule appointments directly via WhatsApp." },
            { icon: Globe, title: "Multi-language", desc: "Speak to patients in their native language." },
            { icon: Activity, title: "Dr. Availability", desc: "Real-time updates on doctor schedules." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
