import React, { useState } from 'react';
import { Application, InterviewSlot } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
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
  Camera,
  RefreshCw
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
  const [activeTab, setActiveTab] = useState<'pass' | 'scanner' | 'otp'>('pass');
  const [otpInput, setOtpInput] = useState('');
  const [scannerScanning, setScannerScanning] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(
    slot.attendanceVerified ? 'Attendance verified previously.' : null
  );
  const [dynamicPass, setDynamicPass] = useState<{
    qrPass?: string;
    qrToken?: string;
    otpCode?: string;
    validUntil?: string;
    verified?: boolean;
  } | null>(null);
  const [isLoadingPass, setIsLoadingPass] = useState(false);

  const fetchDynamicPass = async () => {
    setIsLoadingPass(true);
    const pass = await recruitmentService.getDynamicAttendancePass(application.id);
    if (pass) {
      setDynamicPass(pass);
    }
    setIsLoadingPass(false);
  };

  React.useEffect(() => {
    fetchDynamicPass();
  }, [application.id]);

  const activeQrToken = dynamicPass?.qrPass || dynamicPass?.qrToken || slot.qrToken;
  const activeOtp = dynamicPass?.otpCode || slot.otpCode;

  // SVG QR Code generator representation
  const renderSvgQr = (token: string) => {
    return (
      <div className="w-48 h-48 bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-sm mx-auto flex flex-col items-center justify-center relative">
        {/* Crisp QR Code Graphic */}
        <div className="w-full h-full grid grid-cols-6 gap-1 p-1 bg-slate-900 rounded-lg">
          {Array.from({ length: 36 }).map((_, i) => {
            const isCorner =
              (i < 3 && i % 6 < 3) ||
              (i < 3 && i % 6 >= 3) ||
              (i >= 18 && i % 6 < 3) ||
              i === 14 ||
              i === 21 ||
              i === 27 ||
              i === 33 ||
              i === 8;
            return (
              <div
                key={i}
                className={`rounded-xs transition-colors ${
                  isCorner ? 'bg-white' : i % 2 === 0 ? 'bg-indigo-400' : 'bg-slate-900'
                }`}
              />
            );
          })}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md border-2 border-white">
            N
          </div>
        </div>
      </div>
    );
  };

  const handleSimulateScannerSuccess = () => {
    setScannerScanning(true);
    setVerificationError('');

    setTimeout(() => {
      setScannerScanning(false);
      const res = recruitmentService.verifyAttendance(application.id, 'qr', activeQrToken);
      if (res.success) {
        setVerificationSuccess(res.message);
        onCheckInSuccess();
      } else {
        setVerificationError(res.message);
      }
    }, 900);
  };

  const handleSimulateScannerInvalid = () => {
    setScannerScanning(true);
    setVerificationError('');

    setTimeout(() => {
      setScannerScanning(false);
      const res = recruitmentService.verifyAttendance(application.id, 'qr', 'INVALID_EXPIRED_TOKEN');
      if (res.success) {
        setVerificationSuccess(res.message);
      } else {
        setVerificationError(res.message);
      }
    }, 700);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');

    const res = recruitmentService.verifyAttendance(application.id, 'otp', otpInput.trim());
    if (res.success) {
      setVerificationSuccess(res.message);
      onCheckInSuccess();
    } else {
      setVerificationError(res.message);
    }
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
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Attendance Check-In
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {application.role}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers: My Pass vs Venue Scanner vs OTP Fallback */}
        <div className="p-3 bg-slate-100 border-b border-slate-200/60 flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pass')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'pass'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>My Pass</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'scanner'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Venue Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('otp')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'otp'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>OTP Fallback</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {verificationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Check-In Denied:</span>
                <span>{verificationError}</span>
              </div>
            </div>
          )}

          {verificationSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Attendance Recorded Successfully!
              </div>
              <p className="text-[11px] text-emerald-800 leading-tight">
                Checked in at Excelsoft Technologies ({slot.roomOrPanel}). Please proceed to Candidate Waiting Lounge.
              </p>
            </div>
          )}

          {/* TAB 1: IN-APP QR PASS */}
          {activeTab === 'pass' && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[11px] text-slate-500 block">
                  Show this digital pass at the Excelsoft reception desk or security scanner.
                </span>
              </div>

              {renderSvgQr(activeQrToken)}

              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    Authoritative Pass Token
                  </span>
                  <button
                    onClick={fetchDynamicPass}
                    disabled={isLoadingPass}
                    title="Refresh Dynamic Signed Token"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingPass ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-slate-800 mt-0.5 truncate max-w-xs mx-auto">
                  {activeQrToken}
                </div>
              </div>

              {/* Slot Details Card */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Scheduled Time</span>
                  <span className="font-bold text-slate-900">{slot.time}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Reporting Time</span>
                  <span className="font-bold text-indigo-700">{slot.reportingTime}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Panel / Hall</span>
                  <span className="font-bold text-slate-900">{slot.roomOrPanel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Verification OTP Code</span>
                  <span className="font-mono font-bold text-sm text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {activeOtp}
                  </span>
                </div>
              </div>

              {/* Reporting Instructions */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                  Important Check-In Instructions:
                </span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-950">
                  {slot.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: VENUE QR SCANNER (SIMULATION FOR CANDIDATE TESTING) */}
          {activeTab === 'scanner' && (
            <div className="space-y-4 text-center">
              <div className="w-56 h-56 mx-auto bg-slate-900 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-4 text-white shadow-inner">
                {/* Simulated Camera Viewfinder */}
                <div className="absolute inset-4 border-2 border-dashed border-indigo-400 rounded-2xl flex items-center justify-center">
                  {scannerScanning ? (
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                      <span className="text-[11px] font-medium text-indigo-200">Scanning Desk QR...</span>
                    </div>
                  ) : (
                    <div className="text-center p-2">
                      <Camera className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-300">Point at Venue QR Code</span>
                    </div>
                  )}
                </div>

                {/* Animated scanline */}
                {scannerScanning && (
                  <div className="absolute left-4 right-4 h-0.5 bg-indigo-500 animate-bounce top-1/2" />
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left">
                <div className="font-bold text-slate-800 mb-1">Reception Biometric Desk Test:</div>
                <p className="text-[11px] text-slate-500">
                  Simulate scanning the reception check-in desk QR to register candidate attendance in the enterprise recruitment database.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  disabled={scannerScanning || slot.attendanceVerified}
                  onClick={handleSimulateScannerSuccess}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all ${
                    slot.attendanceVerified
                      ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {slot.attendanceVerified ? 'Already Checked-In' : 'Simulate Valid Venue QR Scan'}
                  </span>
                </button>

                <button
                  disabled={scannerScanning}
                  onClick={handleSimulateScannerInvalid}
                  className="w-full py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Simulate Invalid / Expired QR Scan
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: OTP FALLBACK VERIFICATION */}
          {activeTab === 'otp' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                If the QR camera scanner encounters camera glare or hardware failure at the venue, the reception coordinator will verify candidate entry via 6-digit OTP.
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enter Desk Verification OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="e.g. 839201"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-center font-mono font-bold text-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                    <span>Valid candidate OTP:</span>
                    <button
                      type="button"
                      onClick={() => setOtpInput(slot.otpCode)}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Fill OTP ({slot.otpCode})
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={slot.attendanceVerified || !otpInput}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all ${
                    slot.attendanceVerified
                      ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Verify OTP Attendance</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close Pass
          </button>
        </div>
      </div>
    </div>
  );
};
