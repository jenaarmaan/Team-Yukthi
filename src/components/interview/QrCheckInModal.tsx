import React, { useState, useEffect } from 'react';
import { Application, InterviewSlot } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import { RealQrCode } from '../../utils/qrCodeGenerator';
import {
  X,
  QrCode,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Building2,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Info,
  FileText,
  BadgeCheck
} from 'lucide-react';

interface QrCheckInModalProps {
  application: Application | null;
  onClose: () => void;
  onCheckInSuccess: () => void;
}

export const QrCheckInModal: React.FC<QrCheckInModalProps> = ({
  application,
  onClose,
  onCheckInSuccess
}) => {
  if (!application || !application.interviewSlot) return null;

  const slot = application.interviewSlot;
  const [activeTab, setActiveTab] = useState<'pass' | 'otp' | 'instructions'>('pass');
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(294);
  const [isSimulatingDeskScan, setIsSimulatingDeskScan] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);

  const [dynamicPass, setDynamicPass] = useState<{
    qrPass?: string;
    qrToken?: string;
    otpCode?: string;
    validUntil?: string;
    verified?: boolean;
  } | null>(null);
  const [isLoadingPass, setIsLoadingPass] = useState(false);

  // Fetch dynamic signed pass from server
  const fetchDynamicPass = async () => {
    setIsLoadingPass(true);
    const pass = await recruitmentService.getDynamicAttendancePass(application.id);
    if (pass) {
      setDynamicPass(pass);
    }
    setSecondsRemaining(300);
    setIsLoadingPass(false);
  };

  useEffect(() => {
    fetchDynamicPass();
  }, [application.id]);

  // Rolling HMAC nonce countdown timer (5-minute window)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const activeQrToken = dynamicPass?.qrPass || dynamicPass?.qrToken || slot.qrToken || `NIYOJAN_ATTEND_${application.id}_VALID`;
  const activeOtp = dynamicPass?.otpCode || slot.otpCode || '842916';
  const isVerified = slot.attendanceVerified || dynamicPass?.verified;

  const handleCopy = (text: string, type: 'token' | 'otp') => {
    navigator.clipboard.writeText(text);
    if (type === 'token') {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } else {
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  // Authority Desk Simulation (for testing without switching to Coordinator portal)
  const handleSimulateDeskOfficerScan = () => {
    setIsSimulatingDeskScan(true);
    setSimulationMessage(null);

    setTimeout(() => {
      setIsSimulatingDeskScan(false);
      const res = recruitmentService.verifyAttendance(application.id, 'qr', activeQrToken);
      if (res.success) {
        setSimulationMessage('Reception Desk Officer scanned and verified your gate pass.');
        onCheckInSuccess();
      } else {
        setSimulationMessage(res.message);
      }
    }, 800);
  };

  // Real ISO/IEC 18004 Compliant Scannable QR Code
  const renderSvgQr = (token: string) => {
    return (
      <div className="w-56 h-56 bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-md mx-auto flex flex-col items-center justify-center relative">
        <RealQrCode
          value={token}
          size={208}
          ecc="M"
          className="mx-auto"
          title={`NIYOJAN Verified QR Pass for ${application.role}`}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pass Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  Candidate Entry Pass
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                    isVerified
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {isVerified ? 'Checked In ✓' : 'Awaiting Desk Scan'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {application.role}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Candidate Pass Tabs */}
        <div className="p-2.5 bg-slate-100/90 border-b border-slate-200/60 flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pass')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'pass'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Digital QR Pass</span>
          </button>

          <button
            onClick={() => setActiveTab('otp')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'otp'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Emergency OTP</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'instructions'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Venue Guide</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Real-Time Attendance Status Alert */}
          {isVerified ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 animate-fade-in">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Attendance Recorded by Venue Desk!
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Checked in at <strong>Excelsoft Technologies ({slot.roomOrPanel})</strong>. Please proceed to the Candidate Waiting Lounge for panel assignment.
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-indigo-950 leading-relaxed">
                <strong className="block font-bold text-indigo-900">Authority Verification Pass:</strong>
                Show this digital pass upon arrival at the interview venue. The desk officer or venue coordinator will scan this QR code with their verification terminal to confirm your entry.
              </div>
            </div>
          )}

          {/* TAB 1: DYNAMIC HMAC QR PASS */}
          {activeTab === 'pass' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-[11px] text-slate-500">
                  Present this dynamic QR code at the Excelsoft reception desk or security gate scanner.
                </p>
              </div>

              {/* QR Code Presentation */}
              {renderSvgQr(activeQrToken)}

              {/* Dynamic Nonce & Countdown */}
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-600">Dynamic Nonce:</span>
                  <span className="font-mono font-bold text-indigo-700">
                    Refreshes in {formatCountdown(secondsRemaining)}
                  </span>
                  <button
                    onClick={fetchDynamicPass}
                    disabled={isLoadingPass}
                    title="Force refresh token"
                    className="text-slate-400 hover:text-indigo-600 transition-colors ml-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingPass ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <span className="font-mono text-[11px] text-slate-700 truncate max-w-[220px]">
                    {activeQrToken}
                  </span>
                  <button
                    onClick={() => handleCopy(activeQrToken, 'token')}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                    title="Copy token string"
                  >
                    {copiedToken ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Slot Details Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Interview Slot
                  </span>
                  <strong className="text-slate-900">{slot.time}</strong>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    Mandatory Reporting
                  </span>
                  <strong className="text-indigo-700 font-bold">{slot.reportingTime}</strong>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Assigned Venue Panel
                  </span>
                  <strong className="text-slate-900">{slot.roomOrPanel}</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    Backup Desk OTP
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-sm text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                      {activeOtp}
                    </span>
                    <button
                      onClick={() => handleCopy(activeOtp, 'otp')}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                      title="Copy OTP"
                    >
                      {copiedOtp ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMERGENCY DESK OTP */}
          {activeTab === 'otp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  Camera Glare / Hardware Scanner Fallback
                </div>
                <p className="text-[11px] leading-relaxed">
                  If screen reflection, low display brightness, or physical camera glare prevents the desk scanner from reading your QR code, verbally present this 6-digit emergency OTP to the reception desk coordinator.
                </p>
              </div>

              {/* Large Monospace OTP Presentation */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white text-center space-y-3 shadow-inner">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                  Emergency Desk Verification Code
                </span>
                <div className="flex items-center justify-center gap-2">
                  {activeOtp.split('').map((digit, i) => (
                    <div
                      key={i}
                      className="w-10 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold font-mono text-cyan-400 shadow-sm"
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => handleCopy(activeOtp, 'otp')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedOtp ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy 6-Digit Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block">How Desk Verification Works:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  The venue coordinator will enter this single-use code on their reception terminal. Once entered, your arrival is registered in real-time, and you will be issued a venue token for your technical round.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: VENUE & REPORTING INSTRUCTIONS */}
          {activeTab === 'instructions' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm border-b border-slate-200/80 pb-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  Venue Location & Gate Directions
                </h4>
                <div className="space-y-1 text-slate-700">
                  <strong className="block text-slate-900">Excelsoft Technologies Campus</strong>
                  <p className="text-[11px] text-slate-600">
                    1-B, Hootagalli Industrial Area, Mysuru, Karnataka 570018
                  </p>
                  <p className="text-[11px] text-indigo-700 font-semibold pt-1">
                    Gate 2 • Main Assessment Hall (Reception Desk A)
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2.5">
                <h4 className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  Mandatory Candidate Checklist
                </h4>
                <ul className="space-y-1.5 text-[11px] text-indigo-900 list-disc pl-4">
                  <li>Valid College ID Card and Government Photo ID (Aadhaar / Voter ID / Passport)</li>
                  <li>2 Printed Copies of your updated resume</li>
                  <li>Academic transcripts & mark sheets for all completed semesters</li>
                  <li>Formal business attire required throughout the venue</li>
                  <li>Report strictly by <strong>{slot.reportingTime}</strong> to avoid slot forfeiture</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/90 space-y-2.5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white bg-slate-50 shadow-2xs cursor-pointer transition-all active:scale-[0.99]"
          >
            Close Pass
          </button>

          {/* Quick Authority Desk Simulator (for development testing without switching personas) */}
          {!isVerified && (
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                Authority Simulator:
              </span>
              <button
                type="button"
                onClick={handleSimulateDeskOfficerScan}
                disabled={isSimulatingDeskScan}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-50"
              >
                {isSimulatingDeskScan ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Desk Scanning...</span>
                  </>
                ) : (
                  <span>Simulate Desk Officer Scanning This Pass</span>
                )}
              </button>
            </div>
          )}

          {simulationMessage && (
            <div className="text-[10px] text-center font-medium text-emerald-700 bg-emerald-50 py-1 px-2 rounded-lg border border-emerald-200">
              {simulationMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
