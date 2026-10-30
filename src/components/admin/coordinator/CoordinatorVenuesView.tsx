import React, { useState } from 'react';
import {
  Building2,
  Plus,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  ShieldCheck,
  DoorOpen,
  Monitor,
  Wifi,
  X,
  ArrowRight,
  Filter
} from 'lucide-react';

interface RoomData {
  id: string;
  name: string;
  roomNumber: string;
  capacity: number;
  assignedPanel?: string;
  currentSession?: string;
  isAvailable: boolean;
  hasDisplay: boolean;
  hasZeroTrustTerminal: boolean;
}

interface VenueData {
  id: string;
  name: string;
  address: string;
  city: string;
  activeDrives: string[];
  totalRooms: number;
  occupiedRooms: number;
  rooms: RoomData[];
}

export const CoordinatorVenuesView: React.FC = () => {
  const initialVenues: VenueData[] = [
    {
      id: 'ven_01',
      name: 'Mysuru Campus Center (Excelsoft HQ)',
      address: 'Plot 1-B, Hootagalli Industrial Area',
      city: 'Mysuru, Karnataka',
      activeDrives: ['Graduate Software Engineer 2026'],
      totalRooms: 6,
      occupiedRooms: 4,
      rooms: [
        {
          id: 'rm_01',
          name: 'Panel Room A-01',
          roomNumber: 'A-101',
          capacity: 4,
          assignedPanel: 'Panel A-01 (Dr. K. S. Ramanujan)',
          currentSession: 'Rohan Sharma (DSA & Problem Solving)',
          isAvailable: false,
          hasDisplay: true,
          hasZeroTrustTerminal: true
        },
        {
          id: 'rm_02',
          name: 'Panel Room A-02',
          roomNumber: 'A-102',
          capacity: 4,
          assignedPanel: 'Panel A-02 (Ananya Deshmukh)',
          currentSession: 'Available from 11:45 AM',
          isAvailable: false,
          hasDisplay: true,
          hasZeroTrustTerminal: true
        },
        {
          id: 'rm_03',
          name: 'Panel Room A-03',
          roomNumber: 'A-103',
          capacity: 4,
          isAvailable: true,
          hasDisplay: true,
          hasZeroTrustTerminal: true
        },
        {
          id: 'rm_04',
          name: 'Panel Room B-02',
          roomNumber: 'B-201',
          capacity: 4,
          assignedPanel: 'Panel B-02 (Dr. S. K. Rao)',
          currentSession: 'Sneha Kulkarni (Standby Slot)',
          isAvailable: false,
          hasDisplay: true,
          hasZeroTrustTerminal: true
        },
        {
          id: 'rm_05',
          name: 'Interview Lab 101',
          roomNumber: 'L-101',
          capacity: 8,
          isAvailable: true,
          hasDisplay: true,
          hasZeroTrustTerminal: true
        },
        {
          id: 'rm_06',
          name: 'Boardroom West',
          roomNumber: 'W-301',
          capacity: 10,
          assignedPanel: 'Executive Review Panel',
          isAvailable: false,
          hasDisplay: true,
          hasZeroTrustTerminal: true
        }
      ]
    },
    {
      id: 'ven_02',
      name: 'Bengaluru Tech Hub',
      address: 'Outer Ring Road, Marathahalli Tech Corridor',
      city: 'Bengaluru, Karnataka',
      activeDrives: ['Cloud DevOps & SRE Hiring'],
      totalRooms: 4,
      occupiedRooms: 2,
      rooms: [
        {
          id: 'rm_b01',
          name: 'Boardroom C-01',
          roomNumber: 'C-301',
          capacity: 6,
          assignedPanel: 'Panel B-01 (Rajesh Sen)',
          currentSession: 'Vikram Aditya (Cloud DevOps)',
          isAvailable: false,
          hasDisplay: true,
          hasZeroTrustTerminal: true
        },
        {
          id: 'rm_b02',
          name: 'Cloud Evaluation Lab',
          roomNumber: 'C-302',
          capacity: 4,
          isAvailable: true,
          hasDisplay: true,
          hasZeroTrustTerminal: true
        }
      ]
    },
    {
      id: 'ven_03',
      name: 'Hyderabad Technology Center',
      address: 'Avance Business Hub, Hitec City',
      city: 'Hyderabad, Telangana',
      activeDrives: ['Full Stack Web Platform Drive'],
      totalRooms: 4,
      occupiedRooms: 2,
      rooms: [
        {
          id: 'rm_h01',
          name: 'Interview Room 102',
          roomNumber: 'H-102',
          capacity: 4,
          assignedPanel: 'Panel C-01 (Murali Krishna)',
          currentSession: 'Ananya Deshmukh (Platform Lead)',
          isAvailable: false,
          hasDisplay: true,
          hasZeroTrustTerminal: true
        },
        {
          id: 'rm_h02',
          name: 'Technical Interview Room 104',
          roomNumber: 'H-104',
          capacity: 4,
          isAvailable: true,
          hasDisplay: true,
          hasZeroTrustTerminal: true
        }
      ]
    }
  ];

  const [venues, setVenues] = useState<VenueData[]>(initialVenues);
  const [selectedVenueId, setSelectedVenueId] = useState<string>('ven_01');
  const [showAddRoomModal, setShowAddRoomModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Room Form State
  const [newRoomName, setNewRoomName] = useState<string>('Panel Room A-04');
  const [newRoomNumber, setNewRoomNumber] = useState<string>('A-104');
  const [newRoomCapacity, setNewRoomCapacity] = useState<number>(4);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeVenue = venues.find((v) => v.id === selectedVenueId) || venues[0];

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom: RoomData = {
      id: `rm_${Date.now()}`,
      name: newRoomName,
      roomNumber: newRoomNumber,
      capacity: newRoomCapacity,
      isAvailable: true,
      hasDisplay: true,
      hasZeroTrustTerminal: true
    };

    setVenues((prev) =>
      prev.map((v) =>
        v.id === selectedVenueId
          ? {
              ...v,
              totalRooms: v.totalRooms + 1,
              rooms: [...v.rooms, newRoom]
            }
          : v
      )
    );

    setShowAddRoomModal(false);
    showToast(`Room ${newRoom.name} (${newRoom.roomNumber}) successfully created and registered.`);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                CAMPUS INFRASTRUCTURE
              </span>
              <h2 className="text-xl font-bold text-slate-900">Venue & Room Allocation Management</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure physical venues, assign panel rooms, prevent double-booking, and monitor facility capacity
            </p>
          </div>

          <button
            onClick={() => setShowAddRoomModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Room</span>
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* 2. Venue Switcher Tabs (Item 1 & 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {venues.map((venue) => {
          const isSelected = venue.id === selectedVenueId;
          const utilizationPct = Math.round((venue.occupiedRooms / venue.totalRooms) * 100);

          return (
            <div
              key={venue.id}
              onClick={() => setSelectedVenueId(venue.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-300 shadow-2xs ring-1 ring-indigo-400'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{venue.name}</h4>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{venue.city}</span>
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200">
                  {utilizationPct}% Active
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                <span>Rooms: {venue.occupiedRooms} / {venue.totalRooms} Occupied</span>
                <span className="text-emerald-700 font-bold">{venue.totalRooms - venue.occupiedRooms} Free</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Rooms Grid in Selected Venue (Items 3 to 10) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Rooms at {activeVenue.name} ({activeVenue.rooms.length})
            </h3>
            <p className="text-xs text-slate-500">Live occupancy and assigned interview panels</p>
          </div>
          <span className="text-xs font-mono text-emerald-700 font-bold">
            {activeVenue.rooms.filter((r) => r.isAvailable).length} Available for Allocation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeVenue.rooms.map((room) => (
            <div
              key={room.id}
              className={`p-4 rounded-xl border space-y-3 transition-all ${
                room.isAvailable
                  ? 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                  : 'bg-indigo-50/40 border-indigo-200'
              }`}
            >
              {/* Room Title & Availability Status */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{room.name}</h4>
                  <span className="text-[10px] font-mono text-slate-500">Room #{room.roomNumber} • Cap: {room.capacity}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${
                    room.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {room.isAvailable ? 'Available' : 'Occupied'}
                </span>
              </div>

              {/* Panel Allocation / Current Session */}
              <div className="space-y-1 text-xs">
                {room.assignedPanel ? (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Panel</span>
                    <strong className="text-slate-800">{room.assignedPanel}</strong>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No panel assigned. Ready for slot booking.</span>
                )}

                {room.currentSession && (
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Session</span>
                    <span className="text-indigo-700 font-semibold">{room.currentSession}</span>
                  </div>
                )}
              </div>

              {/* Equipment Badges */}
              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-slate-400" />
                  <span>4K Display</span>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>HMAC Terminal</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Add Room Modal (Item 3) */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Room to {activeVenue.name}</h3>
              <button onClick={() => setShowAddRoomModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Room Name</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Number / Code</label>
                  <input
                    type="text"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] leading-relaxed">
                Rooms created are automatically protected by the <strong>Zero-Trust Conflict Engine</strong>, preventing overlapping session allocations.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Create & Register Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

