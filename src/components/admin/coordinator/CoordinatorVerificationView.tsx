import React, { useState } from 'react';
import { recruitmentService } from '../../../services/storageService';
import {
  QrCode,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Building2,
  User,
  Zap,
  Camera,
  History,
  RotateCcw,
  Send,
  Lock
} from 'lucide-react';

export const CoordinatorVerificationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qr_scan' | 'otp_verify'>('qr_scan');
  const [scannedCode, setScannedCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    title: string;
    message: string;
    candidateName?: string;
    role?: string;
    room?: string;
    timestamp?: string;
  } | null>(null);

  // OTP State (Step 11)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('cand_01');
  const [inputOtp, setInputOtp] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('842916');
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState<number>(3);
  const [otpExpired, setOtpExpired] = useState<boolean>(false);
  const [otpSentMessage, setOtpSentMessage] = useState<string | null>(null);

  // Verification Logs (Items 12 & 10)
  const [verificationLogs, setVerificationLogs] = useState<
    { id: string; method: 'QR Pass' | 'OTP Code'; candidate: string; status: 'verified' | 'rejected'; timestamp: string; detail: string }[]
  >([
    {
      id: 'vlog_01',
      method: 'QR Pass',
      candidate: 'Rohan Sharma',
      status: 'verified',
      timestamp: '08:48 AM',
      detail: 'Cryptographic HMAC validated for GSE 2026 Panel A-01.'
    },
    {
      id: 'vlog_02',
      method: 'OTP Code',
      candidate: 'Pooja Patel',
      status: 'verified',
      timestamp: '09:52 AM',
      detail: '6-digit OTP validated on first attempt.'
    },
    {
      id: 'vlog_03',
      method: 'QR Pass',
      candidate: 'Unknown Token (Simulated Attack)',
      status: 'rejected',
      timestamp: '09:15 AM',
      detail: 'Blocked: Invalid cryptographic signature.'
    }
  ]);

  // Execute QR Scan verification (Step 10)
  const handleVerifyQr = (tokenToVerify?: string) => {
    const token = tokenToVerify || scannedCode;
    if (!token.trim()) return;

    setIsScanning(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (token.includes('INVALID') || token.includes('expired')) {
        setVerificationResult({
          success: false,
          title: 'Verification Failed: Expired or Forged Token',
          message: 'The submitted QR token failed cryptographic HMAC verification or has expired past its 15-minute gate window.'
        });
        setVerificationLogs((prev) => [
          {
            id: `vlog_${Date.now()}`,
            method: 'QR Pass',
            candidate: 'Failed Token Scan',
            status: 'rejected',
            timestamp: currentTime,
            detail: 'HMAC signature mismatch.'
          },
          ...prev
        ]);
        return;
      }

      if (token.includes('DUPLICATE')) {
        setVerificationResult({
          success: false,
          title: 'Duplicate Check-in Blocked',
          message: 'This HMAC pass has already been used to check in at 08:48 AM. Tokens cannot be reused.'
        });
        return;
      }

      // Successful verification
      setVerificationResult({
        success: true,
        title: 'Check-in Verified: Candidate Admitted',
        message: 'Cryptographic HMAC token successfully verified. Attendance recorded and interviewer panel notified.',
        candidateName: 'Rohan Sharma',
        role: 'Graduate Software Engineer',
        room: 'Panel Room A-01 (Mysuru Campus)',
        timestamp: currentTime
      });

      setVerificationLogs((prev) => [
        {
          id: `vlog_${Date.now()}`,
          method: 'QR Pass',
          candidate: 'Rohan Sharma',
          status: 'verified',
          timestamp: currentTime,
          detail: 'Admitted to Panel Room A-01.'
        },
        ...prev
      ]);
      setScannedCode('');
    }, 500);
  };

  // Dispatch OTP
  const handleDispatchOtp = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpAttemptsLeft(3);
    setOtpExpired(false);
    setOtpSentMessage(`Secure 6-digit OTP [${randomOtp}] simulated to candidate phone (+91 98765-XXXXX). Valid for 5 mins.`);
  };

  // Validate OTP (Step 11)
  const handleValidateOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (otpExpired) {
      alert('This OTP has expired. Please generate a new code.');
      return;
    }

    if (inputOtp.trim() === generatedOtp) {
      setVerificationResult({
        success: true,
        title: 'OTP Authentication Verified!',
        message: 'OTP validated successfully. Candidate check-in recorded for scheduled interview slot.',
        candidateName: 'Pooja Patel',
        role: 'Graduate Software Engineer',
        room: 'Panel Room A-01',
        timestamp: currentTime
      });

      setVerificationLogs((prev) => [
        {
          id: `vlog_${Date.now()}`,
          method: 'OTP Code',
          candidate: 'Pooja Patel',
          status: 'verified',
          timestamp: currentTime,
          detail: 'OTP verified successfully.'
        },
        ...prev
      ]);
      setInputOtp('');
    } else {
      const remaining = otpAttemptsLeft - 1;
      setOtpAttemptsLeft(remaining);
      if (remaining <= 0) {
        setOtpExpired(true);
        alert('Maximum incorrect attempts exceeded. OTP locked.');
      } else {
        alert(`Incorrect OTP entered! ${remaining} attempt(s) remaining.`);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner & Sub-Tabs */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                ZERO-TRUST GATE TERMINAL
              </span>
              <h2 className="text-xl font-bold text-slate-900">QR Pass & OTP Verification Desk</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify candidate arrival at interview gate with dynamic HMAC QR passes or fallback 6-digit OTP codes
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('qr_scan')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'qr_scan'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Scanner Desk</span>
            </button>
            <button
              onClick={() => setActiveTab('otp_verify')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'otp_verify'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>OTP Terminal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Verification Workstation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Scanner or OTP Terminal */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* TAB 1: QR PASS SCANNER SIMULATOR (Step 10) */}
          {activeTab === 'qr_scan' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-900">Gate A Optical QR Scanner</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  READY FOR SCAN
                </span>
              </div>

              {/* Simulated Camera Viewfinder Window */}
              <div className="relative aspect-video max-h-[260px] w-full bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-800">
                
                {/* Viewfinder Reticle */}
                <div className="relative w-40 h-40 border-2 border-indigo-500/80 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  {/* Glowing Laser Scan Line */}
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-pulse" />
                  <QrCode className="w-16 h-16 text-indigo-400/50" />
                </div>

                <div className="absolute bottom-3 text-center text-[10px] text-slate-400">
                  Align candidate's dynamic HMAC QR pass within target reticle
                </div>
              </div>

              {/* Token Input & Simulator Buttons */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    placeholder="Enter or scan HMAC QR token (e.g. hmac_qr_9921_valid)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleVerifyQr()}
                    disabled={isScanning || !scannedCode.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                  >
                    {isScanning ? 'Verifying...' : 'Verify Token'}
                  </button>
                </div>

                {/* Quick Simulation Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Test Simulation:</span>
                  <button
                    onClick={() => handleVerifyQr('hmac_qr_rohan_valid_slot_01')}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Scan Valid Pass (Rohan Sharma)
                  </button>
                  <button
                    onClick={() => handleVerifyQr('hmac_qr_duplicate_already_used')}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    Scan Duplicate Token
                  </button>
                  <button
                    onClick={() => handleVerifyQr('hmac_qr_INVALID_signature')}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Scan Forged Pass
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: OTP VERIFICATION TERMINAL (Step 11) */}
          {activeTab === 'otp_verify' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-900">SMS / OTP Attendance Verification</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  FALLBACK PROTOCOL
                </span>
              </div>

              {/* Candidate Selection & Dispatch */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Candidate for OTP Verification</label>
                  <select
                    value={selectedCandidateId}
                    onChange={(e) => setSelectedCandidateId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold text-slate-800"
                  >
                    <option value="cand_01">Pooja Patel (Graduate Software Engineer - Panel A-01)</option>
                    <option value="cand_02">Vikram Aditya (Cloud DevOps - Boardroom C-01)</option>
                    <option value="cand_03">Sneha Kulkarni (GSE Standby Slot - Panel B-02)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDispatchOtp}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Generate & Send 6-Digit OTP</span>
                  </button>
                  <span className="text-[10px] text-slate-500">Attempts left: {otpAttemptsLeft}</span>
                </div>

                {otpSentMessage && (
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-mono">
                    {otpSentMessage}
                  </div>
                )}
              </div>

              {/* OTP Entry Form */}
              <form onSubmit={handleValidateOtp} className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter Candidate 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value)}
                    placeholder="e.g. 842916"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-center font-mono font-black text-lg tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputOtp.trim() || inputOtp.length !== 6 || otpExpired}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
                >
                  Authenticate & Verify Attendance
                </button>
              </form>

            </div>
          )}

          {/* Verification Result Notification Card */}
          {verificationResult && (
            <div
              className={`p-5 rounded-2xl border space-y-3 animate-in fade-in zoom-in-95 ${
                verificationResult.success
                  ? 'bg-emerald-50/90 border-emerald-200 text-slate-800'
                  : 'bg-rose-50/90 border-rose-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {verificationResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
                <h4 className="font-bold text-sm text-slate-900">{verificationResult.title}</h4>
              </div>

              <p className="text-xs text-slate-700">{verificationResult.message}</p>

              {verificationResult.candidateName && (
                <div className="p-3 rounded-xl bg-white/80 border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Candidate</span>
                    <strong className="text-slate-900">{verificationResult.candidateName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Interview Room</span>
                    <strong className="text-indigo-700">{verificationResult.room}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Verification Audit Logs Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-sm text-slate-900">Live Verification Event Stream</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">● Streaming</span>
            </div>

            <div className="space-y-3">
              {verificationLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.candidate}</span>
                    <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-slate-600">{log.detail}</p>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="font-semibold text-indigo-700">{log.method}</span>
                    <span
                      className={`font-bold font-mono px-1.5 py-0.5 rounded ${
                        log.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

