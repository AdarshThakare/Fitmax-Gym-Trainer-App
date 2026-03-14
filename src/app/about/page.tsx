import CornerElements from "@/components/CornerElements";
import { DumbbellIcon, HeartIcon, ZapIcon, UsersIcon, TrophyIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Fitmax.ai — Your AI Fitness Partner",
  description: "Learn about Fitmax.ai — the AI-powered gym trainer app built to help you reach your fitness goals with personalized plans and real-time tracking.",
};

const features = [
  {
    icon: ZapIcon,
    title: "AI-Powered Planning",
    description: "Our voice AI agent crafts personalized workout and diet plans based on your goals, fitness level, and lifestyle in a conversational session.",
  },
  {
    icon: DumbbellIcon,
    title: "Smart Routine Tracking",
    description: "Track simple exercises like pushups, squats, cardio and custom routines from the ExerciseDB library with detailed set-by-set logging.",
  },
  {
    icon: HeartIcon,
    title: "Streak & Habit Building",
    description: "Stay motivated with a real-time workout streak calendar, daily log counts, and performance analytics built to build lasting habits.",
  },
  {
    icon: TrophyIcon,
    title: "Performance Analytics",
    description: "Visualize your progress with radar charts, timeframe analyses, and comparative day-over-day metrics across all exercise categories.",
  },
  {
    icon: UsersIcon,
    title: "Custom Exercise Library",
    description: "Explore thousands of exercises grouped by body part or target muscle, with GIFs, instructions, and one-tap logging to your routine.",
  },
  {
    icon: ShieldIcon,
    title: "Secure & Private",
    description: "Your fitness data is stored securely in our Convex database and authentication is handled via Clerk. We never sell your data.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-5xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-6">
          <ZapIcon className="w-3 h-3" /> ABOUT FITMAX.AI
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
          Train Smarter, <span className="text-primary">Not Harder</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Fitmax.ai is an AI-first gym trainer application that combines voice intelligence, real-time analytics, and a curated exercise library to help you achieve your fitness goals — on your schedule, on your terms.
        </p>
      </div>

      {/* Mission */}
      <div className="relative border border-border rounded-none p-8 mb-12 overflow-hidden backdrop-blur-sm">
        <CornerElements />
        <h2 className="text-2xl font-bold font-mono mb-4"><span className="text-primary">Our</span> Mission</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          We believe personalized fitness shouldn&apos;t be gatekept by expensive personal trainers or one-size-fits-all programs. By combining conversational AI with proven exercise science, Fitmax.ai delivers tailored workout and nutrition plans in minutes — completely for free.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Whether you&apos;re a beginner starting your first routine or an experienced athlete optimizing your performance, Fitmax.ai adapts to you.
        </p>
      </div>

      {/* Features Grid */}
      <h2 className="text-2xl font-bold font-mono mb-6 text-center">What We <span className="text-primary">Offer</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="relative border border-border rounded-none p-6 overflow-hidden hover:border-primary/50 transition-colors group"
          >
            <CornerElements />
            <div className="p-2 bg-primary/10 rounded-none w-fit mb-4 group-hover:bg-primary/20 transition-colors">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold font-mono mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/generate-program"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono font-semibold rounded-none hover:bg-primary/90 transition-colors"
        >
          <ZapIcon className="w-4 h-4" />
          Generate Your Free Plan
        </Link>
      </div>
    </main>
  );
}
