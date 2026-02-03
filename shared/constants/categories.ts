// Service categories - shared between web and mobile
export const SERVICE_CATEGORIES = [
  { id: "electrical", label: "Electrical", icon: "lightning-bolt" },
  { id: "plumbing", label: "Plumbing", icon: "water-pump" },
  { id: "beauty", label: "Beauty & Wellness", icon: "spa" },
  { id: "cleaning", label: "Cleaning", icon: "broom" },
  { id: "home", label: "Home Improvement", icon: "home-edit" },
  { id: "mechanical", label: "Mechanical", icon: "car-wrench" },
  { id: "construction", label: "Construction", icon: "hammer" },
  { id: "technology", label: "Technology", icon: "laptop" },
  { id: "automotive", label: "Automotive", icon: "car" },
  { id: "gardening", label: "Gardening & Landscaping", icon: "flower" },
  { id: "pest", label: "Pest Control", icon: "bug" },
  { id: "event", label: "Event & Party", icon: "party-popper" },
  { id: "moving", label: "Moving & Haulage", icon: "truck" },
  { id: "security", label: "Security", icon: "shield-lock" },
  {
    id: "appliance",
    label: "Appliance Installation & Repair",
    icon: "washing-machine",
  },
  { id: "fitness", label: "Fitness & Personal Training", icon: "dumbbell" },
];

// Icon mapping for web (using Lucide icons)
export const CATEGORY_ICONS: Record<string, string> = {
  "lightning-bolt": "Zap",
  "water-pump": "Droplets",
  spa: "Sparkles",
  broom: "Brush",
  "home-edit": "Home",
  "car-wrench": "Wrench",
  hammer: "Hammer",
  laptop: "Laptop",
  car: "Car",
  flower: "Flower2",
  bug: "Bug",
  "party-popper": "PartyPopper",
  truck: "Truck",
  "shield-lock": "ShieldCheck",
  "washing-machine": "WashingMachine",
  dumbbell: "Dumbbell",
};
