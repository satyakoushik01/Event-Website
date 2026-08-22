import { useEffect, useState } from 'react';
import { getAnalytics } from '../../api/admin';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';

// ── Simple SVG Bar Chart ──
function BarChart({ data, labelKey, valueKey, title, color = '#6366f1' }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  const barWidth = Math.max(24, Math.floor(600 / data.length) - 8);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <svg
          width={Math.max(data.length * (barWidth + 8) + 40, 320)}
          height={220}
          viewBox={`0 0 ${Math.max(data.length * (barWidth + 8) + 40, 320)} 220`}
          className="block"
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1={30}
              y1={180 - frac * 160}
              x2={data.length * (barWidth + 8) + 30}
              y2={180 - frac * 160}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
          ))}
          {/* Bars */}
          {data.map((d, i) => {
            const h = ((d[valueKey] || 0) / maxVal) * 160;
            const x = 35 + i * (barWidth + 8);
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={180 - h}
                  width={barWidth}
                  height={h}
                  rx={4}
                  fill={color}
                  opacity={0.85}
                >
                  <animate
                    attributeName="height"
                    from="0"
                    to={h}
                    dur="0.6s"
                    fill="freeze"
                  />
                  <animate
                    attributeName="y"
                    from="180"
                    to={180 - h}
                    dur="0.6s"
                    fill="freeze"
                  />
                </rect>
                {/* Value label */}
                <text
                  x={x + barWidth / 2}
                  y={175 - h}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#374151"
                  fontWeight="600"
                >
                  {d[valueKey]?.toLocaleString()}
                </text>
                {/* Category label */}
                <text
                  x={x + barWidth / 2}
                  y={198}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#6b7280"
                >
                  {d[labelKey]?.length > 10 ? d[labelKey].slice(0, 10) + '…' : d[labelKey]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ── Donut Chart ──
function DonutChart({ data, labelKey, valueKey, title }) {
  if (!data || data.length === 0) return null;
  const total = data.reduce((s, d) => s + (d[valueKey] || 0), 0) || 1;
  const colors = ['#6366f1', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6'];
  const r = 70;
  const cx = 100;
  const cy = 100;

  let cumulativeAngle = -Math.PI / 2;
  const arcs = data.map((d, i) => {
    const fraction = (d[valueKey] || 0) / total;
    const angle = fraction * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = startAngle + angle;
    cumulativeAngle = endAngle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    return {
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: colors[i % colors.length],
      label: d[labelKey],
      value: d[valueKey],
      percent: Math.round(fraction * 100),
    };
  });

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <svg width={200} height={200} viewBox="0 0 200 200">
          {arcs.map((arc, i) => (
            <path key={i} d={arc.path} fill={arc.color} stroke="white" strokeWidth={2}>
              <animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze" />
            </path>
          ))}
          {/* Center hole */}
          <circle cx={cx} cy={cy} r={40} fill="white" />
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize={18} fontWeight="700" fill="#111827">
            {total}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10} fill="#6b7280">
            Total
          </text>
        </svg>
        <div className="space-y-2">
          {arcs.map((arc, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: arc.color }}
              />
              <span className="text-gray-700">
                {arc.label} <span className="text-gray-400">({arc.percent}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Month Names ──
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    getAnalytics({ year })
      .then(({ data }) => setAnalytics(data.analytics))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [year]);

  if (loading) return <Loader className="min-h-[40vh]" />;
  if (!analytics) return <p className="text-gray-500">No analytics data available.</p>;

  // Transform monthly revenue data for the bar chart
  const revenueData = (analytics.monthlyRevenue || []).map((m) => ({
    month: MONTHS[(m._id?.month || 1) - 1],
    revenue: m.revenue || 0,
    bookings: m.bookings || 0,
  }));

  // Service popularity for donut chart
  const serviceData = (analytics.servicePopularity || []).map((s) => ({
    category: s._id || 'Other',
    count: s.count,
  }));

  return (
    <div className="space-y-6">
      {/* Header + Year Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-gray-500">Revenue, service trends, and top vendors</p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {[...Array(5)].map((_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      {/* Revenue + Bookings Summary Cards */}
      {revenueData.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-5 text-center">
            <p className="text-sm text-gray-500">Total Revenue ({year})</p>
            <p className="text-3xl font-bold gradient-text mt-1">
              ₹{revenueData.reduce((s, d) => s + d.revenue, 0).toLocaleString()}
            </p>
          </Card>
          <Card className="p-5 text-center">
            <p className="text-sm text-gray-500">Total Bookings ({year})</p>
            <p className="text-3xl font-bold gradient-text mt-1">
              {revenueData.reduce((s, d) => s + d.bookings, 0).toLocaleString()}
            </p>
          </Card>
        </div>
      )}

      {/* Monthly Revenue Bar Chart */}
      <Card className="p-6">
        <BarChart
          data={revenueData}
          labelKey="month"
          valueKey="revenue"
          title={`Monthly Revenue — ${year}`}
          color="#6366f1"
        />
      </Card>

      {/* Monthly Bookings Bar Chart */}
      <Card className="p-6">
        <BarChart
          data={revenueData}
          labelKey="month"
          valueKey="bookings"
          title={`Monthly Bookings — ${year}`}
          color="#06b6d4"
        />
      </Card>

      {/* Service Distribution Donut */}
      <Card className="p-6">
        <DonutChart
          data={serviceData}
          labelKey="category"
          valueKey="count"
          title="Vendor Categories"
        />
      </Card>

      {/* Top Rated Vendors */}
      {analytics.topVendors?.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Rated Vendors</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">#</th>
                  <th className="pb-2">Business Name</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Rating</th>
                  <th className="pb-2">Reviews</th>
                  <th className="pb-2">Completed</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topVendors.map((v, i) => (
                  <tr key={v._id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-400">{i + 1}</td>
                    <td className="py-3 font-medium">{v.businessName}</td>
                    <td className="py-3 text-gray-500">{v.category}</td>
                    <td className="py-3">
                      <span className="text-amber-500">★</span> {v.rating?.toFixed(1) || '—'}
                    </td>
                    <td className="py-3 text-gray-500">{v.totalReviews || 0}</td>
                    <td className="py-3 text-gray-500">{v.completedEvents || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
