"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CornerElements from "@/components/CornerElements";
import Vapi from "@vapi-ai/web";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatDate } from "date-fns";

type ChatMessage = { role: "assistant" | "user"; content: string };

const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

export default function GenerateProgramPage() {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user, isLoaded } = useUser();
  const router = useRouter();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Hold Vapi instance
  const vapiRef = useRef<Vapi | null>(null);

  const createPlan = useMutation(api.plans.createPlan);
  const planSavedRef = useRef(false);
  const savedRef = useRef(false);


  if (!vapiRef.current && publicKey) {
    vapiRef.current = new Vapi(publicKey);
  }

  const fullName = useMemo(() => {
    const first = user?.firstName?.trim();
    return first || "there";
  }, [user?.firstName]);

  // Auto-scroll messages
  useEffect(() => {
    const el = messageContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Redirect after call ends
  useEffect(() => {
    if (!callEnded) return;
    const t = setTimeout(() => router.push("/profile"), 1500);
    return () => clearTimeout(t);
  }, [callEnded, router]);

  // Init Vapi + event listeners once
  useEffect(() => {
    if (!publicKey) {
      console.error("Missing NEXT_PUBLIC_VAPI_PUBLIC_KEY");
      return;
    }

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    const handleCallStart = () => {
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = () => {
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => setIsSpeaking(false);

    const handleMessage = async (message: any) => {
      // 1) Tool calls
      if (message?.type === "model-output") {
        const item = message.output?.[0];
        if (item?.type === "function" && item?.function?.name === "createFitnessPlan") {
          if (savedRef.current) return;

          const raw = item.function.arguments; // <-- string
          let plan: any;


          try {
            plan = JSON.parse(raw);
          } catch (e) {
            console.error("Failed to parse plan JSON:", raw);
            return;
          }

          // OPTIONAL: normalize to satisfy Convex schema (see Fix 2)
          savedRef.current = true;
          try {
            await createPlan({
              userId: user?.id ?? "",
              name: `PLAN - ${formatDate(Date.now(), "dd/MM/yyyy")}`,
              workoutPlan: plan.workoutPlan,
              dietPlan: plan.dietPlan,
              isActive: true,
            });
            console.log("Saved to Convex");
          } catch (e) {
            savedRef.current = false;
            console.error("Convex insert failed:", e);
          }
          return;
        }
      }

      if (message?.type === "tool-calls") {
        for (const tc of message.toolCallList ?? []) {
          const fnName = tc?.function?.name;
          if (fnName !== "createFitnessPlan") continue;

          const maybeArgs = tc?.function?.arguments;
          const maybeResult = tc?.result ?? tc?.function?.result;

          const plan = maybeResult ?? maybeArgs;
          console.log("VAPI PLAN:", plan);

          if (!plan || planSavedRef.current) return;

          // plan must be { workoutPlan, dietPlan }
          // Build args for Convex createPlan (your mutation requires more fields)
          const userId = user?.id ?? "";
          const name = `${fullName}'s plan`;
          const isActive = true;

          try {
            planSavedRef.current = true;

            await createPlan({
              userId,
              name,
              workoutPlan: plan.workoutPlan,
              dietPlan: plan.dietPlan,
              isActive,
            });

            console.log("Plan saved to DB");
          } catch (e) {
            planSavedRef.current = false;
            console.error("Failed to save plan:", e);
          }
        }
        return;
      }

      // 2) Transcripts
      if (message?.type === "transcript") {
        if (message.role === "user") {
          if (message.transcriptType === "partial") {
            setUserIsSpeaking(true);
          } else if (message.transcriptType === "final") {
            setUserIsSpeaking(false);
          }
        }

        if (message?.transcriptType === "final") {
          setMessages((prev) => [
            ...prev,
            { role: message.role, content: message.transcript },
          ]);
        }
      }
    };

    const handleError = (error: any) => {
      console.error("Vapi error:", error);
      setConnecting(false);
      setCallActive(false);
      setIsSpeaking(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);

      // Ensure we stop any active call on unmount
      try {
        vapi.stop();
      } catch { }
      vapiRef.current = null;
    };
  }, []);

  const startCall = useCallback(async () => {
    if (!assistantId) throw new Error("Missing NEXT_PUBLIC_VAPI_ASSISTANT_ID");
    const vapi = vapiRef.current;
    if (!vapi) throw new Error("Vapi not initialized");

    setConnecting(true);
    setMessages([]);
    setCallEnded(false);

    await vapi.start(assistantId, {

      variableValues: {
        full_name: fullName, // used by: Hello, {{full_name}}
        user_id: user?.id ?? "",
      },

    });
  }, [fullName, user?.id]);

  const endCall = useCallback(() => {
    const vapi = vapiRef.current;
    if (!vapi) return;
    vapi.stop();
  }, []);

  const toggleCall = useCallback(async () => {
    if (connecting || callEnded) return;

    if (callActive) {
      endCall();
      return;
    }

    // Optional: wait for Clerk user to load so the name is available
    if (!isLoaded) return;

    try {
      await startCall();
    } catch (err) {
      console.error("Failed to start call:", err);
      setConnecting(false);
    }
  }, [callActive, callEnded, connecting, endCall, isLoaded, startCall]);

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Generate Your </span>
            <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Have a voice conversation with our AI assistant to create your personalized plan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative rounded-md">
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              <div
                className={`absolute inset-0 ${isSpeaking ? "opacity-30" : "opacity-0"
                  } transition-opacity duration-300`}
              >
                <div className="absolute left-1/4 top-1/3 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${isSpeaking ? "animate-sound-wave" : ""
                        }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <div className="absolute right-1/4 top-1/3 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${isSpeaking ? "animate-sound-wave-reverse" : ""
                        }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative size-32 mb-4">
                <div
                  className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${isSpeaking ? "animate-pulse" : ""
                    }`}
                />
                <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-secondary/10" />
                  <img src="/beymax.png" alt="AI Assistant" className="w-full h-full object-cover" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground">Fitmax AI</h2>
              <p className="text-sm text-muted-foreground mt-1">Fitness & Diet Coach</p>

              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${isSpeaking ? "border-primary" : ""
                  }`}
              >
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-primary animate-pulse" : "bg-muted"}`} />
                <span className="text-xs text-muted-foreground">
                  {isSpeaking
                    ? "Speaking..."
                    : callActive
                      ? "Listening..."
                      : callEnded
                        ? "Redirecting to profile..."
                        : "Waiting..."}
                </span>
              </div>
            </div>
          </Card>

          <Card className="bg-card/90 backdrop-blur-sm border overflow-hidden relative rounded-md">
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* User Voice Animation */}
              <div
                className={`absolute inset-0 ${userIsSpeaking ? "opacity-30" : "opacity-0"
                  } transition-opacity duration-300`}
              >
                <div className="absolute left-1/4 top-1/3 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${userIsSpeaking ? "animate-sound-wave" : ""
                        }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <div className="absolute right-1/4 top-1/3 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${userIsSpeaking ? "animate-sound-wave-reverse" : ""
                        }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative size-32 mb-4">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="User"
                    className="size-full object-cover rounded-full"
                  />
                ) : (
                  <div className="size-full rounded-full bg-muted" />
                )}
              </div>

              <h2 className="text-xl font-bold text-foreground">You</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user ? fullName : "Guest"}
              </p>

              <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border ${userIsSpeaking ? "border-primary" : ""}`}>
                <div className={`w-2 h-2 rounded-full ${userIsSpeaking ? "bg-primary animate-pulse" : "bg-muted"}`} />
                <span className="text-xs text-muted-foreground">
                  {userIsSpeaking ? "Speaking..." : "Ready"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-md p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth relative"
          >
            <div className="space-y-3 relative z-10">
              {messages.map((msg, index) => (
                <div key={index} className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    {msg.role === "assistant" ? "Fitmax AI" : "You"}:
                  </div>
                  <p className="text-foreground">{msg.content}</p>
                </div>
              ))}

              {callEnded && (
                <div className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-primary mb-1">System:</div>
                  <p className="text-foreground">
                    Your fitness program has been created! Redirecting to your profile...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="w-full flex justify-center gap-4">
          <Button
            className={`text-xl py-6 px-8 transition-all duration-200 rounded-md ${callActive
              ? "bg-destructive hover:bg-destructive/90"
              : callEnded
                ? "bg-green-600 hover:bg-green-700"
                : "bg-primary hover:bg-primary/90"
              } text-white relative`}
            onClick={toggleCall}
            disabled={connecting || callEnded || !publicKey || !assistantId}
          >
            {connecting ? "Connecting..." : callActive ? "End Call" : callEnded ? "View Profile" : "Start Call"}
          </Button>
        </div>
      </div>
    </div>
  );
}