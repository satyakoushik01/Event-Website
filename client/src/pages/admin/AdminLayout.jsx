import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/vendors', label: 'Vendors' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/analytics', label: 'Analytics' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-warm-white pt-24">
      {/* Admin header bar */}
      <div className="bg-matte-black text-white py-6 px-6 lg:px-8 mb-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl tracking-wide">Admin Console</h1>
            <p className="text-white/40 text-xs tracking-widest uppercase mt-1">Moments Group Management</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-champagne-gold animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-52 shrink-0">
            <nav className="glass-panel rounded-2xl p-4 space-y-1 cinematic-shadow">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm tracking-wide transition-all duration-300 ${
                      isActive
                        ? 'bg-matte-black text-white font-medium'
                        : 'text-gray-500 hover:bg-white/60 hover:text-matte-black'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
