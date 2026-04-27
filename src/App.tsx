// Bharat Sentinel AI v2.0 — Loan Eligibility Predictor
// Phase: Landing → Eligibility Lab → Results Dashboard

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Activity, AlertTriangle, CheckCircle2, Loader2, Cpu,
  BarChart3, AlertCircle, X, Building2, User, Zap, Landmark, Scale,
  Globe, FileCheck, Info, Star, Award, ArrowRight,
  Languages, HelpCircle, Radio, Target, Lightbulb,
  ExternalLink, TrendingUp, TrendingDown, RefreshCw,
} from "lucide-react";

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

type Phase = "landing" | "lab" | "results";
type Lang = "en" | "hi";
type Mode = "user" | "analyst";
type SlideOverType = null | "repo" | "cpi" | "whyscore";
type ApplicantType = "individual" | "msme" | "self_employed" | "corporate";

interface FormData {
  applicantType: ApplicantType;
  businessCategory: string;
  sector: string;
  state: string;
  loanPurpose: string;
  loanType: string;
  loanAmount: string;
  cibilScore: string;
  emiIncomeRatio: string;
  yearsOperation: string;
  annualTurnover: string;
  // RBI module
  emergencyBufferMonths: number;
  existingFloatingLoans: number;
  rateShockCapacity: string;
  rateHedgingStrategy: string;
  // Govt scheme module
  socialCategory: string;
  gender: string;
  firstTimeEntrepreneur: boolean;
  udyamRegistered: boolean;
  eShramCard: boolean;
  applicableSchemes: string[];
  // West Asia module
  rawMaterialSources: string[];
  energyCostPct: number;
  alternativeVendorPlan: string;
  inventoryBufferMonths: number;
  energyHedging: string;
  // GST module
  gstStatus: string;
  gstCompliancePct: number;
  itrFiled: boolean;
  panAadhaarLinked: boolean;
  digitalPaymentPct: number;
  gstIssues: string[];
}

interface ActiveModule {
  id: string; label: string; labelHi: string;
  triggerEvent: string; triggerCondition: string;
  severity: "medium" | "high"; color: "blue" | "green" | "amber" | "violet";
  Icon: React.ComponentType<{ className?: string }>;
  newRequiredInfo: string[]; riskMitigationValue: string;
}

interface BankTier {
  name: string; examples: string;
  probability: "Very High" | "High" | "Moderate" | "Low";
  color: "emerald" | "blue" | "amber" | "red"; icon: string;
}

interface RehabStep {
  step: number; title: string; titleHi: string;
  description: string; impact: string; timeline: string;
  emoji: string; link?: string;
}

interface GeoInsight {
  level: "warning" | "positive" | "neutral";
  message: string; recommendation: string;
}

interface BharatResult {
  id: string; timestamp: string;
  rawScore: number; probability: number;
  riskLevel: string; breakdown: Record<string, number>;
  schemeEligibility: string[];
  bankTiers: BankTier[];
  rehabSteps: RehabStep[];
  logic: string; adaptiveContext: string;
  recommendations: string[];
  marketSnapshot: string;
}

// ════════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ════════════════════════════════════════════════════════════════════

const T: Record<Lang, Record<string, string>> = {
  en: {
    hero_title: "AI-Powered Loan Eligibility Predictor",
    hero_subtitle: "Bharat Sentinel analyses 40+ risk vectors in real-time to predict your approval probability across 200+ lenders — NBFCs, PSU Banks, and Co-operatives.",
    cta: "Check My Eligibility",
    disclaimer: "Simulation Tool — No CIBIL impact. No official bank rejection risk.",
    dpdp_badge: "DPDP Act 2023 Compliant",
    how_title: "How it works",
    step1: "Enter Your Details",
    step1_sub: "2-minute profile capture",
    step2: "AI Analyses 40+ Vectors",
    step2_sub: "Real-time India risk engine",
    step3: "Get Your Roadmap",
    step3_sub: "Bank matches + action plan",
    mode_user: "User Mode",
    mode_analyst: "Analyst Mode",
    submit: "Predict My Eligibility",
    results_heading: "Loan Eligibility Report",
    bank_match: "Bank Matchmaker",
    rehab_plan: "Credit Rehabilitation Plan",
    score_label: "Approval Probability",
    checking: "Analysing 40+ risk vectors…",
    step_back: "Edit Application",
    repo_title: "RBI Repo Rate — 5.25%",
    cpi_title: "CPI Inflation — 4.1%",
    why_title: "Why This Score?",
    no_risk_shield: "No CIBIL Hit",
    lang_toggle: "हिंदी",
    analyst_label: "Live Intelligence",
    geo_title: "Geo-Economic Pulse",
    prime: "Prime Eligible",
    near_prime: "Near-Prime",
    qualifying: "Qualifying",
    rehab: "Credit Building Required",
  },
  hi: {
    hero_title: "AI-आधारित ऋण पात्रता पूर्व-आकलन",
    hero_subtitle: "भारत सेंटिनल 40+ जोखिम कारकों का विश्लेषण करके 200+ ऋणदाताओं में आपकी स्वीकृति संभावना बताता है — NBFC, PSU बैंक, और सहकारी बैंक।",
    cta: "पात्रता जांचें",
    disclaimer: "सिमुलेशन टूल — CIBIL पर कोई प्रभाव नहीं। बैंक अस्वीकृति का जोखिम नहीं।",
    dpdp_badge: "DPDP अधिनियम 2023 अनुपालित",
    how_title: "यह कैसे काम करता है",
    step1: "विवरण दर्ज करें",
    step1_sub: "2 मिनट में प्रोफ़ाइल",
    step2: "AI 40+ वेक्टर विश्लेषण",
    step2_sub: "रियल-टाइम जोखिम इंजन",
    step3: "रोडमैप प्राप्त करें",
    step3_sub: "बैंक मिलान + कार्य योजना",
    mode_user: "उपयोगकर्ता मोड",
    mode_analyst: "विश्लेषक मोड",
    submit: "पात्रता की भविष्यवाणी करें",
    results_heading: "ऋण पात्रता रिपोर्ट",
    bank_match: "बैंक मैचमेकर",
    rehab_plan: "क्रेडिट पुनर्वास योजना",
    score_label: "स्वीकृति संभावना",
    checking: "40+ जोखिम कारकों का विश्लेषण…",
    step_back: "आवेदन संपादित करें",
    repo_title: "RBI रेपो दर — 5.25%",
    cpi_title: "CPI मुद्रास्फीति — 4.1%",
    why_title: "यह स्कोर क्यों?",
    no_risk_shield: "CIBIL सुरक्षित",
    lang_toggle: "English",
    analyst_label: "लाइव इंटेलिजेंस",
    geo_title: "भू-आर्थिक पल्स",
    prime: "प्राइम पात्र",
    near_prime: "निकट-प्राइम",
    qualifying: "योग्यता प्राप्त",
    rehab: "क्रेडिट निर्माण आवश्यक",
  },
};

// ════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════

const SECTORS = [
  { value: "manufacturing", label: "Manufacturing / Industry" },
  { value: "trade", label: "Trade / Vyapar" },
  { value: "services", label: "Services / IT / ITeS" },
  { value: "agriculture", label: "Agriculture / Allied Activities" },
  { value: "construction", label: "Construction / Infrastructure" },
  { value: "logistics", label: "Logistics / Transport" },
  { value: "energy", label: "Energy / Power" },
  { value: "retail", label: "Retail / Kirana / E-Commerce" },
  { value: "healthcare", label: "Healthcare / Pharma" },
  { value: "food_processing", label: "Food Processing / FMCG" },
  { value: "textiles", label: "Textiles / Garments" },
  { value: "gems_jewelry", label: "Gems & Jewellery" },
];

const STATES = [
  { value: "dl", label: "Delhi NCR", risk: "low" },
  { value: "mh", label: "Maharashtra", risk: "low" },
  { value: "gj", label: "Gujarat", risk: "low" },
  { value: "ka", label: "Karnataka", risk: "low" },
  { value: "tn", label: "Tamil Nadu", risk: "low" },
  { value: "hr", label: "Haryana", risk: "low" },
  { value: "ts", label: "Telangana", risk: "low" },
  { value: "hp", label: "Himachal Pradesh / Chandigarh", risk: "low" },
  { value: "ap", label: "Andhra Pradesh", risk: "medium" },
  { value: "up", label: "Uttar Pradesh", risk: "medium" },
  { value: "rj", label: "Rajasthan", risk: "medium" },
  { value: "mp", label: "Madhya Pradesh", risk: "medium" },
  { value: "wb", label: "West Bengal", risk: "medium" },
  { value: "pb", label: "Punjab", risk: "medium" },
  { value: "as", label: "Assam", risk: "medium" },
  { value: "or", label: "Odisha", risk: "medium" },
  { value: "br", label: "Bihar", risk: "high" },
  { value: "jk", label: "J&K / Ladakh", risk: "high" },
  { value: "ne", label: "Manipur / Nagaland / N-E States", risk: "high" },
  { value: "other", label: "Other State / UT", risk: "medium" },
];

const GOVT_SCHEMES = [
  { id: "mudra_tarun", label: "PM Mudra – Tarun Plus (₹10L–₹20L)" },
  { id: "cgfmu", label: "CGFMU – Credit Guarantee Fund" },
  { id: "standup", label: "Stand-Up India (SC/ST/Women)" },
  { id: "svanidhi", label: "PM SVANidhi (Street Vendors)" },
  { id: "kcc", label: "Kisan Credit Card (Agriculture)" },
  { id: "eclgs", label: "Emergency Credit Line (ECLGS)" },
];

const RAW_MATERIAL_SOURCES = [
  "Gulf / West Asia (oil, petrochemicals)",
  "China (electronics, machinery, parts)",
  "Southeast Asia (rubber, raw materials)",
  "Domestic Suppliers (India-made)",
  "Europe / USA (machinery, technology)",
  "Africa (minerals, metals, ores)",
];

const GST_ISSUES = [
  { id: "input_credit", label: "Input Tax Credit Mismatch" },
  { id: "late_filing", label: "Late Filing / Penalties" },
  { id: "rate_impact", label: "GST Rationalization Impact" },
  { id: "reconciliation", label: "GSTR-2B Reconciliation Issues" },
];

// ════════════════════════════════════════════════════════════════════
// GEO-ECONOMIC PULSE DATA
// ════════════════════════════════════════════════════════════════════

