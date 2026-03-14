"use client";

import CornerElements from "@/components/CornerElements";
import { MailIcon, MessageSquareIcon, ZapIcon, GithubIcon } from "lucide-react";
import { useState } from "react";

const contactMethods = [
  {
    icon: MailIcon,
    title: "Email Support",
    description: "For general inquiries, billing, or account issues.",
    detail: "support@fitmax.ai",
    href: "mailto:support@fitmax.ai",
  },
  {
    icon: MessageSquareIcon,
    title: "Feature Requests",
    description: "Have an idea to make Fitmax.ai better?",
    detail: "feedback@fitmax.ai",
    href: "mailto:feedback@fitmax.ai",
  },
  {
    icon: GithubIcon,
    title: "Bug Reports",
    description: "Found a bug? Report it and help us improve.",
    detail: "bugs@fitmax.ai",
    href: "mailto:bugs@fitmax.ai",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would call an API. For now just show confirmation.
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-5xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-6">
          <ZapIcon className="w-3 h-3" /> CONTACT US
        </div>
        <h1 className="text-4xl font-bold font-mono mb-4">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          We&apos;d love to hear from you. Whether you have a question, feedback, or a feature request — reach out and we&apos;ll get back to you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {contactMethods.map((method) => (
          <a
            key={method.title}
            href={method.href}
            className="relative border border-border rounded-none p-6 overflow-hidden hover:border-primary/60 transition-colors group block"
          >
            <CornerElements />
            <div className="p-2 bg-primary/10 rounded-none w-fit mb-4 group-hover:bg-primary/20 transition-colors">
              <method.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold font-mono mb-1">{method.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
            <span className="text-sm text-primary font-mono">{method.detail}</span>
          </a>
        ))}
      </div>

      {/* Contact Form */}
      <div className="relative border border-border rounded-none p-8 overflow-hidden">
        <CornerElements />
        <h2 className="text-xl font-bold font-mono mb-6">Send a <span className="text-primary">Message</span></h2>

        {submitted ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <MailIcon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-mono mb-2">Message Sent!</h3>
            <p className="text-muted-foreground">Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-background border border-border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-background border border-border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="What is this about?"
                className="w-full bg-background border border-border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us more..."
                className="w-full bg-background border border-border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground font-mono font-semibold rounded-none hover:bg-primary/90 transition-colors"
            >
              Send Message →
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
