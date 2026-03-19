"use client";

import { useMaintenancePlans, useSubscriptions, webMaintenanceService } from "@/hooks/useApi";
import {
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Loader2,
  Shield,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";

const INTERVAL_LABELS: Record<string, string> = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  BIANNUAL: "Every 6 Months",
  ANNUAL: "Annually",
};

export default function MaintenancePlansTab() {
  const { data: plans, loading: plansLoading } = useMaintenancePlans();
  const { data: subscriptions, loading: subsLoading, refetch: refetchSubs } = useSubscriptions();
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [activeView, setActiveView] = useState<"plans" | "subscriptions">("plans");

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId);
    const res = await webMaintenanceService.subscribe(planId);
    setMessage(res.success ? "✅ Subscribed successfully!" : res.error || "Failed");
    setSubscribing(null);
    if (res.success) {
      refetchSubs();
      setActiveView("subscriptions");
    }
  };

  const handleCancel = async (subId: string) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;
    const res = await webMaintenanceService.cancelSubscription(subId);
    setMessage(res.success ? "Subscription cancelled" : res.error || "Failed");
    if (res.success) refetchSubs();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Maintenance <span className="text-(--color-secondary)">Plans</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Protect your home with scheduled professional maintenance.</p>
      </div>

      {/* Tab Toggles */}
      <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
        {(["plans", "subscriptions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveView(tab)}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
              activeView === tab
                ? "bg-white shadow-sm text-(--color-primary)"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "plans" ? "Browse Plans" : `My Subscriptions (${subscriptions?.length || 0})`}
          </button>
        ))}
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          {message}
          <button onClick={() => setMessage("")}><X size={14} /></button>
        </div>
      )}

      {activeView === "plans" && (
        <>
          {plansLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-(--color-primary)" size={32} /></div>
          ) : !plans?.length ? (
            <div className="text-center py-16 text-gray-500">
              <Shield size={48} className="mx-auto mb-3 opacity-30" />
              <p>No maintenance plans available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {plans.map((plan: any, i: number) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden border-2 transition-all hover:shadow-lg ${
                    i === 1 ? "border-(--color-primary) relative" : "border-transparent"
                  }`}
                >
                  {i === 1 && (
                    <div className="absolute top-0 right-0 bg-(--color-primary) text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-(--color-primary)">₦{plan.price?.toLocaleString()}</span>
                      <span className="text-sm text-gray-400 ml-1">/{INTERVAL_LABELS[plan.interval]?.toLowerCase() || plan.interval}</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Wrench size={14} className="text-(--color-primary)" />
                        <span>{plan.includedVisits} included visits</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-(--color-primary)" />
                        <span>{INTERVAL_LABELS[plan.interval]} billing</span>
                      </div>
                      {(plan.features as string[])?.map((f: string, j: number) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check size={14} className="text-green-500" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={subscribing === plan.id}
                      className={`w-full mt-5 py-3 rounded-full text-sm font-semibold transition-all ${
                        i === 1
                          ? "bg-(--color-primary) text-white hover:opacity-90"
                          : "bg-gray-100 text-gray-700 hover:bg-(--color-primary) hover:text-white"
                      }`}
                    >
                      {subscribing === plan.id ? "Subscribing..." : "Subscribe Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeView === "subscriptions" && (
        <>
          {subsLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-(--color-primary)" size={32} /></div>
          ) : !subscriptions?.length ? (
            <div className="text-center py-16 text-gray-500">
              <Clock size={48} className="mx-auto mb-3 opacity-30" />
              <p>No subscriptions yet.</p>
              <button
                onClick={() => setActiveView("plans")}
                className="mt-3 text-(--color-primary) text-sm font-semibold hover:underline"
              >
                Browse Plans →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((sub: any) => (
                <div key={sub.id} className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        sub.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        <Shield size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Plan Subscription</h4>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          sub.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                          sub.status === "PAUSED" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-500"
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                    </div>
                    {sub.status === "ACTIVE" && (
                      <button
                        onClick={() => handleCancel(sub.id)}
                        className="text-red-500 text-xs font-semibold hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Next Billing</p>
                      <p className="font-medium text-gray-700">{sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Visits Used</p>
                      <p className="font-medium text-gray-700">{sub.visitsUsed}/{sub.visitsUsed + sub.visitsRemaining}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Remaining</p>
                      <p className="font-medium text-(--color-primary)">{sub.visitsRemaining}</p>
                    </div>
                  </div>
                  {sub.scheduledVisits?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-2">Upcoming Visits</p>
                      {sub.scheduledVisits.slice(0, 3).map((v: any) => (
                        <div key={v.id} className="flex items-center gap-2 text-sm text-gray-600 py-1">
                          <ChevronRight size={12} className="text-(--color-primary)" />
                          <span>{v.serviceType} — {new Date(v.scheduledDate).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