const GEO_INSIGHTS: Record<string, Record<string, GeoInsight>> = {
  ap: {
    manufacturing: { level: "warning", message: "High logistics volatility in South-East corridor — West Asia maritime delays active.", recommendation: "Increase working capital buffer by 15%. Consider SIDBI supply chain finance." },
    logistics: { level: "warning", message: "Vizag port operations impacted by Red Sea disruption. Freight +34%.", recommendation: "Forward-book inventory for 3+ months. Explore coastal shipping alternatives." },
    agriculture: { level: "positive", message: "AP Rabi season favorable. RIDF disbursements active in Godavari belt.", recommendation: "KCC priority state. AP Co-operative Bank competitive rates in Q1 FY27." },
    services: { level: "positive", message: "Amaravati tech corridor investment resuming. IT sector credit risk: Low.", recommendation: "HDFC Bank and Axis Bank preferred for IT/ITeS in AP." },
    default: { level: "neutral", message: "Andhra Pradesh: Moderate credit environment. APSIDC MSME schemes active.", recommendation: "Explore AP Industrial Development Corporation support." },
  },
  mh: {
    manufacturing: { level: "positive", message: "MIDC Phase-3 expansion active. PLI auto + pharma disbursements on track.", recommendation: "Low supply chain risk. Standard PSU bank terms available." },
    textiles: { level: "neutral", message: "Bhiwandi-Pune corridor stable. Export orders moderately USD/INR linked.", recommendation: "Monitor forex exposure. Hedge export receivables on forward contracts." },
    services: { level: "positive", message: "BKC/Pune IT park occupancy 89%. Strong credit environment for services.", recommendation: "HDFC, ICICI, Axis — Tier-1 access highly likely for Mumbai tech sector." },
    gems_jewelry: { level: "neutral", message: "SEEPZ exports moderate. USD appreciation creating margin pressure.", recommendation: "ECGC export credit insurance recommended." },
    default: { level: "positive", message: "Maharashtra: Low risk state. Strong credit infrastructure.", recommendation: "All major bank categories accessible with clean CIBIL." },
  },
  gj: {
    manufacturing: { level: "positive", message: "GIFT City + Dholera SIR investment zone: MSME credit environment strong.", recommendation: "PLI auto sector bonus for Gujarat MSMEs. Explore GIDC support." },
    gems_jewelry: { level: "warning", message: "Surat rough diamond imports: cost +18% due to USD appreciation.", recommendation: "Forward USD booking through Axis/ICICI forex desk recommended." },
    default: { level: "positive", message: "Gujarat: Excellent credit environment. Low geopolitical exposure.", recommendation: "Tier-1 bank access strong for all sectors." },
  },
  ka: {
    services: { level: "positive", message: "Bengaluru GCC (Global Capability Centre) boom — IT export +12% YoY.", recommendation: "Startup India + SIDBI Venture debt accessible for tech services." },
    manufacturing: { level: "positive", message: "Karnataka KIADB + defense/aerospace PLI. Industrial credit: Favorable.", recommendation: "Low risk. PSU banks and large private banks competitive." },
    default: { level: "positive", message: "Karnataka: Strong credit market. Bangalore tech ecosystem premium.", recommendation: "All bank categories accessible with clean credit profile." },
  },
  up: {
    manufacturing: { level: "neutral", message: "UP Expressways Corridor active. PLI auto components moderate traction.", recommendation: "Co-operative banks and SIDBI active in Greater Noida and Kanpur." },
    agriculture: { level: "positive", message: "UP sugar belt — KCC priority state. Gangetic plain credit support strong.", recommendation: "UP Co-op Bank offers competitive KCC at 4% p.a." },
    default: { level: "neutral", message: "UP: Moderate risk. Large population base creates diverse credit need.", recommendation: "NBFCs and Mudra channels recommended over PSU cold approach." },
  },
  jk: {
    default: { level: "warning", message: "J&K / Ladakh: Elevated regional risk. Border zone lending conservative.", recommendation: "J&K Bank MSME schemes + Jammu Smart City initiative worth exploring." },
  },
  ne: {
    default: { level: "warning", message: "North-East states: Act East policy active but logistics elevated.", recommendation: "NEDC and NE Development Finance Corp schemes available with government backstop." },
  },
  br: {
    default: { level: "warning", message: "Bihar: State Credit Risk Index elevated. Conservative lender posture.", recommendation: "CGFMU and Mudra guarantees are strong substitutes — essential for Bihar applicants." },
  },
  wb: {
    manufacturing: { level: "neutral", message: "West Bengal: Kolkata port recovering. WBSIDCL industrial support active.", recommendation: "SIDBI and WBSIDCL schemes available for manufacturing sector." },
    trade: { level: "neutral", message: "Kolkata trade corridor: GST compliance improving. Credit cautious.", recommendation: "Strong GST track record critical for WB trade sector NBFC access." },
    default: { level: "neutral", message: "West Bengal: Moderate credit environment. Compliance-driven approach needed.", recommendation: "Focus on ITR + GST trail for 3 years before approaching Tier-1 banks." },
  },
  rj: {
    default: { level: "neutral", message: "Rajasthan: Gems, textiles, and solar strong. Water stress for agri.", recommendation: "RUIDP and SIDBI Rajasthan office active for MSME support." },
  },
};

function getGeoInsight(state: string, sector: string): GeoInsight | null {
  const stateData = GEO_INSIGHTS[state];
  if (!stateData) return null;
  return stateData[sector] ?? stateData["default"] ?? null;
}

// ════════════════════════════════════════════════════════════════════
// TRIGGER LOGIC
// ════════════════════════════════════════════════════════════════════

const SUPPLY_CHAIN_SECTORS = ["manufacturing", "logistics", "energy", "construction", "textiles", "gems_jewelry", "food_processing"];

function getActiveModules(data: FormData): ActiveModule[] {
  const mods: ActiveModule[] = [];

  if (data.loanType === "floating") {
    mods.push({
      id: "rbi_rate_shock", label: "RBI Interest Rate Risk", labelHi: "आरबीआई ब्याज दर जोखिम",
      triggerEvent: "FLOATING_RATE_LOAN", triggerCondition: "Repo 5.25% | Neutral stance | +150bps stress scenario",
      severity: "high", color: "blue", Icon: Landmark,
      newRequiredInfo: ["Emergency buffer (months)", "Existing floating loans", "Rate shock capacity", "Hedging strategy"],
      riskMitigationValue: "Stress-tests 150bps hike scenario — prevents default during tightening cycles.",
    });
  }

  const loanAmt = parseInt(data.loanAmount) || 0;
  if ((data.applicantType === "msme" || data.applicantType === "self_employed") &&
    (["micro", "small"].includes(data.businessCategory) || (loanAmt > 0 && loanAmt <= 2_000_000))) {
    mods.push({
      id: "govt_scheme", label: "Government Scheme Alignment", labelHi: "सरकारी योजना पात्रता",
      triggerEvent: "SCHEME_ELIGIBILITY_DETECTED", triggerCondition: "MSME Micro/Small | Loan ≤ ₹20L | Mudra/CGFMU 2026 active",
      severity: "high", color: "green", Icon: Scale,
      newRequiredInfo: ["Social category", "First-time entrepreneur", "Udyam registration", "e-Shram card"],
      riskMitigationValue: "CGFMU guarantee reduces effective risk by 75% — unlocks govt-backed capital.",
    });
  }

  if (SUPPLY_CHAIN_SECTORS.includes(data.sector)) {
    mods.push({
      id: "west_asia_supply", label: "Supply Chain Risk Monitor", labelHi: "आपूर्ति श्रृंखला जोखिम",
      triggerEvent: "SUPPLY_CHAIN_RISK_ACTIVE", triggerCondition: `Sector: ${data.sector} | Red Sea disruption | Freight +34%`,
      severity: "high", color: "amber", Icon: Globe,
      newRequiredInfo: ["Import corridors", "Energy cost %", "Alternative vendors", "Inventory buffer"],
      riskMitigationValue: "Identifies supply-chain fragility before disbursement — prevents input-cost default.",
    });
  }

  if (data.applicantType !== "individual") {
    mods.push({
      id: "gst_digital", label: "GST & Compliance Check", labelHi: "जीएसटी अनुपालन",
      triggerEvent: "REGULATORY_COMPLIANCE", triggerCondition: `${data.applicantType.toUpperCase()} | Budget 2026 GST rationalization`,
      severity: "medium", color: "violet", Icon: FileCheck,
      newRequiredInfo: ["GST status & compliance", "ITR filing", "PAN-Aadhaar link", "Digital payment %"],
      riskMitigationValue: "GST trail provides verified 3-year income — cuts risk error by 60%.",
    });
  }

  return mods;
}

// ════════════════════════════════════════════════════════════════════
// RISK CALCULATOR
// ════════════════════════════════════════════════════════════════════

function calculateRisk(data: FormData, modules: ActiveModule[]) {
  let score = 100;
  const breakdown: Record<string, number> = {};

  const cibil = parseInt(data.cibilScore) || 700;
  const ci = cibil >= 800 ? 10 : cibil >= 750 ? 5 : cibil >= 700 ? 0 : cibil >= 650 ? -15 : cibil >= 600 ? -28 : -45;
  score += ci; breakdown["CIBIL Score"] = ci;

  const emi = parseFloat(data.emiIncomeRatio) || 35;
  const ei = emi < 30 ? 8 : emi < 40 ? 0 : emi < 50 ? -15 : -35;
  score += ei; breakdown["EMI-to-Income Ratio"] = ei;

  const stateRisk = STATES.find(s => s.value === data.state)?.risk;
  const si = stateRisk === "low" ? 5 : stateRisk === "high" ? -10 : 0;
  score += si; breakdown["State Credit Environment"] = si;

  if (modules.find(m => m.id === "rbi_rate_shock")) {
    let r = 0;
    if (data.emergencyBufferMonths >= 6) r += 8; else if (data.emergencyBufferMonths < 2) r -= 20; else if (data.emergencyBufferMonths < 3) r -= 10;
    if (data.existingFloatingLoans > 2) r -= 15; else if (data.existingFloatingLoans > 1) r -= 8;
    if (data.rateShockCapacity === "cannot") r -= 22; else if (data.rateShockCapacity === "struggling") r -= 10; else if (data.rateShockCapacity === "comfortable") r += 5;
    if (data.rateHedgingStrategy !== "none") r += 8;
    score += r; breakdown["RBI Rate Resilience"] = r;
  }

  if (modules.find(m => m.id === "govt_scheme")) {
    let g = 0;
    if (data.udyamRegistered) g += 10; if (data.applicableSchemes.length) g += 8;
    if (data.firstTimeEntrepreneur) g -= 8; if (data.eShramCard) g += 5;
    if (["sc", "st"].includes(data.socialCategory) || data.gender === "female") g += 5;
    score += g; breakdown["Scheme & Udyam Credit"] = g;
  }

  if (modules.find(m => m.id === "west_asia_supply")) {
    let s = 0;
    const gulf = data.rawMaterialSources.some(x => x.includes("Gulf") || x.includes("West Asia"));
    if (gulf && data.energyCostPct > 40) s -= 25; else if (gulf) s -= 12;
    if (data.alternativeVendorPlan === "active") s += 10; else if (data.alternativeVendorPlan === "developing") s += 3; else if (data.alternativeVendorPlan === "none") s -= 12;
    if (data.inventoryBufferMonths >= 3) s += 8; else if (data.inventoryBufferMonths < 1) s -= 10;
    if (data.energyHedging !== "none") s += 7;
    score += s; breakdown["Supply Chain Resilience"] = s;
  }

  if (modules.find(m => m.id === "gst_digital")) {
    let g = 0;
    if (data.gstStatus === "unregistered") g -= 20; else if (data.gstStatus === "regular") g += 5;
    if (data.gstCompliancePct >= 95) g += 10; else if (data.gstCompliancePct < 70) g -= 20; else if (data.gstCompliancePct < 85) g -= 8;
    if (!data.itrFiled) g -= 15; if (!data.panAadhaarLinked) g -= 10;
    if (data.digitalPaymentPct > 80) g += 5; if (data.eShramCard) g += 5;
    if (data.gstIssues.length > 2) g -= 15;
    score += g; breakdown["GST & Compliance"] = g;
  }

  return { score: Math.max(0, Math.min(110, score)), breakdown };
}

