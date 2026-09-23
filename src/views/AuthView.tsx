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
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between animate-in fade-in duration-150">
      {/* Top Header */}
      <header className="w-full py-4 px-4 sm:px-8 flex justify-between items-center border-b border-[#E5E7EB] bg-white shrink-0">
        <button
          type="button"
          onClick={() => setRole('SELECTION', 'selection')}
          className="flex items-center gap-2.5 cursor-pointer text-left group"
        >
          <div className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center text-white font-bold text-sm tracking-tight group-hover:bg-[#1E293B] transition-colors">
            든
          </div>
          <div>
            <span className="font-bold text-base text-neutral-900 tracking-tight block leading-none">
              든든집사
            </span>
            <span className="text-[10px] font-mono text-neutral-400">PROPTECH OS</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setRole('SELECTION', 'selection')}
          className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-lg border border-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-neutral-500" />
          <span>역할 선택으로 돌아가기</span>
        </button>
      </header>

      {/* Main Login / Register Area */}
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4">
        {/* Brand Header */}
        <div className="text-center max-w-md w-full mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>든든집사 보안 인증 서비스</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            {isLandlord ? '임대인' : '임차인'} {mode === 'LOGIN' ? '로그인' : '회원가입'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            투명한 임대차 수리 관리와 3자 실시간 조율 시스템
          </p>
        </div>

        {/* Main Card: Option A Style */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xs space-y-5">
          {/* Role Badge & Switcher */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {isLandlord ? <Building2 className="w-4 h-4" /> : <Home className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider">
                  CURRENT ROLE
                </span>
                <span className="text-xs font-bold text-neutral-900">
                  {isLandlord ? '임대인 / 건물 관리자' : '임차인 / 거주자'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRole('SELECTION', 'selection')}
              className="px-2.5 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 text-xs font-semibold rounded-md hover:bg-neutral-50 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>역할 변경</span>
            </button>
          </div>

          {/* Segmented Auth Mode Tabs */}
          <div className="flex bg-neutral-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => { setMode('LOGIN'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                mode === 'LOGIN'
                  ? 'bg-white text-neutral-900 shadow-2xs border border-neutral-200/50'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => { setMode('REGISTER'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                mode === 'REGISTER'
                  ? 'bg-white text-neutral-900 shadow-2xs border border-neutral-200/50'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              신규 회원가입
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in-50 flex items-center gap-2">
              <span className="font-bold">안내:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  이메일 계정
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-600 select-none">
                  <input type="checkbox" defaultChecked className="rounded accent-[#0F172A]" />
                  <span className="font-medium">로그인 상태 유지</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('가입하신 이메일로 비밀번호 재설정 링크가 전송되었습니다.')}
                  className="text-neutral-500 hover:text-neutral-900 font-semibold cursor-pointer transition-colors"
                >
                  비밀번호 찾기
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 sm:py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2 active:scale-98"
              >
                <span>{isLandlord ? '임대인 로그인' : '임차인 로그인'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Login Option */}
              <div className="pt-3 border-t border-neutral-100 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-semibold text-xs rounded-lg border border-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-neutral-500" />
                  <span>체험용 데모 계정으로 바로 시작</span>
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  성명 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="예: 김지수"
                    className="w-full pl-10 pr-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  이메일 주소 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  휴대폰 번호 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full pl-10 pr-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  비밀번호 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="6자리 이상"
                    className="w-full pl-10 pr-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  비밀번호 확인 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    value={regPasswordConfirm}
                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                    placeholder="비밀번호 재입력"
                    className="w-full pl-10 pr-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="pt-1.5">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-neutral-600 select-none">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded accent-[#0F172A]"
                  />
                  <span className="leading-snug font-medium">
                    든든집사 <strong className="text-neutral-900">서비스 이용약관</strong> 및 <strong className="text-neutral-900">개인정보 처리방침</strong>에 동의합니다.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 sm:py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2 active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>회원가입 완료 및 시작하기</span>
              </button>
            </form>
          )}
        </div>

        {/* Security Footer Note */}
        <div className="mt-6 flex items-center gap-1.5 text-xs text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
          <span>SSL 256비트 암호화로 개인정보 및 계약 문서를 안전하게 보호합니다.</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-[#E5E7EB] bg-white text-center text-xs text-neutral-400 shrink-0">
        © 2026 든든집사 (Deunden). All rights reserved.
      </footer>
    </div>
  );
};
