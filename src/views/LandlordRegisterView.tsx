import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Save, ArrowLeft, LogOut } from 'lucide-react';

export const LandlordRegisterView: React.FC = () => {
  const { setActiveTab, propertyUnits, updateUserProfile, logout } = useApp();

  const [landlordName, setLandlordName] = useState('김지수');
  const [landlordPhone, setLandlordPhone] = useState('010-9988-1234');
  const [landlordEmail, setLandlordEmail] = useState('jisoo.kim@dundun.com');
  const [templateNotes, setTemplateNotes] = useState(
    '1. 모든 수리 요청은 든든집사 앱 비교 견적 시스템을 통해 사전 승인 후 진행함.\n2. 세입자 고의 및 과실로 인한 파손은 세입자 원상복구 부담 원칙 적용.'
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      userId: 'landlord-jisoo',
      name: landlordName,
      phone: landlordPhone,
      email: landlordEmail,
      role: 'LANDLORD',
      specialTerms: templateNotes,
    });
    alert('임대인 프로필 및 보유 매물 설정이 성공적으로 저장되었습니다.');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Banner indicating auto-login completed */}
      <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-900">임대인 계정 로그인 완료</h3>
            <p className="text-xs text-neutral-500">기본 프로필 정보 및 소유 매물 목록을 확인 후 수리 관리 서비스를 시작하세요.</p>
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
        <h2 className="text-sm font-bold text-neutral-900">임대인 계정 및 보유 매물 정보</h2>
      </div>

      <form onSubmit={handleSave} className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-neutral-200 space-y-5">
        {/* Profile Details */}
        <div>
          <h3 className="text-xs font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-neutral-700" />
            <span>임대인 기본 인적사항</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">성명</label>
              <input
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">연락처</label>
              <input
                type="text"
                value={landlordPhone}
                onChange={(e) => setLandlordPhone(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">이메일</label>
              <input
                type="email"
                value={landlordEmail}
                onChange={(e) => setLandlordEmail(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono outline-none focus:bg-white focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Managed Units List */}
        <div className="pt-3 border-t border-neutral-100">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-xs font-bold text-neutral-900">관리 중인 임대 호실 목록</h3>
              <p className="text-[11px] text-neutral-400">등록된 총 {propertyUnits.length}개 호실</p>
            </div>
          </div>

          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
            {propertyUnits.map((u) => (
              <div key={u.id} className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div>
                  <span className="font-bold text-neutral-900">{u.unitNumber}</span>
                  <span className="text-neutral-400 ml-2">임차인: {u.tenantName} ({u.tenantPhone})</span>
                </div>
                <div className="text-neutral-500 tabular-nums">
                  보증금 {u.deposit} / 월 {u.monthlyRent} · 만료 {u.leaseEndDate}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Terms */}
        <div className="pt-3 border-t border-neutral-100">
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            임대차 계약서 공통 수리 특약 문구
          </label>
          <textarea
            rows={3}
            value={templateNotes}
            onChange={(e) => setTemplateNotes(e.target.value)}
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
            <span>설정 저장하기</span>
          </button>
        </div>
      </form>
    </div>
  );
};