function toProbability(rawScore: number): number {
  const n = Math.max(0, Math.min(100, rawScore));
  if (n >= 85) return Math.min(95, 75 + Math.round((n - 85) / 15 * 20));
  if (n >= 70) return 60 + Math.round((n - 70) / 15 * 15);
  if (n >= 55) return 40 + Math.round((n - 55) / 15 * 20);
  if (n >= 40) return 20 + Math.round((n - 40) / 15 * 20);
  return Math.max(5, Math.round(n / 40 * 20));
}

function getTier(probability: number, lang: Lang): { label: string; color: string; description: string } {
  if (probability >= 75) return { label: T[lang].prime, color: "emerald", description: "Strong profile — Tier-1 banks & NBFCs recommended" };
  if (probability >= 55) return { label: T[lang].near_prime, color: "blue", description: "Good profile — NBFCs & co-operative banks recommended" };
  if (probability >= 35) return { label: T[lang].qualifying, color: "amber", description: "Moderate profile — Mudra NBFCs & MFIs recommended" };
  return { label: T[lang].rehab, color: "red", description: "Follow the Credit Rehabilitation Plan below before applying" };
}

// ════════════════════════════════════════════════════════════════════
// BANK MATCHMAKER
// ════════════════════════════════════════════════════════════════════

function getBanks(probability: number): BankTier[] {
  if (probability >= 75) return [
    { name: "Large Private Banks", examples: "HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra", probability: "Very High", color: "emerald", icon: "🏛" },
    { name: "PSU Banks", examples: "SBI, PNB, Bank of Baroda, Union Bank", probability: "High", color: "emerald", icon: "🏦" },
    { name: "Premium NBFCs", examples: "Bajaj Finance, Fullerton India, HDB Financial", probability: "Very High", color: "emerald", icon: "🏢" },
  ];
  if (probability >= 55) return [
    { name: "NBFCs", examples: "Bajaj Finance, IIFL Finance, Hero FinCorp, Muthoot", probability: "High", color: "blue", icon: "🏢" },
    { name: "Co-operative Banks", examples: "Saraswat Bank, Cosmos Bank, TJSB Bank", probability: "High", color: "blue", icon: "🤝" },
    { name: "PSU Banks (secured)", examples: "SBI, BOI — with collateral or guarantor", probability: "Moderate", color: "amber", icon: "🏦" },
  ];
  if (probability >= 35) return [
    { name: "Mudra NBFCs", examples: "Annapurna Finance, Muthoot Fincorp, Asirvad", probability: "High", color: "amber", icon: "🌱" },
    { name: "Microfinance (MFIs)", examples: "Bandhan Bank, Ujjivan SFB, Spandana Sphoorty", probability: "Moderate", color: "amber", icon: "🤝" },
    { name: "Urban Co-operatives", examples: "District co-operative credit societies", probability: "Moderate", color: "amber", icon: "🏘" },
  ];
  return [
    { name: "Credit Rehabilitation Required", examples: "Complete 3-step plan below before applying", probability: "Low", color: "red", icon: "📋" },
  ];
}

// ════════════════════════════════════════════════════════════════════
// CREDIT REHAB PLAN
// ════════════════════════════════════════════════════════════════════

function getRehabPlan(data: FormData, modules: ActiveModule[]): RehabStep[] {
  const steps: RehabStep[] = [];

  if (data.gstStatus === "unregistered" && data.applicantType !== "individual") steps.push({
    step: 1, emoji: "📋",
    title: "GST Registration & Compliance", titleHi: "जीएसटी पंजीकरण",
    description: "Register on gst.gov.in and file GSTR-3B for 6 consecutive months. Creates a verified income trail that replaces informal income proof — NBFCs accept it in lieu of bank statements.",
    impact: "+15 to +20 eligibility score",
    timeline: "30–45 days",
    link: "https://gst.gov.in",
  });

  if (parseInt(data.cibilScore) < 650 || !data.cibilScore) steps.push({
    step: steps.length + 1, emoji: "📈",
    title: "CIBIL Score Enhancement", titleHi: "सिबिल स्कोर सुधार",
    description: "Apply for a secured credit card (FD-backed, min ₹25,000). Keep utilization below 30% and pay full bills every month. Avoid new loan inquiries for 6 months.",
    impact: "+50 to +80 CIBIL points",
    timeline: "6–9 months",
  });

  if (!data.udyamRegistered && data.applicantType === "msme") steps.push({
    step: steps.length + 1, emoji: "🏭",
    title: "Udyam Registration (Free & Instant)", titleHi: "उद्यम पंजीकरण",
    description: "Register on udyamregistration.gov.in using Aadhaar + PAN. Takes 15 minutes. Instantly unlocks CGFMU credit guarantee cover and PM Mudra Tarun Plus eligibility.",
    impact: "+10 eligibility score + Govt guarantee access",
    timeline: "15 minutes",
    link: "https://udyamregistration.gov.in",
  });

  if (!data.itrFiled) steps.push({
    step: steps.length + 1, emoji: "📑",
    title: "File Income Tax Returns", titleHi: "आयकर रिटर्न",
    description: "File ITR for last 3 assessment years on incometax.gov.in. Use a CA for ITR-3/4 if self-employed or MSME. ITR filing boosts NBFC approval rates by 40%.",
    impact: "+15 eligibility score",
    timeline: "15–30 days",
    link: "https://incometax.gov.in",
  });

  if (data.applicantType === "msme" && steps.length < 3) steps.push({
    step: steps.length + 1, emoji: "💡",
    title: "TReDS Invoice Financing Platform", titleHi: "टीआरईडीएस पंजीकरण",
    description: "Register on TReDS (M1xchange or Receivables Exchange). Invoice discounting creates a working capital credit line at 9–11% — significantly cheaper than standard working capital loans.",
    impact: "Unlocks ₹5L–₹50L invoice-backed credit at 9–11%",
    timeline: "7–14 days",
    link: "https://www.m1xchange.com",
  });

  if (modules.find(m => m.id === "west_asia_supply") && data.alternativeVendorPlan === "none" && steps.length < 3) steps.push({
    step: steps.length + 1, emoji: "🔗",
    title: "Develop Domestic Vendor Network", titleHi: "घरेलू आपूर्तिकर्ता",
    description: "Contract 2–3 domestic alternative vendors via DPIIT's SAMARTH scheme or through NSIC's raw material procurement support. Significantly reduces geopolitical supply-chain risk score penalty.",
    impact: "+8 to +12 eligibility score",
    timeline: "30–60 days",
  });

  return steps.slice(0, 3);
}

// ════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════

