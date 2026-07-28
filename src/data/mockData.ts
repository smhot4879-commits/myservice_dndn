import { RepairCase, NotificationItem, PropertyUnit, LegalFAQ, CaseStudy, ChatMessage } from '../types';

export const INITIAL_PROPERTY_UNITS: PropertyUnit[] = [
  {
    id: 'unit-1',
    buildingName: '그린빌',
    unitName: '302호',
    address: '서울특별시 강남구 테헤란로 123',
    tenantName: '박서준 님',
    tenantPhone: '010-3829-1029',
    status: '입주중',
    contractEnd: '2024.12.15 (D-45)',
    monthlyRent: 85,
    deposit: 1000,
  },
  {
    id: 'unit-2',
    buildingName: '서초 그랑자이',
    unitName: '101호',
    address: '서울특별시 서초구 효령로 403',
    tenantName: '이지아 님',
    tenantPhone: '010-4820-9912',
    status: '입주중',
    contractEnd: '2025.05.20',
    monthlyRent: 95,
    deposit: 2000,
  },
  {
    id: 'unit-3',
    buildingName: '한남 더힐',
    unitName: '504호',
    address: '서울특별시 용산구 독서당로 111',
    tenantName: '신규 계약 대기',
    tenantPhone: '010-0000-0000',
    status: '초대 대기',
    contractEnd: '2024.11.10 입주 예정',
    monthlyRent: 120,
    deposit: 3000,
  },
];

export const INITIAL_REPAIR_CASES: RepairCase[] = [
  {
    id: 'req-001',
    unit: '그린빌 302호',
    tenantName: '김지우 님',
    title: '거실 에어컨 냉방 불량 수리',
    category: '에어컨',
    symptom: '에어컨 작동시 찬바람이 나오지 않고 작동음만 발생하며 시원해지지 않습니다. 냉매 가스 누수 또는 컴프레셔 문제로 추정됩니다.',
    status: 'QUOTE_UPLOADED',
    createdAt: '2026.07.24 10:30',
    updatedAt: '2026.07.26 01:15',
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80'
    ],
    estimates: [
      {
        id: 'est-1',
        vendorName: '(주) 바른수리 인테리어',
        amount: 150000,
        details: '에어컨 냉매가스 충전 및 배관 누설 부위 정밀 점검/방수 코팅',
        expectedDate: '2026.07.27(토) 10:00',
        isApproved: false,
        isRecommended: true,
      },
      {
        id: 'est-2',
        vendorName: '에어컨 닥터 24',
        amount: 180000,
        details: '가스 전체 회수 후 교체 및 실외기 팬 모터 분해 세척',
        expectedDate: '2026.07.28(일) 14:00',
        isApproved: false,
      },
      {
        id: 'est-3',
        vendorName: 'CleanAir 케어솔루션',
        amount: 220000,
        details: '실외기 부품 교체 포함 전체 시스템 정밀 수리',
        expectedDate: '2026.07.29(월) 11:00',
        isApproved: false,
      }
    ],
    moveInRecord: {
      photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      note: '2023-10-15 입주 시 촬영: 에어컨 실외기 연결부 미세 냉매 흔적 사전 체크됨.',
      recordedAt: '2023.10.15',
    }
  },
  {
    id: 'req-002',
    unit: '302호',
    tenantName: '박서준 님',
    title: '욕실 세면대 누수 점검',
    category: '누수/수도',
    symptom: '세면대 하부 배관 고무 패킹 부식으로 수전 사용 시 밑으로 물이 샙니다.',
    status: 'REQUESTED',
    createdAt: '2026.07.26 01:20',
    updatedAt: '2026.07.26 01:20',
    photos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    ],
    estimates: [
      {
        id: 'est-201',
        vendorName: '삼화설비',
        amount: 80000,
        details: '세면대 하부 트랩 및 팝업 전체 교체',
        expectedDate: '2026.07.27 15:00',
        isApproved: false,
      }
    ]
  },
  {
    id: 'req-003',
    unit: '504호',
    tenantName: '신규 입주자',
    title: '504호 입주 전 도배 장판 완료 건',
    category: '기타',
    symptom: '입주 전 벽지 곰팡이 제거 및 친환경 장판 교체',
    status: 'COMPLETED',
    createdAt: '2026.07.20',
    updatedAt: '2026.07.25',
    photos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    ],
    estimates: [
      {
        id: 'est-301',
        vendorName: '한샘 하우징',
        amount: 450000,
        details: '전체 도배 및 소음 차단 장판 시공 완료',
        expectedDate: '2026.07.24',
        isApproved: true,
      }
    ],
    completionReport: {
      beforePhoto: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      afterPhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      beforeNote: '방 모서리 부근 결로성 곰팡이 및 장판 얼룩 심함.',
      afterNote: '곰팡이 완전 방제 처리 후 단열 벽지 시공 및 고급 강마루 장판 교체 완료.',
      completedAt: '2026.07.25 14:30',
      vendorName: '(주) 바른수리 인테리어',
      finalAmount: 450000,
      specialNotes: '시공 후 1년간 하자 보수 보증서 발행 완료. 임차인 최종 검수 서명 수령함.'
    }
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    repairCaseId: 'req-001',
    sender: 'LANDLORD',
    senderName: '임대인 김지수',
    message: '안녕하세요 지우님! 에어컨 수리 요청 접수 확인했습니다. 오늘 기사님 방문 가능한 견적서가 도착했는지 같이 확인해 볼까요?',
    timestamp: '오후 1:15',
    createdAt: 1700000001000,
  },
  {
    id: 'msg-2',
    repairCaseId: 'req-001',
    sender: 'TENANT',
    senderName: '김지우 님',
    message: '네! 방금 업체 3곳 비교 견적을 올려두었습니다. 입주 당시 에어컨 실외기 부분 상태 찍어둔 기록도 첨부해 두었으니 확인 부탁드려요.',
    timestamp: '오후 1:20',
    createdAt: 1700000002000,
  },
  {
    id: 'msg-3',
    repairCaseId: 'req-001',
    sender: 'SYSTEM',
    senderName: '든든집사 알림',
    message: '임차인 김지우 님이 입주 시 상태 기록(증빙 자료)을 등록하셨습니다.',
    timestamp: '오후 1:21',
    type: 'MOVE_IN_EVIDENCE',
    attachmentUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    createdAt: 1700000003000,
  },
  {
    id: 'msg-4',
    repairCaseId: 'req-001',
    sender: 'LANDLORD',
    senderName: '임대인 김지수',
    message: '기록 확인했습니다. 입주 당시 결함으로 인정되므로 수리비는 임대인이 전액 부담하겠습니다. (주) 바른수리 인테리어 15만원 견적으로 승인 진행할게요.',
    timestamp: '오후 1:25',
    createdAt: 1700000004000,
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'REPAIR',
    title: '견적 승인 완료: 거실 에어컨 수리',
    message: '거실 에어컨 누수 수리에 대한 견적(₩150,000)이 승인되었습니다. 수리 기사 배정이 시작됩니다.',
    timestamp: '방금 전',
    isRead: false,
    caseId: 'req-001'
  },
  {
    id: 'notif-2',
    type: 'MESSAGE',
    title: '임대인(김지수) 님으로부터 메시지',
    message: '"안녕하세요, 수리 기사님 방문 시간을 확인해 주실 수 있나요? 이번 주 토요일 오전 10시가..."',
    timestamp: '15분 전',
    isRead: false,
    caseId: 'req-001'
  },
  {
    id: 'notif-3',
    type: 'CONTRACT',
    title: '임대 계약 만료 30일 전 안내',
    message: '서울특별시 강남구 테헤란로 123 그린빌 302호 계약이 45일 후 만료됩니다. 갱신 의사를 확인해 주세요.',
    timestamp: '2시간 전',
    isRead: true,
  },
  {
    id: 'notif-4',
    type: 'LEGAL',
    title: '2026년 주택임대차보호법 수리비 분담 가이드',
    message: '에어컨 수리비, 보일러 고장 시 임대인과 임차인의 수선 분담 기준을 명확하게 정리해 드립니다.',
    timestamp: '어제',
    isRead: false,
  }
];

