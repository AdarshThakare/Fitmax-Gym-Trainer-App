import CornerElements from "@/components/CornerElements";
import { ShieldIcon } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Fitmax.ai",
  description: "Learn how Fitmax.ai collects, uses, and protects your personal data.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly when you create an account, interact with our AI assistant, or log workout data. This includes: your name and email address (via Clerk authentication), voice transcript data from AI sessions, workout logs, set/rep counts, and exercise history. We do not collect or store actual audio recordings.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to provide, maintain, and improve our services — including generating personalized fitness plans, displaying your workout history and analytics, tracking your streak, and improving the accuracy of our AI recommendations. We do not use your data to train third-party machine learning models without your consent.`,
  },
  {
    title: "3. Data Storage",
    content: `Your workout data is stored in Convex, a secure real-time database. Authentication data is managed by Clerk. AI voice conversation data is processed through Vapi.ai. Each of these providers maintains their own privacy policies and employs industry-standard security practices.`,
  },
  {
    title: "4. Data Sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share aggregate, anonymized data for research or analytics purposes. We may disclose your information if required by law or to protect our legal rights.`,
  },
  {
    title: "5. Cookies & Tracking",
    content: `We use cookies and similar technologies to maintain session state and improve user experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of the App may not function properly without cookies.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to access, update, or delete your personal information at any time. Workout data can be deleted directly within the App. To request deletion of your account and associated data, please contact us using the form on our Contact page.`,
  },
  {
    title: "7. Children's Privacy",
    content: `Fitmax.ai is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such data, we will take steps to delete it.`,
  },
  {
    title: "8. Security",
    content: `We implement commercially reasonable security measures to protect your data, including encrypted connections (HTTPS) and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy periodically. We will notify you of significant changes by updating the date below and, where appropriate, providing additional notice. Your continued use of the App after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions about this Privacy Policy or your personal data, please contact us via the Contact page or email us at privacy@fitmax.ai.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-6">
          <ShieldIcon className="w-3 h-3" /> PRIVACY
        </div>
        <h1 className="text-4xl font-bold font-mono mb-4">
          Privacy <span className="text-primary">Policy</span>
        </h1>
        <p className="text-muted-foreground">Last updated: March 14, 2025</p>
      </div>

      <div className="relative border border-border rounded-none p-6 mb-8 overflow-hidden bg-primary/5">
        <CornerElements />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your privacy is important to us. This policy explains what data Fitmax.ai collects, how we use it, and the choices you have about your information. We keep this simple and transparent — no jargon.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="border-b border-border/50 pb-8 last:border-0">
            <h2 className="text-lg font-bold font-mono text-primary mb-3">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{section.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
