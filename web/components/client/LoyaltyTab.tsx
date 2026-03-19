"use client";

import { useLoyaltyAccount } from "@/hooks/useApi";
import { webFeatureService } from "@/lib/api";
import {
  Award,
  Copy,
  Gift,
  Loader2,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

const TIER_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  BRONZE: { bg: "from-amber-700 to-amber-900", text: "text-amber-100", badge: "bg-amber-600" },
  SILVER: { bg: "from-gray-400 to-gray-600", text: "text-gray-100", badge: "bg-gray-500" },
  GOLD: { bg: "from-yellow-400 to-yellow-600", text: "text-yellow-50", badge: "bg-yellow-500" },
  PLATINUM: { bg: "from-indigo-500 to-purple-700", text: "text-purple-50", badge: "bg-purple-600" },
};

const TIER_THRESHOLDS = [
  { tier: "BRONZE", min: 0, label: "Bronze" },
  { tier: "SILVER", min: 2000, label: "Silver" },
  { tier: "GOLD", min: 10000, label: "Gold" },
  { tier: "PLATINUM", min: 50000, label: "Platinum" },
];

export default function LoyaltyTab() {
  const { data: account, loading, refetch } = useLoyaltyAccount();
  const [referralCode, setReferralCode] = useState("");
  const [redeemPoints, setRedeemPoints] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-(--color-primary)" size={32} />
      </div>
    );
  }

  const tier = account?.tier || "BRONZE";
  const colors = TIER_COLORS[tier] || TIER_COLORS.BRONZE;
  const nextTier = TIER_THRESHOLDS.find((t) => t.min > (account?.lifetimePoints || 0));
  const currentTierInfo = TIER_THRESHOLDS.find((t) => t.tier === tier);
  const progressToNext = nextTier
    ? Math.min(100, ((account?.lifetimePoints || 0) - (currentTierInfo?.min || 0)) / (nextTier.min - (currentTierInfo?.min || 0)) * 100)
    : 100;

  const handleApplyReferral = async () => {
    if (!referralCode.trim()) return;
    const res = await webFeatureService.applyReferralCode(referralCode.trim());
    setMessage(res.success ? "🎉 " + (res.message || "Referral applied!") : res.error || "Failed");
    if (res.success) { setReferralCode(""); refetch(); }
  };

  const handleRedeem = async () => {
    const pts = parseInt(redeemPoints);
    if (!pts || pts < 100) return setMessage("Minimum 100 points to redeem");
    const res = await webFeatureService.redeemPoints(pts, "Points redemption");
    setMessage(res.success ? `✅ ${pts} points redeemed!` : res.error || "Failed");
    if (res.success) { setRedeemPoints(""); refetch(); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(account?.referralCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Loyalty & <span className="text-(--color-secondary)">Rewards</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Earn points on every booking. Redeem for discounts.</p>
      </div>

      {/* Tier Card */}
      <div className={`bg-linear-to-br ${colors.bg} rounded-2xl p-6 ${colors.text} relative overflow-hidden`}>
        <div className="absolute top-4 right-4 opacity-10">
          <Trophy size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`${colors.badge} p-2 rounded-lg`}>
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm opacity-80">Current Tier</p>
              <h2 className="text-2xl font-bold">{tier}</h2>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm opacity-70">Available</p>
              <p className="text-2xl font-bold">{(account?.availablePoints || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Lifetime</p>
              <p className="text-2xl font-bold">{(account?.lifetimePoints || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Referrals</p>
              <p className="text-2xl font-bold">{account?.totalReferrals || 0}</p>
            </div>
          </div>
          {nextTier && (
            <div>
              <div className="flex justify-between text-xs mb-1 opacity-80">
                <span>{currentTierInfo?.label}</span>
                <span>{nextTier.label} — {nextTier.min.toLocaleString()} pts</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/80 rounded-full transition-all"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm">
          {message}
        </div>
      )}

      {/* Actions Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Referral Code */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-(--color-primary)" />
            <h3 className="font-semibold text-gray-900">Your Referral Code</h3>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-gray-100 px-4 py-2.5 rounded-lg font-mono text-sm text-gray-800">
              {account?.referralCode || "—"}
            </code>
            <button
              onClick={copyCode}
              className="px-3 py-2.5 bg-(--color-primary) text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
            >
              <Copy size={14} /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-500">Share your code — you both earn 500 bonus points!</p>
        </div>

        {/* Apply Referral */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-(--color-secondary)" />
            <h3 className="font-semibold text-gray-900">Have a Referral Code?</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
            <button
              onClick={handleApplyReferral}
              className="px-4 py-2.5 bg-(--color-secondary) text-white rounded-lg text-sm font-semibold hover:opacity-90"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Redeem Points */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-500" />
            <h3 className="font-semibold text-gray-900">Redeem Points</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(e.target.value)}
              placeholder="Points (min 100)"
              min={100}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
            <button
              onClick={handleRedeem}
              className="px-4 py-2.5 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:opacity-90"
            >
              Redeem
            </button>
          </div>
          <p className="text-xs text-gray-500">100 points = ₦100 discount on your next booking</p>
        </div>

        {/* How to Earn */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-(--color-primary)" />
            <h3 className="font-semibold text-gray-900">How to Earn</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between"><span>Complete a booking</span><span className="font-semibold text-(--color-primary)">+100 pts</span></li>
            <li className="flex justify-between"><span>Leave a review</span><span className="font-semibold text-(--color-primary)">+50 pts</span></li>
            <li className="flex justify-between"><span>Purchase a product</span><span className="font-semibold text-(--color-primary)">+25 pts</span></li>
            <li className="flex justify-between"><span>Refer a friend</span><span className="font-semibold text-(--color-primary)">+500 pts</span></li>
          </ul>
        </div>
      </div>

      {/* Transaction History */}
      {account?.transactions && account.transactions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="divide-y divide-gray-100">
            {account.transactions.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                  <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-sm font-bold ${tx.points > 0 ? "text-green-500" : "text-red-500"}`}>
                  {tx.points > 0 ? "+" : ""}{tx.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
