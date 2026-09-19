import React, { useState } from 'react';
import { 
  FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaCheckCircle, 
  FaCopy, FaArchive, FaClock, FaCheck, FaTimes, FaToggleOn, FaToggleOff 
} from 'react-icons/fa';

const mockTableData = [
  { id: 1, name: "Live Music Night", category: "Music", date: "20 Sep 2026", venue: "Phoenix Arena", status: "Upcoming", booking: "Open", tickets: "320/500", img: "https://images.unsplash.com/photo-1540039155732-68473638c4b0?w=100&q=80" },
  { id: 2, name: "Diwali Dhamaka", category: "Festive", date: "05 Nov 2026", venue: "Convention Center", status: "Upcoming", booking: "Open", tickets: "128/300", img: "https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=100&q=80" },
  { id: 3, name: "Comedy Night", category: "Comedy", date: "12 Sep 2026", venue: "The Laugh Club", status: "Ongoing", booking: "Open", tickets: "450/500", img: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=100&q=80" },
  { id: 4, name: "Kids Fun Zone", category: "Kids", status: "Upcoming", date: "27 Sep 2026", venue: "City Grounds", booking: "Open", tickets: "290/400", img: "https://images.unsplash.com/photo-1601002573216-953e34b3e75e?w=100&q=80" },
  { id: 5, name: "New Year Bash", category: "Entertainment", date: "31 Dec 2026", venue: "Grand Hotel", status: "Draft", booking: "Closed", tickets: "0/0", img: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=100&q=80" },
];

export default function AdminEvents() {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'edit'
  const [activeTab, setActiveTab] = useState('Basic Details');

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <div className={`w-2 h-2 rounded-full ${color}`} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-800 font-sans">
      
      

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {view === 'dashboard' ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Events & Shows Management</h1>
                <p className="text-sm text-gray-500">Complete control over events/show profiles, bookings and lifecycle</p>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input type="text" placeholder="Search events..." className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
                <button 
                  onClick={() => setView('edit')}
                  className="px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-blue-800"
                >
                  <FaPlus size={12} /> Add New Event / Show
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Events" value="48" color="bg-blue-500" />
              <StatCard title="Upcoming" value="18" color="bg-purple-500" />
              <StatCard title="Ongoing" value="6" color="bg-green-500" />
              <StatCard title="Completed" value="15" color="bg-gray-500" />
              
              <StatCard title="Bookings Open" value="32" color="bg-blue-400" />
              <StatCard title="Sold Out" value="7" color="bg-red-500" />
              <StatCard title="Total Tickets Sold" value="8,432" color="bg-transparent text-gray-900 font-bold text-lg" />
              <StatCard title="Total Revenue" value="₹12,45,678" color="bg-transparent text-gray-900 font-bold text-lg" />
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Venue</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Booking</th>
                      <th className="px-6 py-4">Tickets</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockTableData.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-3">
                          <img src={row.img} alt={row.name} className="w-10 h-10 rounded object-cover" />
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-900">{row.name}</td>
                        <td className="px-6 py-3 text-gray-500">{row.category}</td>
                        <td className="px-6 py-3 text-gray-500">{row.date}</td>
                        <td className="px-6 py-3 text-gray-500">{row.venue}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                            ${row.status === 'Upcoming' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                              row.status === 'Ongoing' ? 'bg-green-50 text-green-600 border-green-100' :
                              'bg-gray-50 text-gray-600 border-gray-200'}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                            ${row.booking === 'Open' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}
                          >
                            {row.booking}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-500">{row.tickets}</td>
                        <td className="px-6 py-3 text-gray-400 flex items-center gap-3 mt-2">
                          <button onClick={() => setView('edit')} className="hover:text-blue-600"><FaEdit /></button>
                          <button className="hover:text-gray-900"><FaEye /></button>
                          <button className="hover:text-red-600"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span>Showing 1-5 of 48 events</span>
                <div className="flex gap-1">
                  <button className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">&lt;</button>
                  <button className="w-6 h-6 rounded bg-blue-900 text-white flex items-center justify-center">1</button>
                  <button className="w-6 h-6 rounded bg-gray-50 hover:bg-gray-100 flex items-center justify-center">2</button>
                  <button className="w-6 h-6 rounded bg-gray-50 hover:bg-gray-100 flex items-center justify-center">3</button>
                  <button className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">&gt;</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Column: Form */}
            <div className="lg:w-7/12">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setView('dashboard')} className="text-gray-400 hover:text-gray-900">← Back</button>
                <h1 className="text-2xl font-bold text-gray-900">Add New Event / Show</h1>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-100">
                  {['Basic Details', 'Event Details', 'Tickets & Pricing', 'Images & Gallery', 'Settings'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                    <input type="text" defaultValue="Live Music Night" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                    <input type="text" defaultValue="An evening of great music, food and vibes!" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2 text-gray-500">
                        {/* Editor toolbar mock */}
                        <div className="px-2 cursor-pointer font-bold">B</div>
                        <div className="px-2 cursor-pointer italic">I</div>
                        <div className="px-2 cursor-pointer underline">U</div>
                        <div className="w-px h-5 bg-gray-300 mx-2" />
                        <div className="px-2 cursor-pointer">🔗</div>
                      </div>
                      <textarea rows="4" className="w-full p-4 text-sm focus:outline-none" defaultValue="Experience an unforgettable evening with the best live bands, great food and amazing vibes."></textarea>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white">
                        <option>Music</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
                      <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white">
                        <option>Live Concert</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Moments Original</p>
                      <p className="text-xs text-gray-500">Mark this event as an official MomentsHub production.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaToggleOn className="text-green-500 text-3xl cursor-pointer" /> <span className="text-sm font-medium">Yes</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                    <button className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Save Draft</button>
                    <button className="px-6 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-800">Next →</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Panels */}
            <div className="lg:w-5/12 space-y-6 pt-12">
              
              {/* Event Management Options */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Event Management Options</h3>
                  <p className="text-xs text-gray-500">Control status, booking, images, etc.</p>
                </div>
                <div className="p-5 space-y-6">
                  
                  <div className="flex gap-4 items-center border border-gray-100 p-3 rounded-lg bg-gray-50/50">
                    <img src="https://images.unsplash.com/photo-1540039155732-68473638c4b0?w=100&q=80" className="w-16 h-16 rounded object-cover" alt="thumb"/>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">Live Music Night</h4>
                      <p className="text-xs text-gray-500">20 Sep 2026</p>
                    </div>
                    <button className="ml-auto px-3 py-1 border border-gray-200 rounded text-xs font-medium bg-white">Edit</button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Event Status</label>
                      <select className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 bg-white">
                        <option>Upcoming</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Booking Status</label>
                      <select className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 bg-white">
                        <option>Open</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Ticket Capacity</label>
                    <div className="flex justify-between text-xs font-medium text-gray-900 mb-1">
                      <span>500 Capacity</span>
                      <span className="text-blue-600">320 Sold</span>
                      <span className="text-gray-400">180 Remaining</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[64%]"></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <button className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-gray-600"><FaCheckCircle className="text-blue-500" /> Open Bookings</button>
                      <button className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-gray-600"><FaTimes className="text-red-400" /> Close Bookings</button>
                      <button className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-gray-600"><FaCheck className="text-green-500" /> Mark Sold Out</button>
                      <button className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-gray-600"><FaCheckCircle className="text-purple-500" /> Mark Completed</button>
                      <button className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-gray-600"><FaArchive className="text-gray-500" /> Archive Event</button>
                      <button className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-gray-600"><FaCopy className="text-blue-400" /> Duplicate Event</button>
                      <button className="flex items-center gap-2 p-2 hover:bg-red-50 rounded text-red-600 col-span-2 mt-2"><FaTrash /> Delete Event</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Lifecycle */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Event Lifecycle & Next Edition</h3>
                  <p className="text-xs text-gray-500">Manage lifecycle and create new editions</p>
                </div>
                <div className="p-5 flex gap-8">
                  
                  <div className="w-1/2 relative border-l border-gray-200 ml-3 space-y-6">
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-gray-300 bg-white" />
                      <p className="text-xs font-bold text-gray-400">DRAFT</p>
                      <p className="text-[10px] text-gray-400">Event is being prepared</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-50" />
                      <p className="text-xs font-bold text-blue-600">UPCOMING</p>
                      <p className="text-[10px] text-gray-500">Scheduled for future</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <FaCheck className="text-white text-[8px]" />
                      </div>
                      <p className="text-xs font-bold text-green-600">BOOKING OPEN</p>
                      <p className="text-[10px] text-gray-500">Tickets available</p>
                    </div>
                    <div className="relative pl-6 opacity-50">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-orange-500 bg-white" />
                      <p className="text-xs font-bold text-orange-500">ONGOING</p>
                      <p className="text-[10px] text-gray-400">Currently active</p>
                    </div>
                    <div className="relative pl-6 opacity-50">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-purple-500 bg-white" />
                      <p className="text-xs font-bold text-purple-600">COMPLETED</p>
                      <p className="text-[10px] text-gray-400">Event finished</p>
                    </div>
                    <div className="relative pl-6 opacity-50">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-gray-800 bg-white" />
                      <p className="text-xs font-bold text-gray-800">ARCHIVED</p>
                      <p className="text-[10px] text-gray-400">No longer active</p>
                    </div>
                  </div>

                  <div className="w-1/2 space-y-4">
                    <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                      <p className="text-xs font-bold text-gray-900 mb-1">Create Next Edition</p>
                      <p className="text-[10px] text-gray-500 mb-3">Create a new event using this event's details as a template.</p>
                      <button className="w-full py-1.5 bg-blue-900 text-white text-xs font-medium rounded hover:bg-blue-800">Create Next Edition</button>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                      <p className="text-xs font-bold text-gray-900 mb-1">Duplicate Event</p>
                      <p className="text-[10px] text-gray-500 mb-3">Create a new event with the same details.</p>
                      <button className="w-full py-1.5 bg-blue-900 text-white text-xs font-medium rounded hover:bg-blue-800">Duplicate</button>
                    </div>
                    <div className="p-3 border border-dashed border-gray-300 rounded-lg text-center">
                      <p className="text-xs font-bold text-gray-900 mb-1">Create from This</p>
                      <p className="text-[10px] text-gray-500 mb-3">Use this event as a template for a new one.</p>
                      <button className="w-full py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50">Create New</button>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
