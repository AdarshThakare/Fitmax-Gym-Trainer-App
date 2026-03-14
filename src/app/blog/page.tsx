import CornerElements from "@/components/CornerElements";
import { ZapIcon, CalendarIcon, TagIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Blog — Fitmax.ai",
  description: "Fitness tips, AI training insights, nutrition guides, and Fitmax.ai product updates.",
};

const posts = [
  {
    slug: "#",
    tag: "AI & Tech",
    date: "March 10, 2025",
    title: "How Our AI Voice Agent Builds Your Perfect Workout Plan",
    excerpt: "Discover how Fitmax.ai uses conversational AI to understand your lifestyle, fitness goals, and physical capabilities — then generates a structured plan in under 5 minutes.",
    readTime: "5 min read",
    featured: true,
  },
  {
    slug: "#",
    tag: "Training",
    date: "March 7, 2025",
    title: "Progressive Overload: The #1 Rule for Building Strength",
    excerpt: "Whether you do pushups or barbell squats, progressive overload is the single most effective strategy for long-term muscle growth. Here's how to implement it correctly.",
    readTime: "4 min read",
    featured: false,
  },
  {
    slug: "#",
    tag: "Nutrition",
    date: "March 4, 2025",
    title: "Protein Timing: Does It Actually Matter?",
    excerpt: "The myth of the 30-minute anabolic window has been debunked. But protein timing still matters — just not in the way fitness influencers claim. Here's the science.",
    readTime: "6 min read",
    featured: false,
  },
  {
    slug: "#",
    tag: "Habits",
    date: "Feb 28, 2025",
    title: "Building a Workout Streak That Actually Sticks",
    excerpt: "Consistency beats intensity every single time. We built the Streak Calendar feature in Fitmax.ai to help you visualize your momentum — here's the psychology behind it.",
    readTime: "3 min read",
    featured: false,
  },
  {
    slug: "#",
    tag: "Recovery",
    date: "Feb 22, 2025",
    title: "Sleep, Stress, and Muscle Recovery: The Complete Guide",
    excerpt: "Your muscles aren't built in the gym — they're built while you sleep. This guide covers everything from sleep quality to cortisol management for optimal recovery.",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "#",
    tag: "Training",
    date: "Feb 15, 2025",
    title: "Bodyweight vs Weights: What's Better for Beginners?",
    excerpt: "If you're just starting out, the equipment debate is irrelevant — consistency is what matters. But understanding the tradeoffs will help you make smarter choices.",
    readTime: "5 min read",
    featured: false,
  },
];

const tagColors: Record<string, string> = {
  "AI & Tech": "bg-blue-500/20 text-blue-400",
  "Training": "bg-primary/20 text-primary",
  "Nutrition": "bg-green-500/20 text-green-400",
  "Habits": "bg-orange-500/20 text-orange-400",
  "Recovery": "bg-purple-500/20 text-purple-400",
};

export default function BlogPage() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <main className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-5xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-6">
          <ZapIcon className="w-3 h-3" /> BLOG
        </div>
        <h1 className="text-4xl font-bold font-mono mb-4">
          Fitness <span className="text-primary">Insights</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Training tips, nutrition science, AI features, and everything you need to level up your fitness journey.
        </p>
      </div>

      {/* Featured Post */}
      {featured && (
        <Link href={featured.slug} className="block mb-10 group">
          <div className="relative border border-primary/40 rounded-none p-8 overflow-hidden hover:border-primary transition-colors">
            <CornerElements />
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-2 py-0.5 rounded-sm text-xs font-mono ${tagColors[featured.tag] ?? "bg-muted text-muted-foreground"}`}>
                {featured.tag}
              </span>
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-sm">FEATURED</span>
            </div>
            <h2 className="text-2xl font-bold font-mono mb-3 group-hover:text-primary transition-colors">
              {featured.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" /> {featured.date}
              </span>
              <span>{featured.readTime}</span>
            </div>
          </div>
        </Link>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rest.map((post) => (
          <Link key={post.title} href={post.slug} className="group block">
            <div className="relative border border-border rounded-none p-6 overflow-hidden hover:border-primary/60 transition-colors h-full flex flex-col">
              <CornerElements />
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-sm text-xs font-mono ${tagColors[post.tag] ?? "bg-muted text-muted-foreground"}`}>
                  <TagIcon className="w-2.5 h-2.5 inline mr-1" />
                  {post.tag}
                </span>
              </div>
              <h3 className="font-bold font-mono mb-2 group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mt-auto">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" /> {post.date}
                </span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
