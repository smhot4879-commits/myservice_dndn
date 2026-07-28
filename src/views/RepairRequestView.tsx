import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Wrench, Upload, Image as ImageIcon, Camera, Check, ArrowLeft, Send, FolderPlus, ShieldCheck, Trash2, X, Plus, FileText, Lock, Calculator, UserCheck, PhoneCall, DollarSign, FileSpreadsheet } from 'lucide-react';
import { RepairCase, Estimate } from '../types';

export const RepairRequestView: React.FC = () => {
  const { role, addRepairCase, setActiveTab } = useApp();

  const [category, setCategory] = useState<RepairCase['category']>('에어컨');
  const [title, setTitle] = useState('거실 에어컨 냉방 불량 수리');
  const [symptom, setSymptom] = useState(
    '에어컨을 켜면 찬바람이 나오지 않고 미지근한 바람만 불며 실외기에서 고주파 음이 발생합니다.'
  );
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
  ]);
  const [estimatePhotos, setEstimatePhotos] = useState<string[]>([]);
  
  // Text Estimate State
  const [showTextForm, setShowTextForm] = useState(false);
  const [textVendorName, setTextVendorName] = useState('');
  const [textContactPerson, setTextContactPerson] = useState('');
  const [textPhone, setTextPhone] = useState('');
  const [textAmount, setTextAmount] = useState('');
  const [textDetails, setTextDetails] = useState('');
  const [textEstimates, setTextEstimates] = useState<Array<{
    id: string;
    vendorName: string;
    contactPerson: string;
    phone: string;
    amount: number;
    details: string;
  }>>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload Modal State & File Input Refs
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadModalTarget, setUploadModalTarget] = useState<'photos' | 'estimates'>('photos');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const estimateFileInputRef = useRef<HTMLInputElement>(null);

  const categories: RepairCase['category'][] = ['에어컨', '누수/수도', '전기/조명', '창호/문', '기타'];

  // Open Upload Modal with specified target
  const handleOpenUploadModal = (target: 'photos' | 'estimates') => {
    setUploadModalTarget(target);
    setShowUploadModal(true);
  };

  // Local File Reader Handler for External Uploads
  const handleLocalFiles = (files: FileList | null, target: 'photos' | 'estimates') => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/') && !file.type.includes('pdf')) {
        alert('이미지 파일(JPG, PNG, WEBP 등) 또는 PDF 파일만 업로드 가능합니다.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultUrl = event.target.result as string;
          if (target === 'photos') {
            setPhotos((prev) => [...prev, resultUrl]);
          } else {
            setEstimatePhotos((prev) => [...prev, resultUrl]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLocalFiles(e.dataTransfer.files, uploadModalTarget);
    }
  };

  const handleAddSamplePhoto = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    ];
    const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    if (uploadModalTarget === 'photos') {
      setPhotos((prev) => [...prev, randomImg]);
    } else {
      setEstimatePhotos((prev) => [...prev, randomImg]);
    }
  };

  const handleAddTextEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textVendorName.trim()) {
      alert('업체명을 입력해주세요.');
      return;
    }
    const numAmount = parseInt(textAmount.replace(/[^0-9]/g, ''), 10) || 0;
    if (numAmount <= 0) {
      alert('견적 금액을 올바르게 입력해주세요.');
      return;
    }

    const newTe = {
      id: `text-est-${Date.now()}`,
      vendorName: textVendorName.trim(),
      contactPerson: textContactPerson.trim() || '담당자 미지정',
      phone: textPhone.trim() || '연락처 미기재',
      amount: numAmount,
      details: textDetails.trim() || '견적 수리 상세 상담 완료',
    };

    setTextEstimates((prev) => [...prev, newTe]);
    // Reset form fields
    setTextVendorName('');
    setTextContactPerson('');
    setTextPhone('');
    setTextAmount('');
    setTextDetails('');
    setShowTextForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !symptom) {
      alert('수리 제목과 상세 증상을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    // Build initialEstimates array for context
    const initialEstimates: Estimate[] = [
      ...textEstimates.map((te) => ({
        id: te.id,
        vendorName: te.vendorName,
        amount: te.amount,
        details: te.details,
        expectedDate: '상담 후 일정 협의',
        isApproved: false,
        contact: te.phone,
        contactPerson: te.contactPerson,
      })),
      ...estimatePhotos.map((photoUrl, idx) => ({
        id: `est-photo-${Date.now()}-${idx}`,
        vendorName: `(주) 파일 첨부 견적업체 #${idx + 1}`,
        amount: 150000 + idx * 20000,
        details: '첨부 견적서 파일 기반 수리 요청',
        expectedDate: '2026.07.28 14:00',
        isApproved: false,
        fileUrl: photoUrl,
      })),
    ];

    setTimeout(() => {
      addRepairCase({
        unit: '그린빌 302호',
        tenantName: role === 'LANDLORD' ? '박서준 님' : '김지우 님',
        title,
        category,
        symptom,
        photos,
        estimatePhotos,
        initialEstimates,
      });

      setIsSubmitting(false);
      alert('수리 요청서 및 견적 정보가 정상적으로 접수되었습니다! 대화방으로 이동합니다.');
      setActiveTab('chat');
    }, 600);
  };

  if (role === 'LANDLORD') {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-3xl shadow-xs border border-[#c2c6d8]/40 text-center space-y-4 my-12 animate-in fade-in duration-300">
        <Wrench className="w-12 h-12 text-[#0054cc] mx-auto" />
        <h2 className="text-xl font-bold text-[#1b1c1c]">임대인 수리 요청 불가 안내</h2>
        <p className="text-sm text-[#424655] leading-relaxed">
          수리 요청서 등록은 임차인만 접수 가능합니다. 임대인은 임차인이 등록한 수리 요청건에 대한 비교 견적 검토 및 승인을 진행합니다.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-6 py-3 bg-[#0054cc] text-white font-bold text-sm rounded-xl cursor-pointer hover:bg-[#066bfd] transition-all"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Hidden File Inputs for Local Device Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleLocalFiles(e.target.files, uploadModalTarget)}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={(e) => handleLocalFiles(e.target.files, uploadModalTarget)}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
      <input
        type="file"
        ref={estimateFileInputRef}
        onChange={(e) => handleLocalFiles(e.target.files, 'estimates')}
        accept="image/*,.pdf"
        multiple
        className="hidden"
      />

      <div className="flex items-center justify-between border-b border-[#c2c6d8]/40 pb-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 text-[#424655] hover:text-[#0054cc] font-bold text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>대시보드로 돌아가기</span>
        </button>
        <h2 className="text-xl font-extrabold text-[#1b1c1c]">수리 요청서 작성</h2>
        <span className="text-xs text-[#0054cc] font-bold bg-[#0054cc]/10 px-3 py-1 rounded-full">
          양식에 맞춘 안전 접수
        </span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30 space-y-6">
        {/* Step 1: Category */}
        <div>
          <label className="block text-xs font-bold text-[#424655] mb-2">1. 고장 수리 카테고리 선택</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                  category === cat
                    ? 'bg-[#0054cc] text-white border-[#0054cc] shadow-md scale-102'
                    : 'bg-[#f6f3f2] text-[#424655] border-transparent hover:bg-[#e5e2e1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Title */}
        <div>
          <label className="block text-xs font-bold text-[#424655] mb-1">2. 수리 요청 제목</label>
          <input
            type="text"
            required
            placeholder="예: 거실 에어컨 냉방 불량 수리 요청"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3.5 bg-[#f6f3f2] border border-[#c2c6d8] rounded-2xl text-sm font-semibold focus:border-[#0054cc] outline-none"
          />
        </div>

        {/* Step 3: Detailed Symptom */}
        <div>
          <label className="block text-xs font-bold text-[#424655] mb-1">
            3. 상세 고장 증상 및 희망 수리 일시
          </label>
          <textarea
            rows={4}
            required
            placeholder="고장 부위, 소음 유무, 발생 시점 및 주말/평일 희망 방문 시간을 구체적으로 적어주세요."
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            className="w-full p-3.5 bg-[#f6f3f2] border border-[#c2c6d8] rounded-2xl text-sm font-medium focus:border-[#0054cc] outline-none"
          />
        </div>

        {/* Step 4: Photo Attachments */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-[#424655]">4. 고장 현장 사진 첨부 ({photos.length}장)</label>
            <button
              type="button"
              onClick={() => handleOpenUploadModal('photos')}
              className="text-xs text-[#0054cc] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>사진 추가하기</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-[#c2c6d8] group">
                <img src={url} alt={`Photo ${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleOpenUploadModal('photos')}
              className="aspect-video rounded-2xl border-2 border-dashed border-[#c2c6d8] hover:border-[#0054cc] bg-[#f6f3f2] hover:bg-white transition-all flex flex-col items-center justify-center gap-1 text-[#727787] hover:text-[#0054cc] cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              <span className="text-[11px] font-bold">사진 직접 등록</span>
            </button>
          </div>
        </div>

        {/* Step 5: Comparative Quote Attachment or Text Registration */}
        <div className="pt-4 border-t border-[#c2c6d8]/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-[#1b1c1c]">5. 업체 견적서 등록 (선택 사항)</p>
              <p className="text-[11px] text-[#727787]">
                받으신 견적서 사진/파일을 등록하거나, 서면 견적이 없는 경우 TEXT로 직접 입력하세요.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenUploadModal('estimates')}
                className="px-3 py-1.5 bg-[#f0eded] hover:bg-[#e5e2e1] text-[#0054cc] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>견적서 사진/파일 업로드</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTextForm(!showTextForm)}
                className={`px-3 py-1.5 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  showTextForm
                    ? 'bg-[#1b1c1c] text-white'
                    : 'bg-[#0054cc]/10 hover:bg-[#0054cc]/20 text-[#0054cc]'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{showTextForm ? '입력창 닫기' : '견적 TEXT로 등록'}</span>
              </button>
            </div>
          </div>

          {/* Form for TEXT Estimate Registration */}
          {showTextForm && (
            <div className="p-5 bg-[#EFF2F8] border-2 border-[#0054cc] rounded-2xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#c2c6d8]/40 pb-2">
                <h4 className="text-xs font-extrabold text-[#0054cc] flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>견적 정보 직접 (TEXT) 등록</span>
                </h4>
                <span className="text-[10px] text-[#727787] font-semibold">서면 견적서 미발급 업체 전용</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#424655] mb-1">
                    업체명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 성진에어컨 수리센터"
                    value={textVendorName}
                    onChange={(e) => setTextVendorName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#c2c6d8] rounded-xl text-xs font-semibold focus:border-[#0054cc] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#424655] mb-1">
                    담당자명 / 기사님 성함
                  </label>
                  <input
                    type="text"
                    placeholder="예: 박철수 기사님"
                    value={textContactPerson}
                    onChange={(e) => setTextContactPerson(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#c2c6d8] rounded-xl text-xs font-semibold focus:border-[#0054cc] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#424655] mb-1">
                    업체 연락처
                  </label>
                  <input
                    type="text"
                    placeholder="예: 010-1234-5678"
                    value={textPhone}
                    onChange={(e) => setTextPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#c2c6d8] rounded-xl text-xs font-semibold focus:border-[#0054cc] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#424655] mb-1">
                    견적 금액 (원) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 120000"
                    value={textAmount}
                    onChange={(e) => setTextAmount(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#c2c6d8] rounded-xl text-xs font-bold text-[#0054cc] focus:border-[#0054cc] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#424655] mb-1">
                  견적 내용 및 수리 범위 설명
                </label>
                <input
                  type="text"
                  placeholder="예: 실외기 모터 교체, 가스 누설 완충 점검 및 출장 공임비 포함"
                  value={textDetails}
                  onChange={(e) => setTextDetails(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#c2c6d8] rounded-xl text-xs font-medium focus:border-[#0054cc] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowTextForm(false)}
                  className="px-4 py-2 bg-white text-[#424655] font-bold text-xs rounded-xl border border-[#c2c6d8] hover:bg-[#f6f3f2] cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleAddTextEstimate}
                  className="px-5 py-2 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>견적 TEXT 추가하기</span>
                </button>
              </div>
            </div>
          )}

          {/* Registered List Display (Photos/Files + Text Estimates) */}
          <div className="space-y-3">
            {/* Registered Text Estimates */}
            {textEstimates.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#0054cc] block">
                  등록된 TEXT 견적 ({textEstimates.length}건)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {textEstimates.map((te) => (
                    <div
                      key={te.id}
                      className="p-3.5 bg-[#EFF2F8] border border-[#0054cc]/40 rounded-2xl relative space-y-1.5 shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setTextEstimates((prev) => prev.filter((item) => item.id !== te.id))}
                        className="absolute top-3 right-3 text-[#727787] hover:text-[#EF4444] cursor-pointer p-0.5 rounded-md hover:bg-white transition-all"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 pr-6">
                        <span className="bg-[#0054cc] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          TEXT 견적
                        </span>
                        <h5 className="font-extrabold text-xs text-[#1b1c1c] truncate">{te.vendorName}</h5>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#c2c6d8]/40">
                        <span className="text-[11px] text-[#424655] flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-[#0054cc]" />
                          {te.contactPerson} ({te.phone})
                        </span>
                        <span className="font-black text-sm text-[#0054cc]">
                          {te.amount.toLocaleString()}원
                        </span>
                      </div>

                      <p className="text-[11px] text-[#727787] line-clamp-1 italic">
                        "{te.details}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registered Estimate Photos/Files */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#424655]">
                  첨부된 견적서 파일/사진 ({estimatePhotos.length}장)
                </span>
                {estimatePhotos.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setEstimatePhotos([])}
                    className="text-[10px] text-[#EF4444] hover:underline cursor-pointer"
                  >
                    전체 삭제
                  </button>
                )}
              </div>

              {estimatePhotos.length === 0 && textEstimates.length === 0 ? (
                <div
                  onClick={() => handleOpenUploadModal('estimates')}
                  className="p-4 rounded-2xl border-2 border-dashed border-[#c2c6d8] hover:border-[#0054cc] bg-[#f6f3f2] hover:bg-white text-center cursor-pointer transition-all flex items-center justify-center gap-2 text-[#727787] hover:text-[#0054cc]"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-xs font-bold">견적서 사진/파일 또는 TEXT 직접 등록하기</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {estimatePhotos.map((url, i) => (
                    <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-[#0054cc] relative group">
                      <img src={url} alt={`Quote ${i}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-[#0054cc] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        견적서 #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEstimatePhotos((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleOpenUploadModal('estimates')}
                    className="aspect-video rounded-2xl border-2 border-dashed border-[#c2c6d8] hover:border-[#0054cc] bg-[#f6f3f2] hover:bg-white transition-all flex flex-col items-center justify-center gap-1 text-[#727787] hover:text-[#0054cc] cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[11px] font-bold">견적서 추가 파일</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-base rounded-2xl shadow-xl hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span>접수 중...</span>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>임대인에게 수리 승인 요청하기</span>
            </>
          )}
        </button>
      </form>

      {/* External Photo/File Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#f0eded] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-6 h-6 text-[#0054cc]" />
                  <h3 className="text-xl font-bold text-[#1b1c1c]">
                    {uploadModalTarget === 'photos'
                      ? '고장 현장 사진 업로드'
                      : '견적서 서류/사진 파일 업로드'}
                  </h3>
                </div>
                <p className="text-xs text-[#727787] mt-1">
                  스마트폰, 컴퓨터의 로컬 갤러리 또는 카메라로 직접 촬영한 파일을 첨부하세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-[#727787] hover:text-[#1b1c1c] text-2xl font-bold cursor-pointer p-1 rounded-lg hover:bg-[#f0eded]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Permission & Security Badge */}
            <div className="bg-[#10B981]/10 border border-[#10B981]/30 p-3.5 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-[#10B981]">외부 업로드 권한 허용 상태</span>
                <p className="text-[#424655] text-[11px] mt-0.5">
                  내 디바이스 파일 선택 및 실시간 카메라 촬영이 정상적으로 허용되었습니다.
                </p>
              </div>
            </div>

            {/* Drag & Drop Main Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer space-y-3 ${
                dragActive
                  ? 'border-[#0054cc] bg-[#0054cc]/10 scale-102'
                  : 'border-[#c2c6d8] hover:border-[#0054cc] bg-[#fcf9f8] hover:bg-white'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0054cc]/10 text-[#0054cc] flex items-center justify-center mx-auto">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <p className="font-extrabold text-sm text-[#1b1c1c]">
                  여기 클릭하여 내 컴퓨터/모바일 파일 선택
                </p>
                <p className="text-xs text-[#727787] mt-1">
                  {uploadModalTarget === 'photos'
                    ? '또는 고장 사진을 이곳으로 드래그 앤 드롭 하세요 (JPG, PNG, WEBP)'
                    : '또는 견적서 사진/PDF 서류를 이곳으로 드래그 앤 드롭 하세요'}
                </p>
              </div>
              <span className="inline-block text-[11px] font-bold text-[#0054cc] bg-[#0054cc]/10 px-3 py-1 rounded-full">
                최대 10MB 고화질 원본 지원
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-3.5 px-4 bg-[#0054cc] hover:bg-[#066bfd] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>내 기기 파일 탐색기 열기</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="py-3.5 px-4 bg-[#1b1c1c] hover:bg-[#333] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>카메라로 즉시 촬영하기</span>
              </button>
            </div>

            {/* Optional Presets / Sample Photos */}
            <div className="pt-2 border-t border-[#f0eded]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#424655]">샘플 파일 추가가 필요한 경우</span>
                <button
                  type="button"
                  onClick={handleAddSamplePhoto}
                  className="text-xs text-[#0054cc] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>샘플 추가</span>
                </button>
              </div>
            </div>

            {/* Currently Uploaded Preview List inside Modal */}
            <div>
              <h4 className="text-xs font-bold text-[#1b1c1c] mb-2 flex items-center justify-between">
                <span>
                  {uploadModalTarget === 'photos'
                    ? `첨부 완료된 현장 사진 (${photos.length}장)`
                    : `첨부 완료된 견적서 서류/사진 (${estimatePhotos.length}장)`}
                </span>
                {(uploadModalTarget === 'photos' ? photos.length : estimatePhotos.length) > 0 && (
                  <button
                    type="button"
                    onClick={() => (uploadModalTarget === 'photos' ? setPhotos([]) : setEstimatePhotos([]))}
                    className="text-[11px] text-[#EF4444] hover:underline font-normal cursor-pointer"
                  >
                    전체 삭제
                  </button>
                )}
              </h4>

              {(uploadModalTarget === 'photos' ? photos : estimatePhotos).length === 0 ? (
                <div className="p-6 bg-[#f6f3f2] rounded-2xl text-center text-xs text-[#727787]">
                  등록된 파일이 없습니다. 위 영역을 통해 파일을 첨부하세요.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto p-1">
                  {(uploadModalTarget === 'photos' ? photos : estimatePhotos).map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-[#c2c6d8] group">
                      <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          uploadModalTarget === 'photos'
                            ? setPhotos((prev) => prev.filter((_, i) => i !== idx))
                            : setEstimatePhotos((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        ×
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Close Button */}
            <div className="pt-2 border-t border-[#f0eded]">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="w-full py-3.5 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                첨부 완료 및 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

