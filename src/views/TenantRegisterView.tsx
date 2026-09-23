import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Save, ArrowLeft, ShieldCheck, LogOut } from 'lucide-react';

export const TenantRegisterView: React.FC = () => {
  const { setActiveTab, updateUserProfile, logout } = useApp();

  const [address, setAddress] = useState('서울특별시 강남구 테헤란로 123 그린빌 302호');
  const [deposit, setDeposit] = useState('1000');
  const [rent, setRent] = useState('85');
  const [startDate, setStartDate] = useState('2023-10-15');
  const [endDate, setEndDate] = useState('2025-10-14');
  const [specialTerms, setSpecialTerms] = useState(
    '1. 에어컨 및 보일러 주요 시설 노후 고장 시 임대인 수리 책임\n2. 세입자 고의 및 과실로 인한 파손은 세입자 원상복구 부담 원칙 적용\n3. 전세보증금 반환 보증보험 가입 동의'
  );
  const [name, setName] = useState('김지우');
  const [phone, setPhone] = useState('010-3829-1029');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      userId: 'tenant-jiwoo',
      name,
      phone,
      role: 'TENANT',
      address,
      deposit,
      rent,
      specialTerms,
    });
    alert('임차인 회원정보 및 계약 정보가 안전하게 저장되었습니다.');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-900">임차인 계정 로그인 완료</h3>
            <p className="text-xs text-neutral-500">기본 회원 정보 및 거주지 정보를 확인 후 수리 요청 서비스를 이용해 보세요.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="px-3 py-1.5 bg-white text-rose-600 border border-neutral-200 hover:bg-rose-50 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>로그아웃</span>
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 font-semibold text-xs cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>대시보드로 돌아가기</span>
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-neutral-900">임차인 회원정보 및 임대차 등록</h2>
          <span className="font-mono text-xs text-neutral-400">그린빌 302호</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-neutral-200 space-y-5">
        {/* Personal Authentication */}
        <div className="bg-neutral-50 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-neutral-200">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-xs text-neutral-900">본인 인증 완료 (NICE 평가정보)</p>
              <p className="text-[11px] text-neutral-500">실명 및 거주자 본인 확인이 완료되었습니다.</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 font-mono">인증완료됨</span>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">임차인 성명</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">휴대폰 번호</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono outline-none focus:bg-white focus:border-blue-600"
            />
          </div>
        </div>

        {/* Address Field with Search Button */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">거주지 소재지 주소</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
            />
            <button
              type="button"
              onClick={() => alert('도로명 주소 검색창이 열립니다.')}
              className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-neutral-500" />
              <span>주소 검색</span>
            </button>
          </div>
        </div>

        {/* Rent & Deposit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">임대 보증금 (만원)</label>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">월 차임/월세 (만원)</label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
            />
          </div>
        </div>

        {/* Contract Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">계약 시작일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">계약 만료일</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
            />
          </div>
        </div>

        {/* Special Terms */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            계약서 특약 조항 및 기타 메모
          </label>
          <textarea
            rows={3}
            value={specialTerms}
            onChange={(e) => setSpecialTerms(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600 resize-none font-mono"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2 border border-neutral-200 text-neutral-600 font-semibold text-xs rounded-lg hover:bg-neutral-50 cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>정보 저장</span>
          </button>
        </div>
      </form>
    </div>
  );
};
