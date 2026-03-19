import re

with open("components/client/HomeTab.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update imports
new_imports = """import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Grid,
  Headphones,
  Heart,
  MapPin,
  Menu,
  Phone,
  Search,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Star,
  Wallet,
  X,
  Zap,
  Droplets,
  Sparkles,
  SprayCan,
  Car,
  Building2,
  Paintbrush,
  Laptop,
  ChefHat,
  Scissors,
  Camera,
  Thermometer,
  Fuel,
  Bug,
  TreePine,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Zap, Droplets, Sparkles, SprayCan, Car, Building2,
  Paintbrush, Laptop, ChefHat, Scissors, Camera, Shield,
  Thermometer, Fuel, Bug, TreePine,
};

function ScrollSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(checkScroll) : null;
    if (ro) ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      if (ro) ro.disconnect();
    };
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative group">
      {canScrollLeft && (
        <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 backdrop-blur border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 -translate-x-1/2">
          <ChevronLeft size={18} className="text-gray-700" />
        </button>
      )}
      <div ref={scrollRef} className={`flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2 ${className}`}>
        {children}
      </div>
      {canScrollRight && (
        <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 backdrop-blur border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-x-1/2">
          <ChevronRight size={18} className="text-gray-700" />
        </button>
      )}
    </div>
  );
}
"""
old_imports_pattern = r'import\s*{\s*ArrowRight,.*?Zap,\s*}\s*from\s*"lucide-react";\s*import Image from "next/image";\s*import {\s*useRouter\s*}\s*from\s*"next/navigation";\s*import {\s*useCallback,\s*useEffect,\s*useRef,\s*useState\s*}\s*from\s*"react";'
content = re.sub(old_imports_pattern, new_imports, content, flags=re.DOTALL)

# 2. Main Container Framer Motion
content = content.replace(
    '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">',
    '<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">'
)
content = content.replace('</div>\n    )', '</motion.div>\n    )')

# 3. Handle specific category image replacement
cat_img_old = """<Image
                  src={cat.image} //I have to change the file format to svg.
                  alt={cat.label}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-xl"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />"""
cat_img_new = """{(() => {
                  const Icon = CATEGORY_ICONS[cat.icon];
                  return Icon ? <Icon size={24} className="text-(--color-primary)" /> : <span className="text-lg">📦</span>;
                })()}"""
content = content.replace(cat_img_old, cat_img_new)


# 4. Wrap elements in ScrollSection
# Trending Products
content = content.replace(
    '<div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">\n          {MOCK_PRODUCTS.slice(0, 7).map((p) => (',
    '<ScrollSection>\n          {MOCK_PRODUCTS.slice(0, 7).map((p) => ('
)
# Flash Deals
content = content.replace(
    '<div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">\n          {MOCK_FLASH_DEALS.map((deal) => (',
    '<ScrollSection className="snap-x snap-mandatory">\n          {MOCK_FLASH_DEALS.map((deal) => ('
)
# Top Rated Professionals
content = content.replace(
    '<div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">\n          {topProviders.map((p) => (',
    '<ScrollSection>\n          {topProviders.map((p) => ('
)

# And closing tags
p1_old = '</div>\n            </div>\n          ))}\n        </div>\n      </section>\n\n      {/* ⚡ Flash Deals */}'
p1_new = '</div>\n            </div>\n          ))}\n        </ScrollSection>\n      </section>\n\n      {/* ⚡ Flash Deals */}'
content = content.replace(p1_old, p1_new)

p2_old = '</div>\n              </div>\n            </div>\n          ))}\n        </div>\n      </section>\n\n      {/* Top Rated Professionals */}'
p2_new = '</div>\n              </div>\n            </div>\n          ))}\n        </ScrollSection>\n      </section>\n\n      {/* Top Rated Professionals */}'
content = content.replace(p2_old, p2_new)

p3_old = '</div>\n            </div>\n          ))}\n        </div>\n      </section>\n\n      {/* ===== PROMOTIONAL BANNERS ===== */}'
p3_new = '</div>\n            </div>\n          ))}\n        </ScrollSection>\n      </section>\n\n      {/* ===== PROMOTIONAL BANNERS ===== */}'
content = content.replace(p3_old, p3_new)

with open("components/client/HomeTab.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done!")
