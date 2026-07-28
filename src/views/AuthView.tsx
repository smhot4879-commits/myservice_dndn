import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Home, Lock, Mail, Phone, User, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { role, setRole, setActiveTab, updateUserProfile } = useApp();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login state
  const [loginEmail, setLoginEmail] = useState(
    role === 'LANDLORD' ? 'landlord@dundun.app' : 'tenant@dundun.app'
  );
  const [loginPassword, setLoginPassword] = useState('123456');

  // Register state
  const [regName, setRegName] = useState(role === 'LANDLORD' ? '김지수' : '김지우');
  const [regEmail, setRegEmail] = useState(role === 'LANDLORD' ? 'landlord@dundun.app' : 'tenant@dundun.app');
  const [regPhone, setRegPhone] = useState('010-1234-5678');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');

  const isLandlord = role === 'LANDLORD';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }
    setErrorMessage('');

    // Update profile & proceed
    updateUserProfile({
      userId: `user-${Date.now()}`,
      name: isLandlord ? '김지수 관리자' : '김지우 님',
      phone: '010-1234-5678',
      email: loginEmail,
      role: role,
    });

    // Move to dashboard
    setActiveTab('dashboard');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword) {
      setErrorMessage('필수 회원가입 정보를 모두 입력해 주세요.');
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!termsAgreed) {
      setErrorMessage('서비스 이용약관 동의가 필요합니다.');
      return;
    }
    setErrorMessage('');

    // Update profile
    updateUserProfile({
      userId: `user-${Date.now()}`,
      name: regName,
      phone: regPhone,
      email: regEmail,
      role: role,
    });

    // Move to landlord-register or tenant-register for initial setup
    if (isLandlord) {
      setActiveTab('landlord-register');
    } else {
      setActiveTab('tenant-register');
    }
  };

  const handleQuickDemoLogin = () => {
    updateUserProfile({
      userId: isLandlord ? 'landlord-1' : 'tenant-1',
      name: isLandlord ? '김지수 (임대인)' : '김지우 (임차인)',
      phone: '010-8888-9999',
      email: isLandlord ? 'landlord@dundun.app' : 'tenant@dundun.app',
      role: role,
    });
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-8 px-4">
      {/* Brand Header */}
      <div className="text-center max-w-md w-full mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0054cc]/10 border border-[#0054cc]/20 text-[#0054cc] font-bold text-xs mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>든든집사 보안 인증</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1b1c1c] tracking-tight">
          {isLandlord ? '임대인' : '임차인'} 로그인 & 회원가입
        </h1>
        <p className="text-xs sm:text-sm text-[#424655] mt-1">
          투명한 부동산 수리 관리 및 실시간 대화 서비스를 시작하세요.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#c2c6d8]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-xl">
        {/* Role Badge & Switcher */}
        <div className="bg-[#f6f3f2] rounded-2xl p-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white ${isLandlord ? 'bg-[#0054cc]' : 'bg-[#636100]'}`}>
              {isLandlord ? <Building2 className="w-5 h-5" /> : <Home className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#727787] block">선택된 역할</span>
              <span className="text-sm font-extrabold text-[#1b1c1c]">
                {isLandlord ? '임대인 / 관리자' : '임차인 / 거주자'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRole('SELECTION', 'selection')}
            className="px-3 py-1.5 bg-white border border-[#c2c6d8]/60 text-[#424655] hover:text-[#0054cc] text-xs font-bold rounded-xl shadow-2xs hover:border-[#0054cc]/40 transition-all flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>역할 변경</span>
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex bg-[#f0eded] p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'LOGIN' ? 'bg-white text-[#0054cc] shadow-md' : 'text-[#727787] hover:text-[#1b1c1c]'
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => { setMode('REGISTER'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'REGISTER' ? 'bg-white text-[#0054cc] shadow-md' : 'text-[#727787] hover:text-[#1b1c1c]'
            }`}
          >
            신규 회원가입
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#ffdad6] border border-[#ffb4ab] text-[#93000a] text-xs font-bold animate-in fade-in-50">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                이메일 주소
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727787]" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="example@dundun.app"
                  className="w-full pl-10 pr-4 py-3 bg-[#f6f3f2] border border-[#c2c6d8]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0054cc] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727787]" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#f6f3f2] border border-[#c2c6d8]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0054cc] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#424655]">
                <input type="checkbox" defaultChecked className="rounded accent-[#0054cc]" />
                <span>로그인 상태 유지</span>
              </label>
              <button
                type="button"
                onClick={() => alert('비밀번호 재설정 링크가 입력하신 이메일로 발송됩니다.')}
                className="text-[#0054cc] hover:underline font-bold"
              >
                비밀번호 찾기
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLandlord ? '임대인 계정으로 로그인' : '임차인 계정으로 로그인'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Login Option */}
            <div className="pt-4 border-t border-[#f0eded] text-center">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1c1c] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#0054cc]" />
                <span>데모 계정으로 즉시 시험 로그인</span>
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                이름 (성함) <span className="text-[#ef4444]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727787]" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f6f3f2] border border-[#c2c6d8]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0054cc] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                이메일 주소 <span className="text-[#ef4444]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727787]" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="example@dundun.app"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f6f3f2] border border-[#c2c6d8]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0054cc] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                휴대폰 번호 <span className="text-[#ef4444]">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727787]" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f6f3f2] border border-[#c2c6d8]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0054cc] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                비밀번호 <span className="text-[#ef4444]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727787]" />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="6자리 이상 입력"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f6f3f2] border border-[#c2c6d8]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0054cc] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                비밀번호 확인 <span className="text-[#ef4444]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727787]" />
                <input
                  type="password"
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  placeholder="비밀번호 재입력"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f6f3f2] border border-[#c2c6d8]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0054cc] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-[#424655]">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 rounded accent-[#0054cc]"
                />
                <span>
                  든든집사 <strong className="text-[#0054cc]">서비스 이용약관</strong> 및 <strong className="text-[#0054cc]">개인정보 처리방침</strong>에 동의합니다.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>회원가입 완료 및 서비스 시작</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
