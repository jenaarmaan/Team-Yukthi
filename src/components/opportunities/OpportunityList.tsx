import React, { useState } from 'react';
import { HiringDrive, CandidateProfile } from '../../types/recruitment';
import {
  Search,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  Filter,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface OpportunityListProps {
  drives: HiringDrive[];
  candidateProfile: CandidateProfile;
  onSelectDrive: (drive: HiringDrive) => void;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({
  drives,
  candidateProfile,
  onSelectDrive
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all'); // all, fresher, experienced

  // Extract all unique locations
  const allLocations = Array.from(new Set(drives.flatMap((d) => d.locations)));

  // Filter logic
  const filteredDrives = drives.filter((drive) => {
    // Search
    const matchesSearch =
      drive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.mandatorySkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    // Location
    const matchesLocation =
      selectedLocation === 'all' || drive.locations.includes(selectedLocation);

    // Candidate Type
    const matchesType =
      selectedType === 'all' || drive.eligibleCandidateTypes.includes(selectedType as any);

    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Search and Filters */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Excelsoft roles, skills (Java, React)..."
            className="w-full pl-9 pr-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 shadow-xs"
          />
        </div>

        {/* Candidate Preferred Location Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedLocation('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedLocation === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            All Locations
          </button>
          {allLocations.map((loc) => {
            const isPreferred = candidateProfile.preferredLocations.includes(loc);
            const isSelected = selectedLocation === loc;
            return (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1 transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{loc}</span>
                {isPreferred && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="In your preferred locations" />
                )}
              </button>
            );
          })}
        </div>

        {/* Candidate Type segmented tabs */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setSelectedType('all')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              selectedType === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            All Drives ({drives.length})
          </button>
          <button
            onClick={() => setSelectedType('fresher')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              selectedType === 'fresher' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Fresher (2026)
          </button>
          <button
            onClick={() => setSelectedType('experienced')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              selectedType === 'experienced' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Experienced
          </button>
        </div>
      </div>

      {/* Drive List */}
      <div className="space-y-3">
        {filteredDrives.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No hiring drives match your search.</p>
            <p className="text-[11px] text-slate-400 mt-1">Try clearing filters or search terms.</p>
          </div>
        ) : (
          filteredDrives.map((drive) => {
            const hasPreferredLocation = drive.locations.some((l) =>
              candidateProfile.preferredLocations.includes(l)
            );
            const isCandidateTypeMatch = drive.eligibleCandidateTypes.includes(
              candidateProfile.candidateType
            );

            return (
              <div
                key={drive.id}
                onClick={() => onSelectDrive(drive)}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer relative"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                      {drive.company}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                      {drive.role}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Open
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {drive.description}
                </p>

                {/* Key metadata chips */}
                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {drive.locations.join(', ')}
                    {hasPreferredLocation && (
                      <span className="text-emerald-600 font-bold ml-0.5" title="Matches your preferred location">
                        ★ Match
                      </span>
                    )}
                  </span>

                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-slate-400" />
                    {drive.eligibleCandidateTypes.map((t) => (t === 'fresher' ? 'Fresher' : 'Exp.')).join('/')} · Min CGPA {drive.minimumCgpa}
                  </span>

                  <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md font-medium">
                    {drive.totalOpenings} Openings
                  </span>
                </div>

                {/* Mandatory skills preview */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate max-w-[230px]">
                    <span className="font-semibold text-slate-700">Skills:</span>
                    <span className="truncate">{drive.mandatorySkills.join(', ')}</span>
                  </div>

                  <span className="text-indigo-600 font-bold text-xs flex items-center gap-0.5 shrink-0">
                    Apply <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