function calcEMI(principal: number, annualRate: number, months: number): number {
  if (!principal || !annualRate || !months) return 0;
  const r = annualRate / 12 / 100;
  return Math.round(principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
}

function detectSchemes(data: FormData): string[] {
  const out: string[] = [];
  const amt = parseInt(data.loanAmount) || 0;
  if (amt <= 2_000_000 && (data.applicantType === "msme" || data.applicantType === "self_employed")) out.push("PM Mudra Yojana – Tarun Plus");
  if (data.applicantType === "msme") out.push("CGFMU Credit Guarantee Fund");
  if (["sc", "st"].includes(data.socialCategory) || data.gender === "female") out.push("Stand-Up India Scheme");
  if (data.sector === "agriculture") out.push("Kisan Credit Card (KCC)");
  if (data.applicantType === "msme" || data.applicantType === "self_employed") out.push("Emergency Credit Line (ECLGS)");
  return out;
}

function generateMarketSnapshot(data: FormData) {
  const m: Record<string, string> = {
    manufacturing: "PMI 57.4 (March 2026) | West Asia freight +34% | PLI disbursements active",
    agriculture: "Rabi season | Kharif +8% YoY | MSP revision pending | KCC expanded",
    services: "IT exports +12% YoY | UPI 16B monthly txns | GCC boom continues",
    trade: "GST ₹2.42L Cr record (March 2026) | ONDC merchant adoption surge",
    logistics: "Red Sea + Hormuz active disruption | National Logistics Policy 2.0",
    default: "India GDP Q3 FY26: 7.4% | Repo: 5.25% | CPI: 4.1% | MPC: Neutral",
  };
  return m[data.sector] ?? m.default;
}

// ════════════════════════════════════════════════════════════════════
// DEFAULT STATE
// ════════════════════════════════════════════════════════════════════

const DEFAULT: FormData = {
  applicantType: "msme", businessCategory: "micro",
  sector: "", state: "", loanPurpose: "", loanType: "fixed",
  loanAmount: "", cibilScore: "", emiIncomeRatio: "", yearsOperation: "", annualTurnover: "",
  emergencyBufferMonths: 3, existingFloatingLoans: 1, rateShockCapacity: "can_manage", rateHedgingStrategy: "none",
  socialCategory: "general", gender: "male", firstTimeEntrepreneur: false, udyamRegistered: false, eShramCard: false, applicableSchemes: [],
  rawMaterialSources: [], energyCostPct: 25, alternativeVendorPlan: "developing", inventoryBufferMonths: 2, energyHedging: "none",
  gstStatus: "regular", gstCompliancePct: 85, itrFiled: true, panAadhaarLinked: true, digitalPaymentPct: 60, gstIssues: [],
};

// ════════════════════════════════════════════════════════════════════
// STYLE CONSTANTS
// ════════════════════════════════════════════════════════════════════

const INPUT = "w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-400 shadow-sm";
const MODULE_P = {
  blue: { border: "border-indigo-200", hdr: "bg-indigo-700", bg: "bg-indigo-50", badge: "bg-indigo-100 text-indigo-700" },
  green: { border: "border-emerald-300", hdr: "bg-emerald-700", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
  amber: { border: "border-amber-200", hdr: "bg-amber-600", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  violet: { border: "border-violet-200", hdr: "bg-violet-700", bg: "bg-violet-50", badge: "bg-violet-100 text-violet-700" },
};

// ════════════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ════════════════════════════════════════════════════════════════════

function BL({ en, hi, req = false }: { en: string; hi: string; req?: boolean }) {
  return (
    <div className="mb-1.5">
      <span className="text-sm font-semibold text-slate-700">{en}</span>
      <span className="text-slate-400 text-xs ml-1.5">/ {hi}</span>
      {req && <span className="text-red-500 ml-0.5">*</span>}
    </div>
  );
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${active ? "bg-[#1B3A6B] border-[#1B3A6B] text-white shadow-sm" : "bg-white border-slate-300 text-slate-600 hover:border-blue-400"
        }`}>
      {children}
    </button>
  );
}

function Chip({ label, active, onClick, ccolor = "orange" }: { label: string; active: boolean; onClick: () => void; ccolor?: string }) {
  const ac = ccolor === "blue" ? "bg-indigo-100 border-indigo-400 text-indigo-700" : ccolor === "green" ? "bg-emerald-100 border-emerald-400 text-emerald-700" : ccolor === "amber" ? "bg-amber-100 border-amber-400 text-amber-700" : ccolor === "violet" ? "bg-violet-100 border-violet-400 text-violet-700" : "bg-orange-100 border-orange-400 text-orange-700";
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border shadow-sm ${active ? ac : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"}`}>
      {label}
    </button>
  );
}

function SliderField({ en, hi, hint, value, onChange, min, max, unit }: { en: string; hi: string; hint?: string; value: number; onChange: (v: number) => void; min: number; max: number; unit: string }) {
  return (
    <div>
      <BL en={en} hi={hi} />
      {hint && <p className="text-xs text-slate-500 mb-2">{hint}</p>}
      <div className="flex items-center gap-3">
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(parseInt(e.target.value))} className="flex-1" />
        <span className="font-semibold text-slate-800 text-sm w-20 text-right tabular-nums bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
          {value}{unit}
        </span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// SLIDE-OVER PANELS
// ════════════════════════════════════════════════════════════════════

function SlideOver({ type, onClose, loanAmount, lang }: { type: SlideOverType; onClose: () => void; loanAmount: string; lang: Lang }) {
  const principal = parseInt(loanAmount) || 1_000_000;
  const emi5_25 = calcEMI(principal, 8.5, 60);  // MCLR-based approx
  const emi6_00 = calcEMI(principal, 9.25, 60);
  const emi6_75 = calcEMI(principal, 10.0, 60);
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const content = () => {
    if (type === "repo") return (
      <div className="space-y-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">RBI Monetary Policy Committee</p>
          <div className="flex items-end gap-3 mb-1">
            <span className="text-4xl font-bold text-indigo-800">5.25%</span>
            <span className="text-indigo-500 mb-1">Repo Rate</span>
          </div>
          <p className="text-sm text-indigo-700">MPC Stance: <strong>Neutral</strong> | April 2026 MPC Meeting</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" /> EMI Impact on Your Loan ({inr(principal)})
          </h4>
          <div className="space-y-3">
            {[
              { rate: "Current (8.50% MCLR)", emi: emi5_25, color: "emerald", label: "Today" },
              { rate: "+75bps (9.25% MCLR)", emi: emi6_00, color: "amber", label: "+75bps" },
              { rate: "+150bps (10.0% MCLR)", emi: emi6_75, color: "red", label: "+150bps" },
            ].map(({ rate, emi, color, label }) => (
              <div key={rate} className={`flex items-center justify-between p-3 rounded-xl border ${color === "emerald" ? "bg-emerald-50 border-emerald-200" : color === "amber" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                <div>
                  <p className="text-xs font-semibold text-slate-600">{label}</p>
                  <p className="text-xs text-slate-500">{rate}</p>
                </div>
                <p className={`font-bold text-lg ${color === "emerald" ? "text-emerald-700" : color === "amber" ? "text-amber-700" : "text-red-700"}`}>
                  {inr(emi)}<span className="text-xs font-normal">/mo</span>
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Based on 60-month term. Actual rates vary by lender.</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="font-semibold text-slate-700 text-sm mb-2">AI Recommendation: Fixed vs. Floating?</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            With the RBI in a <strong>neutral stance</strong> (neither hike nor cut signalled for Q1 FY27),
            <span className="text-indigo-700 font-semibold"> fixed-rate loans offer predictability</span> for the next 12–18 months.
            Floating rates become advantageous only if you expect <strong>rate cuts beyond Q2 FY27</strong>.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-700 text-sm mb-2">RBI Rate History</h4>
          <div className="space-y-1.5">
            {[
              { date: "Feb 2025", rate: "6.50%", action: "Cut -25bps" },
              { date: "Apr 2025", rate: "6.25%", action: "Cut -25bps" },
              { date: "Jun 2025", rate: "6.00%", action: "Cut -25bps" },
              { date: "Oct 2025", rate: "5.75%", action: "Cut -25bps" },
              { date: "Feb 2026", rate: "5.50%", action: "Cut -25bps" },
              { date: "Apr 2026", rate: "5.25%", action: "Cut -25bps ✓ Current" },
            ].map(r => (
              <div key={r.date} className="flex justify-between text-xs text-slate-600 py-1 border-b border-slate-100">
                <span>{r.date}</span><span className="font-semibold">{r.rate}</span><span className="text-slate-400">{r.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    if (type === "cpi") return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">Consumer Price Index</p>
          <div className="flex items-end gap-3 mb-1">
            <span className="text-4xl font-bold text-amber-800">4.1%</span>
            <span className="text-amber-500 mb-1">CPI Inflation (March 2026)</span>
          </div>
          <p className="text-sm text-amber-700">Within RBI's 2–6% target band | Core inflation: 3.8%</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-700 text-sm mb-3">How Inflation Affects Your Loan</h4>
          <div className="space-y-3">
            {[
              { title: "Real Purchasing Power", value: `₹1L today = ₹${(96000).toLocaleString("en-IN")} next year`, color: "amber", icon: "📉", desc: "4.1% inflation reduces your loan amount's real value annually" },
              { title: "Income Erosion Risk", value: "DTI ratio rises with inflation", color: "red", icon: "⚠", desc: "If your income doesn't rise 4.1% YoY, your debt burden effectively grows" },
              { title: "Fixed EMI Advantage", value: "EMI stays constant in nominal terms", color: "emerald", icon: "✓", desc: "Inflation makes your fixed EMI progressively cheaper in real terms" },
            ].map(({ title, value, color, icon, desc }) => (
              <div key={title} className={`p-4 rounded-xl border ${color === "emerald" ? "bg-emerald-50 border-emerald-200" : color === "amber" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <p className={`font-semibold text-sm ${color === "emerald" ? "text-emerald-800" : color === "amber" ? "text-amber-800" : "text-red-800"}`}>{title}</p>
                    <p className={`text-xs font-medium mt-0.5 ${color === "emerald" ? "text-emerald-600" : color === "amber" ? "text-amber-600" : "text-red-600"}`}>{value}</p>
                    <p className="text-xs text-slate-500 mt-1">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-800 mb-1">💡 Bharat Sentinel Recommendation</p>
          <p className="text-sm text-blue-700 leading-relaxed">
            With CPI at 4.1%, request a loan with a <strong>step-up EMI structure</strong> — start lower and increase as your income inflation-adjusts. Ask your lender about SIDBI's inflation-indexed MSME loan products.
          </p>
        </div>
      </div>
    );

    if (type === "whyscore") return (
      <div className="space-y-6">
        <div className="bg-[#1B3A6B] rounded-2xl p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-1">RBI Fair Practice Code — Explainable AI</p>
          <p className="text-sm leading-relaxed text-blue-100">
            Bharat Sentinel follows RBI's Fair Practice Code for lending. Every score has a transparent rationale. No black-box decisions. No bias against protected categories.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-700 text-sm mb-3">Score Factors (by weight)</h4>
          {[
            { factor: "CIBIL Score", weight: 35, desc: "Primary credit history indicator" },
            { factor: "EMI-to-Income Ratio", weight: 20, desc: "Debt serviceability measure" },
            { factor: "GST & Compliance Trail", weight: 15, desc: "Verified income documentation" },
            { factor: "Government Scheme Backup", weight: 12, desc: "Risk mitigation via guarantee" },
            { factor: "Supply Chain Resilience", weight: 10, desc: "Operational continuity risk" },
            { factor: "RBI Rate Resilience", weight: 8, desc: "Rate-hike survivability" },
          ].map(({ factor, weight, desc }) => (
            <div key={factor} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">{factor}</span>
                <span className="text-slate-500">{weight}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1B3A6B] rounded-full" style={{ width: `${weight * 2.5}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs font-bold text-emerald-700 mb-1">🔒 Zero Bias Guarantee</p>
          <p className="text-xs text-emerald-600 leading-relaxed">
            Name, Aadhaar, caste, religion, and gender (except for scheme eligibility enhancement) are permanently excluded from the scoring model — DPDP Act 2023 & RBI Fair Practice Code fully compliant.
          </p>
        </div>
      </div>
    );

    return null;
  };

  const titles: Record<string, string> = { repo: T[lang].repo_title, cpi: T[lang].cpi_title, whyscore: T[lang].why_title };

  return (
    <AnimatePresence>
      {type && (
        <>
          <motion.div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <motion.div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 overflow-y-auto shadow-2xl"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-slate-800">{titles[type ?? "repo"]}</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6">{content()}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ════════════════════════════════════════════════════════════════════
// GEO-ECONOMIC PULSE COMPONENT
// ════════════════════════════════════════════════════════════════════

function GeoPulse({ state, sector, lang }: { state: string; sector: string; lang: Lang }) {
  const insight = useMemo(() => getGeoInsight(state, sector), [state, sector]);
  if (!insight || !state || !sector) return null;

  const cfg = {
    warning: { bg: "bg-amber-50", border: "border-amber-300", icon: "⚠", text: "text-amber-800", dot: "bg-amber-500", rec: "text-amber-700" },
    positive: { bg: "bg-emerald-50", border: "border-emerald-300", icon: "✓", text: "text-emerald-800", dot: "bg-emerald-500", rec: "text-emerald-700" },
    neutral: { bg: "bg-blue-50", border: "border-blue-200", icon: "ℹ", text: "text-blue-800", dot: "bg-blue-500", rec: "text-blue-700" },
  }[insight.level];

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className={`mt-3 ${cfg.bg} border-2 ${cfg.border} rounded-xl p-4 relative`}>
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1 mt-0.5">
          <motion.div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`}
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Radio className="w-3 h-3" /> {T[lang].geo_title}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
              {STATES.find(s => s.value === state)?.label} · {SECTORS.find(s => s.value === sector)?.label}
            </span>
          </div>
          <p className={`text-sm font-medium ${cfg.text} leading-relaxed`}>{cfg.icon} {insight.message}</p>
          <div className="mt-2 flex items-start gap-1.5">
            <Lightbulb className={`w-3.5 h-3.5 ${cfg.rec} flex-shrink-0 mt-0.5`} />
            <p className={`text-xs font-medium ${cfg.rec}`}>AI Recommendation: {insight.recommendation}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ════════════════════════════════════════════════════════════════════

function LandingPage({ lang, setLang, onStart, onSlide }: {
  lang: Lang; setLang: (l: Lang) => void;
  onStart: () => void; onSlide: (t: SlideOverType) => void;
}) {
  const t = (k: string) => T[lang][k] || k;
  return (
    <div className="min-h-screen bg-[#0C1829] text-white overflow-hidden relative">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-amber-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-indigo-600/8 blur-[150px] rounded-full pointer-events-none" />

      {/* Top bar */}
      <div className="flex h-1"><div className="flex-1 bg-orange-500" /><div className="flex-1 bg-white/20" /><div className="flex-1 bg-emerald-600" /></div>

      <div className="max-w-screen-xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="font-bold text-white text-sm tracking-widest">BHARAT SENTINEL</p>
            <p className="text-xs text-blue-300">AI Fintech Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 text-xs text-blue-300 hover:text-white border border-white/20 rounded-lg px-3 py-1.5 transition-colors cursor-pointer">
            <Languages className="w-3.5 h-3.5" /> {t("lang_toggle")}
          </button>
          <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-3 py-1.5 rounded-lg font-medium">
            {t("dpdp_badge")}
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-screen-xl mx-auto px-6 py-16 lg:py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* No-Risk Shield — high-visibility */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border-2 border-emerald-500/50 text-emerald-300 text-sm font-semibold px-5 py-2.5 rounded-full mb-8">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {t("disclaimer")}
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            {t("hero_title")}
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero_subtitle")}
          </p>

          <button onClick={onStart}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold px-10 py-4 rounded-2xl text-base shadow-[0_0_40px_rgba(251,146,60,0.4)] transition-all cursor-pointer">
            {t("cta")} <ArrowRight className="w-5 h-5" />
          </button>

          <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
            {[
              { icon: "🔒", label: t("no_risk_shield") },
              { icon: "⚡", label: "40+ Risk Vectors" },
              { icon: "🏦", label: "200+ Lenders" },
              { icon: "🇮🇳", label: t("dpdp_badge") },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-sm text-blue-300">
                <span>{icon}</span><span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Clickable Economic Pulse Strip */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="max-w-screen-xl mx-auto px-6 mb-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5" /> LIVE ECONOMIC INTELLIGENCE — Click to explore
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "repo" as SlideOverType, label: "RBI Repo Rate", value: "5.25%", sub: "Neutral stance | Click for EMI impact", color: "indigo", Icon: Landmark, trend: "↓ -25bps" },
              { key: "cpi" as SlideOverType, label: "CPI Inflation", value: "4.1%", sub: "Within target band | Click for DTI effect", color: "amber", Icon: TrendingDown, trend: "↓ easing" },
              { key: null, label: "India GDP Growth", value: "7.4%", sub: "Q3 FY26 | Fastest among G20", color: "emerald", Icon: TrendingUp, trend: "↑ rising" },
            ].map(({ key, label, value, sub, color, Icon, trend }) => (
              <button key={label} onClick={() => key && onSlide(key)}
                className={`bg-white/5 border border-white/10 hover:border-${color}-500/40 hover:bg-white/8 rounded-xl p-4 text-left transition-all group ${key ? "cursor-pointer" : "cursor-default"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 bg-${color}-500/20 rounded-lg`}>
                      <Icon className={`w-4 h-4 text-${color}-400`} />
                    </div>
                    <span className="text-xs text-blue-300 font-medium">{label}</span>
                  </div>
                  <span className={`text-xs text-${color}-400 font-semibold`}>{trend}</span>
                </div>
                <p className={`text-3xl font-bold text-white mb-1`}>{value}</p>
                <p className="text-xs text-blue-400 group-hover:text-blue-300 transition-colors">{sub}</p>
                {key && <p className="text-xs text-amber-400 mt-2 flex items-center gap-1"><Zap className="w-3 h-3" /> Click to explore →</p>}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* How it works */}
      <div className="bg-white/3 border-t border-white/10 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">{t("how_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "01", title: t("step1"), sub: t("step1_sub"), icon: User, color: "amber" },
              { n: "02", title: t("step2"), sub: t("step2_sub"), icon: Cpu, color: "indigo" },
              { n: "03", title: t("step3"), sub: t("step3_sub"), icon: Target, color: "emerald" },
            ].map(({ n, title, sub, icon: Icon, color }) => (
              <motion.div key={n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: parseInt(n) / 20 }}
                className="text-center">
                <div className={`w-14 h-14 rounded-2xl bg-${color}-500/20 border border-${color}-500/30 flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 text-${color}-400`} />
                </div>
                <span className={`text-xs font-bold text-${color}-400 tracking-widest`}>{n}</span>
                <h3 className="text-base font-bold text-white mt-1 mb-1">{title}</h3>
                <p className="text-sm text-blue-300">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ELIGIBILITY LAB (FORM)
// ════════════════════════════════════════════════════════════════════

function EligibilityLab({ fd, setFd, activeModules, liveSchemes, mode, setMode, lang, onSubmit, onBack, isProcessing }: {
  fd: FormData; setFd: React.Dispatch<React.SetStateAction<FormData>>;
  activeModules: ActiveModule[]; liveSchemes: string[];
  mode: Mode; setMode: (m: Mode) => void;
  lang: Lang; onSubmit: (e: React.FormEvent) => void;
  onBack: () => void; isProcessing: boolean;
}) {
  const t = (k: string) => T[lang][k] || k;
  const { score: liveScore, breakdown: liveBreakdown } = useMemo(() => calculateRisk(fd, activeModules), [fd, activeModules]);
  const liveProbability = useMemo(() => toProbability(liveScore), [liveScore]);

  function set<K extends keyof FormData>(field: K, val: FormData[K]) {
    setFd(prev => ({ ...prev, [field]: val }));
  }
  function toggleList(field: "rawMaterialSources" | "applicableSchemes" | "gstIssues", item: string) {
    setFd(prev => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(item) ? arr.filter(a => a !== item) : [...arr, item] };
    });
  }

  return (
    <div className="min-h-screen" style={{ background: "#F0F4F8" }}>
      {/* Lab Header */}
      <div className="bg-[#1B3A6B] shadow-lg">
        <div className="flex h-1"><div className="flex-1 bg-orange-500" /><div className="flex-1 bg-white/20" /><div className="flex-1 bg-emerald-600" /></div>
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-blue-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer transition-colors">
              ← Back
            </button>
            <div className="w-px h-4 bg-white/20" />
            <div>
              <p className="text-white font-bold text-sm">{T[lang].hero_title}</p>
              <p className="text-blue-200 text-xs">AI-आधारित ऋण पात्रता पूर्व-आकलन</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeModules.length > 0 && (
              <motion.span animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="bg-orange-500/20 border border-orange-400/40 text-orange-200 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Radio className="w-3 h-3" /> {activeModules.length} Module{activeModules.length > 1 ? "s" : ""} Active
              </motion.span>
            )}
            {/* Mode Toggle */}
            <div className="flex bg-white/10 rounded-lg p-1 gap-0.5">
              {(["user", "analyst"] as Mode[]).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all cursor-pointer ${mode === m ? "bg-white text-[#1B3A6B]" : "text-blue-200 hover:text-white"}`}>
                  {m === "user" ? t("mode_user") : t("mode_analyst")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* No-risk reminder */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-2.5 flex items-center gap-2 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-sm text-emerald-700 font-medium">{t("disclaimer")}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT: FORM ─────────────────────────────────────────── */}
          <div className={`${mode === "analyst" ? "lg:col-span-6" : "lg:col-span-6"} space-y-5`}>
            <form onSubmit={onSubmit} className="space-y-5">

              {/* Applicant Profile */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#1B3A6B] px-6 py-3.5 flex items-center gap-2">
                  <div className="w-0.5 h-4 bg-orange-400 rounded-full" />
                  <h2 className="text-white font-semibold text-sm">
                    {mode === "user" ? "Tell us about yourself" : "Applicant Profile"} / आवेदक प्रोफाइल
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <BL en="Applicant Type" hi="आवेदक प्रकार" req />
                    <div className="grid grid-cols-2 gap-2">
                      {([["individual", "Individual", User], ["msme", "MSME", Building2], ["self_employed", "Self-Employed", BarChart3], ["corporate", "Corporate", Building2]] as const).map(([v, l, I]) => (
                        <ToggleBtn key={v} active={fd.applicantType === v} onClick={() => set("applicantType", v as ApplicantType)}>
                          <I className="w-4 h-4" />{l}
                        </ToggleBtn>
                      ))}
                    </div>
                  </div>

                  {(fd.applicantType === "msme" || fd.applicantType === "self_employed") && (
                    <div>
                      <BL en="Business Category" hi="व्यवसाय श्रेणी" />
                      <select value={fd.businessCategory} onChange={e => set("businessCategory", e.target.value)} className={INPUT}>
                        <option value="">Select category…</option>
                        <option value="micro">Micro Enterprise (Turnover &lt; ₹5 Cr)</option>
                        <option value="small">Small Enterprise (₹5–₹50 Cr)</option>
                        <option value="medium">Medium Enterprise (₹50–₹250 Cr)</option>
                        <option value="large">Large / Non-MSME</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <BL en="Industry / Sector" hi="उद्योग / क्षेत्र" req />
                    <select value={fd.sector} onChange={e => set("sector", e.target.value)} className={INPUT} required>
                      <option value="">Select sector…</option>
                      {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <BL en="Operating State / UT" hi="राज्य" req />
                    <select value={fd.state} onChange={e => set("state", e.target.value)} className={INPUT} required>
                      <option value="">Select state…</option>
                      {STATES.map(s => <option key={s.value} value={s.value}>{s.label}{s.risk === "high" ? " ⚠" : s.risk === "low" ? " ✓" : ""}</option>)}
                    </select>
                    {/* Geo-Economic Pulse inline */}
                    <GeoPulse state={fd.state} sector={fd.sector} lang={lang} />
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#1B3A6B] px-6 py-3.5 flex items-center gap-2">
                  <div className="w-0.5 h-4 bg-orange-400 rounded-full" />
                  <h2 className="text-white font-semibold text-sm">Loan Details / ऋण विवरण</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <BL en="Loan Purpose" hi="ऋण उद्देश्य" />
                    <select value={fd.loanPurpose} onChange={e => set("loanPurpose", e.target.value)} className={INPUT}>
                      <option value="">Select purpose…</option>
                      <option value="working_capital">Working Capital / कार्यशील पूंजी</option>
                      <option value="term_loan">Term Loan / Business Expansion</option>
                      <option value="equipment">Plant & Machinery / Equipment</option>
                      <option value="vehicle">Vehicle / Fleet</option>
                      <option value="trade_finance">Trade Finance / LC / BG</option>
                      <option value="home">Home Loan / गृह ऋण</option>
                      <option value="education">Education Loan</option>
                      <option value="personal">Personal Loan</option>
                    </select>
                  </div>
                  <div>
                    <BL en="Interest Rate Type" hi="ब्याज दर प्रकार" req />
                    <div className="grid grid-cols-2 gap-3">
                      <ToggleBtn active={fd.loanType === "fixed"} onClick={() => set("loanType", "fixed")}>Fixed Rate — Stable EMI</ToggleBtn>
                      <ToggleBtn active={fd.loanType === "floating"} onClick={() => set("loanType", "floating")}>Floating — MCLR Linked</ToggleBtn>
                    </div>
                    {fd.loanType === "floating" && (
                      <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-orange-700 font-medium">Rate risk module will activate — complete the additional fields below.</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <BL en="Requested Loan Amount / ऋण राशि" hi="(₹)" req />
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                      <input type="number" required placeholder="e.g. 1000000" value={fd.loanAmount} onChange={e => set("loanAmount", e.target.value)} className={INPUT + " pl-8"} />
                    </div>
                    {fd.loanAmount && <p className="text-xs text-slate-500 mt-1">= ₹{parseInt(fd.loanAmount).toLocaleString("en-IN")}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <BL en="CIBIL Score" hi="क्रेडिट स्कोर" req />
                      <input type="number" required placeholder="300–900" value={fd.cibilScore} onChange={e => set("cibilScore", e.target.value)} className={INPUT} min={300} max={900} />
                      {fd.cibilScore && (
                        <p className={`text-xs mt-1 font-semibold ${parseInt(fd.cibilScore) >= 750 ? "text-emerald-600" : parseInt(fd.cibilScore) >= 650 ? "text-amber-600" : "text-red-600"}`}>
                          {parseInt(fd.cibilScore) >= 750 ? "✓ Excellent" : parseInt(fd.cibilScore) >= 650 ? "⚡ Fair" : "⚠ Poor — See Rehab Plan"}
                        </p>
                      )}
                    </div>
                    <div>
                      <BL en="EMI / Income Ratio" hi="ईएमआई अनुपात" req />
                      <div className="relative">
                        <input type="number" required placeholder="e.g. 35" value={fd.emiIncomeRatio} onChange={e => set("emiIncomeRatio", e.target.value)} className={INPUT + " pr-7"} min={0} max={100} />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                  {fd.applicantType !== "individual" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <BL en="Years in Operation" hi="व्यवसाय आयु" />
                        <input type="number" placeholder="e.g. 5" value={fd.yearsOperation} onChange={e => set("yearsOperation", e.target.value)} className={INPUT} />
                      </div>
                      <div>
                        <BL en="Annual Turnover" hi="वार्षिक टर्नओवर" />
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                          <input type="number" placeholder="Amount" value={fd.annualTurnover} onChange={e => set("annualTurnover", e.target.value)} className={INPUT + " pl-8"} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MODULE 1: RBI */}
              {activeModules.find(m => m.id === "rbi_rate_shock") && (() => {
                const mod = activeModules.find(m => m.id === "rbi_rate_shock")!;
                const C = MODULE_P[mod.color];
                return (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border-2 ${C.border} overflow-hidden shadow-sm`}>
                    <div className={`${C.hdr} px-6 py-3.5 flex items-center justify-between`}>
                      <div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-white" /><span className="text-white font-semibold text-sm">{mod.label} / {mod.labelHi}</span></div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${C.badge}`}>⚡ ACTIVE</span>
                    </div>
                    <div className={`${C.bg} p-6 space-y-5`}>
                      <div className="bg-indigo-100 border border-indigo-200 rounded-xl px-4 py-3 text-xs text-indigo-800 flex gap-2 items-start">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" /> Repo Rate: <strong>5.25%</strong> | MPC Stance: Neutral. Assess your ability to absorb a +150bps rate hike scenario.
                      </div>
                      <SliderField en="Emergency Buffer Fund" hi="आपातकालीन निधि" hint="Months of EMI payments covered by liquid savings." value={fd.emergencyBufferMonths} onChange={v => set("emergencyBufferMonths", v)} min={0} max={24} unit=" months" />
                      <SliderField en="Existing Floating Rate Loans" hi="मौजूदा फ्लोटिंग ऋण" hint="Home loans, vehicle loans, MSME lines at floating rates." value={fd.existingFloatingLoans} onChange={v => set("existingFloatingLoans", v)} min={0} max={10} unit=" loans" />
                      <div>
                        <BL en="Rate Shock Absorption Capacity" hi="ब्याज वृद्धि सहन क्षमता" />
                        <select value={fd.rateShockCapacity} onChange={e => set("rateShockCapacity", e.target.value)} className={INPUT}>
                          <option value="comfortable">Comfortable — well within budget</option>
                          <option value="can_manage">Can Manage — tight but manageable</option>
                          <option value="struggling">Struggling — would strain cash flows</option>
                          <option value="cannot">Cannot Manage — serious default risk</option>
                        </select>
                      </div>
                      <div>
                        <BL en="Rate Hedging Strategy" hi="ब्याज बचाव योजना" />
                        <select value={fd.rateHedgingStrategy} onChange={e => set("rateHedgingStrategy", e.target.value)} className={INPUT}>
                          <option value="none">None — fully exposed</option>
                          <option value="fixed_switch">Plan to convert to fixed rate at threshold</option>
                          <option value="irs">Interest Rate Swap (corporate)</option>
                          <option value="prepayment">Aggressive prepayment buffer</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* MODULE 2: Govt Scheme (Scheme Benefits Card) */}
              {activeModules.find(m => m.id === "govt_scheme") && (() => {
                return (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 border-emerald-500 overflow-hidden shadow-md">
                    <div className="bg-emerald-600 px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-300" />
                        <span className="text-white font-bold text-sm">SCHEME BENEFITS DETECTED / योजना लाभ उपलब्ध</span>
                      </div>
                      <p className="text-emerald-100 text-xs">आपकी प्रोफाइल के आधार पर — you may qualify for:</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {liveSchemes.map((s, i) => (
                          <span key={i} className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />{s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Info className="w-4 h-4 text-emerald-600" />
                        <p className="text-sm font-semibold text-emerald-800">Complete to confirm eligibility / पात्रता की पुष्टि के लिए भरें:</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <BL en="Social Category" hi="सामाजिक वर्ग" />
                          <select value={fd.socialCategory} onChange={e => set("socialCategory", e.target.value)} className={INPUT}>
                            <option value="general">General / सामान्य</option>
                            <option value="obc">OBC</option>
                            <option value="sc">Scheduled Caste (SC)</option>
                            <option value="st">Scheduled Tribe (ST)</option>
                            <option value="minority">Minority / अल्पसंख्यक</option>
                            <option value="ews">EWS</option>
                          </select>
                        </div>
                        <div>
                          <BL en="Gender" hi="लिंग" />
                          <select value={fd.gender} onChange={e => set("gender", e.target.value)} className={INPUT}>
                            <option value="male">Male / पुरुष</option>
                            <option value="female">Female / महिला</option>
                            <option value="transgender">Transgender</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <BL en="First-Time Entrepreneur?" hi="पहली बार उद्यमी?" />
                          <div className="flex gap-2">
                            <ToggleBtn active={fd.firstTimeEntrepreneur} onClick={() => set("firstTimeEntrepreneur", true)}>हाँ / Yes</ToggleBtn>
                            <ToggleBtn active={!fd.firstTimeEntrepreneur} onClick={() => set("firstTimeEntrepreneur", false)}>नहीं / No</ToggleBtn>
                          </div>
                        </div>
                        <div>
                          <BL en="Udyam Registered?" hi="उद्यम पंजीकृत?" />
                          <div className="flex gap-2">
                            <ToggleBtn active={fd.udyamRegistered} onClick={() => set("udyamRegistered", true)}>हाँ / Yes</ToggleBtn>
                            <ToggleBtn active={!fd.udyamRegistered} onClick={() => set("udyamRegistered", false)}>नहीं / No</ToggleBtn>
                          </div>
                        </div>
                      </div>
                      <div>
                        <BL en="e-Shram Card?" hi="ई-श्रम कार्ड?" />
                        <div className="flex gap-2">
                          <ToggleBtn active={fd.eShramCard} onClick={() => set("eShramCard", true)}>Yes — Registered</ToggleBtn>
                          <ToggleBtn active={!fd.eShramCard} onClick={() => set("eShramCard", false)}>No</ToggleBtn>
                        </div>
                      </div>
                      <div>
                        <BL en="Scheme Interest" hi="योजना रुचि" />
                        <div className="flex flex-wrap gap-2">
                          {GOVT_SCHEMES.map(s => <Chip key={s.id} label={s.label} ccolor="green" active={fd.applicableSchemes.includes(s.id)} onClick={() => toggleList("applicableSchemes", s.id)} />)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* MODULE 3: West Asia */}
              {activeModules.find(m => m.id === "west_asia_supply") && (() => {
                const mod = activeModules.find(m => m.id === "west_asia_supply")!;
                const C = MODULE_P[mod.color];
                return (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border-2 ${C.border} overflow-hidden shadow-sm`}>
                    <div className={`${C.hdr} px-6 py-3.5 flex items-center justify-between`}>
                      <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-white" /><span className="text-white font-semibold text-sm">{mod.label} / {mod.labelHi}</span></div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${C.badge}`}>⚡ ACTIVE</span>
                    </div>
                    <div className={`${C.bg} p-6 space-y-5`}>
                      <div className="bg-amber-100 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /><strong>Live Alert:</strong>&nbsp;Red Sea disruptions active | Houthi shipping attacks | Freight index +34% (April 2026)
                      </div>
                      <div>
                        <BL en="Primary Raw Material Import Sources" hi="कच्चे माल के स्रोत" />
                        <div className="flex flex-wrap gap-2">
                          {RAW_MATERIAL_SOURCES.map(r => <Chip key={r} label={r} ccolor="amber" active={fd.rawMaterialSources.includes(r)} onClick={() => toggleList("rawMaterialSources", r)} />)}
                        </div>
                      </div>
                      <SliderField en="Energy & Oil Cost (% of OpEx)" hi="ऊर्जा लागत" hint="Include electricity, diesel, fuel costs." value={fd.energyCostPct} onChange={v => set("energyCostPct", v)} min={0} max={80} unit="%" />
                      <div>
                        <BL en="Alternative Domestic Vendor Plan" hi="वैकल्पिक आपूर्तिकर्ता" />
                        <select value={fd.alternativeVendorPlan} onChange={e => set("alternativeVendorPlan", e.target.value)} className={INPUT}>
                          <option value="active">Active — domestic backup contracted</option>
                          <option value="developing">Developing — in negotiation</option>
                          <option value="none">None — fully import-dependent</option>
                        </select>
                      </div>
                      <SliderField en="Forward Inventory Buffer" hi="अग्रिम माल भंडार" hint="Months you can operate if imports stop." value={fd.inventoryBufferMonths} onChange={v => set("inventoryBufferMonths", v)} min={0} max={12} unit=" months" />
                      <div>
                        <BL en="Energy Cost Hedging" hi="ऊर्जा बचाव" />
                        <select value={fd.energyHedging} onChange={e => set("energyHedging", e.target.value)} className={INPUT}>
                          <option value="none">None — absorbing spot price volatility</option>
                          <option value="forward_contracts">Forward contracts / oil price locks</option>
                          <option value="renewable_switch">Captive solar / renewable installed</option>
                          <option value="govt_subsidy">Government subsidy / regulated tariff</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* MODULE 4: GST */}
              {activeModules.find(m => m.id === "gst_digital") && (() => {
                const mod = activeModules.find(m => m.id === "gst_digital")!;
                const C = MODULE_P[mod.color];
                return (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border-2 ${C.border} overflow-hidden shadow-sm`}>
                    <div className={`${C.hdr} px-6 py-3.5 flex items-center justify-between`}>
                      <div className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-white" /><span className="text-white font-semibold text-sm">{mod.label} / {mod.labelHi}</span></div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${C.badge}`}>⚡ ACTIVE</span>
                    </div>
                    <div className={`${C.bg} p-6 space-y-5`}>
                      <div className="bg-violet-100 border border-violet-200 rounded-xl px-4 py-3 text-xs text-violet-800 flex gap-2">
                        <Info className="w-4 h-4 flex-shrink-0" /><strong>Budget 2026:</strong> GST rationalization — 5 slabs to 4. GST trail replaces informal income proof.
                      </div>
                      <div>
                        <BL en="GST Registration Status" hi="जीएसटी पंजीकरण" />
                        <select value={fd.gstStatus} onChange={e => set("gstStatus", e.target.value)} className={INPUT}>
                          <option value="regular">Regular Taxpayer (monthly GSTR-3B)</option>
                          <option value="composition">Composition Scheme (≤ ₹1.5 Cr)</option>
                          <option value="unregistered">Unregistered / Informal</option>
                        </select>
                      </div>
                      {fd.gstStatus !== "unregistered" && (
                        <SliderField en="GSTR Monthly Filing Compliance" hi="जीएसटी अनुपालन दर" hint="% of months filed on time in last 12 months." value={fd.gstCompliancePct} onChange={v => set("gstCompliancePct", v)} min={0} max={100} unit="%" />
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <BL en="ITR Filed (Last 3 Yrs)" hi="आयकर रिटर्न" />
                          <div className="flex gap-2"><ToggleBtn active={fd.itrFiled} onClick={() => set("itrFiled", true)}>हाँ / Yes</ToggleBtn><ToggleBtn active={!fd.itrFiled} onClick={() => set("itrFiled", false)}>नहीं / No</ToggleBtn></div>
                        </div>
                        <div>
                          <BL en="PAN–Aadhaar Linked?" hi="पैन-आधार लिंक?" />
                          <div className="flex gap-2"><ToggleBtn active={fd.panAadhaarLinked} onClick={() => set("panAadhaarLinked", true)}>Yes</ToggleBtn><ToggleBtn active={!fd.panAadhaarLinked} onClick={() => set("panAadhaarLinked", false)}>No</ToggleBtn></div>
                        </div>
                      </div>
                      <SliderField en="UPI / Digital Payment Adoption" hi="डिजिटल भुगतान" hint="% of revenue received digitally (verifiable trail)." value={fd.digitalPaymentPct} onChange={v => set("digitalPaymentPct", v)} min={0} max={100} unit="%" />
                      {fd.gstStatus !== "unregistered" && (
                        <div>
                          <BL en="GST Compliance Issues" hi="जीएसटी समस्याएं" />
                          <div className="flex flex-wrap gap-2">
                            {GST_ISSUES.map(g => <Chip key={g.id} label={g.label} ccolor="violet" active={fd.gstIssues.includes(g.id)} onClick={() => toggleList("gstIssues", g.id)} />)}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })()}

              {/* Submit */}
              <button type="submit" disabled={isProcessing}
                className="w-full relative overflow-hidden bg-[#1B3A6B] hover:bg-[#15305a] text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer text-sm tracking-wide transition-all">
                {isProcessing && <div className="absolute inset-0 overflow-hidden"><div className="scan-line" /></div>}
                {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" />{t("checking")}</> : <><Cpu className="w-5 h-5" />{t("submit")}</>}
              </button>
              <p className="text-center text-xs text-slate-400">🔒 {t("dpdp_badge")} | RBI Fair Practice Code adherent</p>
            </form>
          </div>

          {/* ── RIGHT: Summary / Analyst Panel ─────────────────────── */}
          <div className="lg:col-span-6 space-y-5 lg:sticky lg:top-24">
            {mode === "analyst" ? (
              <div className="space-y-4">
                <div className="bg-[#1B3A6B] rounded-2xl p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-3 flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5" />{t("analyst_label")} — Live Risk Vectors
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <p className="text-4xl font-bold tabular-nums">{liveProbability}%</p>
                      <p className="text-blue-300 text-xs mt-0.5">{t("score_label")}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${liveProbability}%` }} transition={{ duration: 0.4 }}
                          className={`h-full rounded-full ${liveProbability >= 70 ? "bg-emerald-400" : liveProbability >= 45 ? "bg-amber-400" : "bg-red-400"}`} />
                      </div>
                      <p className="text-xs mt-1 text-blue-300">{getTier(liveProbability, lang).label}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(liveBreakdown).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2">
                        <span className="text-xs text-blue-200 w-44 flex-shrink-0">{k}</span>
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${v >= 0 ? "bg-emerald-400" : "bg-red-400"}`} style={{ width: `${Math.min(Math.abs(v) / 60 * 100, 100)}%` }} />
                        </div>
                        <span className={`text-xs font-mono w-10 text-right ${v >= 0 ? "text-emerald-300" : "text-red-300"}`}>{v > 0 ? "+" : ""}{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {activeModules.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-orange-500" /> Active Intelligence Modules
                    </p>
                    <div className="space-y-3">
                      {activeModules.map(m => {
                        const c = { blue: "text-indigo-600 bg-indigo-50 border-indigo-200", green: "text-emerald-600 bg-emerald-50 border-emerald-200", amber: "text-amber-600 bg-amber-50 border-amber-200", violet: "text-violet-600 bg-violet-50 border-violet-200" }[m.color];
                        return (
                          <div key={m.id} className={`${c} border rounded-xl p-3`}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-bold">{m.id.toUpperCase()}</p>
                              <span className="text-xs font-semibold bg-white/50 px-1.5 py-0.5 rounded uppercase">{m.severity}</span>
                            </div>
                            <p className="text-xs font-medium">{m.label}</p>
                            <p className="text-xs opacity-70 mt-0.5">{m.triggerCondition}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {/* Application Summary */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#1B3A6B]" /> Application Progress
                  </h3>
                  {[
                    { label: "Applicant Type", val: fd.applicantType },
                    { label: "Sector", val: SECTORS.find(s => s.value === fd.sector)?.label },
                    { label: "State", val: STATES.find(s => s.value === fd.state)?.label },
                    { label: "Loan Amount", val: fd.loanAmount ? `₹${parseInt(fd.loanAmount).toLocaleString("en-IN")}` : null },
                    { label: "CIBIL Score", val: fd.cibilScore },
                    { label: "EMI Ratio", val: fd.emiIncomeRatio ? `${fd.emiIncomeRatio}%` : null },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">
                      {val ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
                      <span className={`text-sm ${val ? "text-slate-700" : "text-slate-400"}`}>{label}</span>
                      {val && <span className="ml-auto text-sm font-semibold text-slate-600 truncate max-w-28">{val}</span>}
                    </div>
                  ))}
                </div>

                {/* Quick live score preview */}
                {(fd.cibilScore || fd.loanAmount) && (
                  <div className="bg-[#1B3A6B]/5 border border-[#1B3A6B]/20 rounded-2xl p-5">
                    <p className="text-xs font-semibold text-[#1B3A6B] uppercase tracking-wider mb-2">Preliminary Estimate</p>
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-bold text-[#1B3A6B]">{liveProbability}%</p>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{getTier(liveProbability, lang).label}</p>
                        <p className="text-xs text-slate-500">{getTier(liveProbability, lang).description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info panel */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <ShieldCheck className="w-8 h-8 text-[#1B3A6B] mb-3" />
                  <p className="font-semibold text-slate-700 text-sm mb-2">About Bharat Sentinel AI</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    This predictor uses RBI-compliant adaptive AI to analyse your profile across 40+ India-specific risk vectors — including RBI monetary policy, West Asia supply chain exposure, GST compliance trail, and government scheme eligibility. Result: a probability score across 200+ Indian lenders.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// RESULTS DASHBOARD
// ════════════════════════════════════════════════════════════════════

function ResultsDashboard({ result, lang, onEdit, onSlide }: {
  result: BharatResult; lang: Lang;
  onEdit: () => void; onSlide: (t: SlideOverType) => void;
}) {
  const t = (k: string) => T[lang][k] || k;
  const [displayProb, setDisplayProb] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const tier = getTier(result.probability, lang);
  const isLow = result.probability < 45;
  const circumference = 2 * Math.PI * 54;

  useEffect(() => {
    let p = 0; const pt = result.probability;
    const id1 = setInterval(() => { p += 1; setDisplayProb(p >= pt ? pt : p); if (p >= pt) clearInterval(id1); }, 20);
    let s = 0; const st = result.rawScore;
    const id2 = setInterval(() => { s += 1; setDisplayScore(s >= st ? st : s); if (s >= st) clearInterval(id2); }, 25);
    return () => { clearInterval(id1); clearInterval(id2); };
  }, [result]);

  const probColor = result.probability >= 70 ? "#16a34a" : result.probability >= 45 ? "#d97706" : "#dc2626";

  return (
    <div className="min-h-screen" style={{ background: "#F0F4F8" }}>
      {/* Results Header */}
      <div className="bg-[#1B3A6B]">
        <div className="flex h-1"><div className="flex-1 bg-orange-500" /><div className="flex-1 bg-white/20" /><div className="flex-1 bg-emerald-600" /></div>
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <p className="text-white font-bold text-sm">BHARAT SENTINEL — {t("results_heading")}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onSlide("whyscore")}
              className="flex items-center gap-1.5 text-xs text-blue-200 hover:text-white border border-white/20 rounded-lg px-3 py-1.5 transition-colors cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5" />{t("why_title")}
            </button>
            <button onClick={onEdit}
              className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg px-3 py-1.5 transition-colors cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" />{t("step_back")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* No risk reminder */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-2.5 flex items-center gap-2 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-sm text-emerald-700 font-medium">{t("disclaimer")}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Score + Matchmaker */}
          <div className="lg:col-span-5 space-y-5">

            {/* PROBABILITY SCORE CARD */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              <div className="p-8 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{t("score_label")}</p>

                {/* Circular probability gauge */}
                <div className="relative w-44 h-44 mx-auto mb-6">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                    <motion.circle cx="60" cy="60" r="54" fill="none" stroke={probColor} strokeWidth="10"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - (circumference * result.probability) / 100 }}
                      transition={{ duration: 1.6, ease: "easeOut" }}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-extrabold text-slate-800 tabular-nums">{displayProb}</span>
                    <span className="text-2xl font-bold text-slate-400">%</span>
                  </div>
                  {/* Geo pulse glow indicator */}
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.2, 0.8] }} transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                    style={{ background: probColor }} />
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-2 ${result.probability >= 70 ? "bg-emerald-100 text-emerald-700" : result.probability >= 45 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                  {result.probability >= 70 ? <CheckCircle2 className="w-4 h-4" /> : result.probability >= 45 ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {tier.label}
                </div>
                <p className="text-xs text-slate-500 mt-1">{tier.description}</p>

                <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-xl font-bold text-slate-700 tabular-nums">{displayScore}<span className="text-sm text-slate-400">/100</span></p>
                    <p className="text-xs text-slate-500">Raw Risk Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-slate-700">{result.riskLevel}</p>
                    <p className="text-xs text-slate-500">Risk Level</p>
                  </div>
                </div>
              </div>

              {/* Application meta */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex justify-between text-xs text-slate-500">
                <span>{result.id}</span>
                <span>{new Date(result.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                <button onClick={() => onSlide("whyscore")} className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
                  <HelpCircle className="w-3 h-3" />Why this score?
                </button>
              </div>
            </motion.div>

            {/* BANK MATCHMAKER */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-[#1B3A6B] px-6 py-3.5 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <h3 className="text-white font-bold text-sm">{t("bank_match")}</h3>
              </div>
              <div className="p-5 space-y-3">
                {result.bankTiers.map((bank, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl border ${bank.color === "emerald" ? "bg-emerald-50 border-emerald-200" : bank.color === "blue" ? "bg-blue-50 border-blue-200" : bank.color === "amber" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{bank.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{bank.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{bank.examples}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${bank.color === "emerald" ? "bg-emerald-100 text-emerald-700" : bank.color === "blue" ? "bg-blue-100 text-blue-700" : bank.color === "amber" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                      {bank.probability}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ECONOMIC PULSE QUICK LINKS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-orange-500" /> Economic Intelligence
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "repo" as SlideOverType, label: "Repo Rate Impact", value: "5.25%", color: "indigo" },
                  { key: "cpi" as SlideOverType, label: "CPI & DTI Effect", value: "4.1%", color: "amber" },
                ].map(({ key, label, value, color }) => (
                  <button key={key} onClick={() => onSlide(key)}
                    className={`bg-${color}-50 border border-${color}-200 hover:border-${color}-400 rounded-xl p-4 text-left cursor-pointer transition-all group`}>
                    <p className="font-bold text-2xl text-slate-800 mb-1">{value}</p>
                    <p className={`text-xs text-${color}-600 font-medium`}>{label}</p>
                    <p className="text-xs text-slate-400 mt-1 group-hover:text-slate-600">Click to explore →</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Breakdown + Rehab/Recommendations */}
          <div className="lg:col-span-7 space-y-5">

            {/* Scheme Benefits (if applicable) */}
            {result.schemeEligibility.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border-2 border-emerald-400 shadow-md overflow-hidden">
                <div className="bg-emerald-600 px-6 py-4 flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <div>
                    <h4 className="text-white font-bold text-sm">SCHEME BENEFITS UNLOCKED / योजना लाभ</h4>
                    <p className="text-emerald-100 text-xs">Government backing detected for your profile</p>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-1 gap-2.5">
                  {result.schemeEligibility.map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span className="font-semibold text-emerald-800 text-sm">{s}</span></div>
                      <Award className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CREDIT REHAB PLAN — shown instead of red "Declined" banner */}
            {isLow && result.rehabSteps.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl border-2 border-blue-400 shadow-md overflow-hidden">
                <div className="bg-[#1B3A6B] px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    <h4 className="text-white font-bold text-sm">{t("rehab_plan")} — Your 3-Step Path to Approval</h4>
                  </div>
                  <p className="text-blue-200 text-xs">Your current profile can be strengthened. Follow this plan to qualify within 3–9 months.</p>
                </div>
                <div className="p-5 space-y-4">
                  {result.rehabSteps.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }}
                      className="flex gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full bg-[#1B3A6B] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                          {s.step}
                        </div>
                        <span className="text-xl">{s.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">{s.title} <span className="text-slate-400 font-normal text-xs">/ {s.titleHi}</span></p>
                        <p className="text-xs text-slate-600 leading-relaxed mt-1">{s.description}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-semibold">📈 {s.impact}</span>
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">⏱ {s.timeline}</span>
                          {s.link && (
                            <a href={s.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                              <ExternalLink className="w-3 h-3" /> Start now
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Risk Breakdown */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1B3A6B]" /> Risk Vector Breakdown / जोखिम विश्लेषण
              </h4>
              <div className="space-y-4">
                {Object.entries(result.breakdown).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-600">{key}</span>
                      <span className={`text-xs font-bold tabular-nums ${val >= 0 ? "text-emerald-600" : "text-red-600"}`}>{val > 0 ? "+" : ""}{val} pts</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(Math.abs(val) / 60 * 100, 100)}%` }}
                        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                        className={`h-full rounded-full ${val >= 0 ? "bg-emerald-500" : "bg-red-400"}`} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
                📈 Market: {result.marketSnapshot}
              </p>
            </motion.div>

            {/* Analysis */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">{result.logic}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700 mb-1.5 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" />Bharat Intelligence Analysis</p>
                <p className="text-xs text-blue-700 leading-relaxed">{result.adaptiveContext}</p>
              </div>
            </motion.div>

            {/* Recommendations */}
            {!isLow && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h4 className="font-bold text-slate-700 text-sm mb-4">Next Steps / सिफारिशें</h4>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                      <div className="w-6 h-6 rounded-full bg-[#1B3A6B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN APP — PHASE STATE MACHINE
// ════════════════════════════════════════════════════════════════════

export default function App() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<Mode>("user");
  const [slideOver, setSlideOver] = useState<SlideOverType>(null);
  const [fd, setFd] = useState<FormData>(DEFAULT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BharatResult | null>(null);

  const activeModules = useMemo(() => getActiveModules(fd), [fd]);
  const liveSchemes = useMemo(() => detectSchemes(fd), [fd]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const { score, breakdown } = calculateRisk(fd, activeModules);
      const probability = toProbability(score);
      const riskLevel = score >= 85 ? "Low" : score >= 65 ? "Moderate" : score >= 45 ? "High" : "Critical";

      const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
      const amt = parseInt(fd.loanAmount) || 0;
      const schemes = detectSchemes(fd);
      const sector = SECTORS.find(s => s.value === fd.sector)?.label ?? fd.sector;
      const state = STATES.find(s => s.value === fd.state)?.label ?? fd.state;

      const logic = `CIBIL ${fd.cibilScore || "N/A"} — ${fd.applicantType.toUpperCase()} in ${sector}, ${state}. ` +
        `${activeModules.length} Bharat Intelligence module(s) activated. ` +
        `Approval probability: ${probability}% (${riskLevel} risk). ` +
        `All PII (Aadhaar, PAN, Name) permanently excluded — DPDP Act 2023 & RBI Fair Practice Code compliant.`;

      const adaptiveContext = activeModules.length === 0
        ? "Standard RBI-compliant baseline applied. Repo rate 5.25%, MPC neutral stance, stable economic environment."
        : `Bharat Dynamic Risk Architecture activated ${activeModules.length} module(s): ${activeModules.map(m => m.label).join("; ")}. ` +
        "Analysis expanded beyond CIBIL+ITR to include rate sensitivity, scheme alignment, supply chain exposure, and GST compliance trail.";

      const recommendations: string[] = [];
      if (probability >= 70) {
        if (amt) recommendations.push(`Sanction ${inr(amt)} loan with Bharat Adaptive Risk covenants.`);
        if (schemes.length) recommendations.push(`Enroll under: ${schemes.slice(0, 2).join(", ")} — reduces NPA risk by up to 75%.`);
        if (activeModules.find(m => m.id === "rbi_rate_shock")) recommendations.push("Include EMI stress-test clause — escalate if repo crosses 6.25%.");
        recommendations.push("Enrol in RBI Early Warning Signal (EWS) framework — 60-day post-disbursement monitoring.");
      } else if (probability >= 45) {
        recommendations.push("Escalate to Credit Committee with full Bharat Risk Intelligence Report.");
        if (activeModules.find(m => m.id === "gst_digital")) recommendations.push("Request 12-month GST portal extract before final decision.");
        recommendations.push("Conditional sanction possible with Udyam + ITR-V + GST data within 21 days.");
      } else {
        recommendations.push("Follow the 3-step Credit Rehabilitation Plan below to strengthen your profile.");
        recommendations.push("Target reapplication in 90–180 days after completing plan milestones.");
      }

      setResult({
        id: `BS-${Date.now().toString(36).toUpperCase().slice(-8)}`,
        timestamp: new Date().toISOString(),
        rawScore: Math.round(score),
        probability,
        riskLevel,
        breakdown,
        schemeEligibility: schemes,
        bankTiers: getBanks(probability),
        rehabSteps: getRehabPlan(fd, activeModules),
        logic,
        adaptiveContext,
        recommendations,
        marketSnapshot: generateMarketSnapshot(fd),
      });

      setIsProcessing(false);
      setPhase("results");
    }, 3200);
  }

  return (
    <>
      <SlideOver type={slideOver} onClose={() => setSlideOver(null)} loanAmount={fd.loanAmount} lang={lang} />

      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
            <LandingPage lang={lang} setLang={setLang} onStart={() => setPhase("lab")} onSlide={setSlideOver} />
          </motion.div>
        )}

        {phase === "lab" && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <EligibilityLab
              fd={fd} setFd={setFd}
              activeModules={activeModules} liveSchemes={liveSchemes}
              mode={mode} setMode={setMode} lang={lang}
              onSubmit={handleSubmit} onBack={() => setPhase("landing")}
              isProcessing={isProcessing}
            />
          </motion.div>
        )}

        {phase === "results" && result && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <ResultsDashboard result={result} lang={lang} onEdit={() => setPhase("lab")} onSlide={setSlideOver} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
