import CornerElements from "@/components/CornerElements";
import { ZapIcon, ChevronDownIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Help Center — Fitmax.ai",
  description: "Find answers to common questions about using Fitmax.ai, from generating plans to tracking workouts.",
};

const categories = [
  {
    title: "Getting Started",
    faqs: [
      {
        q: "How do I generate my first fitness plan?",
        a: "Navigate to the Generate Program page from the top navigation. Click 'Start Call' to begin a voice session with our AI coach. Answer its questions about your goals, fitness level, and schedule. The AI will generate a custom workout and diet plan, which you can find on your Profile page.",
      },
      {
        q: "Do I need to create an account?",
        a: "Yes, an account is required to save your fitness plans and workout history. Sign up using the buttons in the top navigation — signup is free and takes under a minute via email or social login.",
      },
      {
        q: "Is Fitmax.ai free to use?",
        a: "Yes! Fitmax.ai is completely free to use for generating plans and tracking your workouts. We may introduce optional premium features in the future.",
      },
    ],
  },
  {
    title: "Workout Tracking",
    faqs: [
      {
        q: "How do I log a workout?",
        a: "Go to the Routine page and select either Simple, Explore, or Custom tab. In Simple, you'll find pushups, cardio, weightlifts, crunches, and squats. Log your sets and reps, then press 'LOG ROUTINE' to save to your history.",
      },
      {
        q: "What are Custom exercises?",
        a: "The Custom tab lets you add exercises from the ExerciseDB library (10,000+ exercises). Browse by body part or muscle, select any exercise, and add it to your tracked list. Custom exercises persist permanently until you remove them.",
      },
      {
        q: "Can I delete a logged workout?",
        a: "Currently, individual workout logs cannot be deleted from the UI. However, you can remove a custom exercise (which cascades deletes all its associated history) via the trash icon on the Custom tab.",
      },
      {
        q: "Why does my streak reset?",
        a: "Your streak counts consecutive days you've logged at least one workout. If you miss a day, the streak resets to 0. The streak calendar on your Profile shows your full history.",
      },
    ],
  },
  {
    title: "AI Voice Sessions",
    faqs: [
      {
        q: "Why does the call button stay on 'Connecting'?",
        a: "This usually means your microphone isn't accessible. On a browser, make sure you've granted microphone permission when prompted. On Android, the app needs RECORD_AUDIO permission — go to your phone's Settings → Apps → Fitmax → Permissions and enable Microphone.",
      },
      {
        q: "The AI doesn't seem to hear me — what do I do?",
        a: "Ensure your microphone is not muted at the device level. Try speaking clearly and reduce background noise. On mobile, make sure no other app is using the microphone. If the issue persists, end the call and try again.",
      },
      {
        q: "My plan wasn't saved after the call — what happened?",
        a: "The plan is saved automatically when the AI calls the 'createFitnessPlan' function near the end of the conversation. If the call was interrupted before the AI finished, the plan may not have been generated. Try starting a new session and completing the full conversation.",
      },
    ],
  },
  {
    title: "Account & Data",
    faqs: [
      {
        q: "How do I delete my account?",
        a: "Account deletion is not yet available self-serve. Please contact us at support@fitmax.ai with the subject 'Account Deletion Request' and we will remove your account and all associated data within 72 hours.",
      },
      {
        q: "Where is my data stored?",
        a: "Your workout and plan data is stored in Convex, a real-time cloud database. Authentication is handled by Clerk. See our Privacy Policy for full details.",
      },
      {
        q: "Can I export my workout data?",
        a: "Data export is on our roadmap. For now, you can view all your history in the Analytics section of the Routine page. Contact us if you need a data dump urgently.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-6">
          <ZapIcon className="w-3 h-3" /> HELP CENTER
        </div>
        <h1 className="text-4xl font-bold font-mono mb-4">
          How Can We <span className="text-primary">Help?</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Find answers to the most common questions about Fitmax.ai. Can&apos;t find what you need? {" "}
          <Link href="/contact" className="text-primary hover:underline">Contact us →</Link>
        </p>
      </div>

      <div className="space-y-10">
        {categories.map((category) => (
          <div key={category.title}>
            <h2 className="text-xl font-bold font-mono mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              {category.title}
            </h2>
            <div className="space-y-3">
              {category.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group relative border border-border rounded-none overflow-hidden"
                >
                  <CornerElements />
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-sm hover:bg-primary/5 transition-colors list-none select-none">
                    <span>{faq.q}</span>
                    <ChevronDownIcon className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Still need help? */}
      <div className="relative border border-primary/30 rounded-none p-8 mt-12 text-center overflow-hidden bg-primary/5">
        <CornerElements />
        <h3 className="text-xl font-bold font-mono mb-2">Still need help?</h3>
        <p className="text-muted-foreground text-sm mb-5">
          Our team typically responds within 24 hours on business days.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono font-semibold rounded-none hover:bg-primary/90 transition-colors"
        >
          Contact Support →
        </Link>
      </div>
    </main>
  );
}
