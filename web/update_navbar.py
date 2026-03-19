import re

with open("components/landing-page/Navbar.tsx", "r", encoding="utf-8") as f:
    text = f.read()

dashboard_link = """
              {/* Dashboard Link directly on Navbar for logged in users */}
              {isLoggedIn && user?.userType === "client" && (
                <Link
                  href="/dashboard"
                  className="relative flex items-center gap-1.5 text-sm font-medium transition-colors text-gray-700 hover:text-(--color-primary)"
                >
                  <LayoutDashboard size={20} />
                  <span className="hidden lg:block">Dashboard</span>
                </Link>
              )}
              
"""

# Find where to inject the dashboard link. 
# Inside `<div className="hidden lg:flex items-center gap-5">`
# We can inject it right before `<Link href="/cart"`
cart_link_idx = text.find('<Link\n                href="/cart"')
if cart_link_idx != -1:
    text = text[:cart_link_idx] + dashboard_link + text[cart_link_idx:]
else:
    # try one-line
    cart_link_idx = text.find('<Link href="/cart"')
    if cart_link_idx != -1:
        text = text[:cart_link_idx] + dashboard_link + text[cart_link_idx:]
    else:
        print("Couldn't find cart link to inject dashboard link")
        exit(1)

with open("components/landing-page/Navbar.tsx", "w", encoding="utf-8") as f:
    f.write(text)
