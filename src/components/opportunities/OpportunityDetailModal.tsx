import React, { useState } from 'react';
import { HiringDrive, CandidateProfile } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface OpportunityDetailModalProps {
  drive: HiringDrive | null;
  candidateProfile: CandidateProfile;
  onClose: () => void;
  onRegisteredSuccess: () => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  drive,
  candidateProfile,
  onClose,
  onRegisteredSuccess
}) => {
  if (!drive) return null;

  const [selectedLocation, setSelectedLocation] = useState<string>(
    drive.locations.find((l) => candidateProfile.preferredLocations.includes(l)) || drive.locations[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState<{ status: string; message: string } | null>(null);

  // Check eligibility
  const eligibility = recruitmentService.checkEligibility(drive.id);
  const isCapacityFull = drive.currentRegistrations >= drive.interviewCapacity;

  // Check if candidate already applied
  const existingApp = recruitmentService
    .getCandidateApplications()
    .find((a) => a.hiringDriveId === drive.id);

  const handleRegister = () => {
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const result = recruitmentService.registerForHiringDrive(drive.id, selectedLocation);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessInfo({
          status: result.application?.status || 'confirmed',
          message: result.message
        });
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                {drive.company}
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{drive.role}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {successInfo ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                {successInfo.message}
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    onClose();
                    onRegisteredSuccess();
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  View in My Applications
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Department & Drive Overview */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Division: {drive.department}
                </span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{drive.description}</p>
              </div>

              {/* Key Meta Badges */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hiring Date</span>
                  <span className="font-bold text-slate-900">Nov 20, 2026</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registration Closes</span>
                  <span className="font-bold text-slate-900">Nov 15, 2026</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Positions</span>
                  <span className="font-bold text-indigo-700">{drive.totalOpenings} Openings</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Capacity</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {drive.currentRegistrations} / {drive.interviewCapacity} Slots
                  </span>
                </div>
              </div>

              {/* AUTOMATED ELIGIBILITY ENGINE BREAKDOWN */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-700" />
                    <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      Eligibility Evaluation
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      eligibility.isEligible
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {eligibility.isEligible ? 'Criteria Met ✓' : 'Ineligible'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {/* CGPA */}
                  <div className="flex items-center justify-between bg-white/70 p-2 rounded-lg">
                    <span className="text-slate-600">
                      Minimum CGPA: <strong>{drive.minimumCgpa}</strong>
                    </span>
                    <span className="font-bold flex items-center gap-1">
                      {eligibility.cgpaStatus.passed ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {eligibility.cgpaStatus.actual} (Passed)
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1 font-mono">
                          <XCircle className="w-3.5 h-3.5" />
                          {eligibility.cgpaStatus.actual} (Short)
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Degree */}
                  <div className="flex items-center justify-between bg-white/70 p-2 rounded-lg">
                    <span className="text-slate-600">
                      Degree: <strong>{drive.requiredDegree.join(', ')}</strong>
                    </span>
                    <span className="font-bold">
                      {eligibility.degreeStatus.passed ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {candidateProfile.education.degree}
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Mismatch
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Candidate Type */}
                  <div className="flex items-center justify-between bg-white/70 p-2 rounded-lg">
                    <span className="text-slate-600">Candidate Type</span>
                    <span className="font-bold">
                      {eligibility.candidateTypeStatus.passed ? (
                        <span className="text-emerald-700 flex items-center gap-1 capitalize">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {candidateProfile.candidateType}
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1 capitalize">
                          <XCircle className="w-3.5 h-3.5" />
                          {candidateProfile.candidateType} (Drive is {drive.eligibleCandidateTypes.join('/')})
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {!eligibility.isEligible && (
                  <p className="text-[11px] text-rose-700 pt-1 font-medium">
                    Note: {eligibility.reasons.join('. ')}
                  </p>
                )}
              </div>

              {/* Skills Required */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Mandatory Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {drive.mandatorySkills.map((sk) => {
                    const hasSkill = candidateProfile.skills.some((cs) =>
                      cs.name.toLowerCase().includes(sk.toLowerCase())
                    );
                    return (
                      <span
                        key={sk}
                        className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                          hasSkill
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {hasSkill ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        )}
                        <span>{sk}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Location Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Select Preferred Interview Venue *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {drive.locations.map((loc) => {
                    const isSelected = selectedLocation === loc;
                    const isCandidatePref = candidateProfile.preferredLocations.includes(loc);

                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setSelectedLocation(loc)}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <MapPin
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isSelected ? 'text-indigo-600' : 'text-slate-400'
                          }`}
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{loc}</div>
                          {isCandidatePref && (
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              Preferred choice
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recruitment Pipeline Stages Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Evaluation Stages
                </h4>
                <div className="space-y-2 border-l-2 border-indigo-200 pl-3 ml-1 text-xs text-slate-600">
                  {drive.stages.map((stage, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-white" />
                      <span className="font-semibold text-slate-800">Round {idx + 1}:</span> {stage}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notice if capacity full */}
              {isCapacityFull && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  <div className="font-bold text-amber-900">Waitlist Advisory:</div>
                  <p className="mt-0.5 text-[11px] leading-relaxed">
                    Primary capacity ({drive.interviewCapacity} candidates) has been reached. Submitting will place your application in the Dynamic Waitlist queue.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Footer */}
        {!successInfo && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/70">
            {existingApp ? (
              <div className="text-center py-1">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Already Applied ({existingApp.status.toUpperCase()})
                </span>
              </div>
            ) : (
              <button
                disabled={!eligibility.isEligible || isSubmitting}
                onClick={handleRegister}
                className={`w-full h-11 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all ${
                  eligibility.isEligible
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>
                  {isSubmitting
                    ? 'Validating & Registering...'
                    : isCapacityFull
                    ? 'Register for Waitlist Queue'
                    : 'Submit Application & Request Slot'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