export const LEGAL_FAQS: LegalFAQ[] = [
  {
    id: 'faq-1',
    question: '에어컨 및 보일러 고장 수리비, 임대인과 임차인 중 누가 내나요?',
    answer: '민법 제623조에 따라 임대인은 임차인이 목적물을 사용·수익에 필요한 상태를 유지하게 할 의무(수선의무)를 집니다. 에어컨, 보일러, 누수 등 주택의 주요 설비 노후 및 자연 파손은 임대인 부담이 원칙입니다. 단, 임차인의 고의·과실 또는 소모품(전구, 도어락 건전지 등) 교체는 임차인이 부담합니다.',
    category: '수리 책임 소재',
    tags: ['수리비분담', '임대차보호법', '민법623조']
  },
  {
    id: 'faq-2',
    question: '전세/월세 계약 만료 전 이사할 경우 중개수수료(복비)는 누가 내나요?',
    answer: '원칙적으로 계약 기간을 채우지 못한 경우 임대인이 지급하는 것이 법적 원칙이나, 관행상 임차인이 합의하에 부담하는 경우가 많습니다. 특약 사항에 "중도 퇴거 시 임차인이 중개수수료 부담" 문구가 있는지 확인이 필요합니다.',
    category: '계약 및 이사',
    tags: ['중개수수료', '복비', '중도퇴거']
  },
  {
    id: 'faq-3',
    question: '묵시적 갱신 후 임차인이 계약 해지를 통보하면 언제 효력이 발생하나요?',
    answer: '주택임대차보호법 제6조의2에 따라 묵시적 갱신 상태에서 임차인은 언제든지 임대인에게 계약 해지를 통보할 수 있으며, 임대인이 통지를 받은 날로부터 3개월이 지나면 효력이 발생합니다.',
    category: '계약 갱신',
    tags: ['묵시적갱신', '계약해지', '3개월후효력']
  },
  {
    id: 'faq-4',
    question: '곰팡이 수리비 분쟁 발생 시 책임 판정 기준은 무엇인가요?',
    answer: '건물 자체의 구조적 결함(외벽 단열 부실, 누수 등)으로 인한 곰팡이는 임대인 책임입니다. 반면 환기 소홀, 실내 빨래 건조 등으로 발생한 곰팡이는 임차인 책임으로 판단됩니다. 판례에서는 비중에 따라 6:4 또는 5:5로 분담하도록 조정되기도 합니다.',
    category: '수리 책임 소재',
    tags: ['곰팡이', '결로', '책임분담']
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    title: '반려동물 사육으로 인한 도배 및 장판 손상 원상복구 판결',
    summary: '사전 승인 없는 반려동물 사육으로 발생한 벽지 훼손 및 오염은 임차인의 원상복구 의무 대상이라는 법원 판결.',
    verdict: 'WIN',
    date: '2023.11.14',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cs-2',
    title: '결로 현상 및 환기 미흡으로 인한 곰팡이 수리비 분쟁 조정',
    summary: '건물 구조적 단열 결함과 임차인의 환기 주의의무 소홀이 정복되어 비용을 6:4 비율로 상호 분담하도록 조정한 분쟁 위원회 사례.',
    verdict: 'COMPROMISE',
    date: '2023.10.05',
    imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=600&q=80'
  }
];
