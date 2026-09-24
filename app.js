/**
 * CLB CẦU LÔNG SMASH - QUẢN LÝ SÂN, VÍ & ĐIỂM DANH
 * File: app.js
 * Comprehensive client-side state management, automated court fee tiers,
 * wallet deduction, financial transactions, matchmaking, and data backup.
 */

// ==========================================
// HỆ THỐNG ĐA CÂU LẠC BỘ (MULTI-CLUB REGISTRY & STATE RESOLUTION)
// ==========================================
const CLUBS_REGISTRY_KEY = 'CLB_CAU_LONG_REGISTRY_V1';
const ACTIVE_CLUB_ID_KEY = 'CLB_ACTIVE_CLUB_ID_V1';

const DEFAULT_DEFAULT_CLUB = {
  id: 'club_smash',
  accessSlug: 'smash',
  name: 'CLB CẦU LÔNG SMASH',
  shortName: 'SMASH',
  logoIcon: '🏸',
  themeColor: 'emerald',
  bankInfo: 'MBBANK - 0987654321 - CLB CAU LONG SMASH',
  createdAt: '01/01/2026',
  storageKey: 'CLB_CAU_LONG_SMASH_DATA_V1',
  adminName: 'Trần Đức Chính',
  adminUsername: 'chinh',
  phone: '0901000001',
  isDeveloperSample: true
};

const DEFAULT_SECOND_CLUB = {
  id: 'club_lightning',
  accessSlug: 'tiachop',
  name: 'CLB CẦU LÔNG TIA CHỚP',
  shortName: 'TIA CHỚP',
  logoIcon: '⚡',
  themeColor: 'cyan',
  bankInfo: 'TECHCOMBANK - 190333333333 - NGUYEN HOANG LONG',
  createdAt: '15/02/2026',
  storageKey: 'CLB_CAU_LONG_DATA_club_lightning',
  adminName: 'Nguyễn Hoàng Long',
  adminUsername: 'long_admin',
  phone: '0988123456',
  isDeveloperSample: true
};

function generateAccessSlug(name) {
  if (!name) return 'clb';
  let str = name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
  // Strip common prefix words
  str = str.replace(/\b(cau\s*long|câu\s*lạc\s*bộ|clb|cau|long)\b/gi, ' ');
  str = str.trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!str) str = 'clb-' + Math.floor(Math.random() * 1000);
  return str;
}

function initSecondClubDataIfMissing() {
  try {
    if (!localStorage.getItem(DEFAULT_SECOND_CLUB.storageKey)) {
      const secondClubData = {
        config: {
          clubName: 'CLB CẦU LÔNG TIA CHỚP',
          accessSlug: 'tiachop',
          themeColor: 'cyan',
          bankInfo: 'TECHCOMBANK - 190333333333 - NGUYEN HOANG LONG',
          leadership: {
            president: 'M001',
            vicePresident1: 'M002',
            vicePresident2: 'M003',
            secretary: 'M005',
            treasurer: 'M004',
            media: 'M007',
            advisor1: '',
            advisor2: ''
          },
          dailyBoxPrice: 350000,
          shuttlecocksPerBox: 12,
          dailyRateTitle: 'ĐƠN GIÁ THEO NGÀY 12',
          shuttleBillingMode: 'BY_SHUTTLE',
          shuttleUnitPrice: 29167,
          defaultShuttlesPerSession: 6,
          viceLeaderId: 'M002',
          permissions: {
            allowViceLeaderAttendance: true,
            allowViceLeaderTournamentSync: true
          },
          guestPrices: { GUEST_A: 90000, GUEST_B: 70000, GUEST_C: 50000 },
          feeTiers: [
            { id: 1, name: 'Bậc 1 (0–4 buổi)', minSessions: 0, maxSessions: 4, price: 50000 },
            { id: 2, name: 'Bậc 2 (5–9 buổi)', minSessions: 5, maxSessions: 9, price: 100000 },
            { id: 3, name: 'Bậc 3 (10–15 buổi)', minSessions: 10, maxSessions: 15, price: 150000 },
            { id: 4, name: 'Bậc 4 (16–30+ buổi)', minSessions: 16, maxSessions: 999, price: 200000 }
          ],
          allowNegativeWallet: true,
          settlementMode: 'MONTHLY',
          defaultSettlementDay: 'END_OF_MONTH'
        },
        funds: {
          clubFund: 3500000,
          advanceFund: 1200000,
          shuttleAdvanceFund: 600000,
          courtAdvanceFund: 450000,
          guestAdvanceIncome: 150000,
          shuttlePaidTotal: 580000,
          courtPaidTotal: 1200000
        },
        members: [
          { id: 'M001', name: 'Nguyễn Hoàng Long', chipName: 'LONG', phone: '0988123456', type: 'OFFICIAL', username: 'long_admin', password: '123', balance: 500000, monthlySessions: 4, role: 'ADMIN', status: 'ACTIVE', permissions: getRoleDefaultPermissions('ADMIN') },
          { id: 'M002', name: 'Trần Bảo Ngọc', chipName: 'NGỌC', phone: '0988111002', type: 'OFFICIAL', username: 'ngoc', password: '123', balance: 400000, monthlySessions: 3, role: 'VICE_ADMIN', status: 'ACTIVE', permissions: getRoleDefaultPermissions('VICE_ADMIN') },
          { id: 'M003', name: 'Lê Quốc Huy', chipName: 'HUY', phone: '0988111003', type: 'OFFICIAL', username: 'huy', password: '123', balance: 450000, monthlySessions: 4, role: 'VICE_ADMIN', status: 'ACTIVE', permissions: getRoleDefaultPermissions('VICE_ADMIN') },
          { id: 'M004', name: 'Phạm Thu Thảo', chipName: 'THẢO', phone: '0988111004', type: 'OFFICIAL', username: 'thao', password: '123', balance: 600000, monthlySessions: 5, role: 'TREASURER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('TREASURER') },
          { id: 'M005', name: 'Vũ Minh Đức', chipName: 'ĐỨC', phone: '0988111005', type: 'OFFICIAL', username: 'duc', password: '123', balance: 350000, monthlySessions: 2, role: 'REFEREE', status: 'ACTIVE', permissions: getRoleDefaultPermissions('REFEREE') },
          { id: 'M006', name: 'Đỗ Văn Nam', chipName: 'NAM', phone: '0988111006', type: 'OFFICIAL', username: 'nam', password: '123', balance: 300000, monthlySessions: 2, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
          { id: 'M007', name: 'Hoàng Yến Nhi', chipName: 'NHI', phone: '0988111007', type: 'OFFICIAL', username: 'nhi', password: '123', balance: 500000, monthlySessions: 4, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
          { id: 'M008', name: 'Bùi Anh Tuấn', chipName: 'TUẤN', phone: '0988111008', type: 'HONORARY', username: 'tuan', password: '123', balance: 250000, monthlySessions: 2, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
          { id: 'G001', name: 'Khách Giao Lưu 1', chipName: 'K1', phone: '', type: 'GUEST_A', level: 'A', fee: 90000, username: 'guest1', password: '123', balance: 0, monthlySessions: 1, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
          { id: 'G002', name: 'Khách Giao Lưu 2', chipName: 'K2', phone: '', type: 'GUEST_B', level: 'B', fee: 70000, username: 'guest2', password: '123', balance: 0, monthlySessions: 1, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') }
        ],
        attendanceRecords: [
          { id: 'ATT_L101', date: '2026-09-15', memberId: 'M001', memberName: 'Nguyễn Hoàng Long', fee: 100000, sessionIndex: 4, timestamp: '15/09/2026 18:30' }
        ],
        transactions: [
          { id: 'TX_L1', date: '01/09/2026 08:00', categoryGroup: 'INCOME_A', subType: 'MEM_FUND', categoryName: 'Quỹ thành viên', amount: 3500000, targetName: 'Quỹ thành lập CLB', walletImpact: 0, fundImpact: 3500000, description: 'Thu quỹ ban đầu khi thành lập CLB Cầu Lông Tia Chớp', operator: 'long_admin' }
        ],
        auth: {
          isLoggedIn: true,
          user: {
            id: 'M001',
            username: 'long_admin',
            role: 'ADMIN',
            name: 'Nguyễn Hoàng Long (Chủ nhiệm)',
            permissions: getRoleDefaultPermissions('ADMIN')
          }
        }
      };
      localStorage.setItem(DEFAULT_SECOND_CLUB.storageKey, JSON.stringify(secondClubData));
    }
  } catch (e) {
    console.error('Error init second club:', e);
  }
}

function getClubsRegistry() {
  try {
    const raw = localStorage.getItem(CLUBS_REGISTRY_KEY);
    if (!raw) {
      initSecondClubDataIfMissing();
      const initial = [DEFAULT_DEFAULT_CLUB, DEFAULT_SECOND_CLUB];
      localStorage.setItem(CLUBS_REGISTRY_KEY, JSON.stringify(initial));
      return initial;
    }
    const list = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) {
      initSecondClubDataIfMissing();
      const initial = [DEFAULT_DEFAULT_CLUB, DEFAULT_SECOND_CLUB];
      localStorage.setItem(CLUBS_REGISTRY_KEY, JSON.stringify(initial));
      return initial;
    }
    // Chuẩn hóa accessSlug và cờ isDeveloperSample cho các CLB
    let changed = false;
    list.forEach(c => {
      if (!c.accessSlug) {
        if (c.id === 'club_smash') c.accessSlug = 'smash';
        else if (c.id === 'club_lightning') c.accessSlug = 'tiachop';
        else c.accessSlug = generateAccessSlug(c.name || c.shortName || c.id);
        changed = true;
      }
      if (c.id === 'club_smash' || c.id === 'club_lightning') {
        c.isDeveloperSample = true;
      }
    });
    if (changed) {
      localStorage.setItem(CLUBS_REGISTRY_KEY, JSON.stringify(list));
    }
    return list;
  } catch (e) {
    console.error('Error reading clubs registry:', e);
    return [DEFAULT_DEFAULT_CLUB];
  }
}

function saveClubsRegistry(clubs) {
  try {
    localStorage.setItem(CLUBS_REGISTRY_KEY, JSON.stringify(clubs));
  } catch (e) {
    console.error('Error saving clubs registry:', e);
  }
}

function getClubIdFromUrl() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('club') || urlParams.get('clb') || urlParams.get('c');
    if (param) return param.trim();

    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const hashClub = hashParams.get('club') || hashParams.get('clb');
      if (hashClub) return hashClub.trim();
      if (hash.startsWith('club=')) return hash.replace('club=', '').trim();
      if (hash.startsWith('clb=')) return hash.replace('clb=', '').trim();
    }
  } catch (e) {}
  return null;
}

function formatSlugToClubName(slug) {
  if (!slug) return 'CLB CẦU LÔNG';
  const clean = slug.replace(/^club[-_]?/i, '').replace(/[-_]+/g, ' ').trim();
  const words = clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return 'CLB CẦU LÔNG ' + words.join(' ').toUpperCase();
}

function getActiveClubId() {
  const registry = getClubsRegistry();
  const urlClub = getClubIdFromUrl();
  if (urlClub) {
    const urlClubLower = urlClub.toLowerCase();
    const matched = registry.find(c =>
      c.id.toLowerCase() === urlClubLower ||
      (c.accessSlug && c.accessSlug.toLowerCase() === urlClubLower) ||
      (c.shortName && c.shortName.toLowerCase() === urlClubLower)
    );
    if (matched) {
      localStorage.setItem(ACTIVE_CLUB_ID_KEY, matched.id);
      return matched.id;
    }

    // CLB chưa có trong danh bạ: Tự động khởi tạo ngay theo slug trên URL
    // Tuyệt đối không để rơi về CLB mẫu của nhà phát triển (SMASH)
    const cleanSlug = urlClubLower.replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'clb';
    const newClubId = 'club_' + cleanSlug;
    const storageKey = 'CLB_CAU_LONG_DATA_' + cleanSlug;
    const clubName = formatSlugToClubName(cleanSlug);
    const shortName = getSuggestedClubShortName(clubName) || cleanSlug.toUpperCase();

    // Kiểm tra xem đã có dữ liệu lưu trước đó ở storageKey này chưa
    let existingData = null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) existingData = JSON.parse(raw);
    } catch (e) {}

    const newClubRecord = {
      id: newClubId,
      accessSlug: cleanSlug,
      name: existingData?.config?.clubName || clubName,
      shortName: shortName,
      logoIcon: '🏸',
      themeColor: existingData?.config?.themeColor || 'emerald',
      bankInfo: existingData?.config?.bankInfo || '',
      createdAt: getFormattedCurrentDate(),
      storageKey: storageKey,
      adminName: existingData?.auth?.user?.name?.replace(/\s*\(Chủ nhiệm\)/i, '') || 'Chủ nhiệm CLB',
      adminUsername: existingData?.auth?.user?.username || 'admin',
      phone: '',
      isDeveloperSample: false
    };

    registry.push(newClubRecord);
    saveClubsRegistry(registry);

    if (!existingData) {
      const freshData = getBlankClubInitialData(newClubRecord);
      localStorage.setItem(storageKey, JSON.stringify(freshData));
    }

    localStorage.setItem('CLB_HIDE_DEV_DEMO', 'true');
    localStorage.setItem(ACTIVE_CLUB_ID_KEY, newClubId);
    return newClubId;
  }

  let activeId = localStorage.getItem(ACTIVE_CLUB_ID_KEY);
  if (!activeId || !registry.some(c => c.id === activeId)) {
    // Nếu người dùng chọn ẩn demo developer, ưu tiên CLB thực của người dùng trước
    const isHideDemo = localStorage.getItem('CLB_HIDE_DEV_DEMO') === 'true';
    if (isHideDemo) {
      const userClub = registry.find(c => !c.isDeveloperSample && c.id !== 'club_smash' && c.id !== 'club_lightning');
      if (userClub) {
        activeId = userClub.id;
        localStorage.setItem(ACTIVE_CLUB_ID_KEY, activeId);
        return activeId;
      }
    }
    activeId = registry[0]?.id || 'club_smash';
    localStorage.setItem(ACTIVE_CLUB_ID_KEY, activeId);
  }
  return activeId;
}

function setActiveClubId(clubId) {
  localStorage.setItem(ACTIVE_CLUB_ID_KEY, clubId);
}

function getClubDirectUrl(clubOrId) {
  const registry = getClubsRegistry();
  const club = typeof clubOrId === 'string' ? registry.find(c => c.id === clubOrId || c.accessSlug === clubOrId) : clubOrId;
  const slug = club ? (club.accessSlug || club.shortName?.toLowerCase() || club.id) : (typeof clubOrId === 'string' ? clubOrId : 'smash');

  const baseUrl = window.location.href.split('#')[0].split('?')[0];
  return `${baseUrl}?club=${encodeURIComponent(slug)}`;
}

function updateClubUrlParam(clubOrId) {
  try {
    const registry = getClubsRegistry();
    const club = typeof clubOrId === 'string' ? registry.find(c => c.id === clubOrId || c.accessSlug === clubOrId) : clubOrId;
    const slug = club?.accessSlug || club?.shortName?.toLowerCase() || (typeof clubOrId === 'string' ? clubOrId : club?.id);
    const url = new URL(window.location.href);
    url.searchParams.set('club', slug);
    window.history.replaceState({}, '', url.toString());
  } catch (e) {}
}

function getActiveClub() {
  const activeId = getActiveClubId();
  const registry = getClubsRegistry();
  return registry.find(c => c.id === activeId) || registry[0] || DEFAULT_DEFAULT_CLUB;
}

function getCurrentClubStorageKey() {
  const club = getActiveClub();
  return club?.storageKey || 'CLB_CAU_LONG_SMASH_DATA_V1';
}

let STORAGE_KEY = getCurrentClubStorageKey();

// ==========================================
// 0. ĐỊNH NGHĨA VAI TRÒ & PHÂN QUYỀN HỆ THỐNG (USER ACCESS & PERMISSIONS)
// ==========================================
const ROLE_DEFINITIONS = {
  ADMIN: { label: 'Chủ nhiệm', icon: '👑', color: 'amber', badgeClass: 'bg-amber-100 text-amber-900 border-amber-300' },
  VICE_ADMIN: { label: 'Phó nhóm', icon: '🛡️', color: 'blue', badgeClass: 'bg-blue-100 text-blue-900 border-blue-300' },
  TREASURER: { label: 'Thủ quỹ', icon: '💰', color: 'emerald', badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  REFEREE: { label: 'Trọng tài', icon: '⚖️', color: 'purple', badgeClass: 'bg-purple-100 text-purple-900 border-purple-300' },
  MEMBER: { label: 'Thành viên', icon: '👤', color: 'slate', badgeClass: 'bg-slate-100 text-slate-800 border-slate-300' },
  CUSTOM: { label: 'Tùy biến', icon: '⚙️', color: 'indigo', badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300' }
};

const PERMISSION_KEYS = ['attendance', 'finance', 'member', 'tournament', 'referee', 'config'];

const PERMISSION_DEFINITIONS = {
  attendance: { label: 'Điểm danh', icon: '📅', desc: 'Điểm danh, chốt tiền sân buổi chơi' },
  finance: { label: 'Quỹ & Ví', icon: '💰', desc: 'Quản lý Quỹ CLB, nạp tiền ví, tất toán nợ' },
  member: { label: 'Thành viên', icon: '👥', desc: 'Quản lý hội viên & cấp mật khẩu' },
  tournament: { label: 'Giải đấu', icon: '🏆', desc: 'Tạo giải đấu, xếp lịch, bốc thăm hạt giống' },
  referee: { label: 'Trọng tài', icon: '⚖️', desc: 'Nhập điểm & tỉ số trực tiếp các sân' },
  config: { label: 'Cấu hình', icon: '⚙️', desc: 'Cấu hình hệ thống & Ban lãnh đạo CLB' }
};

function getRoleDefaultPermissions(role) {
  switch (role) {
    case 'ADMIN':
      return { attendance: true, finance: true, member: true, tournament: true, referee: true, config: true };
    case 'VICE_ADMIN':
      return { attendance: true, finance: false, member: true, tournament: true, referee: true, config: false };
    case 'TREASURER':
      return { attendance: true, finance: true, member: false, tournament: false, referee: false, config: false };
    case 'REFEREE':
      return { attendance: false, finance: false, member: false, tournament: true, referee: true, config: false };
    case 'MEMBER':
    default:
      return { attendance: false, finance: false, member: false, tournament: false, referee: false, config: false };
  }
}

function generateAutoUsername(name) {
  if (!name) return 'user_' + Math.floor(Math.random() * 1000);
  const clean = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();
  const parts = clean.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const lastName = parts[parts.length - 1];
  return lastName;
}

function getBlankClubInitialData(club) {
  const c = club || {};
  const adminName = c.adminName || 'Chủ nhiệm CLB';
  const adminUsername = c.adminUsername || generateAutoUsername(adminName) || 'admin';
  const adminPhone = c.phone || '';
  const adminChipName = adminName.trim().split(/\s+/).pop().toUpperCase();
  const initFund = typeof c.initialFund === 'number' ? c.initialFund : 0;
  const slug = c.accessSlug || generateAccessSlug(c.name || 'clb');

  const adminMember = {
    id: 'M001',
    name: adminName,
    chipName: adminChipName,
    phone: adminPhone,
    type: 'OFFICIAL',
    username: adminUsername,
    password: c.adminPassword || '123456',
    balance: 0,
    monthlySessions: 0,
    role: 'ADMIN',
    status: 'ACTIVE',
    permissions: getRoleDefaultPermissions('ADMIN')
  };

  const initialTx = initFund > 0 ? [{
    id: 'TX_INIT_' + Date.now(),
    date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    categoryGroup: 'INCOME_A',
    subType: 'MEM_FUND',
    categoryName: 'Quỹ thành lập CLB',
    amount: initFund,
    targetName: 'Quỹ chung CLB',
    walletImpact: 0,
    fundImpact: initFund,
    description: `Khởi tạo số dư ban đầu cho ${c.name || 'CLB'}`,
    operator: adminUsername
  }] : [];

  return {
    config: {
      clubName: c.name || 'CLB CẦU LÔNG',
      accessSlug: slug,
      themeColor: c.themeColor || 'emerald',
      bankInfo: c.bankInfo || '',
      leadership: {
        president: 'M001',
        vicePresident1: '',
        vicePresident2: '',
        secretary: '',
        treasurer: '',
        media: '',
        advisor1: '',
        advisor2: ''
      },
      dailyBoxPrice: 340000,
      shuttlecocksPerBox: 12,
      dailyRateTitle: 'ĐƠN GIÁ THEO NGÀY 12',
      shuttleBillingMode: 'BY_SHUTTLE',
      shuttleUnitPrice: 28333,
      defaultShuttlesPerSession: 6,
      viceLeaderId: '',
      permissions: {
        allowViceLeaderAttendance: true,
        allowViceLeaderTournamentSync: true
      },
      guestPrices: { GUEST_A: 90000, GUEST_B: 70000, GUEST_C: 50000 },
      feeTiers: [
        { id: 1, name: 'Bậc 1 (0–4 buổi)', minSessions: 0, maxSessions: 4, price: 50000 },
        { id: 2, name: 'Bậc 2 (5–9 buổi)', minSessions: 5, maxSessions: 9, price: 100000 },
        { id: 3, name: 'Bậc 3 (10–15 buổi)', minSessions: 10, maxSessions: 15, price: 150000 },
        { id: 4, name: 'Bậc 4 (16–30+ buổi)', minSessions: 16, maxSessions: 999, price: 200000 }
      ],
      allowNegativeWallet: true,
      settlementMode: 'MONTHLY',
      defaultSettlementDay: 'END_OF_MONTH'
    },
    funds: {
      clubFund: initFund,
      advanceFund: 0,
      shuttleAdvanceFund: 0,
      courtAdvanceFund: 0,
      guestAdvanceIncome: 0,
      shuttlePaidTotal: 0,
      courtPaidTotal: 0
    },
    members: [adminMember],
    attendanceRecords: [],
    transactions: initialTx,
    auth: {
      isLoggedIn: true,
      user: {
        id: 'M001',
        username: adminUsername,
        role: 'ADMIN',
        name: `${adminName} (Chủ nhiệm)`,
        permissions: getRoleDefaultPermissions('ADMIN')
      }
    }
  };
}

// ==========================================
// 1. DỮ LIỆU MẪU BAN ĐẦU (DEFAULT DATA)
// ==========================================
const DEFAULT_INITIAL_DATA = {
  config: {
    clubName: 'CLB CẦU LÔNG SMASH',
    themeColor: 'emerald',
    bankInfo: 'MBBANK - 0987654321 - CLB CAU LONG SMASH',
    leadership: {
      president: 'M001',       // Chủ tịch
      vicePresident1: 'M002',  // Phó chủ tịch 1
      vicePresident2: 'M003',  // Phó chủ tịch 2
      secretary: 'M004',       // Thư ký
      treasurer: 'M005',       // Thủ quỹ
      media: 'M008',           // Truyền thông
      advisor1: 'M006',        // Cố vấn 1
      advisor2: 'M007'         // Cố vấn 2
    },
    dailyBoxPrice: 340000,
    shuttlecocksPerBox: 12,
    dailyRateTitle: 'ĐƠN GIÁ THEO NGÀY 12',
    shuttleBillingMode: 'BY_SHUTTLE',
    shuttleUnitPrice: 28333,
    defaultShuttlesPerSession: 6,
    viceLeaderId: 'M002',
    permissions: {
      allowViceLeaderAttendance: true,
      allowViceLeaderTournamentSync: true
    },
    guestPrices: {
      GUEST_A: 90000,
      GUEST_B: 70000,
      GUEST_C: 50000
    },
    feeTiers: [
      { id: 1, name: 'Bậc 1 (0–4 buổi)', minSessions: 0, maxSessions: 4, price: 50000 },
      { id: 2, name: 'Bậc 2 (5–9 buổi)', minSessions: 5, maxSessions: 9, price: 100000 },
      { id: 3, name: 'Bậc 3 (10–15 buổi)', minSessions: 10, maxSessions: 15, price: 150000 },
      { id: 4, name: 'Bậc 4 (16–30+ buổi)', minSessions: 16, maxSessions: 999, price: 200000 }
    ],
    allowNegativeWallet: true,          // Cho phép ví thành viên dư nợ / âm số dư (không chặn giao dịch)
    settlementMode: 'MONTHLY',          // 'DAILY' (Cuối ngày) hoặc 'MONTHLY' (Cuối tháng)
    defaultSettlementDay: 'END_OF_MONTH' // Ngày tất toán mặc định: cuối tháng
  },
  funds: {
    clubFund: 5200000,                  // 5.200.000 đ quỹ CLB
    advanceFund: 1800000,               // 1.800.000 đ Tổng Quỹ Tạm Ứng = Quỹ Cầu + Quỹ Sân + Thu Khách
    shuttleAdvanceFund: 800000,         // 800.000 đ Quỹ tạm ứng tiền cầu (Thu từ TV - Đã trả tiền cầu)
    courtAdvanceFund: 760000,           // 760.000 đ Quỹ tạm ứng tiền sân (Thu từ TV - Đã trả tiền sân)
    guestAdvanceIncome: 240000,         // 240.000 đ Khoản thu của khách giao lưu theo hạng
    shuttlePaidTotal: 680000,           // Tổng tiền đã chi/trả cho tiền cầu
    courtPaidTotal: 1500000             // Tổng tiền đã chi/trả cho sân
  },
  members: [
    // --- THÀNH VIÊN CHÍNH THỨC (20 người) ---
    { id: 'M001', name: 'Trần Đức Chính', chipName: 'CHÍNH', phone: '0901000001', type: 'OFFICIAL', username: 'chinh', password: '123', balance: 500000, monthlySessions: 4, role: 'ADMIN', status: 'ACTIVE', permissions: getRoleDefaultPermissions('ADMIN') },
    { id: 'M002', name: 'Nguyễn Thành Công', chipName: 'CÔNG', phone: '0901000002', type: 'OFFICIAL', username: 'cong', password: '123', balance: 420000, monthlySessions: 3, role: 'VICE_ADMIN', status: 'ACTIVE', permissions: getRoleDefaultPermissions('VICE_ADMIN') },
    { id: 'M003', name: 'Lê Anh Dũng', chipName: 'DŨNG', phone: '0901000003', type: 'OFFICIAL', username: 'dung', password: '123', balance: 650000, monthlySessions: 6, role: 'VICE_ADMIN', status: 'ACTIVE', permissions: getRoleDefaultPermissions('VICE_ADMIN') },
    { id: 'M004', name: 'Vũ Văn Duy', chipName: 'DUY', phone: '0901000004', type: 'OFFICIAL', username: 'duy', password: '123', balance: 250000, monthlySessions: 2, role: 'REFEREE', status: 'ACTIVE', permissions: getRoleDefaultPermissions('REFEREE') },
    { id: 'M005', name: 'Đặng Thành Đạt (Đạt Tươi)', chipName: 'ĐẠT TƯƠI', phone: '0901000005', type: 'OFFICIAL', username: 'dat', password: '123', balance: 800000, monthlySessions: 8, role: 'TREASURER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('TREASURER') },
    { id: 'M006', name: 'Phạm Văn Đê', chipName: 'ĐÊ', phone: '0901000006', type: 'OFFICIAL', username: 'de', password: '123', balance: 310000, monthlySessions: 5, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M007', name: 'Hoàng Thanh Hải', chipName: 'HẢI', phone: '0901000007', type: 'OFFICIAL', username: 'hai', password: '123', balance: 450000, monthlySessions: 4, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M008', name: 'Ngô Hồng Hạnh', chipName: 'HẠNH', phone: '0901000008', type: 'OFFICIAL', username: 'hanh', password: '123', balance: 200000, monthlySessions: 2, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M009', name: 'Bùi Trung Hiếu', chipName: 'HIẾU', phone: '0901000009', type: 'OFFICIAL', username: 'hieu', password: '123', balance: 550000, monthlySessions: 5, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M010', name: 'Đỗ Quang Hồng', chipName: 'HỒNG', phone: '0901000010', type: 'OFFICIAL', username: 'hong', password: '123', balance: 380000, monthlySessions: 3, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M011', name: 'Lê Quốc Huy (Huy Dê)', chipName: 'HUY DÊ', phone: '0901000011', type: 'OFFICIAL', username: 'huy', password: '123', balance: 490000, monthlySessions: 5, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M012', name: 'Nguyễn Duy Khương', chipName: 'KHƯƠNG', phone: '0901000012', type: 'OFFICIAL', username: 'khuong', password: '123', balance: 300000, monthlySessions: 4, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M013', name: 'Phan Trung Kiên', chipName: 'KIÊN', phone: '0901000013', type: 'OFFICIAL', username: 'kien', password: '123', balance: 600000, monthlySessions: 7, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M014', name: 'Đinh Văn Lượng', chipName: 'LƯỢNG', phone: '0901000014', type: 'OFFICIAL', username: 'luong', password: '123', balance: 220000, monthlySessions: 3, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M015', name: 'Vũ Tiến Mạnh (Mạnh CT)', chipName: 'MẠNH CT', phone: '0901000015', type: 'OFFICIAL', username: 'manh', password: '123', balance: 710000, monthlySessions: 6, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M016', name: 'Trần Nhật Minh', chipName: 'MINH', phone: '0901000016', type: 'OFFICIAL', username: 'minh', password: '123', balance: 400000, monthlySessions: 4, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M017', name: 'Lương Thế Nguyên', chipName: 'NGUYÊN', phone: '0901000017', type: 'OFFICIAL', username: 'nguyen', password: '123', balance: 350000, monthlySessions: 3, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M018', name: 'Dương Văn Pháp', chipName: 'PHÁP', phone: '0901000018', type: 'OFFICIAL', username: 'phap', password: '123', balance: 520000, monthlySessions: 5, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M019', name: 'Chu Đình Quảng', chipName: 'QUẢNG', phone: '0901000019', type: 'OFFICIAL', username: 'quang', password: '123', balance: 290000, monthlySessions: 2, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M020', name: 'Nguyễn Tuấn Anh (T.Anh)', chipName: 'T.ANH', phone: '0901000020', type: 'OFFICIAL', username: 'admin', password: 'admin123', balance: 750000, monthlySessions: 6, role: 'ADMIN', status: 'ACTIVE', permissions: getRoleDefaultPermissions('ADMIN') },

    // --- THÀNH VIÊN DANH DỰ (Chuyển từ Dự bị - 7 người) ---
    { id: 'M021', name: 'Đào Nhật Tân', chipName: 'TÂN', phone: '0902000021', type: 'HONORARY', username: 'tan', password: '123', balance: 300000, monthlySessions: 2, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M022', name: 'Phạm Tiến Thành', chipName: 'THÀNH', phone: '0902000022', type: 'HONORARY', username: 'thanh', password: '123', balance: 350000, monthlySessions: 3, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M023', name: 'Mai Đức Thắng', chipName: 'THẮNG', phone: '0902000023', type: 'HONORARY', username: 'thang', password: '123', balance: 250000, monthlySessions: 2, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M024', name: 'Lưu Đức Thuộc', chipName: 'THUỘC', phone: '0902000024', type: 'HONORARY', username: 'thuoc', password: '123', balance: 400000, monthlySessions: 4, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M025', name: 'Cao Văn Toàn', chipName: 'TOÀN', phone: '0902000025', type: 'HONORARY', username: 'toan', password: '123', balance: 320000, monthlySessions: 3, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M026', name: 'Đỗ Xuân Trường', chipName: 'TRƯỜNG', phone: '0902000026', type: 'HONORARY', username: 'truong', password: '123', balance: 280000, monthlySessions: 2, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'M027', name: 'Nguyễn Văn Tươi', chipName: 'TƯƠI', phone: '0902000027', type: 'HONORARY', username: 'tuoi', password: '123', balance: 500000, monthlySessions: 5, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },

    // --- KHÁCH (Phân loại Level A, B, C theo mẫu) ---
    { id: 'G006', name: 'THẾ ANH', chipName: 'THẾ ANH', phone: '', type: 'GUEST_A', level: 'A', fee: 90000, username: 'theanh', password: '123', balance: 0, monthlySessions: 2, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'G007', name: 'PHONG', chipName: 'PHONG', phone: '', type: 'GUEST_A', level: 'A', fee: 90000, username: 'phong', password: '123', balance: 0, monthlySessions: 1, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'G005', name: 'QUANG-Q', chipName: 'QUANG-Q', phone: '', type: 'GUEST_A', level: 'A', fee: 90000, username: 'quangq', password: '123', balance: 0, monthlySessions: 3, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'G004', name: 'CHA PHÓ', chipName: 'CHA PHÓ', phone: '', type: 'GUEST_B', level: 'B', fee: 70000, username: 'chapho', password: '123', balance: 0, monthlySessions: 1, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'G003', name: 'KHOAI', chipName: 'KHOAI', phone: '', type: 'GUEST_C', level: 'C', fee: 50000, username: 'khoai', password: '123', balance: 0, monthlySessions: 2, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'G001', name: 'Khách 1', chipName: 'Khách 1', phone: '', type: 'GUEST_C', level: 'C', fee: 50000, username: 'khach1', password: '123', balance: 0, monthlySessions: 1, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
    { id: 'G002', name: 'Khách 2', chipName: 'Khách 2', phone: '', type: 'GUEST_C', level: 'C', fee: 50000, username: 'khach2', password: '123', balance: 0, monthlySessions: 1, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') }
  ],
  attendanceRecords: [
    { id: 'ATT_101', date: '2026-09-15', memberId: 'M001', memberName: 'Nguyễn Văn Tuấn (Chủ nhiệm)', fee: 100000, sessionIndex: 6, timestamp: '15/09/2026 18:30' },
    { id: 'ATT_102', date: '2026-09-15', memberId: 'M002', memberName: 'Trần Minh Hoàng', fee: 50000, sessionIndex: 3, timestamp: '15/09/2026 18:30' },
    { id: 'ATT_103', date: '2026-09-15', memberId: 'M003', memberName: 'Lê Thu Hương', fee: 100000, sessionIndex: 5, timestamp: '15/09/2026 18:30' }
  ],
  transactions: [
    // A.1 Quỹ thành viên
    { id: 'TX_1001', date: '01/09/2026 08:00', categoryGroup: 'INCOME_A', subType: 'MEM_FUND', categoryName: 'Quỹ thành viên', amount: 4000000, targetName: '20 Thành viên chính thức', walletImpact: -200000, fundImpact: 4000000, description: 'Thu Quỹ thành viên Tháng 09/2026 (200.000đ × 20 TV chính thức)', operator: 'admin' },
    // A.2 Phạt
    { id: 'TX_1002', date: '10/09/2026 19:20', categoryGroup: 'INCOME_A', subType: 'FINE', categoryName: 'Phạt vi phạm', amount: 50000, targetName: 'Phạm Văn Đê', walletImpact: -50000, fundImpact: 50000, description: 'Phạt vắng không báo trước buổi sinh hoạt (Trừ ví)', operator: 'admin' },
    { id: 'TX_1003', date: '15/09/2026 18:40', categoryGroup: 'INCOME_A', subType: 'FINE', categoryName: 'Phạt vi phạm', amount: 50000, targetName: 'Ngô Hồng Hạnh', walletImpact: -50000, fundImpact: 50000, description: 'Phạt đến muộn >20 phút (Trừ ví)', operator: 'admin' },
    // A.3 Giải thưởng
    { id: 'TX_1004', date: '12/09/2026 10:15', categoryGroup: 'INCOME_A', subType: 'PRIZE', categoryName: 'Giải thưởng CLB', amount: 2000000, targetName: 'Ban tổ chức Giải Mùa Thu', walletImpact: 0, fundImpact: 2000000, description: 'Giải Nhất Cúp Cầu Lông Đôi Nam Mùa Thu 2026', operator: 'admin' },
    // A.4 Tài trợ
    { id: 'TX_1005', date: '05/09/2026 14:00', categoryGroup: 'INCOME_A', subType: 'SPONSOR', categoryName: 'Tài trợ', amount: 3000000, targetName: 'Đại lý Vợt Cầu Lông Yonex', walletImpact: 0, fundImpact: 3000000, description: 'Tài trợ tiền mặt hỗ trợ hoạt động phong trào CLB', operator: 'admin' },
    // A.5 Thu khác
    { id: 'TX_1006', date: '08/09/2026 09:30', categoryGroup: 'INCOME_A', subType: 'OTHER_IN', categoryName: 'Thu khác', amount: 500000, targetName: 'Thành viên CLB', walletImpact: 0, fundImpact: 500000, description: 'Thu thanh lý áo đồng phục mùa cũ cho quỹ', operator: 'admin' },
    // B.1.1 Liên hoan
    { id: 'TX_1007', date: '02/09/2026 19:30', categoryGroup: 'EXPENSE_B', subType: 'EXP_PARTY', categoryName: 'Liên hoan', amount: 2500000, targetName: 'Nhà hàng Lẩu Nướng X', walletImpact: 0, fundImpact: -2500000, description: 'Chi tiệc liên hoan chào mừng thành viên mới & Quốc khánh', operator: 'admin' },
    // B.1.2 Giao lưu
    { id: 'TX_1008', date: '11/09/2026 20:00', categoryGroup: 'EXPENSE_B', subType: 'EXP_EXCHANGE', categoryName: 'Giao lưu', amount: 1200000, targetName: 'CLB Cầu Lông Bạn', walletImpact: 0, fundImpact: -1200000, description: 'Chi phí tiếp đón & giao lưu cầu lông CLB Bạn', operator: 'admin' },
    // B.1.3 Chi khác (Hoạt động chung)
    { id: 'TX_1009', date: '13/09/2026 16:00', categoryGroup: 'EXPENSE_B', subType: 'EXP_GENERAL_OTHER', categoryName: 'Chi HĐ khác', amount: 680000, targetName: 'Đại lý Cầu Lông', walletImpact: 0, fundImpact: -680000, description: 'Mua 2 hộp cầu Victor Champion No.1 cho CLB', operator: 'admin' },
    // B.2 Chi thành viên (Hiếu / Hỷ / Ốm)
    { id: 'TX_1010', date: '06/09/2026 10:00', categoryGroup: 'EXPENSE_B', subType: 'EXP_HY', categoryName: 'Chi Hỷ', amount: 1000000, targetName: 'Nguyễn Văn Tuấn (Chủ nhiệm)', memberId: 'M001', walletImpact: 0, fundImpact: -1000000, description: 'Chi mừng cưới thành viên Nguyễn Văn Tuấn (Trừ Quỹ CLB)', operator: 'admin' },
    { id: 'TX_1011', date: '14/09/2026 15:00', categoryGroup: 'EXPENSE_B', subType: 'EXP_OM', categoryName: 'Chi Thăm ốm', amount: 500000, targetName: 'Vũ Văn Duy', memberId: 'M004', walletImpact: 0, fundImpact: -500000, description: 'Chi thăm ốm thành viên Vũ Văn Duy (Trừ Quỹ CLB)', operator: 'admin' },
    // Nạp ví thành viên
    { id: 'TX_1012', date: '16/09/2026 09:30', categoryGroup: 'WALLET_TOPUP', subType: 'TOPUP', categoryName: 'Nạp ví', amount: 500000, targetName: 'Trần Đức Chính', memberId: 'M001', walletImpact: 500000, fundImpact: 0, description: 'Nạp tiền ví thành viên (Chuyển khoản VietQR)', operator: 'admin' },
    // Quỹ tạm ứng: Tạm ứng tiền cầu (Thu từ TV)
    { id: 'TX_2001', date: '05/09/2026 21:00', categoryGroup: 'ADVANCE_SHUTTLE_IN', subType: 'SHUTTLE_ADV_IN', categoryName: 'Tạm ứng tiền cầu', amount: 1480000, targetName: 'Các buổi sinh hoạt', walletImpact: -30000, fundImpact: 1480000, description: 'Tổng tiền cầu đã thu tạm ứng từ thành viên các buổi chơi', operator: 'admin' },
    // Quỹ tạm ứng: Chi trả tiền cầu (Mua cầu)
    { id: 'TX_2002', date: '07/09/2026 15:30', categoryGroup: 'ADVANCE_SHUTTLE_OUT', subType: 'SHUTTLE_EXP_PAY', categoryName: 'Chi trả tiền cầu', amount: 680000, targetName: 'Đại lý Cầu Lông Yonex', walletImpact: 0, fundImpact: -680000, description: 'Chi trả tiền mua 2 hộp cầu Victor Champion No.1 (Rút Quỹ tạm ứng cầu)', operator: 'admin' },
    // Quỹ tạm ứng: Tạm ứng tiền sân (Thu từ TV theo bậc số buổi)
    { id: 'TX_2003', date: '10/09/2026 21:00', categoryGroup: 'ADVANCE_COURT_IN', subType: 'COURT_ADV_IN', categoryName: 'Tạm ứng tiền sân', amount: 2260000, targetName: 'Các buổi sinh hoạt', walletImpact: -80000, fundImpact: 2260000, description: 'Tổng tiền sân đã thu tạm ứng từ thành viên theo bậc số buổi', operator: 'admin' },
    // Quỹ tạm ứng: Chi trả tiền sân (Trả chủ sân)
    { id: 'TX_2004', date: '12/09/2026 18:00', categoryGroup: 'ADVANCE_COURT_OUT', subType: 'COURT_EXP_PAY', categoryName: 'Chi trả tiền sân', amount: 1500000, targetName: 'Chủ sân Cầu Lông Smash', walletImpact: 0, fundImpact: -1500000, description: 'Chi trả tiền thuê sân đợt 1 cho chủ sân (Rút Quỹ tạm ứng sân)', operator: 'admin' },
    // Quỹ tạm ứng: Khoản thu của khách giao lưu theo hạng
    { id: 'TX_2005', date: '15/09/2026 21:00', categoryGroup: 'ADVANCE_GUEST_IN', subType: 'GUEST_ADV_IN', categoryName: 'Thu khách giao lưu', amount: 240000, targetName: 'Khách Level A & C', walletImpact: 0, fundImpact: 240000, description: 'Khoản thu phí tham gia của khách giao lưu theo hạng (2 Level A 90k, 1 Level C 60k)', operator: 'admin' },
    // Tất toán dư nợ: Thu nợ ví âm
    { id: 'TX_3001', date: '16/09/2026 19:45', categoryGroup: 'WALLET_SETTLEMENT', subType: 'SETTLEMENT', categoryName: 'Tất toán dư nợ', amount: 50000, targetName: 'Phạm Đức Long', memberId: 'M006', walletImpact: 50000, fundImpact: 0, description: 'Tất toán công nợ cuối ngày - nộp tiền xóa số dư âm ví về 0đ', operator: 'admin' }
  ],
  auth: {
    isLoggedIn: true,
    user: {
      id: 'M001',
      username: 'admin',
      role: 'ADMIN',
      name: 'Trần Đức Chính (Chủ nhiệm)',
      permissions: getRoleDefaultPermissions('ADMIN')
    }
  }
};

// ==========================================
// 2. STATE MANAGEMENT & LOCAL STORAGE
// ==========================================
let AppState = {};

function loadData() {
  try {
    STORAGE_KEY = getCurrentClubStorageKey();
    const activeClub = getActiveClub();
    const isSmash = activeClub.id === 'club_smash';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      AppState = JSON.parse(saved);
      const blankData = getBlankClubInitialData(activeClub);

      // Đảm bảo không bị thiếu cấu trúc khi cập nhật phiên bản
      if (!AppState.config) AppState.config = isSmash ? DEFAULT_INITIAL_DATA.config : blankData.config;
      if (!AppState.funds) AppState.funds = isSmash ? DEFAULT_INITIAL_DATA.funds : blankData.funds;
      if (!AppState.members) AppState.members = isSmash ? DEFAULT_INITIAL_DATA.members : blankData.members;
      if (!AppState.transactions) AppState.transactions = isSmash ? DEFAULT_INITIAL_DATA.transactions : [];
      if (!AppState.attendanceRecords) AppState.attendanceRecords = [];
      if (!AppState.auth) AppState.auth = isSmash ? DEFAULT_INITIAL_DATA.auth : blankData.auth;

      // Nâng cấp dữ liệu lên danh sách 27 thành viên & khách theo mẫu thực tế (riêng cho CLB Smash mặc định)
      if (isSmash) {
        if (!AppState.members || AppState.members.length < 20) {
          AppState.members = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA.members));
        } else {
          // Chuyển đổi thành viên dự bị / UNOFFICIAL thành HONORARY (Danh dự)
          AppState.members.forEach(m => {
            if (m.type === 'UNOFFICIAL' || m.type === 'PROBATION') {
              m.type = 'HONORARY';
            }
            if (!m.chipName) {
              const parts = m.name.trim().split(' ');
              m.chipName = parts[parts.length - 1].toUpperCase();
            }
          });

          if (!AppState.members.some(m => m.id === 'G007' || m.chipName === 'PHONG')) {
            AppState.members.push({ id: 'G007', name: 'PHONG', chipName: 'PHONG', phone: '', type: 'GUEST_A', level: 'A', fee: 90000, username: '', password: '', balance: 0, monthlySessions: 1 });
          }
          const gQuang = AppState.members.find(m => m.id === 'G005' || m.name === 'QUANG - Q' || m.name === 'QUANG-Q');
          if (gQuang) { gQuang.name = 'QUANG-Q'; gQuang.chipName = 'QUANG-Q'; }
        }
      }

      // Chuẩn hóa và gán vai trò & quyền sử dụng (User Access Management) cho từng thành viên
      if (AppState.members && AppState.members.length > 0) {
        const leadership = AppState.config?.leadership || {};
        const presId = leadership.president || (isSmash ? 'M001' : AppState.members[0].id);
        const vice1Id = leadership.vicePresident1 || (isSmash ? 'M002' : '');
        const vice2Id = leadership.vicePresident2 || (isSmash ? 'M003' : '');
        const secId = leadership.secretary || (isSmash ? 'M004' : '');
        const treasId = leadership.treasurer || (isSmash ? 'M005' : '');
        const viceLeadId = AppState.config?.viceLeaderId || (isSmash ? 'M002' : '');

        AppState.members.forEach(m => {
          if (!m.role || m.role === 'MEMBER') {
            if (m.id === presId || (isSmash && (m.id === 'M001' || m.username === 'admin' || m.id === 'M020'))) {
              m.role = 'ADMIN';
            } else if ((vice1Id && m.id === vice1Id) || (vice2Id && m.id === vice2Id) || (viceLeadId && m.id === viceLeadId) || (isSmash && (m.id === 'M002' || m.id === 'M003'))) {
              m.role = 'VICE_ADMIN';
            } else if ((treasId && m.id === treasId) || (isSmash && m.id === 'M005')) {
              m.role = 'TREASURER';
            } else if ((secId && m.id === secId) || (isSmash && m.id === 'M004')) {
              m.role = 'REFEREE';
            } else {
              m.role = 'MEMBER';
            }
          }
          if (!m.permissions || typeof m.permissions !== 'object' || (m.role !== 'MEMBER' && Object.values(m.permissions).every(v => v === false))) {
            m.permissions = getRoleDefaultPermissions(m.role);
          }
          if (!m.status) {
            m.status = 'ACTIVE';
          }
          if (!m.username) {
            m.username = generateAutoUsername(m.name || m.id);
          }
          if (!m.password) {
            m.password = '123456';
          }
        });
      }

      if (AppState.auth && AppState.auth.user) {
        if (!AppState.auth.user.permissions) {
          AppState.auth.user.permissions = getRoleDefaultPermissions(AppState.auth.user.role || 'ADMIN');
        }
      }

      if (AppState.config) {
        if (!AppState.config.guestPrices) AppState.config.guestPrices = DEFAULT_INITIAL_DATA.config.guestPrices;
        if (AppState.config.dailyBoxPrice === undefined) AppState.config.dailyBoxPrice = 340000;
        if (AppState.config.shuttlecocksPerBox === undefined) AppState.config.shuttlecocksPerBox = 12;
        if (!AppState.config.dailyRateTitle) AppState.config.dailyRateTitle = 'ĐƠN GIÁ THEO NGÀY 12';
        if (!AppState.config.shuttleBillingMode) AppState.config.shuttleBillingMode = 'BY_SHUTTLE';
        if (!AppState.config.shuttleUnitPrice) {
          const bp = AppState.config.dailyBoxPrice || 340000;
          const sc = AppState.config.shuttlecocksPerBox || 12;
          AppState.config.shuttleUnitPrice = Math.round(bp / sc) || 28333;
        }
        if (!AppState.config.defaultShuttlesPerSession) AppState.config.defaultShuttlesPerSession = 6;
        if (!AppState.config.viceLeaderId) AppState.config.viceLeaderId = isSmash ? 'M002' : '';
        if (!AppState.config.permissions) {
          AppState.config.permissions = {
            allowViceLeaderAttendance: true,
            allowViceLeaderTournamentSync: true
          };
        }
        if (AppState.config.allowNegativeWallet === undefined) AppState.config.allowNegativeWallet = true;
        if (!AppState.config.settlementMode) AppState.config.settlementMode = 'MONTHLY';
        if (!AppState.config.defaultSettlementDay) AppState.config.defaultSettlementDay = 'END_OF_MONTH';
        if (!AppState.config.leadership) {
          AppState.config.leadership = isSmash ? {
            president: 'M001',
            vicePresident1: 'M002',
            vicePresident2: 'M003',
            secretary: 'M004',
            treasurer: 'M005',
            media: 'M008',
            advisor1: 'M006',
            advisor2: 'M007'
          } : {
            president: AppState.members?.[0]?.id || '',
            vicePresident1: '',
            vicePresident2: '',
            secretary: '',
            treasurer: '',
            media: '',
            advisor1: '',
            advisor2: ''
          };
        } else if (!isSmash) {
          // Loại bỏ ID mẫu của dev nếu không tồn tại trong danh sách thành viên CLB này
          const memberIds = new Set((AppState.members || []).map(m => m.id));
          ['president', 'vicePresident1', 'vicePresident2', 'secretary', 'treasurer', 'media', 'advisor1', 'advisor2'].forEach(k => {
            if (AppState.config.leadership[k] && !memberIds.has(AppState.config.leadership[k])) {
              AppState.config.leadership[k] = (k === 'president') ? (AppState.members?.[0]?.id || '') : '';
            }
          });
        }
      }

      if (AppState.funds) {
        if (AppState.funds.shuttleAdvanceFund === undefined) AppState.funds.shuttleAdvanceFund = isSmash ? 800000 : 0;
        if (AppState.funds.courtAdvanceFund === undefined) AppState.funds.courtAdvanceFund = isSmash ? 760000 : 0;
        if (AppState.funds.guestAdvanceIncome === undefined) AppState.funds.guestAdvanceIncome = isSmash ? 240000 : 0;
        if (AppState.funds.shuttlePaidTotal === undefined) AppState.funds.shuttlePaidTotal = isSmash ? 680000 : 0;
        if (AppState.funds.courtPaidTotal === undefined) AppState.funds.courtPaidTotal = isSmash ? 1500000 : 0;
      }
      saveData();
    } else {
      AppState = isSmash ? JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA)) : getBlankClubInitialData(activeClub);
      saveData();
    }
  } catch (err) {
    console.error('Error loading data, using defaults:', err);
    const activeClub = getActiveClub();
    const isSmash = activeClub.id === 'club_smash';
    AppState = isSmash ? JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA)) : getBlankClubInitialData(activeClub);
    saveData();
  }
}

function saveData() {
  try {
    STORAGE_KEY = getCurrentClubStorageKey();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));

    // Đồng bộ thông tin cơ bản sang danh bạ CLB (Clubs Registry)
    const activeId = getActiveClubId();
    const registry = getClubsRegistry();
    const currentClub = registry.find(c => c.id === activeId);
    if (currentClub && AppState.config) {
      let changed = false;
      if (AppState.config.clubName && currentClub.name !== AppState.config.clubName) {
        currentClub.name = AppState.config.clubName;
        changed = true;
      }
      if (AppState.config.themeColor && currentClub.themeColor !== AppState.config.themeColor) {
        currentClub.themeColor = AppState.config.themeColor;
        changed = true;
      }
      if (AppState.config.bankInfo && currentClub.bankInfo !== AppState.config.bankInfo) {
        currentClub.bankInfo = AppState.config.bankInfo;
        changed = true;
      }
      if (changed) {
        saveClubsRegistry(registry);
        const nameEl = document.getElementById('headerClubName');
        if (nameEl) nameEl.textContent = currentClub.name;
      }
    }

    // Tự động đẩy lên Google Firebase Cloud Sync (nếu có kết nối)
    if (typeof pushDataToCloud === 'function') {
      pushDataToCloud();
    }
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
    showToast('Lỗi lưu trữ dữ liệu cục bộ!', 'error');
  }
}

// ==========================================
// 3. TIỆN ÍCH ĐỊNH DẠNG & THỜI GIAN
// ==========================================
function formatMoney(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
  const num = Number(amount);
  return num.toLocaleString('vi-VN') + ' đ';
}

function getFormattedCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

function getTodayInputFormat() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getNowTimestampString() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

// ==========================================
// 4. BẢNG MÀU GIAO DIỆN (THEMES)
// ==========================================
const THEMES = {
  emerald: {
    50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0',
    500: '#10b981', 600: '#059669', 700: '#047857'
  },
  cyan: {
    50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc',
    500: '#06b6d4', 600: '#0891b2', 700: '#0e7490'
  },
  ocean: {
    50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd',
    500: '#0284c7', 600: '#0369a1', 700: '#075985'
  },
  orange: {
    50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa',
    500: '#f97316', 600: '#ea580c', 700: '#c2410c'
  },
  red: {
    50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca',
    500: '#ef4444', 600: '#dc2626', 700: '#b91c1c'
  },
  purple: {
    50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff',
    500: '#a855f7', 600: '#9333ea', 700: '#7e22ce'
  }
};

function applyThemeColor(themeName) {
  const palette = THEMES[themeName] || THEMES.emerald;
  const root = document.documentElement;
  root.style.setProperty('--brand-50', palette[50]);
  root.style.setProperty('--brand-100', palette[100]);
  root.style.setProperty('--brand-200', palette[200]);
  root.style.setProperty('--brand-500', palette[500]);
  root.style.setProperty('--brand-600', palette[600]);
  root.style.setProperty('--brand-700', palette[700]);
  if (AppState.config) {
    AppState.config.themeColor = themeName;
    saveData();
  }
}

// ==========================================
// 5. TOAST THÔNG BÁO (DYNAMIC CONTAINER)
// ==========================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto';

  let iconName = 'check-circle-2';
  if (type === 'error') {
    toast.className += ' bg-rose-900/90 text-white border-rose-700 shadow-rose-950/20';
    iconName = 'alert-circle';
  } else if (type === 'warning') {
    toast.className += ' bg-amber-900/90 text-white border-amber-700 shadow-amber-950/20';
    iconName = 'alert-triangle';
  } else if (type === 'info') {
    toast.className += ' bg-slate-900/90 text-white border-slate-700 shadow-slate-950/20';
    iconName = 'info';
  } else {
    toast.className += ' bg-slate-900/95 text-white border-emerald-500/40 shadow-emerald-950/20';
    iconName = 'check-circle-2';
  }

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-4 h-4 shrink-0 ${type === 'error' ? 'text-rose-400' : (type === 'warning' ? 'text-amber-400' : 'text-emerald-400')}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  // Animation show
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Auto hide & remove
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3000);
}

// ==========================================
// 6. ĐIỀU HƯỚNG TABS
// ==========================================
let currentTab = 'dashboard';

function switchTab(tabId) {
  if (tabId === 'matchmaker') tabId = 'tournament';
  currentTab = tabId;
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
  const activePane = document.getElementById(`tab-${tabId}`);
  if (activePane) activePane.classList.remove('hidden');

  // Cập nhật desktop sidebar navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('text-brand-700', 'bg-brand-50');
    btn.classList.add('text-slate-600', 'hover:bg-slate-100');
  });
  const activeNav = document.getElementById(`nav-${tabId}`);
  if (activeNav) {
    activeNav.classList.remove('text-slate-600', 'hover:bg-slate-100');
    activeNav.classList.add('text-brand-700', 'bg-brand-50');
  }

  // Cập nhật mobile navigation bar
  ['dashboard', 'attendance', 'finance', 'members', 'tournament', 'settings'].forEach(id => {
    const mBtn = document.getElementById(`m-nav-${id}`);
    if (mBtn) {
      if (id === tabId) {
        mBtn.className = 'flex flex-col items-center py-1 text-[11px] font-semibold text-brand-700';
      } else {
        mBtn.className = 'flex flex-col items-center py-1 text-[11px] font-semibold text-slate-500';
      }
    }
  });

  // Re-render tab tương ứng
  if (tabId === 'dashboard') {
    renderDashboard();
  } else if (tabId === 'attendance') {
    renderAttendanceTab();
  } else if (tabId === 'finance') {
    renderFinanceTab();
  } else if (tabId === 'members') {
    renderMemberManagementList();
  } else if (tabId === 'tournament') {
    renderTournamentModule();
  } else if (tabId === 'settings') {
    renderSettingsTab();
  }

  lucide.createIcons();
}

// ==========================================
// 7. CƠ CHẾ TÍNH BẬC TIỀN SÂN CẦU LÔNG
// ==========================================
/**
 * Tính đơn giá tiền sân cho người chơi:
 * - Khách giao lưu A/B/C: Lấy theo cấu hình riêng (VD: 70k, 100k, 150k)
 * - Thành viên chính thức & thành viên danh dự: Tính lũy kế theo số buổi trong tháng
 *   Mặc định: 0–4: 50k, 5–9: 100k, 10–15: 150k, 16–30+: 200k
 */
function calculateMemberCourtFee(member, isSimulatingNext = true) {
  if (!member) return 50000;

  if (member.type === 'GUEST_A') return AppState.config.guestPrices.GUEST_A || 90000;
  if (member.type === 'GUEST_B') return AppState.config.guestPrices.GUEST_B || 70000;
  if (member.type === 'GUEST_C') return AppState.config.guestPrices.GUEST_C || 50000;

  const sessionCount = (member.monthlySessions || 0) + (isSimulatingNext ? 1 : 0);
  const tiers = AppState.config.feeTiers || [];

  for (const tier of tiers) {
    if (sessionCount >= tier.minSessions && sessionCount <= tier.maxSessions) {
      return tier.price;
    }
  }

  // Nếu vượt quá các bậc đã định nghĩa, lấy bậc cao nhất
  if (tiers.length > 0) {
    return tiers[tiers.length - 1].price;
  }
  return 200000;
}

function getTierNameForSession(sessionCount) {
  const tiers = AppState.config.feeTiers || [];
  for (const tier of tiers) {
    if (sessionCount >= tier.minSessions && sessionCount <= tier.maxSessions) {
      return tier.name;
    }
  }
  return 'Bậc cao nhất';
}

function getMemberRoleBadge(type) {
  switch (type) {
    case 'OFFICIAL':
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Chính thức</span>`;
    case 'HONORARY':
    case 'UNOFFICIAL':
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Danh dự</span>`;
    case 'GUEST_A':
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Level A · 90k</span>`;
    case 'GUEST_B':
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Level B · 70k</span>`;
    case 'GUEST_C':
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Level C · 50k</span>`;
    default:
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">Khác</span>`;
  }
}

function getMemberRoleTypeText(type) {
  if (type === 'OFFICIAL') return 'Chính thức';
  if (type === 'HONORARY' || type === 'UNOFFICIAL') return 'Danh dự';
  if (type === 'GUEST_A') return 'Level A (90k)';
  if (type === 'GUEST_B') return 'Level B (70k)';
  if (type === 'GUEST_C') return 'Level C (50k)';
  return 'Hội viên';
}

// ==========================================
// 8. TRANG CHỦ & KPI DASHBOARD
// ==========================================
function renderDashboard() {
  // 1. Tên CLB
  const clubNameEl = document.getElementById('headerClubName');
  if (clubNameEl) clubNameEl.textContent = AppState.config.clubName;

  // 2. Ngày hiện tại
  const dateEl = document.getElementById('currentDateDisplay');
  if (dateEl) dateEl.textContent = getFormattedCurrentDate();

  // 3. KPI 1: Quỹ CLB
  const clubFundEl = document.getElementById('kpiClubFund');
  if (clubFundEl) clubFundEl.textContent = formatMoney(AppState.funds.clubFund);

  // 4. KPI 2: Quỹ tạm ứng
  const advFundEl = document.getElementById('kpiAdvanceFund');
  if (advFundEl) advFundEl.textContent = formatMoney(AppState.funds.advanceFund);

  // 5. KPI 3: Tổng số dư ví thành viên
  const totalWallet = AppState.members.reduce((sum, m) => sum + (m.balance || 0), 0);
  const totalWalletEl = document.getElementById('kpiTotalWallet');
  if (totalWalletEl) totalWalletEl.textContent = formatMoney(totalWallet);

  // 6. Render danh sách ví thành viên
  renderDashboardWalletList();

  // 8. Render giao dịch gần đây
  renderRecentTransactions();

  // 9. Auth badge
  renderAuthBadge();

  // 10. Multi-Club Switcher in Header
  renderClubSwitcher();
}

function renderDashboardWalletList() {
  const tbody = document.getElementById('dashboardWalletTableBody');
  const searchInput = document.getElementById('searchMemberWallet');
  const memberCountBadge = document.getElementById('memberCountBadge');
  if (!tbody) return;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  let list = AppState.members;
  if (query) {
    list = list.filter(m => m.name.toLowerCase().includes(query) || (m.phone && m.phone.includes(query)));
  }

  if (memberCountBadge) memberCountBadge.textContent = `${list.length} TV`;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400">Không tìm thấy thành viên phù hợp</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(m => {
    const isNegative = (m.balance || 0) < 0;
    const balanceClass = isNegative ? 'text-rose-600 font-bold' : ((m.balance || 0) < 100000 ? 'text-amber-600 font-bold' : 'text-slate-800 font-bold');
    
    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="py-2.5 px-3">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-slate-900">${m.name}</span>
            <button onclick="openQuickRenameModal('${m.id}')" class="text-slate-400 hover:text-brand-600 p-0.5 rounded transition" title="Đổi tên / SĐT thành viên">
              <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          <div class="text-[11px] text-slate-400 font-normal">${m.phone || 'Chưa có SĐT'}</div>
        </td>
        <td class="py-2.5 px-2">
          ${getMemberRoleBadge(m.type)}
        </td>
        <td class="py-2.5 px-2 text-center font-bold text-slate-700">
          ${m.monthlySessions || 0} buổi
        </td>
        <td class="py-2.5 px-3 text-right ${balanceClass}">
          ${formatMoney(m.balance || 0)}
        </td>
        <td class="py-2.5 px-2 text-center">
          <div class="flex items-center justify-center gap-1">
            <button onclick="quickCheckInSingleMember('${m.id}')" class="px-2 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 font-bold rounded-lg text-[11px] transition" title="⚡ Điểm danh 1-chạm (trừ ví ngay)">
              ⚡
            </button>
            <button onclick="openTopUpModalForMember('${m.id}')" class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-lg text-[11px] transition" title="Nạp ví nhanh">
              + Nạp
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderRecentTransactions() {
  const container = document.getElementById('recentTransactionsList');
  if (!container) return;

  const recent = (AppState.transactions || []).slice().reverse().slice(0, 8);

  if (recent.length === 0) {
    container.innerHTML = `<div class="py-8 text-center text-slate-400 text-xs">Chưa có giao dịch nào được ghi nhận</div>`;
    return;
  }

  container.innerHTML = recent.map(tx => {
    let icon = 'arrow-right-left';
    let iconBg = 'bg-slate-100 text-slate-600';
    let amountColor = 'text-slate-900';
    let prefix = '';

    if (tx.type === 'TOPUP') {
      icon = 'plus-circle';
      iconBg = 'bg-emerald-50 text-emerald-600';
      amountColor = 'text-emerald-600';
      prefix = '+';
    } else if (tx.type === 'COURT_FEE') {
      icon = 'check-circle';
      iconBg = 'bg-blue-50 text-blue-600';
      amountColor = 'text-slate-800';
      prefix = '-';
    } else if (tx.type === 'FUND_IN') {
      icon = 'trending-up';
      iconBg = 'bg-emerald-50 text-emerald-600';
      amountColor = 'text-emerald-600';
      prefix = '+';
    } else if (tx.type === 'FUND_OUT') {
      icon = 'trending-down';
      iconBg = 'bg-rose-50 text-rose-600';
      amountColor = 'text-rose-600';
      prefix = '-';
    } else if (tx.type === 'FINE') {
      icon = 'alert-triangle';
      iconBg = 'bg-amber-50 text-amber-600';
      amountColor = 'text-amber-600';
      prefix = '+';
    } else if (tx.type === 'ADVANCE') {
      icon = 'hand-coins';
      iconBg = 'bg-purple-50 text-purple-600';
      amountColor = 'text-purple-600';
    }

    const cleanAmount = Math.abs(tx.amount);

    return `
      <div class="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition flex items-start justify-between gap-2">
        <div class="flex items-start gap-2.5">
          <div class="w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0 mt-0.5">
            <i data-lucide="${icon}" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="font-bold text-xs text-slate-800">${tx.targetName || 'Giao dịch'}</div>
            <div class="text-[11px] text-slate-500 line-clamp-1">${tx.description}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">${tx.date}</div>
          </div>
        </div>
        <div class="text-right shrink-0">
          <div class="font-black text-xs ${amountColor}">${prefix}${formatMoney(cleanAmount)}</div>
          <div class="text-[10px] text-slate-400">${tx.operator || 'admin'}</div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// ==========================================
// 9. BUỔI HOẠT ĐỘNG, ĐIỂM DANH & CHIA TIỀN (THEO MẪU ẢNH MOBILE)
// ==========================================
let activityState = {
  initialized: false,
  date: '',
  type: 'Buổi cầu',
  lang: 'VI',
  selectedMemberIds: new Set(),
  selectedGuestIds: new Set(),
  saveGuestDebt: false,
  shuttleBillingMode: 'BY_SHUTTLE',
  shuttleCount: 6,
  expenses: [
    { id: 1, title: 'Tiền cầu', qty: 12, unitPrice: 28333, amount: 340000, isCombo: false, isShuttleRow: true }
  ],
  frontPersonId: 'NONE',
  frontAmount: 0,
  isFrontAll: false,
  tipAmount: 0,
  matches: []
};

function saveActivitySessionState() {
  try {
    const clubId = getActiveClubId();
    const sessionKey = 'CLB_SESSION_' + clubId;
    const serializable = {
      date: activityState.date,
      type: activityState.type,
      lang: activityState.lang || 'VI',
      selectedMemberIds: Array.from(activityState.selectedMemberIds || []),
      selectedGuestIds: Array.from(activityState.selectedGuestIds || []),
      saveGuestDebt: activityState.saveGuestDebt,
      shuttleBillingMode: activityState.shuttleBillingMode,
      shuttleCount: activityState.shuttleCount,
      expenses: activityState.expenses,
      frontPersonId: activityState.frontPersonId,
      frontAmount: activityState.frontAmount,
      isFrontAll: activityState.isFrontAll,
      tipAmount: activityState.tipAmount,
      matches: activityState.matches,
      temporaryAttendanceSaved: activityState.temporaryAttendanceSaved,
      savedAttendanceTime: activityState.savedAttendanceTime,
      isEditingAttendance: activityState.isEditingAttendance,
      updatedAt: Date.now()
    };
    localStorage.setItem(sessionKey, JSON.stringify(serializable));
  } catch (e) {}
}

function loadActivitySessionState() {
  try {
    const clubId = getActiveClubId();
    const sessionKey = 'CLB_SESSION_' + clubId;
    const raw = localStorage.getItem(sessionKey);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data) return false;

    const validMemberIds = new Set((AppState.members || []).map(m => m.id));
    const restoredMembers = new Set((data.selectedMemberIds || []).filter(id => validMemberIds.has(id)));
    const restoredGuests = new Set((data.selectedGuestIds || []).filter(id => validMemberIds.has(id)));

    activityState.date = data.date || getTodayInputFormat();
    activityState.type = data.type || 'Buổi cầu';
    activityState.lang = data.lang || 'VI';
    activityState.selectedMemberIds = restoredMembers;
    activityState.selectedGuestIds = restoredGuests;
    activityState.saveGuestDebt = !!data.saveGuestDebt;
    activityState.shuttleBillingMode = data.shuttleBillingMode || 'BY_SHUTTLE';
    activityState.shuttleCount = data.shuttleCount || 6;
    if (data.expenses && Array.isArray(data.expenses) && data.expenses.length > 0) {
      activityState.expenses = data.expenses;
    }
    activityState.frontPersonId = data.frontPersonId || 'NONE';
    activityState.frontAmount = data.frontAmount || 0;
    activityState.isFrontAll = !!data.isFrontAll;
    activityState.tipAmount = data.tipAmount || 0;
    activityState.matches = data.matches || [];
    activityState.temporaryAttendanceSaved = !!data.temporaryAttendanceSaved;
    activityState.savedAttendanceTime = data.savedAttendanceTime || null;
    activityState.isEditingAttendance = !!data.isEditingAttendance;
    activityState.initialized = true;
    return true;
  } catch (e) {
    return false;
  }
}

function clearActivitySessionState() {
  try {
    const clubId = getActiveClubId();
    localStorage.removeItem('CLB_SESSION_' + clubId);
  } catch (e) {}
}

function initActivitySessionData(forceReset = false) {
  if (!forceReset && loadActivitySessionState()) {
    return;
  }

  activityState.date = getTodayInputFormat();
  activityState.type = 'Buổi cầu';
  activityState.lang = 'VI';
  activityState.selectedMemberIds = new Set();
  activityState.selectedGuestIds = new Set();
  activityState.saveGuestDebt = false;

  const boxPrice = AppState.config?.dailyBoxPrice || 340000;
  const count = AppState.config?.shuttlecocksPerBox || 12;
  const unitPrice = Math.round(boxPrice / count) || 28333;
  const mode = AppState.config?.shuttleBillingMode || 'BY_SHUTTLE';
  const defaultShuttleCount = AppState.config?.defaultShuttlesPerSession || 12;

  activityState.shuttleBillingMode = mode;
  activityState.shuttleCount = defaultShuttleCount;

  if (mode === 'BY_SHUTTLE') {
    const qty = defaultShuttleCount;
    const amount = Math.round(qty * (boxPrice / count));
    activityState.expenses = [
      { id: 1, title: 'Tiền cầu', qty: qty, unitPrice: unitPrice, amount: amount, isCombo: false, isShuttleRow: true }
    ];
  } else {
    const title = AppState.config?.dailyRateTitle || `ĐƠN GIÁ THEO NGÀY ${count}`;
    activityState.expenses = [
      { id: 1, title: title, qty: 1, unitPrice: boxPrice, amount: boxPrice, isCombo: false, isShuttleRow: true }
    ];
  }
  activityState.frontPersonId = 'NONE';
  activityState.frontAmount = 0;
  activityState.isFrontAll = false;
  activityState.tipAmount = 0;

  // Thống kê các trận cầu chỉ hiển thị khi người dùng bấm nút "+ Thêm trận", mặc định để rỗng
  activityState.matches = [];

  // Mặc định CHƯA ĐIỂM DANH thành viên nào theo yêu cầu người dùng (luôn hiển thị chưa điểm danh: 0/27)
  activityState.selectedMemberIds = new Set();
  activityState.selectedGuestIds = new Set();
  activityState.temporaryAttendanceSaved = false;
  activityState.savedAttendanceTime = null;
  activityState.isEditingAttendance = false;

  activityState.initialized = true;
}

// ==========================================
// 2.5 HỆ THỐNG PHÂN QUYỀN & QUẢN LÝ TRUY CẬP (ACCESS CONTROL & ROLES)
// ==========================================
function getCurrentUserRole() {
  if (AppState.auth && AppState.auth.user && AppState.auth.user.role) {
    return AppState.auth.user.role;
  }
  return 'ADMIN'; // Mặc định là Chủ nhiệm toàn quyền
}

function hasUserPermission(permKey) {
  const role = getCurrentUserRole();
  if (role === 'ADMIN') return true;

  const user = AppState.auth?.user;
  if (user && user.permissions && typeof user.permissions[permKey] === 'boolean') {
    return user.permissions[permKey];
  }

  // Fallback to role presets
  const defaults = getRoleDefaultPermissions(role);
  return !!defaults[permKey];
}

function canPerformAttendance() {
  return hasUserPermission('attendance');
}

function canPerformFinance() {
  return hasUserPermission('finance');
}

function canManageMembers() {
  return hasUserPermission('member');
}

function canManageTournaments() {
  return hasUserPermission('tournament');
}

function canScoreMatch() {
  return hasUserPermission('referee');
}

function canConfigSystem() {
  return hasUserPermission('config');
}

function canSyncTournament() {
  return hasUserPermission('tournament');
}

function switchActiveUserRole(role) {
  if (!AppState.auth) {
    AppState.auth = { isLoggedIn: true, user: {} };
  }
  AppState.auth.isLoggedIn = true;

  const activeClub = getActiveClub();
  const defaultAdminName = activeClub?.adminName || 'Chủ nhiệm CLB';
  const president = (AppState.members && AppState.members.find(m => m.id === (AppState.config?.leadership?.president || 'M001'))) || (AppState.members ? AppState.members[0] : null);
  const presidentName = president ? president.name : defaultAdminName;

  const viceLeader = (AppState.members && AppState.members.find(m => m.id === (AppState.config?.viceLeaderId || AppState.config?.leadership?.vicePresident1))) || (AppState.members && AppState.members.length > 1 ? AppState.members[1] : null);
  const viceName = viceLeader ? viceLeader.name : 'Phó chủ nhiệm CLB';

  const treasurer = (AppState.members && AppState.members.find(m => m.id === AppState.config?.leadership?.treasurer)) || (AppState.members && AppState.members.length > 2 ? AppState.members[2] : null);
  const treasurerName = treasurer ? treasurer.name : 'Thủ quỹ CLB';

  const referee = (AppState.members && AppState.members.find(m => m.id === AppState.config?.leadership?.secretary)) || (AppState.members && AppState.members.length > 3 ? AppState.members[3] : null);
  const refereeName = referee ? referee.name : 'Trọng tài CLB';

  const sampleMember = (AppState.members && AppState.members.find(m => m.role === 'MEMBER')) || (AppState.members ? AppState.members[AppState.members.length - 1] : null);

  if (role === 'ADMIN') {
    AppState.auth.user = {
      id: president ? president.id : 'M001',
      username: (president && president.username) ? president.username : (activeClub?.adminUsername || 'admin'),
      role: 'ADMIN',
      name: `${presidentName} (Chủ nhiệm)`,
      permissions: getRoleDefaultPermissions('ADMIN')
    };
  } else if (role === 'VICE_ADMIN') {
    AppState.auth.user = {
      id: viceLeader ? viceLeader.id : 'M002',
      username: (viceLeader && viceLeader.username) ? viceLeader.username : 'vice_admin',
      role: 'VICE_ADMIN',
      name: `${viceName} (Phó nhóm)`,
      permissions: getRoleDefaultPermissions('VICE_ADMIN')
    };
  } else if (role === 'TREASURER') {
    AppState.auth.user = {
      id: treasurer ? treasurer.id : 'M005',
      username: (treasurer && treasurer.username) ? treasurer.username : 'thuquy',
      role: 'TREASURER',
      name: `${treasurerName} (Thủ quỹ)`,
      permissions: getRoleDefaultPermissions('TREASURER')
    };
  } else if (role === 'REFEREE') {
    AppState.auth.user = {
      id: referee ? referee.id : 'M004',
      username: (referee && referee.username) ? referee.username : 'trongtai',
      role: 'REFEREE',
      name: `${refereeName} (Trọng tài)`,
      permissions: getRoleDefaultPermissions('REFEREE')
    };
  } else {
    AppState.auth.user = {
      id: sampleMember ? sampleMember.id : (president ? president.id : 'M001'),
      username: (sampleMember && sampleMember.username) ? sampleMember.username : 'member',
      role: 'MEMBER',
      name: sampleMember ? `${sampleMember.name} (Thành viên)` : 'Thành viên CLB',
      permissions: getRoleDefaultPermissions('MEMBER')
    };
  }

  saveData();
  renderAuthBadge();
  renderAttendanceRoleBanner();
  renderUserAccessTable();

  const roleSelect = document.getElementById('configActiveRoleSelect');
  if (roleSelect) roleSelect.value = `ROLE_${role}`;

  const roleDef = ROLE_DEFINITIONS[role] || { label: role, icon: '👤' };
  showToast(`Đã chuyển sang vai trò: ${roleDef.icon} ${roleDef.label}`, 'info');
}

function loginAsMemberAccount(memberId) {
  const member = AppState.members.find(m => m.id === memberId);
  if (!member) {
    showToast('Không tìm thấy tài khoản thành viên!', 'error');
    return;
  }
  if (member.status === 'LOCKED') {
    showToast(`⚠️ Tài khoản ${member.name} (@${member.username}) đang bị tạm khóa bởi Ban quản trị!`, 'warning');
    return;
  }
  if (!AppState.auth) {
    AppState.auth = { isLoggedIn: true, user: {} };
  }
  AppState.auth.isLoggedIn = true;
  AppState.auth.user = {
    id: member.id,
    username: member.username || member.id.toLowerCase(),
    role: member.role || 'MEMBER',
    name: member.name,
    permissions: member.permissions ? { ...member.permissions } : getRoleDefaultPermissions(member.role || 'MEMBER')
  };

  saveData();
  renderAuthBadge();
  renderAttendanceRoleBanner();
  renderUserAccessTable();

  const roleSelect = document.getElementById('configActiveRoleSelect');
  if (roleSelect) roleSelect.value = `MEMBER_${member.id}`;

  const roleDef = ROLE_DEFINITIONS[member.role] || ROLE_DEFINITIONS.MEMBER;
  showToast(`✓ Đã đăng nhập: ${member.name} (${roleDef.icon} ${roleDef.label})`, 'success');
}

function onRoleOrAccountSelected(val) {
  if (!val) return;
  if (val.startsWith('ROLE_')) {
    const role = val.replace('ROLE_', '');
    switchActiveUserRole(role);
  } else if (val.startsWith('MEMBER_')) {
    const memberId = val.replace('MEMBER_', '');
    loginAsMemberAccount(memberId);
  }
}

function renderAttendanceRoleBanner() {
  const banner = document.getElementById('actRolePermissionBanner');
  if (!banner) return;

  const role = getCurrentUserRole();
  const user = AppState.auth?.user;
  const userName = user?.name || 'Người dùng';
  const canAttend = canPerformAttendance();

  if (role === 'ADMIN') {
    banner.className = 'hidden';
    banner.innerHTML = '';
    return;
  } else if (role === 'VICE_ADMIN') {
    if (canAttend) {
      banner.className = 'p-3 rounded-2xl border text-xs flex items-center justify-between transition shadow-2xs bg-blue-50/90 border-blue-300 text-blue-950 flex-wrap gap-2';
      banner.innerHTML = `
        <div class="flex items-center gap-2.5">
          <span class="text-2xl select-none">🛡️</span>
          <div>
            <div class="font-extrabold text-xs text-blue-950 flex items-center gap-1.5 flex-wrap">
              <span>Vai trò: Phó nhóm (${userName})</span>
              <span class="px-2 py-0.5 bg-blue-200 text-blue-900 rounded-full text-[10px] font-black uppercase">Được cấp quyền điểm danh</span>
            </div>
            <div class="text-[11px] text-blue-800 mt-0.5">✓ Bạn có quyền chọn thành viên, chốt tiền sân và chia tiền buổi sinh hoạt.</div>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button type="button" onclick="switchActiveUserRole('ADMIN')" class="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-xl font-bold text-[11px] shadow-2xs transition cursor-pointer flex items-center gap-1">
            <span>👑</span>
            <span>Về vai Chủ nhiệm</span>
          </button>
        </div>
      `;
    } else {
      banner.className = 'p-3 rounded-2xl border text-xs flex items-center justify-between transition shadow-2xs bg-amber-50 border-amber-300 text-amber-950 flex-wrap gap-2';
      banner.innerHTML = `
        <div class="flex items-center gap-2.5">
          <span class="text-2xl select-none">🔒</span>
          <div>
            <div class="font-extrabold text-xs text-amber-950 flex items-center gap-1.5 flex-wrap">
              <span>Vai trò: Phó nhóm (${userName})</span>
              <span class="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full text-[10px] font-black uppercase">Chưa được cấp quyền điểm danh</span>
            </div>
            <div class="text-[11px] text-amber-800 mt-0.5">⚠️ Quyền điểm danh chưa được bật cho tài khoản này. Vui lòng liên hệ Chủ nhiệm để cấp quyền.</div>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button type="button" onclick="switchActiveUserRole('ADMIN')" class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[11px] shadow-xs transition cursor-pointer flex items-center gap-1">
            <span>👑</span>
            <span>Đổi về Chủ nhiệm cấp quyền</span>
          </button>
        </div>
      `;
    }
  } else if (role === 'TREASURER') {
    banner.className = 'p-3 rounded-2xl border text-xs flex items-center justify-between transition shadow-2xs bg-emerald-50 border-emerald-300 text-emerald-950 flex-wrap gap-2';
    banner.innerHTML = `
      <div class="flex items-center gap-2.5">
        <span class="text-2xl select-none">💰</span>
        <div>
          <div class="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5 flex-wrap">
            <span>Vai trò: Thủ quỹ (${userName})</span>
            <span class="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full text-[10px] font-black uppercase">Điểm danh & Quản lý Quỹ</span>
          </div>
          <div class="text-[11px] text-emerald-800 mt-0.5">✓ Bạn có quyền điểm danh, nạp tiền ví thành viên và quản lý Quỹ CLB.</div>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button type="button" onclick="switchActiveUserRole('ADMIN')" class="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold text-[11px] shadow-2xs transition cursor-pointer flex items-center gap-1">
          <span>👑</span>
          <span>Về vai Chủ nhiệm</span>
        </button>
      </div>
    `;
  } else if (role === 'REFEREE') {
    banner.className = 'p-3 rounded-2xl border text-xs flex items-center justify-between transition shadow-2xs bg-purple-50 border-purple-300 text-purple-950 flex-wrap gap-2';
    banner.innerHTML = `
      <div class="flex items-center gap-2.5">
        <span class="text-2xl select-none">⚖️</span>
        <div>
          <div class="font-extrabold text-xs text-purple-950 flex items-center gap-1.5 flex-wrap">
            <span>Vai trò: Trọng tài (${userName})</span>
            <span class="px-2 py-0.5 bg-purple-200 text-purple-900 rounded-full text-[10px] font-black uppercase">Nhập điểm giải đấu</span>
          </div>
          <div class="text-[11px] text-purple-800 mt-0.5">ℹ️ Bạn có quyền cập nhật tỉ số các sân đấu giải. Quyền điểm danh sinh hoạt: ${canAttend ? 'Được cấp' : 'Chỉ xem'}.</div>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button type="button" onclick="switchActiveUserRole('ADMIN')" class="px-2.5 py-1 bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-xl font-bold text-[11px] shadow-2xs transition cursor-pointer flex items-center gap-1">
          <span>👑</span>
          <span>Về vai Chủ nhiệm</span>
        </button>
      </div>
    `;
  } else {
    banner.className = 'p-3 rounded-2xl border text-xs flex items-center justify-between transition shadow-2xs bg-slate-100 border-slate-300 text-slate-800 flex-wrap gap-2';
    banner.innerHTML = `
      <div class="flex items-center gap-2.5">
        <span class="text-2xl select-none">👤</span>
        <div>
          <div class="font-extrabold text-xs text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Tài khoản: ${userName}</span>
            <span class="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-[10px] font-black uppercase">${canAttend ? 'Được cấp quyền điểm danh' : 'Chế độ xem'}</span>
          </div>
          <div class="text-[11px] text-slate-600 mt-0.5">${canAttend ? '✓ Bạn được cấp quyền điểm danh buổi chơi.' : 'Chỉ xem thông tin điểm danh và danh sách người chơi. Không có quyền sửa đổi.'}</div>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button type="button" onclick="switchActiveUserRole('ADMIN')" class="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-[11px] shadow-xs transition cursor-pointer flex items-center gap-1">
          <span>👑</span>
          <span>Đăng nhập Chủ nhiệm</span>
        </button>
      </div>
    `;
  }
}

function renderAttendanceTab() {
  if (!activityState.initialized) {
    initActivitySessionData();
  }

  const dateInp = document.getElementById('actDateInput');
  if (dateInp) dateInp.value = activityState.date || getTodayInputFormat();

  const typeSel = document.getElementById('actTypeSelect');
  if (typeSel) typeSel.value = activityState.type;

  renderAttendanceRoleBanner();
  updateDailyRatePresetBadgeUI();
  updateShuttleBillingUI();

  renderActivityMemberChips();
  renderActivityGuestChips();
  renderActivityExpenseRows();
  populateFrontPersonDropdown();
  recalculateActivitySplit();
  updateAttendanceSaveBarUI();
  renderActivityMatches();
  lucide.createIcons();
}

// --- 3. ĐIỂM DANH THÀNH VIÊN (CHIP NÚT 6 TRÊN CÙNG 1 HÀNG THU GỌN GÀNG) ---
function renderActivityMemberChips() {
  const officialGrid = document.getElementById('actOfficialMemberGrid');
  const honoraryGrid = document.getElementById('actHonoraryMemberGrid');
  const totalBadge = document.getElementById('actMemberCountBadge');
  const offBadge = document.getElementById('actOfficialCountBadge');
  const honBadge = document.getElementById('actHonoraryCountBadge');

  if (!officialGrid || !honoraryGrid) return;

  const officialMembers = AppState.members.filter(m => m.type === 'OFFICIAL');
  const honoraryMembers = AppState.members.filter(m => m.type === 'HONORARY' || m.type === 'UNOFFICIAL');

  let offSelectedCount = 0;
  let honSelectedCount = 0;

  // Render Thành viên chính thức (20 người - 6 trên 1 hàng)
  officialGrid.innerHTML = officialMembers.map(m => {
    const isSel = activityState.selectedMemberIds.has(m.id);
    if (isSel) offSelectedCount++;
    const label = m.chipName || m.name.split(' ').pop().toUpperCase();

    return `
      <button type="button" onclick="toggleActivityMember('${m.id}')"
        class="py-1 px-0.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition shadow-2xs select-none min-h-[34px] flex items-center justify-center cursor-pointer leading-tight ${
          isSel 
            ? 'bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-emerald-900/15 ring-1 ring-emerald-600' 
            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
        }" title="${m.name} (${formatMoney(m.balance || 0)})">
        <span class="truncate max-w-full">${isSel ? '✓ ' : ''}${label}</span>
      </button>
    `;
  }).join('');

  // Render Thành viên danh dự (7 người - 6 trên 1 hàng)
  honoraryGrid.innerHTML = honoraryMembers.map(m => {
    const isSel = activityState.selectedMemberIds.has(m.id);
    if (isSel) honSelectedCount++;
    const label = m.chipName || m.name.split(' ').pop().toUpperCase();

    return `
      <button type="button" onclick="toggleActivityMember('${m.id}')"
        class="py-1 px-0.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition shadow-2xs select-none min-h-[34px] flex items-center justify-center cursor-pointer leading-tight ${
          isSel 
            ? 'bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-emerald-900/15 ring-1 ring-emerald-600' 
            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
        }" title="${m.name} (${formatMoney(m.balance || 0)})">
        <span class="truncate max-w-full">${isSel ? '✓ ' : ''}${label}</span>
      </button>
    `;
  }).join('');

  if (totalBadge) totalBadge.textContent = activityState.selectedMemberIds.size;
  if (offBadge) offBadge.textContent = `${offSelectedCount}/${officialMembers.length}`;
  if (honBadge) honBadge.textContent = `${honSelectedCount}/${honoraryMembers.length}`;
}

function toggleActivityMember(memberId) {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền điểm danh! Vui lòng liên hệ Trưởng nhóm để được cấp quyền.', 'warning');
    return;
  }
  if (activityState.selectedMemberIds.has(memberId)) {
    activityState.selectedMemberIds.delete(memberId);
  } else {
    activityState.selectedMemberIds.add(memberId);
  }
  if (activityState.temporaryAttendanceSaved) {
    activityState.isEditingAttendance = true;
  }
  saveActivitySessionState();
  renderActivityMemberChips();
  recalculateActivitySplit();
  updateAttendanceSaveBarUI();
  renderActivityMatches();
}

function selectAllActivityMembers() {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền điểm danh! Vui lòng liên hệ Trưởng nhóm.', 'warning');
    return;
  }
  AppState.members.forEach(m => {
    if (m.type === 'OFFICIAL' || m.type === 'HONORARY' || m.type === 'UNOFFICIAL') {
      activityState.selectedMemberIds.add(m.id);
    }
  });
  if (activityState.temporaryAttendanceSaved) {
    activityState.isEditingAttendance = true;
  }
  saveActivitySessionState();
  renderActivityMemberChips();
  recalculateActivitySplit();
  updateAttendanceSaveBarUI();
  renderActivityMatches();
}

function deselectAllActivityMembers() {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền điểm danh! Vui lòng liên hệ Trưởng nhóm.', 'warning');
    return;
  }
  activityState.selectedMemberIds.clear();
  if (activityState.temporaryAttendanceSaved) {
    activityState.isEditingAttendance = true;
  }
  saveActivitySessionState();
  renderActivityMemberChips();
  recalculateActivitySplit();
  updateAttendanceSaveBarUI();
  renderActivityMatches();
}

// --- 4. KHÁCH (HIỂN THỊ MỖI LEVEL TRÊN 1 DÒNG: Level A : THẾ ANH , PHONG , QUANG-Q) ---
function renderActivityGuestChips() {
  const container = document.getElementById('actGuestLevelsContainer') || document.getElementById('actGuestMemberGrid');
  const countBadge = document.getElementById('actGuestCountBadge');
  if (!container) return;

  if (countBadge) countBadge.textContent = activityState.selectedGuestIds.size;

  const guests = AppState.members.filter(m => m.type && m.type.startsWith('GUEST'));

  if (guests.length === 0) {
    container.innerHTML = `<span class="text-slate-400 text-xs italic py-1">Chưa có khách nào trong danh sách.</span>`;
    return;
  }

  const levels = [
    { key: 'GUEST_A', label: 'Level A', price: 90000, color: 'text-emerald-800' },
    { key: 'GUEST_B', label: 'Level B', price: 70000, color: 'text-amber-800' },
    { key: 'GUEST_C', label: 'Level C', price: 50000, color: 'text-blue-800' }
  ];

  container.className = "space-y-2";

  container.innerHTML = levels.map(lvl => {
    const groupGuests = guests.filter(g => g.type === lvl.key || g.level === lvl.label.replace('Level ', ''));
    if (groupGuests.length === 0) return '';

    return `
      <div class="flex items-center gap-2 py-1 flex-nowrap overflow-x-auto mobile-scroll">
        <!-- Nhãn Level trên cùng 1 dòng -->
        <div class="shrink-0 flex items-center gap-1 font-black text-xs min-w-[68px]">
          <span class="${lvl.color} font-extrabold">${lvl.label}</span>
          <span class="text-slate-400 font-bold">:</span>
        </div>

        <!-- Danh sách khách hiển thị dạng chip nút bấm trên cùng 1 dòng -->
        <div class="flex items-center gap-1.5 flex-nowrap shrink-0">
          ${groupGuests.map((g, idx) => {
            const isSel = activityState.selectedGuestIds.has(g.id);
            const displayName = g.chipName || g.name;
            return `
              <button type="button" onclick="toggleActivityGuest('${g.id}')"
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs select-none whitespace-nowrap cursor-pointer flex items-center gap-1 shrink-0 ${
                  isSel 
                    ? 'bg-emerald-700 text-white shadow-emerald-900/15 ring-1 ring-emerald-600 font-black' 
                    : 'bg-white text-slate-800 border border-slate-200 hover:border-slate-300'
                }">
                <span>${isSel ? '✓ ' : ''}${displayName}</span>
              </button>
              ${idx < groupGuests.length - 1 ? '<span class="text-slate-300 font-bold text-xs select-none">,</span>' : ''}
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function toggleActivityGuest(guestId) {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền điểm danh! Vui lòng liên hệ Trưởng nhóm để được cấp quyền.', 'warning');
    return;
  }
  if (activityState.selectedGuestIds.has(guestId)) {
    activityState.selectedGuestIds.delete(guestId);
  } else {
    activityState.selectedGuestIds.add(guestId);
  }
  if (activityState.temporaryAttendanceSaved) {
    activityState.isEditingAttendance = true;
  }
  saveActivitySessionState();
  renderActivityGuestChips();
  recalculateActivitySplit();
  updateAttendanceSaveBarUI();
  renderActivityMatches();
}

function addNewGuestInline() {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền thêm khách vào buổi sinh hoạt!', 'warning');
    return;
  }
  const nameInput = document.getElementById('newGuestNameInput');
  const levelSelect = document.getElementById('newGuestLevelSelect');
  if (!nameInput) return;

  const rawName = nameInput.value.trim();
  if (!rawName) {
    showToast('Vui lòng nhập tên khách mới!', 'warning');
    nameInput.focus();
    return;
  }

  let levelKey = levelSelect ? levelSelect.value : 'GUEST_C';
  if (levelKey === 'UNRANKED') levelKey = 'GUEST_C';

  const fee = levelKey === 'GUEST_A' ? 90000 : (levelKey === 'GUEST_B' ? 70000 : 50000);
  const levelLetter = levelKey.replace('GUEST_', '');

  const newGuest = {
    id: 'G_' + Date.now(),
    name: rawName,
    chipName: rawName.toUpperCase(),
    phone: '',
    type: levelKey,
    level: levelLetter,
    fee: fee,
    username: '',
    password: '',
    balance: 0,
    monthlySessions: 1,
    role: 'MEMBER',
    status: 'ACTIVE',
    permissions: getRoleDefaultPermissions('MEMBER')
  };

  AppState.members.push(newGuest);
  activityState.selectedGuestIds.add(newGuest.id);
  if (activityState.temporaryAttendanceSaved) {
    activityState.isEditingAttendance = true;
  }
  saveData();
  saveActivitySessionState();

  nameInput.value = '';
  renderActivityGuestChips();
  recalculateActivitySplit();
  updateAttendanceSaveBarUI();
  renderActivityMatches();
  showToast(`Đã thêm khách "${rawName}" (${levelLetter} - ${formatMoney(fee)})!`, 'success');
}

function toggleSaveGuestDebt(checked) {
  activityState.saveGuestDebt = checked;
  saveActivitySessionState();
}

// --- 4C. DÒNG LƯU VÀ SỬA ĐIỂM DANH TẠM THỜI (ÁP DỤNG CHO THỐNG KÊ TRẬN CẦU) ---
function updateAttendanceSaveBarUI() {
  const bar = document.getElementById('actAttendanceSaveBar');
  const badge = document.getElementById('actSaveStatusBadge');
  const countText = document.getElementById('actSaveCountText');
  const noteText = document.getElementById('actSaveNoteText');
  const btnSave = document.getElementById('btnSaveTempAttendance');
  const btnLabel = document.getElementById('btnSaveTempAttendanceLabel');

  if (!bar) return;

  const memCount = activityState.selectedMemberIds ? activityState.selectedMemberIds.size : 0;
  const guestCount = activityState.selectedGuestIds ? activityState.selectedGuestIds.size : 0;
  const total = memCount + guestCount;

  if (activityState.temporaryAttendanceSaved) {
    if (activityState.isEditingAttendance) {
      // Đang ở chế độ chỉnh sửa / bổ sung
      bar.className = 'mt-3 p-3 rounded-2xl border border-amber-300 bg-amber-50/80 flex items-center justify-between gap-2.5 flex-wrap shadow-2xs transition-all';
      if (badge) {
        badge.className = 'px-2 py-1 rounded-lg text-[10px] font-black bg-amber-200 text-amber-900 tracking-tight shrink-0 transition-colors';
        badge.textContent = 'Đang bổ sung...';
      }
      if (countText) countText.textContent = `${total} người đang chọn (${memCount} TV, ${guestCount} Khách)`;
      if (noteText) noteText.textContent = 'Chạm thêm người vừa đến rồi bấm "Lưu bổ sung" để cập nhật trận cầu';
      if (btnLabel) btnLabel.textContent = 'Lưu bổ sung';
      if (btnSave) btnSave.className = 'px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer';
    } else {
      // Đã lưu tạm thành công
      bar.className = 'mt-3 p-3 rounded-2xl border border-emerald-300 bg-emerald-50/80 flex items-center justify-between gap-2.5 flex-wrap shadow-2xs transition-all';
      if (badge) {
        badge.className = 'px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-200 text-emerald-900 tracking-tight shrink-0 transition-colors';
        badge.textContent = '✓ Đã lưu tạm';
      }
      if (countText) countText.textContent = `${total} người đã lưu (${memCount} TV, ${guestCount} Khách)`;
      if (noteText) noteText.textContent = `Đã lưu tạm (${activityState.savedAttendanceTime || ''}) • Bấm "Chốt & Trừ Ví" để hoàn tất trừ quỹ`;
      if (btnLabel) btnLabel.textContent = '✓ Đã lưu tạm';
      if (btnSave) btnSave.className = 'px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer';
    }
  } else {
    // Chưa lưu lần nào
    bar.className = 'mt-3 p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2.5 flex-wrap shadow-2xs transition-all';
    if (badge) {
      badge.className = 'px-2 py-1 rounded-lg text-[10px] font-black bg-slate-200 text-slate-700 tracking-tight shrink-0 transition-colors';
      badge.textContent = 'Chưa lưu tạm';
    }
    if (countText) countText.textContent = `${total} người được chọn (${memCount} TV, ${guestCount} Khách)`;
    if (noteText) noteText.textContent = 'Bấm "Lưu điểm danh" hoặc "Chốt & Trừ Ví" để áp dụng';
    if (btnLabel) btnLabel.textContent = 'Lưu điểm danh';
    if (btnSave) btnSave.className = 'px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer';
  }
}

function saveTemporaryAttendance() {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền lưu điểm danh! Vui lòng liên hệ Trưởng nhóm để được cấp quyền.', 'warning');
    return;
  }
  const memCount = activityState.selectedMemberIds ? activityState.selectedMemberIds.size : 0;
  const guestCount = activityState.selectedGuestIds ? activityState.selectedGuestIds.size : 0;
  const total = memCount + guestCount;

  if (total === 0) {
    showToast('Vui lòng chọn ít nhất 1 thành viên hoặc khách trước khi lưu điểm danh!', 'warning');
    return;
  }

  activityState.temporaryAttendanceSaved = true;
  activityState.isEditingAttendance = false;
  activityState.savedAttendanceTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  // Tự động gán người chơi cho các trận cầu mẫu nếu đang để trống
  const attendees = getCheckedInAttendees();
  if (activityState.matches && activityState.matches.length > 0 && attendees.length >= 4) {
    const m1 = activityState.matches[0];
    if (m1 && (!m1.team1[0] || m1.team1[0] === 'M001')) {
      m1.team1 = [attendees[0].id, attendees[1].id];
      m1.team2 = [attendees[2].id, attendees[3].id];
    }
  }

  saveActivitySessionState();
  updateAttendanceSaveBarUI();
  renderActivityMatches();

  showToast(`✓ Đã lưu tạm ${total} người điểm danh! Đã áp dụng cho thống kê các trận cầu.`, 'success');
}

function editAttendancePrompt() {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền sửa điểm danh! Vui lòng liên hệ Trưởng nhóm.', 'warning');
    return;
  }
  activityState.isEditingAttendance = true;
  updateAttendanceSaveBarUI();

  // Cuộn mượt mà lên phần điểm danh thành viên
  const memSection = document.getElementById('actOfficialMemberGrid');
  if (memSection) {
    memSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    memSection.classList.add('ring-2', 'ring-amber-400', 'p-1', 'rounded-xl', 'transition-all');
    setTimeout(() => {
      memSection.classList.remove('ring-2', 'ring-amber-400', 'p-1', 'rounded-xl');
    }, 1200);
  }

  showToast('Chế độ sửa / bổ sung: Hãy chạm chọn thêm người vừa đến rồi bấm "Lưu bổ sung"!', 'info');
}

// --- 5. CHI PHÍ (THEO ẢNH 1) ---
function renderActivityExpenseRows() {
  const container = document.getElementById('actExpenseRowsContainer');
  if (!container) return;

  container.innerHTML = activityState.expenses.map((exp, idx) => {
    return `
      <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm relative">
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-[10px] text-slate-400 font-bold mb-1 text-center">Số lượng (quả)</label>
            <input type="number" min="1" value="${exp.qty}" oninput="updateExpenseQty(${exp.id}, this.value)" class="w-full text-xs font-black border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center text-slate-900" />
          </div>
          <div>
            <label class="block text-[10px] text-slate-400 font-bold mb-1 text-right">Đơn giá</label>
            <input type="number" min="0" step="5000" value="${exp.unitPrice}" oninput="updateExpenseUnitPrice(${exp.id}, this.value)" class="w-full text-xs font-black border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right text-slate-900" />
          </div>
          <div>
            <label class="block text-[10px] text-slate-400 font-bold mb-1 text-right">Số tiền</label>
            <input type="number" min="0" step="5000" value="${exp.amount}" oninput="updateExpenseAmountDirect(${exp.id}, this.value)" class="w-full text-xs font-black text-emerald-800 border border-slate-200 rounded-xl px-2.5 py-2 bg-emerald-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right" />
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function addActivityExpenseRow() {
  activityState.expenses.push({
    id: Date.now(),
    title: '',
    qty: 1,
    unitPrice: 0,
    amount: 0,
    isCombo: false
  });
  saveActivitySessionState();
  renderActivityExpenseRows();
  recalculateActivitySplit();
}

function removeActivityExpenseRow(id) {
  activityState.expenses = activityState.expenses.filter(e => e.id !== id);
  if (activityState.expenses.length === 0) {
    activityState.expenses.push({ id: Date.now(), title: '', qty: 1, unitPrice: 0, amount: 0, isCombo: false });
  }
  saveActivitySessionState();
  renderActivityExpenseRows();
  recalculateActivitySplit();
}

function updateExpenseTitle(id, val) {
  const exp = activityState.expenses.find(e => e.id === id);
  if (exp) {
    exp.title = val;
    saveActivitySessionState();
  }
}

function updateExpenseQty(id, val) {
  const exp = activityState.expenses.find(e => e.id === id);
  if (exp) {
    exp.qty = Math.max(1, Number(val) || 1);
    if (exp.isShuttleRow && (AppState.config?.shuttleBillingMode !== 'BY_BOX')) {
      const boxPrice = AppState.config?.dailyBoxPrice || 340000;
      const countPerBox = AppState.config?.shuttlecocksPerBox || 12;
      const unitPrice = Math.round(boxPrice / countPerBox) || 28333;
      exp.unitPrice = unitPrice;
      exp.amount = Math.round(exp.qty * (boxPrice / countPerBox));
    } else {
      exp.amount = exp.qty * exp.unitPrice;
    }
    saveActivitySessionState();
    renderActivityExpenseRows();
    recalculateActivitySplit();
  }
}

function updateExpenseUnitPrice(id, val) {
  const exp = activityState.expenses.find(e => e.id === id);
  if (exp) {
    exp.unitPrice = Math.max(0, Number(val) || 0);
    exp.amount = exp.qty * exp.unitPrice;
    saveActivitySessionState();
    renderActivityExpenseRows();
    recalculateActivitySplit();
  }
}

function updateExpenseAmountDirect(id, val) {
  const exp = activityState.expenses.find(e => e.id === id);
  if (exp) {
    exp.amount = Math.max(0, Number(val) || 0);
    exp.unitPrice = Math.round(exp.amount / exp.qty);
    saveActivitySessionState();
    recalculateActivitySplit();
  }
}

function updateExpenseCombo(id, checked) {
  const exp = activityState.expenses.find(e => e.id === id);
  if (exp) exp.isCombo = checked;
}

function updateShuttleBillingUI() {
  updateDailyRatePresetBadgeUI();
}

function switchShuttleBillingMode(mode) {
  AppState.config.shuttleBillingMode = mode;
  saveData();
  applyDailyRatePreset();
  updateDailyRatePresetBadgeUI();
}

function setShuttleCount(count) {
  const parsedCount = Math.max(1, Math.min(100, Number(count) || 1));
  const exp = activityState.expenses.find(e => e.isShuttleRow) || activityState.expenses[0];
  if (exp) {
    updateExpenseQty(exp.id, parsedCount);
  }
}

function adjustShuttleCount(delta) {
  const exp = activityState.expenses.find(e => e.isShuttleRow) || activityState.expenses[0];
  if (exp) {
    updateExpenseQty(exp.id, (exp.qty || 1) + delta);
  }
}

function updateDailyRatePresetBadgeUI() {
  const badge = document.getElementById('actDailyRatePresetBadge');
  if (!badge) return;
  const boxPrice = AppState.config?.dailyBoxPrice || 340000;
  const count = AppState.config?.shuttlecocksPerBox || 12;
  const unitPrice = Math.round(boxPrice / count) || 28333;
  const mode = AppState.config?.shuttleBillingMode || 'BY_SHUTTLE';
  if (mode === 'BY_SHUTTLE') {
    badge.textContent = `ĐƠN GIÁ THEO QUẢ = ${formatMoney(unitPrice)} (1 hộp ${count} quả = ${formatMoney(boxPrice)})`;
  } else {
    const title = AppState.config?.dailyRateTitle || `ĐƠN GIÁ THEO NGÀY ${count}`;
    badge.textContent = `${title} = ${formatMoney(boxPrice)}`;
  }
}

function applyDailyRatePreset(rate) {
  const boxPrice = rate !== undefined ? rate : (AppState.config?.dailyBoxPrice || 340000);
  const count = AppState.config?.shuttlecocksPerBox || 12;
  const unitPrice = Math.round(boxPrice / count) || 28333;
  const mode = AppState.config?.shuttleBillingMode || 'BY_SHUTTLE';

  if (activityState.expenses.length > 0) {
    if (mode === 'BY_SHUTTLE') {
      const qty = activityState.expenses[0].qty || count;
      activityState.expenses[0].title = 'Tiền cầu';
      activityState.expenses[0].unitPrice = unitPrice;
      activityState.expenses[0].qty = qty;
      activityState.expenses[0].amount = Math.round(qty * (boxPrice / count));
      activityState.expenses[0].isShuttleRow = true;
    } else {
      const title = AppState.config?.dailyRateTitle || `ĐƠN GIÁ THEO NGÀY ${count}`;
      activityState.expenses[0].title = title;
      activityState.expenses[0].unitPrice = boxPrice;
      activityState.expenses[0].qty = 1;
      activityState.expenses[0].amount = boxPrice;
      activityState.expenses[0].isShuttleRow = true;
    }
  } else {
    if (mode === 'BY_SHUTTLE') {
      activityState.expenses.push({
        id: Date.now(),
        title: 'Tiền cầu',
        qty: count,
        unitPrice: unitPrice,
        amount: boxPrice,
        isCombo: false,
        isShuttleRow: true
      });
    } else {
      const title = AppState.config?.dailyRateTitle || `ĐƠN GIÁ THEO NGÀY ${count}`;
      activityState.expenses.push({
        id: Date.now(),
        title: title,
        qty: 1,
        unitPrice: boxPrice,
        amount: boxPrice,
        isCombo: false,
        isShuttleRow: true
      });
    }
  }
  renderActivityExpenseRows();
  recalculateActivitySplit();
  showToast(`✓ Đã áp dụng định mức: ${mode === 'BY_SHUTTLE' ? formatMoney(unitPrice) + '/quả (1 hộp = ' + formatMoney(boxPrice) + ')' : formatMoney(boxPrice) + '/hộp'}!`, 'success');
}

// --- 6. KHOẢN ĐÓNG GÓP & NGƯỜI ỨNG TIỀN ---
function populateFrontPersonDropdown() {
  const select = document.getElementById('actFrontPersonSelect');
  if (!select) return;

  const eligible = AppState.members.filter(m => m.type === 'OFFICIAL' || m.type === 'HONORARY');

  let html = `<option value="NONE" ${activityState.frontPersonId === 'NONE' ? 'selected' : ''}>Không ai</option>`;
  eligible.forEach(m => {
    html += `<option value="${m.id}" ${activityState.frontPersonId === m.id ? 'selected' : ''}>${m.name}</option>`;
  });
  select.innerHTML = html;
}

function onFrontPersonChanged(val) {
  activityState.frontPersonId = val;
  recalculateActivitySplit();
}

function onFrontAllToggled(checked) {
  activityState.isFrontAll = checked;
  recalculateActivitySplit();
}

function onFrontAmountChanged(val) {
  activityState.frontAmount = Math.max(0, Number(val) || 0);
  const chk = document.getElementById('actFrontAllCheckbox');
  if (chk && activityState.isFrontAll) {
    chk.checked = false;
    activityState.isFrontAll = false;
  }
  recalculateActivitySplit();
}

function onTipAmountChanged(val) {
  activityState.tipAmount = Math.max(0, Number(val) || 0);
  recalculateActivitySplit();
}

function onActivityDateChanged(val) {
  activityState.date = val;
}

function onActivityTypeChanged(val) {
  activityState.type = val;
}

function setActivityLanguage(lang) {
  activityState.lang = lang;
  const btnVI = document.getElementById('actBtnLangVI');
  const btnEN = document.getElementById('actBtnLangEN');
  if (lang === 'VI') {
    if (btnVI) { btnVI.className = 'px-2.5 py-1 rounded-md bg-slate-900 text-white shadow-sm transition'; }
    if (btnEN) { btnEN.className = 'px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 transition'; }
  } else {
    if (btnVI) { btnVI.className = 'px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 transition'; }
    if (btnEN) { btnEN.className = 'px-2.5 py-1 rounded-md bg-slate-900 text-white shadow-sm transition'; }
  }
}

// --- 6B. THỐNG KÊ CÁC TRẬN CẦU & CHỌN NHANH NGƯỜI CHƠI (MATCH LOG) ---
function getCheckedInAttendees() {
  const list = [];
  // Thành viên có mặt (Chính thức + Danh dự)
  activityState.selectedMemberIds.forEach(id => {
    const m = AppState.members.find(x => x.id === id);
    if (m) {
      list.push({
        id: m.id,
        name: m.name,
        chipName: m.chipName || m.name.split(' ').pop().toUpperCase(),
        type: m.type
      });
    }
  });
  // Khách có mặt
  activityState.selectedGuestIds.forEach(id => {
    const g = AppState.members.find(x => x.id === id);
    if (g) {
      list.push({
        id: g.id,
        name: g.name,
        chipName: g.chipName || g.name,
        type: g.type
      });
    }
  });
  return list;
}

function buildAttendeeOptions(selectedId, excludeIds = []) {
  const attendees = getCheckedInAttendees();
  let html = `<option value="">-- Chọn người chơi --</option>`;
  attendees.forEach(a => {
    // Thành viên đã được chọn ở vị trí khác trong cùng trận sẽ không hiển thị ở lựa chọn này
    if (excludeIds.includes(a.id) && a.id !== selectedId) {
      return;
    }
    const isSel = a.id === selectedId ? 'selected' : '';
    html += `<option value="${a.id}" ${isSel}>${a.chipName} (${a.name})</option>`;
  });
  return html;
}

function getAttendeeDisplayName(id) {
  if (!id) return '...';
  const found = AppState.members.find(m => m.id === id);
  if (!found) return id;
  return found.chipName || found.name.split(' ').pop().toUpperCase();
}

/**
 * Format dòng kết quả trận đấu hiển thị tỉ số ngay theo từng cặp:
 * Ví dụ: Trận 1: CHÍNH CÔNG (21) 🏆 đấu với DŨNG DUY (18)
 */
function formatMatchResultInfo(idx, m) {
  const p1 = (m.team1 && m.team1[0]) || '';
  const p2 = (m.team1 && m.team1[1]) || '';
  const p3 = (m.team2 && m.team2[0]) || '';
  const p4 = (m.team2 && m.team2[1]) || '';

  const name1 = getAttendeeDisplayName(p1);
  const name2 = getAttendeeDisplayName(p2);
  const name3 = getAttendeeDisplayName(p3);
  const name4 = getAttendeeDisplayName(p4);

  const pair1 = `${name1} ${name2}`.trim() || 'Cặp 1';
  const pair2 = `${name3} ${name4}`.trim() || 'Cặp 2';

  const s1 = (m.score1 !== undefined && m.score1 !== null) ? Number(m.score1) : 0;
  const s2 = (m.score2 !== undefined && m.score2 !== null) ? Number(m.score2) : 0;
  const prize = (m.prize && m.prize.trim()) ? m.prize.trim() : '';
  const matchTitle = (m.name && m.name.trim()) ? m.name.trim() : `Trận ${idx + 1}`;

  let highlight1 = 'font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg';
  let highlight2 = 'font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg';
  let badge1 = '';
  let badge2 = '';
  let statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">Đang đấu</span>';
  const prizePill = prize ? `<span class="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded text-[10px] shadow-2xs">🎁 ${prize}</span>` : '';

  if (s1 > s2 && (s1 > 0 || s2 > 0)) {
    highlight1 = 'font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300';
    badge1 = ' <span class="text-xs" title="Đội 1 Thắng">🏆</span>';
    statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1.5">🏆 ${pair1} Thắng ${prizePill}</span>`;
  } else if (s2 > s1 && (s1 > 0 || s2 > 0)) {
    highlight2 = 'font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300';
    badge2 = ' <span class="text-xs" title="Đội 2 Thắng">🏆</span>';
    statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1.5">🏆 ${pair2} Thắng ${prizePill}</span>`;
  } else if (s1 === s2 && s1 > 0) {
    statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1.5">Hòa ${prizePill}</span>`;
  } else if (prize) {
    statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 inline-flex items-center gap-1.5">Đang đấu ${prizePill}</span>`;
  }

  const prizeLineTag = prize ? ` <span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">🎁 ${prize}</span>` : '';
  const lineHtml = `${matchTitle}: <span class="${highlight1}"><b>${pair1}</b> (${s1})${badge1}</span> <span class="text-slate-400 font-bold px-1">đấu với</span> <span class="${highlight2}"><b>${pair2}</b> (${s2})${badge2}</span>${prizeLineTag}`;
  const headerPill = `${matchTitle}: 🏸 ${pair1} (${s1}) - (${s2}) ${pair2}${prize ? ` • 🎁 ${prize}` : ''}`;

  return { s1, s2, pair1, pair2, prize, matchTitle, lineHtml, headerPill, statusBadge };
}

function updateMatchResultRealtime() {
  const matches = activityState.matches || [];
  
  // Cập nhật bảng tổng hợp dòng trận đấu ở trên
  const summaryCard = document.getElementById('actMatchLinesSummaryCard');
  const summaryContainer = document.getElementById('actMatchLinesSummary');
  if (summaryCard && summaryContainer) {
    if (matches.length === 0) {
      summaryCard.classList.add('hidden');
    } else {
      summaryCard.classList.remove('hidden');
      summaryContainer.innerHTML = matches.map((m, idx) => {
        const info = formatMatchResultInfo(idx, m);
        return `
          <div class="p-2 bg-white rounded-xl border border-emerald-200/90 shadow-2xs flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="w-5 h-5 rounded-md bg-emerald-700 text-white font-black text-[10px] flex items-center justify-center">${idx + 1}</span>
              <span class="text-xs text-slate-800">${info.lineHtml}</span>
            </div>
            <div>${info.statusBadge}</div>
          </div>
        `;
      }).join('');
    }
  }

  // Cập nhật từng card trận đấu
  matches.forEach((m, idx) => {
    const info = formatMatchResultInfo(idx, m);
    const lineEl = document.getElementById(`matchCardResultLine-${m.id}`);
    const badgeEl = document.getElementById(`matchHeaderResult-${m.id}`);
    const prizeBadgeEl = document.getElementById(`matchPrizeBadge-${m.id}`);

    if (lineEl) {
      lineEl.innerHTML = `
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-xs">🏸</span>
          <span class="text-xs">${info.lineHtml}</span>
        </div>
        <div>${info.statusBadge}</div>
      `;
    }
    if (badgeEl) {
      badgeEl.textContent = info.headerPill;
    }
    if (prizeBadgeEl) {
      if (m.prize && m.prize.trim()) {
        prizeBadgeEl.textContent = m.prize.trim();
        prizeBadgeEl.classList.remove('hidden');
      } else {
        prizeBadgeEl.classList.add('hidden');
      }
    }
  });
}

function renderActivityMatches() {
  const container = document.getElementById('actMatchesContainer');
  const countBadge = document.getElementById('actMatchCountBadge');
  const statsBar = document.getElementById('actMemberMatchStatsBar');
  const contentArea = document.getElementById('actMatchStatsContentArea');
  const randomBtn = document.getElementById('btnActRandomMatch');

  const matches = activityState.matches || [];

  // Mặc định ẩn toàn bộ chi tiết thống kê và các trận đấu khi chưa có trận nào (chỉ hiển thị khi bấm nút Thêm trận)
  if (matches.length === 0) {
    if (contentArea) contentArea.classList.add('hidden');
    if (countBadge) {
      countBadge.classList.add('hidden');
      countBadge.textContent = '0 trận';
    }
    if (randomBtn) randomBtn.classList.add('hidden');
    if (container) container.innerHTML = '';
    return;
  }

  // Khi có trận đấu (do bấm + Thêm trận hoặc Bốc thăm ngẫu nhiên) -> Hiển thị
  if (contentArea) contentArea.classList.remove('hidden');
  if (countBadge) {
    countBadge.classList.remove('hidden');
    countBadge.textContent = `${matches.length} trận`;
  }
  if (randomBtn) randomBtn.classList.remove('hidden');

  if (!container) return;

  // Thống kê số lần ra sân của từng thành viên có mặt
  const matchCounts = {};
  const attendees = getCheckedInAttendees();
  attendees.forEach(a => matchCounts[a.id] = 0);

  matches.forEach(m => {
    (m.team1 || []).forEach(pId => { if (matchCounts[pId] !== undefined) matchCounts[pId]++; });
    (m.team2 || []).forEach(pId => { if (matchCounts[pId] !== undefined) matchCounts[pId]++; });
  });

  // Render thanh tần suất
  if (statsBar) {
    if (attendees.length === 0) {
      statsBar.innerHTML = `<span class="text-slate-400 text-[11px] italic">Chưa có ai được điểm danh có mặt trong buổi này</span>`;
    } else {
      statsBar.innerHTML = attendees.map(a => {
        const c = matchCounts[a.id] || 0;
        const color = c === 0 ? 'bg-slate-100 text-slate-500 border-slate-200' : (c >= 2 ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' : 'bg-white text-slate-800 border-slate-200');
        return `
          <span class="px-2 py-1 rounded-lg text-[11px] border ${color} flex items-center gap-1 shadow-xs">
            <span>${a.chipName}:</span>
            <b class="text-xs">${c} trận</b>
          </span>
        `;
      }).join('');
    }
  }

  const prizeTypes = getPrizeTypes();

  container.innerHTML = matches.map((m, idx) => {
    const p1 = (m.team1 && m.team1[0]) || '';
    const p2 = (m.team1 && m.team1[1]) || '';
    const p3 = (m.team2 && m.team2[0]) || '';
    const p4 = (m.team2 && m.team2[1]) || '';

    const info = formatMatchResultInfo(idx, m);
    const prizeDetails = getMatchPrizeDetails(m);

    return `
      <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
        <!-- Match Header: Tên trận tùy chọn + Huy hiệu kết quả theo cặp + Xóa -->
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="w-6 h-6 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">${idx + 1}</span>
            <div class="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 shadow-2xs">
              <span class="text-[10px] text-slate-400 font-bold">Tên:</span>
              <input type="text" value="${m.name || `Trận ${idx + 1}`}" 
                     oninput="updateMatchName(${m.id}, this.value)" 
                     placeholder="Tên trận..." 
                     class="text-xs text-slate-900 font-black uppercase tracking-tight bg-transparent focus:outline-none border-0 w-28 sm:w-36" 
                     title="Chạm hoặc nhấp để đổi tên trận đấu" />
            </div>
            <span id="matchHeaderResult-${m.id}" class="text-[11px] font-bold text-emerald-900 bg-emerald-100/90 px-2 py-0.5 rounded-lg border border-emerald-300 shadow-2xs">
              ${info.headerPill}
            </span>
          </div>
          <button type="button" onclick="removeActivityMatch(${m.id})" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition" title="Xóa trận này">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- Match Teams & Scores Pickers (Tỉ số đi liền theo từng cặp) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          
          <!-- Đội 1 (Cặp 1) + Ô nhập tỉ số của Đội 1 -->
          <div class="space-y-1.5 bg-emerald-50/50 p-2 rounded-xl border border-emerald-200/80">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-[10px] font-black text-emerald-900 uppercase tracking-tight">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Đội 1 (Cặp 1)</span>
              </div>
              <div class="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-emerald-300 shadow-2xs">
                <span class="text-[10px] font-bold text-slate-500">Tỉ số:</span>
                <input type="number" min="0" max="30" value="${info.s1}" 
                       oninput="updateMatchScore(${m.id}, this.value, null)" 
                       class="w-10 text-center font-black text-xs text-emerald-900 bg-transparent focus:outline-none" 
                       title="Nhập tỉ số của Đội 1" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-1.5">
              <select onchange="updateMatchPlayer(${m.id}, 0, 0, this.value)" class="w-full text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white focus:ring-1 focus:ring-emerald-500">
                ${buildAttendeeOptions(p1, [p2, p3, p4].filter(Boolean))}
              </select>
              <select onchange="updateMatchPlayer(${m.id}, 0, 1, this.value)" class="w-full text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white focus:ring-1 focus:ring-emerald-500">
                ${buildAttendeeOptions(p2, [p1, p3, p4].filter(Boolean))}
              </select>
            </div>
          </div>

          <!-- Đội 2 (Cặp 2) + Ô nhập tỉ số của Đội 2 -->
          <div class="space-y-1.5 bg-amber-50/50 p-2 rounded-xl border border-amber-200/80">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-[10px] font-black text-amber-900 uppercase tracking-tight">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Đội 2 (Cặp 2)</span>
              </div>
              <div class="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-amber-300 shadow-2xs">
                <span class="text-[10px] font-bold text-slate-500">Tỉ số:</span>
                <input type="number" min="0" max="30" value="${info.s2}" 
                       oninput="updateMatchScore(${m.id}, null, this.value)" 
                       class="w-10 text-center font-black text-xs text-amber-900 bg-transparent focus:outline-none" 
                       title="Nhập tỉ số của Đội 2" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-1.5">
              <select onchange="updateMatchPlayer(${m.id}, 1, 0, this.value)" class="w-full text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white focus:ring-1 focus:ring-emerald-500">
                ${buildAttendeeOptions(p3, [p1, p2, p4].filter(Boolean))}
              </select>
              <select onchange="updateMatchPlayer(${m.id}, 1, 1, this.value)" class="w-full text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white focus:ring-1 focus:ring-emerald-500">
                ${buildAttendeeOptions(p4, [p1, p2, p3].filter(Boolean))}
              </select>
            </div>
          </div>

        </div>

        <!-- Thanh chọn giải thưởng trận đấu (Tùy chỉnh số lượng & loại giải thưởng) -->
        <div class="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/90 space-y-2">
          
          <!-- Tiêu đề + Huy hiệu giải thưởng + Nút bỏ thưởng -->
          <div class="flex items-center justify-between flex-wrap gap-1">
            <div class="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-tight">
              <span>🎁</span>
              <span>Giải thưởng đội thắng:</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span id="matchPrizeBadge-${m.id}" class="font-bold text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-md border border-amber-300 text-[11px] shadow-2xs ${m.prize ? '' : 'hidden'}">
                ${m.prize || ''}
              </span>
              ${m.prize ? `
              <button type="button" onclick="clearMatchPrize(${m.id})" class="text-[10px] text-slate-400 hover:text-rose-600 font-bold px-1 transition cursor-pointer" title="Bỏ giải thưởng">✕ Bỏ thưởng</button>
              ` : ''}
            </div>
          </div>

          <!-- Bộ điều chỉnh số lượng & Chọn loại giải thưởng -->
          <div class="flex items-center gap-2 flex-wrap">
            
            <!-- Tùy chỉnh số lượng: [ - ] [ 2 ] [ + ] -->
            <div class="flex items-center bg-white border border-amber-300 rounded-lg p-0.5 shadow-2xs shrink-0" title="Điều chỉnh số lượng phần thưởng">
              <span class="text-[10px] font-black text-amber-900 px-1.5 select-none">SL:</span>
              <button type="button" onclick="changeMatchPrizeQty(${m.id}, -1)" class="w-6 h-6 rounded bg-amber-100/80 hover:bg-amber-200 text-amber-900 font-black text-xs flex items-center justify-center transition cursor-pointer select-none">
                −
              </button>
              <input type="number" min="1" max="99" value="${prizeDetails.qty}" 
                     oninput="setMatchPrizeQty(${m.id}, this.value)" 
                     class="w-7 text-center font-black text-xs text-amber-950 bg-transparent focus:outline-none" 
                     title="Số lượng" />
              <button type="button" onclick="changeMatchPrizeQty(${m.id}, 1)" class="w-6 h-6 rounded bg-amber-100/80 hover:bg-amber-200 text-amber-900 font-black text-xs flex items-center justify-center transition cursor-pointer select-none">
                +
              </button>
            </div>

            <!-- Danh sách các loại giải thưởng -->
            <div class="flex items-center gap-1 flex-wrap flex-1">
              ${prizeTypes.map(t => {
                const isSelected = prizeDetails.type && prizeDetails.type.toLowerCase() === t.name.toLowerCase();
                const activeClass = isSelected 
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs font-black' 
                  : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100 font-bold';
                return `
                  <button type="button" onclick="selectMatchPrizeType(${m.id}, '${t.name}')" 
                          class="px-2 py-1 rounded-lg text-xs border transition flex items-center gap-1 cursor-pointer select-none ${activeClass}">
                    <span>${t.icon || '🎁'}</span>
                    <span>${t.name}</span>
                    ${t.isCustom ? `
                      <span onclick="event.stopPropagation(); removeCustomPrizeTypePrompt('${t.name}')" class="ml-1 text-[10px] text-amber-200 hover:text-white" title="Xóa loại này">✕</span>
                    ` : ''}
                  </button>
                `;
              }).join('')}

              <!-- Nút Thêm loại giải thưởng -->
              <button type="button" onclick="promptAddNewPrizeType(${m.id})" 
                      class="px-2 py-1 rounded-lg text-xs font-bold border border-dashed border-amber-400 bg-amber-100/50 hover:bg-amber-200/80 text-amber-900 flex items-center gap-1 transition cursor-pointer shadow-2xs" 
                      title="Thêm loại giải thưởng mới vào danh sách">
                <span>➕</span> Thêm loại
              </button>
            </div>

          </div>

          <!-- Nhập tự do khác -->
          <div class="flex items-center gap-1.5 pt-0.5">
            <span class="text-[11px] font-bold text-amber-900 shrink-0">Khác:</span>
            <input type="text" id="matchPrizeInput-${m.id}" 
                   value="${isCustomPrizeText(m.prize, prizeTypes) ? m.prize : ''}" 
                   oninput="updateMatchCustomPrize(${m.id}, this.value)" 
                   placeholder="Tự nhập giải thưởng khác (ví dụ: Chầu cafe, sinh tố bơ...)..." 
                   class="flex-1 text-xs font-semibold px-2.5 py-1 bg-white border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800" />
            ${isCustomPrizeText(m.prize, prizeTypes) ? `
            <button type="button" onclick="clearMatchPrize(${m.id})" class="text-slate-400 hover:text-rose-600 text-xs px-1 font-bold cursor-pointer" title="Xóa">✕</button>
            ` : ''}
          </div>

        </div>

        <!-- Dòng kết quả trận đấu hiển thị tỉ số theo cặp (kèm cúp thắng 🏆) -->
        <div id="matchCardResultLine-${m.id}" class="text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-xs">🏸</span>
            <span class="text-xs">${info.lineHtml}</span>
          </div>
          <div>${info.statusBadge}</div>
        </div>

      </div>
    `;
  }).join('');

  updateMatchResultRealtime();
  lucide.createIcons();
}

// --- QUẢN LÝ LOẠI GIẢI THƯỞNG & SỐ LƯỢNG TÙY CHỈNH ---
const DEFAULT_PRIZE_TYPES = [
  { name: 'Nước lọc', icon: '🥤' },
  { name: 'Bò húc', icon: '⚡' },
  { name: 'Bia', icon: '🍺' },
  { name: 'Nước ngọt', icon: '🧃' },
  { name: 'Cà phê', icon: '☕' }
];

function getPrizeTypes() {
  let custom = [];
  try {
    const saved = localStorage.getItem('clb_custom_prize_types');
    if (saved) custom = JSON.parse(saved);
  } catch (e) {}
  if (AppState && AppState.customPrizeTypes && AppState.customPrizeTypes.length > 0) {
    custom = AppState.customPrizeTypes;
  }

  const list = [...DEFAULT_PRIZE_TYPES];
  custom.forEach(item => {
    const name = typeof item === 'string' ? item : item.name;
    const icon = typeof item === 'object' && item.icon ? item.icon : '🎁';
    if (!list.some(x => x.name.toLowerCase() === name.toLowerCase())) {
      list.push({ name, icon, isCustom: true });
    }
  });
  return list;
}

function saveCustomPrizeType(typeName, icon = '🎁') {
  const trimmed = typeName.trim();
  if (!trimmed) return null;
  let custom = [];
  try {
    const saved = localStorage.getItem('clb_custom_prize_types');
    if (saved) custom = JSON.parse(saved);
  } catch (e) {}
  if (!custom.some(x => (typeof x === 'string' ? x : x.name).toLowerCase() === trimmed.toLowerCase())) {
    custom.push({ name: trimmed, icon, isCustom: true });
    localStorage.setItem('clb_custom_prize_types', JSON.stringify(custom));
    if (AppState) {
      AppState.customPrizeTypes = custom;
      if (typeof saveData === 'function') saveData();
    }
  }
  return trimmed;
}

function removeCustomPrizeType(typeName) {
  let custom = [];
  try {
    const saved = localStorage.getItem('clb_custom_prize_types');
    if (saved) custom = JSON.parse(saved);
  } catch (e) {}
  custom = custom.filter(x => (typeof x === 'string' ? x : x.name).toLowerCase() !== typeName.toLowerCase());
  localStorage.setItem('clb_custom_prize_types', JSON.stringify(custom));
  if (AppState) {
    AppState.customPrizeTypes = custom;
    if (typeof saveData === 'function') saveData();
  }
}

function removeCustomPrizeTypePrompt(name) {
  if (confirm(`Bạn có chắc muốn xóa loại giải thưởng "${name}" khỏi danh sách chọn nhanh?`)) {
    removeCustomPrizeType(name);
    renderActivityMatches();
    showToast(`Đã xóa loại giải thưởng: ${name}`, 'info');
  }
}

function getMatchPrizeDetails(m) {
  let qty = m.prizeQty || 2;
  let type = m.prizeType || '';
  if (!type && m.prize) {
    const match = m.prize.match(/^(\d+)\s+(.+)$/);
    if (match) {
      qty = parseInt(match[1]) || 2;
      type = match[2].trim();
    } else {
      type = m.prize.trim();
    }
  }
  return { qty, type };
}

function isCustomPrizeText(prize, availableTypes) {
  if (!prize || !prize.trim()) return false;
  const types = availableTypes || getPrizeTypes();
  const match = prize.match(/^\d+\s+(.+)$/);
  const typeName = match ? match[1].trim().toLowerCase() : prize.trim().toLowerCase();
  return !types.some(t => t.name.toLowerCase() === typeName);
}

function selectMatchPrizeType(matchId, typeName) {
  const m = activityState.matches.find(x => x.id === matchId);
  if (!m) return;
  const { qty, type } = getMatchPrizeDetails(m);

  if (type && type.toLowerCase() === typeName.toLowerCase()) {
    // Nhấp lại vào loại đang chọn để bỏ chọn
    m.prize = '';
    m.prizeType = '';
  } else {
    m.prizeType = typeName;
    m.prizeQty = qty || 2;
    m.prize = `${m.prizeQty} ${typeName}`;
  }
  renderActivityMatches();
}

function changeMatchPrizeQty(matchId, delta) {
  const m = activityState.matches.find(x => x.id === matchId);
  if (!m) return;
  const { qty, type } = getMatchPrizeDetails(m);
  const newQty = Math.max(1, Math.min(99, qty + delta));
  m.prizeQty = newQty;
  if (type) {
    m.prize = `${newQty} ${type}`;
  }
  renderActivityMatches();
}

function setMatchPrizeQty(matchId, val) {
  const m = activityState.matches.find(x => x.id === matchId);
  if (!m) return;
  const num = parseInt(val);
  if (isNaN(num) || num < 1) return;
  const newQty = Math.max(1, Math.min(99, num));
  m.prizeQty = newQty;
  const { type } = getMatchPrizeDetails(m);
  if (type) {
    m.prize = `${newQty} ${type}`;
    updateMatchResultRealtime();
  }
}

function promptAddNewPrizeType(matchId) {
  const newName = prompt('Nhập tên loại giải thưởng mới (ví dụ: Nước dừa, Trà chanh, Revive, Trà sữa...):');
  if (newName && newName.trim()) {
    const saved = saveCustomPrizeType(newName.trim());
    if (saved) {
      selectMatchPrizeType(matchId, saved);
      showToast(`✨ Đã thêm loại giải thưởng: "${saved}"!`, 'success');
    }
  }
}

function updateMatchCustomPrize(matchId, val) {
  const m = activityState.matches.find(x => x.id === matchId);
  if (!m) return;
  m.prize = val ? val.trim() : '';
  m.prizeType = ''; // Tự do
  updateMatchResultRealtime();
}

function clearMatchPrize(matchId) {
  const m = activityState.matches.find(x => x.id === matchId);
  if (!m) return;
  m.prize = '';
  m.prizeType = '';
  renderActivityMatches();
}

function setQuickMatchPrize(matchId, val) {
  const m = activityState.matches.find(x => x.id === matchId);
  if (!m) return;
  if (m.prize === val) {
    clearMatchPrize(matchId);
  } else {
    m.prize = val;
    const match = val.match(/^(\d+)\s+(.+)$/);
    if (match) {
      m.prizeQty = parseInt(match[1]) || 2;
      m.prizeType = match[2].trim();
    } else {
      m.prizeType = val;
    }
    renderActivityMatches();
  }
}

function addActivityMatch() {
  const attendees = getCheckedInAttendees();

  // Đếm số trận đã đấu của từng người để ưu tiên chọn người chưa đấu hoặc đấu ít nhất
  const matchCounts = {};
  attendees.forEach(a => matchCounts[a.id] = 0);
  (activityState.matches || []).forEach(m => {
    (m.team1 || []).forEach(pId => { if (matchCounts[pId] !== undefined) matchCounts[pId]++; });
    (m.team2 || []).forEach(pId => { if (matchCounts[pId] !== undefined) matchCounts[pId]++; });
  });

  const sorted = [...attendees].sort((a, b) => (matchCounts[a.id] || 0) - (matchCounts[b.id] || 0));

  const nextP1 = sorted.length > 0 ? sorted[0].id : '';
  const nextP2 = sorted.length > 1 ? sorted[1].id : '';
  const nextP3 = sorted.length > 2 ? sorted[2].id : '';
  const nextP4 = sorted.length > 3 ? sorted[3].id : '';

  activityState.matches.push({
    id: Date.now(),
    name: `Trận ${activityState.matches.length + 1}`,
    team1: [nextP1, nextP2],
    team2: [nextP3, nextP4],
    score1: 21,
    score2: 19,
    prize: '',
    prizeQty: 2,
    prizeType: ''
  });
  renderActivityMatches();
}

function removeActivityMatch(id) {
  activityState.matches = activityState.matches.filter(m => m.id !== id);
  renderActivityMatches();
}

function updateMatchName(matchId, val) {
  const m = activityState.matches.find(x => x.id === matchId);
  if (m) {
    m.name = val;
    updateMatchResultRealtime();
  }
}

function updateMatchPlayer(matchId, teamIdx, playerIdx, val) {
  const m = activityState.matches.find(x => x.id === matchId);
  if (!m) return;
  if (!m.team1) m.team1 = ['', ''];
  if (!m.team2) m.team2 = ['', ''];

  if (val) {
    // Nếu thành viên này đã ở vị trí khác trong cùng trận, tự động xóa ở vị trí cũ để không bị trùng lặp
    if (teamIdx === 0) {
      if (playerIdx === 0 && m.team1[1] === val) m.team1[1] = '';
      if (playerIdx === 1 && m.team1[0] === val) m.team1[0] = '';
      if (m.team2[0] === val) m.team2[0] = '';
      if (m.team2[1] === val) m.team2[1] = '';
      m.team1[playerIdx] = val;
    } else {
      if (playerIdx === 0 && m.team2[1] === val) m.team2[1] = '';
      if (playerIdx === 1 && m.team2[0] === val) m.team2[0] = '';
      if (m.team1[0] === val) m.team1[0] = '';
      if (m.team1[1] === val) m.team1[1] = '';
      m.team2[playerIdx] = val;
    }
  } else {
    if (teamIdx === 0) m.team1[playerIdx] = '';
    else m.team2[playerIdx] = '';
  }
  renderActivityMatches();
}

function updateMatchScore(matchId, s1, s2) {
  const m = activityState.matches.find(x => x.id === matchId);
  if (m) {
    if (s1 !== null && s1 !== undefined) m.score1 = Number(s1) || 0;
    if (s2 !== null && s2 !== undefined) m.score2 = Number(s2) || 0;
    updateMatchResultRealtime();
  }
}

function updateMatchPrize(matchId, val) {
  const m = activityState.matches.find(x => x.id === matchId);
  if (m) {
    m.prize = val;
    updateMatchResultRealtime();
  }
}

function randomActivityMatch() {
  const attendees = getCheckedInAttendees();
  if (attendees.length < 4) {
    showToast('Cần ít nhất 4 người có mặt để bốc thăm trận đấu!', 'warning');
    return;
  }

  // Sắp xếp người chơi theo số trận đã đấu ít nhất để ưu tiên vào sân
  const matchCounts = {};
  attendees.forEach(a => matchCounts[a.id] = 0);
  activityState.matches.forEach(m => {
    (m.team1 || []).forEach(pId => { if (matchCounts[pId] !== undefined) matchCounts[pId]++; });
    (m.team2 || []).forEach(pId => { if (matchCounts[pId] !== undefined) matchCounts[pId]++; });
  });

  // Shuffle nhẹ và sort theo match count
  const shuffled = attendees.slice().sort(() => 0.5 - Math.random());
  shuffled.sort((a, b) => (matchCounts[a.id] || 0) - (matchCounts[b.id] || 0));

  const p1 = shuffled[0].id;
  const p2 = shuffled[1].id;
  const p3 = shuffled[2].id;
  const p4 = shuffled[3].id;

  const newMatch = {
    id: Date.now(),
    name: `Trận ${activityState.matches.length + 1}`,
    team1: [p1, p2],
    team2: [p3, p4],
    score1: 21,
    score2: 19,
    prize: '',
    prizeQty: 2,
    prizeType: ''
  };

  activityState.matches.push(newMatch);
  renderActivityMatches();

  showToast(`🎲 Đã ghép Trận #${activityState.matches.length}: ${shuffled[0].chipName} ${shuffled[1].chipName} đấu với ${shuffled[2].chipName} ${shuffled[3].chipName}!`, 'success');
}

// --- 7. BỘ TÍNH TOÁN & CHIA TIỀN REAL-TIME (TẠM ỨNG CẦU & SÂN THEO BẬC) ---
function renderActivityMemberBreakdown(list, shuttleFeePerMember, totalMemberCourtFee, totalMemberShuttleFee, guestPaid) {
  const container = document.getElementById('actMemberBreakdownContainer');
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
        <div class="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
          <span>📋</span>
          <span>Dự toán Tạm Ứng Tiền Sân & Tiền Cầu Từng Người</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-1">
          Chưa chọn thành viên nào. Hãy tích chọn thành viên bên trên để hệ thống tự động đếm buổi theo bậc và chia tiền cầu.
        </p>
      </div>
    `;
    return;
  }

  const negativeCount = list.filter(item => item.isNegative).length;

  let rowsHtml = list.map(item => {
    const balBadge = item.isNegative
      ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">Dư nợ: ${formatMoney(item.nextBal)}</span>`
      : `<span class="text-emerald-700 font-bold text-[11px]">${formatMoney(item.nextBal)}</span>`;

    return `
      <div class="p-2 bg-white rounded-xl border border-slate-100 flex items-center justify-between gap-2 text-xs shadow-2xs">
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <b class="text-slate-900 truncate">${item.chipName}</b>
            <span class="text-[10px] px-1.5 py-0.2 rounded-md font-bold bg-slate-100 text-slate-600 border border-slate-200">Buổi #${item.nextSession}</span>
            <span class="text-[10px] font-semibold text-slate-400">(${item.tierName})</span>
          </div>
          <div class="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
            <span>Sân: <b class="text-slate-700">${formatMoney(item.courtFee)}</b></span>
            <span>•</span>
            <span>Cầu: <b class="text-slate-700">${formatMoney(item.shuttleFee)}</b></span>
            <span>•</span>
            <span>Ví trước: <span class="${item.currentBal < 0 ? 'text-rose-600 font-bold' : 'text-slate-600'}">${formatMoney(item.currentBal)}</span></span>
          </div>
        </div>
        <div class="text-right shrink-0">
          <div class="font-black text-rose-600 text-xs">-${formatMoney(item.totalDeduct)}</div>
          <div class="mt-0.5">${balBadge}</div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="p-3 bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-2xl border border-emerald-200/80 space-y-2.5">
      <div class="flex items-center justify-between flex-wrap gap-1.5">
        <div class="flex items-center gap-1.5">
          <span class="text-base">📋</span>
          <div>
            <h4 class="font-black text-slate-900 text-xs leading-tight">Dự Toán Tạm Ứng Tiền Sân & Tiền Cầu Từng Người</h4>
            <p class="text-[10px] text-slate-500">Tiền sân tự tính theo bậc số buổi • Tiền cầu chia đều • Cho phép ví âm</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 text-[10px] font-bold">
          <span class="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
            ${list.length} thành viên
          </span>
          ${negativeCount > 0 ? `<span class="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-700 border border-rose-300">⚠️ ${negativeCount} ví âm</span>` : ''}
        </div>
      </div>

      <!-- Quick KPI Strip -->
      <div class="grid grid-cols-3 gap-1.5 p-2 bg-white/80 backdrop-blur rounded-xl border border-slate-200 text-center text-xs">
        <div>
          <span class="text-[10px] text-slate-500 block">Tạm ứng cầu (${list.length} TV)</span>
          <b class="text-slate-900 font-black text-xs sm:text-sm text-emerald-800">${formatMoney(totalMemberShuttleFee)}</b>
        </div>
        <div>
          <span class="text-[10px] text-slate-500 block">Tạm ứng sân theo bậc</span>
          <b class="text-slate-900 font-black text-xs sm:text-sm text-blue-800">${formatMoney(totalMemberCourtFee)}</b>
        </div>
        <div>
          <span class="text-[10px] text-slate-500 block">Thu khách (${activityState.selectedGuestIds.size} khách)</span>
          <b class="text-slate-900 font-black text-xs sm:text-sm text-amber-800">${formatMoney(guestPaid)}</b>
        </div>
      </div>

      <!-- Member Rows List -->
      <div class="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
        ${rowsHtml}
      </div>
    </div>
  `;
}

function recalculateActivitySplit() {
  // 1. Phân loại chi phí: Tiền cầu vs Chi phí khác
  let shuttleTotal = 0;
  let otherExpensesTotal = 0;
  (activityState.expenses || []).forEach(e => {
    const amt = Number(e.amount) || 0;
    const title = (e.title || '').toLowerCase();
    if (e.isShuttleRow || title.includes('cầu')) {
      shuttleTotal += amt;
    } else {
      otherExpensesTotal += amt;
    }
  });
  if (shuttleTotal === 0 && (activityState.expenses || []).length > 0) {
    shuttleTotal = Number(activityState.expenses[0].amount) || 0;
  }
  const totalCost = shuttleTotal + otherExpensesTotal;

  // Nếu chọn Tất cả cho ứng trước
  if (activityState.isFrontAll) {
    activityState.frontAmount = totalCost;
    const frontInp = document.getElementById('actFrontAmountInput');
    if (frontInp) frontInp.value = totalCost;
  }

  // 2. Khách đóng theo hạng (Level A: 90k, Level B: 70k, Level C: 50k)
  let guestPaid = 0;
  (activityState.selectedGuestIds || new Set()).forEach(id => {
    const guest = AppState.members.find(m => m.id === id);
    if (guest) {
      if (guest.fee) guestPaid += guest.fee;
      else if (guest.type === 'GUEST_A') guestPaid += (AppState.config?.guestPrices?.GUEST_A || 90000);
      else if (guest.type === 'GUEST_B') guestPaid += (AppState.config?.guestPrices?.GUEST_B || 70000);
      else if (guest.type === 'GUEST_C') guestPaid += (AppState.config?.guestPrices?.GUEST_C || 50000);
      else guestPaid += 50000;
    }
  });

  // 3. Số thành viên tham gia
  const memberCount = (activityState.selectedMemberIds || new Set()).size;

  // 4. Tiền cầu chia đều cho từng thành viên: Quỹ tạm ứng tiền cầu (A)
  const shuttleFeePerMember = memberCount > 0 ? Math.ceil((shuttleTotal / memberCount) / 1000) * 1000 : 0;
  const totalMemberShuttleFee = shuttleFeePerMember * memberCount;

  // 5. Tiền sân tự động tính theo bậc số buổi trong tháng của từng thành viên: Quỹ tạm ứng tiền sân (B)
  let totalMemberCourtFee = 0;
  const memberBreakdownList = [];

  (activityState.selectedMemberIds || new Set()).forEach(id => {
    const member = AppState.members.find(m => m.id === id);
    if (member) {
      const nextSession = (member.monthlySessions || 0) + 1;
      const courtFee = calculateMemberCourtFee(member, true);
      const tierName = getTierNameForSession(nextSession);
      const totalDeduct = courtFee + shuttleFeePerMember;
      const currentBal = member.balance || 0;
      const nextBal = currentBal - totalDeduct;

      totalMemberCourtFee += courtFee;
      memberBreakdownList.push({
        id: member.id,
        name: member.name,
        chipName: member.chipName || member.name,
        type: member.type,
        currentSessions: member.monthlySessions || 0,
        nextSession: nextSession,
        tierName: tierName,
        courtFee: courtFee,
        shuttleFee: shuttleFeePerMember,
        totalDeduct: totalDeduct,
        currentBal: currentBal,
        nextBal: nextBal,
        isNegative: nextBal < 0
      });
    }
  });

  // Cập nhật giao diện Sticky bottom summary
  const totalCostEl = document.getElementById('actSummaryTotalCost');
  const guestPaidEl = document.getElementById('actSummaryGuestPaid');
  const needSplitEl = document.getElementById('actSummaryNeedSplit');
  const perPersonBadge = document.getElementById('actSummaryPerPersonBadge');
  const shuttleTotalEl = document.getElementById('actSummaryShuttleTotal');
  const courtTotalEl = document.getElementById('actSummaryCourtTotal');

  if (totalCostEl) totalCostEl.textContent = formatMoney(totalCost);
  if (guestPaidEl) guestPaidEl.textContent = formatMoney(guestPaid);
  if (needSplitEl) needSplitEl.textContent = formatMoney(totalMemberCourtFee + totalMemberShuttleFee);
  if (shuttleTotalEl) shuttleTotalEl.textContent = formatMoney(totalMemberShuttleFee);
  if (courtTotalEl) courtTotalEl.textContent = formatMoney(totalMemberCourtFee);

  if (perPersonBadge) {
    if (memberCount > 0) {
      perPersonBadge.textContent = `${formatMoney(shuttleFeePerMember)} (cầu) + Sân bậc`;
    } else {
      perPersonBadge.textContent = '0đ / mỗi người';
    }
  }

  // Cập nhật bảng Chi tiết tạm ứng từng thành viên (Preview table)
  renderActivityMemberBreakdown(memberBreakdownList, shuttleFeePerMember, totalMemberCourtFee, totalMemberShuttleFee, guestPaid);
}

// --- 8. LƯU VÀ CHIA TIỀN (EXECUTION) ---
function saveAndSplitActivitySession() {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền chốt và chia tiền buổi sinh hoạt! Vui lòng liên hệ Trưởng nhóm.', 'warning');
    return;
  }
  const memberCount = (activityState.selectedMemberIds || new Set()).size;
  const guestCount = (activityState.selectedGuestIds || new Set()).size;

  if (memberCount === 0 && guestCount === 0) {
    showToast('Vui lòng chọn ít nhất 1 người tham gia buổi cầu!', 'warning');
    return;
  }

  let shuttleTotal = 0;
  (activityState.expenses || []).forEach(e => {
    const amt = Number(e.amount) || 0;
    const title = (e.title || '').toLowerCase();
    if (e.isShuttleRow || title.includes('cầu')) {
      shuttleTotal += amt;
    } else {
      shuttleTotal += amt;
    }
  });

  const shuttleFeePerMember = memberCount > 0 ? Math.ceil((shuttleTotal / memberCount) / 1000) * 1000 : 0;
  const totalMemberShuttleFee = shuttleFeePerMember * memberCount;

  let totalMemberCourtFee = 0;
  (activityState.selectedMemberIds || new Set()).forEach(id => {
    const member = AppState.members.find(m => m.id === id);
    if (member) {
      totalMemberCourtFee += calculateMemberCourtFee(member, true);
    }
  });

  let guestPaid = 0;
  (activityState.selectedGuestIds || new Set()).forEach(id => {
    const guest = AppState.members.find(m => m.id === id);
    if (guest) {
      const gFee = guest.fee || (guest.type === 'GUEST_A' ? (AppState.config?.guestPrices?.GUEST_A || 90000) : (guest.type === 'GUEST_B' ? (AppState.config?.guestPrices?.GUEST_B || 70000) : (AppState.config?.guestPrices?.GUEST_C || 50000)));
      guestPaid += gFee;
    }
  });

  const dateStr = activityState.date || getTodayInputFormat();
  const dateFormatted = dateStr.split('-').reverse().join('/');
  const nowTime = getNowTimestampString();

  const confirmMsg = `Xác nhận lưu buổi hoạt động ngày ${dateFormatted}?\n` +
    `• Tạm ứng tiền cầu: ${formatMoney(totalMemberShuttleFee)} (${formatMoney(shuttleFeePerMember)}/người × ${memberCount} TV)\n` +
    `• Tạm ứng tiền sân theo bậc: ${formatMoney(totalMemberCourtFee)} (${memberCount} TV)\n` +
    `• Thu khách giao lưu theo hạng: ${formatMoney(guestPaid)} (${guestCount} khách)\n` +
    `• Hệ thống trừ trực tiếp Ví TV (cho phép dư nợ ví âm) và cộng vào Quỹ Tạm Ứng.`;

  if (!confirm(confirmMsg)) return;

  // 1. Trừ tiền ví và tăng số buổi tháng cho từng thành viên tham gia (Hỗ trợ số dư âm)
  let negativeCount = 0;
  (activityState.selectedMemberIds || new Set()).forEach(id => {
    const member = AppState.members.find(m => m.id === id);
    if (member) {
      const courtFee = calculateMemberCourtFee(member, true);
      const totalDeduct = courtFee + shuttleFeePerMember;

      // Cho phép ví thành viên dư nợ / âm số dư
      member.balance = (member.balance || 0) - totalDeduct;
      if (member.balance < 0) negativeCount++;

      member.monthlySessions = (member.monthlySessions || 0) + 1;
      const tierName = getTierNameForSession(member.monthlySessions);

      // Ghi lịch sử giao dịch trừ ví
      AppState.transactions.push({
        id: 'TX_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        date: nowTime,
        type: 'COURT_FEE',
        categoryGroup: 'COURT_FEE',
        subType: 'COURT_FEE',
        categoryName: 'Trừ phí buổi chơi',
        amount: -totalDeduct,
        walletImpact: -totalDeduct,
        fundImpact: 0,
        targetName: member.name,
        memberId: member.id,
        description: `Trừ ví buổi ${dateFormatted}: Tiền sân ${formatMoney(courtFee)} (${tierName}) + Cầu ${formatMoney(shuttleFeePerMember)}`,
        operator: (AppState.auth && AppState.auth.user) ? AppState.auth.user.username : 'admin'
      });

      // Nhật ký điểm danh
      AppState.attendanceRecords.push({
        id: 'ATT_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        date: dateStr,
        memberId: member.id,
        memberName: member.name,
        courtFee: courtFee,
        shuttleFee: shuttleFeePerMember,
        fee: totalDeduct,
        sessionIndex: member.monthlySessions,
        timestamp: nowTime
      });
    }
  });

  // 2. Ghi nhận tăng số buổi cho khách tham gia
  (activityState.selectedGuestIds || new Set()).forEach(id => {
    const guest = AppState.members.find(m => m.id === id);
    if (guest) {
      guest.monthlySessions = (guest.monthlySessions || 0) + 1;
    }
  });

  // 3. Ghi Sổ Quỹ Tạm Ứng (Tạm ứng tiền cầu + Tạm ứng tiền sân + Thu khách theo hạng)
  // A. Tạm ứng tiền cầu: Trừ ví TV -> Cộng vào Quỹ tạm ứng tiền cầu
  if (totalMemberShuttleFee > 0) {
    AppState.transactions.push({
      id: 'TX_' + Date.now() + '_SHUTTLE',
      date: nowTime,
      categoryGroup: 'ADVANCE_SHUTTLE_IN',
      subType: 'SHUTTLE_ADV_IN',
      categoryName: 'Tạm ứng tiền cầu',
      amount: totalMemberShuttleFee,
      walletImpact: -totalMemberShuttleFee,
      fundImpact: totalMemberShuttleFee,
      targetName: 'Quỹ Tạm Ứng Tiền Cầu',
      description: `Thu tạm ứng tiền cầu ${memberCount} thành viên buổi ngày ${dateFormatted} (${formatMoney(shuttleFeePerMember)}/người)`,
      operator: (AppState.auth && AppState.auth.user) ? AppState.auth.user.username : 'admin'
    });
  }

  // B. Tạm ứng tiền sân: Trừ ví TV theo bậc -> Cộng vào Quỹ tạm ứng tiền sân
  if (totalMemberCourtFee > 0) {
    AppState.transactions.push({
      id: 'TX_' + Date.now() + '_COURT',
      date: nowTime,
      categoryGroup: 'ADVANCE_COURT_IN',
      subType: 'COURT_ADV_IN',
      categoryName: 'Tạm ứng tiền sân',
      amount: totalMemberCourtFee,
      walletImpact: -totalMemberCourtFee,
      fundImpact: totalMemberCourtFee,
      targetName: 'Quỹ Tạm Ứng Tiền Sân',
      description: `Thu tạm ứng tiền sân ${memberCount} thành viên theo bậc số buổi ngày ${dateFormatted}`,
      operator: (AppState.auth && AppState.auth.user) ? AppState.auth.user.username : 'admin'
    });
  }

  // C. Khoản thu của khách giao lưu theo hạng -> Cộng vào Quỹ tạm ứng
  if (guestPaid > 0) {
    AppState.transactions.push({
      id: 'TX_' + Date.now() + '_GUEST',
      date: nowTime,
      categoryGroup: 'ADVANCE_GUEST_IN',
      subType: 'GUEST_ADV_IN',
      categoryName: 'Thu khách giao lưu',
      amount: guestPaid,
      walletImpact: 0,
      fundImpact: guestPaid,
      targetName: 'Khách giao lưu theo hạng',
      description: `Khoản thu phí tham gia của ${guestCount} khách giao lưu theo hạng ngày ${dateFormatted}`,
      operator: (AppState.auth && AppState.auth.user) ? AppState.auth.user.username : 'admin'
    });
  }

  // 4. Nếu có người ứng tiền ngoài
  if (activityState.frontPersonId && activityState.frontPersonId !== 'NONE' && activityState.frontAmount > 0) {
    const frontPerson = AppState.members.find(m => m.id === activityState.frontPersonId);
    const frontName = frontPerson ? frontPerson.name : 'Người ứng tiền';
    AppState.transactions.push({
      id: 'TX_' + Date.now() + '_FRONT',
      date: nowTime,
      type: 'ADVANCE',
      categoryGroup: 'ADVANCE',
      subType: 'ADVANCE',
      categoryName: 'Quỹ tạm ứng ngoài',
      amount: activityState.frontAmount,
      targetName: 'Quỹ Tạm Ứng',
      walletImpact: 0,
      fundImpact: activityState.frontAmount,
      description: `${frontName} ứng tiền ngoài buổi cầu ngày ${dateFormatted}`,
      operator: (AppState.auth && AppState.auth.user) ? AppState.auth.user.username : 'admin'
    });
  }

  // Cập nhật lại toàn bộ chỉ số quỹ tạm ứng và quỹ CLB
  calculateAdvanceFundStats();
  saveData();

  // Dọn sạch phiên tạm thời để bắt đầu buổi mới
  clearActivitySessionState();
  initActivitySessionData(true);

  let successMsg = `Đã lưu và trừ ví thành công ${memberCount} thành viên! (Cầu: +${formatMoney(totalMemberShuttleFee)}, Sân: +${formatMoney(totalMemberCourtFee)}, Khách: +${formatMoney(guestPaid)}).`;
  if (negativeCount > 0) successMsg += ` Có ${negativeCount} thành viên đang có số dư âm (dư nợ).`;
  showToast(successMsg, 'success');

  renderDashboard();
  renderFinanceTab();
  if (currentTab === 'attendance') {
    renderAttendanceTab();
  } else {
    recalculateActivitySplit();
  }

  // Tự động mở modal xem và tải ảnh báo cáo khi kết thúc hoạt động
  setTimeout(() => {
    openActivityReportModal();
  }, 400);
}

// ==========================================
// 8.5 XUẤT ẢNH BÁO CÁO BUỔI HOẠT ĐỘNG (CANVAS 2D)
// ==========================================
function drawReportRoundedRect(ctx, x, y, w, h, r, fillStyle, strokeStyle, lineWidth = 1) {
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

function generateActivityReportCanvas() {
  const dateStr = activityState.date || getTodayInputFormat();
  const dateFormatted = dateStr.split('-').reverse().join('/');
  const nowTime = getNowTimestampString();
  const clubName = (AppState.config && AppState.config.clubName) || 'CLB CẦU LÔNG SMASH';
  const actType = activityState.type || 'Buổi cầu';

  // Chi phí
  let totalCost = 0;
  let shuttleExpense = null;
  (activityState.expenses || []).forEach(e => {
    totalCost += (e.amount || 0);
    if (e.isShuttleRow) shuttleExpense = e;
  });
  if (!shuttleExpense && (activityState.expenses || []).length > 0) {
    shuttleExpense = activityState.expenses[0];
  }

  // Khách
  let guestPaid = 0;
  const guestList = [];
  (activityState.selectedGuestIds || new Set()).forEach(id => {
    const guest = AppState.members.find(m => m.id === id);
    if (guest) {
      const gFee = guest.fee || (guest.type === 'GUEST_A' ? 90000 : (guest.type === 'GUEST_B' ? 70000 : 50000));
      guestPaid += gFee;
      guestList.push({ name: guest.name, type: guest.type, fee: gFee });
    }
  });

  // Thành viên
  const memberList = [];
  (activityState.selectedMemberIds || new Set()).forEach(id => {
    const m = AppState.members.find(x => x.id === id);
    if (m) memberList.push(m.chipName || m.name);
  });
  const memberCount = memberList.length;
  const needSplit = Math.max(0, totalCost - guestPaid);
  const perPerson = memberCount > 0 ? Math.ceil((needSplit / memberCount) / 1000) * 1000 : 0;

  // Người ứng tiền
  let frontText = null;
  if (activityState.frontPersonId && activityState.frontPersonId !== 'NONE' && activityState.frontAmount > 0) {
    const frontPerson = AppState.members.find(m => m.id === activityState.frontPersonId);
    frontText = `${frontPerson ? frontPerson.name : 'Thành viên'} đã ứng trước: ${formatMoney(activityState.frontAmount)}`;
  }

  // Trận đấu
  const matches = activityState.matches || [];

  // STK ngân hàng
  const bankInfo = (AppState.config && AppState.config.bankInfo) || '';

  // Kích thước canvas
  const CANVAS_WIDTH = 800;
  const PADDING = 28;
  const CONTENT_WIDTH = CANVAS_WIDTH - PADDING * 2;

  // Tính toán chiều cao linh hoạt
  let estHeight = PADDING; // lề trên
  estHeight += 125; // Header banner
  estHeight += 16;  // khoảng cách
  estHeight += 92;  // 4 thẻ số liệu KPI
  estHeight += 16;  // khoảng cách
  const expenseH = 68 + (frontText ? 32 : 0);
  estHeight += expenseH;
  estHeight += 16;  // khoảng cách

  // Chiều cao khối điểm danh
  const chipRows = Math.ceil(Math.max(1, memberList.length) / 5);
  const attBoxHeight = 44 + (chipRows * 34) + (guestList.length > 0 ? 38 : 0) + 12;
  estHeight += attBoxHeight;
  estHeight += 16;  // khoảng cách

  // Chiều cao khối trận đấu
  let matchBoxHeight = 0;
  if (matches.length > 0) {
    matchBoxHeight = 40 + (matches.length * 42) + 8;
    estHeight += matchBoxHeight + 16;
  }

  // Chiều cao khối ngân hàng
  let bankBoxHeight = 0;
  if (bankInfo) {
    bankBoxHeight = 65;
    estHeight += bankBoxHeight + 16;
  }

  // Footer
  estHeight += 80;
  estHeight += PADDING; // lề dưới

  // Khởi tạo Canvas độ nét cao (2x Retina)
  const canvas = document.createElement('canvas');
  const SCALE = 2;
  canvas.width = CANVAS_WIDTH * SCALE;
  canvas.height = estHeight * SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);

  // Nền canvas tổng thể
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, CANVAS_WIDTH, estHeight);

  // Viền bo góc thẻ card bao ngoài
  drawReportRoundedRect(ctx, 10, 10, CANVAS_WIDTH - 20, estHeight - 20, 24, '#ffffff', '#e2e8f0', 1.5);

  let curY = PADDING;

  // 1. BANNER TIÊU ĐỀ ĐẦU TRANG
  const headerGrad = ctx.createLinearGradient(PADDING, curY, PADDING + CONTENT_WIDTH, curY + 125);
  headerGrad.addColorStop(0, '#064e3b');
  headerGrad.addColorStop(1, '#047857');
  drawReportRoundedRect(ctx, PADDING, curY, CONTENT_WIDTH, 125, 18, headerGrad, null);

  // Huy hiệu loại buổi sinh hoạt
  drawReportRoundedRect(ctx, PADDING + CONTENT_WIDTH - 146, curY + 14, 130, 26, 8, 'rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.35)', 1);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`✓ ${actType.toUpperCase()}`, PADDING + CONTENT_WIDTH - 81, curY + 31);

  // Tên CLB & Tiêu đề
  ctx.textAlign = 'left';
  ctx.fillStyle = '#6ee7b7';
  ctx.font = '900 13px system-ui, -apple-system, sans-serif';
  ctx.fillText(`🏸  ${clubName.toUpperCase()}`, PADDING + 20, curY + 35);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px system-ui, -apple-system, sans-serif';
  ctx.fillText('BÁO CÁO TỔNG KẾT BUỔI CẦU', PADDING + 20, curY + 68);

  ctx.fillStyle = '#a7f3d0';
  ctx.font = '600 12px system-ui, -apple-system, sans-serif';
  ctx.fillText(`📅 Ngày sinh hoạt: ${dateFormatted}  •  ⏰ Thời gian chốt: ${nowTime}`, PADDING + 20, curY + 98);

  curY += 125 + 16;

  // 2. 4 THẺ SỐ LIỆU TÀI CHÍNH NỔI BẬT
  const gap = 10;
  const colW = (CONTENT_WIDTH - gap * 3) / 4;
  const statBoxH = 92;

  // Thẻ 1: Tổng chi phí
  drawReportRoundedRect(ctx, PADDING, curY, colW, statBoxH, 14, '#f8fafc', '#e2e8f0', 1);
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TỔNG CHI PHÍ', PADDING + colW / 2, curY + 26);
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(formatMoney(totalCost), PADDING + colW / 2, curY + 54);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 10px system-ui, -apple-system, sans-serif';
  ctx.fillText('Sân & Cầu thi đấu', PADDING + colW / 2, curY + 75);

  // Thẻ 2: Khách đóng
  const col2X = PADDING + colW + gap;
  drawReportRoundedRect(ctx, col2X, curY, colW, statBoxH, 14, '#f8fafc', '#e2e8f0', 1);
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.fillText('KHÁCH ĐÓNG', col2X + colW / 2, curY + 26);
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(formatMoney(guestPaid), col2X + colW / 2, curY + 54);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 10px system-ui, -apple-system, sans-serif';
  ctx.fillText(`${guestList.length} khách tham gia`, col2X + colW / 2, curY + 75);

  // Thẻ 3: Cần chia
  const col3X = col2X + colW + gap;
  drawReportRoundedRect(ctx, col3X, curY, colW, statBoxH, 14, '#f8fafc', '#e2e8f0', 1);
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.fillText('CẦN CHIA', col3X + colW / 2, curY + 26);
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(formatMoney(needSplit), col3X + colW / 2, curY + 54);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 10px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Chia ${memberCount} thành viên`, col3X + colW / 2, curY + 75);

  // Thẻ 4: MỖI NGƯỜI ĐÓNG (HIGHLIGHT)
  const col4X = col3X + colW + gap;
  drawReportRoundedRect(ctx, col4X, curY, colW, statBoxH, 14, '#ecfdf5', '#10b981', 1.5);
  ctx.fillStyle = '#047857';
  ctx.font = '900 11px system-ui, -apple-system, sans-serif';
  ctx.fillText('MỖI NGƯỜI ĐÓNG', col4X + colW / 2, curY + 26);
  ctx.fillStyle = '#065f46';
  ctx.font = '900 18px system-ui, -apple-system, sans-serif';
  ctx.fillText(formatMoney(perPerson), col4X + colW / 2, curY + 54);
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.fillText('★ Trừ vào ví TV', col4X + colW / 2, curY + 75);

  curY += statBoxH + 16;

  // 3. CHI TIẾT CHI PHÍ
  drawReportRoundedRect(ctx, PADDING, curY, CONTENT_WIDTH, expenseH, 14, '#f8fafc', '#e2e8f0', 1);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillText('🏸  CHI PHÍ CẦU VÀ TIỀN SÂN TRONG BUỔI:', PADDING + 16, curY + 25);

  const shuttleQty = shuttleExpense ? (shuttleExpense.qty || 12) : 12;
  const shuttleUnit = shuttleExpense ? (shuttleExpense.unitPrice || 28333) : 28333;
  const shuttleTotal = shuttleExpense ? (shuttleExpense.amount || 340000) : 340000;

  ctx.fillStyle = '#334155';
  ctx.font = '600 12px system-ui, -apple-system, sans-serif';
  ctx.fillText(`• Cầu thi đấu đã dùng: ${shuttleQty} quả × ${formatMoney(shuttleUnit)}/quả = ${formatMoney(shuttleTotal)}`, PADDING + 20, curY + 48);

  if (frontText) {
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.fillText(`• ${frontText}`, PADDING + 20, curY + 76);
  }

  curY += expenseH + 16;

  // 4. DANH SÁCH ĐIỂM DANH THAM GIA
  drawReportRoundedRect(ctx, PADDING, curY, CONTENT_WIDTH, attBoxHeight, 14, '#ffffff', '#e2e8f0', 1);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 12px system-ui, -apple-system, sans-serif';
  ctx.fillText(`👥  DANH SÁCH ĐIỂM DANH (${memberCount + guestList.length} người: ${memberCount} thành viên, ${guestList.length} khách):`, PADDING + 16, curY + 25);

  let chipX = PADDING + 16;
  let chipY = curY + 40;
  const chipW = 135;
  const chipH = 26;
  const chipGapX = 8;
  const chipGapY = 6;

  if (memberList.length === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('Chưa có thành viên nào được chọn điểm danh', chipX, chipY + 16);
    chipY += 30;
  } else {
    memberList.forEach((name) => {
      if (chipX + chipW > PADDING + CONTENT_WIDTH - 16) {
        chipX = PADDING + 16;
        chipY += chipH + chipGapY;
      }
      drawReportRoundedRect(ctx, chipX, chipY, chipW, chipH, 7, '#ecfdf5', '#a7f3d0', 1);
      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`✓ ${name}`, chipX + chipW / 2, chipY + 17);
      chipX += chipW + chipGapX;
    });
    chipY += chipH + 8;
  }

  // Dòng khách mời
  if (guestList.length > 0) {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('Khách mời:', PADDING + 16, chipY + 17);

    let gX = PADDING + 84;
    guestList.forEach(g => {
      const gTag = `${g.name} (${formatMoney(g.fee)})`;
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      const tw = ctx.measureText(gTag).width + 16;
      drawReportRoundedRect(ctx, gX, chipY + 1, tw, 24, 6, '#fef3c7', '#fde68a', 1);
      ctx.fillStyle = '#92400e';
      ctx.textAlign = 'center';
      ctx.fillText(gTag, gX + tw / 2, chipY + 17);
      gX += tw + 8;
    });
  }

  curY += attBoxHeight + 16;

  // 5. KẾT QUẢ CÁC TRẬN ĐẤU (NẾU CÓ)
  if (matches.length > 0) {
    drawReportRoundedRect(ctx, PADDING, curY, CONTENT_WIDTH, matchBoxHeight, 14, '#f8fafc', '#e2e8f0', 1);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 12px system-ui, -apple-system, sans-serif';
    ctx.fillText(`🏸  KẾT QUẢ CÁC TRẬN CẦU TRONG BUỔI (${matches.length} trận):`, PADDING + 16, curY + 25);

    let mY = curY + 36;
    matches.forEach((m, idx) => {
      const info = formatMatchResultInfo(idx, m);
      const rowH = 34;
      drawReportRoundedRect(ctx, PADDING + 12, mY, CONTENT_WIDTH - 24, rowH, 8, '#ffffff', '#e2e8f0', 1);

      // Số trận
      drawReportRoundedRect(ctx, PADDING + 16, mY + 6, 22, 22, 5, '#047857', null);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${idx + 1}`, PADDING + 27, mY + 21);

      // Thông tin hai cặp đấu
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1e293b';
      ctx.font = '600 11px system-ui, -apple-system, sans-serif';
      const matchLabel = info.matchTitle && info.matchTitle !== `Trận ${idx + 1}` ? `[${info.matchTitle}] ` : '';
      const matchText = `${matchLabel}${info.pair1} (${info.s1})  đấu với  ${info.pair2} (${info.s2})`;
      ctx.fillText(matchText, PADDING + 46, mY + 21);

      // Thưởng / Đội thắng
      let rightBadge = '';
      if (info.s1 > info.s2 && (info.s1 > 0 || info.s2 > 0)) rightBadge = `🏆 ${info.pair1} Thắng`;
      else if (info.s2 > info.s1 && (info.s1 > 0 || info.s2 > 0)) rightBadge = `🏆 ${info.pair2} Thắng`;
      if (info.prize) rightBadge += ` • 🎁 ${info.prize}`;

      if (rightBadge) {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.fillText(rightBadge, PADDING + CONTENT_WIDTH - 24, mY + 21);
      }

      mY += rowH + 8;
    });

    curY += matchBoxHeight + 16;
  }

  // 6. THÔNG TIN CHUYỂN KHOẢN (NẾU CÓ)
  if (bankInfo) {
    drawReportRoundedRect(ctx, PADDING, curY, CONTENT_WIDTH, bankBoxHeight, 14, '#eff6ff', '#bfdbfe', 1);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.fillText('💳  THÔNG TIN THANH TOÁN / CHUYỂN KHOẢN CLB:', PADDING + 16, curY + 25);

    ctx.fillStyle = '#1e3a8a';
    ctx.font = '900 13px system-ui, -apple-system, sans-serif';
    ctx.fillText(bankInfo, PADDING + 20, curY + 48);

    curY += bankBoxHeight + 16;
  }

  // 7. FOOTER CHỮ KÝ VÀ WATERMARK
  ctx.textAlign = 'center';
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillText('✓ ĐÃ QUYẾT TOÁN & CẬP NHẬT SỔ QUỸ CLB THÀNH CÔNG', CANVAS_WIDTH / 2, curY + 22);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 10px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Xuất tự động từ Hệ thống Quản lý CLB Cầu Lông • ${nowTime}`, CANVAS_WIDTH / 2, curY + 44);

  return canvas;
}

function openActivityReportModal() {
  const modal = document.getElementById('actReportModal');
  const loading = document.getElementById('actReportLoadingState');
  const previewImg = document.getElementById('actReportPreviewImg');
  if (!modal) return;

  modal.classList.remove('hidden');
  if (loading) loading.classList.remove('hidden');
  if (previewImg) previewImg.classList.add('hidden');

  setTimeout(() => {
    try {
      const canvas = generateActivityReportCanvas();
      window.__lastReportCanvas = canvas;
      const dataUrl = canvas.toDataURL('image/png');
      if (previewImg) {
        previewImg.src = dataUrl;
        previewImg.classList.remove('hidden');
      }
      if (loading) loading.classList.add('hidden');
    } catch (e) {
      console.error(e);
      if (loading) loading.textContent = 'Lỗi tạo ảnh báo cáo: ' + e.message;
    }
  }, 60);
}

function closeActivityReportModal() {
  const modal = document.getElementById('actReportModal');
  if (modal) modal.classList.add('hidden');
}

function downloadActivityReportImage() {
  const canvas = window.__lastReportCanvas;
  if (!canvas) {
    showToast('Chưa có ảnh báo cáo để tải xuống!', 'warning');
    return;
  }
  const dateStr = activityState.date || getTodayInputFormat();
  const link = document.createElement('a');
  link.download = `Bao_Cao_Buoi_Cau_${dateStr}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('💾 Đã tải ảnh báo cáo buổi cầu (.PNG) thành công!', 'success');
}

async function copyActivityReportImage() {
  const canvas = window.__lastReportCanvas;
  if (!canvas) {
    showToast('Chưa có ảnh báo cáo để sao chép!', 'warning');
    return;
  }
  const btn = document.getElementById('btnCopyReportImg');
  try {
    canvas.toBlob(async (blob) => {
      if (!blob) throw new Error('Không tạo được dữ liệu ảnh');
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('📋 Đã sao chép ảnh báo cáo! Bạn có thể dán (Ctrl + V) ngay vào Zalo / Facebook.', 'success');
        if (btn) {
          const old = btn.innerHTML;
          btn.innerHTML = '<span>✓</span> Đã chép!';
          setTimeout(() => { btn.innerHTML = old; }, 2000);
        }
      } else {
        downloadActivityReportImage();
      }
    }, 'image/png');
  } catch (err) {
    console.error(err);
    showToast('Trình duyệt chưa hỗ trợ sao chép ảnh trực tiếp. Hệ thống đang tải ảnh về máy.', 'info');
    downloadActivityReportImage();
  }
}

// ==========================================
// 10. THU – CHI – VÍ THÀNH VIÊN – QUỸ CLB (CÔNG THỨC & MA TRẬN ĐỐI SOÁT)
// ==========================================

/**
 * CÔNG THỨC QUỸ CLB:
 * QUỸ CLB = Tổng tất cả khoản thu (A) − Tổng tất cả khoản chi (B)
 * Trong đó tách riêng:
 * - Thu (A):
 *   1. Quỹ thành viên (A.1): Ví TV (−), Quỹ CLB (+)
 *   2. Phạt (A.2):           Ví TV (−), Quỹ CLB (+)
 *   3. Giải thưởng (A.3):    Ví TV (Không), Quỹ CLB (+)
 *   4. Tài trợ (A.4):        Ví TV (Không), Quỹ CLB (+)
 *   5. Thu khác (A.5):       Ví TV (Không), Quỹ CLB (+)
 * - Chi (B):
 *   1. Hoạt động chung (B.1): Liên hoan (1.1), Giao lưu (1.2), Chi khác (1.3) -> Quỹ CLB (−)
 *   2. Chi phí cho TV (B.2):  Hiếu (2.1), Hỷ (2.2), Ốm (2.3), Khác (2.4)     -> Quỹ CLB (−)
 */
function calculateClubFundStats() {
  const stats = {
    // Khoản Thu (A)
    incomeA: {
      memFund: 0,   // A.1 Quỹ thành viên
      fine: 0,      // A.2 Phạt
      prize: 0,     // A.3 Giải thưởng
      sponsor: 0,   // A.4 Tài trợ
      other: 0,     // A.5 Thu khác
      total: 0
    },
    // Khoản Chi (B)
    expenseB: {
      general: {
        party: 0,     // 1.1 Liên hoan
        exchange: 0,  // 1.2 Giao lưu
        other: 0,     // 1.3 Chi khác
        total: 0
      },
      member: {
        hieu: 0,      // 2.1 Hiếu
        hy: 0,        // 2.2 Hỷ
        om: 0,        // 2.3 Ốm
        other: 0,     // 2.4 Chi khác
        total: 0
      },
      total: 0
    },
    clubFund: 0, // Tổng Thu A - Tổng Chi B
    wallet: {
      total: 0,
      negativeCount: 0,
      negativeList: []
    }
  };

  (AppState.transactions || []).forEach(tx => {
    const amt = Math.abs(tx.amount || 0);

    // Xử lý nhóm Thu (A)
    if (tx.subType === 'MEM_FUND') {
      stats.incomeA.memFund += amt;
    } else if (tx.subType === 'FINE' || tx.type === 'FINE') {
      stats.incomeA.fine += amt;
    } else if (tx.subType === 'PRIZE') {
      stats.incomeA.prize += amt;
    } else if (tx.subType === 'SPONSOR') {
      stats.incomeA.sponsor += amt;
    } else if (tx.subType === 'OTHER_IN' || tx.type === 'FUND_IN') {
      stats.incomeA.other += amt;
    }
    // Xử lý nhóm Chi (B)
    else if (tx.subType === 'EXP_PARTY') {
      stats.expenseB.general.party += amt;
    } else if (tx.subType === 'EXP_EXCHANGE') {
      stats.expenseB.general.exchange += amt;
    } else if (tx.subType === 'EXP_GENERAL_OTHER' || tx.type === 'FUND_OUT') {
      stats.expenseB.general.other += amt;
    } else if (tx.subType === 'EXP_HIEU') {
      stats.expenseB.member.hieu += amt;
    } else if (tx.subType === 'EXP_HY') {
      stats.expenseB.member.hy += amt;
    } else if (tx.subType === 'EXP_OM') {
      stats.expenseB.member.om += amt;
    } else if (tx.subType === 'EXP_MEMBER_OTHER') {
      stats.expenseB.member.other += amt;
    }
  });

  stats.incomeA.total = stats.incomeA.memFund + stats.incomeA.fine + stats.incomeA.prize + stats.incomeA.sponsor + stats.incomeA.other;
  stats.expenseB.general.total = stats.expenseB.general.party + stats.expenseB.general.exchange + stats.expenseB.general.other;
  stats.expenseB.member.total = stats.expenseB.member.hieu + stats.expenseB.member.hy + stats.expenseB.member.om + stats.expenseB.member.other;
  stats.expenseB.total = stats.expenseB.general.total + stats.expenseB.member.total;

  stats.clubFund = stats.incomeA.total - stats.expenseB.total;

  // Tính ví thành viên
  (AppState.members || []).forEach(m => {
    const bal = m.balance || 0;
    stats.wallet.total += bal;
    if (bal < 0) {
      stats.wallet.negativeCount++;
      stats.wallet.negativeList.push(m);
    }
  });

  // Đồng bộ số dư Quỹ CLB vào AppState
  if (AppState.funds) {
    AppState.funds.clubFund = stats.clubFund;
  }

  return stats;
}

function getFinanceOperatorName() {
  return (AppState.auth && AppState.auth.user) ? AppState.auth.user.username : 'admin';
}

/**
 * Tính toán số dư và các thành phần của Quỹ Tạm Ứng theo công thức:
 * - Quỹ tạm ứng tiền cầu = Tổng tiền cầu đã thu từ TV − Tổng tiền đã chi/trả cho tiền cầu
 * - Quỹ tạm ứng tiền sân = Tổng tiền sân đã thu từ TV − Tổng tiền đã chi/trả cho sân
 * - Tổng Quỹ tạm ứng = Quỹ tạm ứng tiền cầu + Quỹ tạm ứng tiền sân + Khoản thu của khách giao lưu theo hạng
 */
function calculateAdvanceFundStats() {
  const stats = {
    shuttle: {
      collected: 0,
      paid: 0,
      balance: 0
    },
    court: {
      collected: 0,
      paid: 0,
      balance: 0
    },
    guest: {
      collected: 0
    },
    totalAdvanceFund: 0
  };

  (AppState.transactions || []).forEach(tx => {
    const amt = Math.abs(tx.amount || 0);

    // 1. Tiền cầu thu từ TV
    if (tx.categoryGroup === 'ADVANCE_SHUTTLE_IN' || tx.subType === 'SHUTTLE_ADV_IN') {
      stats.shuttle.collected += amt;
    }
    // 2. Tiền cầu đã chi/trả (mua cầu)
    else if (tx.categoryGroup === 'ADVANCE_SHUTTLE_OUT' || tx.subType === 'SHUTTLE_EXP_PAY') {
      stats.shuttle.paid += amt;
    }
    // 3. Tiền sân thu từ TV (theo bậc)
    else if (tx.categoryGroup === 'ADVANCE_COURT_IN' || tx.subType === 'COURT_ADV_IN') {
      stats.court.collected += amt;
    }
    // 4. Tiền sân đã chi/trả (trả chủ sân)
    else if (tx.categoryGroup === 'ADVANCE_COURT_OUT' || tx.subType === 'COURT_EXP_PAY') {
      stats.court.paid += amt;
    }
    // 5. Khoản thu của khách giao lưu theo hạng
    else if (tx.categoryGroup === 'ADVANCE_GUEST_IN' || tx.subType === 'GUEST_ADV_IN') {
      stats.guest.collected += amt;
    }
    // Legacy support
    else if (tx.type === 'ADVANCE') {
      stats.court.collected += amt;
    }
  });

  stats.shuttle.balance = stats.shuttle.collected - stats.shuttle.paid;
  stats.court.balance = stats.court.collected - stats.court.paid;
  stats.totalAdvanceFund = stats.shuttle.balance + stats.court.balance + stats.guest.collected;

  if (AppState.funds) {
    AppState.funds.advanceFund = stats.totalAdvanceFund;
    AppState.funds.shuttleAdvanceFund = stats.shuttle.balance;
    AppState.funds.courtAdvanceFund = stats.court.balance;
    AppState.funds.guestAdvanceIncome = stats.guest.collected;
    AppState.funds.shuttlePaidTotal = stats.shuttle.paid;
    AppState.funds.courtPaidTotal = stats.court.paid;
  }

  return stats;
}

function renderFinanceTab() {
  const stats = calculateClubFundStats();
  const advStats = calculateAdvanceFundStats();

  // 1. Thẻ Quỹ CLB Hiện Tại
  const clubFundEl = document.getElementById('kpiFinanceClubFund');
  if (clubFundEl) clubFundEl.textContent = formatMoney(stats.clubFund);

  const miniInc = document.getElementById('kpiMiniTotalIncome');
  if (miniInc) miniInc.textContent = `+${formatMoney(stats.incomeA.total)}`;

  const miniExp = document.getElementById('kpiMiniTotalExpense');
  if (miniExp) miniExp.textContent = `-${formatMoney(stats.expenseB.total)}`;

  // 2. Thẻ Khoản Thu (A)
  const totalIncEl = document.getElementById('kpiFinanceTotalIncome');
  if (totalIncEl) totalIncEl.textContent = formatMoney(stats.incomeA.total);

  const incMemFund = document.getElementById('kpiIncomeMemFund');
  if (incMemFund) incMemFund.textContent = formatMoney(stats.incomeA.memFund);

  const incFine = document.getElementById('kpiIncomeFine');
  if (incFine) incFine.textContent = formatMoney(stats.incomeA.fine);

  const incPrize = document.getElementById('kpiIncomePrize');
  if (incPrize) incPrize.textContent = formatMoney(stats.incomeA.prize);

  const incSponsor = document.getElementById('kpiIncomeSponsor');
  if (incSponsor) incSponsor.textContent = formatMoney(stats.incomeA.sponsor);

  const incOther = document.getElementById('kpiIncomeOther');
  if (incOther) incOther.textContent = formatMoney(stats.incomeA.other);

  // 3. Thẻ Khoản Chi (B)
  const totalExpEl = document.getElementById('kpiFinanceTotalExpense');
  if (totalExpEl) totalExpEl.textContent = formatMoney(stats.expenseB.total);

  const expGen = document.getElementById('kpiExpenseGeneral');
  if (expGen) expGen.textContent = formatMoney(stats.expenseB.general.total);

  const expParty = document.getElementById('kpiExpParty');
  if (expParty) expParty.textContent = formatMoney(stats.expenseB.general.party);

  const expExchange = document.getElementById('kpiExpExchange');
  if (expExchange) expExchange.textContent = formatMoney(stats.expenseB.general.exchange);

  const expOther = document.getElementById('kpiExpOther');
  if (expOther) expOther.textContent = formatMoney(stats.expenseB.general.other);

  const expMember = document.getElementById('kpiExpenseMember');
  if (expMember) expMember.textContent = formatMoney(stats.expenseB.member.total);

  const expHieu = document.getElementById('kpiExpHieu');
  if (expHieu) expHieu.textContent = formatMoney(stats.expenseB.member.hieu);

  const expHy = document.getElementById('kpiExpHy');
  if (expHy) expHy.textContent = formatMoney(stats.expenseB.member.hy);

  const expOm = document.getElementById('kpiExpOm');
  if (expOm) expOm.textContent = formatMoney(stats.expenseB.member.om);

  // 4. Thẻ Ví Thành Viên & Công Nợ
  const totalWalletEl = document.getElementById('kpiFinanceTotalWallet');
  if (totalWalletEl) totalWalletEl.textContent = formatMoney(stats.wallet.total);

  const negCountEl = document.getElementById('kpiFinanceNegativeCount');
  if (negCountEl) negCountEl.textContent = `${stats.wallet.negativeCount} người`;

  const advEl = document.getElementById('kpiFinanceAdvance');
  if (advEl) advEl.textContent = formatMoney(advStats.totalAdvanceFund);

  // 5. Thẻ & Thành Phần Quỹ Tạm Ứng Mới
  const kpiAdvTotalEl = document.getElementById('kpiCardAdvanceFundTotal');
  if (kpiAdvTotalEl) kpiAdvTotalEl.textContent = formatMoney(advStats.totalAdvanceFund);

  const kpiShuttleBalEl = document.getElementById('kpiAdvShuttleBalance');
  if (kpiShuttleBalEl) kpiShuttleBalEl.textContent = formatMoney(advStats.shuttle.balance);

  const kpiShuttleColEl = document.getElementById('kpiAdvShuttleCollected');
  if (kpiShuttleColEl) kpiShuttleColEl.textContent = `+${formatMoney(advStats.shuttle.collected)}`;

  const kpiShuttlePaidEl = document.getElementById('kpiAdvShuttlePaid');
  if (kpiShuttlePaidEl) kpiShuttlePaidEl.textContent = `-${formatMoney(advStats.shuttle.paid)}`;

  const kpiCourtBalEl = document.getElementById('kpiAdvCourtBalance');
  if (kpiCourtBalEl) kpiCourtBalEl.textContent = formatMoney(advStats.court.balance);

  const kpiCourtColEl = document.getElementById('kpiAdvCourtCollected');
  if (kpiCourtColEl) kpiCourtColEl.textContent = `+${formatMoney(advStats.court.collected)}`;

  const kpiCourtPaidEl = document.getElementById('kpiAdvCourtPaid');
  if (kpiCourtPaidEl) kpiCourtPaidEl.textContent = `-${formatMoney(advStats.court.paid)}`;

  const kpiGuestColEl = document.getElementById('kpiAdvGuestCollected');
  if (kpiGuestColEl) kpiGuestColEl.textContent = `+${formatMoney(advStats.guest.collected)}`;

  // Thống kê dư nợ ví âm thành viên
  let negativeDebtTotal = 0;
  let negativeMemberCount = 0;
  (AppState.members || []).forEach(m => {
    const bal = m.balance || 0;
    if (bal < 0) {
      negativeDebtTotal += Math.abs(bal);
      negativeMemberCount++;
    }
  });

  const negDebtEl = document.getElementById('kpiAdvNegativeDebtTotal');
  if (negDebtEl) negDebtEl.textContent = formatMoney(negativeDebtTotal);

  const negCountAdvEl = document.getElementById('kpiAdvNegativeMemberCount');
  if (negCountAdvEl) negCountAdvEl.textContent = `${negativeMemberCount} người nợ ví`;

  // Đồng bộ lên thanh tóm tắt thu gọn của Quỹ Tạm Ứng
  const miniShuttle = document.getElementById('kpiAdvShuttleBalanceMini');
  if (miniShuttle) miniShuttle.textContent = formatMoney(advStats.shuttle.balance);

  const miniCourt = document.getElementById('kpiAdvCourtBalanceMini');
  if (miniCourt) miniCourt.textContent = formatMoney(advStats.court.balance);

  const miniGuest = document.getElementById('kpiAdvGuestCollectedMini');
  if (miniGuest) miniGuest.textContent = `+${formatMoney(advStats.guest.collected)}`;

  const miniDebt = document.getElementById('kpiAdvNegativeDebtMini');
  if (miniDebt) miniDebt.textContent = formatMoney(negativeDebtTotal);

  // Đồng bộ lên dashboard KPI
  const dashFund = document.getElementById('kpiClubFund');
  if (dashFund) dashFund.textContent = formatMoney(stats.clubFund);

  const dashAdv = document.getElementById('kpiAdvanceFund');
  if (dashAdv) dashAdv.textContent = formatMoney(advStats.totalAdvanceFund);

  const dashWallet = document.getElementById('kpiTotalWallet');
  if (dashWallet) dashWallet.textContent = formatMoney(stats.wallet.total);

  // Render bảng giao dịch
  renderFullTransactionTable();
}

/**
 * Thu gọn / Mở rộng các mục chi tiết trong Tab Tài chính & Quỹ
 */
function toggleFinanceSection(elementId, btnEl) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const isHidden = el.classList.contains('hidden');
  if (isHidden) {
    el.classList.remove('hidden');
    if (btnEl) {
      const chevron = btnEl.querySelector('.chevron');
      if (chevron) chevron.textContent = '▴';
      const label = btnEl.querySelector('.btn-label');
      if (label && label.dataset.expanded) label.textContent = label.dataset.expanded;
    }
  } else {
    el.classList.add('hidden');
    if (btnEl) {
      const chevron = btnEl.querySelector('.chevron');
      if (chevron) chevron.textContent = '▾';
      const label = btnEl.querySelector('.btn-label');
      if (label && label.dataset.collapsed) label.textContent = label.dataset.collapsed;
    }
  }
}

/**
 * Thu gọn / Mở rộng Thẻ Quỹ Tạm Ứng
 */
function toggleAdvanceFundCard(btnEl) {
  const detailBody = document.getElementById('advanceFundDetailBody');
  const summaryBar = document.getElementById('advanceFundSummaryBar');
  if (!detailBody) return;
  const isCollapsed = detailBody.classList.contains('hidden');
  if (isCollapsed) {
    detailBody.classList.remove('hidden');
    if (summaryBar) summaryBar.classList.add('hidden');
    if (btnEl) {
      const label = btnEl.querySelector('.btn-label') || btnEl;
      label.textContent = 'Thu gọn';
      const chevron = btnEl.querySelector('.chevron');
      if (chevron) chevron.textContent = '▴';
    }
  } else {
    detailBody.classList.add('hidden');
    if (summaryBar) summaryBar.classList.remove('hidden');
    if (btnEl) {
      const label = btnEl.querySelector('.btn-label') || btnEl;
      label.textContent = 'Mở rộng';
      const chevron = btnEl.querySelector('.chevron');
      if (chevron) chevron.textContent = '▾';
    }
  }
}

function renderFullTransactionTable() {
  const tbody = document.getElementById('fullTransactionTableBody');
  const typeFilter = document.getElementById('filterTxType');
  const searchInput = document.getElementById('searchTx');
  if (!tbody) return;

  const selectedType = typeFilter ? typeFilter.value : 'ALL';
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  let list = (AppState.transactions || []).slice().reverse();

  if (selectedType !== 'ALL') {
    list = list.filter(tx => {
      if (selectedType === 'MEM_FUND') return tx.subType === 'MEM_FUND';
      if (selectedType === 'FINE') return tx.subType === 'FINE' || tx.type === 'FINE';
      if (selectedType === 'PRIZE') return tx.subType === 'PRIZE';
      if (selectedType === 'SPONSOR') return tx.subType === 'SPONSOR';
      if (selectedType === 'OTHER_IN') return tx.subType === 'OTHER_IN' || tx.type === 'FUND_IN';
      if (selectedType === 'EXP_GENERAL') return tx.subType === 'EXP_PARTY' || tx.subType === 'EXP_EXCHANGE' || tx.subType === 'EXP_GENERAL_OTHER' || tx.type === 'FUND_OUT';
      if (selectedType === 'EXP_MEMBER') return tx.subType === 'EXP_HIEU' || tx.subType === 'EXP_HY' || tx.subType === 'EXP_OM' || tx.subType === 'EXP_MEMBER_OTHER';
      if (selectedType === 'TOPUP') return tx.subType === 'TOPUP' || tx.type === 'TOPUP';
      if (selectedType === 'COURT_FEE') return tx.type === 'COURT_FEE';
      if (selectedType === 'ADVANCE') return tx.type === 'ADVANCE';
      return tx.type === selectedType || tx.subType === selectedType;
    });
  }

  if (query) {
    list = list.filter(tx => 
      (tx.targetName && tx.targetName.toLowerCase().includes(query)) ||
      (tx.description && tx.description.toLowerCase().includes(query)) ||
      (tx.categoryName && tx.categoryName.toLowerCase().includes(query)) ||
      (tx.date && tx.date.includes(query))
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400 italic">Chưa có giao dịch phù hợp điều kiện lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(tx => {
    let typeBadge = '';
    const st = tx.subType || tx.type;

    switch (st) {
      case 'MEM_FUND':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-[10px]">📅 Quỹ TV (A.1)</span>`;
        break;
      case 'FINE':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300 text-[10px]">⚡ Phạt (A.2)</span>`;
        break;
      case 'PRIZE':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold border border-blue-300 text-[10px]">🏆 Giải thưởng (A.3)</span>`;
        break;
      case 'SPONSOR':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold border border-purple-300 text-[10px]">🤝 Tài trợ (A.4)</span>`;
        break;
      case 'OTHER_IN':
      case 'FUND_IN':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold border border-teal-300 text-[10px]">📥 Thu khác (A.5)</span>`;
        break;
      case 'EXP_PARTY':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold border border-rose-300 text-[10px]">🍻 Liên hoan (B.1.1)</span>`;
        break;
      case 'EXP_EXCHANGE':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-bold border border-orange-300 text-[10px]">🏸 Giao lưu (B.1.2)</span>`;
        break;
      case 'EXP_GENERAL_OTHER':
      case 'FUND_OUT':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold border border-slate-300 text-[10px]">📦 Chi HĐ khác (B.1.3)</span>`;
        break;
      case 'EXP_HY':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-pink-100 text-pink-800 font-bold border border-pink-300 text-[10px]">💐 Chi Hỷ (B.2.2)</span>`;
        break;
      case 'EXP_HIEU':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-slate-200 text-slate-900 font-bold border border-slate-400 text-[10px]">🖤 Chi Hiếu (B.2.1)</span>`;
        break;
      case 'EXP_OM':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-[10px]">🩺 Chi Thăm ốm (B.2.3)</span>`;
        break;
      case 'EXP_MEMBER_OTHER':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 font-bold border border-pink-200 text-[10px]">🎁 Chi TV khác (B.2.4)</span>`;
        break;
      case 'TOPUP':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">💳 Nạp ví TV</span>`;
        break;
      case 'COURT_FEE':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[10px]">🏸 Tiền sân & cầu</span>`;
        break;
      case 'SHUTTLE_ADV_IN':
      case 'ADVANCE_SHUTTLE_IN':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-[10px]">🏸 Tạm ứng cầu (Thu)</span>`;
        break;
      case 'SHUTTLE_EXP_PAY':
      case 'ADVANCE_SHUTTLE_OUT':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold border border-rose-300 text-[10px]">🏸 Chi trả tiền cầu</span>`;
        break;
      case 'COURT_ADV_IN':
      case 'ADVANCE_COURT_IN':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold border border-blue-300 text-[10px]">🏟️ Tạm ứng sân (Thu)</span>`;
        break;
      case 'COURT_EXP_PAY':
      case 'ADVANCE_COURT_OUT':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold border border-rose-300 text-[10px]">🏟️ Chi trả tiền sân</span>`;
        break;
      case 'GUEST_ADV_IN':
      case 'ADVANCE_GUEST_IN':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300 text-[10px]">🎟️ Thu khách (Hạng)</span>`;
        break;
      case 'SETTLEMENT':
      case 'WALLET_SETTLEMENT':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold border border-purple-300 text-[10px]">💰 Tất toán dư nợ</span>`;
        break;
      case 'ADVANCE':
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[10px]">💼 Quỹ tạm ứng</span>`;
        break;
      default:
        typeBadge = `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">${tx.categoryName || 'Giao dịch'}</span>`;
    }

    // Tác động Ví thành viên
    let walletImpactHtml = `<span class="text-slate-300 font-medium">—</span>`;
    if (tx.walletImpact !== undefined && tx.walletImpact !== 0) {
      if (tx.walletImpact < 0) {
        walletImpactHtml = `<b class="text-rose-600 font-black text-xs">−${formatMoney(Math.abs(tx.walletImpact))}</b>`;
      } else {
        walletImpactHtml = `<b class="text-emerald-600 font-black text-xs">+${formatMoney(tx.walletImpact)}</b>`;
      }
    } else if (tx.type === 'TOPUP') {
      walletImpactHtml = `<b class="text-emerald-600 font-black text-xs">+${formatMoney(Math.abs(tx.amount))}</b>`;
    } else if (tx.type === 'COURT_FEE') {
      walletImpactHtml = `<b class="text-rose-600 font-black text-xs">−${formatMoney(Math.abs(tx.amount))}</b>`;
    }

    // Tác động Quỹ CLB
    let fundImpactHtml = `<span class="text-slate-300 font-medium">—</span>`;
    if (tx.fundImpact !== undefined && tx.fundImpact !== 0) {
      if (tx.fundImpact > 0) {
        fundImpactHtml = `<b class="text-emerald-700 font-black text-xs">+${formatMoney(tx.fundImpact)}</b>`;
      } else {
        fundImpactHtml = `<b class="text-rose-600 font-black text-xs">−${formatMoney(Math.abs(tx.fundImpact))}</b>`;
      }
    } else if (tx.subType === 'MEM_FUND' || tx.subType === 'FINE' || tx.subType === 'PRIZE' || tx.subType === 'SPONSOR' || tx.subType === 'OTHER_IN' || tx.type === 'FUND_IN') {
      fundImpactHtml = `<b class="text-emerald-700 font-black text-xs">+${formatMoney(Math.abs(tx.amount))}</b>`;
    } else if (tx.subType === 'EXP_PARTY' || tx.subType === 'EXP_EXCHANGE' || tx.subType === 'EXP_GENERAL_OTHER' || tx.subType === 'EXP_HY' || tx.subType === 'EXP_HIEU' || tx.subType === 'EXP_OM' || tx.subType === 'EXP_MEMBER_OTHER' || tx.type === 'FUND_OUT') {
      fundImpactHtml = `<b class="text-rose-600 font-black text-xs">−${formatMoney(Math.abs(tx.amount))}</b>`;
    }

    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="py-2.5 px-3 text-slate-500 whitespace-nowrap text-[11px]">${tx.date}</td>
        <td class="py-2.5 px-2 whitespace-nowrap">${typeBadge}</td>
        <td class="py-2.5 px-3">
          <div class="font-bold text-slate-900 text-xs">${tx.targetName || 'Giao dịch CLB'}</div>
          <div class="text-[11px] text-slate-500 line-clamp-1">${tx.description || ''}</div>
        </td>
        <td class="py-2.5 px-3 text-center whitespace-nowrap">
          ${walletImpactHtml}
        </td>
        <td class="py-2.5 px-3 text-right whitespace-nowrap">
          ${fundImpactHtml}
        </td>
        <td class="py-2.5 px-3 text-slate-500 font-medium text-[11px] whitespace-nowrap">${tx.operator || 'admin'}</td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// A.1 THU QUỸ THÀNH VIÊN THEO THÁNG (NHIỀU THÀNH VIÊN)
// ==========================================
function openMonthlyFundModal() {
  const monthInput = document.getElementById('monthlyFundMonth');
  if (monthInput) {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    monthInput.value = ym;
  }

  const amtInput = document.getElementById('monthlyFundAmount');
  if (amtInput) amtInput.value = 200000;

  renderMonthlyFundMemberList();
  updateMonthlyFundSummary();
  openModal('monthlyFundModal');
}

function renderMonthlyFundMemberList() {
  const container = document.getElementById('monthlyFundMemberList');
  if (!container) return;

  // CHỈ ÁP DỤNG CHO THÀNH VIÊN CHÍNH THỨC
  const officialMembers = AppState.members.filter(m => m.type === 'OFFICIAL');

  container.innerHTML = officialMembers.map(m => {
    const bal = m.balance || 0;
    const isNeg = bal < 0;
    return `
      <label class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-emerald-50/50 transition">
        <div class="flex items-center gap-1.5 min-w-0">
          <input type="checkbox" name="monthlyFundMemberCheckbox" value="${m.id}" checked onchange="updateMonthlyFundSummary()" class="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5" />
          <span class="font-bold text-slate-800 text-[11px] truncate">${m.name}</span>
        </div>
        <span class="text-[10px] font-semibold shrink-0 ml-1 ${isNeg ? 'text-rose-600' : 'text-slate-400'}">
          ${formatMoney(bal)}
        </span>
      </label>
    `;
  }).join('');
}

function toggleAllMonthlyFundMembers(selectAll) {
  const checkboxes = document.querySelectorAll('input[name="monthlyFundMemberCheckbox"]');
  checkboxes.forEach(cb => cb.checked = selectAll);
  updateMonthlyFundSummary();
}

function setMonthlyFundAmountQuick(val) {
  const input = document.getElementById('monthlyFundAmount');
  if (input) {
    input.value = val;
    updateMonthlyFundSummary();
  }
}

function updateMonthlyFundSummary() {
  const checkboxes = document.querySelectorAll('input[name="monthlyFundMemberCheckbox"]:checked');
  const count = checkboxes.length;
  const officialTotal = AppState.members.filter(m => m.type === 'OFFICIAL').length;

  const countBadge = document.getElementById('monthlyFundSelectedCount');
  if (countBadge) countBadge.textContent = `${count}/${officialTotal}`;

  const amtInput = document.getElementById('monthlyFundAmount');
  const eachAmt = Math.max(0, Number(amtInput?.value) || 0);
  const totalAmt = count * eachAmt;

  const totalEl = document.getElementById('monthlyFundTotalEst');
  if (totalEl) totalEl.textContent = formatMoney(totalAmt);

  const eachEl = document.getElementById('monthlyFundEachEst');
  if (eachEl) eachEl.textContent = formatMoney(eachAmt);

  const plusEl = document.getElementById('monthlyFundPlusFundEst');
  if (plusEl) plusEl.textContent = formatMoney(totalAmt);
}

function handleMonthlyFundSubmit(e) {
  e.preventDefault();
  const monthVal = document.getElementById('monthlyFundMonth').value;
  const amount = Number(document.getElementById('monthlyFundAmount').value);
  const checkboxes = document.querySelectorAll('input[name="monthlyFundMemberCheckbox"]:checked');

  if (!monthVal) {
    showToast('Vui lòng chọn tháng áp dụng thu quỹ!', 'warning');
    return;
  }
  if (amount <= 0) {
    showToast('Mức thu phải lớn hơn 0đ!', 'warning');
    return;
  }
  if (checkboxes.length === 0) {
    showToast('Vui lòng tích chọn ít nhất 1 thành viên chính thức!', 'warning');
    return;
  }

  const [y, m] = monthVal.split('-');
  const monthFormatted = `Tháng ${m}/${y}`;
  const nowStr = getNowTimestampString();
  const operator = getFinanceOperatorName();

  let totalCollected = 0;
  const memberNames = [];

  checkboxes.forEach(cb => {
    const memberId = cb.value;
    const member = AppState.members.find(x => x.id === memberId);
    if (!member) return;

    // Tự động trừ trực tiếp vào Ví thành viên
    member.balance = (member.balance || 0) - amount;
    totalCollected += amount;
    memberNames.push(member.name);

    // Ghi nhận giao dịch trừ ví cho từng thành viên
    AppState.transactions.push({
      id: 'TX_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      date: nowStr,
      categoryGroup: 'INCOME_A',
      subType: 'MEM_FUND',
      categoryName: 'Quỹ thành viên',
      amount: amount,
      targetName: member.name,
      memberId: member.id,
      walletImpact: -amount, // Trừ ví thành viên
      fundImpact: amount,    // Cộng Quỹ CLB
      description: `Thu Quỹ thành viên ${monthFormatted} (Trừ ví)`,
      operator: operator
    });
  });

  saveData();
  closeModal('monthlyFundModal');
  renderDashboard();
  renderFinanceTab();
  showToast(`✓ Đã thu thành công ${formatMoney(totalCollected)} Quỹ ${monthFormatted} từ ${checkboxes.length} thành viên!`, 'success');
}

// ==========================================
// A.2 DANH SÁCH PHẠT NHANH THEO NGÀY
// ==========================================
let quickFineRowCounter = 0;

function openQuickFineModal() {
  const dateInput = document.getElementById('quickFineGlobalDate');
  if (dateInput) dateInput.value = getTodayInputFormat();

  const tbody = document.getElementById('quickFineTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    quickFineRowCounter = 0;
    // Mặc định tạo sẵn 2 dòng
    addQuickFineRow();
    addQuickFineRow();
  }

  updateQuickFineSummary();
  openModal('quickFineModal');
}

function addQuickFineRow(preMemberId = '', preReason = '', preAmount = 50000) {
  const tbody = document.getElementById('quickFineTableBody');
  if (!tbody) return;

  quickFineRowCounter++;
  const rowId = `fineRow_${quickFineRowCounter}`;

  const allMembers = AppState.members;

  const memberOptions = allMembers.map(m => `
    <option value="${m.id}" ${m.id === preMemberId ? 'selected' : ''}>
      ${m.name} (${getMemberRoleTypeText(m.type)})
    </option>
  `).join('');

  const tr = document.createElement('tr');
  tr.id = rowId;
  tr.className = 'hover:bg-slate-50 transition';
  tr.innerHTML = `
    <td class="py-2 px-3">
      <select class="quick-fine-member w-full text-xs font-bold border border-slate-200 rounded-lg p-1.5 bg-white focus:ring-1 focus:ring-amber-500">
        <option value="">-- Chọn thành viên --</option>
        ${memberOptions}
      </select>
    </td>
    <td class="py-2 px-3">
      <input type="text" value="${preReason}" placeholder="Đi muộn >15p, vắng không phép, lỗi trang phục..." class="quick-fine-reason w-full text-xs border border-slate-200 rounded-lg p-1.5 focus:ring-1 focus:ring-amber-500" list="fineCommonReasons" />
    </td>
    <td class="py-2 px-3">
      <input type="number" value="${preAmount}" min="5000" step="5000" oninput="updateQuickFineSummary()" class="quick-fine-amount w-full text-xs font-black text-amber-900 border border-slate-200 rounded-lg p-1.5 text-right focus:ring-1 focus:ring-amber-500" />
    </td>
    <td class="py-2 px-2 text-center">
      <button type="button" onclick="removeQuickFineRow('${rowId}')" class="text-slate-400 hover:text-rose-600 font-black p-1 text-sm cursor-pointer" title="Xóa dòng này">✕</button>
    </td>
  `;

  tbody.appendChild(tr);
  updateQuickFineSummary();
}

function removeQuickFineRow(rowId) {
  const row = document.getElementById(rowId);
  if (row && row.parentNode) {
    row.parentNode.removeChild(row);
  }
  updateQuickFineSummary();
}

function updateQuickFineSummary() {
  const rows = document.querySelectorAll('#quickFineTableBody tr');
  const countEl = document.getElementById('quickFineRowCount');
  if (countEl) countEl.textContent = rows.length;

  let total = 0;
  document.querySelectorAll('.quick-fine-amount').forEach(inp => {
    total += Math.max(0, Number(inp.value) || 0);
  });

  const totalEl = document.getElementById('quickFineTotalAmount');
  if (totalEl) totalEl.textContent = formatMoney(total);
}

function handleQuickFineSubmit(e) {
  e.preventDefault();
  const dateVal = document.getElementById('quickFineGlobalDate').value || getTodayInputFormat();
  const [y, m, d] = dateVal.split('-');
  const dateFormatted = `${d}/${m}/${y}`;
  const operator = getFinanceOperatorName();

  const rows = document.querySelectorAll('#quickFineTableBody tr');
  if (rows.length === 0) {
    showToast('Chưa có dòng phạt nào trong danh sách!', 'warning');
    return;
  }

  const finesToApply = [];

  for (const row of rows) {
    const memberSelect = row.querySelector('.quick-fine-member');
    const reasonInput = row.querySelector('.quick-fine-reason');
    const amountInput = row.querySelector('.quick-fine-amount');

    const memberId = memberSelect ? memberSelect.value : '';
    const reason = reasonInput ? reasonInput.value.trim() : '';
    const amount = amountInput ? Number(amountInput.value) : 0;

    if (!memberId) {
      showToast('Vui lòng chọn thành viên ở tất cả các dòng phạt!', 'warning');
      return;
    }
    if (!reason) {
      showToast('Vui lòng nhập nội dung/lý do phạt!', 'warning');
      return;
    }
    if (amount <= 0) {
      showToast('Số tiền phạt phải lớn hơn 0đ!', 'warning');
      return;
    }

    const member = AppState.members.find(x => x.id === memberId);
    if (member) {
      finesToApply.push({ member, reason, amount });
    }
  }

  let totalFineApplied = 0;

  finesToApply.forEach(item => {
    // Xác nhận → trừ trực tiếp vào Ví thành viên
    item.member.balance = (item.member.balance || 0) - item.amount;
    totalFineApplied += item.amount;

    AppState.transactions.push({
      id: 'TX_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      date: `${dateFormatted} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
      categoryGroup: 'INCOME_A',
      subType: 'FINE',
      categoryName: 'Phạt vi phạm',
      amount: item.amount,
      targetName: item.member.name,
      memberId: item.member.id,
      walletImpact: -item.amount, // Trừ ví thành viên
      fundImpact: item.amount,    // Cộng Quỹ CLB
      description: `Phạt vi phạm ngày ${dateFormatted}: ${item.reason}`,
      operator: operator
    });
  });

  saveData();
  closeModal('quickFineModal');
  renderDashboard();
  renderFinanceTab();
  showToast(`⚡ Đã xử phạt ${finesToApply.length} trường hợp, trừ ${formatMoney(totalFineApplied)} vào ví thành viên và nộp Quỹ CLB!`, 'success');
}

// ==========================================
// A.3 THU GIẢI THƯỞNG CLB
// ==========================================
function openPrizeIncomeModal() {
  const dateInput = document.getElementById('prizeDate');
  if (dateInput) dateInput.value = getTodayInputFormat();

  const tInput = document.getElementById('prizeTournamentName');
  if (tInput) tInput.value = '';

  const amtInput = document.getElementById('prizeAmount');
  if (amtInput) amtInput.value = '';

  openModal('prizeIncomeModal');
}

function handlePrizeIncomeSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('prizeTournamentName').value.trim();
  const amount = Number(document.getElementById('prizeAmount').value);
  const dateVal = document.getElementById('prizeDate').value || getTodayInputFormat();
  const rank = document.getElementById('prizeRank').value.trim();
  const note = document.getElementById('prizeNote').value.trim();

  if (!name || amount <= 0) {
    showToast('Vui lòng nhập tên giải đấu và số tiền thưởng hợp lệ!', 'warning');
    return;
  }

  const [y, m, d] = dateVal.split('-');
  const dateFormatted = `${d}/${m}/${y}`;
  const operator = getFinanceOperatorName();

  const desc = `${rank ? `[${rank}] ` : ''}${name}${note ? ` (${note})` : ''}`;

  // Cộng vào Quỹ CLB, không trừ Ví TV
  AppState.transactions.push({
    id: 'TX_' + Date.now(),
    date: `${dateFormatted} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    categoryGroup: 'INCOME_A',
    subType: 'PRIZE',
    categoryName: 'Giải thưởng CLB',
    amount: amount,
    targetName: name,
    walletImpact: 0,        // Không tác động ví
    fundImpact: amount,     // Cộng Quỹ CLB
    description: `Tiền giải thưởng: ${desc}`,
    operator: operator
  });

  saveData();
  closeModal('prizeIncomeModal');
  renderDashboard();
  renderFinanceTab();
  showToast(`🏆 Đã ghi nhận +${formatMoney(amount)} tiền giải thưởng vào Quỹ CLB!`, 'success');
}

// ==========================================
// A.4 THU TÀI TRỢ
// ==========================================
function openSponsorIncomeModal() {
  const dateInput = document.getElementById('sponsorDate');
  if (dateInput) dateInput.value = getTodayInputFormat();

  const nameInput = document.getElementById('sponsorName');
  if (nameInput) nameInput.value = '';

  const amtInput = document.getElementById('sponsorAmount');
  if (amtInput) amtInput.value = '';

  openModal('sponsorIncomeModal');
}

function handleSponsorIncomeSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('sponsorName').value.trim();
  const amount = Number(document.getElementById('sponsorAmount').value);
  const dateVal = document.getElementById('sponsorDate').value || getTodayInputFormat();
  const content = document.getElementById('sponsorContent').value.trim();

  if (!name || amount <= 0) {
    showToast('Vui lòng nhập tên người/đơn vị tài trợ và số tiền hợp lệ!', 'warning');
    return;
  }

  const [y, m, d] = dateVal.split('-');
  const dateFormatted = `${d}/${m}/${y}`;
  const operator = getFinanceOperatorName();

  // Cộng vào Quỹ CLB, không trừ Ví TV
  AppState.transactions.push({
    id: 'TX_' + Date.now(),
    date: `${dateFormatted} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    categoryGroup: 'INCOME_A',
    subType: 'SPONSOR',
    categoryName: 'Tài trợ',
    amount: amount,
    targetName: name,
    walletImpact: 0,        // Không tác động ví
    fundImpact: amount,     // Cộng Quỹ CLB
    description: `Tài trợ từ ${name}: ${content || 'Ủng hộ hoạt động CLB'}`,
    operator: operator
  });

  saveData();
  closeModal('sponsorIncomeModal');
  renderDashboard();
  renderFinanceTab();
  showToast(`🤝 Đã ghi nhận +${formatMoney(amount)} tài trợ từ ${name} vào Quỹ CLB!`, 'success');
}

// ==========================================
// A.5 KHOẢN THU KHÁC
// ==========================================
function openOtherIncomeModal() {
  const dateInput = document.getElementById('otherIncomeDate');
  if (dateInput) dateInput.value = getTodayInputFormat();

  const contentInput = document.getElementById('otherIncomeContent');
  if (contentInput) contentInput.value = '';

  const amtInput = document.getElementById('otherIncomeAmount');
  if (amtInput) amtInput.value = '';

  openModal('otherIncomeModal');
}

function handleOtherIncomeSubmit(e) {
  e.preventDefault();
  const content = document.getElementById('otherIncomeContent').value.trim();
  const amount = Number(document.getElementById('otherIncomeAmount').value);
  const dateVal = document.getElementById('otherIncomeDate').value || getTodayInputFormat();
  const party = document.getElementById('otherIncomeParty').value.trim() || 'CLB';

  if (!content || amount <= 0) {
    showToast('Vui lòng nhập nội dung và số tiền thu khác hợp lệ!', 'warning');
    return;
  }

  const [y, m, d] = dateVal.split('-');
  const dateFormatted = `${d}/${m}/${y}`;
  const operator = getFinanceOperatorName();

  // Cộng vào Quỹ CLB, không trừ Ví TV
  AppState.transactions.push({
    id: 'TX_' + Date.now(),
    date: `${dateFormatted} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    categoryGroup: 'INCOME_A',
    subType: 'OTHER_IN',
    categoryName: 'Thu khác',
    amount: amount,
    targetName: party,
    walletImpact: 0,        // Không tác động ví
    fundImpact: amount,     // Cộng Quỹ CLB
    description: `Thu khác: ${content} (Liên quan: ${party})`,
    operator: operator
  });

  saveData();
  closeModal('otherIncomeModal');
  renderDashboard();
  renderFinanceTab();
  showToast(`📥 Đã ghi nhận +${formatMoney(amount)} khoản thu khác vào Quỹ CLB!`, 'success');
}

// ==========================================
// B.1 CHI HOẠT ĐỘNG CHUNG CLB (LIÊN HOAN / GIAO LƯU / KHÁC)
// ==========================================
function openGeneralExpenseModal(defaultCat = 'EXP_PARTY') {
  const dateInput = document.getElementById('generalExpenseDate');
  if (dateInput) dateInput.value = getTodayInputFormat();

  const radio = document.querySelector(`input[name="generalExpenseCategory"][value="${defaultCat}"]`);
  if (radio) radio.checked = true;

  const amtInput = document.getElementById('generalExpenseAmount');
  if (amtInput) amtInput.value = '';

  const contentInput = document.getElementById('generalExpenseContent');
  if (contentInput) contentInput.value = '';

  openModal('generalExpenseModal');
}

function handleGeneralExpenseSubmit(e) {
  e.preventDefault();
  const cat = document.querySelector('input[name="generalExpenseCategory"]:checked').value;
  const amount = Number(document.getElementById('generalExpenseAmount').value);
  const dateVal = document.getElementById('generalExpenseDate').value || getTodayInputFormat();
  const payer = document.getElementById('generalExpensePayer').value.trim() || 'Ban chủ nhiệm';
  const content = document.getElementById('generalExpenseContent').value.trim();

  if (!content || amount <= 0) {
    showToast('Vui lòng nhập nội dung chi và số tiền hợp lệ!', 'warning');
    return;
  }

  const [y, m, d] = dateVal.split('-');
  const dateFormatted = `${d}/${m}/${y}`;
  const operator = getFinanceOperatorName();

  let catLabel = 'Chi hoạt động chung';
  if (cat === 'EXP_PARTY') catLabel = 'Liên hoan';
  else if (cat === 'EXP_EXCHANGE') catLabel = 'Giao lưu';
  else catLabel = 'Chi HĐ khác';

  // Trừ trực tiếp vào Quỹ CLB, không trừ Ví TV
  AppState.transactions.push({
    id: 'TX_' + Date.now(),
    date: `${dateFormatted} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    categoryGroup: 'EXPENSE_B',
    subType: cat,
    categoryName: catLabel,
    amount: amount,
    targetName: payer,
    walletImpact: 0,        // Không tác động ví
    fundImpact: -amount,    // Trừ Quỹ CLB
    description: `Chi ${catLabel}: ${content} (Phụ trách: ${payer})`,
    operator: operator
  });

  saveData();
  closeModal('generalExpenseModal');
  renderDashboard();
  renderFinanceTab();
  showToast(`🍻 Đã chi -${formatMoney(amount)} từ Quỹ CLB cho ${catLabel}!`, 'info');
}

// ==========================================
// B.2 CHI PHÍ CHO THÀNH VIÊN (HIẾU / HỶ / ỐM / KHÁC)
// ==========================================
function openMemberExpenseModal(preselectMemberId = null, defaultCat = 'EXP_HY') {
  populateMemberExpenseSelect(preselectMemberId);

  const dateInput = document.getElementById('memberExpenseDate');
  if (dateInput) dateInput.value = getTodayInputFormat();

  const radio = document.querySelector(`input[name="memberExpenseCategory"][value="${defaultCat}"]`);
  if (radio) radio.checked = true;

  const amtInput = document.getElementById('memberExpenseAmount');
  if (amtInput) amtInput.value = 1000000;

  const noteInput = document.getElementById('memberExpenseNote');
  if (noteInput) noteInput.value = '';

  openModal('memberExpenseModal');
}

function populateMemberExpenseSelect(preselectId = null) {
  const select = document.getElementById('memberExpenseMemberSelect');
  if (!select) return;

  select.innerHTML = AppState.members.map(m => `
    <option value="${m.id}" ${m.id === preselectId ? 'selected' : ''}>
      ${m.name} (${getMemberRoleTypeText(m.type)})
    </option>
  `).join('');
}

function setMemberExpenseAmountQuick(amount) {
  const input = document.getElementById('memberExpenseAmount');
  if (input) input.value = amount;
}

function handleMemberExpenseSubmit(e) {
  e.preventDefault();
  const memberId = document.getElementById('memberExpenseMemberSelect').value;
  const cat = document.querySelector('input[name="memberExpenseCategory"]:checked').value;
  const amount = Number(document.getElementById('memberExpenseAmount').value);
  const dateVal = document.getElementById('memberExpenseDate').value || getTodayInputFormat();
  const rep = document.getElementById('memberExpenseRepresentative').value.trim() || 'Ban chủ nhiệm';
  const note = document.getElementById('memberExpenseNote').value.trim();

  const member = AppState.members.find(x => x.id === memberId);
  if (!member || amount <= 0) {
    showToast('Vui lòng chọn thành viên và nhập số tiền chi hợp lệ!', 'warning');
    return;
  }

  const [y, m, d] = dateVal.split('-');
  const dateFormatted = `${d}/${m}/${y}`;
  const operator = getFinanceOperatorName();

  let catLabel = 'Chi cho thành viên';
  if (cat === 'EXP_HY') catLabel = 'Hỷ (Cưới hỏi, sinh nhật)';
  else if (cat === 'EXP_HIEU') catLabel = 'Hiếu (Phúng viếng)';
  else if (cat === 'EXP_OM') catLabel = 'Thăm ốm';
  else catLabel = 'Chi khác TV';

  // Trừ trực tiếp vào Quỹ CLB. KHÔNG trừ Ví thành viên!
  AppState.transactions.push({
    id: 'TX_' + Date.now(),
    date: `${dateFormatted} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    categoryGroup: 'EXPENSE_B',
    subType: cat,
    categoryName: `Chi ${catLabel}`,
    amount: amount,
    targetName: member.name,
    memberId: member.id,
    walletImpact: 0,        // Không tác động ví
    fundImpact: -amount,    // Trừ Quỹ CLB
    description: `Chi cho TV: ${member.name} → ${catLabel}${note ? ` (${note})` : ''} (Đại diện: ${rep})`,
    operator: operator
  });

  saveData();
  closeModal('memberExpenseModal');
  renderDashboard();
  renderFinanceTab();
  showToast(`💝 Đã trích -${formatMoney(amount)} từ Quỹ CLB chi cho ${member.name} (${catLabel})!`, 'info');
}

// ==========================================
// 11. NẠP TIỀN VÀO VÍ THÀNH VIÊN
// ==========================================
function populateTopUpMemberSelect(preselectId = null) {
  const select = document.getElementById('topUpMemberSelect');
  if (!select) return;

  select.innerHTML = AppState.members.map(m => `
    <option value="${m.id}" ${m.id === preselectId ? 'selected' : ''}>
      ${m.name} (${getMemberRoleTypeText(m.type)}) - Ví: ${formatMoney(m.balance || 0)}
    </option>
  `).join('');
}

function openTopUpModal() {
  populateTopUpMemberSelect();
  openModal('topUpModal');
}

function openTopUpModalForMember(memberId) {
  populateTopUpMemberSelect(memberId);
  openModal('topUpModal');
}

function setTopUpAmount(amount) {
  const input = document.getElementById('topUpAmount');
  if (input) input.value = amount;
}

function handleTopUpSubmit(e) {
  e.preventDefault();
  const memberId = document.getElementById('topUpMemberSelect').value;
  const amount = Number(document.getElementById('topUpAmount').value);
  const method = document.querySelector('input[name="topUpMethod"]:checked').value;
  const note = document.getElementById('topUpNote').value.trim();

  const member = AppState.members.find(m => m.id === memberId);
  if (!member || amount <= 0) {
    showToast('Dữ liệu nạp ví không hợp lệ!', 'error');
    return;
  }

  // Cộng tiền vào ví thành viên
  member.balance = (member.balance || 0) + amount;

  const methodDesc = method === 'TRANSFER' ? 'Chuyển khoản VietQR' : 'Tiền mặt';
  const desc = note ? `${note} (${methodDesc})` : `Nạp tiền vào ví (${methodDesc})`;

  // Ghi nhật ký giao dịch
  AppState.transactions.push({
    id: 'TX_' + Date.now(),
    date: getNowTimestampString(),
    categoryGroup: 'WALLET_TOPUP',
    subType: 'TOPUP',
    categoryName: 'Nạp ví TV',
    amount: amount,
    targetName: member.name,
    memberId: member.id,
    walletImpact: amount, // Cộng ví thành viên
    fundImpact: 0,        // Không tác động Quỹ CLB
    description: desc,
    operator: getFinanceOperatorName()
  });

  saveData();
  closeModal('topUpModal');
  renderDashboard();
  renderFinanceTab();
  showToast(`Đã nạp thành công ${formatMoney(amount)} cho ${member.name}!`, 'success');
}

// ==========================================
// 12. THU / CHI QUỸ CLB (LEGACY ROUTER)
// ==========================================
function openFundTransactionModal(type = 'expense') {
  if (type === 'income') {
    openOtherIncomeModal();
  } else {
    openGeneralExpenseModal('EXP_GENERAL_OTHER');
  }
}

function setFundCategoryQuick(val) {
  const input = document.getElementById('fundCategory');
  if (input) input.value = val;
}

function handleFundTransactionSubmit(e) {
  e.preventDefault();
  const type = document.getElementById('fundTransactionType').value;
  const amount = Number(document.getElementById('fundAmount').value);
  const category = document.getElementById('fundCategory').value.trim();
  const party = document.getElementById('fundParty').value.trim() || 'Thủ quỹ / Ban chủ nhiệm';

  if (amount <= 0 || !category) {
    showToast('Vui lòng nhập đầy đủ thông tin số tiền và hạng mục!', 'warning');
    return;
  }

  if (type === 'income') {
    AppState.transactions.push({
      id: 'TX_' + Date.now(),
      date: getNowTimestampString(),
      categoryGroup: 'INCOME_A',
      subType: 'OTHER_IN',
      categoryName: 'Thu khác',
      amount: amount,
      targetName: party,
      walletImpact: 0,
      fundImpact: amount,
      description: `Thu: ${category} (Từ: ${party})`,
      operator: getFinanceOperatorName()
    });
    showToast(`Đã thu ${formatMoney(amount)} vào Quỹ CLB!`, 'success');
  } else {
    AppState.transactions.push({
      id: 'TX_' + Date.now(),
      date: getNowTimestampString(),
      categoryGroup: 'EXPENSE_B',
      subType: 'EXP_GENERAL_OTHER',
      categoryName: 'Chi HĐ khác',
      amount: amount,
      targetName: party,
      walletImpact: 0,
      fundImpact: -amount,
      description: `Chi: ${category} (Phụ trách: ${party})`,
      operator: getFinanceOperatorName()
    });
    showToast(`Đã chi ${formatMoney(amount)} từ Quỹ CLB!`, 'info');
  }

  saveData();
  closeModal('fundTransactionModal');
  renderDashboard();
  renderFinanceTab();
}

// ==========================================
// 13. QUỸ THÀNH VIÊN TẠM ỨNG & TẤT TOÁN DƯ NỢ
// ==========================================
function openAdvanceFundModal() {
  openModal('advanceFundModal');
}

function handleAdvanceFundSubmit(e) {
  e.preventDefault();
  const type = document.getElementById('advanceType').value;
  const amount = Number(document.getElementById('advanceAmount').value);
  const description = document.getElementById('advanceDescription').value.trim();

  if (amount <= 0 || !description) {
    showToast('Vui lòng nhập số tiền và nội dung tạm ứng!', 'warning');
    return;
  }

  if (type === 'IN') {
    AppState.funds.advanceFund = (AppState.funds.advanceFund || 0) + amount;
    AppState.transactions.push({
      id: 'TX_' + Date.now(),
      date: getNowTimestampString(),
      type: 'ADVANCE',
      amount: amount,
      targetName: 'Quỹ Tạm Ứng',
      walletImpact: 0,
      fundImpact: 0,
      description: `[Đóng ứng trước] ${description}`,
      operator: getFinanceOperatorName()
    });
    showToast(`Đã ghi nhận +${formatMoney(amount)} vào Quỹ tạm ứng!`, 'success');
  } else {
    AppState.funds.advanceFund = (AppState.funds.advanceFund || 0) - amount;
    AppState.transactions.push({
      id: 'TX_' + Date.now(),
      date: getNowTimestampString(),
      type: 'ADVANCE',
      amount: -amount,
      targetName: 'Quỹ Tạm Ứng',
      walletImpact: 0,
      fundImpact: 0,
      description: `[Hoàn trả / Chi ứng trước] ${description}`,
      operator: getFinanceOperatorName()
    });
    showToast(`Đã chi trả -${formatMoney(amount)} từ Quỹ tạm ứng!`, 'info');
  }

  calculateAdvanceFundStats();
  saveData();
  closeModal('advanceFundModal');
  renderDashboard();
  renderFinanceTab();
}

// 13.1 CHI TRẢ TIỀN CẦU (RÚT QUỸ TẠM ỨNG CẦU)
function openPayShuttleExpenseModal() {
  const dateInput = document.getElementById('payShuttleDate');
  if (dateInput) dateInput.value = getTodayInputFormat();
  const amtInput = document.getElementById('payShuttleAmount');
  if (amtInput) amtInput.value = 680000;
  openModal('payShuttleExpenseModal');
}

function handlePayShuttleExpenseSubmit(e) {
  e.preventDefault();
  const dateStr = document.getElementById('payShuttleDate')?.value || getTodayInputFormat();
  const dateFormatted = dateStr.split('-').reverse().join('/');
  const supplier = document.getElementById('payShuttleSupplier')?.value.trim() || 'Đại lý Cầu Lông';
  const amount = Number(document.getElementById('payShuttleAmount')?.value) || 0;
  const boxes = Number(document.getElementById('payShuttleBoxes')?.value) || 2;
  const note = document.getElementById('payShuttleNote')?.value.trim() || '';

  if (amount <= 0) {
    showToast('Vui lòng nhập số tiền chi trả mua cầu!', 'warning');
    return;
  }

  AppState.transactions.push({
    id: 'TX_' + Date.now() + '_SHUTTLE_PAY',
    date: `${dateFormatted} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    categoryGroup: 'ADVANCE_SHUTTLE_OUT',
    subType: 'SHUTTLE_EXP_PAY',
    categoryName: 'Chi trả tiền cầu',
    amount: amount,
    walletImpact: 0,
    fundImpact: -amount,
    targetName: supplier,
    description: `Chi trả tiền mua ${boxes} hộp cầu lông${note ? ` (${note})` : ''} (Rút Quỹ tạm ứng tiền cầu)`,
    operator: getFinanceOperatorName()
  });

  calculateAdvanceFundStats();
  saveData();
  closeModal('payShuttleExpenseModal');
  renderDashboard();
  renderFinanceTab();
  showToast(`🏸 Đã ghi nhận chi trả tiền mua cầu: -${formatMoney(amount)} (Rút Quỹ tạm ứng tiền cầu)!`, 'success');
}

// 13.2 CHI TRẢ TIỀN SÂN (RÚT QUỸ TẠM ỨNG SÂN)
function openPayCourtExpenseModal() {
  const dateInput = document.getElementById('payCourtDate');
  if (dateInput) dateInput.value = getTodayInputFormat();
  const amtInput = document.getElementById('payCourtAmount');
  if (amtInput) amtInput.value = 1500000;
  openModal('payCourtExpenseModal');
}

function handlePayCourtExpenseSubmit(e) {
  e.preventDefault();
  const dateStr = document.getElementById('payCourtDate')?.value || getTodayInputFormat();
  const dateFormatted = dateStr.split('-').reverse().join('/');
  const owner = document.getElementById('payCourtOwner')?.value.trim() || 'Chủ sân Cầu Lông';
  const amount = Number(document.getElementById('payCourtAmount')?.value) || 0;
  const period = document.getElementById('payCourtPeriod')?.value.trim() || 'Tiền thuê sân tháng này';
  const note = document.getElementById('payCourtNote')?.value.trim() || '';

  if (amount <= 0) {
    showToast('Vui lòng nhập số tiền chi trả cho chủ sân!', 'warning');
    return;
  }

  AppState.transactions.push({
    id: 'TX_' + Date.now() + '_COURT_PAY',
    date: `${dateFormatted} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    categoryGroup: 'ADVANCE_COURT_OUT',
    subType: 'COURT_EXP_PAY',
    categoryName: 'Chi trả tiền sân',
    amount: amount,
    walletImpact: 0,
    fundImpact: -amount,
    targetName: owner,
    description: `Chi trả tiền thuê sân (${period})${note ? ` (${note})` : ''} (Rút Quỹ tạm ứng tiền sân)`,
    operator: getFinanceOperatorName()
  });

  calculateAdvanceFundStats();
  saveData();
  closeModal('payCourtExpenseModal');
  renderDashboard();
  renderFinanceTab();
  showToast(`🏟️ Đã ghi nhận chi trả tiền thuê sân: -${formatMoney(amount)} (Rút Quỹ tạm ứng tiền sân)!`, 'success');
}

// 13.3 TẤT TOÁN DƯ NỢ VÍ THÀNH VIÊN
let currentSettlementFilterMode = 'ALL'; // 'ALL', 'DAILY', 'MONTHLY'

function openSettlementDebtModal(targetMemberId = null) {
  const dateInput = document.getElementById('settlementDate');
  if (dateInput) dateInput.value = getTodayInputFormat();

  populateSettlementMemberSelect(targetMemberId);
  renderSettlementDebtMemberList();
  openModal('settlementDebtModal');
}

function setSettlementModeFilter(mode) {
  currentSettlementFilterMode = mode;
  ['btnSetDaily', 'btnSetMonthly', 'btnSetCustom'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.className = 'px-2.5 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer bg-white text-slate-700 border-slate-200';
    }
  });
  const activeBtn = document.getElementById(mode === 'DAILY' ? 'btnSetDaily' : (mode === 'MONTHLY' ? 'btnSetMonthly' : 'btnSetCustom'));
  if (activeBtn) {
    activeBtn.className = 'px-2.5 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer bg-emerald-700 text-white border-emerald-800 shadow-sm';
  }

  const noteEl = document.getElementById('settlementModeDesc');
  if (noteEl) {
    if (mode === 'DAILY') noteEl.textContent = 'Thu hết dư nợ trong ngày sinh hoạt hôm nay. Nộp tiền để đưa số dư âm về 0đ.';
    else if (mode === 'MONTHLY') noteEl.textContent = 'Dư nợ theo dõi lũy kế cả tháng, tổng kết và tất toán cuối tháng.';
    else noteEl.textContent = 'Tất toán linh hoạt vào bất kỳ ngày nào do Ban chủ nhiệm chỉ định.';
  }
}

function populateSettlementMemberSelect(preselectId = null) {
  const select = document.getElementById('settlementMemberSelect');
  if (!select) return;

  const negMembers = (AppState.members || []).filter(m => (m.balance || 0) < 0);
  const posMembers = (AppState.members || []).filter(m => (m.balance || 0) >= 0);

  let html = '';
  if (negMembers.length > 0) {
    html += `<optgroup label="⚠️ Thành viên đang có số dư âm (Dư nợ)">`;
    negMembers.forEach(m => {
      html += `<option value="${m.id}" ${m.id === preselectId ? 'selected' : ''}>${m.name} (${getMemberRoleTypeText(m.type)}) — NỢ: ${formatMoney(Math.abs(m.balance))}</option>`;
    });
    html += `</optgroup>`;
  }

  html += `<optgroup label="Thành viên số dư dương / bình thường">`;
  posMembers.forEach(m => {
    html += `<option value="${m.id}" ${m.id === preselectId ? 'selected' : ''}>${m.name} (${getMemberRoleTypeText(m.type)}) — Ví: ${formatMoney(m.balance || 0)}</option>`;
  });
  html += `</optgroup>`;

  select.innerHTML = html;

  const chosenId = preselectId || (negMembers.length > 0 ? negMembers[0].id : (posMembers.length > 0 ? posMembers[0].id : null));
  if (chosenId) {
    select.value = chosenId;
    onSettlementMemberChanged(chosenId);
  }
}

function onSettlementMemberChanged(memberId) {
  const member = (AppState.members || []).find(m => m.id === memberId);
  if (!member) return;

  const curBalEl = document.getElementById('settlementCurrentBalText');
  const debtAmtInput = document.getElementById('settlementAmount');

  const curBal = member.balance || 0;
  if (curBalEl) {
    if (curBal < 0) {
      curBalEl.innerHTML = `<span class="px-2 py-0.5 rounded-md font-black bg-rose-100 text-rose-700 border border-rose-300">Dư nợ: ${formatMoney(curBal)}</span>`;
    } else {
      curBalEl.innerHTML = `<span class="px-2 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Ví: ${formatMoney(curBal)}</span>`;
    }
  }

  const suggestedAmount = curBal < 0 ? Math.abs(curBal) : 50000;
  if (debtAmtInput) {
    debtAmtInput.value = suggestedAmount;
  }
  updateSettlementNewBalancePreview();
}

function updateSettlementNewBalancePreview() {
  const select = document.getElementById('settlementMemberSelect');
  if (!select) return;
  const member = (AppState.members || []).find(m => m.id === select.value);
  if (!member) return;

  const curBal = member.balance || 0;
  const payAmt = Number(document.getElementById('settlementAmount')?.value) || 0;
  const newBal = curBal + payAmt;

  const newBalPreview = document.getElementById('settlementNewBalText');
  if (newBalPreview) {
    if (newBal < 0) {
      newBalPreview.innerHTML = `<b class="text-rose-600 font-black">${formatMoney(newBal)}</b> (vẫn còn nợ)`;
    } else if (newBal === 0) {
      newBalPreview.innerHTML = `<b class="text-emerald-700 font-black">0 đ</b> (đã hết sạch nợ ✅)`;
    } else {
      newBalPreview.innerHTML = `<b class="text-emerald-700 font-black">+${formatMoney(newBal)}</b> (dư tài khoản ✅)`;
    }
  }
}

function renderSettlementDebtMemberList() {
  const container = document.getElementById('settlementDebtMemberListContainer');
  if (!container) return;

  const negMembers = (AppState.members || []).filter(m => (m.balance || 0) < 0);
  if (negMembers.length === 0) {
    container.innerHTML = `
      <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs text-emerald-800 font-bold">
        🎉 Tuyệt vời! Hiện tại không có thành viên nào bị dư nợ ví âm.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
      <span>Danh sách thành viên đang có số dư âm (${negMembers.length} người)</span>
      <span class="text-rose-600 font-black">Tổng nợ: ${formatMoney(negMembers.reduce((sum, m) => sum + Math.abs(m.balance), 0))}</span>
    </div>
    <div class="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
      ${negMembers.map(m => `
        <div class="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs hover:border-emerald-300 transition">
          <div>
            <b class="text-slate-900">${m.name}</b>
            <span class="text-[10px] text-slate-400 block">${getMemberRoleTypeText(m.type)} • ${m.monthlySessions || 0} buổi</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-black text-rose-600">${formatMoney(m.balance)}</span>
            <button type="button" onclick="selectMemberForSettlement('${m.id}')" class="px-2 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] cursor-pointer shadow-2xs">
              Tất toán
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function selectMemberForSettlement(memberId) {
  const select = document.getElementById('settlementMemberSelect');
  if (select) {
    select.value = memberId;
    onSettlementMemberChanged(memberId);
  }
}

function handleSettlementDebtSubmit(e) {
  e.preventDefault();
  const select = document.getElementById('settlementMemberSelect');
  const memberId = select ? select.value : null;
  const member = (AppState.members || []).find(m => m.id === memberId);

  if (!member) {
    showToast('Vui lòng chọn thành viên cần tất toán!', 'warning');
    return;
  }

  const payAmt = Number(document.getElementById('settlementAmount')?.value) || 0;
  if (payAmt <= 0) {
    showToast('Số tiền nộp tất toán phải lớn hơn 0đ!', 'warning');
    return;
  }

  const dateStr = document.getElementById('settlementDate')?.value || getTodayInputFormat();
  const dateFormatted = dateStr.split('-').reverse().join('/');
  const method = document.querySelector('input[name="settlementMethod"]:checked')?.value || 'CASH';
  const methodText = method === 'TRANSFER' ? 'Chuyển khoản VietQR' : 'Tiền mặt';
  const note = document.getElementById('settlementNote')?.value.trim() || '';

  const oldBal = member.balance || 0;
  member.balance = oldBal + payAmt;
  const newBal = member.balance;

  const modeText = currentSettlementFilterMode === 'DAILY' ? 'Cuối ngày' : (currentSettlementFilterMode === 'MONTHLY' ? 'Cuối tháng' : 'Chỉ định');

  AppState.transactions.push({
    id: 'TX_' + Date.now() + '_SETTLEMENT',
    date: `${dateFormatted} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    categoryGroup: 'WALLET_SETTLEMENT',
    subType: 'SETTLEMENT',
    categoryName: 'Tất toán dư nợ',
    amount: payAmt,
    walletImpact: payAmt,
    fundImpact: 0,
    targetName: member.name,
    memberId: member.id,
    description: `Tất toán dư nợ (${modeText}) ngày ${dateFormatted} qua ${methodText}: Đã nộp ${formatMoney(payAmt)}${note ? ` (${note})` : ''} (Ví: ${formatMoney(oldBal)} ➔ ${formatMoney(newBal)})`,
    operator: getFinanceOperatorName()
  });

  calculateAdvanceFundStats();
  saveData();
  closeModal('settlementDebtModal');
  renderDashboard();
  renderFinanceTab();
  renderMemberManagementList();
  showToast(`💰 Tất toán thành công cho ${member.name}! Số dư ví mới: ${formatMoney(newBal)}.`, 'success');
}

// 13.4 LƯU CẤU HÌNH VÍ THÀNH VIÊN & TẤT TOÁN
function saveWalletSettlementConfig() {
  const allowNegative = document.getElementById('configAllowNegativeWallet')?.checked ?? true;
  const settlementMode = document.querySelector('input[name="configSettlementModeRadio"]:checked')?.value || 'MONTHLY';
  const defaultDay = document.getElementById('configDefaultSettlementDay')?.value || 'END_OF_MONTH';

  if (!AppState.config) AppState.config = {};
  AppState.config.allowNegativeWallet = allowNegative;
  AppState.config.settlementMode = settlementMode;
  AppState.config.defaultSettlementDay = defaultDay;

  saveData();
  showToast('Đã lưu cấu hình ví âm & chu kỳ tất toán thành công!', 'success');
}

// ==========================================
// 14. XỬ PHẠT VI PHẠM (LEGACY ROUTER -> QUICK FINE)
// ==========================================
function openFineModal() {
  openQuickFineModal();
}

function handleFineSubmit(e) {
  handleQuickFineSubmit(e);
}

// ==========================================
// 15. QUẢN LÝ THÀNH VIÊN
// ==========================================
let memberListFilter = 'ALL';

function setMemberListFilter(filter) {
  memberListFilter = filter;
  document.querySelectorAll('.mem-filter-btn').forEach(btn => {
    btn.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
    btn.classList.add('text-slate-600');
  });
  const activeBtn = document.getElementById(`filter-mem-${filter.toLowerCase()}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-slate-600');
    activeBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
  }
  renderMemberManagementList();
}

function renderMemberManagementList() {
  const tbody = document.getElementById('memberManagementTableBody');
  const searchInput = document.getElementById('searchMemberList');
  if (!tbody) return;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  let list = AppState.members;

  if (memberListFilter === 'OFFICIAL') {
    list = list.filter(m => m.type === 'OFFICIAL');
  } else if (memberListFilter === 'HONORARY' || memberListFilter === 'UNOFFICIAL') {
    list = list.filter(m => m.type === 'HONORARY' || m.type === 'UNOFFICIAL');
  } else if (memberListFilter === 'GUEST') {
    list = list.filter(m => m.type.startsWith('GUEST'));
  }

  if (query) {
    list = list.filter(m => 
      m.name.toLowerCase().includes(query) || 
      (m.phone && m.phone.includes(query)) ||
      (m.username && m.username.toLowerCase().includes(query))
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400">Không tìm thấy thành viên nào</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(m => {
    const isNegative = (m.balance || 0) < 0;
    const balanceClass = isNegative ? 'text-rose-600 font-bold' : 'text-slate-900 font-bold';
    const mRole = m.role || 'MEMBER';
    const mRoleDef = ROLE_DEFINITIONS[mRole] || ROLE_DEFINITIONS.MEMBER;
    const isLocked = m.status === 'LOCKED';

    const accountInfo = `
      <div>
        <div class="font-mono text-slate-800 font-semibold text-xs flex items-center gap-1">
          <span>@${m.username || 'chưa_tạo'}</span>
          ${isLocked ? `<span class="text-rose-600 text-[10px]" title="Tài khoản đang bị khóa">🔒</span>` : ''}
        </div>
        <div class="mt-0.5">
          <span class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold border ${mRoleDef.badgeClass}">
            ${mRoleDef.icon} ${mRoleDef.label}
          </span>
        </div>
      </div>
    `;

    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="py-3 px-4">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-slate-900 text-xs">${m.name}</span>
            <button onclick="openQuickRenameModal('${m.id}')" class="text-slate-400 hover:text-brand-600 p-0.5 rounded transition cursor-pointer" title="Đổi tên / SĐT thành viên">
              <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          <div class="text-[11px] text-slate-400">${m.phone || 'Chưa có SĐT'}</div>
        </td>
        <td class="py-3 px-2">
          ${getMemberRoleBadge(m.type)}
        </td>
        <td class="py-3 px-3">
          ${accountInfo}
        </td>
        <td class="py-3 px-3 text-right ${balanceClass} text-xs">
          ${formatMoney(m.balance || 0)}
        </td>
        <td class="py-3 px-2 text-center font-bold text-slate-700 text-xs">
          ${m.monthlySessions || 0} buổi
        </td>
        <td class="py-3 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5 flex-wrap">
            <button onclick="quickCheckInSingleMember('${m.id}')" class="px-2 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded text-[11px] font-bold cursor-pointer" title="Điểm danh 1-chạm (trừ ví ngay)">
              ⚡ Điểm danh
            </button>
            <button onclick="openTopUpModalForMember('${m.id}')" class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[11px] font-bold cursor-pointer" title="Nạp ví">
              Nạp ví
            </button>
            <button onclick="openUserAccessModal('${m.id}')" class="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded text-[11px] font-bold cursor-pointer flex items-center gap-1" title="Cấp quyền sử dụng & Mật khẩu">
              <span>🔑</span>
              <span>Cấp quyền</span>
            </button>
            <button onclick="openMemberModal('edit', '${m.id}')" class="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer" title="Sửa thông tin đầy đủ">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="deleteMember('${m.id}')" class="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer" title="Xóa">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

function openMemberModal(mode = 'official', memberId = null) {
  const modalTitle = document.getElementById('memberModalTitle');
  const editIdInput = document.getElementById('memberEditId');
  const nameInput = document.getElementById('memberFullName');
  const phoneInput = document.getElementById('memberPhone');
  const typeSelect = document.getElementById('memberTypeSelect');
  const usernameInput = document.getElementById('memberUsername');
  const passwordInput = document.getElementById('memberPassword');
  const initBalanceInput = document.getElementById('memberInitialBalance');

  if (mode === 'edit' && memberId) {
    const member = AppState.members.find(m => m.id === memberId);
    if (!member) return;
    modalTitle.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-brand-600"></i> Sửa Thông Tin Thành Viên`;
    editIdInput.value = member.id;
    nameInput.value = member.name;
    phoneInput.value = member.phone || '';
    typeSelect.value = member.type;
    usernameInput.value = member.username || '';
    passwordInput.value = member.password || '';
    initBalanceInput.value = member.balance || 0;
    initBalanceInput.disabled = true; // Không sửa balance tại đây, qua nạp ví
  } else {
    modalTitle.innerHTML = `<i data-lucide="user-plus" class="w-5 h-5 text-brand-600"></i> Thêm Thành Viên Mới`;
    editIdInput.value = '';
    nameInput.value = '';
    phoneInput.value = '';
    typeSelect.value = (mode === 'honorary' || mode === 'unofficial') ? 'HONORARY' : 'OFFICIAL';
    usernameInput.value = '';
    passwordInput.value = '123';
    initBalanceInput.value = 0;
    initBalanceInput.disabled = false;
  }

  lucide.createIcons();
  openModal('memberModal');
}

function handleMemberSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('memberEditId').value;
  const name = document.getElementById('memberFullName').value.trim();
  const phone = document.getElementById('memberPhone').value.trim();
  const type = document.getElementById('memberTypeSelect').value;
  const username = document.getElementById('memberUsername').value.trim();
  const password = document.getElementById('memberPassword').value.trim();
  const initBalance = Number(document.getElementById('memberInitialBalance').value || 0);

  if (!name) {
    showToast('Vui lòng nhập họ và tên thành viên!', 'warning');
    return;
  }

  if (editId) {
    // Sửa thông tin thành viên hiện có
    const member = AppState.members.find(m => m.id === editId);
    if (member) {
      member.name = name;
      member.chipName = name.trim().split(/\s+/).pop().toUpperCase();
      member.phone = phone;
      member.type = type;
      member.username = username;
      if (password) member.password = password;
    }
  } else {
    // Thêm thành viên mới
    const newId = 'M' + String(Date.now()).slice(-4);
    const chip = name.trim().split(/\s+/).pop().toUpperCase();
    const newMember = {
      id: newId,
      name: name,
      chipName: chip,
      phone: phone,
      type: type,
      username: username || generateAutoUsername(name),
      password: password || '123456',
      balance: initBalance,
      monthlySessions: 0,
      role: 'MEMBER',
      status: 'ACTIVE',
      permissions: getRoleDefaultPermissions('MEMBER')
    };
    AppState.members.push(newMember);

    if (initBalance > 0) {
      AppState.transactions.push({
        id: 'TX_' + Date.now(),
        date: getNowTimestampString(),
        type: 'TOPUP',
        categoryGroup: 'WALLET_TOPUP',
        subType: 'TOPUP',
        categoryName: 'Nạp ví ban đầu',
        amount: initBalance,
        targetName: name,
        memberId: newId,
        walletImpact: initBalance,
        fundImpact: 0,
        description: 'Số dư ví ban đầu khi tạo thành viên',
        operator: (AppState.auth && AppState.auth.user) ? AppState.auth.user.username : 'admin'
      });
    }
  }

  saveData();
  closeModal('memberModal');
  renderDashboard();
  renderMemberManagementList();
  showToast('Đã lưu thông tin thành viên thành công!', 'success');
}

function deleteMember(memberId) {
  const member = AppState.members.find(m => m.id === memberId);
  if (!member) return;

  const confirmed = confirm(`Bạn có chắc chắn muốn xóa thành viên "${member.name}" khỏi danh sách?`);
  if (!confirmed) return;

  AppState.members = AppState.members.filter(m => m.id !== memberId);
  saveData();
  renderDashboard();
  renderMemberManagementList();
  showToast(`Đã xóa thành viên ${member.name}!`, 'info');
}

// Khách giao lưu nhanh
function openAddGuestModal() {
  document.getElementById('guestName').value = '';
  document.getElementById('guestPhone').value = '';
  document.getElementById('guestTypeSelect').value = 'GUEST_B';
  updateGuestPricePreview();
  openModal('addGuestModal');
}

function updateGuestPricePreview() {
  const type = document.getElementById('guestTypeSelect').value;
  const price = (AppState.config && AppState.config.guestPrices && AppState.config.guestPrices[type]) || 100000;
  const preview = document.getElementById('guestPricePreview');
  if (preview) preview.textContent = formatMoney(price);
}

function handleAddGuestSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const phone = document.getElementById('guestPhone').value.trim();
  const type = document.getElementById('guestTypeSelect').value;

  if (!name) {
    showToast('Vui lòng nhập tên khách giao lưu!', 'warning');
    return;
  }

  const chip = name.trim().split(/\s+/).pop().toUpperCase();
  const newGuest = {
    id: 'GUEST_' + Date.now(),
    name: name,
    chipName: chip,
    phone: phone,
    type: type,
    username: '',
    password: '',
    balance: 0,
    monthlySessions: 0,
    role: 'MEMBER',
    status: 'ACTIVE',
    permissions: getRoleDefaultPermissions('MEMBER')
  };

  AppState.members.push(newGuest);
  saveData();
  closeModal('addGuestModal');
  renderDashboard();
  renderAttendanceChecklist();
  renderMemberManagementList();
  showToast(`Đã thêm khách giao lưu ${name} thành công!`, 'success');
}

// ==========================================
// 15.5 PHÂN HỆ QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG & CẤP QUYỀN SỬ DỤNG
// ==========================================
let currentUserAccessRoleFilter = 'ALL';
let currentSelectedModalPreset = 'ADMIN';

function setUserAccessRoleFilter(role) {
  currentUserAccessRoleFilter = role;
  const roles = ['ALL', 'ADMIN', 'VICE_ADMIN', 'TREASURER', 'REFEREE', 'MEMBER'];
  roles.forEach(r => {
    const btn = document.getElementById(`btnAccessFilter-${r}`);
    if (btn) {
      if (r === role) {
        btn.className = 'px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer bg-purple-700 text-white border-purple-700 shadow-2xs';
      } else {
        btn.className = 'px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer bg-white text-slate-700 border-slate-200 hover:bg-slate-50';
      }
    }
  });
  renderUserAccessTable();
}

function renderUserAccessTable() {
  const container = document.getElementById('userAccessTableContainer');
  if (!container) return;

  const members = AppState.members || [];

  // Thống kê số lượng tài khoản theo vai trò
  let adminCount = 0;
  let viceCount = 0;
  let treasurerCount = 0;
  let refereeCount = 0;
  let memberCount = 0;
  let lockedCount = 0;

  members.forEach(m => {
    const r = m.role || 'MEMBER';
    if (r === 'ADMIN') adminCount++;
    else if (r === 'VICE_ADMIN') viceCount++;
    else if (r === 'TREASURER') treasurerCount++;
    else if (r === 'REFEREE') refereeCount++;
    else memberCount++;

    if (m.status === 'LOCKED') lockedCount++;
  });

  const statAdminEl = document.getElementById('accessStatAdmin');
  if (statAdminEl) statAdminEl.textContent = adminCount;
  const statViceEl = document.getElementById('accessStatVice');
  if (statViceEl) statViceEl.textContent = viceCount;
  const statTreasurerEl = document.getElementById('accessStatTreasurer');
  if (statTreasurerEl) statTreasurerEl.textContent = treasurerCount;
  const statRefereeEl = document.getElementById('accessStatReferee');
  if (statRefereeEl) statRefereeEl.textContent = refereeCount;
  const statMemberEl = document.getElementById('accessStatMember');
  if (statMemberEl) statMemberEl.textContent = memberCount;
  const statLockedEl = document.getElementById('accessStatLocked');
  if (statLockedEl) statLockedEl.textContent = lockedCount;

  const filterCountAllEl = document.getElementById('filterCountAll');
  if (filterCountAllEl) filterCountAllEl.textContent = members.length;

  // Đổ danh sách vào bộ chuyển đổi tài khoản / vai trò giả lập (quick switcher)
  const activeRoleSelect = document.getElementById('configActiveRoleSelect');
  if (activeRoleSelect) {
    const currentLoggedUser = AppState.auth?.user;
    const currentRole = getCurrentUserRole();
    let selHtml = `
      <optgroup label="🎭 1. Trải Nghiệm Thử Theo Vai Trò Chuẩn">
        <option value="ROLE_ADMIN" ${currentRole === 'ADMIN' && (!currentLoggedUser?.id || currentLoggedUser.id === 'M001') ? 'selected' : ''}>👑 Chủ nhiệm (Toàn quyền 6/6)</option>
        <option value="ROLE_VICE_ADMIN" ${currentRole === 'VICE_ADMIN' ? 'selected' : ''}>🛡️ Phó nhóm (Điểm danh, Giải đấu, Trọng tài)</option>
        <option value="ROLE_TREASURER" ${currentRole === 'TREASURER' ? 'selected' : ''}>💰 Thủ quỹ (Quản lý Quỹ, Nạp ví, Tất toán)</option>
        <option value="ROLE_REFEREE" ${currentRole === 'REFEREE' ? 'selected' : ''}>⚖️ Trọng tài (Nhập điểm số & Điều hành sân)</option>
        <option value="ROLE_MEMBER" ${currentRole === 'MEMBER' ? 'selected' : ''}>👤 Hội viên thường (Chỉ xem cá nhân)</option>
      </optgroup>
      <optgroup label="👤 2. Đăng Nhập Đúng Tài Khoản Từng Thành Viên">
    `;
    members.forEach(m => {
      const isCur = currentLoggedUser && currentLoggedUser.id === m.id;
      const roleDef = ROLE_DEFINITIONS[m.role] || ROLE_DEFINITIONS.MEMBER;
      selHtml += `<option value="MEMBER_${m.id}" ${isCur ? 'selected' : ''}>${roleDef.icon} ${escapeHtml(m.name)} (@${m.username || 'chưa_tạo'}${m.status === 'LOCKED' ? ' - 🔒 Khóa' : ''})</option>`;
    });
    selHtml += `</optgroup>`;
    activeRoleSelect.innerHTML = selHtml;
  }

  // Lọc danh sách thành viên theo tab và từ khóa
  const searchInput = document.getElementById('searchUserAccessInput');
  const query = (searchInput?.value || '').toLowerCase().trim();

  const filtered = members.filter(m => {
    if (currentUserAccessRoleFilter !== 'ALL') {
      const r = m.role || 'MEMBER';
      if (r !== currentUserAccessRoleFilter) return false;
    }
    if (query) {
      const matchName = m.name && m.name.toLowerCase().includes(query);
      const matchUser = m.username && m.username.toLowerCase().includes(query);
      const matchPhone = m.phone && m.phone.includes(query);
      const matchChip = m.chipName && m.chipName.toLowerCase().includes(query);
      if (!matchName && !matchUser && !matchPhone && !matchChip) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-12 px-4 text-center">
        <span class="text-4xl block mb-2">🔍</span>
        <h4 class="font-bold text-slate-800 text-sm">Không tìm thấy tài khoản nào phù hợp</h4>
        <p class="text-xs text-slate-500 mt-1">Vui lòng thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc khác.</p>
      </div>
    `;
    return;
  }

  let tableHtml = `
    <table class="w-full text-left text-xs whitespace-nowrap">
      <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
        <tr>
          <th class="py-3 px-3.5">Thành viên CLB</th>
          <th class="py-3 px-3">Tài khoản & Mật khẩu</th>
          <th class="py-3 px-3">Vai trò chính</th>
          <th class="py-3 px-3">Quyền sử dụng cấp phát</th>
          <th class="py-3 px-3 text-center">Trạng thái</th>
          <th class="py-3 px-3 text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
  `;

  filtered.forEach(m => {
    const role = m.role || 'MEMBER';
    const roleDef = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.MEMBER;
    const isLocked = m.status === 'LOCKED';
    const isCurrentLoggedIn = AppState.auth?.user?.id === m.id || (AppState.auth?.user?.username === m.username && m.username);

    // Xử lý huy hiệu quyền hạn
    const perms = m.permissions || getRoleDefaultPermissions(role);
    const activePermKeys = PERMISSION_KEYS.filter(k => perms[k] === true);

    let permsHtml = '';
    if (role === 'ADMIN' || activePermKeys.length === 6) {
      permsHtml = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">👑 Toàn quyền (6/6)</span>`;
    } else if (activePermKeys.length === 0) {
      permsHtml = `<span class="text-[11px] text-slate-400 italic">Chỉ xem (Không cấp quyền thao tác)</span>`;
    } else {
      permsHtml = `<div class="flex flex-wrap items-center gap-1 max-w-xs">`;
      activePermKeys.forEach(pk => {
        const pDef = PERMISSION_DEFINITIONS[pk];
        permsHtml += `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200" title="${pDef.desc}">${pDef.icon} ${pDef.label}</span>`;
      });
      permsHtml += `</div>`;
    }

    // Huy hiệu vai trò
    const roleBadgeHtml = `
      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border ${roleDef.badgeClass}">
        <span>${roleDef.icon}</span>
        <span>${roleDef.label}</span>
      </span>
    `;

    // Huy hiệu trạng thái
    const statusBadgeHtml = isLocked
      ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">🔒 Đã khóa</span>`
      : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Hoạt động</span>`;

    const rowBg = isCurrentLoggedIn ? 'bg-purple-50/60' : (isLocked ? 'bg-rose-50/30' : 'hover:bg-slate-50/80');

    tableHtml += `
      <tr class="${rowBg} transition">
        <td class="py-2.5 px-3.5">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
              ${escapeHtml(m.chipName ? m.chipName.charAt(0) : m.name.charAt(0))}
            </div>
            <div>
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <span>${escapeHtml(m.name)}</span>
                ${isCurrentLoggedIn ? `<span class="px-1.5 py-0.2 bg-purple-200 text-purple-900 rounded text-[9px] font-black uppercase">Đang đăng nhập</span>` : ''}
              </div>
              <div class="text-[11px] text-slate-400 flex items-center gap-2">
                <span>ID: ${m.id}</span>
                ${m.phone ? `<span>• 📞 ${m.phone}</span>` : ''}
              </div>
            </div>
          </div>
        </td>

        <td class="py-2.5 px-3 font-mono">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">@${escapeHtml(m.username || 'chưa_tạo')}</span>
          </div>
          <div class="text-[10px] text-slate-400 mt-0.5">MK: ${escapeHtml(m.password || '123456')}</div>
        </td>

        <td class="py-2.5 px-3">
          ${roleBadgeHtml}
        </td>

        <td class="py-2.5 px-3">
          ${permsHtml}
        </td>

        <td class="py-2.5 px-3 text-center">
          ${statusBadgeHtml}
        </td>

        <td class="py-2.5 px-3 text-center">
          <div class="flex items-center justify-center gap-1.5 flex-wrap">
            <button type="button" onclick="openUserAccessModal('${m.id}')" class="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs" title="Chỉnh sửa quyền sử dụng & tài khoản">
              <span>🔑</span>
              <span>Cấp quyền</span>
            </button>
            <button type="button" onclick="loginAsMemberAccount('${m.id}')" class="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs" title="Đăng nhập thử vai trò của thành viên này">
              <span>🎭</span>
              <span>Đăng nhập</span>
            </button>
            <button type="button" onclick="toggleUserAccountLock('${m.id}')" class="px-2 py-1 ${isLocked ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'} rounded-lg font-bold text-[11px] transition cursor-pointer shadow-2xs" title="${isLocked ? 'Mở khóa tài khoản' : 'Tạm khóa tài khoản'}">
              <span>${isLocked ? '🔓 Mở' : '🔒 Khóa'}</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tableHtml += `
      </tbody>
    </table>
  `;

  container.innerHTML = tableHtml;
  lucide.createIcons();
}

function openCreateUserAccessModal() {
  const members = AppState.members || [];
  const m = members[0];
  if (m) {
    openUserAccessModal(m.id);
  }
}

function openUserAccessModal(memberId) {
  const members = AppState.members || [];
  const member = members.find(m => m.id === memberId) || members[0];
  if (!member) return;

  // Đổ danh sách vào select chọn thành viên
  const memberSelect = document.getElementById('accessEditMemberSelect');
  if (memberSelect) {
    const official = members.filter(m => m.type === 'OFFICIAL');
    const honorary = members.filter(m => m.type === 'HONORARY');
    const other = members.filter(m => m.type !== 'OFFICIAL' && m.type !== 'HONORARY');

    let html = '';
    if (official.length > 0) {
      html += `<optgroup label="Thành viên chính thức (${official.length} người)">`;
      official.forEach(item => {
        html += `<option value="${item.id}" ${item.id === member.id ? 'selected' : ''}>${escapeHtml(item.name)} (${escapeHtml(item.chipName || item.id)})</option>`;
      });
      html += `</optgroup>`;
    }
    if (honorary.length > 0) {
      html += `<optgroup label="Thành viên danh dự (${honorary.length} người)">`;
      honorary.forEach(item => {
        html += `<option value="${item.id}" ${item.id === member.id ? 'selected' : ''}>${escapeHtml(item.name)} (${escapeHtml(item.chipName || item.id)})</option>`;
      });
      html += `</optgroup>`;
    }
    if (other.length > 0) {
      html += `<optgroup label="Khách / Khác (${other.length} người)">`;
      other.forEach(item => {
        html += `<option value="${item.id}" ${item.id === member.id ? 'selected' : ''}>${escapeHtml(item.name || item.chipName || item.id)}</option>`;
      });
      html += `</optgroup>`;
    }
    memberSelect.innerHTML = html;
  }

  // Điền dữ liệu vào form
  const idInput = document.getElementById('accessEditMemberId');
  if (idInput) idInput.value = member.id;

  const userInput = document.getElementById('accessEditUsername');
  if (userInput) userInput.value = member.username || generateAutoUsername(member.name);

  const passInput = document.getElementById('accessEditPassword');
  if (passInput) passInput.value = member.password || '123456';

  const statusActive = document.getElementById('accessStatusActive');
  const statusLocked = document.getElementById('accessStatusLocked');
  if (member.status === 'LOCKED') {
    if (statusLocked) statusLocked.checked = true;
  } else {
    if (statusActive) statusActive.checked = true;
  }

  // Thiết lập quyền hạn & Preset vai trò
  const role = member.role || 'MEMBER';
  const perms = member.permissions || getRoleDefaultPermissions(role);

  const pAttendance = document.getElementById('permAttendance');
  if (pAttendance) pAttendance.checked = !!perms.attendance;
  const pFinance = document.getElementById('permFinance');
  if (pFinance) pFinance.checked = !!perms.finance;
  const pMember = document.getElementById('permMember');
  if (pMember) pMember.checked = !!perms.member;
  const pTour = document.getElementById('permTournament');
  if (pTour) pTour.checked = !!perms.tournament;
  const pRef = document.getElementById('permReferee');
  if (pRef) pRef.checked = !!perms.referee;
  const pConfig = document.getElementById('permConfig');
  if (pConfig) pConfig.checked = !!perms.config;

  highlightRolePresetButton(role);
  openModal('modalEditUserAccess');
}

function onAccessMemberSelectChanged(memberId) {
  openUserAccessModal(memberId);
}

function highlightRolePresetButton(role) {
  currentSelectedModalPreset = role;
  const presets = ['ADMIN', 'VICE_ADMIN', 'TREASURER', 'REFEREE', 'MEMBER', 'CUSTOM'];
  presets.forEach(p => {
    const btn = document.getElementById(`btnPreset-${p}`);
    if (btn) {
      if (p === role) {
        btn.className = 'p-2 rounded-xl border text-left font-bold transition cursor-pointer flex flex-col justify-between ring-2 ring-purple-600 bg-purple-50 text-purple-950 border-purple-400 shadow-xs';
      } else {
        btn.className = 'p-2 rounded-xl border text-left font-bold transition cursor-pointer flex flex-col justify-between hover:border-slate-300 bg-white text-slate-700 border-slate-200';
      }
    }
  });
}

function applyRolePreset(role) {
  highlightRolePresetButton(role);
  if (role === 'CUSTOM') return;

  const defaults = getRoleDefaultPermissions(role);
  const pAtt = document.getElementById('permAttendance');
  if (pAtt) pAtt.checked = defaults.attendance;
  const pFin = document.getElementById('permFinance');
  if (pFin) pFin.checked = defaults.finance;
  const pMem = document.getElementById('permMember');
  if (pMem) pMem.checked = defaults.member;
  const pTour = document.getElementById('permTournament');
  if (pTour) pTour.checked = defaults.tournament;
  const pRef = document.getElementById('permReferee');
  if (pRef) pRef.checked = defaults.referee;
  const pCfg = document.getElementById('permConfig');
  if (pCfg) pCfg.checked = defaults.config;
}

function onCustomPermChanged() {
  highlightRolePresetButton('CUSTOM');
}

function setQuickDefaultPassword() {
  const p = document.getElementById('accessEditPassword');
  if (p) p.value = '123456';
  showToast('Đã áp dụng mật khẩu mặc định: 123456', 'info');
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

function handleSaveUserAccessSubmit(e) {
  e.preventDefault();
  const memberId = document.getElementById('accessEditMemberId').value;
  const member = AppState.members.find(m => m.id === memberId);
  if (!member) {
    showToast('Lỗi: Không tìm thấy thành viên tương ứng!', 'error');
    return;
  }

  const username = document.getElementById('accessEditUsername').value.trim();
  const password = document.getElementById('accessEditPassword').value.trim();
  const status = document.querySelector('input[name="accessEditStatus"]:checked')?.value || 'ACTIVE';

  if (!username) {
    showToast('Vui lòng nhập tên đăng nhập (Username)!', 'warning');
    return;
  }
  if (!password) {
    showToast('Vui lòng nhập mật khẩu tài khoản!', 'warning');
    return;
  }

  // Kiểm tra trùng username với người khác
  const dup = AppState.members.find(m => m.id !== member.id && m.username && m.username.toLowerCase() === username.toLowerCase());
  if (dup) {
    showToast(`Tên đăng nhập "${username}" đã được sử dụng bởi ${dup.name}! Vui lòng chọn tên khác.`, 'error');
    return;
  }

  const permissions = {
    attendance: !!document.getElementById('permAttendance')?.checked,
    finance: !!document.getElementById('permFinance')?.checked,
    member: !!document.getElementById('permMember')?.checked,
    tournament: !!document.getElementById('permTournament')?.checked,
    referee: !!document.getElementById('permReferee')?.checked,
    config: !!document.getElementById('permConfig')?.checked
  };

  // Xác định vai trò tương ứng
  let role = currentSelectedModalPreset;
  if (role === 'CUSTOM') {
    const allChecked = Object.values(permissions).every(Boolean);
    if (allChecked) role = 'ADMIN';
    else role = 'CUSTOM';
  }

  member.username = username;
  member.password = password;
  member.status = status;
  member.role = role;
  member.permissions = permissions;

  // Cập nhật phiên đăng nhập hiện tại nếu trùng tài khoản
  if (AppState.auth && AppState.auth.user && AppState.auth.user.id === member.id) {
    AppState.auth.user.username = username;
    AppState.auth.user.role = role;
    AppState.auth.user.permissions = permissions;
  }

  saveData();
  closeModal('modalEditUserAccess');
  renderUserAccessTable();
  renderMemberManagementList();
  renderAuthBadge();
  renderAttendanceRoleBanner();

  showToast(`✓ Đã lưu thành công quyền sử dụng & tài khoản cho ${member.name}!`, 'success');
}

function autoSetupAllMemberAccounts() {
  const members = AppState.members || [];
  let updatedCount = 0;

  members.forEach(m => {
    let changed = false;
    if (!m.username) {
      m.username = generateAutoUsername(m.name || m.id);
      changed = true;
    }
    if (!m.password) {
      m.password = '123456';
      changed = true;
    }
    if (!m.role) {
      if (m.id === 'M001') m.role = 'ADMIN';
      else if (m.id === 'M002' || m.id === 'M003') m.role = 'VICE_ADMIN';
      else if (m.id === 'M005') m.role = 'TREASURER';
      else if (m.id === 'M004') m.role = 'REFEREE';
      else m.role = 'MEMBER';
      changed = true;
    }
    if (!m.permissions) {
      m.permissions = getRoleDefaultPermissions(m.role);
      changed = true;
    }
    if (!m.status) {
      m.status = 'ACTIVE';
      changed = true;
    }
    if (changed) updatedCount++;
  });

  saveData();
  renderUserAccessTable();
  renderMemberManagementList();
  showToast(`✓ Đã tự động tạo tài khoản & mật khẩu (123456) cho toàn bộ ${members.length} thành viên!`, 'success');
}

function toggleUserAccountLock(memberId) {
  const member = AppState.members.find(m => m.id === memberId);
  if (!member) return;

  if (member.role === 'ADMIN' && member.status !== 'LOCKED') {
    const adminCount = AppState.members.filter(m => m.role === 'ADMIN' && m.status !== 'LOCKED').length;
    if (adminCount <= 1) {
      showToast('Không thể khóa tài khoản Chủ nhiệm duy nhất của CLB!', 'warning');
      return;
    }
  }

  member.status = member.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
  saveData();
  renderUserAccessTable();
  const msg = member.status === 'LOCKED'
    ? `🔒 Đã tạm khóa tài khoản của ${member.name}!`
    : `🔓 Đã mở khóa tài khoản của ${member.name}!`;
  showToast(msg, 'info');
}

// Cấp lại mật khẩu (Tích hợp mở modal phân quyền đầy đủ)
function openResetPasswordModal(memberId) {
  openUserAccessModal(memberId);
}

function handleResetPasswordSubmit(e) {
  handleSaveUserAccessSubmit(e);
}

// ==========================================
// 15.5 PHÂN HỆ QUẢN LÝ ĐA CÂU LẠC BỘ (MULTI-CLUB SWITCHER & ACCOUNTS)
// Cho phép tạo thêm CLB mới (Quỹ, Thành viên, Tài khoản Chủ nhiệm riêng) và chuyển đổi linh hoạt
// ==========================================

function renderClubSwitcher() {
  const container = document.getElementById('headerClubSwitcherContainer');
  if (!container) return;

  const registry = getClubsRegistry();
  const activeClub = getActiveClub();
  const isHideDemo = localStorage.getItem('CLB_HIDE_DEV_DEMO') === 'true';
  const visibleClubs = isHideDemo
    ? registry.filter(c => !c.isDeveloperSample && c.id !== 'club_smash' && c.id !== 'club_lightning')
    : registry;
  const listToRender = visibleClubs.length > 0 ? visibleClubs : registry;

  // Cập nhật biểu tượng và tên trên Header
  const iconEl = document.getElementById('headerClubIconSpan');
  if (iconEl) iconEl.textContent = activeClub.logoIcon || '🏸';

  const nameEl = document.getElementById('headerClubName');
  if (nameEl) nameEl.textContent = AppState.config?.clubName || activeClub.name;

  let optionsHtml = listToRender.map(c => `
    <option value="${c.id}" ${c.id === activeClub.id ? 'selected' : ''} class="text-slate-900 font-bold py-1">
      ${c.logoIcon || '🏸'} ${c.shortName || c.name}
    </option>
  `).join('');

  container.innerHTML = `
    <div class="flex items-center gap-1 bg-slate-100/90 hover:bg-slate-200/60 border border-slate-300/80 rounded-xl p-0.5 sm:p-1 transition shadow-2xs">
      <div class="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 text-xs">
        <span class="text-sm select-none" id="headerSwitcherActiveIcon">${activeClub.logoIcon || '🏸'}</span>
        <select id="headerClubSelect" onchange="switchActiveClub(this.value)" class="bg-transparent font-black text-xs text-slate-900 border-none outline-none cursor-pointer max-w-[100px] sm:max-w-[155px] md:max-w-[190px] truncate" title="Chuyển đổi Câu Lạc Bộ">
          ${optionsHtml}
        </select>
      </div>
      <button type="button" onclick="openClubShortcutGuideModal()" class="px-2 py-1 bg-white hover:bg-slate-50 text-purple-900 border border-purple-200 font-bold text-xs rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer shrink-0" title="Tạo lối tắt ra màn hình chính & Lấy link CLB này">
        <span>📱</span>
        <span class="hidden xl:inline">Lối tắt</span>
      </button>
      <button type="button" onclick="openCreateClubModal()" class="px-2 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer shrink-0" title="Tạo tài khoản Câu Lạc Bộ mới">
        <span>➕</span>
        <span class="hidden md:inline">Tạo CLB</span>
      </button>
    </div>
  `;
}

function switchActiveClub(clubId) {
  const registry = getClubsRegistry();
  const targetClub = registry.find(c => c.id === clubId || c.accessSlug === clubId);
  if (!targetClub) {
    showToast('Không tìm thấy thông tin Câu Lạc Bộ!', 'error');
    return;
  }

  // 1. Lưu lại trạng thái CLB HIỆN TẠI vào đúng storageKey hiện tại của nó (tránh ghi đè sang CLB mới)
  // 1. Lưu lại trạng thái CLB HIỆN TẠI vào đúng storageKey hiện tại của nó (tránh ghi đè sang CLB mới)
  const curKey = STORAGE_KEY || getCurrentClubStorageKey();
  if (curKey && curKey !== targetClub.storageKey && AppState && Object.keys(AppState).length > 0) {
    try {
      localStorage.setItem(curKey, JSON.stringify(AppState));
    } catch (e) {}
  }

  // 2. Chuyển đổi mã CLB tích cực & cập nhật URL
  setActiveClubId(targetClub.id);
  STORAGE_KEY = targetClub.storageKey;
  updateClubUrlParam(targetClub.accessSlug || targetClub.id);

  // 3. Tải dữ liệu của CLB đích
  loadData();
  initActivitySessionData(true);

  // 4. Đồng bộ Theme màu & Header
  applyThemeColor(AppState.config?.themeColor || targetClub.themeColor || 'emerald');

  const nameEl = document.getElementById('headerClubName');
  if (nameEl) nameEl.textContent = AppState.config?.clubName || targetClub.name;

  const iconEl = document.getElementById('headerClubIconSpan');
  if (iconEl) iconEl.textContent = targetClub.logoIcon || '🏸';

  // 5. Render lại toàn bộ giao diện của phân hệ đang mở
  renderClubSwitcher();
  renderDashboard();
  populateLeadershipSelects();

  if (currentTab === 'attendance') renderAttendanceTab();
  else if (currentTab === 'finance') renderFinanceTab();
  else if (currentTab === 'members') renderMemberManagementList();
  else if (currentTab === 'tournament') renderTournamentModule();
  else if (currentTab === 'settings') renderSettingsTab();

  // Chuyển kênh đồng bộ đám mây sang CLB mới
  if (typeof subscribeToCloudClub === 'function') {
    subscribeToCloudClub(targetClub.accessSlug || targetClub.id);
  }

  showToast(`✓ Đã chuyển sang Câu Lạc Bộ: ${targetClub.name}`, 'success');
}

function clearClubInputError(el) {
  if (!el) return;
  el.style.removeProperty('border');
  el.style.removeProperty('box-shadow');
  el.style.removeProperty('background-color');
}

function setClubInputError(el) {
  if (!el) return;
  el.style.setProperty('border', '2px solid #f43f5e', 'important');
  el.style.setProperty('box-shadow', '0 0 0 4px rgba(244, 63, 94, 0.25)', 'important');
  el.style.setProperty('background-color', '#fff1f2', 'important');
}

function openCreateClubModal() {
  const modal = document.getElementById('modalCreateNewClub');
  if (!modal) return;

  const modalBody = modal.querySelector('.overflow-y-auto');
  if (modalBody) modalBody.scrollTop = 0;

  const nameInput = document.getElementById('newClubName');
  const shortInput = document.getElementById('newClubShortName');
  const slugInput = document.getElementById('newClubAccessSlug');
  const logoInput = document.getElementById('newClubLogoIcon');
  const themeInput = document.getElementById('newClubThemeColor');
  const adminNameInput = document.getElementById('newClubAdminName');
  const adminPhoneInput = document.getElementById('newClubAdminPhone');
  const adminUserInput = document.getElementById('newClubAdminUsername');
  const adminPassInput = document.getElementById('newClubAdminPassword');
  const fundInput = document.getElementById('newClubInitialFund');
  const bankInput = document.getElementById('newClubBankInfo');

  [nameInput, shortInput, slugInput, adminNameInput, adminUserInput].forEach(clearClubInputError);

  if (nameInput) nameInput.value = '';
  if (shortInput) shortInput.value = '';
  if (slugInput) slugInput.value = '';
  updateNewClubSlugPreview('clb');
  if (logoInput) logoInput.value = '🏸';
  if (themeInput) themeInput.value = 'emerald';
  if (adminNameInput) adminNameInput.value = '';
  if (adminPhoneInput) adminPhoneInput.value = '';
  if (adminUserInput) adminUserInput.value = '';
  if (adminPassInput) adminPassInput.value = '123456';
  if (fundInput) fundInput.value = '0';
  if (bankInput) bankInput.value = '';

  const modeRadios = document.getElementsByName('newClubInitMode');
  for (const r of modeRadios) {
    r.checked = (r.value === 'FRESH');
  }

  selectClubModalIcon('🏸');
  modal.classList.remove('hidden');
}

function selectClubModalIcon(icon) {
  const input = document.getElementById('newClubLogoIcon');
  if (input) input.value = icon;

  document.querySelectorAll('.club-icon-choice').forEach(btn => {
    btn.className = 'club-icon-choice w-9 h-9 rounded-xl border border-slate-200 bg-white text-base flex items-center justify-center hover:bg-slate-50 transition cursor-pointer';
  });

  const activeBtn = document.getElementById(`clubIconBtn-${icon}`);
  if (activeBtn) {
    activeBtn.className = 'club-icon-choice w-9 h-9 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-base flex items-center justify-center transition cursor-pointer shadow-2xs';
  }
}

function getSuggestedClubShortName(fullName) {
  if (!fullName) return '';
  let clean = fullName.replace(/^(clb\s+cầu\s+lông|câu\s+lạc\s+bộ\s+cầu\s+lông|clb|cầu\s+lông)\s*/i, '').trim();
  if (!clean) clean = fullName;
  return clean.toUpperCase();
}

function autoSuggestClubShortName(fullName) {
  const shortInput = document.getElementById('newClubShortName');
  if (!shortInput || !fullName) return;
  shortInput.value = getSuggestedClubShortName(fullName);
}

function autoSuggestClubAdminUsername(name) {
  const userInput = document.getElementById('newClubAdminUsername');
  if (!userInput || !name) return;
  const username = generateAutoUsername(name);
  userInput.value = username;
}

function onNewClubNameChanged(fullName) {
  autoSuggestClubShortName(fullName);
  const slugInput = document.getElementById('newClubAccessSlug');
  if (slugInput) {
    const slug = generateAccessSlug(fullName);
    slugInput.value = slug;
    updateNewClubSlugPreview(slug);
  }
}

function updateNewClubSlugPreview(slug) {
  const preview = document.getElementById('newClubSlugPreview');
  if (!preview) return;
  const cleanSlug = (slug || '').toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
  const baseUrl = window.location.href.split('#')[0].split('?')[0];
  preview.textContent = `${baseUrl}?club=${encodeURIComponent(cleanSlug || 'clb')}`;
}

function handleCreateNewClubSubmit(event) {
  if (event) event.preventDefault();

  const modal = document.getElementById('modalCreateNewClub');
  const modalBody = modal ? modal.querySelector('.overflow-y-auto') : null;

  const nameInput = document.getElementById('newClubName');
  const shortInput = document.getElementById('newClubShortName');
  const slugInput = document.getElementById('newClubAccessSlug');
  const logoInput = document.getElementById('newClubLogoIcon');
  const themeInput = document.getElementById('newClubThemeColor');
  const adminNameInput = document.getElementById('newClubAdminName');
  const adminPhoneInput = document.getElementById('newClubAdminPhone');
  const adminUserInput = document.getElementById('newClubAdminUsername');
  const adminPassInput = document.getElementById('newClubAdminPassword');
  const fundInput = document.getElementById('newClubInitialFund');
  const bankInput = document.getElementById('newClubBankInfo');

  // Reset highlight lỗi trước đó
  [nameInput, shortInput, slugInput, adminNameInput, adminUserInput].forEach(clearClubInputError);

  let name = nameInput?.value.trim() || '';
  let shortName = shortInput?.value.trim() || '';
  let accessSlug = slugInput?.value.trim().toLowerCase() || '';
  const logoIcon = logoInput?.value || '🏸';
  const themeColor = themeInput?.value || 'emerald';
  let adminName = adminNameInput?.value.trim() || '';
  const adminPhone = adminPhoneInput?.value.trim() || '';
  let adminUsername = adminUserInput?.value.trim() || '';
  const adminPassword = adminPassInput?.value.trim() || '123456';
  const initialFund = Number(fundInput?.value) || 0;
  const bankInfo = bankInput?.value.trim() || '';

  // 1. Bắt buộc Tên Câu Lạc Bộ
  if (!name) {
    if (modalBody) modalBody.scrollTo({ top: 0, behavior: 'smooth' });
    if (nameInput) {
      setClubInputError(nameInput);
      nameInput.focus();
    }
    showToast('Vui lòng nhập Tên Câu Lạc Bộ (*)!', 'warning');
    return;
  }

  // 2. Tự động tạo Tên viết tắt nếu chưa nhập
  if (!shortName) {
    shortName = getSuggestedClubShortName(name) || name.toUpperCase();
    if (shortInput) shortInput.value = shortName;
  }

  // 2.5 Tự động tạo Mã link riêng (Access Slug) nếu chưa nhập
  if (!accessSlug) {
    accessSlug = generateAccessSlug(name);
  }
  accessSlug = accessSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!accessSlug) {
    accessSlug = 'clb-' + Date.now();
  }

  // 3. Thông minh hóa: Kiểm tra Họ tên & Username Chủ nhiệm
  if (!adminName && !adminUsername) {
    if (modalBody && adminNameInput) {
      adminNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (adminNameInput) {
      setClubInputError(adminNameInput);
      adminNameInput.focus();
    }
    showToast('Vui lòng nhập Họ tên hoặc Tên đăng nhập Chủ nhiệm (*)!', 'warning');
    return;
  }

  // Nếu người dùng chỉ nhập Username (vd: tntoan) -> Tự động lấy làm Họ tên Chủ nhiệm
  if (!adminName && adminUsername) {
    adminName = adminUsername;
    if (adminNameInput) adminNameInput.value = adminName;
  }

  // Nếu người dùng chỉ nhập Họ tên -> Tự động tạo Username
  if (!adminUsername && adminName) {
    adminUsername = generateAutoUsername(adminName) || 'admin';
    if (adminUserInput) adminUserInput.value = adminUsername;
  }

  const modeRadios = document.getElementsByName('newClubInitMode');
  let initMode = 'FRESH';
  for (const r of modeRadios) {
    if (r.checked) { initMode = r.value; break; }
  }

  const cleanSlug = accessSlug;
  const clubId = 'club_' + cleanSlug;
  const storageKey = 'CLB_CAU_LONG_DATA_' + cleanSlug;

  // Xây dựng tài khoản Chủ nhiệm CLB mới
  const adminMemberId = 'M001';
  const adminChip = adminName.trim().split(/\s+/).pop().toUpperCase();
  const adminMember = {
    id: adminMemberId,
    name: adminName,
    chipName: adminChip,
    phone: adminPhone,
    type: 'OFFICIAL',
    username: adminUsername,
    password: adminPassword,
    balance: 0,
    monthlySessions: 0,
    role: 'ADMIN',
    status: 'ACTIVE',
    permissions: getRoleDefaultPermissions('ADMIN')
  };

  let membersList = [adminMember];
  let transactionsList = [];
  let attendanceList = [];

  if (initMode === 'SAMPLE') {
    adminMember.balance = 500000;
    // 10 Thành viên mẫu chuẩn (Nam, Nữ, Ban Cán Sự, Khách Giao Lưu)
    const sampleMembers = [
      { id: 'M002', name: 'Trần Bảo Ngọc', chipName: 'NGỌC', phone: '0988111002', type: 'OFFICIAL', username: 'ngoc', password: '123', balance: 400000, monthlySessions: 3, role: 'VICE_ADMIN', status: 'ACTIVE', permissions: getRoleDefaultPermissions('VICE_ADMIN') },
      { id: 'M003', name: 'Lê Quốc Huy', chipName: 'HUY', phone: '0988111003', type: 'OFFICIAL', username: 'huy', password: '123', balance: 450000, monthlySessions: 4, role: 'VICE_ADMIN', status: 'ACTIVE', permissions: getRoleDefaultPermissions('VICE_ADMIN') },
      { id: 'M004', name: 'Phạm Thu Thảo', chipName: 'THẢO', phone: '0988111004', type: 'OFFICIAL', username: 'thao', password: '123', balance: 600000, monthlySessions: 5, role: 'TREASURER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('TREASURER') },
      { id: 'M005', name: 'Vũ Minh Đức', chipName: 'ĐỨC', phone: '0988111005', type: 'OFFICIAL', username: 'duc', password: '123', balance: 350000, monthlySessions: 2, role: 'REFEREE', status: 'ACTIVE', permissions: getRoleDefaultPermissions('REFEREE') },
      { id: 'M006', name: 'Đỗ Văn Nam', chipName: 'NAM', phone: '0988111006', type: 'OFFICIAL', username: 'nam', password: '123', balance: 300000, monthlySessions: 2, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
      { id: 'M007', name: 'Hoàng Yến Nhi', chipName: 'NHI', phone: '0988111007', type: 'OFFICIAL', username: 'nhi', password: '123', balance: 500000, monthlySessions: 4, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
      { id: 'M008', name: 'Bùi Anh Tuấn', chipName: 'TUẤN', phone: '0988111008', type: 'HONORARY', username: 'tuan', password: '123', balance: 250000, monthlySessions: 2, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
      { id: 'G001', name: 'Khách Giao Lưu 1', chipName: 'K1', phone: '', type: 'GUEST_A', level: 'A', fee: 90000, username: 'guest1', password: '123', balance: 0, monthlySessions: 1, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') },
      { id: 'G002', name: 'Khách Giao Lưu 2', chipName: 'K2', phone: '', type: 'GUEST_B', level: 'B', fee: 70000, username: 'guest2', password: '123', balance: 0, monthlySessions: 1, role: 'MEMBER', status: 'ACTIVE', permissions: getRoleDefaultPermissions('MEMBER') }
    ];
    membersList = membersList.concat(sampleMembers);

    transactionsList = [
      {
        id: 'TX_INIT_1',
        date: getNowTimestampString(),
        categoryGroup: 'INCOME_A',
        subType: 'MEM_FUND',
        categoryName: 'Quỹ thành viên',
        amount: initialFund,
        targetName: 'Quỹ thành lập CLB',
        walletImpact: 0,
        fundImpact: initialFund,
        description: `Thu quỹ ban đầu khi thành lập ${name}`,
        operator: adminUsername
      },
      {
        id: 'TX_INIT_2',
        date: getNowTimestampString(),
        categoryGroup: 'WALLET_TOPUP',
        subType: 'TOPUP',
        categoryName: 'Nạp ví',
        amount: 500000,
        targetName: adminName,
        memberId: adminMemberId,
        walletImpact: 500000,
        fundImpact: 0,
        description: 'Nạp tiền ví thành viên Chủ nhiệm sáng lập',
        operator: adminUsername
      }
    ];
  } else {
    // FRESH mode: Bắt đầu hoàn toàn mới, 0 dummy data, chỉ có duy nhất tài khoản Chủ nhiệm
    adminMember.balance = 0;
    if (initialFund > 0) {
      transactionsList.push({
        id: 'TX_INIT_1',
        date: getNowTimestampString(),
        categoryGroup: 'INCOME_A',
        subType: 'MEM_FUND',
        categoryName: 'Quỹ thành viên',
        amount: initialFund,
        targetName: 'Quỹ thành lập CLB',
        walletImpact: 0,
        fundImpact: initialFund,
        description: `Thu quỹ ban đầu khi thành lập ${name}`,
        operator: adminUsername
      });
    }
  }

  // Khởi tạo đối tượng AppState cho CLB mới
  const newClubAppState = {
    config: {
      clubName: name,
      accessSlug: accessSlug,
      themeColor: themeColor,
      bankInfo: bankInfo || `NGAN HANG - 0123456789 - ${shortName}`,
      leadership: {
        president: adminMemberId,
        vicePresident1: initMode === 'SAMPLE' ? 'M002' : '',
        vicePresident2: initMode === 'SAMPLE' ? 'M003' : '',
        secretary: initMode === 'SAMPLE' ? 'M005' : '',
        treasurer: initMode === 'SAMPLE' ? 'M004' : '',
        media: initMode === 'SAMPLE' ? 'M007' : '',
        advisor1: '',
        advisor2: ''
      },
      dailyBoxPrice: 340000,
      shuttlecocksPerBox: 12,
      dailyRateTitle: 'ĐƠN GIÁ THEO NGÀY 12',
      shuttleBillingMode: 'BY_SHUTTLE',
      shuttleUnitPrice: 28333,
      defaultShuttlesPerSession: 6,
      viceLeaderId: initMode === 'SAMPLE' ? 'M002' : '',
      permissions: {
        allowViceLeaderAttendance: true,
        allowViceLeaderTournamentSync: true
      },
      guestPrices: {
        GUEST_A: 90000,
        GUEST_B: 70000,
        GUEST_C: 50000
      },
      feeTiers: [
        { id: 1, name: 'Bậc 1 (0–4 buổi)', minSessions: 0, maxSessions: 4, price: 50000 },
        { id: 2, name: 'Bậc 2 (5–9 buổi)', minSessions: 5, maxSessions: 9, price: 100000 },
        { id: 3, name: 'Bậc 3 (10–15 buổi)', minSessions: 10, maxSessions: 15, price: 150000 },
        { id: 4, name: 'Bậc 4 (16–30+ buổi)', minSessions: 16, maxSessions: 999, price: 200000 }
      ],
      allowNegativeWallet: true,
      settlementMode: 'MONTHLY',
      defaultSettlementDay: 'END_OF_MONTH'
    },
    funds: {
      clubFund: initialFund,
      advanceFund: 0,
      shuttleAdvanceFund: 0,
      courtAdvanceFund: 0,
      guestAdvanceIncome: 0,
      shuttlePaidTotal: 0,
      courtPaidTotal: 0
    },
    members: membersList,
    attendanceRecords: attendanceList,
    transactions: transactionsList,
    auth: {
      isLoggedIn: true,
      user: {
        id: adminMemberId,
        username: adminUsername,
        role: 'ADMIN',
        name: `${adminName} (Chủ nhiệm)`,
        permissions: getRoleDefaultPermissions('ADMIN')
      }
    }
  };

  // 1. Lưu lại CLB hiện tại đang chạy (tránh mất dữ liệu của CLB cũ)
  if (STORAGE_KEY && STORAGE_KEY !== storageKey && AppState && Object.keys(AppState).length > 0) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
    } catch (e) {}
  }

  // 2. Lưu dữ liệu CLB mới vào localStorage riêng theo key chuẩn định danh
  localStorage.setItem(storageKey, JSON.stringify(newClubAppState));

  // 3. Thêm hoặc cập nhật danh bạ CLB (Registry) không trùng lặp
  const newClubRecord = {
    id: clubId,
    accessSlug: cleanSlug,
    name: name,
    shortName: shortName,
    logoIcon: logoIcon,
    themeColor: themeColor,
    bankInfo: bankInfo,
    createdAt: getFormattedCurrentDate(),
    storageKey: storageKey,
    adminName: adminName,
    adminUsername: adminUsername,
    phone: adminPhone,
    isDeveloperSample: false
  };

  const registry = getClubsRegistry();
  const existingIdx = registry.findIndex(c => (c.accessSlug && c.accessSlug.toLowerCase() === cleanSlug) || c.id === clubId);
  if (existingIdx >= 0) {
    registry[existingIdx] = newClubRecord;
  } else {
    registry.push(newClubRecord);
  }
  saveClubsRegistry(registry);

  // 4. Tự động ẩn CLB demo của nhà phát triển để giao diện người dùng hoàn toàn sạch sẽ
  localStorage.setItem('CLB_HIDE_DEV_DEMO', 'true');

  // 5. Kích hoạt trực tiếp CLB mới vào bộ nhớ mà không qua switchActiveClub để loại trừ hoàn toàn nguy cơ race-condition
  setActiveClubId(clubId);
  STORAGE_KEY = storageKey;
  AppState = newClubAppState;
  updateClubUrlParam(cleanSlug);

  // 6. Xóa và làm mới phiên điểm danh cho CLB mới
  clearActivitySessionState();
  initActivitySessionData(true);

  // 7. Đồng bộ Theme màu & Header
  applyThemeColor(themeColor);
  const nameEl = document.getElementById('headerClubName');
  if (nameEl) nameEl.textContent = name;
  const iconEl = document.getElementById('headerClubIconSpan');
  if (iconEl) iconEl.textContent = logoIcon;

  // 8. Đóng Modal
  closeModal('modalCreateNewClub');

  // 9. Render lại toàn bộ giao diện của phân hệ đang mở
  renderClubSwitcher();
  renderDashboard();
  populateLeadershipSelects();

  if (currentTab === 'attendance') renderAttendanceTab();
  else if (currentTab === 'finance') renderFinanceTab();
  else if (currentTab === 'members') renderMemberManagementList();
  else if (currentTab === 'tournament') renderTournamentModule();
  else if (currentTab === 'settings') renderSettingsTab();

  showToast(`🎉 Chúc mừng! Câu Lạc Bộ ${name} đã được khởi tạo thành công! Link riêng: ?club=${cleanSlug}`, 'success');
}

function deleteClub(clubId) {
  const registry = getClubsRegistry();
  if (registry.length <= 1) {
    showToast('Hệ thống cần tối thiểu 1 Câu Lạc Bộ hoạt động!', 'error');
    return;
  }

  const club = registry.find(c => c.id === clubId);
  if (!club) return;

  if (!confirm(`Bạn có chắc chắn muốn xóa Câu Lạc Bộ "${club.name}"?\nToàn bộ dữ liệu quỹ, điểm danh và thành viên của CLB này sẽ bị xóa khỏi máy tính.`)) {
    return;
  }

  localStorage.removeItem(club.storageKey);

  const updated = registry.filter(c => c.id !== clubId);
  saveClubsRegistry(updated);

  if (getActiveClubId() === clubId) {
    const nextClub = updated[0];
    switchActiveClub(nextClub.id);
  } else {
    renderClubSwitcher();
    renderMultiClubSettingsSection();
  }

  showToast(`Đã xóa Câu Lạc Bộ: ${club.name}`, 'info');
}

function toggleHideDeveloperDemoClubs() {
  const isHidden = localStorage.getItem('CLB_HIDE_DEV_DEMO') === 'true';
  const newHidden = !isHidden;
  localStorage.setItem('CLB_HIDE_DEV_DEMO', newHidden ? 'true' : 'false');

  updateDevDemoToggleUI();
  renderClubSwitcher();
  renderMultiClubSettingsSection();

  if (newHidden) {
    showToast('Đã ẩn các CLB dữ liệu mẫu của nhà phát triển (SMASH & Tia Chớp)', 'info');
    const activeId = getActiveClubId();
    if (activeId === 'club_smash' || activeId === 'club_lightning') {
      const registry = getClubsRegistry();
      const userClub = registry.find(c => !c.isDeveloperSample && c.id !== 'club_smash' && c.id !== 'club_lightning');
      if (userClub) {
        switchActiveClub(userClub.id);
      }
    }
  } else {
    showToast('Đã hiển thị các CLB dữ liệu mẫu của nhà phát triển', 'info');
  }
}

function updateDevDemoToggleUI() {
  const isHidden = localStorage.getItem('CLB_HIDE_DEV_DEMO') === 'true';
  const iconEl = document.getElementById('iconToggleHideDevDemo');
  const textEl = document.getElementById('textToggleHideDevDemo');
  const btnEl = document.getElementById('btnToggleHideDevDemo');
  if (!btnEl) return;

  if (isHidden) {
    if (iconEl) iconEl.textContent = '👁️‍🗨️';
    if (textEl) textEl.textContent = 'Hiện CLB mẫu Dev';
    btnEl.className = 'px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer';
  } else {
    if (iconEl) iconEl.textContent = '👁️';
    if (textEl) textEl.textContent = 'Ẩn CLB mẫu Dev';
    btnEl.className = 'px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer';
  }
}

function renderMultiClubSettingsSection() {
  const container = document.getElementById('multiClubListContainer');
  const countEl = document.getElementById('multiClubSummaryCount');
  if (!container) return;

  updateDevDemoToggleUI();

  const registry = getClubsRegistry();
  const activeId = getActiveClubId();
  const isHideDemo = localStorage.getItem('CLB_HIDE_DEV_DEMO') === 'true';
  const visibleClubs = isHideDemo
    ? registry.filter(c => !c.isDeveloperSample && c.id !== 'club_smash' && c.id !== 'club_lightning')
    : registry;
  const listToRender = visibleClubs.length > 0 ? visibleClubs : registry;

  if (countEl) {
    countEl.textContent = `${listToRender.length} Câu Lạc Bộ` + (isHideDemo && registry.length > listToRender.length ? ` (Đã ẩn ${registry.length - listToRender.length} CLB mẫu Dev)` : '');
  }

  container.innerHTML = listToRender.map(club => {
    const isActive = club.id === activeId;
    
    let clubFund = 0;
    let memberCount = 0;
    try {
      const raw = localStorage.getItem(club.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        clubFund = parsed.funds?.clubFund || 0;
        memberCount = parsed.members?.length || 0;
      }
    } catch (e) {}

    const directSlug = club.accessSlug || club.shortName?.toLowerCase() || club.id;

    return `
      <div class="p-4 rounded-2xl border ${isActive ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'} flex flex-col justify-between transition space-y-3">
        
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl ${isActive ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md' : 'bg-slate-100 text-slate-800 border border-slate-200'} flex items-center justify-center text-2xl font-bold shadow-xs shrink-0">
              ${club.logoIcon || '🏸'}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-extrabold text-sm text-slate-900 leading-tight">${club.name}</h3>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  ${club.shortName || 'CLB'}
                </span>
                ${club.isDeveloperSample ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Mẫu Dev</span>' : ''}
              </div>
              <p class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <span>👑 Chủ nhiệm: <strong class="text-slate-700">${club.adminName || 'Admin'}</strong></span>
                ${club.phone ? `<span>• 📞 ${club.phone}</span>` : ''}
              </p>
            </div>
          </div>

          <div>
            ${isActive ? `
              <span class="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                <span>✓</span>
                <span>Đang chọn</span>
              </span>
            ` : `
              <button type="button" onclick="switchActiveClub('${club.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white font-bold text-xs rounded-xl border border-slate-200 hover:border-emerald-600 transition flex items-center gap-1 cursor-pointer">
                <span>👉</span>
                <span>Chuyển CLB</span>
              </button>
            `}
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-2 gap-2 pt-2 border-t ${isActive ? 'border-emerald-200/80' : 'border-slate-100'} text-xs">
          <div class="bg-white/80 p-2.5 rounded-xl border border-slate-200/70">
            <span class="text-[11px] text-slate-500 block">💰 Quỹ CLB:</span>
            <span class="font-extrabold text-emerald-700 text-xs">${formatMoney(clubFund)}</span>
          </div>
          <div class="bg-white/80 p-2.5 rounded-xl border border-slate-200/70">
            <span class="text-[11px] text-slate-500 block">👥 Thành viên:</span>
            <span class="font-extrabold text-slate-800 text-xs">${memberCount} người</span>
          </div>
        </div>

        <!-- Khối Link Riêng & Phím Tắt Màn Hình Chính -->
        <div class="pt-2.5 border-t ${isActive ? 'border-emerald-200/80' : 'border-slate-100'} space-y-2 text-xs">
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-extrabold text-slate-700 flex items-center gap-1.5">
              <span>🔗</span>
              <span>Link sử dụng riêng:</span>
            </span>
            <span class="font-mono text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md font-extrabold border border-emerald-300">
              ?club=${directSlug}
            </span>
          </div>

          <div class="flex items-center gap-1.5">
            <div class="relative flex-1">
              <input type="text" readonly value="${getClubDirectUrl(club.id)}" onclick="this.select()" class="w-full pl-2.5 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-700 truncate select-all focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs" title="Đường dẫn truy cập trực tiếp CLB này" />
              <button type="button" onclick="copyClubDirectLink('${club.id}')" class="absolute right-1 top-1 bottom-1 px-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer" title="Sao chép liên kết này">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <button type="button" onclick="openClubDirectLink('${club.id}')" class="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition cursor-pointer shrink-0 shadow-2xs" title="Mở link trong tab mới">
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- 2 Phím tắt nhanh: Desktop & Điện thoại -->
          <div class="grid grid-cols-2 gap-2 pt-0.5">
            <button type="button" onclick="downloadClubDesktopShortcut('${club.id}')" class="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-extrabold text-[11px] rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs" title="Tải file .url về máy tính và kéo ra màn hình Desktop">
              <span>💻</span>
              <span>Lối Tắt Desktop</span>
            </button>

            <button type="button" onclick="openClubShortcutGuideModal('${club.id}')" class="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-extrabold text-[11px] rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs" title="Hướng dẫn tạo phím tắt màn hình chính iOS/Android & mã QR">
              <span>📱</span>
              <span>Lối Tắt MH Chính / QR</span>
            </button>
          </div>
        </div>

        <!-- Details & Actions -->
        <div class="flex items-center justify-between pt-1 text-[11px] text-slate-500">
          <span class="truncate max-w-[200px]" title="${club.bankInfo || ''}">
            🏦 ${club.bankInfo || 'Chưa thiết lập VietQR'}
          </span>
          <div class="flex items-center gap-1.5">
            ${registry.length > 1 ? `
              <button type="button" onclick="deleteClub('${club.id}')" class="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer" title="Xóa Câu Lạc Bộ này">
                <i data-lucide="trash-2" class="w-3.5 h-3.5 inline"></i>
              </button>
            ` : ''}
          </div>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// ==========================================
// TIỆN ÍCH LINK RIÊNG & TẠO PHÍM TẮT MÀN HÌNH CHÍNH (SHORTCUT & DEEP LINKS)
// ==========================================

let currentModalShortcutClubId = null;

function copyClubDirectLink(clubId) {
  const targetId = clubId || getActiveClubId();
  const registry = getClubsRegistry();
  const club = registry.find(c => c.id === targetId);
  const directUrl = getClubDirectUrl(targetId);

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(directUrl).then(() => {
      showToast(`✓ Đã sao chép link riêng CLB: ${club?.name || targetId}!`, 'success');
    }).catch(() => {
      fallbackCopyText(directUrl, club?.name);
    });
  } else {
    fallbackCopyText(directUrl, club?.name);
  }
}

function fallbackCopyText(text, clubName) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`✓ Đã sao chép link riêng CLB: ${clubName || ''}!`, 'success');
  } catch (err) {
    prompt('Sao chép đường dẫn này:', text);
  }
  document.body.removeChild(textArea);
}

function openClubDirectLink(clubId) {
  const targetId = clubId || getActiveClubId();
  const directUrl = getClubDirectUrl(targetId);
  window.open(directUrl, '_blank');
}

function downloadClubDesktopShortcut(clubId) {
  const targetId = clubId || getActiveClubId();
  const registry = getClubsRegistry();
  const club = registry.find(c => c.id === targetId) || getActiveClub();
  if (!club) return;

  const directUrl = getClubDirectUrl(targetId);
  
  // Chuẩn định dạng file .url của Windows Internet Shortcut
  const shortcutContent = `[InternetShortcut]\r\nURL=${directUrl}\r\nIconIndex=0\r\nHotKey=0\r\n[{000214A0-0000-0000-C000-000000000046}]\r\nProp3=19,0\r\n`;
  
  const blob = new Blob([shortcutContent], { type: 'application/internet-shortcut;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  
  const safeName = (club.name || 'CLB_Cau_Long').replace(/[/\\?%*:|"<>]/g, '_');
  a.download = `${safeName}.url`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);

  showToast(`🎉 Đã tải file lối tắt Desktop cho "${club.name}"! Kéo file này ra màn hình chính để dùng ngay.`, 'success');
}

function openClubShortcutGuideModal(clubId) {
  const targetId = clubId || getActiveClubId();
  const registry = getClubsRegistry();
  const club = registry.find(c => c.id === targetId) || getActiveClub();
  if (!club) return;

  currentModalShortcutClubId = club.id;

  const modal = document.getElementById('modalClubShortcutGuide');
  if (!modal) return;

  const nameEl = document.getElementById('shortcutModalClubName');
  const badgeEl = document.getElementById('shortcutModalClubBadge');
  const iconEl = document.getElementById('shortcutModalClubIcon');
  const urlInput = document.getElementById('shortcutModalUrlInput');
  const qrImg = document.getElementById('shortcutModalQrImg');

  const directUrl = getClubDirectUrl(club.id);

  if (nameEl) nameEl.textContent = club.name;
  if (badgeEl) badgeEl.textContent = club.shortName || 'CLB';
  if (iconEl) iconEl.textContent = club.logoIcon || '🏸';
  if (urlInput) urlInput.value = directUrl;

  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(directUrl)}`;
  }

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function copyModalClubDirectLink() {
  if (currentModalShortcutClubId) {
    copyClubDirectLink(currentModalShortcutClubId);
  }
}

function openModalClubDirectLink() {
  if (currentModalShortcutClubId) {
    openClubDirectLink(currentModalShortcutClubId);
  }
}

function downloadModalClubDesktopShortcut() {
  if (currentModalShortcutClubId) {
    downloadClubDesktopShortcut(currentModalShortcutClubId);
  }
}

// ==========================================
// 16. HỆ THỐNG QUẢN LÝ GIẢI ĐẤU CẦU LÔNG CHUYÊN NGHIỆP (TOURNAMENT ENGINE)
// DỮ LIỆU HOẠT ĐỘNG HOÀN TOÀN ĐỘC LẬP VỚI CÁC HOẠT ĐỘNG NGÀY THƯỜNG CỦA CLB
// CẤU TRÚC 16 NODES: Tournament -> Organization -> Country -> Club -> Player -> Registration
//                   -> Discipline -> Pair -> Seed -> Draw -> Group -> Match -> Game
//                   -> Schedule -> Court -> Ranking -> Award
// ==========================================

const TOURNAMENT_STORAGE_KEY = 'CLB_CAU_LONG_TOURNAMENT_DATA';

const TournamentState = {
  tournaments: [],
  activeTournamentId: null,
  activeSubtab: 'bracket',
  activeDisciplineId: 'MD',
  filters: {
    scope: 'ALL',
    country: 'ALL',
    club: 'ALL'
  }
};

/**
 * Danh mục chuẩn Quốc gia và CLB tham dự giải
 */
const TOURNAMENT_COUNTRIES = [
  { id: 'VN', name: 'Việt Nam', flag: '🇻🇳' },
  { id: 'JP', name: 'Nhật Bản', flag: '🇯🇵' },
  { id: 'KR', name: 'Hàn Quốc', flag: '🇰🇷' },
  { id: 'TH', name: 'Thái Lan', flag: '🇹🇭' }
];

const TOURNAMENT_DATA_VERSION = '2026.8_GENDER_ROSTER';

const TOURNAMENT_CLUBS = [
  { id: 'CLB_A', name: 'CLB A', country: 'VN', participating: true, contact: 'Nguyễn Văn A1 (Trưởng đoàn - 0988.111.001)' },
  { id: 'CLB_B', name: 'CLB B', country: 'VN', participating: true, contact: 'Đặng Văn B1 (Đội trưởng - 0912.222.001)' },
  { id: 'CLB_C', name: 'CLB C', country: 'VN', participating: true, contact: 'Dương Văn C1 (Liên lạc - 0903.333.001)' },
  { id: 'CLB_D', name: 'CLB D', country: 'VN', participating: true, contact: 'Hồ Văn D1 (Chủ nhiệm - 0977.444.001)' },
  { id: 'CLB_E', name: 'CLB E', country: 'VN', participating: true, contact: 'Trịnh Thị E1 (Đại diện - 0966.555.001)' }
];

const TOURNAMENT_SCOPES = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'INTERNAL', label: '🏠 Nội bộ' },
  { id: 'MULTI_CLUB', label: '🤝 Liên CLB' },
  { id: 'OPEN', label: '🌟 Mở rộng' },
  { id: 'FRIENDLY', label: '🏸 Giao lưu' },
  { id: 'NATIONAL', label: '🇻🇳 Quốc gia' },
  { id: 'INTERNATIONAL', label: '🌐 Quốc tế' }
];

const RANKING_CRITERIA_DEFINITIONS = [
  { id: 'WINS', name: 'Số trận thắng (Wins)', desc: 'Đội có tổng số trận thắng nhiều hơn xếp trên' },
  { id: 'HEAD_TO_HEAD', name: 'Thành tích đối đầu (Head-to-Head)', desc: 'Xét kết quả trực tiếp khi 2 đội bằng số trận thắng' },
  { id: 'GAME_DIFF', name: 'Hiệu số game / set (Game Diff)', desc: 'Tổng game thắng trừ tổng game thua (Sets won - Sets lost)' },
  { id: 'POINT_DIFF', name: 'Hiệu số điểm (Point Diff)', desc: 'Tổng điểm ghi được trừ tổng điểm bị mất (Points won - Points lost)' },
  { id: 'POINTS_SCORED', name: 'Điểm ghi được (Points Scored)', desc: 'Tổng số điểm thực tế đã ghi được trong các trận' },
  { id: 'FAIR_PLAY', name: 'Tiêu chí phụ BTC (Fair-Play / Bốc thăm)', desc: 'Xét kỷ luật hoặc bốc thăm chỉ định của Ban tổ chức' }
];

/**
 * Khởi tạo dữ liệu mẫu giải đấu chuẩn 5 CLB & 18 Thành viên (CLB A..E, VĐV A1..E2)
 */
function createDefaultTournamentData() {
  return [
    {
      id: 'TOUR_LIEN_CLB_2026',
      dataVersion: TOURNAMENT_DATA_VERSION,
      title: 'Giải Cầu Lông',
      scope: 'MULTI_CLUB',
      type: 'TOURNAMENT',
      date: '2026-09-23',
      location: 'Cụm Sân Cầu Lông Smash Arena - 5 Sân Thảm Tiêu Chuẩn',
      courtsCount: 3,
      minRestMinutes: 25,
      status: 'IN_PROGRESS',
      matchRules: {
        setsMode: 1,           // 1 set hoặc 3 set
        pointsToWin: 31,       // 31 điểm chạm
        maxPointsCap: 31,      // 31 điểm chạm tối đa (Sudden Death)
        ruleType: 'SUDDEN_DEATH'
      },
      organization: {
        organizer: 'Ban Tổ Chức Giải Liên CLB A - B - C - D - E',
        leadReferee: 'Tổ Trọng Tài Điều Hành Liên CLB',
        rules: 'Luật thi đấu Cầu Lông Phong Trào (1 Set chạm 31 điểm / 3 Set 21 điểm)'
      },
      countries: JSON.parse(JSON.stringify(TOURNAMENT_COUNTRIES)),
      clubs: JSON.parse(JSON.stringify(TOURNAMENT_CLUBS)),
      players: [
        // CLB A: 6 thành viên chính + 2 thành viên dự bị đôi (Toàn bộ VĐV Nam)
        { id: 'A1', name: 'Nguyễn Văn A1', chipName: 'A1', clubId: 'CLB_A', countryId: 'VN', level: 'A+', phone: '0988.111.001', gender: 'MALE' },
        { id: 'A2', name: 'Trần Văn A2', chipName: 'A2', clubId: 'CLB_A', countryId: 'VN', level: 'A', phone: '0988.111.002', gender: 'MALE' },
        { id: 'A3', name: 'Lê Văn A3', chipName: 'A3', clubId: 'CLB_A', countryId: 'VN', level: 'A', phone: '0988.111.003', gender: 'MALE' },
        { id: 'A4', name: 'Phạm Văn A4', chipName: 'A4', clubId: 'CLB_A', countryId: 'VN', level: 'B+', phone: '0988.111.004', gender: 'MALE' },
        { id: 'A5', name: 'Vũ Văn A5', chipName: 'A5', clubId: 'CLB_A', countryId: 'VN', level: 'B', phone: '0988.111.005', gender: 'MALE' },
        { id: 'A6', name: 'Hoàng Văn A6', chipName: 'A6', clubId: 'CLB_A', countryId: 'VN', level: 'B', phone: '0988.111.006', gender: 'MALE' },
        { id: 'A7', name: 'Đoàn Văn A7', chipName: 'A7', clubId: 'CLB_A', countryId: 'VN', level: 'B+', phone: '0988.111.007', gender: 'MALE' },
        { id: 'A8', name: 'Bùi Văn A8', chipName: 'A8', clubId: 'CLB_A', countryId: 'VN', level: 'B', phone: '0988.111.008', gender: 'MALE' },
        // CLB B: 4 thành viên chính + 2 thành viên dự bị đôi (Toàn bộ VĐV Nam)
        { id: 'B1', name: 'Đặng Văn B1', chipName: 'B1', clubId: 'CLB_B', countryId: 'VN', level: 'A+', phone: '0912.222.001', gender: 'MALE' },
        { id: 'B2', name: 'Bùi Văn B2', chipName: 'B2', clubId: 'CLB_B', countryId: 'VN', level: 'A', phone: '0912.222.002', gender: 'MALE' },
        { id: 'B3', name: 'Đỗ Văn B3', chipName: 'B3', clubId: 'CLB_B', countryId: 'VN', level: 'B+', phone: '0912.222.003', gender: 'MALE' },
        { id: 'B4', name: 'Ngô Văn B4', chipName: 'B4', clubId: 'CLB_B', countryId: 'VN', level: 'B', phone: '0912.222.004', gender: 'MALE' },
        { id: 'B5', name: 'Trương Văn B5', chipName: 'B5', clubId: 'CLB_B', countryId: 'VN', level: 'A', phone: '0912.222.005', gender: 'MALE' },
        { id: 'B6', name: 'Lâm Văn B6', chipName: 'B6', clubId: 'CLB_B', countryId: 'VN', level: 'B+', phone: '0912.222.006', gender: 'MALE' },
        // CLB C: 2 thành viên Nam (C1, C2)
        { id: 'C1', name: 'Dương Văn C1', chipName: 'C1', clubId: 'CLB_C', countryId: 'VN', level: 'A', phone: '0903.333.001', gender: 'MALE' },
        { id: 'C2', name: 'Phan Văn C2', chipName: 'C2', clubId: 'CLB_C', countryId: 'VN', level: 'B+', phone: '0903.333.002', gender: 'MALE' },
        // CLB D: 4 thành viên chính + 2 thành viên dự bị đôi (Toàn bộ VĐV Nam)
        { id: 'D1', name: 'Hồ Văn D1', chipName: 'D1', clubId: 'CLB_D', countryId: 'VN', level: 'A', phone: '0977.444.001', gender: 'MALE' },
        { id: 'D2', name: 'Võ Văn D2', chipName: 'D2', clubId: 'CLB_D', countryId: 'VN', level: 'B+', phone: '0977.444.002', gender: 'MALE' },
        { id: 'D3', name: 'Mai Văn D3', chipName: 'D3', clubId: 'CLB_D', countryId: 'VN', level: 'B', phone: '0977.444.003', gender: 'MALE' },
        { id: 'D4', name: 'Lý Văn D4', chipName: 'D4', clubId: 'CLB_D', countryId: 'VN', level: 'B', phone: '0977.444.004', gender: 'MALE' },
        { id: 'D5', name: 'Tạ Văn D5', chipName: 'D5', clubId: 'CLB_D', countryId: 'VN', level: 'A', phone: '0977.444.005', gender: 'MALE' },
        { id: 'D6', name: 'Chu Văn D6', chipName: 'D6', clubId: 'CLB_D', countryId: 'VN', level: 'B+', phone: '0977.444.006', gender: 'MALE' },
        // CLB E: 2 thành viên Nữ (E1, E2)
        { id: 'E1', name: 'Trịnh Thị E1', chipName: 'E1', clubId: 'CLB_E', countryId: 'VN', level: 'A', phone: '0966.555.001', gender: 'FEMALE' },
        { id: 'E2', name: 'Lưu Thị E2', chipName: 'E2', clubId: 'CLB_E', countryId: 'VN', level: 'B+', phone: '0966.555.002', gender: 'FEMALE' }
      ],
      registrations: [
        { id: 'REG_01', playerId: 'A1', clubId: 'CLB_A', disciplines: ['MD', 'MS', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_02', playerId: 'A2', clubId: 'CLB_A', disciplines: ['MD', 'MS', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_03', playerId: 'A3', clubId: 'CLB_A', disciplines: ['MD', 'MS', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_04', playerId: 'A4', clubId: 'CLB_A', disciplines: ['MD', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_05', playerId: 'A5', clubId: 'CLB_A', disciplines: ['MD'], status: 'CONFIRMED' },
        { id: 'REG_06', playerId: 'A6', clubId: 'CLB_A', disciplines: ['MD', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_07', playerId: 'B1', clubId: 'CLB_B', disciplines: ['MD', 'MS', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_08', playerId: 'B2', clubId: 'CLB_B', disciplines: ['MD', 'MS', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_09', playerId: 'B3', clubId: 'CLB_B', disciplines: ['MD', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_10', playerId: 'B4', clubId: 'CLB_B', disciplines: ['MD'], status: 'CONFIRMED' },
        { id: 'REG_11', playerId: 'C1', clubId: 'CLB_C', disciplines: ['MD', 'MS', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_12', playerId: 'C2', clubId: 'CLB_C', disciplines: ['MD', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_13', playerId: 'D1', clubId: 'CLB_D', disciplines: ['MD', 'MS', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_14', playerId: 'D2', clubId: 'CLB_D', disciplines: ['MD', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_15', playerId: 'D3', clubId: 'CLB_D', disciplines: ['MD', 'MS'], status: 'CONFIRMED' },
        { id: 'REG_16', playerId: 'D4', clubId: 'CLB_D', disciplines: ['MD', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_17', playerId: 'E1', clubId: 'CLB_E', disciplines: ['MD', 'MS', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_18', playerId: 'E2', clubId: 'CLB_E', disciplines: ['MD', 'XD'], status: 'CONFIRMED' },
        { id: 'REG_19', playerId: 'A7', clubId: 'CLB_A', disciplines: ['MD'], status: 'CONFIRMED' },
        { id: 'REG_20', playerId: 'A8', clubId: 'CLB_A', disciplines: ['MD'], status: 'CONFIRMED' },
        { id: 'REG_21', playerId: 'B5', clubId: 'CLB_B', disciplines: ['MD'], status: 'CONFIRMED' },
        { id: 'REG_22', playerId: 'B6', clubId: 'CLB_B', disciplines: ['MD'], status: 'CONFIRMED' },
        { id: 'REG_23', playerId: 'D5', clubId: 'CLB_D', disciplines: ['MD'], status: 'CONFIRMED' },
        { id: 'REG_24', playerId: 'D6', clubId: 'CLB_D', disciplines: ['MD'], status: 'CONFIRMED' }
      ],
      rankingCriteria: ['WINS', 'HEAD_TO_HEAD', 'GAME_DIFF', 'POINT_DIFF', 'POINTS_SCORED', 'FAIR_PLAY'],
      prizes: {
        prize1: '🏆 Cúp Vô Địch + Cờ Lưu Niệm + 2.000.000đ',
        prize2: '🥈 Cờ Á Quân + 1.200.000đ',
        prize3: '🥉 Cờ Hạng Ba + 600.000đ',
        prizeFairPlay: '🎖️ Giải Phong Cách / Cống Hiến Liên CLB'
      },
      disciplines: [
        // ================== NỘI DUNG 1: ĐÔI NAM (4 BẢNG A, B, C, D + PLAYOFF) ==================
        {
          id: 'MD',
          name: 'Đôi Nam (Men\'s Doubles)',
          type: 'DOUBLES',
          format: 'GROUP_4_KNOCKOUT',
          seedsCount: 4,
          pairs: [
            { id: 'P_MD_1', name: 'A1 & A2 (CLB A)', chipName: 'A1 & A2', club: 'CLB A', country: 'VN', seed: 1, playerIds: ['A1', 'A2'] },
            { id: 'P_MD_2', name: 'B1 & B2 (CLB B)', chipName: 'B1 & B2', club: 'CLB B', country: 'VN', seed: 0, playerIds: ['B1', 'B2'] },
            { id: 'P_MD_3', name: 'C1 & C2 (CLB C)', chipName: 'C1 & C2', club: 'CLB C', country: 'VN', seed: 0, playerIds: ['C1', 'C2'] },
            { id: 'P_MD_4', name: 'A3 & A4 (CLB A)', chipName: 'A3 & A4', club: 'CLB A', country: 'VN', seed: 2, playerIds: ['A3', 'A4'] },
            { id: 'P_MD_5', name: 'D1 & D2 (CLB D)', chipName: 'D1 & D2', club: 'CLB D', country: 'VN', seed: 0, playerIds: ['D1', 'D2'] },
            { id: 'P_MD_6', name: 'B3 & B4 (CLB B)', chipName: 'B3 & B4', club: 'CLB B', country: 'VN', seed: 0, playerIds: ['B3', 'B4'] },
            { id: 'P_MD_7', name: 'A5 & A6 (CLB A)', chipName: 'A5 & A6', club: 'CLB A', country: 'VN', seed: 3, playerIds: ['A5', 'A6'] },
            { id: 'P_MD_8', name: 'D3 & D4 (CLB D)', chipName: 'D3 & D4', club: 'CLB D', country: 'VN', seed: 0, playerIds: ['D3', 'D4'] },
            { id: 'P_MD_9', name: 'E1 & E2 (CLB E)', chipName: 'E1 & E2', club: 'CLB E', country: 'VN', seed: 0, playerIds: ['E1', 'E2'] },
            { id: 'P_MD_10', name: 'B5 & B6 (CLB B)', chipName: 'B5 & B6', club: 'CLB B', country: 'VN', seed: 4, playerIds: ['B5', 'B6'] },
            { id: 'P_MD_11', name: 'D5 & D6 (CLB D)', chipName: 'D5 & D6', club: 'CLB D', country: 'VN', seed: 0, playerIds: ['D5', 'D6'] },
            { id: 'P_MD_12', name: 'A7 & A8 (CLB A)', chipName: 'A7 & A8', club: 'CLB A', country: 'VN', seed: 0, playerIds: ['A7', 'A8'] }
          ],
          groups: [
            { id: 'A', name: 'BẢNG A (ĐÔI NAM)', pairIds: ['P_MD_1', 'P_MD_2', 'P_MD_3'] },
            { id: 'B', name: 'BẢNG B (ĐÔI NAM)', pairIds: ['P_MD_4', 'P_MD_5', 'P_MD_6'] },
            { id: 'C', name: 'BẢNG C (ĐÔI NAM)', pairIds: ['P_MD_7', 'P_MD_8', 'P_MD_9'] },
            { id: 'D', name: 'BẢNG D (ĐÔI NAM)', pairIds: ['P_MD_10', 'P_MD_11', 'P_MD_12'] }
          ],
          groupMatches: {
            ga1: { id: 'MD_GA1', code: 'A1', group: 'A', stage: 'Vòng Bảng A - Trận 1', court: 1, time: '08:00', team1: 'P_MD_1', team2: 'P_MD_2', set1: [31, 27], set2: [0, 0], set3: [0, 0], winner: 'P_MD_1', loser: 'P_MD_2', status: 'FINISHED' },
            ga2: { id: 'MD_GA2', code: 'A2', group: 'A', stage: 'Vòng Bảng A - Trận 2', court: 2, time: '08:00', team1: 'P_MD_2', team2: 'P_MD_3', set1: [31, 25], set2: [0, 0], set3: [0, 0], winner: 'P_MD_2', loser: 'P_MD_3', status: 'FINISHED' },
            ga3: { id: 'MD_GA3', code: 'A3', group: 'A', stage: 'Vòng Bảng A - Trận 3', court: 3, time: '08:00', team1: 'P_MD_1', team2: 'P_MD_3', set1: [31, 22], set2: [0, 0], set3: [0, 0], winner: 'P_MD_1', loser: 'P_MD_3', status: 'FINISHED' },

            gb1: { id: 'MD_GB1', code: 'B1', group: 'B', stage: 'Vòng Bảng B - Trận 1', court: 1, time: '08:40', team1: 'P_MD_4', team2: 'P_MD_5', set1: [31, 28], set2: [0, 0], set3: [0, 0], winner: 'P_MD_4', loser: 'P_MD_5', status: 'FINISHED' },
            gb2: { id: 'MD_GB2', code: 'B2', group: 'B', stage: 'Vòng Bảng B - Trận 2', court: 2, time: '08:40', team1: 'P_MD_5', team2: 'P_MD_6', set1: [31, 26], set2: [0, 0], set3: [0, 0], winner: 'P_MD_5', loser: 'P_MD_6', status: 'FINISHED' },
            gb3: { id: 'MD_GB3', code: 'B3', group: 'B', stage: 'Vòng Bảng B - Trận 3', court: 3, time: '08:40', team1: 'P_MD_4', team2: 'P_MD_6', set1: [31, 24], set2: [0, 0], set3: [0, 0], winner: 'P_MD_4', loser: 'P_MD_6', status: 'FINISHED' },

            gc1: { id: 'MD_GC1', code: 'C1', group: 'C', stage: 'Vòng Bảng C - Trận 1', court: 1, time: '09:20', team1: 'P_MD_7', team2: 'P_MD_8', set1: [31, 26], set2: [0, 0], set3: [0, 0], winner: 'P_MD_7', loser: 'P_MD_8', status: 'FINISHED' },
            gc2: { id: 'MD_GC2', code: 'C2', group: 'C', stage: 'Vòng Bảng C - Trận 2', court: 2, time: '09:20', team1: 'P_MD_8', team2: 'P_MD_9', set1: [31, 28], set2: [0, 0], set3: [0, 0], winner: 'P_MD_8', loser: 'P_MD_9', status: 'FINISHED' },
            gc3: { id: 'MD_GC3', code: 'C3', group: 'C', stage: 'Vòng Bảng C - Trận 3', court: 3, time: '09:20', team1: 'P_MD_7', team2: 'P_MD_9', set1: [31, 23], set2: [0, 0], set3: [0, 0], winner: 'P_MD_7', loser: 'P_MD_9', status: 'FINISHED' },

            gd1: { id: 'MD_GD1', code: 'D1', group: 'D', stage: 'Vòng Bảng D - Trận 1', court: 1, time: '10:00', team1: 'P_MD_10', team2: 'P_MD_11', set1: [31, 25], set2: [0, 0], set3: [0, 0], winner: 'P_MD_10', loser: 'P_MD_11', status: 'FINISHED' },
            gd2: { id: 'MD_GD2', code: 'D2', group: 'D', stage: 'Vòng Bảng D - Trận 2', court: 2, time: '10:00', team1: 'P_MD_11', team2: 'P_MD_12', set1: [28, 31], set2: [0, 0], set3: [0, 0], winner: 'P_MD_12', loser: 'P_MD_11', status: 'FINISHED' },
            gd3: { id: 'MD_GD3', code: 'D3', group: 'D', stage: 'Vòng Bảng D - Trận 3', court: 3, time: '10:00', team1: 'P_MD_10', team2: 'P_MD_12', set1: [29, 31], set2: [0, 0], set3: [0, 0], winner: 'P_MD_12', loser: 'P_MD_10', status: 'FINISHED' }
          },
          matches: {
            qf1: { id: 'MD_QF1', code: 'QF1', stage: 'Tứ Kết 1 (Nhất A vs Nhì B)', court: 1, time: '10:45', team1: 'P_MD_1', team2: 'P_MD_5', set1: [31, 26], set2: [0, 0], set3: [0, 0], winner: 'P_MD_1', loser: 'P_MD_5', status: 'FINISHED' },
            qf2: { id: 'MD_QF2', code: 'QF2', stage: 'Tứ Kết 2 (Nhất C vs Nhì D)', court: 2, time: '10:45', team1: 'P_MD_7', team2: 'P_MD_10', set1: [31, 29], set2: [0, 0], set3: [0, 0], winner: 'P_MD_7', loser: 'P_MD_10', status: 'FINISHED' },
            qf3: { id: 'MD_QF3', code: 'QF3', stage: 'Tứ Kết 3 (Nhất B vs Nhì A)', court: 3, time: '10:45', team1: 'P_MD_4', team2: 'P_MD_2', set1: [31, 28], set2: [0, 0], set3: [0, 0], winner: 'P_MD_4', loser: 'P_MD_2', status: 'FINISHED' },
            qf4: { id: 'MD_QF4', code: 'QF4', stage: 'Tứ Kết 4 (Nhất D vs Nhì C)', court: 1, time: '11:25', team1: 'P_MD_12', team2: 'P_MD_8', set1: [31, 27], set2: [0, 0], set3: [0, 0], winner: 'P_MD_12', loser: 'P_MD_8', status: 'FINISHED' },
            sf1: { id: 'MD_SF1', code: 'SF1', stage: 'Bán Kết 1 (Thắng QF1 vs QF2)', court: 2, time: '12:05', team1: 'P_MD_1', team2: 'P_MD_7', set1: [31, 29], set2: [0, 0], set3: [0, 0], winner: 'P_MD_1', loser: 'P_MD_7', status: 'FINISHED' },
            sf2: { id: 'MD_SF2', code: 'SF2', stage: 'Bán Kết 2 (Thắng QF3 vs QF4)', court: 3, time: '12:05', team1: 'P_MD_4', team2: 'P_MD_12', set1: [31, 28], set2: [0, 0], set3: [0, 0], winner: 'P_MD_4', loser: 'P_MD_12', status: 'FINISHED' },
            final: { id: 'MD_FINAL', code: 'CK', stage: 'Chung Kết Cúp CLB (Thắng SF1 vs SF2)', court: 1, time: '13:00', team1: 'P_MD_1', team2: 'P_MD_4', set1: [31, 29], set2: [0, 0], set3: [0, 0], winner: 'P_MD_1', loser: 'P_MD_4', status: 'FINISHED' },
            third: { id: 'MD_THIRD', code: 'T3', stage: 'Tranh Hạng Ba (Thua SF1 vs SF2)', court: 2, time: '13:00', team1: 'P_MD_7', team2: 'P_MD_12', set1: [31, 28], set2: [0, 0], set3: [0, 0], winner: 'P_MD_7', loser: 'P_MD_12', status: 'FINISHED' }
          },
          champion: 'P_MD_1',
          runnerUp: 'P_MD_4',
          thirdPlace: 'P_MD_7'
        },

        // ================== NỘI DUNG 2: ĐƠN NAM (KNOCKOUT LOẠI TRỰC TIẾP) ==================
        {
          id: 'MS',
          name: 'Đơn Nam (Men\'s Singles)',
          type: 'SINGLES',
          format: 'KNOCKOUT',
          seedsCount: 4,
          pairs: [
            { id: 'P_MS_1', name: 'Nguyễn Văn A1 (CLB A)', chipName: 'A1', club: 'CLB A', country: 'VN', seed: 1, playerIds: ['A1'] },
            { id: 'P_MS_2', name: 'Đặng Văn B1 (CLB B)', chipName: 'B1', club: 'CLB B', country: 'VN', seed: 0, playerIds: ['B1'] },
            { id: 'P_MS_3', name: 'Dương Văn C1 (CLB C)', chipName: 'C1', club: 'CLB C', country: 'VN', seed: 3, playerIds: ['C1'] },
            { id: 'P_MS_4', name: 'Hồ Văn D1 (CLB D)', chipName: 'D1', club: 'CLB D', country: 'VN', seed: 0, playerIds: ['D1'] },
            { id: 'P_MS_5', name: 'Lê Văn A3 (CLB A)', chipName: 'A3', club: 'CLB A', country: 'VN', seed: 2, playerIds: ['A3'] },
            { id: 'P_MS_6', name: 'Bùi Văn B2 (CLB B)', chipName: 'B2', club: 'CLB B', country: 'VN', seed: 0, playerIds: ['B2'] },
            { id: 'P_MS_7', name: 'Mai Văn D3 (CLB D)', chipName: 'D3', club: 'CLB D', country: 'VN', seed: 4, playerIds: ['D3'] },
            { id: 'P_MS_8', name: 'Trịnh Thị E1 (CLB E)', chipName: 'E1', club: 'CLB E', country: 'VN', seed: 0, playerIds: ['E1'] }
          ],
          matches: {
            qf1: { id: 'MS_QF1', code: 'QF1', stage: 'Tứ Kết 1', court: 1, time: '08:45', team1: 'P_MS_1', team2: 'P_MS_2', set1: [31, 24], set2: [0, 0], set3: [0, 0], winner: 'P_MS_1', loser: 'P_MS_2', status: 'FINISHED' },
            qf2: { id: 'MS_QF2', code: 'QF2', stage: 'Tứ Kết 2', court: 2, time: '08:45', team1: 'P_MS_3', team2: 'P_MS_4', set1: [31, 27], set2: [0, 0], set3: [0, 0], winner: 'P_MS_3', loser: 'P_MS_4', status: 'FINISHED' },
            qf3: { id: 'MS_QF3', code: 'QF3', stage: 'Tứ Kết 3', court: 3, time: '08:45', team1: 'P_MS_5', team2: 'P_MS_6', set1: [31, 25], set2: [0, 0], set3: [0, 0], winner: 'P_MS_5', loser: 'P_MS_6', status: 'FINISHED' },
            qf4: { id: 'MS_QF4', code: 'QF4', stage: 'Tứ Kết 4', court: 1, time: '09:30', team1: 'P_MS_7', team2: 'P_MS_8', set1: [31, 28], set2: [0, 0], set3: [0, 0], winner: 'P_MS_7', loser: 'P_MS_8', status: 'FINISHED' },
            sf1: { id: 'MS_SF1', code: 'SF1', stage: 'Bán Kết 1', court: 1, time: '11:00', team1: 'P_MS_1', team2: 'P_MS_3', set1: [31, 28], set2: [0, 0], set3: [0, 0], winner: 'P_MS_1', loser: 'P_MS_3', status: 'FINISHED' },
            sf2: { id: 'MS_SF2', code: 'SF2', stage: 'Bán Kết 2', court: 2, time: '11:00', team1: 'P_MS_5', team2: 'P_MS_7', set1: [31, 26], set2: [0, 0], set3: [0, 0], winner: 'P_MS_5', loser: 'P_MS_7', status: 'FINISHED' },
            final: { id: 'MS_FINAL', code: 'CK', stage: 'Chung Kết Đơn Nam', court: 1, time: '12:00', team1: 'P_MS_1', team2: 'P_MS_5', set1: [31, 29], set2: [0, 0], set3: [0, 0], winner: 'P_MS_1', loser: 'P_MS_5', status: 'FINISHED' },
            third: { id: 'MS_THIRD', code: 'T3', stage: 'Tranh Hạng Ba', court: 2, time: '12:00', team1: 'P_MS_3', team2: 'P_MS_7', set1: [31, 27], set2: [0, 0], set3: [0, 0], winner: 'P_MS_3', loser: 'P_MS_7', status: 'FINISHED' }
          },
          champion: 'P_MS_1',
          runnerUp: 'P_MS_5',
          thirdPlace: 'P_MS_3'
        },

        // ================== NỘI DUNG 3: ĐÔI NAM NỮ (2 BẢNG A, B + PLAYOFF) ==================
        {
          id: 'XD',
          name: 'Đôi Nam Nữ (Mixed Doubles)',
          type: 'DOUBLES',
          format: 'GROUP_KNOCKOUT',
          seedsCount: 2,
          pairs: [
            { id: 'P_XD_1', name: 'A1 & E1 (CLB A & E)', chipName: 'A1 & E1', club: 'CLB A-E', country: 'VN', seed: 1, playerIds: ['A1', 'E1'] },
            { id: 'P_XD_2', name: 'B1 & E2 (CLB B & E)', chipName: 'B1 & E2', club: 'CLB B-E', country: 'VN', seed: 0, playerIds: ['B1', 'E2'] },
            { id: 'P_XD_3', name: 'C1 & A6 (CLB C & A)', chipName: 'C1 & A6', club: 'CLB C-A', country: 'VN', seed: 0, playerIds: ['C1', 'A6'] },
            { id: 'P_XD_4', name: 'D1 & A2 (CLB D & A)', chipName: 'D1 & A2', club: 'CLB D-A', country: 'VN', seed: 2, playerIds: ['D1', 'A2'] },
            { id: 'P_XD_5', name: 'A3 & C2 (CLB A & C)', chipName: 'A3 & C2', club: 'CLB A-C', country: 'VN', seed: 0, playerIds: ['A3', 'C2'] },
            { id: 'P_XD_6', name: 'B2 & D4 (CLB B & D)', chipName: 'B2 & D4', club: 'CLB B-D', country: 'VN', seed: 0, playerIds: ['B2', 'D4'] }
          ],
          groups: [
            { id: 'A', name: 'BẢNG A (ĐÔI NAM NỮ)', pairIds: ['P_XD_1', 'P_XD_2', 'P_XD_3'] },
            { id: 'B', name: 'BẢNG B (ĐÔI NAM NỮ)', pairIds: ['P_XD_4', 'P_XD_5', 'P_XD_6'] }
          ],
          groupMatches: {
            ga1: { id: 'XD_GA1', code: 'A1', group: 'A', stage: 'Vòng Bảng A - Trận 1', court: 2, time: '09:00', team1: 'P_XD_1', team2: 'P_XD_2', set1: [31, 26], set2: [0, 0], set3: [0, 0], winner: 'P_XD_1', loser: 'P_XD_2', status: 'FINISHED' },
            ga2: { id: 'XD_GA2', code: 'A2', group: 'A', stage: 'Vòng Bảng A - Trận 2', court: 3, time: '09:30', team1: 'P_XD_2', team2: 'P_XD_3', set1: [31, 27], set2: [0, 0], set3: [0, 0], winner: 'P_XD_2', loser: 'P_XD_3', status: 'FINISHED' },
            ga3: { id: 'XD_GA3', code: 'A3', group: 'A', stage: 'Vòng Bảng A - Trận 3', court: 1, time: '10:15', team1: 'P_XD_1', team2: 'P_XD_3', set1: [31, 23], set2: [0, 0], set3: [0, 0], winner: 'P_XD_1', loser: 'P_XD_3', status: 'FINISHED' },
            gb1: { id: 'XD_GB1', code: 'B1', group: 'B', stage: 'Vòng Bảng B - Trận 1', court: 2, time: '10:15', team1: 'P_XD_4', team2: 'P_XD_5', set1: [31, 28], set2: [0, 0], set3: [0, 0], winner: 'P_XD_4', loser: 'P_XD_5', status: 'FINISHED' },
            gb2: { id: 'XD_GB2', code: 'B2', group: 'B', stage: 'Vòng Bảng B - Trận 2', court: 3, time: '10:15', team1: 'P_XD_5', team2: 'P_XD_6', set1: [31, 29], set2: [0, 0], set3: [0, 0], winner: 'P_XD_5', loser: 'P_XD_6', status: 'FINISHED' },
            gb3: { id: 'XD_GB3', code: 'B3', group: 'B', stage: 'Vòng Bảng B - Trận 3', court: 1, time: '11:00', team1: 'P_XD_4', team2: 'P_XD_6', set1: [31, 25], set2: [0, 0], set3: [0, 0], winner: 'P_XD_4', loser: 'P_XD_6', status: 'FINISHED' }
          },
          matches: {
            sf1: { id: 'XD_SF1', code: 'SF1', stage: 'Bán Kết 1 (Nhất A vs Nhì B)', court: 2, time: '11:45', team1: 'P_XD_1', team2: 'P_XD_5', set1: [31, 27], set2: [0, 0], set3: [0, 0], winner: 'P_XD_1', loser: 'P_XD_5', status: 'FINISHED' },
            sf2: { id: 'XD_SF2', code: 'SF2', stage: 'Bán Kết 2 (Nhất B vs Nhì A)', court: 3, time: '11:45', team1: 'P_XD_4', team2: 'P_XD_2', set1: [31, 28], set2: [0, 0], set3: [0, 0], winner: 'P_XD_4', loser: 'P_XD_2', status: 'FINISHED' },
            final: { id: 'XD_FINAL', code: 'CK', stage: 'Chung Kết Cúp Đôi Nam Nữ', court: 1, time: '12:45', team1: 'P_XD_1', team2: 'P_XD_4', set1: [31, 29], set2: [0, 0], set3: [0, 0], winner: 'P_XD_1', loser: 'P_XD_4', status: 'FINISHED' },
            third: { id: 'XD_THIRD', code: 'T3', stage: 'Tranh Hạng Ba Đôi Nam Nữ', court: 2, time: '12:45', team1: 'P_XD_5', team2: 'P_XD_2', set1: [31, 28], set2: [0, 0], set3: [0, 0], winner: 'P_XD_5', loser: 'P_XD_2', status: 'FINISHED' }
          },
          champion: 'P_XD_1',
          runnerUp: 'P_XD_4',
          thirdPlace: 'P_XD_5'
        }
      ]
    }
  ];
}

/**
 * Nạp dữ liệu giải đấu độc lập từ LocalStorage
 */
function loadTournamentData() {
  try {
    const raw = localStorage.getItem(TOURNAMENT_STORAGE_KEY);
    if (raw) {
      TournamentState.tournaments = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Lỗi đọc dữ liệu giải đấu:', e);
  }

  // Tự động nâng cấp / nạp phiên bản chuẩn 5 CLB (A..E) và 18 thành viên nếu chưa có
  if (!TournamentState.tournaments || TournamentState.tournaments.length === 0 || TournamentState.tournaments[0]?.dataVersion !== TOURNAMENT_DATA_VERSION) {
    TournamentState.tournaments = createDefaultTournamentData();
    TournamentState.activeTournamentId = TournamentState.tournaments[0].id;
    autoGenerateTournamentSchedule(TournamentState.tournaments[0].id, true);
    saveTournamentData();
  }

  if (!TournamentState.activeTournamentId && TournamentState.tournaments.length > 0) {
    TournamentState.activeTournamentId = TournamentState.tournaments[0].id;
  }

  const activeTour = getActiveTournament();
  if (activeTour && !activeTour.scheduleAutoGeneratedV2) {
    autoGenerateTournamentSchedule(activeTour.id, true);
  }

  // Đảm bảo tất cả VĐV hiện có đều có trường gender (MALE/FEMALE)
  if (TournamentState.tournaments) {
    TournamentState.tournaments.forEach(t => {
      if (t.players) {
        t.players.forEach(p => {
          if (!p.gender) {
            if (p.id === 'E1' || p.id === 'E2' || (p.name && (p.name.includes('Thị') || p.name.includes('Hoa') || p.name.includes('Mai') || p.name.includes('Hà')))) {
              p.gender = 'FEMALE';
            } else {
              p.gender = 'MALE';
            }
          }
        });
      }
    });
  }
}

/**
 * Lưu dữ liệu giải đấu độc lập vào LocalStorage
 */
function saveTournamentData() {
  try {
    localStorage.setItem(TOURNAMENT_STORAGE_KEY, JSON.stringify(TournamentState.tournaments));
  } catch (e) {
    console.error('Lỗi lưu dữ liệu giải đấu:', e);
  }
}

/**
 * Lấy đối tượng giải đấu đang chọn
 */
function getActiveTournament() {
  return TournamentState.tournaments.find(t => t.id === TournamentState.activeTournamentId) || TournamentState.tournaments[0];
}

/**
 * Lấy nội dung thi đấu đang chọn trong giải
 */
function getActiveDiscipline() {
  const tour = getActiveTournament();
  if (!tour || !tour.disciplines) return null;
  return tour.disciplines.find(d => d.id === TournamentState.activeDisciplineId) || tour.disciplines[0];
}

/**
 * Khởi tạo phân hệ giải đấu
 */
function initTournamentModule() {
  loadTournamentData();
}

/**
 * Render toàn bộ phân hệ Quản lý Giải đấu
 */
function renderTournamentModule() {
  loadTournamentData();
  const tour = getActiveTournament();
  if (!tour) return;

  // 1. Cập nhật Tiêu đề và Header Bar
  const titleEl = document.getElementById('tourHeaderTitle');
  if (titleEl) titleEl.textContent = tour.title;

  const quickTitleEl = document.getElementById('activeTourQuickTitle');
  if (quickTitleEl) quickTitleEl.textContent = tour.title;

  const scopeBadge = document.getElementById('tourHeaderScopeBadge');
  if (scopeBadge) {
    const sc = TOURNAMENT_SCOPES.find(s => s.id === tour.scope) || { label: '🤝 Liên CLB' };
    scopeBadge.textContent = sc.label;
  }

  const statusBadge = document.getElementById('tourHeaderStatusBadge');
  if (statusBadge) {
    if (tour.status === 'COMPLETED') {
      statusBadge.textContent = 'Đã kết thúc';
      statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40';
    } else {
      statusBadge.textContent = 'Đang thi đấu';
      statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    }
  }

  // 2. Đổ danh sách giải đấu vào dropdown switcher
  const selectActive = document.getElementById('tourSelectActive');
  if (selectActive) {
    selectActive.innerHTML = TournamentState.tournaments.map(t => `
      <option value="${t.id}" ${t.id === tour.id ? 'selected' : ''}>${escapeHtml(t.title)}</option>
    `).join('');
  }

  // 3. Render danh sách Tab nội dung thi đấu
  renderDisciplineTabs();

  // 4. Render nội dung theo sub-tab hiện hành
  switchTourSubtab(TournamentState.activeSubtab || 'bracket');

  lucide.createIcons();
}

/**
 * Chuyển đổi giữa 5 Sub-Tabs
 */
function switchTourSubtab(subtabId) {
  TournamentState.activeSubtab = subtabId;

  // Cập nhật nút điều hướng
  ['bracket', 'schedule', 'clubs', 'players', 'config', 'awards'].forEach(id => {
    const btn = document.getElementById(`btnTourSubtab-${id}`);
    const view = document.getElementById(`tourView-${id}`) || (id === 'clubs' ? document.getElementById('tourView-players') : null);
    if (btn) {
      if (id === subtabId || (subtabId === 'clubs' && id === 'players')) {
        btn.className = 'px-1 py-1 rounded-md bg-purple-700 text-white font-black shadow-2xs transition flex items-center justify-center gap-0.5 whitespace-nowrap cursor-pointer text-[8px] tracking-tight shrink-0';
      } else {
        btn.className = 'px-1 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center justify-center gap-0.5 whitespace-nowrap cursor-pointer text-[8px] font-bold tracking-tight shrink-0';
      }
    }
    if (view) {
      if (id === subtabId || (subtabId === 'clubs' && id === 'clubs')) {
        view.classList.remove('hidden');
      } else {
        view.classList.add('hidden');
      }
    }
  });

  // Render nội dung tương ứng
  if (subtabId === 'bracket') {
    renderTournamentBracketTab();
  } else if (subtabId === 'schedule') {
    renderTournamentScheduleTab();
  } else if (subtabId === 'clubs' || subtabId === 'players') {
    renderTournamentClubsTab();
    renderTournamentPlayersTab();
  } else if (subtabId === 'config') {
    renderTournamentConfigTab();
  } else if (subtabId === 'awards') {
    renderTournamentAwardsTab();
  }

  lucide.createIcons();
}

/**
 * Đổi giải đấu hiện hành
 */
function switchActiveTournament(tourId) {
  TournamentState.activeTournamentId = tourId;
  const tour = getActiveTournament();
  if (tour && tour.disciplines && tour.disciplines.length > 0) {
    TournamentState.activeDisciplineId = tour.disciplines[0].id;
  }
  renderTournamentModule();
  showToast(`Đã chuyển sang giải đấu: ${tour.title}`, 'info');
}

/**
 * Đổi nội dung thi đấu đang xem (MD, MS, XD...)
 */
function switchTourDiscipline(discId) {
  TournamentState.activeDisciplineId = discId;
  renderDisciplineTabs();
  if (TournamentState.activeSubtab === 'bracket') {
    renderTournamentBracketTab();
  } else if (TournamentState.activeSubtab === 'clubs' || TournamentState.activeSubtab === 'players') {
    renderTournamentPlayersTab();
  }
}

/**
 * Render thanh chọn nội dung thi đấu
 */
function renderDisciplineTabs() {
  const container = document.getElementById('tourDisciplineTabsContainer');
  const tour = getActiveTournament();
  if (!container || !tour || !tour.disciplines) return;

  container.innerHTML = tour.disciplines.map(d => {
    const isActive = d.id === TournamentState.activeDisciplineId;
    return `
      <button type="button" onclick="switchTourDiscipline('${d.id}')" class="px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${isActive ? 'bg-purple-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
        <span>${d.type === 'DOUBLES' ? '👥' : '👤'}</span>
        <span>${escapeHtml(d.name)}</span>
        <span class="text-[10px] opacity-80">(${d.pairs ? d.pairs.length : 0})</span>
      </button>
    `;
  }).join('');
}

// ----------------------------------------------------
// PHÂN HỆ 1: SƠ ĐỒ CÂY BRACKET TỰ ĐỘNG, VÒNG BẢNG & GHI ĐIỂM LIVE
// ----------------------------------------------------

/**
 * Tìm cặp đấu theo ID
 */
function findTournamentPair(pairId) {
  const disc = getActiveDiscipline();
  if (!disc || !disc.pairs) return null;
  return disc.pairs.find(p => p.id === pairId) || null;
}

/**
 * Tính toán Bảng Xếp Hạng Vòng Bảng (Group Standings) chuẩn theo tiêu chí cấu hình
 */
function calculateGroupStandings(group, groupMatches, criteriaOrder) {
  if (!group || !group.pairIds) return [];
  const stats = {};

  group.pairIds.forEach(pId => {
    stats[pId] = {
      pairId: pId,
      played: 0,
      won: 0,
      lost: 0,
      setsWon: 0,
      setsLost: 0,
      pointsWon: 0,
      pointsLost: 0,
      h2h: {}
    };
  });

  const matchesList = Object.values(groupMatches || {}).filter(m => m.group === group.id);

  matchesList.forEach(m => {
    if (m.status !== 'FINISHED' || !m.winner) return;
    const t1 = m.team1;
    const t2 = m.team2;
    if (!stats[t1] || !stats[t2]) return;

    stats[t1].played++;
    stats[t2].played++;

    let setsT1 = 0;
    let setsT2 = 0;
    [m.set1, m.set2, m.set3].forEach(set => {
      if (set && (set[0] > 0 || set[1] > 0)) {
        stats[t1].pointsWon += set[0];
        stats[t1].pointsLost += set[1];
        stats[t2].pointsWon += set[1];
        stats[t2].pointsLost += set[0];
        if (set[0] > set[1]) setsT1++;
        else if (set[1] > set[0]) setsT2++;
      }
    });

    stats[t1].setsWon += setsT1;
    stats[t1].setsLost += setsT2;
    stats[t2].setsWon += setsT2;
    stats[t2].setsLost += setsT1;

    if (m.winner === t1) {
      stats[t1].won++;
      stats[t2].lost++;
      stats[t1].h2h[t2] = 1;
      stats[t2].h2h[t1] = -1;
    } else if (m.winner === t2) {
      stats[t2].won++;
      stats[t1].lost++;
      stats[t2].h2h[t1] = 1;
      stats[t1].h2h[t2] = -1;
    }
  });

  const rankedList = Object.values(stats);
  const activeCriteria = criteriaOrder || ['WINS', 'HEAD_TO_HEAD', 'GAME_DIFF', 'POINT_DIFF', 'POINTS_SCORED', 'FAIR_PLAY'];

  rankedList.sort((a, b) => {
    for (const c of activeCriteria) {
      if (c === 'WINS') {
        if (b.won !== a.won) return b.won - a.won;
      } else if (c === 'HEAD_TO_HEAD') {
        if (a.h2h[b.pairId] !== undefined && a.h2h[b.pairId] !== 0) {
          return b.h2h[a.pairId] - a.h2h[b.pairId];
        }
      } else if (c === 'GAME_DIFF') {
        const diffA = a.setsWon - a.setsLost;
        const diffB = b.setsWon - b.setsLost;
        if (diffB !== diffA) return diffB - diffA;
      } else if (c === 'POINT_DIFF') {
        const diffA = a.pointsWon - a.pointsLost;
        const diffB = b.pointsWon - b.pointsLost;
        if (diffB !== diffA) return diffB - diffA;
      } else if (c === 'POINTS_SCORED') {
        if (b.pointsWon !== a.pointsWon) return b.pointsWon - a.pointsWon;
      }
    }
    return 0;
  });

  return rankedList;
}

/**
 * Render sơ đồ thi đấu: Cây Knockout hoặc Vòng Bảng + Playoff
 */
function renderTournamentBracketTab() {
  const disc = getActiveDiscipline();
  const tour = getActiveTournament();
  const container = document.getElementById('tourKnockoutTreeContainer');
  const formatBadge = document.getElementById('tourCurrentDisciplineFormatBadge');

  if (!disc || !container) return;

  const rules = tour.matchRules || { setsMode: 1, pointsToWin: 31, maxPointsCap: 31, ruleType: 'SUDDEN_DEATH' };
  const rulesLabel = rules.setsMode === 1 ? `1 Set ${rules.maxPointsCap}đ` : `3 Set ${rules.pointsToWin}đ`;

  if (formatBadge) {
    if (disc.groups && disc.groups.length >= 4) {
      formatBadge.innerHTML = `🎲 4 Bảng (A, B, C, D) + Playoff • ${rulesLabel}`;
      formatBadge.className = 'px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 font-black border border-teal-200';
    } else if (disc.groups && disc.groups.length === 2) {
      formatBadge.innerHTML = `👥 2 Bảng (A, B) + Playoff • ${rulesLabel}`;
      formatBadge.className = 'px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 font-black border border-indigo-200';
    } else {
      formatBadge.innerHTML = `⚡ Đấu loại trực tiếp (Knockout) • ${rulesLabel}`;
      formatBadge.className = 'px-2 py-0.5 rounded-lg bg-purple-50 text-purple-800 font-black border border-purple-200';
    }
  }

  const matches = disc.matches || {};
  const finalMatch = matches.final || {};

  // Render match card helper với nút mở Modal và quick score
  const renderMatchCard = (m, matchKey, nextTargetLabel, isGroup = false, customWidth = '') => {
    if (!m) return '';
    const t1 = findTournamentPair(m.team1);
    const t2 = findTournamentPair(m.team2);

    const t1Name = t1 ? t1.chipName || t1.name : (m.team1Label || 'Chờ xác định');
    const t2Name = t2 ? t2.chipName || t2.name : (m.team2Label || 'Chờ xác định');
    const t1Club = t1?.club ? t1.club : '';
    const t2Club = t2?.club ? t2.club : '';

    const isFinished = m.status === 'FINISHED' && m.winner;
    const isReady = t1 && t2;

    const s1_1 = (m.set1 && m.set1[0]) || 0;
    const s1_2 = (m.set1 && m.set1[1]) || 0;

    const widthClass = isGroup ? 'w-full' : (customWidth || 'w-[245px] sm:w-[255px] shrink-0');

    return `
      <div class="bg-white rounded-xl border ${isFinished ? 'border-purple-300 shadow-2xs' : 'border-slate-200 shadow-2xs'} p-2.5 space-y-1.5 relative ${widthClass} text-xs">
        <div class="flex items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-slate-100 font-bold">
          <span class="text-purple-900 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">${m.code || matchKey} • ${m.stage}</span>
          <span class="text-slate-500 font-semibold">Sân ${m.court || 1} • ${m.time || '08:00'}</span>
        </div>

        <!-- Đội 1 -->
        <div class="flex items-center justify-between p-1.5 rounded-lg ${m.winner === m.team1 && m.team1 ? 'bg-emerald-50 border border-emerald-300 font-black text-emerald-950 shadow-2xs' : 'bg-slate-50 text-slate-800'}">
          <div class="truncate pr-1.5 flex items-center gap-1.5 min-w-0">
            ${m.winner === m.team1 && m.team1 ? '<span class="text-xs">👑</span>' : ''}
            <span class="truncate font-bold ${m.winner === m.team1 && m.team1 ? 'text-emerald-950 font-black' : 'text-slate-800'}" title="${t1 ? t1.name : ''}">${escapeHtml(t1Name)}</span>
            ${t1Club ? `<span class="text-[10px] px-1.5 py-0.2 bg-purple-100/80 text-purple-800 rounded font-bold shrink-0">${escapeHtml(t1Club)}</span>` : ''}
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <input type="number" min="0" max="35" value="${s1_1}" ${!isReady ? 'disabled' : ''} onchange="updateMatchScoreSet('${disc.id}', '${matchKey}', 1, this.value, null, ${isGroup})" class="w-9 h-7 text-center text-xs font-black border border-slate-200 rounded-lg bg-white p-0.5 shadow-2xs disabled:opacity-40" />
          </div>
        </div>

        <!-- Đội 2 -->
        <div class="flex items-center justify-between p-1.5 rounded-lg ${m.winner === m.team2 && m.team2 ? 'bg-emerald-50 border border-emerald-300 font-black text-emerald-950 shadow-2xs' : 'bg-slate-50 text-slate-800'}">
          <div class="truncate pr-1.5 flex items-center gap-1.5 min-w-0">
            ${m.winner === m.team2 && m.team2 ? '<span class="text-xs">👑</span>' : ''}
            <span class="truncate font-bold ${m.winner === m.team2 && m.team2 ? 'text-emerald-950 font-black' : 'text-slate-800'}" title="${t2 ? t2.name : ''}">${escapeHtml(t2Name)}</span>
            ${t2Club ? `<span class="text-[10px] px-1.5 py-0.2 bg-blue-100/80 text-blue-800 rounded font-bold shrink-0">${escapeHtml(t2Club)}</span>` : ''}
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <input type="number" min="0" max="35" value="${s1_2}" ${!isReady ? 'disabled' : ''} onchange="updateMatchScoreSet('${disc.id}', '${matchKey}', 1, null, this.value, ${isGroup})" class="w-9 h-7 text-center text-xs font-black border border-slate-200 rounded-lg bg-white p-0.5 shadow-2xs disabled:opacity-40" />
          </div>
        </div>

        <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
          <button type="button" onclick="openEditScoreModal('${disc.id}', '${matchKey}', ${isGroup})" class="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer">
            <span>📝</span>
            <span>Chi tiết điểm</span>
          </button>
          ${nextTargetLabel ? `
            <span class="font-bold text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 truncate max-w-[130px]">${nextTargetLabel}</span>
          ` : (isFinished ? `<span class="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">✓ Đã xong</span>` : `<span class="text-slate-400">Chờ đấu</span>`)}
        </div>
      </div>
    `;
  };

  // =================== TRƯỜNG HỢP 1: 4 BẢNG (A, B, C, D) + PLAYOFF (QF -> SF -> FINAL) ===================
  if (disc.groups && disc.groups.length >= 4) {
    let html = '<div class="space-y-5">';

    // Header Vòng Bảng
    html += `
      <div class="p-3 bg-gradient-to-r from-teal-50 via-indigo-50 to-purple-50 rounded-xl border border-teal-200 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div>
          <b class="text-teal-950 text-xs flex items-center gap-1.5">
            <span>🎲</span>
            <span>VÒNG BẢNG 4 BẢNG ĐỘC LẬP (A, B, C, D) • THỂ LỆ: ${rulesLabel}</span>
          </b>
          <p class="text-[11px] text-teal-800">Top 1 và Top 2 của mỗi bảng (Tổng 8 đội) tự động giành vé tiến vào vòng Tứ Kết Playoff QF1..QF4!</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-teal-800 border border-teal-300 shadow-2xs">
          Tiêu chí ưu tiên: ${tour.rankingCriteria?.slice(0, 3).map(c => RANKING_CRITERIA_DEFINITIONS.find(d => d.id === c)?.name.split('(')[0].trim()).join(' ➔ ')}
        </span>
      </div>

      <!-- 4 Bảng Grid (2x2) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    `;

    disc.groups.forEach(grp => {
      const standings = calculateGroupStandings(grp, disc.groupMatches, tour.rankingCriteria);
      const grpMatches = Object.entries(disc.groupMatches || {}).filter(([k, m]) => m.group === grp.id);

      html += `
        <div class="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <div class="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <h4 class="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span class="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-black">${grp.id}</span>
              <span>${grp.name}</span>
            </h4>
            <span class="text-[11px] text-teal-800 bg-teal-100/70 font-bold px-2 py-0.5 rounded">Vòng tròn 1 lượt</span>
          </div>

          <!-- Bảng xếp hạng trực tiếp -->
          <div class="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th class="py-2 px-2 text-center w-10">Hạng</th>
                  <th class="py-2 px-2.5">Cặp Đấu</th>
                  <th class="py-2 px-1 text-center w-14">CLB</th>
                  <th class="py-2 px-1 text-center w-9">Trận</th>
                  <th class="py-2 px-1 text-center w-9 text-emerald-700">T</th>
                  <th class="py-2 px-1 text-center w-9 text-rose-600">B</th>
                  <th class="py-2 px-1.5 text-center w-14">HS</th>
                  <th class="py-2 px-1.5 text-center w-16">Vé QF</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs">
                ${standings.map((st, idx) => {
                  const p = findTournamentPair(st.pairId);
                  const isTop2 = idx < 2;
                  return `
                    <tr class="${isTop2 ? 'bg-emerald-50/50 font-semibold' : ''}">
                      <td class="py-2 px-2 text-center font-black ${idx === 0 ? 'text-amber-500' : (idx === 1 ? 'text-slate-600' : 'text-slate-400')}">
                        ${idx === 0 ? '🥇 1' : (idx === 1 ? '🥈 2' : `${idx + 1}`)}
                      </td>
                      <td class="py-2 px-2.5 truncate max-w-[130px] font-bold text-slate-900" title="${p ? p.name : ''}">
                        ${p ? p.chipName || p.name : st.pairId}
                      </td>
                      <td class="py-2 px-1 text-center font-bold text-purple-700">
                        <span class="px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-[10px]">${p?.club || 'CLB'}</span>
                      </td>
                      <td class="py-2 px-1 text-center text-slate-700">${st.played}</td>
                      <td class="py-2 px-1 text-center font-black text-emerald-700">${st.won}</td>
                      <td class="py-2 px-1 text-center text-slate-500">${st.lost}</td>
                      <td class="py-2 px-1.5 text-center font-bold ${st.pointsWon - st.pointsLost > 0 ? 'text-emerald-700' : (st.pointsWon - st.pointsLost < 0 ? 'text-rose-600' : 'text-slate-600')}">
                        ${st.pointsWon - st.pointsLost > 0 ? `+${st.pointsWon - st.pointsLost}` : `${st.pointsWon - st.pointsLost}`}
                      </td>
                      <td class="py-2 px-1.5 text-center">
                        ${isTop2 ? `
                          <span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Vào QF
                          </span>
                        ` : `<span class="text-[10px] text-slate-400">Dừng bước</span>`}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Các trận đấu trong bảng -->
          <div class="space-y-1.5 pt-1">
            <span class="text-xs font-bold text-slate-600 block">Các trận đấu bảng ${grp.id}:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${grpMatches.map(([key, gm]) => renderMatchCard(gm, key, '', true)).join('')}
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';

    // VÒNG PLAYOFF KNOCKOUT 8 ĐỘI (TỨ KẾT QF ➔ BÁN KẾT SF ➔ CHUNG KẾT & TRANH HẠNG BA)
    const qf1 = matches.qf1 || {};
    const qf2 = matches.qf2 || {};
    const qf3 = matches.qf3 || {};
    const qf4 = matches.qf4 || {};
    const sf1 = matches.sf1 || {};
    const sf2 = matches.sf2 || {};
    const thirdMatch = matches.third || {};

    html += `
      <div class="pt-5 border-t border-slate-200 space-y-3.5">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 class="text-sm font-black text-slate-900 flex items-center gap-2">
              <span class="text-lg">🌿</span>
              <span>Sơ Đồ Phân Nhánh Knockout: Tứ Kết ➔ Bán Kết ➔ Chung Kết & Tranh Hạng Ba</span>
            </h4>
            <p class="text-xs text-slate-500">Người thắng tự động chuyển sang vòng tiếp theo; 2 đội thua ở Bán kết tự động vào Tranh Hạng Ba 🥉</p>
          </div>
          <span class="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
            Tự động đẩy người thắng
          </span>
        </div>

        <div class="overflow-x-auto pb-2">
          <div class="min-w-[880px] flex items-center justify-between gap-4 py-2">
            
            <!-- Cột 1: TỨ KẾT (QF) -->
            <div class="space-y-2.5 w-[250px] shrink-0">
              <div class="text-center font-black text-xs text-purple-900 bg-purple-50 py-1.5 px-3 rounded-xl border border-purple-200 uppercase">
                ⚔️ Tứ Kết (QF1 - QF4)
              </div>
              <div class="space-y-2">
                ${renderMatchCard(qf1, 'qf1', 'Vào SF1')}
                ${renderMatchCard(qf2, 'qf2', 'Vào SF1')}
              </div>
              <div class="py-1"></div>
              <div class="space-y-2">
                ${renderMatchCard(qf3, 'qf3', 'Vào SF2')}
                ${renderMatchCard(qf4, 'qf4', 'Vào SF2')}
              </div>
            </div>

            <div class="text-slate-300 font-bold text-lg shrink-0">➔</div>

            <!-- Cột 2: BÁN KẾT (SF) -->
            <div class="space-y-4 w-[250px] shrink-0">
              <div class="text-center font-black text-xs text-blue-900 bg-blue-50 py-1.5 px-3 rounded-xl border border-blue-200 uppercase">
                ⚡ Bán Kết (SF1 & SF2)
              </div>
              <div class="space-y-14 pt-4">
                ${renderMatchCard(sf1, 'sf1', 'Vào Chung Kết')}
                ${renderMatchCard(sf2, 'sf2', 'Vào Chung Kết')}
              </div>
            </div>

            <div class="text-slate-300 font-bold text-lg shrink-0">➔</div>

            <!-- Cột 3: CHUNG KẾT & TRANH HẠNG BA -->
            <div class="space-y-3 w-[260px] shrink-0">
              <div class="text-center font-black text-xs text-amber-900 bg-amber-50 py-1.5 px-3 rounded-xl border border-amber-200 uppercase">
                🏆 Chung Kết & Hạng Ba
              </div>
              <div class="space-y-3 pt-1">
                <div class="p-1 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-2xl shadow-md border-2 border-amber-400">
                  ${renderMatchCard(finalMatch, 'final', '🏆 VÔ ĐỊCH CLB')}
                </div>
                <div class="pt-2">
                  <span class="text-[10px] font-black text-amber-900 uppercase block mb-1">🥉 Trận Tranh Hạng Ba:</span>
                  <div class="p-1 bg-amber-50 rounded-2xl border-2 border-amber-300">
                    ${renderMatchCard(thirdMatch, 'third', '🥉 HẠNG BA')}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    html += '</div>';
    container.innerHTML = html;
    return;
  }

  // =================== TRƯỜNG HỢP 2: 2 BẢNG (A, B) + PLAYOFF (SF -> FINAL) ===================
  if (disc.groups && disc.groups.length === 2) {
    let groupHtml = '<div class="space-y-5">';

    groupHtml += `
      <div class="p-3 bg-teal-50/70 rounded-xl border border-teal-200 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div>
          <b class="text-teal-950 text-xs flex items-center gap-1.5">
            <span>📊</span>
            <span>VÒNG BẢNG (A & B) • THỂ LỆ: ${rulesLabel}</span>
          </b>
          <p class="text-[11px] text-teal-800">Top 1 và Top 2 mỗi bảng tự động giành vé tiến vào vòng Bán Kết Playoff (SF1 & SF2)!</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-teal-800 border border-teal-300 shadow-2xs">
          Tiêu chí ưu tiên: ${tour.rankingCriteria?.slice(0, 3).map(c => RANKING_CRITERIA_DEFINITIONS.find(d => d.id === c)?.name.split('(')[0].trim()).join(' ➔ ')}
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    `;

    disc.groups.forEach(grp => {
      const standings = calculateGroupStandings(grp, disc.groupMatches, tour.rankingCriteria);
      const grpMatches = Object.entries(disc.groupMatches || {}).filter(([k, m]) => m.group === grp.id);

      groupHtml += `
        <div class="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <div class="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <h4 class="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span class="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-black">${grp.id}</span>
              <span>${grp.name}</span>
            </h4>
            <span class="text-[11px] text-slate-600 font-semibold">Vòng tròn 1 lượt</span>
          </div>

          <div class="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th class="py-2 px-2 text-center w-10">Hạng</th>
                  <th class="py-2 px-2.5">Đội / Cặp Đấu</th>
                  <th class="py-2 px-1 text-center w-14">CLB</th>
                  <th class="py-2 px-1 text-center w-9">Trận</th>
                  <th class="py-2 px-1 text-center w-9 text-emerald-700">T</th>
                  <th class="py-2 px-1 text-center w-9 text-rose-600">B</th>
                  <th class="py-2 px-1.5 text-center w-14">HS</th>
                  <th class="py-2 px-2 text-center w-16">Vé SF</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs">
                ${standings.map((st, idx) => {
                  const p = findTournamentPair(st.pairId);
                  const isTop2 = idx < 2;
                  return `
                    <tr class="${isTop2 ? 'bg-emerald-50/50 font-semibold' : ''}">
                      <td class="py-2 px-2 text-center font-black ${idx === 0 ? 'text-amber-500' : (idx === 1 ? 'text-slate-600' : 'text-slate-400')}">
                        ${idx === 0 ? '🥇 1' : (idx === 1 ? '🥈 2' : `${idx + 1}`)}
                      </td>
                      <td class="py-2 px-2.5 truncate max-w-[130px] font-bold text-slate-900" title="${p ? p.name : ''}">
                        ${p ? p.chipName || p.name : st.pairId}
                      </td>
                      <td class="py-2 px-1 text-center font-bold text-purple-700">
                        <span class="px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-[10px]">${p?.club || 'CLB'}</span>
                      </td>
                      <td class="py-2 px-1 text-center text-slate-700">${st.played}</td>
                      <td class="py-2 px-1 text-center font-black text-emerald-700">${st.won}</td>
                      <td class="py-2 px-1 text-center text-slate-500">${st.lost}</td>
                      <td class="py-2 px-1.5 text-center font-bold ${st.pointsWon - st.pointsLost > 0 ? 'text-emerald-700' : (st.pointsWon - st.pointsLost < 0 ? 'text-rose-600' : 'text-slate-600')}">
                        ${st.pointsWon - st.pointsLost > 0 ? `+${st.pointsWon - st.pointsLost}` : `${st.pointsWon - st.pointsLost}`}
                      </td>
                      <td class="py-2 px-2 text-center">
                        ${isTop2 ? `
                          <span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Vào SF
                          </span>
                        ` : `<span class="text-[10px] text-slate-400">Dừng bước</span>`}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="space-y-1.5 pt-1">
            <span class="text-xs font-bold text-slate-600 block">Các trận đấu vòng tròn:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${grpMatches.map(([key, gm]) => renderMatchCard(gm, key, '', true)).join('')}
            </div>
          </div>
        </div>
      `;
    });

    groupHtml += '</div>';

    // PLAYOFF 4 ĐỘI
    const sf1 = matches.sf1 || {};
    const sf2 = matches.sf2 || {};
    const thirdMatch = matches.third || {};

    groupHtml += `
      <div class="pt-5 border-t border-slate-200 space-y-3.5">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 class="text-sm font-black text-slate-900 flex items-center gap-2">
              <span class="text-lg">⚡</span>
              <span>VÒNG PLAYOFF: BÁN KẾT ➔ CHUNG KẾT & TRANH HẠNG BA</span>
            </h4>
            <p class="text-xs text-slate-500">Hai đội thua ở Bán kết tự động chuyển vào trận Tranh Hạng Ba 🥉</p>
          </div>
        </div>

        <div class="flex items-center justify-between gap-6 overflow-x-auto pb-2">
          <!-- Bán kết SF -->
          <div class="space-y-3 w-[250px] shrink-0">
            <div class="text-center font-black text-xs text-blue-900 bg-blue-50 py-1.5 px-3 rounded-xl border border-blue-200 uppercase">
              ⚡ Bán Kết (SF1 & SF2)
            </div>
            <div class="space-y-3">
              ${renderMatchCard(sf1, 'sf1', 'Vào Chung Kết')}
              ${renderMatchCard(sf2, 'sf2', 'Vào Chung Kết')}
            </div>
          </div>

          <div class="text-slate-300 font-bold text-lg shrink-0">➔</div>

          <!-- Chung kết & Tranh hạng ba -->
          <div class="space-y-3 w-[260px] shrink-0">
            <div class="text-center font-black text-xs text-amber-900 bg-amber-50 py-1.5 px-3 rounded-xl border border-amber-200 uppercase">
              🏆 Chung Kết & Hạng Ba
            </div>
            <div class="space-y-3">
              <div class="p-1 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-2xl shadow-md border-2 border-amber-400">
                ${renderMatchCard(finalMatch, 'final', '🏆 VÔ ĐỊCH')}
              </div>
              <div class="pt-1">
                <span class="text-[10px] font-black text-amber-900 uppercase block mb-1">🥉 Tranh Hạng Ba:</span>
                <div class="p-1 bg-amber-50 rounded-2xl border-2 border-amber-300">
                  ${renderMatchCard(thirdMatch, 'third', '🥉 HẠNG BA')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    groupHtml += '</div>';
    container.innerHTML = groupHtml;
    return;
  }

  // =================== TRƯỜNG HỢP 3: LOẠI TRỰC TIẾP (KNOCKOUT QF -> SF -> CK) ===================
  const qf1 = matches.qf1 || {};
  const qf2 = matches.qf2 || {};
  const qf3 = matches.qf3 || {};
  const qf4 = matches.qf4 || {};
  const sf1 = matches.sf1 || {};
  const sf2 = matches.sf2 || {};
  const thirdMatch = matches.third || {};

  container.innerHTML = `
    <div class="min-w-[880px] py-3 px-1 space-y-5">
      <div class="flex items-center justify-between gap-5">
        <!-- Cột 1: TỨ KẾT (QF) -->
        <div class="space-y-3 w-[250px] shrink-0">
          <div class="text-center font-black text-xs text-purple-900 bg-purple-50 py-1.5 px-3 rounded-xl border border-purple-200 uppercase tracking-wide">
            ⚔️ Vòng Tứ Kết (QF1 - QF4)
          </div>
          <div class="space-y-2">
            ${renderMatchCard(qf1, 'qf1', 'Vào Bán Kết 1')}
            ${renderMatchCard(qf2, 'qf2', 'Vào Bán Kết 1')}
          </div>
          <div class="py-1"></div>
          <div class="space-y-2">
            ${renderMatchCard(qf3, 'qf3', 'Vào Bán Kết 2')}
            ${renderMatchCard(qf4, 'qf4', 'Vào Bán Kết 2')}
          </div>
        </div>

        <div class="flex flex-col justify-around h-full space-y-16 text-slate-300 font-bold text-lg shrink-0">
          <div>➔</div>
          <div>➔</div>
        </div>

        <!-- Cột 2: BÁN KẾT (SF) -->
        <div class="space-y-4 w-[250px] shrink-0">
          <div class="text-center font-black text-xs text-blue-900 bg-blue-50 py-1.5 px-3 rounded-xl border border-blue-200 uppercase tracking-wide">
            ⚡ Vòng Bán Kết (SF1 & SF2)
          </div>
          <div class="space-y-14 pt-4">
            ${renderMatchCard(sf1, 'sf1', 'Vào Chung Kết Cúp')}
            ${renderMatchCard(sf2, 'sf2', 'Vào Chung Kết Cúp')}
          </div>
        </div>

        <div class="flex flex-col justify-around h-full space-y-16 text-slate-300 font-bold text-lg shrink-0">
          <div>➔</div>
        </div>

        <!-- Cột 3: CHUNG KẾT & TRANH HẠNG BA -->
        <div class="space-y-4 w-[260px] shrink-0">
          <div class="text-center font-black text-xs text-amber-900 bg-amber-50 py-1.5 px-3 rounded-xl border border-amber-200 uppercase tracking-wide">
            🏆 Chung Kết & Hạng Ba
          </div>
          <div class="space-y-4 pt-1">
            <div class="p-1 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-2xl shadow-md border-2 border-amber-400">
              ${renderMatchCard(finalMatch, 'final', '🏆 VÔ ĐỊCH CLB')}
            </div>
            <div class="pt-2 border-t border-slate-100">
              <span class="text-[10px] font-black text-amber-900 uppercase block mb-1">🥉 Trận Tranh Hạng Ba:</span>
              <div class="p-1 bg-amber-50 rounded-2xl border-2 border-amber-300">
                ${renderMatchCard(thirdMatch, 'third', '🥉 HẠNG BA')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Cập nhật tỉ số trận đấu và tự động đẩy người thắng
 */
function updateMatchScoreSet(discId, matchKey, setNum, s1, s2, isGroup = false) {
  const tour = getActiveTournament();
  if (!tour) return;
  const disc = tour.disciplines.find(d => d.id === discId);
  if (!disc) return;

  const targetCollection = isGroup ? disc.groupMatches : disc.matches;
  if (!targetCollection) return;
  const m = targetCollection[matchKey];
  if (!m) return;

  if (!m[`set${setNum}`]) m[`set${setNum}`] = [0, 0];
  if (s1 !== null && s1 !== undefined) m[`set${setNum}`][0] = parseInt(s1) || 0;
  if (s2 !== null && s2 !== undefined) m[`set${setNum}`][1] = parseInt(s2) || 0;

  evaluateMatchWinner(m, tour.matchRules);

  // Tự động đẩy nhánh kế tiếp nếu là Knockout hoặc Playoff
  if (!isGroup && disc.matches) {
    if (m.winner) {
      if (matchKey === 'qf1' && disc.matches.sf1) disc.matches.sf1.team1 = m.winner;
      if (matchKey === 'qf2' && disc.matches.sf1) disc.matches.sf1.team2 = m.winner;
      if (matchKey === 'qf3' && disc.matches.sf2) disc.matches.sf2.team1 = m.winner;
      if (matchKey === 'qf4' && disc.matches.sf2) disc.matches.sf2.team2 = m.winner;

      if (matchKey === 'sf1') {
        if (disc.matches.final) disc.matches.final.team1 = m.winner;
        if (disc.matches.third) disc.matches.third.team1 = m.loser;
      }
      if (matchKey === 'sf2') {
        if (disc.matches.final) disc.matches.final.team2 = m.winner;
        if (disc.matches.third) disc.matches.third.team2 = m.loser;
      }
      if (matchKey === 'final') {
        disc.champion = m.winner;
        disc.runnerUp = m.loser;
      }
      if (matchKey === 'third') {
        disc.thirdPlace = m.winner;
      }
    }
  }

  saveTournamentData();
  renderTournamentBracketTab();
  showToast(`Đã lưu tỉ số trận ${m.code || matchKey}!`, 'success');
}

/**
 * Xác định đội thắng trận theo thể lệ giải phong trào (1 set hoặc 3 set, 21-31 điểm chạm)
 */
function evaluateMatchWinner(m, customRules) {
  const tour = getActiveTournament();
  const rules = customRules || tour?.matchRules || { setsMode: 1, pointsToWin: 31, maxPointsCap: 31, ruleType: 'SUDDEN_DEATH' };

  if (rules.setsMode === 1) {
    // 1 Set (Phong trào 31 điểm chạm tối đa hoặc 21 / 25 điểm)
    const s1 = (m.set1 && m.set1[0]) || 0;
    const s2 = (m.set1 && m.set1[1]) || 0;
    const target = rules.pointsToWin || 31;
    const cap = rules.maxPointsCap || target;

    if (s1 >= target || s2 >= target) {
      if (s1 >= cap && s1 > s2) {
        m.winner = m.team1;
        m.loser = m.team2;
        m.status = 'FINISHED';
      } else if (s2 >= cap && s2 > s1) {
        m.winner = m.team2;
        m.loser = m.team1;
        m.status = 'FINISHED';
      } else if (Math.abs(s1 - s2) >= 2) {
        m.winner = s1 > s2 ? m.team1 : m.team2;
        m.loser = s1 > s2 ? m.team2 : m.team1;
        m.status = 'FINISHED';
      }
    } else if (s1 > 0 || s2 > 0) {
      m.status = 'PLAYING';
      m.winner = null;
      m.loser = null;
    }
    return;
  }

  // 3 Set (Thắng 2 set là thắng trận - Chuẩn BWF)
  let winsTeam1 = 0;
  let winsTeam2 = 0;
  const target = rules.pointsToWin || 21;
  const cap = rules.maxPointsCap || 30;

  [m.set1, m.set2, m.set3].forEach(set => {
    if (set && (set[0] > 0 || set[1] > 0)) {
      if (set[0] >= target && set[0] - set[1] >= 2) winsTeam1++;
      else if (set[1] >= target && set[1] - set[0] >= 2) winsTeam2++;
      else if (set[0] >= cap && set[0] > set[1]) winsTeam1++;
      else if (set[1] >= cap && set[1] > set[0]) winsTeam2++;
    }
  });

  if (winsTeam1 >= 2) {
    m.winner = m.team1;
    m.loser = m.team2;
    m.status = 'FINISHED';
  } else if (winsTeam2 >= 2) {
    m.winner = m.team2;
    m.loser = m.team1;
    m.status = 'FINISHED';
  } else if (m.set1 && (m.set1[0] > 0 || m.set1[1] > 0)) {
    m.status = 'PLAYING';
    m.winner = null;
    m.loser = null;
  }
}

// ==========================================
// CÁC HÀM XỬ LÝ THANH CÔNG CỤ HOẠT ĐỘNG TIẾP THEO & MODAL TỈ SỐ
// ==========================================

function toggleMatchRulesDropdown() {
  const menu = document.getElementById('dropdownMatchRulesMenu');
  if (menu) menu.classList.toggle('hidden');
}

/**
 * Đổi nhanh thể lệ thi đấu phong trào (1 set 31đ / 3 set 21đ)
 */
function setQuickMatchRule(setsMode, pointsToWin, maxPointsCap, ruleType = 'SUDDEN_DEATH') {
  const tour = getActiveTournament();
  if (!tour) return;

  tour.matchRules = {
    setsMode,
    pointsToWin,
    maxPointsCap,
    ruleType
  };

  const menu = document.getElementById('dropdownMatchRulesMenu');
  if (menu) menu.classList.add('hidden');

  saveTournamentData();
  renderTournamentModule();
  showToast(`✓ Đã áp dụng thể lệ: ${setsMode} Set chạm ${maxPointsCap} điểm tối đa!`, 'success');
}

function syncMatchRulesFromConfig() {
  const setsMode = parseInt(document.getElementById('cfgTourSetsMode')?.value) || 1;
  const pointsCap = parseInt(document.getElementById('cfgTourPointsCap')?.value) || 31;
  setQuickMatchRule(setsMode, pointsCap, pointsCap, 'SUDDEN_DEATH');
}

/**
 * NÚT 1: Bốc thăm & Phân 4 Bảng (A, B, C, D) + Tạo nhánh Knockout QF -> SF -> Final & Hạng Ba
 */
function autoPartition4Groups() {
  const tour = getActiveTournament();
  const disc = getActiveDiscipline();
  if (!tour || !disc) return;

  const pairs = disc.pairs || [];
  if (pairs.length < 4) {
    showToast('Cần ít nhất 4 đội/cặp đấu để chia 4 bảng!', 'warning');
    return;
  }

  // Khởi tạo 4 bảng A, B, C, D
  const gA = [];
  const gB = [];
  const gC = [];
  const gD = [];

  pairs.forEach((p, idx) => {
    const mod = idx % 4;
    if (mod === 0) gA.push(p.id);
    else if (mod === 1) gB.push(p.id);
    else if (mod === 2) gC.push(p.id);
    else gD.push(p.id);
  });

  disc.groups = [
    { id: 'A', name: 'BẢNG A', pairIds: gA },
    { id: 'B', name: 'BẢNG B', pairIds: gB },
    { id: 'C', name: 'BẢNG C', pairIds: gC },
    { id: 'D', name: 'BẢNG D', pairIds: gD }
  ];

  // Tạo các trận đấu vòng tròn cho từng bảng
  disc.groupMatches = {};
  ['A', 'B', 'C', 'D'].forEach(gid => {
    const grp = disc.groups.find(g => g.id === gid);
    const pIds = grp.pairIds;
    let mCount = 1;
    for (let i = 0; i < pIds.length; i++) {
      for (let j = i + 1; j < pIds.length; j++) {
        const key = `g${gid.toLowerCase()}${mCount}`;
        disc.groupMatches[key] = {
          id: `${disc.id}_G${gid}${mCount}`,
          code: `${gid}${mCount}`,
          group: gid,
          stage: `Vòng Bảng ${gid} - Trận ${mCount}`,
          court: ((mCount - 1) % (tour.courtsCount || 3)) + 1,
          time: '08:00',
          team1: pIds[i],
          team2: pIds[j],
          set1: [0, 0],
          set2: [0, 0],
          set3: [0, 0],
          winner: null,
          loser: null,
          status: 'NOT_STARTED'
        };
        mCount++;
      }
    }
  });

  // Thiết lập nhánh Playoff Knockout 8 đội: QF1..QF4 -> SF1, SF2 -> Chung Kết & Hạng Ba
  disc.matches = {
    qf1: { id: `${disc.id}_QF1`, code: 'QF1', stage: 'Tứ Kết 1 (Nhất A vs Nhì B)', court: 1, time: '10:00', team1: gA[0] || null, team2: gB[1] || null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    qf2: { id: `${disc.id}_QF2`, code: 'QF2', stage: 'Tứ Kết 2 (Nhất C vs Nhì D)', court: 2, time: '10:00', team1: gC[0] || null, team2: gD[1] || null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    qf3: { id: `${disc.id}_QF3`, code: 'QF3', stage: 'Tứ Kết 3 (Nhất B vs Nhì A)', court: 3, time: '10:00', team1: gB[0] || null, team2: gA[1] || null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    qf4: { id: `${disc.id}_QF4`, code: 'QF4', stage: 'Tứ Kết 4 (Nhất D vs Nhì C)', court: 1, time: '10:45', team1: gD[0] || null, team2: gC[1] || null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    sf1: { id: `${disc.id}_SF1`, code: 'SF1', stage: 'Bán Kết 1 (Thắng QF1 vs QF2)', court: 2, time: '11:30', team1: null, team2: null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    sf2: { id: `${disc.id}_SF2`, code: 'SF2', stage: 'Bán Kết 2 (Thắng QF3 vs QF4)', court: 3, time: '11:30', team1: null, team2: null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    final: { id: `${disc.id}_FINAL`, code: 'CK', stage: 'Chung Kết Cúp CLB (Thắng SF1 vs SF2)', court: 1, time: '12:30', team1: null, team2: null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    third: { id: `${disc.id}_THIRD`, code: 'T3', stage: 'Tranh Hạng Ba (Thua SF1 vs SF2)', court: 2, time: '12:30', team1: null, team2: null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' }
  };

  disc.format = 'GROUP_4_KNOCKOUT';
  disc.champion = null;
  disc.runnerUp = null;
  disc.thirdPlace = null;

  // Tự động phân bổ lịch đấu chuẩn khoảng nghỉ
  autoGenerateTournamentSchedule(tour.id, true);

  saveTournamentData();
  renderTournamentModule();
  showToast(`✓ Đã phân 4 Bảng (A, B, C, D) & Tạo nhánh Tứ kết, Bán kết, Chung kết & Tranh Hạng Ba!`, 'success');
}

/**
 * NÚT 2: Phân 2 Bảng (A, B) + Playoff Bán kết & Chung kết
 */
function autoPartition2Groups() {
  const tour = getActiveTournament();
  const disc = getActiveDiscipline();
  if (!tour || !disc) return;

  const pairs = disc.pairs || [];
  if (pairs.length < 2) {
    showToast('Cần ít nhất 2 đội/cặp đấu để chia bảng!', 'warning');
    return;
  }

  const gA = [];
  const gB = [];

  pairs.forEach((p, idx) => {
    if (idx % 2 === 0) gA.push(p.id);
    else gB.push(p.id);
  });

  disc.groups = [
    { id: 'A', name: 'BẢNG A', pairIds: gA },
    { id: 'B', name: 'BẢNG B', pairIds: gB }
  ];

  disc.groupMatches = {};
  ['A', 'B'].forEach(gid => {
    const grp = disc.groups.find(g => g.id === gid);
    const pIds = grp.pairIds;
    let mCount = 1;
    for (let i = 0; i < pIds.length; i++) {
      for (let j = i + 1; j < pIds.length; j++) {
        const key = `g${gid.toLowerCase()}${mCount}`;
        disc.groupMatches[key] = {
          id: `${disc.id}_G${gid}${mCount}`,
          code: `${gid}${mCount}`,
          group: gid,
          stage: `Vòng Bảng ${gid} - Trận ${mCount}`,
          court: ((mCount - 1) % (tour.courtsCount || 3)) + 1,
          time: '08:00',
          team1: pIds[i],
          team2: pIds[j],
          set1: [0, 0],
          set2: [0, 0],
          set3: [0, 0],
          winner: null,
          loser: null,
          status: 'NOT_STARTED'
        };
        mCount++;
      }
    }
  });

  disc.matches = {
    sf1: { id: `${disc.id}_SF1`, code: 'SF1', stage: 'Bán Kết 1 (Nhất A vs Nhì B)', court: 1, time: '10:30', team1: gA[0] || null, team2: gB[1] || null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    sf2: { id: `${disc.id}_SF2`, code: 'SF2', stage: 'Bán Kết 2 (Nhất B vs Nhì A)', court: 2, time: '10:30', team1: gB[0] || null, team2: gA[1] || null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    final: { id: `${disc.id}_FINAL`, code: 'CK', stage: 'Chung Kết Cúp CLB', court: 1, time: '11:45', team1: null, team2: null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    third: { id: `${disc.id}_THIRD`, code: 'T3', stage: 'Tranh Hạng Ba', court: 2, time: '11:45', team1: null, team2: null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' }
  };

  disc.format = 'GROUP_KNOCKOUT';
  disc.champion = null;
  disc.runnerUp = null;
  disc.thirdPlace = null;

  autoGenerateTournamentSchedule(tour.id, true);

  saveTournamentData();
  renderTournamentModule();
  showToast(`✓ Đã phân 2 Bảng (A, B) & Tạo nhánh Playoff SF, Chung kết & Tranh Hạng Ba!`, 'success');
}

/**
 * NÚT 3: Chuyển sang thể thức Đấu Loại Trực Tiếp (Knockout)
 */
function autoSetKnockoutFormat() {
  const tour = getActiveTournament();
  const disc = getActiveDiscipline();
  if (!tour || !disc) return;

  const pairs = disc.pairs || [];
  disc.groups = null;
  disc.groupMatches = null;
  disc.format = 'KNOCKOUT';

  disc.matches = {
    qf1: { id: `${disc.id}_QF1`, code: 'QF1', stage: 'Tứ Kết 1', court: 1, time: '08:30', team1: pairs[0]?.id || null, team2: pairs[1]?.id || null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    qf2: { id: `${disc.id}_QF2`, code: 'QF2', stage: 'Tứ Kết 2', court: 2, time: '08:30', team1: pairs[2]?.id || null, team2: pairs[3]?.id || null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    qf3: { id: `${disc.id}_QF3`, code: 'QF3', stage: 'Tứ Kết 3', court: 3, time: '08:30', team1: pairs[4]?.id || null, team2: pairs[5]?.id || null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    qf4: { id: `${disc.id}_QF4`, code: 'QF4', stage: 'Tứ Kết 4', court: 1, time: '09:15', team1: pairs[6]?.id || null, team2: pairs[7]?.id || null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    sf1: { id: `${disc.id}_SF1`, code: 'SF1', stage: 'Bán Kết 1', court: 2, time: '10:15', team1: null, team2: null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    sf2: { id: `${disc.id}_SF2`, code: 'SF2', stage: 'Bán Kết 2', court: 3, time: '10:15', team1: null, team2: null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    final: { id: `${disc.id}_FINAL`, code: 'CK', stage: 'Chung Kết Cúp CLB', court: 1, time: '11:30', team1: null, team2: null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' },
    third: { id: `${disc.id}_THIRD`, code: 'T3', stage: 'Tranh Hạng Ba', court: 2, time: '11:30', team1: null, team2: null, set1: [0, 0], winner: null, loser: null, status: 'NOT_STARTED' }
  };

  disc.champion = null;
  disc.runnerUp = null;
  disc.thirdPlace = null;

  autoGenerateTournamentSchedule(tour.id, true);

  saveTournamentData();
  renderTournamentModule();
  showToast(`✓ Đã chuyển sang Thể thức Đấu Loại Trực Tiếp (Knockout QF ➔ CK)!`, 'success');
}

/**
 * Mở modal nhập điểm chi tiết (1 Set hoặc 3 Set)
 */
function openEditScoreModal(discId, matchKey, isGroup = false) {
  const tour = getActiveTournament();
  if (!tour) return;
  const disc = tour.disciplines.find(d => d.id === discId);
  if (!disc) return;

  const targetCollection = isGroup ? disc.groupMatches : disc.matches;
  if (!targetCollection) return;
  const m = targetCollection[matchKey];
  if (!m) return;

  const t1 = findTournamentPair(m.team1);
  const t2 = findTournamentPair(m.team2);
  const rules = tour.matchRules || { setsMode: 1, pointsToWin: 31, maxPointsCap: 31 };

  document.getElementById('scoreModalDisciplineId').value = discId;
  document.getElementById('scoreModalMatchKey').value = matchKey;
  document.getElementById('scoreModalIsGroup').value = isGroup ? 'true' : 'false';

  document.getElementById('scoreModalDisciplineBadge').textContent = disc.name.toUpperCase();
  document.getElementById('scoreModalTitle').textContent = `${m.code || matchKey} • ${m.stage}`;
  document.getElementById('scoreModalCourtTimeBadge').textContent = `Sân ${m.court || 1} • ${m.time || '08:00'}`;
  document.getElementById('scoreModalRulesText').textContent = `Thể lệ: ${rules.setsMode === 1 ? '1 Set chạm ' + rules.maxPointsCap + ' điểm' : '3 Set chạm ' + rules.pointsToWin + ' điểm'}`;

  document.getElementById('scoreModalTeam1Club').textContent = t1?.club || 'CLB';
  document.getElementById('scoreModalTeam1Name').textContent = t1?.name || (m.team1Label || 'Đội 1');
  document.getElementById('scoreModalTeam2Club').textContent = t2?.club || 'CLB';
  document.getElementById('scoreModalTeam2Name').textContent = t2?.name || (m.team2Label || 'Đội 2');

  document.getElementById('scoreModalSet1Team1').value = (m.set1 && m.set1[0]) || 0;
  document.getElementById('scoreModalSet1Team2').value = (m.set1 && m.set1[1]) || 0;

  const row2T1 = document.getElementById('scoreModalRowSet2Team1');
  const row2T2 = document.getElementById('scoreModalRowSet2Team2');
  const row3T1 = document.getElementById('scoreModalRowSet3Team1');
  const row3T2 = document.getElementById('scoreModalRowSet3Team2');

  if (rules.setsMode === 3) {
    if (row2T1) row2T1.classList.remove('hidden');
    if (row2T2) row2T2.classList.remove('hidden');
    if (row3T1) row3T1.classList.remove('hidden');
    if (row3T2) row3T2.classList.remove('hidden');
    document.getElementById('scoreModalSet2Team1').value = (m.set2 && m.set2[0]) || 0;
    document.getElementById('scoreModalSet2Team2').value = (m.set2 && m.set2[1]) || 0;
    document.getElementById('scoreModalSet3Team1').value = (m.set3 && m.set3[0]) || 0;
    document.getElementById('scoreModalSet3Team2').value = (m.set3 && m.set3[1]) || 0;
  } else {
    if (row2T1) row2T1.classList.add('hidden');
    if (row2T2) row2T2.classList.add('hidden');
    if (row3T1) row3T1.classList.add('hidden');
    if (row3T2) row3T2.classList.add('hidden');
  }

  document.getElementById('scoreModalStatus').value = m.status || 'FINISHED';

  openModal('modalEditTournamentScore');
}

function quickIncrementScore(inputId, delta) {
  const el = document.getElementById(inputId);
  if (el) {
    el.value = Math.max(0, (parseInt(el.value) || 0) + delta);
  }
}

function quickSetScore(inputId, target) {
  const el = document.getElementById(inputId);
  if (el) {
    el.value = target;
  }
}

function handleScoreModalSubmit(e) {
  e.preventDefault();
  const discId = document.getElementById('scoreModalDisciplineId').value;
  const matchKey = document.getElementById('scoreModalMatchKey').value;
  const isGroup = document.getElementById('scoreModalIsGroup').value === 'true';

  const tour = getActiveTournament();
  if (!tour) return;
  const disc = tour.disciplines.find(d => d.id === discId);
  if (!disc) return;

  const targetCollection = isGroup ? disc.groupMatches : disc.matches;
  if (!targetCollection) return;
  const m = targetCollection[matchKey];
  if (!m) return;

  const s1_1 = parseInt(document.getElementById('scoreModalSet1Team1').value) || 0;
  const s1_2 = parseInt(document.getElementById('scoreModalSet1Team2').value) || 0;
  const s2_1 = parseInt(document.getElementById('scoreModalSet2Team1')?.value) || 0;
  const s2_2 = parseInt(document.getElementById('scoreModalSet2Team2')?.value) || 0;
  const s3_1 = parseInt(document.getElementById('scoreModalSet3Team1')?.value) || 0;
  const s3_2 = parseInt(document.getElementById('scoreModalSet3Team2')?.value) || 0;

  m.set1 = [s1_1, s1_2];
  m.set2 = [s2_1, s2_2];
  m.set3 = [s3_1, s3_2];
  m.status = document.getElementById('scoreModalStatus').value;

  evaluateMatchWinner(m, tour.matchRules);

  // Tự động đẩy người thắng vào vòng kế tiếp
  if (!isGroup && disc.matches && m.winner) {
    if (matchKey === 'qf1' && disc.matches.sf1) disc.matches.sf1.team1 = m.winner;
    if (matchKey === 'qf2' && disc.matches.sf1) disc.matches.sf1.team2 = m.winner;
    if (matchKey === 'qf3' && disc.matches.sf2) disc.matches.sf2.team1 = m.winner;
    if (matchKey === 'qf4' && disc.matches.sf2) disc.matches.sf2.team2 = m.winner;

    if (matchKey === 'sf1') {
      if (disc.matches.final) disc.matches.final.team1 = m.winner;
      if (disc.matches.third) disc.matches.third.team1 = m.loser;
    }
    if (matchKey === 'sf2') {
      if (disc.matches.final) disc.matches.final.team2 = m.winner;
      if (disc.matches.third) disc.matches.third.team2 = m.loser;
    }
    if (matchKey === 'final') {
      disc.champion = m.winner;
      disc.runnerUp = m.loser;
    }
    if (matchKey === 'third') {
      disc.thirdPlace = m.winner;
    }
  }

  saveTournamentData();
  closeModal('modalEditTournamentScore');
  renderTournamentBracketTab();
  renderTournamentAwardsTab();
  showToast(`✓ Đã lưu tỉ số và cập nhật kết quả trận ${m.code || matchKey}!`, 'success');
}

/**
 * Bốc thăm lại nội dung hiện tại
 */
function regenerateActiveDisciplineDraw() {
  const disc = getActiveDiscipline();
  if (!disc || !disc.pairs) return;

  const confirmed = confirm(`Bạn có chắc muốn bốc thăm ngẫu nhiên lại cho nội dung "${disc.name}"? Tỉ số các trận hiện tại sẽ được reset.`);
  if (!confirmed) return;

  // Xáo trộn các cặp không phải hạt giống số 1 và 2
  const fixedSeeds = disc.pairs.filter(p => p.seed === 1 || p.seed === 2);
  const others = disc.pairs.filter(p => p.seed !== 1 && p.seed !== 2).sort(() => Math.random() - 0.5);

  const newOrder = [fixedSeeds[0] || others[0], others[1], others[2], others[3], fixedSeeds[1] || others[4], others[5], others[6], others[7]].filter(Boolean);
  disc.pairs = newOrder;

  // Reset matches
  if (disc.matches) {
    Object.values(disc.matches).forEach(m => {
      m.set1 = [0, 0];
      m.set2 = [0, 0];
      m.set3 = [0, 0];
      m.winner = null;
      m.loser = null;
      m.status = 'NOT_STARTED';
    });
    if (disc.matches.qf1 && disc.pairs.length >= 8) {
      disc.matches.qf1.team1 = disc.pairs[0].id;
      disc.matches.qf1.team2 = disc.pairs[1].id;
      disc.matches.qf2.team1 = disc.pairs[2].id;
      disc.matches.qf2.team2 = disc.pairs[3].id;
      disc.matches.qf3.team1 = disc.pairs[4].id;
      disc.matches.qf3.team2 = disc.pairs[5].id;
      disc.matches.qf4.team1 = disc.pairs[6].id;
      disc.matches.qf4.team2 = disc.pairs[7].id;
      disc.matches.sf1.team1 = null;
      disc.matches.sf1.team2 = null;
      disc.matches.sf2.team1 = null;
      disc.matches.sf2.team2 = null;
      disc.matches.final.team1 = null;
      disc.matches.final.team2 = null;
    }
  }

  saveTournamentData();
  renderTournamentBracketTab();
  showToast(`✓ Đã bốc thăm ngẫu nhiên mới cho nội dung ${disc.name}!`, 'success');
}

// ----------------------------------------------------
// PHÂN HỆ 2: THUẬT TOÁN TỰ TẠO LỊCH THÔNG MINH & KIỂM TRA KHOẢNG NGHỈ
// ----------------------------------------------------

/**
 * Kiểm tra mức độ an toàn thể lực và tính trùng lịch trên toàn bộ giải đấu
 */
function evaluateTournamentScheduleSafety(tour) {
  if (!tour) return { conflicts: [], restWarnings: [], perfect: true };

  const minRest = tour.minRestMinutes || 25;
  const matchDurationMinutes = 35; // Thời lượng quy ước trung bình 1 trận

  // Tập hợp toàn bộ các trận đấu trên mọi nội dung
  const allScheduledMatches = [];
  (tour.disciplines || []).forEach(disc => {
    // Trận vòng bảng
    Object.values(disc.groupMatches || {}).forEach(m => {
      if (m && m.court && m.time) {
        const t1 = disc.pairs?.find(p => p.id === m.team1);
        const t2 = disc.pairs?.find(p => p.id === m.team2);
        allScheduledMatches.push({
          disciplineId: disc.id,
          disciplineName: disc.name,
          match: m,
          playerIds: [...(t1?.playerIds || []), ...(t2?.playerIds || [])],
          court: m.court,
          time: m.time
        });
      }
    });

    // Trận Knockout
    Object.values(disc.matches || {}).forEach(m => {
      if (m && m.court && m.time) {
        const t1 = disc.pairs?.find(p => p.id === m.team1);
        const t2 = disc.pairs?.find(p => p.id === m.team2);
        allScheduledMatches.push({
          disciplineId: disc.id,
          disciplineName: disc.name,
          match: m,
          playerIds: [...(t1?.playerIds || []), ...(t2?.playerIds || [])],
          court: m.court,
          time: m.time
        });
      }
    });
  });

  const conflicts = [];
  const restWarnings = [];

  const timeToMinutes = (str) => {
    const [h, m] = (str || '08:00').split(':').map(Number);
    return (h || 8) * 60 + (m || 0);
  };

  // 1. Kiểm tra trùng giờ cùng thời điểm trên nhiều sân
  for (let i = 0; i < allScheduledMatches.length; i++) {
    for (let j = i + 1; j < allScheduledMatches.length; j++) {
      const m1 = allScheduledMatches[i];
      const m2 = allScheduledMatches[j];

      if (m1.time === m2.time && m1.court !== m2.court) {
        const commonPlayers = m1.playerIds.filter(pid => m2.playerIds.includes(pid));
        if (commonPlayers.length > 0) {
          const pObj = (tour.players || []).find(x => x.id === commonPlayers[0]);
          const playerName = pObj?.name || commonPlayers[0];
          conflicts.push({
            player: playerName,
            time: m1.time,
            m1: `${m1.disciplineName} (Sân ${m1.court})`,
            m2: `${m2.disciplineName} (Sân ${m2.court})`
          });
        }
      }
    }
  }

  // 2. Kiểm tra khoảng nghỉ giữa 2 trận kế tiếp của từng VĐV
  const playerMatchesMap = {};
  allScheduledMatches.forEach(item => {
    item.playerIds.forEach(pid => {
      if (!playerMatchesMap[pid]) playerMatchesMap[pid] = [];
      playerMatchesMap[pid].push(item);
    });
  });

  Object.entries(playerMatchesMap).forEach(([pid, list]) => {
    if (list.length > 1) {
      list.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
      for (let k = 0; k < list.length - 1; k++) {
        const prev = list[k];
        const next = list[k + 1];
        const prevEnd = timeToMinutes(prev.time) + matchDurationMinutes;
        const nextStart = timeToMinutes(next.time);
        const actualRest = nextStart - prevEnd;

        if (actualRest < minRest) {
          const pObj = (tour.players || []).find(x => x.id === pid);
          const playerName = pObj?.name || pid;
          restWarnings.push({
            player: playerName,
            actualRest,
            requiredRest: minRest,
            prevMatch: `${prev.match.code || prev.match.stage} (${prev.time})`,
            nextMatch: `${next.match.code || next.match.stage} (${next.time})`
          });
        }
      }
    }
  });

  return {
    conflicts,
    restWarnings,
    perfect: conflicts.length === 0 && restWarnings.length === 0
  };
}

/**
 * Thuật toán "Tự Tạo Lịch Thi Đấu Thông Minh"
 * Giải bài toán thỏa mãn đồng thời:
 * 1. Không trùng giờ thi đấu trên mọi sân cho bất kỳ VĐV nào
 * 2. Đạt khoảng nghỉ tối thiểu minRestMinutes giữa các trận liên tiếp của cùng 1 VĐV trên TẤT CẢ các nội dung (Đơn + Đôi + XD)
 */
function autoGenerateTournamentSchedule(tourId, silent = false) {
  const tour = TournamentState.tournaments.find(t => t.id === tourId) || getActiveTournament();
  if (!tour) return;
  tour.scheduleAutoGeneratedV2 = true;

  const minRest = tour.minRestMinutes || 25;
  const matchDuration = 35;
  const numCourts = tour.courtsCount || 3;
  const baseStart = 8 * 60; // 08:00

  // Thu thập toàn bộ các trận đấu
  const allMatches = [];
  (tour.disciplines || []).forEach(disc => {
    if (disc.groupMatches) {
      Object.entries(disc.groupMatches).forEach(([k, m]) => {
        allMatches.push({ matchRef: m, key: k, isGroup: true, disciplineId: disc.id, priority: 1 });
      });
    }
    if (disc.matches) {
      Object.entries(disc.matches).forEach(([k, m]) => {
        let p = 2; // QF
        if (m.code && m.code.startsWith('SF')) p = 3;
        else if (m.code === 'CK' || m.code === 'T3') p = 4;
        allMatches.push({ matchRef: m, key: k, isGroup: false, disciplineId: disc.id, priority: p });
      });
    }
  });

  // Ưu tiên: Vòng bảng -> Tứ kết -> Bán kết -> Chung kết
  allMatches.sort((a, b) => a.priority - b.priority);

  // Theo dõi lịch bận của từng player: pid -> [{ start, end }]
  const playerBusy = {};
  // Theo dõi lịch bận của từng sân: courtId (1..numCourts) -> [{ start, end }]
  const courtBusy = {};
  for (let c = 1; c <= numCourts; c++) {
    courtBusy[c] = [];
  }

  allMatches.forEach(item => {
    const m = item.matchRef;
    const discipline = tour.disciplines.find(d => d.id === item.disciplineId);
    const p1 = discipline?.pairs?.find(p => p.id === m.team1);
    const p2 = discipline?.pairs?.find(p => p.id === m.team2);
    const playerIds = [
      ...(p1?.playerIds || (m.team1 ? [m.team1] : [])),
      ...(p2?.playerIds || (m.team2 ? [m.team2] : []))
    ];

    let startOffset = 0;
    if (item.priority === 2) startOffset = 45;   // QF bắt đầu sau loạt đầu vòng bảng
    if (item.priority === 3) startOffset = 150;  // SF bắt đầu sau QF
    if (item.priority === 4) startOffset = 250;  // Final bắt đầu sau SF

    let candidateTime = baseStart + startOffset;
    let placed = false;

    while (!placed && candidateTime <= baseStart + 960) {
      // 1. Kiểm tra tất cả VĐV có rảnh và đủ khoảng nghỉ không
      let canPlayersPlay = true;
      for (const pid of playerIds) {
        const intervals = playerBusy[pid] || [];
        for (const iv of intervals) {
          // Trùng giờ
          if (candidateTime < iv.end && (candidateTime + matchDuration) > iv.start) {
            canPlayersPlay = false;
            break;
          }
          // Khoảng nghỉ sau trận trước
          if (candidateTime >= iv.end && (candidateTime - iv.end) < minRest) {
            canPlayersPlay = false;
            break;
          }
          // Khoảng nghỉ trước trận sau
          if ((candidateTime + matchDuration) <= iv.start && (iv.start - (candidateTime + matchDuration)) < minRest) {
            canPlayersPlay = false;
            break;
          }
        }
        if (!canPlayersPlay) break;
      }

      // 2. Nếu VĐV rảnh, tìm sân trống tại candidateTime
      if (canPlayersPlay) {
        let chosenCourt = null;
        for (let c = 1; c <= numCourts; c++) {
          const cIntervals = courtBusy[c] || [];
          const courtOverlaps = cIntervals.some(iv => 
            candidateTime < iv.end && (candidateTime + matchDuration) > iv.start
          );
          if (!courtOverlaps) {
            chosenCourt = c;
            break;
          }
        }

        if (chosenCourt) {
          const timeStr = `${String(Math.floor(candidateTime / 60)).padStart(2, '0')}:${String(candidateTime % 60).padStart(2, '0')}`;
          m.court = chosenCourt;
          m.time = timeStr;

          const mInterval = { start: candidateTime, end: candidateTime + matchDuration };
          for (const pid of playerIds) {
            if (!playerBusy[pid]) playerBusy[pid] = [];
            playerBusy[pid].push(mInterval);
          }
          courtBusy[chosenCourt].push(mInterval);
          placed = true;
          break;
        }
      }

      candidateTime += 5;
    }
  });

  saveTournamentData();
  if (!silent) {
    renderTournamentScheduleTab();
    showToast('✓ Đã tự động tạo lịch thi đấu thông minh! 100% không trùng giờ và đạt chuẩn thời gian nghỉ.', 'success');
  }
}

function autoGenerateSmartSchedule() {
  autoGenerateTournamentSchedule(TournamentState.activeTournamentId);
}

/**
 * Render Giao diện Xếp Lịch & Phân Bổ Sân Đấu
 */
function renderTournamentScheduleTab() {
  const tour = getActiveTournament();
  const container = document.getElementById('tourScheduleCourtsContainer');
  const restBadge = document.getElementById('tourScheduleRestTimeBadge');
  const statusBadge = document.getElementById('tourConflictStatusBadge');
  const detailText = document.getElementById('tourConflictDetailText');

  if (!tour || !container) return;

  if (restBadge) restBadge.textContent = `≥ ${tour.minRestMinutes || 25} phút`;

  const safety = evaluateTournamentScheduleSafety(tour);

  if (statusBadge && detailText) {
    if (safety.perfect) {
      statusBadge.textContent = '✓ Hoàn hảo (0 vi phạm)';
      statusBadge.className = 'text-emerald-700 font-black';
      detailText.textContent = `Mọi VĐV đều có đủ thời gian nghỉ ngơi (≥ ${tour.minRestMinutes || 25}p) và không trùng giờ thi đấu đa nội dung.`;
    } else {
      statusBadge.textContent = `⚠️ Có ${safety.conflicts.length} trùng lịch & ${safety.restWarnings.length} vi phạm nghỉ!`;
      statusBadge.className = 'text-rose-600 font-black';
      detailText.textContent = 'Bấm "Tự động tối ưu lịch thi đấu" để hệ thống tự động tính toán lại và loại bỏ triệt để!';
    }
  }

  // Phân bổ trận đấu theo từng Sân (Courts)
  const courtsCount = tour.courtsCount || 3;
  let courtsHtml = '';

  for (let c = 1; c <= courtsCount; c++) {
    const courtMatches = [];
    (tour.disciplines || []).forEach(disc => {
      // Vòng bảng
      Object.values(disc.groupMatches || {}).forEach(m => {
        if (m && m.court === c) {
          courtMatches.push({ ...m, disciplineName: disc.name, disciplineId: disc.id, pairs: disc.pairs });
        }
      });
      // Knockout
      Object.values(disc.matches || {}).forEach(m => {
        if (m && m.court === c) {
          courtMatches.push({ ...m, disciplineName: disc.name, disciplineId: disc.id, pairs: disc.pairs });
        }
      });
    });

    courtMatches.sort((a, b) => (a.time || '08:00').localeCompare(b.time || '08:00'));

    courtsHtml += `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div class="p-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black">
              ${c}
            </span>
            <b class="text-xs font-black">SÂN THI ĐẤU ${c}</b>
          </div>
          <span class="text-[10px] text-emerald-300 font-bold bg-white/10 px-2 py-0.5 rounded-full">
            ${courtMatches.length} trận đấu
          </span>
        </div>

        <div class="p-3 space-y-2.5 flex-1 bg-slate-50/50">
          ${courtMatches.length === 0 ? `
            <div class="p-8 text-center text-slate-400 italic text-xs">Chưa có trận đấu nào trên Sân ${c}</div>
          ` : courtMatches.map(m => {
            const t1 = m.pairs?.find(p => p.id === m.team1);
            const t2 = m.pairs?.find(p => p.id === m.team2);
            const t1Name = t1 ? t1.chipName || t1.name : (m.team1Label || 'Chờ xác định');
            const t2Name = t2 ? t2.chipName || t2.name : (m.team2Label || 'Chờ xác định');

            return `
              <div class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 text-xs hover:border-purple-300 transition">
                <div class="flex items-center justify-between text-xs font-bold">
                  <span class="text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[11px]">${m.disciplineName} • ${m.stage}</span>
                  <span class="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 font-black text-xs">
                    <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-500"></i> ${m.time}
                  </span>
                </div>

                <div class="flex items-center justify-between gap-1.5 text-xs font-bold pt-1">
                  <div class="truncate text-slate-900 ${m.winner === m.team1 ? 'text-emerald-700 font-black' : ''}">
                    ${m.winner === m.team1 ? '👑 ' : ''}${escapeHtml(t1Name)}
                  </div>
                  <span class="text-slate-400 text-xs shrink-0 font-semibold">vs</span>
                  <div class="truncate text-slate-900 text-right ${m.winner === m.team2 ? 'text-emerald-700 font-black' : ''}">
                    ${m.winner === m.team2 ? '👑 ' : ''}${escapeHtml(t2Name)}
                  </div>
                </div>

                <div class="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-1">
                  <span class="text-emerald-700 font-bold">✓ Nghỉ: Đạt chuẩn (≥ 25p)</span>
                  <span class="${m.status === 'FINISHED' ? 'text-emerald-700 font-black bg-emerald-50 px-1.5 py-0.2 rounded' : 'text-slate-400'}">
                    ${m.status === 'FINISHED' ? '✓ Đã đấu' : 'Chờ đấu'}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = courtsHtml;
}

// ----------------------------------------------------
// PHÂN HỆ 3: QUẢN LÝ CLB & ĐĂNG KÝ VẬN ĐỘNG VIÊN
// ----------------------------------------------------

/**
 * Render Giao diện Quản lý CLB & Đăng ký VĐV (☑ CLB A, ☑ CLB B, ☑ CLB C...)
 */
function renderTournamentClubsTab() {
  const container = document.getElementById('tourClubsListContainer');
  const countBadge = document.getElementById('tourParticipatingClubsCountBadge');
  const tour = getActiveTournament();
  if (!container || !tour) return;

  const clubs = tour.clubs || [];
  const players = tour.players || [];
  const registrations = tour.registrations || [];

  const participatingCount = clubs.filter(c => c.participating !== false).length;
  if (countBadge) countBadge.textContent = `${participatingCount} / ${clubs.length} CLB tham gia`;

  // Cập nhật scope cards
  ['INTERNAL', 'MULTI_CLUB', 'OPEN', 'FRIENDLY'].forEach(sc => {
    const btn = document.getElementById(`btnScopeCard-${sc}`);
    if (btn) {
      if (tour.scope === sc) {
        btn.className = 'px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1 cursor-pointer bg-purple-700 text-white border-purple-700 shadow-xs';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1 cursor-pointer bg-white text-slate-700 border-slate-200 hover:bg-slate-50';
      }
    }
  });

  container.innerHTML = clubs.map((club, idx) => {
    const isChecked = club.participating !== false;
    const clubPlayers = players.filter(p => p.clubId === club.id);
    const maleCount = clubPlayers.filter(p => p.gender !== 'FEMALE').length;
    const femaleCount = clubPlayers.filter(p => p.gender === 'FEMALE').length;

    return `
      <div class="p-3.5 bg-white rounded-2xl border ${isChecked ? 'border-purple-200 shadow-xs' : 'border-slate-200 opacity-60'} space-y-3 transition">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <input type="checkbox" id="chkClub-${club.id}" ${isChecked ? 'checked' : ''} onchange="toggleClubParticipation('${club.id}')" class="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer" />
            <div>
              <b class="text-slate-900 text-sm font-black flex items-center gap-1.5">
                <span>🏸 ${escapeHtml(club.name)}</span>
                <span class="text-xs text-slate-400 font-semibold">[${club.id}]</span>
                <span class="text-sm">${club.country === 'KR' ? '🇰🇷' : (club.country === 'JP' ? '🇯🇵' : (club.country === 'TH' ? '🇹🇭' : '🇻🇳'))}</span>
              </b>
              <span class="text-xs text-slate-500 block">Liên hệ: ${escapeHtml(club.contact || 'Ban đại diện')}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <div class="flex items-center gap-1.5 bg-purple-50/80 px-2.5 py-1 rounded-full border border-purple-200 text-xs">
              <span class="font-black text-purple-900">${clubPlayers.length} VĐV</span>
              <span class="text-purple-300">•</span>
              <span class="font-bold text-blue-700">👨 ${maleCount} Nam</span>
              <span class="text-purple-300">•</span>
              <span class="font-bold text-pink-700">👩 ${femaleCount} Nữ</span>
            </div>
            <button type="button" onclick="toggleClubRosterAccordion('${club.id}')" class="text-xs text-purple-700 hover:text-purple-900 font-bold cursor-pointer px-2 py-1 rounded-lg hover:bg-purple-50 transition">
              Chi tiết ▾
            </button>
          </div>
        </div>

        <!-- Accordion Danh Sách VĐV của CLB này -->
        <div id="roster-${club.id}" class="pt-2 border-t border-slate-100">
          ${clubPlayers.length === 0 ? `
            <div class="p-2 text-center text-slate-400 italic text-xs">Chưa có VĐV nào đăng ký từ CLB này</div>
          ` : `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              ${clubPlayers.map((p, pIdx) => {
                const reg = registrations.find(r => r.playerId === p.id);
                const isMale = p.gender !== 'FEMALE';
                const discBadges = (reg?.disciplines || ['MD']).map(d => {
                  if (d === 'MD') return `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${isMale ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'bg-purple-100 text-purple-900 border border-purple-200'}">${isMale ? 'Đôi Nam' : 'Đôi Nữ'}</span>`;
                  if (d === 'MS') return `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">${isMale ? 'Đơn Nam' : 'Đơn Nữ'}</span>`;
                  if (d === 'XD') return '<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-pink-100 text-pink-900 border border-pink-200">Đôi Nam Nữ</span>';
                  return `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-800">${d}</span>`;
                }).join(' ');

                return `
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 hover:border-purple-200 transition">
                    <div class="flex items-center justify-between">
                      <b class="text-slate-900 text-xs font-bold truncate flex items-center gap-1" title="${p.name}">
                        <span>${pIdx + 1}. ${escapeHtml(p.name)}</span>
                      </b>
                      <div class="flex items-center gap-1 shrink-0">
                        ${isMale ? `
                          <span class="px-1.5 py-0.2 rounded text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">👨 Nam</span>
                        ` : `
                          <span class="px-1.5 py-0.2 rounded text-[10px] font-black bg-pink-100 text-pink-800 border border-pink-200">👩 Nữ</span>
                        `}
                        <span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-50 text-amber-900 border border-amber-200">${escapeHtml(p.level || 'A')}</span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between gap-1 flex-wrap pt-0.5">
                      <div class="flex items-center gap-1 flex-wrap">
                        ${discBadges}
                      </div>
                      <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">✓ Đã duyệt</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Toggle trạng thái tham gia giải đấu của CLB
 */
function toggleClubParticipation(clubId) {
  const tour = getActiveTournament();
  if (!tour || !tour.clubs) return;
  const club = tour.clubs.find(c => c.id === clubId);
  if (!club) return;

  club.participating = club.participating === false ? true : false;
  saveTournamentData();
  renderTournamentClubsTab();
  showToast(`Đã ${club.participating ? 'bật' : 'tắt'} đăng ký tham gia giải cho ${club.name}!`, 'info');
}

function toggleClubRosterAccordion(clubId) {
  const el = document.getElementById(`roster-${clubId}`);
  if (el) el.classList.toggle('hidden');
}

function selectTourOrganizerScope(scopeId) {
  const tour = getActiveTournament();
  if (!tour) return;
  tour.scope = scopeId;
  saveTournamentData();
  renderTournamentModule();
  showToast(`Đã chọn mô hình: ${TOURNAMENT_SCOPES.find(s => s.id === scopeId)?.label || scopeId}`, 'success');
}

/**
 * Render danh sách VĐV và cặp đấu
 */
function renderTournamentPlayersTab() {
  const container = document.getElementById('tourPlayersAndPairsContainer');
  const disc = getActiveDiscipline();
  const tour = getActiveTournament();
  if (!container || !disc || !tour) return;

  const pairs = disc.pairs || [];

  container.innerHTML = `
    <div class="space-y-3">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2 text-xs">
        <div class="flex items-center gap-2">
          <span class="font-bold text-slate-700">Nội dung: <b class="text-purple-900">${disc.name}</b></span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
            Tổng ${pairs.length} cặp đấu
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        ${pairs.map((p, idx) => `
          <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 hover:border-purple-300 transition">
            <div class="flex items-center justify-between">
              <span class="w-5 h-5 rounded-md bg-purple-100 text-purple-900 flex items-center justify-center font-black text-[10px]">
                ${idx + 1}
              </span>
              ${p.seed > 0 ? `
                <span class="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                  Hạt giống số ${p.seed}
                </span>
              ` : `
                <span class="text-[9px] text-slate-400 font-semibold">Tự do</span>
              `}
            </div>

            <b class="text-slate-900 block truncate" title="${p.name}">${p.name}</b>

            <div class="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
              <span class="font-bold text-indigo-700">CLB: ${p.club || 'Smash'}</span>
              <span>${p.country === 'KR' ? '🇰🇷 Hàn Quốc' : (p.country === 'JP' ? '🇯🇵 Nhật Bản' : (p.country === 'TH' ? '🇹🇭 Thái Lan' : '🇻🇳 Việt Nam'))}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================
// QUẢN LÝ ĐĂNG KÝ CLB & VĐV THEO GIỚI TÍNH
// ==========================================
let clubModalTempMembers = [];
let currentTempMemberGender = 'MALE';
let currentClubModalFilter = 'ALL';

function openAddClubModal() {
  clubModalTempMembers = [];
  currentTempMemberGender = 'MALE';
  currentClubModalFilter = 'ALL';

  const form = document.getElementById('formAddTournamentClub');
  if (form) form.reset();

  const nameInput = document.getElementById('tourNewClubName');
  if (nameInput) nameInput.value = '';
  const codeInput = document.getElementById('tourNewClubCode');
  if (codeInput) codeInput.value = '';
  const contactInput = document.getElementById('tourNewClubContact');
  if (contactInput) contactInput.value = '';

  const batchPanel = document.getElementById('panelBatchImportMembers');
  if (batchPanel) batchPanel.classList.add('hidden');

  setTempMemberGender('MALE');
  renderClubModalTempMembers();
  openModal('modalAddTournamentClub');
}

function setTempMemberGender(gender) {
  currentTempMemberGender = gender;
  const btnM = document.getElementById('btnGenderMale');
  const btnF = document.getElementById('btnGenderFemale');
  const lblMD = document.getElementById('labelTempMD');
  const lblMS = document.getElementById('labelTempMS');

  if (gender === 'MALE') {
    if (btnM) btnM.className = 'px-2.5 py-1 rounded-md text-[11px] font-black transition cursor-pointer bg-blue-600 text-white shadow-xs flex items-center gap-1';
    if (btnF) btnF.className = 'px-2.5 py-1 rounded-md text-[11px] font-black transition cursor-pointer text-slate-600 hover:bg-slate-100 flex items-center gap-1';
    if (lblMD) lblMD.textContent = 'Đôi Nam (MD)';
    if (lblMS) lblMS.textContent = 'Đơn Nam (MS)';
  } else {
    if (btnF) btnF.className = 'px-2.5 py-1 rounded-md text-[11px] font-black transition cursor-pointer bg-pink-600 text-white shadow-xs flex items-center gap-1';
    if (btnM) btnM.className = 'px-2.5 py-1 rounded-md text-[11px] font-black transition cursor-pointer text-slate-600 hover:bg-slate-100 flex items-center gap-1';
    if (lblMD) lblMD.textContent = 'Đôi Nữ (WD / MD)';
    if (lblMS) lblMS.textContent = 'Đơn Nữ (WS / MS)';
  }
}

function autoSuggestClubCode(name) {
  const codeInput = document.getElementById('tourNewClubCode');
  if (!codeInput) return;
  if (!name.trim()) {
    codeInput.value = '';
    return;
  }
  const clean = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  const words = clean.trim().split(/\s+/).filter(w => !['CLB', 'CAU', 'LONG'].includes(w.toUpperCase()));
  if (words.length === 0) {
    codeInput.value = 'CLB_' + Math.floor(100 + Math.random() * 900);
  } else if (words.length === 1) {
    codeInput.value = words[0].substring(0, 6).toUpperCase();
  } else {
    codeInput.value = words.map(w => w[0]).join('').toUpperCase();
  }
}

function addMemberToClubTempList() {
  const nameInput = document.getElementById('tempMemberName');
  const levelSelect = document.getElementById('tempMemberLevel');
  const phoneInput = document.getElementById('tempMemberPhone');

  if (!nameInput) return;
  const name = nameInput.value.trim();
  if (!name) {
    showToast('Vui lòng nhập họ và tên VĐV!', 'warning');
    nameInput.focus();
    return;
  }

  const level = levelSelect ? levelSelect.value : 'A';
  const phone = phoneInput ? phoneInput.value.trim() : '';

  const disciplines = [];
  if (document.getElementById('tempMemberDisciplineMD')?.checked) disciplines.push('MD');
  if (document.getElementById('tempMemberDisciplineMS')?.checked) disciplines.push('MS');
  if (document.getElementById('tempMemberDisciplineXD')?.checked) disciplines.push('XD');

  if (disciplines.length === 0) {
    disciplines.push('MD');
  }

  clubModalTempMembers.push({
    id: `TEMP_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name,
    gender: currentTempMemberGender,
    level,
    phone,
    disciplines
  });

  nameInput.value = '';
  if (phoneInput) phoneInput.value = '';
  nameInput.focus();

  renderClubModalTempMembers();
  showToast(`✓ Đã thêm ${currentTempMemberGender === 'MALE' ? '👨 VĐV Nam' : '👩 VĐV Nữ'}: ${name}`, 'info');
}

function loadSampleClubMembers() {
  const nameInput = document.getElementById('tourNewClubName');
  const codeInput = document.getElementById('tourNewClubCode');
  const contactInput = document.getElementById('tourNewClubContact');

  if (nameInput && !nameInput.value.trim()) {
    nameInput.value = 'CLB Cầu Lông Ngôi Sao Thủ Đô';
    autoSuggestClubCode('CLB Cầu Lông Ngôi Sao Thủ Đô');
  }
  if (contactInput && !contactInput.value.trim()) {
    contactInput.value = 'Nguyễn Hoàng Sơn (Trưởng đoàn - 0989.888.999)';
  }

  clubModalTempMembers = [
    { id: `TEMP_1`, name: 'Nguyễn Văn Hùng', gender: 'MALE', level: 'A+', phone: '0988.333.111', disciplines: ['MD', 'MS', 'XD'] },
    { id: `TEMP_2`, name: 'Trần Văn Dũng', gender: 'MALE', level: 'A', phone: '0988.333.222', disciplines: ['MD', 'MS', 'XD'] },
    { id: `TEMP_3`, name: 'Lê Hoàng Long', gender: 'MALE', level: 'B+', phone: '0988.333.333', disciplines: ['MD', 'XD'] },
    { id: `TEMP_4`, name: 'Phạm Quang Huy', gender: 'MALE', level: 'B', phone: '0988.333.444', disciplines: ['MD'] },
    { id: `TEMP_5`, name: 'Nguyễn Thị Mai', gender: 'FEMALE', level: 'A', phone: '0988.333.555', disciplines: ['MD', 'MS', 'XD'] },
    { id: `TEMP_6`, name: 'Đỗ Thu Hà', gender: 'FEMALE', level: 'B+', phone: '0988.333.666', disciplines: ['MD', 'XD'] }
  ];

  renderClubModalTempMembers();
  showToast('✓ Đã nạp danh sách mẫu 4 VĐV Nam & 2 VĐV Nữ!', 'success');
}

function toggleBatchImportClubMembers() {
  const panel = document.getElementById('panelBatchImportMembers');
  if (panel) panel.classList.toggle('hidden');
}

function importBatchClubMembers() {
  const maleTxt = document.getElementById('batchMaleInput')?.value || '';
  const femaleTxt = document.getElementById('batchFemaleInput')?.value || '';

  const maleNames = maleTxt.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  const femaleNames = femaleTxt.split('\n').map(s => s.trim()).filter(s => s.length > 0);

  if (maleNames.length === 0 && femaleNames.length === 0) {
    showToast('Chưa có tên VĐV nào được nhập vào ô!', 'warning');
    return;
  }

  maleNames.forEach((n, idx) => {
    clubModalTempMembers.push({
      id: `BATCH_M_${Date.now()}_${idx}`,
      name: n,
      gender: 'MALE',
      level: 'A',
      phone: '',
      disciplines: ['MD', 'MS', 'XD']
    });
  });

  femaleNames.forEach((n, idx) => {
    clubModalTempMembers.push({
      id: `BATCH_F_${Date.now()}_${idx}`,
      name: n,
      gender: 'FEMALE',
      level: 'A',
      phone: '',
      disciplines: ['MD', 'XD']
    });
  });

  if (document.getElementById('batchMaleInput')) document.getElementById('batchMaleInput').value = '';
  if (document.getElementById('batchFemaleInput')) document.getElementById('batchFemaleInput').value = '';
  toggleBatchImportClubMembers();

  renderClubModalTempMembers();
  showToast(`✓ Đã nạp nhanh ${maleNames.length} Nam & ${femaleNames.length} Nữ vào danh sách!`, 'success');
}

function clearClubTempMembers() {
  if (clubModalTempMembers.length === 0) return;
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách VĐV đang nhập tạm không?')) {
    clubModalTempMembers = [];
    renderClubModalTempMembers();
    showToast('Đã xóa sạch danh sách tạm.', 'info');
  }
}

function removeClubTempMember(id) {
  clubModalTempMembers = clubModalTempMembers.filter(m => m.id !== id);
  renderClubModalTempMembers();
}

function setClubModalFilter(filter) {
  currentClubModalFilter = filter;
  renderClubModalTempMembers();
}

function renderClubModalTempMembers() {
  const container = document.getElementById('clubModalMembersTableContainer');
  const totalBadge = document.getElementById('clubModalTotalBadge');
  const maleBadge = document.getElementById('clubModalMaleBadge');
  const femaleBadge = document.getElementById('clubModalFemaleBadge');
  const countAll = document.getElementById('countFilterAll');
  const countM = document.getElementById('countFilterMale');
  const countF = document.getElementById('countFilterFemale');
  const summaryEl = document.getElementById('clubModalFooterSummary');

  const maleCount = clubModalTempMembers.filter(m => m.gender === 'MALE').length;
  const femaleCount = clubModalTempMembers.filter(m => m.gender === 'FEMALE').length;
  const totalCount = clubModalTempMembers.length;

  if (totalBadge) totalBadge.textContent = totalCount;
  if (maleBadge) maleBadge.textContent = maleCount;
  if (femaleBadge) femaleBadge.textContent = femaleCount;
  if (countAll) countAll.textContent = totalCount;
  if (countM) countM.textContent = maleCount;
  if (countF) countF.textContent = femaleCount;
  if (summaryEl) summaryEl.textContent = `${totalCount} VĐV (${maleCount} Nam, ${femaleCount} Nữ)`;

  // Update filter buttons styling
  ['All', 'Male', 'Female'].forEach(f => {
    const btn = document.getElementById(`filterModal${f}`);
    if (btn) {
      if (currentClubModalFilter.toLowerCase() === f.toLowerCase()) {
        btn.className = 'px-2.5 py-1 rounded-md font-black transition cursor-pointer bg-white text-purple-900 shadow-2xs';
      } else {
        btn.className = 'px-2.5 py-1 rounded-md font-bold transition cursor-pointer text-slate-600 hover:text-purple-700';
      }
    }
  });

  if (!container) return;

  const filtered = clubModalTempMembers.filter(m => {
    if (currentClubModalFilter === 'MALE') return m.gender === 'MALE';
    if (currentClubModalFilter === 'FEMALE') return m.gender === 'FEMALE';
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center space-y-2">
        <span class="text-3xl block">👥</span>
        <div class="font-bold text-slate-700 text-xs">
          ${totalCount === 0 ? 'Chưa có VĐV nào trong danh sách đăng ký' : 'Không có VĐV nào thỏa điều kiện lọc'}
        </div>
        <p class="text-[11px] text-slate-400">
          ${totalCount === 0 ? 'Vui lòng nhập VĐV ở form trên hoặc bấm "⚡ Nạp Mẫu" để điền nhanh' : ''}
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="w-full text-left text-xs border-collapse">
      <thead class="bg-slate-100 text-slate-600 font-bold sticky top-0 z-10 text-[11px]">
        <tr>
          <th class="py-2 px-3 w-10 text-center">#</th>
          <th class="py-2 px-3">Họ và tên VĐV</th>
          <th class="py-2 px-2.5 text-center">Giới tính</th>
          <th class="py-2 px-2.5 text-center">Trình độ</th>
          <th class="py-2 px-3">Nội dung thi đấu</th>
          <th class="py-2 px-2.5 text-right w-12">Thao tác</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        ${filtered.map((m, idx) => {
          const isMale = m.gender === 'MALE';
          const discBadges = (m.disciplines || []).map(d => {
            if (d === 'MD') return `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${isMale ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'bg-purple-100 text-purple-900 border border-purple-200'}">${isMale ? 'Đôi Nam' : 'Đôi Nữ'}</span>`;
            if (d === 'MS') return `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">${isMale ? 'Đơn Nam' : 'Đơn Nữ'}</span>`;
            if (d === 'XD') return `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-pink-100 text-pink-900 border border-pink-200">Đôi Nam Nữ</span>`;
            return `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-800">${d}</span>`;
          }).join(' ');

          return `
            <tr class="hover:bg-slate-50 transition">
              <td class="py-2 px-3 text-center font-bold text-slate-400 text-[11px]">${idx + 1}</td>
              <td class="py-2 px-3 font-bold text-slate-900">
                <div>${escapeHtml(m.name)}</div>
                ${m.phone ? `<span class="text-[10px] text-slate-400 font-normal">📞 ${escapeHtml(m.phone)}</span>` : ''}
              </td>
              <td class="py-2 px-2.5 text-center">
                ${isMale ? `
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                    <span>👨</span> Nam
                  </span>
                ` : `
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-pink-800 border border-pink-200">
                    <span>👩</span> Nữ
                  </span>
                `}
              </td>
              <td class="py-2 px-2.5 text-center">
                <span class="px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-200">
                  ${escapeHtml(m.level || 'A')}
                </span>
              </td>
              <td class="py-2 px-3">
                <div class="flex items-center gap-1 flex-wrap">
                  ${discBadges}
                </div>
              </td>
              <td class="py-2 px-2.5 text-right">
                <button type="button" onclick="removeClubTempMember('${m.id}')" class="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition cursor-pointer" title="Xóa VĐV này">
                  🗑️
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function handleAddNewClubSubmit(e) {
  e.preventDefault();
  const tour = getActiveTournament();
  if (!tour) return;

  const name = document.getElementById('tourNewClubName').value.trim();
  const rawCode = document.getElementById('tourNewClubCode').value.trim();
  const code = (rawCode || `CLB_${Date.now()}`).toUpperCase().replace(/\s+/g, '_');
  const country = document.getElementById('tourNewClubCountry').value;
  const contact = document.getElementById('tourNewClubContact').value.trim();

  if (!name) {
    showToast('Tên CLB không được để trống!', 'warning');
    return;
  }

  if (!tour.clubs) tour.clubs = [];
  if (tour.clubs.some(c => c.id === code)) {
    showToast(`Mã CLB "${code}" đã tồn tại, vui lòng chọn mã khác!`, 'warning');
    return;
  }

  // 1. Lưu CLB mới
  tour.clubs.push({
    id: code,
    name,
    country,
    participating: true,
    contact: contact || `Đại diện CLB ${name}`
  });

  if (!tour.players) tour.players = [];
  if (!tour.registrations) tour.registrations = [];

  // 2. Lưu toàn bộ VĐV trong danh sách tạm đã phân loại theo giới tính
  const addedPlayers = [];
  clubModalTempMembers.forEach((m, idx) => {
    const pId = `${code}_${idx + 1}`;
    const playerObj = {
      id: pId,
      name: m.name,
      chipName: m.name.split(' ').slice(-1)[0] || m.name,
      clubId: code,
      countryId: country,
      level: m.level || 'A',
      phone: m.phone || '',
      gender: m.gender || 'MALE'
    };
    tour.players.push(playerObj);
    addedPlayers.push(playerObj);

    tour.registrations.push({
      id: `REG_${code}_${idx + 1}`,
      playerId: pId,
      clubId: code,
      disciplines: m.disciplines && m.disciplines.length > 0 ? m.disciplines : ['MD'],
      status: 'CONFIRMED'
    });
  });

  // 3. Tự động ghép cặp đôi / đơn cho CLB mới nếu có nội dung thi đấu
  if (tour.disciplines) {
    const mdMale = addedPlayers.filter(p => p.gender === 'MALE');
    const mdFemale = addedPlayers.filter(p => p.gender === 'FEMALE');

    const discMD = tour.disciplines.find(d => d.id === 'MD');
    if (discMD && discMD.pairs && mdMale.length >= 2) {
      const pairId = `P_MD_${code}_${Date.now() % 1000}`;
      discMD.pairs.push({
        id: pairId,
        name: `${mdMale[0].chipName} & ${mdMale[1].chipName} (${name})`,
        chipName: `${mdMale[0].chipName} & ${mdMale[1].chipName}`,
        club: name,
        country,
        seed: 0,
        playerIds: [mdMale[0].id, mdMale[1].id]
      });
    }

    const discXD = tour.disciplines.find(d => d.id === 'XD');
    if (discXD && discXD.pairs && mdMale.length >= 1 && mdFemale.length >= 1) {
      const pairId = `P_XD_${code}_${Date.now() % 1000}`;
      discXD.pairs.push({
        id: pairId,
        name: `${mdMale[0].chipName} & ${mdFemale[0].chipName} (${name})`,
        chipName: `${mdMale[0].chipName} & ${mdFemale[0].chipName}`,
        club: name,
        country,
        seed: 0,
        playerIds: [mdMale[0].id, mdFemale[0].id]
      });
    }

    const discMS = tour.disciplines.find(d => d.id === 'MS');
    if (discMS && discMS.pairs && mdMale.length >= 1) {
      const pairId = `P_MS_${code}_${Date.now() % 1000}`;
      discMS.pairs.push({
        id: pairId,
        name: `${mdMale[0].name} (${name})`,
        chipName: mdMale[0].chipName,
        club: name,
        country,
        seed: 0,
        playerIds: [mdMale[0].id]
      });
    }
  }

  const maleCount = clubModalTempMembers.filter(m => m.gender === 'MALE').length;
  const femaleCount = clubModalTempMembers.filter(m => m.gender === 'FEMALE').length;

  saveTournamentData();
  closeModal('modalAddTournamentClub');
  renderTournamentClubsTab();
  renderTournamentPlayersTab();

  showToast(`✓ Đã đăng ký CLB "${name}" cùng ${clubModalTempMembers.length} VĐV (${maleCount} Nam, ${femaleCount} Nữ)!`, 'success');
}

function openAddPlayerModal() {
  const tour = getActiveTournament();
  const select = document.getElementById('newPlayerClubSelect');
  if (select && tour && tour.clubs) {
    select.innerHTML = tour.clubs.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }
  openModal('modalAddTournamentPlayer');
}

function handleAddNewPlayerSubmit(e) {
  e.preventDefault();
  const tour = getActiveTournament();
  if (!tour) return;

  const name = document.getElementById('newPlayerName').value.trim();
  const gender = document.getElementById('newPlayerGender')?.value || 'MALE';
  const clubId = document.getElementById('newPlayerClubSelect').value;
  const countryId = document.getElementById('newPlayerCountrySelect').value;

  const disciplines = [];
  if (document.getElementById('chkRegMD')?.checked) disciplines.push('MD');
  if (document.getElementById('chkRegMS')?.checked) disciplines.push('MS');
  if (document.getElementById('chkRegXD')?.checked) disciplines.push('XD');

  if (!name) {
    showToast('Tên VĐV không được để trống!', 'warning');
    return;
  }
  if (disciplines.length === 0) {
    showToast('Vui lòng chọn ít nhất 1 nội dung thi đấu!', 'warning');
    return;
  }

  const pId = `P_${Date.now()}`;
  if (!tour.players) tour.players = [];
  tour.players.push({
    id: pId,
    name,
    chipName: name.split(' ').slice(-1)[0] || name,
    clubId,
    countryId,
    level: 'A',
    phone: '',
    gender
  });

  if (!tour.registrations) tour.registrations = [];
  tour.registrations.push({
    id: `REG_${Date.now()}`,
    playerId: pId,
    clubId,
    disciplines,
    status: 'CONFIRMED'
  });

  saveTournamentData();
  closeModal('modalAddTournamentPlayer');
  renderTournamentClubsTab();
  renderTournamentPlayersTab();
  showToast(`✓ Đã đăng ký ${gender === 'MALE' ? '👨 VĐV Nam' : '👩 VĐV Nữ'} "${name}" vào ${disciplines.length} nội dung!`, 'success');
}

// ----------------------------------------------------
// PHÂN HỆ 4: CẤU HÌNH & TIÊU CHÍ XẾP HẠNG VÒNG BẢNG TÙY BIẾN
// ----------------------------------------------------

/**
 * Render Giao diện Cấu hình và Bảng xếp hạng tùy biến tiêu chí
 */
/**
 * Render Giao diện Cấu hình và Bảng xếp hạng tùy biến tiêu chí
 */
function renderTournamentConfigTab() {
  const tour = getActiveTournament();
  if (!tour) return;

  if (document.getElementById('cfgTourTitle')) document.getElementById('cfgTourTitle').value = tour.title || '';
  if (document.getElementById('cfgTourScope')) document.getElementById('cfgTourScope').value = tour.scope || 'MULTI_CLUB';
  if (document.getElementById('cfgTourDate')) document.getElementById('cfgTourDate').value = tour.date || '2026-09-23';
  if (document.getElementById('cfgTourCourtsCount')) document.getElementById('cfgTourCourtsCount').value = tour.courtsCount || 3;
  if (document.getElementById('cfgTourMinRestMinutes')) document.getElementById('cfgTourMinRestMinutes').value = tour.minRestMinutes || 25;
  if (document.getElementById('cfgTourPrize1')) document.getElementById('cfgTourPrize1').value = tour.prizes?.prize1 || '';
  if (document.getElementById('cfgTourPrize2')) document.getElementById('cfgTourPrize2').value = tour.prizes?.prize2 || '';
  if (document.getElementById('cfgTourPrize3')) document.getElementById('cfgTourPrize3').value = tour.prizes?.prize3 || '';

  if (document.getElementById('cfgTourSetsMode')) document.getElementById('cfgTourSetsMode').value = tour.matchRules?.setsMode || 1;
  if (document.getElementById('cfgTourPointsCap')) document.getElementById('cfgTourPointsCap').value = tour.matchRules?.maxPointsCap || 31;

  // Render danh sách tiêu chí xếp hạng có thể đổi thứ tự ưu tiên
  const container = document.getElementById('tourRankingCriteriaListContainer');
  if (!container) return;

  const currentCriteria = tour.rankingCriteria || ['WINS', 'HEAD_TO_HEAD', 'GAME_DIFF', 'POINT_DIFF', 'POINTS_SCORED', 'FAIR_PLAY'];

  container.innerHTML = currentCriteria.map((cId, idx) => {
    const def = RANKING_CRITERIA_DEFINITIONS.find(d => d.id === cId) || { name: cId, desc: '' };
    return `
      <div class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-purple-100 text-purple-900 font-black text-[11px] flex items-center justify-center shrink-0">
            ${idx + 1}
          </span>
          <div>
            <b class="text-slate-900 block text-xs">${def.name}</b>
            <span class="text-[10px] text-slate-400 block">${def.desc}</span>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button type="button" onclick="moveRankingCriterion(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="p-1 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer" title="Ưu tiên cao hơn">
            ▲
          </button>
          <button type="button" onclick="moveRankingCriterion(${idx}, 1)" ${idx === currentCriteria.length - 1 ? 'disabled' : ''} class="p-1 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer" title="Ưu tiên thấp hơn">
            ▼
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Di chuyển thứ tự ưu tiên tiêu chí xếp hạng
 */
function moveRankingCriterion(index, direction) {
  const tour = getActiveTournament();
  if (!tour || !tour.rankingCriteria) return;

  const targetIdx = index + direction;
  if (targetIdx < 0 || targetIdx >= tour.rankingCriteria.length) return;

  const temp = tour.rankingCriteria[index];
  tour.rankingCriteria[index] = tour.rankingCriteria[targetIdx];
  tour.rankingCriteria[targetIdx] = temp;

  saveTournamentData();
  renderTournamentConfigTab();
  showToast('Đã cập nhật lại độ ưu tiên tiêu chí xếp hạng vòng bảng!', 'info');
}

/**
 * Lưu thông tin cấu hình giải đấu
 */
function saveTournamentGeneralConfig() {
  const tour = getActiveTournament();
  if (!tour) return;

  tour.title = document.getElementById('cfgTourTitle')?.value.trim() || tour.title;
  tour.scope = document.getElementById('cfgTourScope')?.value || tour.scope;
  tour.date = document.getElementById('cfgTourDate')?.value || tour.date;
  tour.courtsCount = parseInt(document.getElementById('cfgTourCourtsCount')?.value) || 3;
  tour.minRestMinutes = parseInt(document.getElementById('cfgTourMinRestMinutes')?.value) || 25;

  const setsMode = parseInt(document.getElementById('cfgTourSetsMode')?.value) || 1;
  const pointsCap = parseInt(document.getElementById('cfgTourPointsCap')?.value) || 31;
  tour.matchRules = { setsMode, pointsToWin: pointsCap, maxPointsCap: pointsCap, ruleType: 'SUDDEN_DEATH' };

  if (!tour.prizes) tour.prizes = {};
  tour.prizes.prize1 = document.getElementById('cfgTourPrize1')?.value.trim() || tour.prizes.prize1;
  tour.prizes.prize2 = document.getElementById('cfgTourPrize2')?.value.trim() || tour.prizes.prize2;
  tour.prizes.prize3 = document.getElementById('cfgTourPrize3')?.value.trim() || tour.prizes.prize3;

  saveTournamentData();
  renderTournamentModule();
  showToast('✓ Đã lưu cấu hình giải đấu thành công!', 'success');
}

// ----------------------------------------------------
// PHÂN HỆ 5: BỤC TRAO GIẢI & XUẤT BÁO CÁO ZALO
// ----------------------------------------------------

/**
 * Render Giao diện Bục Trao Giải với dữ liệu linh động theo nội dung đang chọn
 */
function renderTournamentAwardsTab() {
  const container = document.getElementById('tourPodiumDisplayArea');
  const tour = getActiveTournament();
  const disc = getActiveDiscipline();
  if (!container || !tour) return;

  const cPair = disc?.champion ? findTournamentPair(disc.champion) : null;
  const rPair = disc?.runnerUp ? findTournamentPair(disc.runnerUp) : null;
  const tPair = disc?.thirdPlace ? findTournamentPair(disc.thirdPlace) : null;

  const champName = cPair ? `${cPair.name} (${cPair.club || 'CLB'})` : 'Chờ xác định kết quả';
  const runnerName = rPair ? `${rPair.name} (${rPair.club || 'CLB'})` : 'Chờ xác định kết quả';
  const thirdName = tPair ? `${tPair.name} (${tPair.club || 'CLB'})` : 'Chờ xác định kết quả';

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Podium Danh Dự -->
      <div class="p-6 bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 rounded-2xl text-white shadow-xl border border-indigo-800/40 text-center space-y-6">
        <div>
          <span class="text-xs font-black uppercase tracking-wider text-amber-400 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            BẢNG VÀNG DANH DỰ CÚP CLB • NỘI DUNG: ${disc?.name?.toUpperCase() || ''}
          </span>
          <h2 class="text-xl font-black text-white mt-2">${escapeHtml(tour.title)}</h2>
        </div>

        <!-- 3 Bậc Vinh Danh Podium -->
        <div class="flex items-end justify-center gap-3 sm:gap-6 pt-4 max-w-2xl mx-auto">
          
          <!-- Hạng Nhì (Bên Trái) -->
          <div class="flex-1 flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-black text-lg shadow-lg mb-2 border-2 border-slate-300">
              🥈
            </div>
            <div class="w-full bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-slate-700/60 shadow-md text-center space-y-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-700 text-slate-200">Á Quân (Giải Nhì)</span>
              <b class="text-xs font-bold text-white block truncate" id="awardNameRunnerUp">${escapeHtml(runnerName)}</b>
              <p class="text-[10px] text-slate-400 mt-1">Thưởng: <span class="text-slate-300">${escapeHtml(tour.prizes?.prize2 || 'Cờ + Thưởng')}</span></p>
            </div>
            <div class="w-full h-16 bg-slate-700/60 rounded-b-xl border-t border-slate-600/60 mt-1 flex items-center justify-center font-black text-slate-400">
              2
            </div>
          </div>

          <!-- Hạng Nhất (Ở Giữa - Cao Nhất) -->
          <div class="flex-1 flex flex-col items-center -translate-y-3">
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xl mb-2 border-2 border-amber-200 animate-bounce">
              👑
            </div>
            <div class="w-full bg-gradient-to-b from-amber-950/70 to-slate-900 rounded-2xl p-5 border-2 border-amber-500/60 shadow-xl text-center space-y-1">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950">VÔ ĐỊCH CLB (GIẢI NHẤT)</span>
              <h3 class="text-sm font-black text-amber-300 block truncate" id="awardNameChampion">${escapeHtml(champName)}</h3>
              <p class="text-[11px] text-amber-200/90 font-semibold mt-1">Thưởng: <span class="text-amber-300">${escapeHtml(tour.prizes?.prize1 || 'Cúp Vô Địch')}</span></p>
            </div>
            <div class="w-full h-24 bg-amber-500/30 rounded-b-xl border-t-2 border-amber-400 mt-1 flex items-center justify-center font-black text-amber-400 text-lg">
              1
            </div>
          </div>

          <!-- Hạng Ba (Bên Phải) -->
          <div class="flex-1 flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-amber-800 text-amber-200 flex items-center justify-center font-black text-lg shadow-lg mb-2 border-2 border-amber-700">
              🥉
            </div>
            <div class="w-full bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-slate-700/60 shadow-md text-center space-y-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-950 text-amber-400 border border-amber-800">Giải Ba (Hạng 3)</span>
              <b class="text-xs font-bold text-white block truncate" id="awardNameThirdPlace">${escapeHtml(thirdName)}</b>
              <p class="text-[10px] text-slate-400 mt-1">Thưởng: <span class="text-slate-300">${escapeHtml(tour.prizes?.prize3 || 'Cờ + Thưởng')}</span></p>
            </div>
            <div class="w-full h-12 bg-amber-900/40 rounded-b-xl border-t border-amber-800/60 mt-1 flex items-center justify-center font-black text-amber-500">
              3
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

/**
 * Tạo và sao chép báo cáo kết quả thi đấu gửi nhanh qua Zalo
 */
function copyTournamentZaloReport() {
  const tour = getActiveTournament();
  if (!tour) return;

  let rep = `🏸 BÁO CÁO KẾT QUẢ THI ĐẤU LIÊN CLB CẦU LÔNG 🏸\n`;
  rep += `🏆 GIẢI ĐẤU: ${tour.title.toUpperCase()}\n`;
  rep += `📅 Ngày thi đấu: ${tour.date} | Địa điểm: ${tour.location}\n`;
  rep += `🤝 Quy mô: ${TOURNAMENT_SCOPES.find(s => s.id === tour.scope)?.label || 'Liên CLB'}\n\n`;

  (tour.disciplines || []).forEach(d => {
    rep += `--------------------------------------\n`;
    rep += `⭐ NỘI DUNG: ${d.name.toUpperCase()}\n`;
    if (d.champion) {
      const c = d.pairs?.find(p => p.id === d.champion);
      const r = d.pairs?.find(p => p.id === d.runnerUp);
      const t = d.pairs?.find(p => p.id === d.thirdPlace);
      rep += `🥇 VÔ ĐỊCH: ${c ? c.name : 'Chưa xác định'} (${c ? c.club : ''})\n`;
      if (r) rep += `🥈 Á QUÂN: ${r.name} (${r.club})\n`;
      if (t) rep += `🥉 HẠNG BA: ${t.name} (${t.club})\n`;
    } else {
      rep += `(Giải đang diễn ra sôi nổi tại vòng bảng và đấu loại trực tiếp)\n`;
    }
  });

  rep += `\n🎁 Cơ cấu phần thưởng: ${tour.prizes?.prize1 || 'Cúp vô địch'}\n`;
  rep += `Chúc mừng các vận động viên và toàn thể anh em 5 CLB thi đấu cống hiến hết mình! 🎉🏸🔥`;

  navigator.clipboard.writeText(rep).then(() => {
    alert('✓ ĐÃ SAO CHÉP BÁO CÁO KẾT QUẢ GIẢI ĐẤU VÀO CLIPBOARD!\n\nBây giờ bạn chỉ cần mở Zalo và bấm Ctrl + V (hoặc Dán) để gửi thông báo cho cả CLB.');
  }).catch(() => {
    alert(rep);
  });
}

// ----------------------------------------------------
// PHÂN HỆ 6: TẠO VÀ XÓA GIẢI ĐẤU MỚI
// ----------------------------------------------------

function openCreateTournamentModal() {
  const dateInput = document.getElementById('modalNewTourDate');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  openModal('modalCreateTournament');
}

function closeCreateTournamentModal() {
  closeModal('modalCreateTournament');
}

function confirmCreateNewTournament() {
  const title = document.getElementById('modalNewTourTitle')?.value.trim();
  if (!title) {
    showToast('Vui lòng nhập tên giải đấu!', 'warning');
    return;
  }

  const scope = document.getElementById('modalNewTourScope')?.value || 'MULTI_CLUB';
  const date = document.getElementById('modalNewTourDate')?.value || new Date().toISOString().split('T')[0];
  const courts = parseInt(document.getElementById('modalNewTourCourts')?.value) || 3;
  const minRest = parseInt(document.getElementById('modalNewTourMinRest')?.value) || 25;
  const formatChoice = document.getElementById('modalNewTourFormat')?.value || 'GROUP_4_KNOCKOUT';
  const ruleChoice = document.getElementById('modalNewTourRule')?.value || '1_31';

  let setsMode = 1;
  let pointsCap = 31;
  if (ruleChoice === '1_21') { setsMode = 1; pointsCap = 21; }
  else if (ruleChoice === '1_25') { setsMode = 1; pointsCap = 25; }
  else if (ruleChoice === '3_21') { setsMode = 3; pointsCap = 30; }

  const newId = `TOUR_${Date.now()}`;
  const defaultBase = createDefaultTournamentData()[0];

  const newTour = {
    id: newId,
    dataVersion: TOURNAMENT_DATA_VERSION,
    title,
    scope,
    date,
    location: 'Cụm Sân Cầu Lông Smash Arena - 5 Sân Tiêu Chuẩn',
    courtsCount: courts,
    minRestMinutes: minRest,
    status: 'IN_PROGRESS',
    matchRules: {
      setsMode,
      pointsToWin: setsMode === 1 ? pointsCap : 21,
      maxPointsCap: pointsCap,
      ruleType: 'SUDDEN_DEATH'
    },
    organization: {
      organizer: 'Ban Tổ Chức Giải Đấu Mới',
      leadReferee: 'Tổ Trọng Tài Điều Hành',
      rules: `Luật thi đấu Cầu Lông Phong Trào (${setsMode} Set chạm ${pointsCap} điểm)`
    },
    countries: JSON.parse(JSON.stringify(TOURNAMENT_COUNTRIES)),
    clubs: JSON.parse(JSON.stringify(TOURNAMENT_CLUBS)),
    players: JSON.parse(JSON.stringify(defaultBase.players)),
    registrations: JSON.parse(JSON.stringify(defaultBase.registrations)),
    rankingCriteria: ['WINS', 'HEAD_TO_HEAD', 'GAME_DIFF', 'POINT_DIFF', 'POINTS_SCORED', 'FAIR_PLAY'],
    prizes: {
      prize1: '🏆 Cúp Vô Địch + Phần Thưởng',
      prize2: '🥈 Cờ Á Quân + Phần Thưởng',
      prize3: '🥉 Cờ Hạng Ba + Phần Thưởng',
      prizeFairPlay: '🎖️ Phong Cách Liên CLB'
    },
    disciplines: JSON.parse(JSON.stringify(defaultBase.disciplines))
  };

  TournamentState.tournaments.unshift(newTour);
  TournamentState.activeTournamentId = newId;
  TournamentState.activeDisciplineId = 'MD';

  autoGenerateTournamentSchedule(newId, true);

  saveTournamentData();
  closeCreateTournamentModal();
  renderTournamentModule();
  showToast(`✓ Đã tạo giải đấu mới: ${title}`, 'success');
}

function deleteCurrentTournament() {
  if (TournamentState.tournaments.length <= 1) {
    showToast('Cần duy trì ít nhất 1 giải đấu trong hệ thống!', 'warning');
    return;
  }

  const tour = getActiveTournament();
  const confirmed = confirm(`Xác nhận xóa vĩnh viễn giải đấu "${tour.title}"? Dữ liệu giải sẽ không thể phục hồi.`);
  if (!confirmed) return;

  TournamentState.tournaments = TournamentState.tournaments.filter(t => t.id !== tour.id);
  TournamentState.activeTournamentId = TournamentState.tournaments[0].id;

  saveTournamentData();
  renderTournamentModule();
  showToast('Đã xóa giải đấu thành công!', 'info');
}

function setTourScopeFilter(scopeId) {
  TournamentState.filters.scope = scopeId;
  TOURNAMENT_SCOPES.forEach(s => {
    const btn = document.getElementById(`btnTourScope-${s.id}`);
    if (btn) {
      if (s.id === scopeId) {
        btn.className = 'px-2 py-0.5 rounded-lg bg-white/20 text-white font-bold transition';
      } else {
        btn.className = 'px-2 py-0.5 rounded-lg text-indigo-200 hover:text-white transition';
      }
    }
  });
}

function renderTournamentFilteredViews() {
  showToast('Đã lọc danh sách theo Quốc gia & CLB tương ứng!', 'info');
}

// ==========================================
// 17. CẤU HÌNH & SAO LƯU DỮ LIỆU
function onConfigClubNameChanged(val) {
  const slugInput = document.getElementById('configClubAccessSlug');
  if (slugInput && !slugInput.value) {
    const slug = generateAccessSlug(val);
    slugInput.value = slug;
    onConfigClubAccessSlugChanged(slug);
  }
}

function onConfigClubAccessSlugChanged(val) {
  const previewInput = document.getElementById('configClubDirectUrlPreview');
  const cleanSlug = (val || '').toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
  const baseUrl = window.location.href.split('#')[0].split('?')[0];
  if (previewInput) {
    previewInput.value = `${baseUrl}?club=${encodeURIComponent(cleanSlug || 'clb')}`;
  }
}

function copyConfigClubDirectLink() {
  const input = document.getElementById('configClubDirectUrlPreview');
  if (!input) return;
  const url = input.value;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('✓ Đã sao chép đường link sử dụng riêng của CLB!', 'success');
    }).catch(() => {
      input.select();
      document.execCommand('copy');
      showToast('✓ Đã sao chép đường link sử dụng riêng của CLB!', 'success');
    });
  } else {
    input.select();
    document.execCommand('copy');
    showToast('✓ Đã sao chép đường link sử dụng riêng của CLB!', 'success');
  }
}

function openConfigClubDirectLink() {
  const input = document.getElementById('configClubDirectUrlPreview');
  if (input && input.value) {
    window.open(input.value, '_blank');
  }
}

function renderSettingsTab() {
  const config = AppState.config;
  const activeClub = getActiveClub();
  if (document.getElementById('configClubName')) document.getElementById('configClubName').value = config.clubName || 'CLB CẦU LÔNG';
  if (document.getElementById('configThemeColor')) document.getElementById('configThemeColor').value = config.themeColor || 'emerald';
  if (document.getElementById('configBankInfo')) document.getElementById('configBankInfo').value = config.bankInfo || '';

  // Khởi tạo Tên truy cập cấu hình & Đường link trực tiếp CLB
  const curSlug = config.accessSlug || activeClub.accessSlug || activeClub.shortName?.toLowerCase() || (activeClub.id === 'club_smash' ? 'smash' : activeClub.id);
  const slugInput = document.getElementById('configClubAccessSlug');
  if (slugInput) slugInput.value = curSlug;
  const previewInput = document.getElementById('configClubDirectUrlPreview');
  if (previewInput) previewInput.value = getClubDirectUrl(activeClub);

  // Khởi tạo và đổ danh sách thành viên vào 8 vị trí Ban Lãnh Đạo CLB
  populateLeadershipSelects();

  if (document.getElementById('guestPriceA')) document.getElementById('guestPriceA').value = config.guestPrices?.GUEST_A || 90000;
  if (document.getElementById('guestPriceB')) document.getElementById('guestPriceB').value = config.guestPrices?.GUEST_B || 70000;
  if (document.getElementById('guestPriceC')) document.getElementById('guestPriceC').value = config.guestPrices?.GUEST_C || 50000;

  // Cấu hình vai trò & Phân quyền Trưởng nhóm / Phó nhóm
  const roleSelect = document.getElementById('configActiveRoleSelect');
  if (roleSelect) roleSelect.value = getCurrentUserRole();

  const viceSelect = document.getElementById('configViceLeaderSelect');
  if (viceSelect) {
    const officialMembers = AppState.members.filter(m => m.type === 'OFFICIAL');
    viceSelect.innerHTML = officialMembers.map(m => `
      <option value="${m.id}" ${m.id === (config.viceLeaderId || 'M002') ? 'selected' : ''}>
        ${m.name} (${m.chipName || m.id})
      </option>
    `).join('');
  }

  const permAtt = document.getElementById('permViceLeaderAttendance');
  if (permAtt) permAtt.checked = config.permissions?.allowViceLeaderAttendance !== false;

  const permTour = document.getElementById('permViceLeaderTournamentSync');
  if (permTour) permTour.checked = config.permissions?.allowViceLeaderTournamentSync !== false;

  // Cấu hình đơn giá theo ngày (1 hộp cầu = 12 quả)
  const boxPriceInput = document.getElementById('configDailyBoxPrice');
  if (boxPriceInput) boxPriceInput.value = config.dailyBoxPrice || 340000;

  const countInput = document.getElementById('configShuttlecocksPerBox');
  if (countInput) countInput.value = config.shuttlecocksPerBox || 12;

  const titleInput = document.getElementById('configDailyRateTitle');
  if (titleInput) titleInput.value = config.dailyRateTitle || 'ĐƠN GIÁ THEO NGÀY 12';

  const modeRadioShuttle = document.getElementById('configModeByShuttle');
  const modeRadioBox = document.getElementById('configModeByBox');
  if (modeRadioShuttle && modeRadioBox) {
    if (config.shuttleBillingMode === 'BY_BOX') {
      modeRadioBox.checked = true;
    } else {
      modeRadioShuttle.checked = true;
    }
  }

  const defaultShuttlesInput = document.getElementById('configDefaultShuttlesPerSession');
  if (defaultShuttlesInput) defaultShuttlesInput.value = config.defaultShuttlesPerSession || 6;

  // Cấu hình ví thành viên âm & Tất toán dư nợ
  const allowNegCheck = document.getElementById('configAllowNegativeWallet');
  if (allowNegCheck) allowNegCheck.checked = config.allowNegativeWallet !== false;

  const modeRadioMonthly = document.getElementById('configModeMonthly');
  const modeRadioDaily = document.getElementById('configModeDaily');
  if (modeRadioMonthly && modeRadioDaily) {
    if (config.settlementMode === 'DAILY') {
      modeRadioDaily.checked = true;
    } else {
      modeRadioMonthly.checked = true;
    }
  }

  const defaultDaySelect = document.getElementById('configDefaultSettlementDay');
  if (defaultDaySelect) defaultDaySelect.value = config.defaultSettlementDay || 'END_OF_MONTH';

  updateDailyRateCalculatedPreview();

  renderFeeTiersConfigTable();
  renderUserAccessTable();
  renderMultiClubSettingsSection();
  lucide.createIcons();
}

function renderFeeTiersConfigTable() {
  const tbody = document.getElementById('tierFeeConfigTableBody');
  if (!tbody) return;

  const tiers = AppState.config.feeTiers || [];
  tbody.innerHTML = tiers.map((tier, idx) => `
    <tr>
      <td class="py-2.5 px-3">
        <input type="text" value="${tier.name}" onchange="updateTierField(${idx}, 'name', this.value)" class="w-full px-2 py-1 border border-slate-200 rounded text-xs font-semibold" />
      </td>
      <td class="py-2.5 px-3">
        <input type="number" value="${tier.minSessions}" onchange="updateTierField(${idx}, 'minSessions', Number(this.value))" class="w-20 px-2 py-1 border border-slate-200 rounded text-xs" />
      </td>
      <td class="py-2.5 px-3">
        <input type="number" value="${tier.maxSessions}" onchange="updateTierField(${idx}, 'maxSessions', Number(this.value))" class="w-20 px-2 py-1 border border-slate-200 rounded text-xs" />
      </td>
      <td class="py-2.5 px-3">
        <input type="number" step="5000" value="${tier.price}" onchange="updateTierField(${idx}, 'price', Number(this.value))" class="w-28 px-2 py-1 border border-slate-200 rounded text-xs font-bold text-brand-700" />
      </td>
      <td class="py-2.5 px-3 text-center">
        <button onclick="deleteFeeTier(${idx})" class="p-1 text-rose-500 hover:bg-rose-50 rounded" title="Xóa bậc"><i data-lucide="trash-2" class="w-4 h-4 inline"></i></button>
      </td>
    </tr>
  `).join('');

  lucide.createIcons();
}

function updateTierField(index, field, value) {
  if (AppState.config.feeTiers[index]) {
    AppState.config.feeTiers[index][field] = value;
  }
}

function addNewFeeTier() {
  const last = AppState.config.feeTiers[AppState.config.feeTiers.length - 1];
  const newMin = last ? last.maxSessions + 1 : 0;
  AppState.config.feeTiers.push({
    id: Date.now(),
    name: `Bậc ${AppState.config.feeTiers.length + 1}`,
    minSessions: newMin,
    maxSessions: newMin + 5,
    price: last ? last.price + 50000 : 50000
  });
  renderFeeTiersConfigTable();
}

function deleteFeeTier(index) {
  AppState.config.feeTiers.splice(index, 1);
  renderFeeTiersConfigTable();
}

function saveFeeTiersConfig() {
  saveData();
  renderAttendanceTiersBadgeList();
  showToast('Đã lưu cấu hình bậc tiền sân thành công!', 'success');
}

/**
 * Đổ danh sách thành viên vào 8 vị trí Ban Lãnh Đạo CLB
 */
function populateLeadershipSelects() {
  const isSmash = getActiveClubId() === 'club_smash';
  if (!AppState.config.leadership) {
    AppState.config.leadership = isSmash ? {
      president: 'M001',
      vicePresident1: 'M002',
      vicePresident2: 'M003',
      secretary: 'M004',
      treasurer: 'M005',
      media: 'M008',
      advisor1: 'M006',
      advisor2: 'M007'
    } : {
      president: AppState.members?.[0]?.id || '',
      vicePresident1: '',
      vicePresident2: '',
      secretary: '',
      treasurer: '',
      media: '',
      advisor1: '',
      advisor2: ''
    };
  }

  const leadership = AppState.config.leadership;
  const members = AppState.members || [];
  const memberIds = new Set(members.map(m => m.id));

  const roleConfigs = [
    { id: 'configLeaderPresident', key: 'president', defaultVal: isSmash ? 'M001' : (members[0]?.id || '') },
    { id: 'configLeaderVice1', key: 'vicePresident1', defaultVal: isSmash ? 'M002' : '' },
    { id: 'configLeaderVice2', key: 'vicePresident2', defaultVal: isSmash ? 'M003' : '' },
    { id: 'configLeaderSecretary', key: 'secretary', defaultVal: isSmash ? 'M004' : '' },
    { id: 'configLeaderTreasurer', key: 'treasurer', defaultVal: isSmash ? 'M005' : '' },
    { id: 'configLeaderMedia', key: 'media', defaultVal: isSmash ? 'M008' : '' },
    { id: 'configLeaderAdvisor1', key: 'advisor1', defaultVal: isSmash ? 'M006' : '' },
    { id: 'configLeaderAdvisor2', key: 'advisor2', defaultVal: isSmash ? 'M007' : '' }
  ];

  const officialMembers = members.filter(m => m.type === 'OFFICIAL');
  const honoraryMembers = members.filter(m => m.type === 'HONORARY');
  const otherMembers = members.filter(m => m.type !== 'OFFICIAL' && m.type !== 'HONORARY');

  roleConfigs.forEach(r => {
    const select = document.getElementById(r.id);
    if (!select) return;

    let currentVal = leadership[r.key] !== undefined ? leadership[r.key] : r.defaultVal;
    if (currentVal && !memberIds.has(currentVal)) {
      currentVal = (r.key === 'president') ? (members[0]?.id || '') : '';
    }

    let html = `<option value="">-- Chưa chỉ định --</option>`;

    if (officialMembers.length > 0) {
      html += `<optgroup label="Thành viên chính thức (${officialMembers.length} người)">`;
      officialMembers.forEach(m => {
        html += `<option value="${m.id}" ${m.id === currentVal ? 'selected' : ''}>${escapeHtml(m.name)} (${escapeHtml(m.chipName || m.id)})</option>`;
      });
      html += `</optgroup>`;
    }

    if (honoraryMembers.length > 0) {
      html += `<optgroup label="Thành viên danh dự (${honoraryMembers.length} người)">`;
      honoraryMembers.forEach(m => {
        html += `<option value="${m.id}" ${m.id === currentVal ? 'selected' : ''}>${escapeHtml(m.name)} (${escapeHtml(m.chipName || m.id)})</option>`;
      });
      html += `</optgroup>`;
    }

    if (otherMembers.length > 0) {
      html += `<optgroup label="Khách / Thành viên khác (${otherMembers.length} người)">`;
      otherMembers.forEach(m => {
        html += `<option value="${m.id}" ${m.id === currentVal ? 'selected' : ''}>${escapeHtml(m.name || m.chipName || m.id)}</option>`;
      });
      html += `</optgroup>`;
    }

    select.innerHTML = html;
  });

  renderLeadershipSummaryCard();
}

/**
 * Hiển thị thẻ tóm tắt Ban Lãnh Đạo Đương Nhiệm
 */
function renderLeadershipSummaryCard() {
  const container = document.getElementById('leadershipSummaryCard');
  if (!container) return;

  const members = AppState.members || [];
  const getMemberLabel = (memberId) => {
    if (!memberId) return '<span class="text-slate-400 italic">Chưa chọn</span>';
    const m = members.find(x => x.id === memberId);
    if (!m) return `<span class="text-slate-500 font-bold">${escapeHtml(memberId)}</span>`;
    return `<b class="text-slate-900">${escapeHtml(m.name)}</b>`;
  };

  const p = document.getElementById('configLeaderPresident')?.value ?? AppState.config.leadership?.president;
  const v1 = document.getElementById('configLeaderVice1')?.value ?? AppState.config.leadership?.vicePresident1;
  const v2 = document.getElementById('configLeaderVice2')?.value ?? AppState.config.leadership?.vicePresident2;
  const s = document.getElementById('configLeaderSecretary')?.value ?? AppState.config.leadership?.secretary;
  const t = document.getElementById('configLeaderTreasurer')?.value ?? AppState.config.leadership?.treasurer;
  const med = document.getElementById('configLeaderMedia')?.value ?? AppState.config.leadership?.media;
  const a1 = document.getElementById('configLeaderAdvisor1')?.value ?? AppState.config.leadership?.advisor1;
  const a2 = document.getElementById('configLeaderAdvisor2')?.value ?? AppState.config.leadership?.advisor2;

  container.innerHTML = `
    <div class="flex items-center justify-between pb-1.5 mb-2 border-b border-indigo-100 flex-wrap gap-1">
      <div class="flex items-center gap-1.5 text-indigo-950 font-black text-xs">
        <span>🏛️</span>
        <span>BAN LÃNH ĐẠO ĐƯƠNG NHIỆM CLB (8 VỊ TRÍ):</span>
      </div>
      <span class="text-[10px] text-slate-500 italic">Nhiệm kỳ hiện tại</span>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2 text-[11px]">
      <div class="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
        <span class="text-emerald-700 font-bold block text-[10px]">👑 Chủ tịch:</span>
        <div class="mt-0.5 truncate">${getMemberLabel(p)}</div>
      </div>
      <div class="p-1.5 bg-blue-50 rounded-lg border border-blue-200">
        <span class="text-blue-700 font-bold block text-[10px]">🛡️ Phó CT 1:</span>
        <div class="mt-0.5 truncate">${getMemberLabel(v1)}</div>
      </div>
      <div class="p-1.5 bg-blue-50 rounded-lg border border-blue-200">
        <span class="text-blue-700 font-bold block text-[10px]">🛡️ Phó CT 2:</span>
        <div class="mt-0.5 truncate">${getMemberLabel(v2)}</div>
      </div>
      <div class="p-1.5 bg-indigo-50 rounded-lg border border-indigo-200">
        <span class="text-indigo-700 font-bold block text-[10px]">📝 Thư ký:</span>
        <div class="mt-0.5 truncate">${getMemberLabel(s)}</div>
      </div>
      <div class="p-1.5 bg-amber-50 rounded-lg border border-amber-200">
        <span class="text-amber-700 font-bold block text-[10px]">💰 Thủ quỹ:</span>
        <div class="mt-0.5 truncate">${getMemberLabel(t)}</div>
      </div>
      <div class="p-1.5 bg-rose-50 rounded-lg border border-rose-200">
        <span class="text-rose-700 font-bold block text-[10px]">📢 Truyền thông:</span>
        <div class="mt-0.5 truncate">${getMemberLabel(med)}</div>
      </div>
      <div class="p-1.5 bg-purple-50 rounded-lg border border-purple-200">
        <span class="text-purple-700 font-bold block text-[10px]">💡 Cố vấn 1:</span>
        <div class="mt-0.5 truncate">${getMemberLabel(a1)}</div>
      </div>
      <div class="p-1.5 bg-purple-50 rounded-lg border border-purple-200">
        <span class="text-purple-700 font-bold block text-[10px]">💡 Cố vấn 2:</span>
        <div class="mt-0.5 truncate">${getMemberLabel(a2)}</div>
      </div>
    </div>
  `;
}

/**
 * Thu gọn hoặc mở rộng bảng chọn vị trí Ban Lãnh Đạo
 */
function toggleLeadershipCollapse() {
  const detailBody = document.getElementById('leadershipDetailBody');
  const toggleText = document.getElementById('leadershipToggleText');
  const toggleIcon = document.getElementById('leadershipToggleIcon');
  if (!detailBody) return;

  const isHidden = detailBody.classList.contains('hidden');
  if (isHidden) {
    detailBody.classList.remove('hidden');
    if (toggleText) toggleText.textContent = 'Thu gọn';
    if (toggleIcon) toggleIcon.textContent = '▴';
  } else {
    detailBody.classList.add('hidden');
    if (toggleText) toggleText.textContent = 'Mở rộng';
    if (toggleIcon) toggleIcon.textContent = '▾';
  }
}

function saveGeneralConfig() {
  const clubName = document.getElementById('configClubName')?.value.trim() || 'CLB CẦU LÔNG';
  AppState.config.clubName = clubName;
  AppState.config.themeColor = document.getElementById('configThemeColor')?.value || 'emerald';
  AppState.config.bankInfo = document.getElementById('configBankInfo')?.value.trim() || '';

  // Đọc và lưu Access Slug cấu hình
  const slugInput = document.getElementById('configClubAccessSlug');
  let slug = slugInput?.value.trim().toLowerCase() || '';
  if (!slug) slug = generateAccessSlug(clubName);
  slug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!slug) slug = 'clb';
  AppState.config.accessSlug = slug;
  if (slugInput) slugInput.value = slug;

  // Cập nhật thẻ preview URL
  const previewInput = document.getElementById('configClubDirectUrlPreview');
  const baseUrl = window.location.href.split('#')[0].split('?')[0];
  if (previewInput) previewInput.value = `${baseUrl}?club=${encodeURIComponent(slug)}`;

  // Lưu cấu hình Ban Lãnh Đạo (8 vị trí) lấy từ danh sách thành viên
  if (!AppState.config.leadership) AppState.config.leadership = {};
  AppState.config.leadership.president = document.getElementById('configLeaderPresident')?.value || '';
  AppState.config.leadership.vicePresident1 = document.getElementById('configLeaderVice1')?.value || '';
  AppState.config.leadership.vicePresident2 = document.getElementById('configLeaderVice2')?.value || '';
  AppState.config.leadership.secretary = document.getElementById('configLeaderSecretary')?.value || '';
  AppState.config.leadership.treasurer = document.getElementById('configLeaderTreasurer')?.value || '';
  AppState.config.leadership.media = document.getElementById('configLeaderMedia')?.value || '';
  AppState.config.leadership.advisor1 = document.getElementById('configLeaderAdvisor1')?.value || '';
  AppState.config.leadership.advisor2 = document.getElementById('configLeaderAdvisor2')?.value || '';

  // Đồng bộ sang danh bạ Registry
  const registry = getClubsRegistry();
  const activeId = getActiveClubId();
  const clubInReg = registry.find(c => c.id === activeId);
  if (clubInReg) {
    clubInReg.name = clubName;
    clubInReg.themeColor = AppState.config.themeColor;
    clubInReg.bankInfo = AppState.config.bankInfo;
    clubInReg.accessSlug = slug;
    saveClubsRegistry(registry);
  }

  // Cập nhật URL trình duyệt theo slug mới
  updateClubUrlParam(slug);

  applyThemeColor(AppState.config.themeColor);
  saveData();
  renderDashboard();
  renderClubSwitcher();
  renderMultiClubSettingsSection();
  renderLeadershipSummaryCard();
  showToast('✓ Đã lưu thông tin CLB, link riêng & Ban lãnh đạo thành công!', 'success');
}

function saveGuestPricingConfig() {
  AppState.config.guestPrices.GUEST_A = Number(document.getElementById('guestPriceA').value || 70000);
  AppState.config.guestPrices.GUEST_B = Number(document.getElementById('guestPriceB').value || 100000);
  AppState.config.guestPrices.GUEST_C = Number(document.getElementById('guestPriceC').value || 150000);
  saveData();
  showToast('Đã lưu đơn giá khách giao lưu!', 'success');
}

// Cấu hình phân quyền Trưởng nhóm & Phó nhóm
function saveClubPermissionsConfig() {
  const currentRole = getCurrentUserRole();
  if (currentRole !== 'ADMIN') {
    showToast('⚠️ Chỉ Trưởng nhóm mới có toàn quyền sửa phân quyền quản lý!', 'error');
    return;
  }

  const viceSelect = document.getElementById('configViceLeaderSelect');
  const permAtt = document.getElementById('permViceLeaderAttendance');
  const permTour = document.getElementById('permViceLeaderTournamentSync');

  if (viceSelect) AppState.config.viceLeaderId = viceSelect.value;
  if (!AppState.config.permissions) AppState.config.permissions = {};
  AppState.config.permissions.allowViceLeaderAttendance = permAtt ? permAtt.checked : true;
  AppState.config.permissions.allowViceLeaderTournamentSync = permTour ? permTour.checked : true;

  saveData();
  renderAttendanceRoleBanner();
  showToast('✓ Đã cập nhật và lưu phân quyền quản lý cho Phó nhóm thành công!', 'success');
}

// Cấu hình đơn giá hộp cầu theo ngày
function updateDailyRateCalculatedPreview() {
  const boxPriceInput = document.getElementById('configDailyBoxPrice');
  const countInput = document.getElementById('configShuttlecocksPerBox');
  const formulaBadge = document.getElementById('dailyRateFormulaBadge');
  const formulaSummary = document.getElementById('dailyRateFormulaSummaryText');
  const perShuttleText = document.getElementById('dailyRatePerShuttleText');
  const perShuttleBadge = document.getElementById('configPreviewPerShuttleBadge');

  const boxPrice = Number(boxPriceInput?.value) || 340000;
  const count = Number(countInput?.value) || 12;
  const perShuttle = count > 0 ? Math.round(boxPrice / count) : 0;

  if (formulaBadge) formulaBadge.textContent = `1 hộp = ${count} quả (${formatMoney(boxPrice)})`;
  if (formulaSummary) formulaSummary.textContent = `Công thức: 1 hộp cầu = ${count} quả ➔ Đơn giá: ${formatMoney(boxPrice)}`;
  if (perShuttleText) perShuttleText.textContent = formatMoney(perShuttle);
  if (perShuttleBadge) perShuttleBadge.textContent = formatMoney(perShuttle);
}

function saveDailyRateConfig() {
  const currentRole = getCurrentUserRole();
  if (currentRole !== 'ADMIN') {
    showToast('⚠️ Chỉ Trưởng nhóm mới có toàn quyền sửa cấu hình đơn giá theo ngày!', 'error');
    return;
  }

  const boxPrice = Number(document.getElementById('configDailyBoxPrice')?.value) || 340000;
  const count = Number(document.getElementById('configShuttlecocksPerBox')?.value) || 12;
  const title = document.getElementById('configDailyRateTitle')?.value.trim() || `ĐƠN GIÁ THEO NGÀY ${count}`;
  const billingMode = document.getElementById('configModeByBox')?.checked ? 'BY_BOX' : 'BY_SHUTTLE';
  const defaultShuttles = Number(document.getElementById('configDefaultShuttlesPerSession')?.value) || 6;
  const shuttleUnitPrice = count > 0 ? Math.round(boxPrice / count) : 28333;

  AppState.config.dailyBoxPrice = boxPrice;
  AppState.config.shuttlecocksPerBox = count;
  AppState.config.dailyRateTitle = title;
  AppState.config.shuttleBillingMode = billingMode;
  AppState.config.shuttleUnitPrice = shuttleUnitPrice;
  AppState.config.defaultShuttlesPerSession = defaultShuttles;

  saveData();
  updateDailyRatePresetBadgeUI();
  updateShuttleBillingUI();
  updateDailyRateCalculatedPreview();
  showToast(`✓ Đã lưu cấu hình: 1 hộp = ${count} quả (${formatMoney(boxPrice)}), tính ${billingMode === 'BY_SHUTTLE' ? 'theo số quả' : 'theo hộp'}!`, 'success');
}

// Sao lưu và khôi phục
function exportDataBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState, null, 2));
  const downloadAnchor = document.createElement('a');
  const now = new Date();
  const dateTag = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  const clubSlug = AppState.config?.accessSlug || 'clb';
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `sao_luu_${clubSlug}_${dateTag}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast(`✓ Đã tải xuống tệp sao lưu dữ liệu của ${AppState.config?.clubName || 'CLB'}!`, 'success');
}

function importDataBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.members && parsed.funds && parsed.config) {
        AppState = parsed;
        saveData();
        applyThemeColor(AppState.config.themeColor || 'emerald');
        const nameEl = document.getElementById('headerClubName');
        if (nameEl) nameEl.textContent = AppState.config.clubName || 'CLB CẦU LÔNG';
        
        renderDashboard();
        renderMemberManagementList();
        renderFinanceTab();
        renderAttendanceTab();
        renderClubSwitcher();
        populateLeadershipSelects();
        showToast('🎉 Khôi phục dữ liệu từ tệp thành công!', 'success');
      } else {
        showToast('Tệp sao lưu không đúng định dạng dữ liệu CLB!', 'error');
      }
    } catch (err) {
      showToast('Lỗi đọc tệp sao lưu JSON!', 'error');
    }
  };
  reader.readAsText(file);
}

function resetDefaultDemoData() {
  const activeClub = getActiveClub();
  const isSmash = activeClub.id === 'club_smash';
  const confirmed = confirm(`CẢNH BÁO: Thao tác này sẽ đưa toàn bộ dữ liệu của "${activeClub.name}" về trạng thái ban đầu.\nBạn có chắc chắn muốn đặt lại?`);
  if (!confirmed) return;

  AppState = isSmash ? JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA)) : getBlankClubInitialData(activeClub);
  saveData();
  applyThemeColor(AppState.config?.themeColor || activeClub.themeColor || 'emerald');
  renderDashboard();
  showToast(`Đã đặt lại dữ liệu của ${activeClub.name} về ban đầu thành công!`, 'success');
}

// ==========================================
// 18. XÁC THỰC & ĐĂNG NHẬP (AUTH)
// ==========================================
function renderAuthBadge() {
  const badgeContainer = document.getElementById('userAuthBadge');
  if (!badgeContainer) return;

  if (AppState.auth && AppState.auth.isLoggedIn && AppState.auth.user) {
    const user = AppState.auth.user;
    const roleDef = ROLE_DEFINITIONS[user.role] || ROLE_DEFINITIONS.MEMBER;
    badgeContainer.innerHTML = `
      <div class="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200 text-xs transition">
        <div class="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
          ${user.name.charAt(0).toUpperCase()}
        </div>
        <span class="font-bold text-slate-800 hidden sm:inline">${user.name}</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-black border ${roleDef.badgeClass}">
          ${roleDef.icon} ${roleDef.label}
        </span>
        <button onclick="handleLogout()" class="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer" title="Đăng xuất">
          <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
  } else {
    badgeContainer.innerHTML = `
      <button onclick="openLoginModal()" class="inline-flex items-center px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-full transition shadow-sm cursor-pointer">
        <i data-lucide="lock" class="w-3.5 h-3.5 mr-1.5"></i>
        Đăng nhập
      </button>
    `;
  }

  lucide.createIcons();
}

function openLoginModal() {
  openModal('loginModal');
}

function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById('loginUsername').value.trim();
  const p = document.getElementById('loginPassword').value.trim();

  if (u === 'admin' && (p === 'admin123' || p === '123456' || p === '123')) {
    const activeClub = getActiveClub();
    const adminMem = AppState.members.find(m => m.role === 'ADMIN') || AppState.members[0];
    const adminDisplayName = adminMem ? adminMem.name : (activeClub?.adminName || 'Chủ nhiệm');
    AppState.auth = {
      isLoggedIn: true,
      user: {
        id: adminMem ? adminMem.id : 'M001',
        username: 'admin',
        role: 'ADMIN',
        name: `${adminDisplayName} (Chủ nhiệm)`,
        permissions: getRoleDefaultPermissions('ADMIN')
      }
    };
    saveData();
    closeModal('loginModal');
    renderAuthBadge();
    renderAttendanceRoleBanner();
    renderUserAccessTable();
    showToast('✓ Đăng nhập thành công với quyền Chủ nhiệm!', 'success');
    return;
  }

  const member = AppState.members.find(m => m.username && m.username.toLowerCase() === u.toLowerCase() && m.password === p);
  if (member) {
    if (member.status === 'LOCKED') {
      showToast(`⚠️ Tài khoản ${member.name} đang bị tạm khóa. Vui lòng liên hệ Ban quản trị!`, 'error');
      return;
    }
    AppState.auth = {
      isLoggedIn: true,
      user: {
        id: member.id,
        username: member.username,
        role: member.role || 'MEMBER',
        name: member.name,
        permissions: member.permissions || getRoleDefaultPermissions(member.role || 'MEMBER')
      }
    };
    saveData();
    closeModal('loginModal');
    renderAuthBadge();
    renderAttendanceRoleBanner();
    renderUserAccessTable();
    const roleDef = ROLE_DEFINITIONS[member.role] || ROLE_DEFINITIONS.MEMBER;
    showToast(`✓ Chào mừng ${member.name} (${roleDef.icon} ${roleDef.label})!`, 'success');
    return;
  }

  showToast('Tài khoản hoặc mật khẩu không chính xác! (Mặc định: 123456)', 'error');
}

function handleLogout() {
  AppState.auth = { isLoggedIn: false, user: null };
  saveData();
  renderAuthBadge();
  renderAttendanceRoleBanner();
  renderUserAccessTable();
  showToast('Đã đăng xuất tài khoản.', 'info');
}

// ==========================================
// 19. TRỢ GIÚP MODAL
// ==========================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    lucide.createIcons();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('backdrop-blur-sm')) {
    e.target.classList.add('hidden');
  }
});

// ==========================================
// 21. CHỈNH SỬA TÊN & THÔNG TIN THÀNH VIÊN (CHO ADMIN)
// ==========================================
function openQuickRenameModal(memberId) {
  const member = AppState.members.find(m => m.id === memberId);
  if (!member) {
    showToast('Không tìm thấy thông tin thành viên!', 'error');
    return;
  }

  document.getElementById('quickRenameMemberId').value = member.id;
  document.getElementById('quickRenameName').value = member.name;
  document.getElementById('quickRenamePhone').value = member.phone || '';
  document.getElementById('quickRenameType').value = member.type || 'OFFICIAL';

  openModal('quickRenameModal');
}

function handleQuickRenameSubmit(e) {
  e.preventDefault();
  const memberId = document.getElementById('quickRenameMemberId').value;
  const newName = document.getElementById('quickRenameName').value.trim();
  const newPhone = document.getElementById('quickRenamePhone').value.trim();
  const newType = document.getElementById('quickRenameType').value;

  if (!newName) {
    showToast('Họ và tên thành viên không được để trống!', 'warning');
    return;
  }

  const member = AppState.members.find(m => m.id === memberId);
  if (!member) {
    showToast('Không tìm thấy thành viên!', 'error');
    return;
  }

  const oldName = member.name;
  member.name = newName;
  member.phone = newPhone;
  member.type = newType;

  // Đồng bộ cập nhật tên mới vào lịch sử giao dịch và điểm danh
  (AppState.transactions || []).forEach(tx => {
    if (tx.targetName === oldName) {
      tx.targetName = newName;
    }
  });

  (AppState.attendanceRecords || []).forEach(att => {
    if (att.memberId === member.id || att.memberName === oldName) {
      att.memberName = newName;
    }
  });

  saveData();
  closeModal('quickRenameModal');

  renderDashboard();
  renderAttendanceChecklist();
  renderMemberManagementList();
  renderFinanceTab();
  if (currentTab === 'tournament') renderTournamentModule();

  showToast(`Đã đổi tên thành công: "${oldName}" ➔ "${newName}"!`, 'success');
}

// ==========================================
// 22. TẠO ĐIỂM DANH NHANH (QUICK ATTENDANCE)
// ==========================================
let qaSessionLogs = [];
let qaMatchedZaloMembers = [];

function openQuickAttendanceModal() {
  populateQaMemberSelect();
  updateQaSinglePreview();
  renderQaSessionLogs();
  switchQuickAttendanceSubTab('single');
  openModal('quickAttendanceModal');
}

function switchQuickAttendanceSubTab(subTab) {
  document.querySelectorAll('.qa-tab-btn').forEach(btn => {
    btn.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
    btn.classList.add('text-slate-600');
  });
  const activeBtn = document.getElementById(`qa-subtab-${subTab}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-slate-600');
    activeBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
  }

  document.querySelectorAll('.qa-mode-pane').forEach(p => p.classList.add('hidden'));
  const targetPane = document.getElementById(`qa-mode-${subTab}`);
  if (targetPane) targetPane.classList.remove('hidden');

  lucide.createIcons();
}

function populateQaMemberSelect() {
  const select = document.getElementById('qaSingleMemberSelect');
  if (!select) return;

  select.innerHTML = AppState.members.map(m => {
    const nextSession = (m.monthlySessions || 0) + 1;
    const fee = calculateMemberCourtFee(m, true);
    return `<option value="${m.id}">${escapeHtml(m.name)} (${getMemberRoleTypeText(m.type)}) - Buổi #${nextSession}: ${formatMoney(fee)} (Ví: ${formatMoney(m.balance || 0)})</option>`;
  }).join('');
}

function updateQaSinglePreview() {
  const select = document.getElementById('qaSingleMemberSelect');
  const card = document.getElementById('qaSinglePreviewCard');
  if (!select || !card) return;

  const memberId = select.value;
  const member = AppState.members.find(m => m.id === memberId);
  if (!member) {
    card.innerHTML = `<div class="text-xs text-slate-400">Vui lòng chọn thành viên</div>`;
    return;
  }

  const nextSession = (member.monthlySessions || 0) + 1;
  const fee = calculateMemberCourtFee(member, true);
  const tierName = member.type.startsWith('GUEST') ? 'Khách' : getTierNameForSession(nextSession);
  const currentBalance = member.balance || 0;
  const newBalance = currentBalance - fee;

  card.innerHTML = `
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
      <div>
        <span class="text-slate-500 block text-[11px]">Hội viên:</span>
        <b class="text-slate-900 font-bold">${escapeHtml(member.name)}</b>
      </div>
      <div>
        <span class="text-slate-500 block text-[11px]">Lũy kế tháng:</span>
        <b class="text-brand-700 font-bold">Buổi #${nextSession} (${tierName})</b>
      </div>
      <div>
        <span class="text-slate-500 block text-[11px]">Tiền sân trừ ví:</span>
        <b class="text-rose-600 font-black text-sm">${formatMoney(fee)}</b>
      </div>
      <div>
        <span class="text-slate-500 block text-[11px]">Số dư sau trừ:</span>
        <b class="${newBalance < 0 ? 'text-rose-600' : 'text-emerald-700'} font-black text-sm">${formatMoney(newBalance)}</b>
      </div>
    </div>
  `;
}

function executeQaSingle() {
  const select = document.getElementById('qaSingleMemberSelect');
  if (!select || !select.value) {
    showToast('Vui lòng chọn thành viên cần điểm danh!', 'warning');
    return;
  }

  processSingleAttendance(select.value);
  populateQaMemberSelect();
  updateQaSinglePreview();
}

// Hàm cốt lõi thực hiện điểm danh và trừ ví cho 1 thành viên
function processSingleAttendance(memberId) {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền điểm danh! Vui lòng liên hệ Trưởng nhóm để được cấp quyền.', 'warning');
    return false;
  }
  const member = AppState.members.find(m => m.id === memberId);
  if (!member) return false;

  const fee = calculateMemberCourtFee(member, true);
  const nextSession = (member.monthlySessions || 0) + 1;
  const tierName = member.type.startsWith('GUEST') ? 'Khách' : getTierNameForSession(nextSession);
  const nowTime = getNowTimestampString();
  const attDate = getTodayInputFormat();
  const dateFormatted = attDate.split('-').reverse().join('/');
  const operator = (AppState.auth && AppState.auth.user) ? AppState.auth.user.username : 'admin';

  // 1. Trừ ví
  member.balance = (member.balance || 0) - fee;

  // 2. Tăng số buổi
  member.monthlySessions = nextSession;

  // 3. Quỹ CLB ghi nhận tiền sân
  AppState.funds.clubFund = (AppState.funds.clubFund || 0) + fee;

  // 4. Ghi nhận giao dịch
  AppState.transactions.push({
    id: 'TX_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    date: nowTime,
    type: 'COURT_FEE',
    amount: -fee,
    targetName: member.name,
    description: `[Điểm danh nhanh] Trừ tiền sân ngày ${dateFormatted} (Buổi #${nextSession} - ${tierName})`,
    operator: operator
  });

  // 5. Ghi nhận lịch sử điểm danh
  AppState.attendanceRecords.push({
    id: 'ATT_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    date: attDate,
    memberId: member.id,
    memberName: member.name,
    fee: fee,
    sessionIndex: nextSession,
    timestamp: nowTime
  });

  // 6. Ghi vào nhật ký phiên
  qaSessionLogs.unshift({
    time: nowTime.split(' ')[1] || nowTime,
    name: member.name,
    fee: fee,
    session: nextSession,
    balance: member.balance
  });

  saveData();
  renderDashboard();
  renderAttendanceChecklist();
  renderFinanceTab();
  renderQaSessionLogs();

  showToast(`⚡ Đã điểm danh nhanh cho ${member.name}! Trừ ${formatMoney(fee)} (Buổi #${nextSession})`, 'success');
  return true;
}

// Điểm danh 1-chạm trực tiếp từ bảng Dashboard hoặc Quản lý thành viên
function quickCheckInSingleMember(memberId) {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền điểm danh! Vui lòng liên hệ Trưởng nhóm để được cấp quyền.', 'warning');
    return;
  }
  const member = AppState.members.find(m => m.id === memberId);
  if (!member) return;

  const nextSession = (member.monthlySessions || 0) + 1;
  const fee = calculateMemberCourtFee(member, true);
  const tierName = member.type.startsWith('GUEST') ? 'Khách' : getTierNameForSession(nextSession);
  const willBeNegative = (member.balance || 0) - fee < 0;

  const confirmMsg = `⚡ Xác nhận Điểm Danh Nhanh cho:\n👤 ${member.name}\n🏸 Buổi thứ: #${nextSession} (${tierName})\n💰 Tiền sân: ${formatMoney(fee)}\n💳 Số dư ví: ${formatMoney(member.balance || 0)}${willBeNegative ? '\n⚠️ Chú ý: Ví sẽ bị âm tiền sau khi trừ!' : ''}\n\nBạn có muốn trừ ví và ghi nhận ngay không?`;

  if (confirm(confirmMsg)) {
    processSingleAttendance(memberId);
  }
}

// Dán danh sách Zalo và nhận diện
function parseAndMatchZaloList() {
  const textarea = document.getElementById('qaZaloTextarea');
  const resultsArea = document.getElementById('qaZaloResultsArea');
  const listContainer = document.getElementById('qaZaloMatchedList');
  const countEl = document.getElementById('qaZaloMatchedCount');
  if (!textarea || !resultsArea || !listContainer) return;

  const text = textarea.value.trim();
  if (!text) {
    showToast('Vui lòng dán nội dung danh sách người chơi từ Zalo!', 'warning');
    return;
  }

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  qaMatchedZaloMembers = [];
  const matchedIds = new Set();

  lines.forEach(rawLine => {
    const cleanName = rawLine
      .replace(/^[\d\s\.\/\-\+\:\)]+/, '')
      .replace(/[\(\[].*?[\)\]]/g, '')
      .trim()
      .toLowerCase();

    if (!cleanName || cleanName.length < 2) return;

    const found = AppState.members.find(m => {
      const mNameLower = m.name.toLowerCase();
      return mNameLower.includes(cleanName) || cleanName.includes(mNameLower);
    });

    if (found && !matchedIds.has(found.id)) {
      matchedIds.add(found.id);
      qaMatchedZaloMembers.push({
        rawLine: rawLine,
        member: found
      });
    }
  });

  resultsArea.classList.remove('hidden');
  if (countEl) countEl.textContent = `${qaMatchedZaloMembers.length} người khớp`;

  if (qaMatchedZaloMembers.length === 0) {
    listContainer.innerHTML = `<div class="p-3 text-center text-rose-500 font-medium text-xs">Không tìm thấy thành viên nào khớp với danh sách dán vào. Vui lòng kiểm tra lại tên!</div>`;
    return;
  }

  listContainer.innerHTML = qaMatchedZaloMembers.map(item => {
    const m = item.member;
    const nextSession = (m.monthlySessions || 0) + 1;
    const fee = calculateMemberCourtFee(m, true);
    return `
      <label class="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-brand-500 cursor-pointer text-xs">
        <div class="flex items-center gap-2">
          <input type="checkbox" checked data-zalo-member-id="${m.id}" class="qa-zalo-cb w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer" />
          <div>
            <span class="font-bold text-slate-900">${escapeHtml(m.name)}</span>
            <span class="text-[10px] text-slate-400 block">Dòng gốc: "${escapeHtml(item.rawLine)}"</span>
          </div>
        </div>
        <div class="text-right">
          <b class="text-rose-600 font-bold">${formatMoney(fee)}</b>
          <span class="text-[10px] text-slate-400 block">Buổi #${nextSession} (Ví: ${formatMoney(m.balance || 0)})</span>
        </div>
      </label>
    `;
  }).join('');

  lucide.createIcons();
}

function executeQaZaloBatch() {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền điểm danh! Vui lòng liên hệ Trưởng nhóm để được cấp quyền.', 'warning');
    return;
  }
  const cbs = document.querySelectorAll('.qa-zalo-cb:checked');
  if (cbs.length === 0) {
    showToast('Vui lòng chọn ít nhất 1 thành viên trong danh sách để điểm danh!', 'warning');
    return;
  }

  let count = 0;
  let totalFee = 0;
  cbs.forEach(cb => {
    const mId = cb.getAttribute('data-zalo-member-id');
    const member = AppState.members.find(m => m.id === mId);
    if (member) {
      const fee = calculateMemberCourtFee(member, true);
      totalFee += fee;
      processSingleAttendance(mId);
      count++;
    }
  });

  document.getElementById('qaZaloResultsArea').classList.add('hidden');
  document.getElementById('qaZaloTextarea').value = '';

  showToast(`⚡ Đã điểm danh thành công ${count} người từ danh sách Zalo (Tổng: ${formatMoney(totalFee)})!`, 'success');
}

// Điểm danh theo nhóm (Toàn bộ chính thức / Danh dự)
function executeQaGroup(groupType) {
  if (!canPerformAttendance()) {
    showToast('⚠️ Bạn không có quyền điểm danh! Vui lòng liên hệ Trưởng nhóm để được cấp quyền.', 'warning');
    return;
  }
  const targetMembers = AppState.members.filter(m => {
    if (groupType === 'OFFICIAL') return m.type === 'OFFICIAL';
    if (groupType === 'HONORARY' || groupType === 'UNOFFICIAL') return m.type === 'HONORARY' || m.type === 'UNOFFICIAL';
    return m.type === groupType;
  });
  if (targetMembers.length === 0) {
    showToast('Không có thành viên nào thuộc nhóm này!', 'warning');
    return;
  }

  const typeName = groupType === 'OFFICIAL' ? 'Chính thức' : 'Danh dự';
  if (!confirm(`⚡ Xác nhận điểm danh nhanh cho TẤT CẢ ${targetMembers.length} thành viên ${typeName}?\nHệ thống sẽ tự động trừ ví và tăng buổi cho từng người!`)) {
    return;
  }

  let totalFee = 0;
  targetMembers.forEach(m => {
    const fee = calculateMemberCourtFee(m, true);
    totalFee += fee;
    processSingleAttendance(m.id);
  });

  showToast(`⚡ Đã điểm danh xong cho toàn bộ ${targetMembers.length} thành viên ${typeName} (Tổng trừ: ${formatMoney(totalFee)})!`, 'success');
}

function renderQaSessionLogs() {
  const container = document.getElementById('qaSessionLogList');
  const countBadge = document.getElementById('qaSessionCount');
  if (!container) return;

  if (countBadge) countBadge.textContent = `${qaSessionLogs.length} lượt`;

  if (qaSessionLogs.length === 0) {
    container.innerHTML = `<div class="text-[11px] text-slate-400 italic py-1">Chưa có lượt điểm danh nhanh nào trong phiên này</div>`;
    return;
  }

  container.innerHTML = qaSessionLogs.map(log => `
    <div class="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
      <div class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span class="font-bold text-slate-800">${escapeHtml(log.name)}</span>
        <span class="text-[10px] text-slate-400">Buổi #${log.session}</span>
      </div>
      <div class="flex items-center gap-3">
        <b class="text-rose-600 font-bold">-${formatMoney(log.fee)}</b>
        <span class="text-[10px] text-slate-400">${log.time}</span>
      </div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// 19.5 BẢNG THỐNG KÊ CHI TIẾT TẤT TOÁN HOẠT ĐỘNG CLB & XUẤT FILE ẢNH
// ==========================================

let currentSettlementReportDataSource = 'PRESET'; // 'PRESET' (theo mẫu thiết kế) hoặc 'LIVE' (từ dữ liệu thực tế)

const SETTLEMENT_REPORT_PRESET = {
  monthText: 'Tháng 09/2026',
  official: [
    { stt: 1, name: 'Nguyễn Văn A', sessions: 12, total: 1200000, rate: 100000, court: 900000, fund: 200000, fine: 100000 },
    { stt: 2, name: 'Trần Văn B', sessions: 10, total: 950000, rate: 100000, court: 750000, fund: 200000, fine: 0 },
    { stt: 3, name: 'Lê Văn C', sessions: 8, total: 800000, rate: 100000, court: 600000, fund: 200000, fine: 0 },
    { stt: 4, name: 'Phạm Văn D', sessions: 8, total: 800000, rate: 100000, court: 600000, fund: 200000, fine: 0 },
    { stt: 5, name: 'Hoàng Văn E', sessions: 6, total: 600000, rate: 100000, court: 450000, fund: 150000, fine: 0 }
  ],
  honorary: [
    { stt: 1, name: 'Nguyễn Văn H', sessions: 6, total: 600000, rate: 100000, court: 450000, fund: 150000, fine: 0 },
    { stt: 2, name: 'Đỗ Văn I', sessions: 5, total: 500000, rate: 100000, court: 375000, fund: 125000, fine: 0 },
    { stt: 3, name: 'Lý Văn K', sessions: 4, total: 400000, rate: 100000, court: 300000, fund: 100000, fine: 0 }
  ],
  guests: [
    { stt: 1, name: 'Khách 01', sessions: 4, total: 400000, rate: 100000, court: 400000, fund: 0, fine: 0 },
    { stt: 2, name: 'Khách 02', sessions: 3, total: 300000, rate: 100000, court: 300000, fund: 0, fine: 0 },
    { stt: 3, name: 'Khách 03', sessions: 2, total: 200000, rate: 100000, court: 200000, fund: 0, fine: 0 },
    { stt: 4, name: 'Khách 04', sessions: 1, total: 100000, rate: 100000, court: 100000, fund: 0, fine: 0 }
  ],
  kpi: {
    participants: 17,
    participantsDetail: '(14 TV + 3 Khách)',
    totalSessions: 69,
    totalCollected: 6850000,
    totalCourt: 5425000,
    totalFund: 1325000,
    totalFine: 100000,
    walletDeducted: 1800000,
    walletRemaining: 4950000,
    walletEndMonthBal: 0
  }
};

function openSettlementReportModal() {
  const monthInput = document.getElementById('settlementReportMonth');
  if (monthInput && !monthInput.value) {
    const d = new Date();
    monthInput.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
  renderSettlementReport();
  openModal('settlementReportModal');
}

function toggleSettlementReportDataSource() {
  currentSettlementReportDataSource = currentSettlementReportDataSource === 'PRESET' ? 'LIVE' : 'PRESET';
  const label = document.getElementById('btnSettlementDataSourceText');
  if (label) {
    label.textContent = currentSettlementReportDataSource === 'PRESET' ? 'Dữ liệu: Mẫu thiết kế chuẩn' : 'Dữ liệu: Thực tế từ CLB';
  }
  renderSettlementReport();
  showToast(`Đã chuyển sang ${currentSettlementReportDataSource === 'PRESET' ? 'dữ liệu mẫu chuẩn thiết kế' : 'dữ liệu hoạt động thực tế CLB'}!`);
}

function renderSettlementReport() {
  const monthInput = document.getElementById('settlementReportMonth');
  let monthStr = '09/2026';
  if (monthInput && monthInput.value) {
    const parts = monthInput.value.split('-');
    if (parts.length === 2) {
      monthStr = `${parts[1]}/${parts[0]}`;
    }
  }

  // Update headers
  const repHeaderMonth = document.getElementById('repHeaderMonthText');
  if (repHeaderMonth) repHeaderMonth.textContent = `Tháng ${monthStr}`;

  const repFooterMonth = document.getElementById('repFooterMonthTitle');
  if (repFooterMonth) repFooterMonth.textContent = `TỔNG KẾT TẤT TOÁN THÁNG ${monthStr}`;

  let data = null;
  if (currentSettlementReportDataSource === 'PRESET') {
    data = SETTLEMENT_REPORT_PRESET;
  } else {
    data = generateLiveSettlementReportData(monthStr);
  }

  // 1. Render Table I: Thành viên chính thức
  const tbodyOfficial = document.getElementById('repTableOfficialBody');
  if (tbodyOfficial) {
    tbodyOfficial.innerHTML = data.official.map(row => `
      <tr class="hover:bg-emerald-50/40 transition divide-x divide-slate-100 text-xs text-slate-800">
        <td class="py-2 px-2 text-center font-bold text-slate-600">${row.stt}</td>
        <td class="py-2 px-3 font-bold text-slate-900">${escapeHtml(row.name)}</td>
        <td class="py-2 px-2 text-center font-bold">${row.sessions}</td>
        <td class="py-2 px-2 text-right font-black text-slate-900">${formatNumberDot(row.total)}</td>
        <td class="py-2 px-2 text-right text-slate-600">${formatNumberDot(row.rate)}</td>
        <td class="py-2 px-2 text-right text-slate-700">${formatNumberDot(row.court)}</td>
        <td class="py-2 px-2 text-right text-slate-700">${formatNumberDot(row.fund)}</td>
        <td class="py-2 px-2 text-right ${row.fine > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}">${formatNumberDot(row.fine)}</td>
      </tr>
    `).join('');
  }

  // Official Totals
  const totalOffSessions = data.official.reduce((s, r) => s + (r.sessions || 0), 0);
  const totalOffPaid = data.official.reduce((s, r) => s + (r.total || 0), 0);
  const totalOffCourt = data.official.reduce((s, r) => s + (r.court || 0), 0);
  const totalOffFund = data.official.reduce((s, r) => s + (r.fund || 0), 0);
  const totalOffFine = data.official.reduce((s, r) => s + (r.fine || 0), 0);

  setElText('repTotalOfficialSessions', totalOffSessions);
  setElText('repTotalOfficialPaid', formatNumberDot(totalOffPaid));
  setElText('repAvgOfficialRate', '100.000');
  setElText('repTotalOfficialCourt', formatNumberDot(totalOffCourt));
  setElText('repTotalOfficialFund', formatNumberDot(totalOffFund));
  setElText('repTotalOfficialFine', formatNumberDot(totalOffFine));

  // 2. Render Table II: Thành viên danh dự
  const tbodyHonorary = document.getElementById('repTableHonoraryBody');
  if (tbodyHonorary) {
    tbodyHonorary.innerHTML = data.honorary.map(row => `
      <tr class="hover:bg-sky-50/40 transition divide-x divide-slate-100 text-xs text-slate-800">
        <td class="py-2 px-2 text-center font-bold text-slate-600">${row.stt}</td>
        <td class="py-2 px-3 font-bold text-slate-900">${escapeHtml(row.name)}</td>
        <td class="py-2 px-2 text-center font-bold">${row.sessions}</td>
        <td class="py-2 px-2 text-right font-black text-slate-900">${formatNumberDot(row.total)}</td>
        <td class="py-2 px-2 text-right text-slate-600">${formatNumberDot(row.rate)}</td>
        <td class="py-2 px-2 text-right text-slate-700">${formatNumberDot(row.court)}</td>
        <td class="py-2 px-2 text-right text-slate-700">${formatNumberDot(row.fund)}</td>
        <td class="py-2 px-2 text-right ${row.fine > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}">${formatNumberDot(row.fine)}</td>
      </tr>
    `).join('');
  }

  // Honorary Totals
  const totalHonSessions = data.honorary.reduce((s, r) => s + (r.sessions || 0), 0);
  const totalHonPaid = data.honorary.reduce((s, r) => s + (r.total || 0), 0);
  const totalHonCourt = data.honorary.reduce((s, r) => s + (r.court || 0), 0);
  const totalHonFund = data.honorary.reduce((s, r) => s + (r.fund || 0), 0);
  const totalHonFine = data.honorary.reduce((s, r) => s + (r.fine || 0), 0);

  setElText('repTotalHonorarySessions', totalHonSessions);
  setElText('repTotalHonoraryPaid', formatNumberDot(totalHonPaid));
  setElText('repAvgHonoraryRate', '100.000');
  setElText('repTotalHonoraryCourt', formatNumberDot(totalHonCourt));
  setElText('repTotalHonoraryFund', formatNumberDot(totalHonFund));
  setElText('repTotalHonoraryFine', formatNumberDot(totalHonFine));

  // 3. Render Table III: Khách giao lưu
  const tbodyGuest = document.getElementById('repTableGuestBody');
  if (tbodyGuest) {
    tbodyGuest.innerHTML = data.guests.map(row => `
      <tr class="hover:bg-orange-50/40 transition divide-x divide-slate-100 text-xs text-slate-800">
        <td class="py-2 px-2 text-center font-bold text-slate-600">${row.stt}</td>
        <td class="py-2 px-3 font-bold text-slate-900">${escapeHtml(row.name)}</td>
        <td class="py-2 px-2 text-center font-bold">${row.sessions}</td>
        <td class="py-2 px-2 text-right font-black text-slate-900">${formatNumberDot(row.total)}</td>
        <td class="py-2 px-2 text-right text-slate-600">${formatNumberDot(row.rate)}</td>
        <td class="py-2 px-2 text-right text-slate-700">${formatNumberDot(row.court)}</td>
        <td class="py-2 px-2 text-right text-slate-400">0</td>
        <td class="py-2 px-2 text-right text-slate-400">0</td>
      </tr>
    `).join('');
  }

  // Guest Totals
  const totalGuestSessions = data.guests.reduce((s, r) => s + (r.sessions || 0), 0);
  const totalGuestPaid = data.guests.reduce((s, r) => s + (r.total || 0), 0);
  const totalGuestCourt = data.guests.reduce((s, r) => s + (r.court || 0), 0);

  setElText('repTotalGuestSessions', totalGuestSessions);
  setElText('repTotalGuestPaid', formatNumberDot(totalGuestPaid));
  setElText('repAvgGuestRate', '100.000');
  setElText('repTotalGuestCourt', formatNumberDot(totalGuestCourt));
  setElText('repTotalGuestFund', '0');
  setElText('repTotalGuestFine', '0');

  // 4. Render Footer Dashboard Metrics
  const grandTotalSessions = totalOffSessions + totalHonSessions + totalGuestSessions;
  const grandTotalCollected = totalOffPaid + totalHonPaid + totalGuestPaid;
  const grandTotalCourt = totalOffCourt + totalHonCourt + totalGuestCourt;
  const grandTotalFund = totalOffFund + totalHonFund;
  const grandTotalFine = totalOffFine;

  setElText('repKpiParticipants', data.kpi ? data.kpi.participants : (data.official.length + data.honorary.length + data.guests.length));
  setElText('repKpiParticipantsDetail', data.kpi ? data.kpi.participantsDetail : `(${data.official.length + data.honorary.length} TV + ${data.guests.length} Khách)`);
  setElText('repKpiTotalSessions', data.kpi ? data.kpi.totalSessions : grandTotalSessions);
  setElText('repKpiTotalCollected', formatNumberDot(data.kpi ? data.kpi.totalCollected : grandTotalCollected));
  setElText('repKpiTotalCourt', formatNumberDot(data.kpi ? data.kpi.totalCourt : grandTotalCourt));
  setElText('repKpiTotalClubFund', formatNumberDot(data.kpi ? data.kpi.totalFund : grandTotalFund));
  setElText('repKpiTotalFine', formatNumberDot(data.kpi ? data.kpi.totalFine : grandTotalFine));

  // Đối chiếu ví thành viên
  setElText('repWalletDeducted', formatNumberDot(data.kpi ? data.kpi.walletDeducted : 1800000));
  setElText('repWalletRemaining', formatNumberDot(data.kpi ? data.kpi.walletRemaining : (grandTotalCollected - 1800000 - grandTotalFine)));
  setElText('repWalletEndMonthBal', formatNumberDot(data.kpi ? data.kpi.walletEndMonthBal : 0));
}

function formatNumberDot(num) {
  return (Number(num) || 0).toLocaleString('vi-VN');
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/**
 * Sinh dữ liệu báo cáo tất toán từ danh sách thành viên thực tế trong AppState
 */
function generateLiveSettlementReportData(monthStr) {
  const members = AppState.members || [];
  const official = [];
  const honorary = [];
  const guests = [];

  let sttOff = 1;
  let sttHon = 1;
  let sttG = 1;

  members.forEach(m => {
    const sessions = m.monthlySessions || 1;
    const rate = 100000;
    if (m.type === 'OFFICIAL') {
      const court = sessions * 75000;
      const fund = 200000;
      const fine = (AppState.transactions || [])
        .filter(t => t.subType === 'FINE' && t.targetName && t.targetName.includes(m.name))
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      const total = court + fund + fine;
      official.push({
        stt: sttOff++,
        name: m.name,
        sessions,
        total,
        rate,
        court,
        fund,
        fine
      });
    } else if (m.type === 'HONORARY') {
      const court = Math.round(sessions * 75000);
      const fund = Math.round(sessions * 25000);
      const total = court + fund;
      honorary.push({
        stt: sttHon++,
        name: m.name,
        sessions,
        total,
        rate,
        court,
        fund,
        fine: 0
      });
    } else if (m.type.startsWith('GUEST')) {
      const court = sessions * 100000;
      guests.push({
        stt: sttG++,
        name: m.name || m.chipName || `Khách ${sttG}`,
        sessions,
        total: court,
        rate,
        court,
        fund: 0,
        fine: 0
      });
    }
  });

  const grandTotalSessions = official.concat(honorary, guests).reduce((s, r) => s + r.sessions, 0);
  const grandTotalCollected = official.concat(honorary, guests).reduce((s, r) => s + r.total, 0);
  const grandTotalCourt = official.concat(honorary, guests).reduce((s, r) => s + r.court, 0);
  const grandTotalFund = official.concat(honorary).reduce((s, r) => s + r.fund, 0);
  const grandTotalFine = official.reduce((s, r) => s + r.fine, 0);

  return {
    monthText: `Tháng ${monthStr}`,
    official: official.slice(0, 10),
    honorary: honorary.slice(0, 7),
    guests: guests.slice(0, 6),
    kpi: {
      participants: official.length + honorary.length + guests.length,
      participantsDetail: `(${official.length + honorary.length} TV + ${guests.length} Khách)`,
      totalSessions: grandTotalSessions,
      totalCollected: grandTotalCollected,
      totalCourt: grandTotalCourt,
      totalFund: grandTotalFund,
      totalFine: grandTotalFine,
      walletDeducted: 1800000,
      walletRemaining: Math.max(0, grandTotalCollected - 1800000),
      walletEndMonthBal: 0
    }
  };
}

/**
 * Xuất Bảng Thống Kê Tất Toán thành file ảnh PNG độ nét cao (2x Retina)
 */
async function exportSettlementReportAsImage() {
  const reportContainer = document.getElementById('settlementReportExportContainer');
  if (!reportContainer) return;

  const monthInput = document.getElementById('settlementReportMonth');
  const monthVal = monthInput ? monthInput.value.replace('-', '_') : '09_2026';
  const filename = `Tat-Toan-CLB-Thang-${monthVal}.png`;

  showToast('Đang kết xuất ảnh chất lượng cao 2x, vui lòng đợi giây lát...');

  if (typeof html2canvas !== 'undefined') {
    try {
      const canvas = await html2canvas(reportContainer, {
        scale: 2, // Độ phân giải 2x Retina siêu nét
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1200
      });

      const imageUri = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = imageUri;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast(`✓ Đã tải file ảnh [${filename}] thành công!`);
      return;
    } catch (err) {
      console.error('Lỗi xuất html2canvas:', err);
      alert('Không thể tạo file ảnh tự động: ' + err.message);
    }
  } else {
    alert('Thư viện tạo ảnh chưa sẵn sàng. Bạn có thể sử dụng chức năng chụp màn hình hoặc In PDF!');
  }
}

/**
 * Sao chép ảnh bảng tất toán trực tiếp vào Clipboard để dán (Ctrl+V) vào Zalo / Messenger
 */
async function copySettlementReportToClipboard() {
  const reportContainer = document.getElementById('settlementReportExportContainer');
  if (!reportContainer) return;

  if (typeof html2canvas === 'undefined') {
    alert('Thư viện tạo ảnh đang tải, vui lòng thử lại sau vài giây!');
    return;
  }

  showToast('Đang sao chép ảnh vào bộ nhớ tạm...');

  try {
    const canvas = await html2canvas(reportContainer, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1200
    });

    if (canvas.toBlob && navigator.clipboard && window.ClipboardItem) {
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          alert('✓ ĐÃ SAO CHÉP ẢNH TẤT TOÁN VÀO CLIPBOARD!\n\nBây giờ bạn chỉ cần mở Zalo hoặc Messenger và bấm Ctrl + V (hoặc Chạm giữ -> Dán) để gửi ảnh nhanh cho CLB.');
        } catch (e) {
          // Fallback: download instead
          exportSettlementReportAsImage();
        }
      }, 'image/png');
    } else {
      exportSettlementReportAsImage();
    }
  } catch (err) {
    console.error('Clipboard copy error:', err);
    exportSettlementReportAsImage();
  }
}

// ==========================================
// 20. KHỞI TẠO ỨNG DỤNG KHI TẢI TRANG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  applyThemeColor(AppState.config.themeColor || 'emerald');
  renderDashboard();
  renderClubSwitcher();
  updateDevDemoToggleUI();
  populateLeadershipSelects();
  initTournamentModule();
  lucide.createIcons();
  initFirebaseCloudSync();

  if (window.location.hash) {
    const rawHash = window.location.hash.replace('#', '');
    if (rawHash === 'settings-collapsed') {
      switchTab('settings');
      toggleLeadershipCollapse();
    } else if (rawHash === 'settings-access') {
      switchTab('settings');
      toggleLeadershipCollapse();
    } else if (rawHash === 'multi-club-settings') {
      switchTab('settings');
      setTimeout(() => {
        const el = document.getElementById('multiClubListContainer');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } else if (rawHash === 'club-shortcut-modal') {
      switchTab('settings');
      setTimeout(() => {
        openClubShortcutGuideModal();
      }, 300);
    } else if (rawHash === 'user-access-modal') {
      switchTab('settings');
      setTimeout(() => {
        openUserAccessModal('M002');
      }, 200);
    } else if (rawHash === 'create-club-modal') {
      setTimeout(() => {
        openCreateClubModal();
      }, 300);
    } else if (rawHash === 'switch-lightning') {
      setTimeout(() => {
        switchActiveClub('club_lightning');
      }, 200);
    } else if (rawHash === 'switch-smash') {
      setTimeout(() => {
        switchActiveClub('club_smash');
      }, 200);
    } else if (rawHash.startsWith('tournament')) {
      switchTab('tournament');
      if (rawHash === 'tournament-schedule') switchTourSubtab('schedule');
      else if (rawHash === 'tournament-players' || rawHash === 'tournament-clubs') switchTourSubtab('clubs');
      else if (rawHash === 'tournament-config') switchTourSubtab('config');
      else if (rawHash === 'tournament-awards') switchTourSubtab('awards');
      else if (rawHash === 'tournament-xd') { switchTourSubtab('bracket'); switchTourDiscipline('XD'); }
      else if (rawHash === 'tournament-score-modal') {
        switchTourSubtab('bracket');
        setTimeout(() => openEditScoreModal('MD', 'ga1', true), 150);
      } else if (rawHash === 'tournament-add-club-modal') {
        switchTourSubtab('clubs');
        openAddClubModal();
        loadSampleClubMembers();
      }
    } else if (['dashboard', 'attendance', 'finance', 'members', 'matchmaker', 'tournament', 'settings'].includes(rawHash)) {
      switchTab(rawHash);
    }
  }
});

// ==========================================
// 21. MODULE ĐỒNG BỘ ĐÁM MÂY (FIREBASE REALTIME DATABASE)
// ==========================================
const CLOUD_CONFIG_STORAGE_KEY = 'CLB_FIREBASE_CONFIG';
let firebaseDb = null;
let isSyncingToCloud = false;
let isReceivingFromCloud = false;
let cloudSyncDebounceTimer = null;
let currentCloudClubRef = null;
let currentCloudSlug = null;

// Phân tích mã cấu hình Firebase dù là JSON, biến Javascript hay chuỗi
function parseFirebaseConfigInput(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return null;
  const str = rawInput.trim();
  
  // 1. Thử parse JSON trực tiếp
  try {
    const obj = JSON.parse(str);
    if (obj.databaseURL || obj.projectId || obj.apiKey) return obj;
  } catch (e) {}

  // 2. Tìm khối object { ... } trong đoạn mã JS
  const match = str.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const jsonStr = match[0]
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
        .replace(/'/g, '"')
        .replace(/,\s*}/g, '}');
      const obj = JSON.parse(jsonStr);
      if (obj.databaseURL || obj.projectId || obj.apiKey) return obj;
    } catch (e) {}
  }

  // 3. Tìm từng trường riêng lẻ bằng Regex
  const extractField = (key) => {
    const reg = new RegExp(`['"]?${key}['"]?\\s*:\\s*['"]([^'"]+)['"]`, 'i');
    const m = str.match(reg);
    return m ? m[1].trim() : '';
  };

  const apiKey = extractField('apiKey');
  const databaseURL = extractField('databaseURL');
  const projectId = extractField('projectId');
  const authDomain = extractField('authDomain');
  const appId = extractField('appId');

  if (databaseURL || (projectId && apiKey)) {
    return {
      apiKey: apiKey,
      databaseURL: databaseURL || `https://${projectId}-default-rtdb.firebaseio.com`,
      projectId: projectId,
      authDomain: authDomain || `${projectId}.firebaseapp.com`,
      appId: appId
    };
  }

  return null;
}

// Cấu hình Firebase mặc định của dự án clblaptri
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAQ08HDY7wi9jQnhTH7mHkoavdRzIas-lA",
  authDomain: "clblaptri.firebaseapp.com",
  databaseURL: "https://clblaptri-default-rtdb.firebaseio.com",
  projectId: "clblaptri",
  storageBucket: "clblaptri.firebasestorage.app",
  messagingSenderId: "324734150204",
  appId: "1:324734150204:web:6aa6524fa6cdabe8cfc539",
  measurementId: "G-6HK3TLY2HW"
};

function getStoredFirebaseConfig() {
  try {
    const raw = localStorage.getItem(CLOUD_CONFIG_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_FIREBASE_CONFIG;
}

function updateCloudSyncUI(status, message = '') {
  const dot = document.getElementById('cloudSyncDot');
  const text = document.getElementById('cloudSyncText');
  const modalBadge = document.getElementById('modalCloudStatusBadge');
  const settingsBadge = document.getElementById('settingsCloudStatusBadge');
  const bannerIcon = document.getElementById('cloudStatusIcon');
  const bannerTitle = document.getElementById('cloudStatusTitle');
  const bannerDesc = document.getElementById('cloudStatusDesc');

  let dotColor = 'bg-slate-400';
  let badgeText = 'Ngoại tuyến';
  let badgeClass = 'bg-slate-200 text-slate-700';
  let icon = '⚪';
  let title = 'Chưa kết nối đám mây';
  let desc = 'Dữ liệu đang được lưu cục bộ trên máy này.';

  if (status === 'CONNECTED') {
    dotColor = 'bg-emerald-500 animate-pulse';
    badgeText = 'Đang đồng bộ';
    badgeClass = 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    icon = '🟢';
    title = 'Đã kết nối đám mây trực tuyến';
    desc = 'Tất cả thay đổi sẽ đồng bộ tức thì với Điện thoại & Máy tính khác.';
  } else if (status === 'SYNCING') {
    dotColor = 'bg-amber-500 animate-spin';
    badgeText = 'Đang tải lên...';
    badgeClass = 'bg-amber-100 text-amber-800 border border-amber-300';
    icon = '🟡';
    title = 'Đang đẩy dữ liệu lên đám mây...';
    desc = 'Đang cập nhật lên máy chủ Google Firebase.';
  } else if (status === 'CONNECTING') {
    dotColor = 'bg-sky-500 animate-pulse';
    badgeText = 'Đang kết nối...';
    badgeClass = 'bg-sky-100 text-sky-800 border border-sky-300';
    icon = '🔵';
    title = 'Đang kết nối máy chủ Google...';
    desc = 'Đang xác thực thông tin cấu hình Firebase.';
  } else if (status === 'ERROR') {
    dotColor = 'bg-rose-500';
    badgeText = 'Lỗi kết nối';
    badgeClass = 'bg-rose-100 text-rose-800 border border-rose-300';
    icon = '🔴';
    title = 'Lỗi kết nối Firebase';
    desc = message || 'Vui lòng kiểm tra lại mã cấu hình hoặc quyền truy cập của Realtime Database.';
  }

  if (dot) {
    dot.className = `w-2.5 h-2.5 rounded-full ${dotColor}`;
  }
  if (text) {
    text.textContent = status === 'CONNECTED' ? 'Đám mây: Đã kết nối' : (status === 'SYNCING' ? 'Đám mây: Đang lưu...' : 'Đám mây');
  }
  if (modalBadge) {
    modalBadge.className = `px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`;
    modalBadge.textContent = badgeText;
  }
  if (settingsBadge) {
    settingsBadge.className = `flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badgeClass}`;
    settingsBadge.innerHTML = `<span class="w-2 h-2 rounded-full ${dotColor}"></span><span>${title}</span>`;
  }
  if (bannerIcon) bannerIcon.textContent = icon;
  if (bannerTitle) bannerTitle.textContent = title;
  if (bannerDesc) bannerDesc.textContent = desc;
}

function initFirebaseCloudSync() {
  // 1. Kiểm tra tham số cloud_cfg trên URL (khi mở link từ Zalo trên điện thoại)
  try {
    const url = new URL(window.location.href);
    const cloudCfgParam = url.searchParams.get('cloud_cfg');
    if (cloudCfgParam) {
      try {
        const decoded = decodeURIComponent(escape(atob(cloudCfgParam)));
        const parsed = JSON.parse(decoded);
        if (parsed && (parsed.databaseURL || parsed.projectId)) {
          localStorage.setItem(CLOUD_CONFIG_STORAGE_KEY, JSON.stringify(parsed));
          showToast('🎉 Đã kích hoạt đồng bộ đám mây tự động theo link!', 'success');
        }
      } catch (e) {
        console.error('Lỗi giải mã cloud_cfg:', e);
      }
      url.searchParams.delete('cloud_cfg');
      window.history.replaceState({}, '', url.toString());
    }
  } catch (e) {}

  // 2. Kiểm tra thư viện Firebase SDK
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK chưa được tải.');
    updateCloudSyncUI('OFFLINE');
    return;
  }

  const config = getStoredFirebaseConfig();
  if (!config) {
    updateCloudSyncUI('OFFLINE');
    return;
  }

  try {
    updateCloudSyncUI('CONNECTING');
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
    firebaseDb = firebase.database();

    // Theo dõi trạng thái kết nối mạng
    firebaseDb.ref('.info/connected').on('value', snap => {
      const isConnected = snap.val() === true;
      if (isConnected) {
        updateCloudSyncUI('CONNECTED');
      } else {
        updateCloudSyncUI('CONNECTING');
      }
    });

    // Bắt đầu lắng nghe thay đổi của CLB hiện tại
    const club = getActiveClub();
    const clubSlug = club?.accessSlug || club?.id || 'clb';
    subscribeToCloudClub(clubSlug);
  } catch (err) {
    console.error('Lỗi khởi tạo Firebase:', err);
    updateCloudSyncUI('ERROR', err.message);
  }
}

function subscribeToCloudClub(clubSlug) {
  if (!firebaseDb) return;
  const cleanSlug = (clubSlug || 'clb').toLowerCase().replace(/[^a-z0-9_-]/g, '-');

  // Hủy đăng ký CLB cũ nếu có
  if (currentCloudClubRef) {
    try { currentCloudClubRef.off(); } catch (e) {}
  }

  currentCloudSlug = cleanSlug;
  currentCloudClubRef = firebaseDb.ref('clubs/' + cleanSlug);

  currentCloudClubRef.on('value', snapshot => {
    const cloudData = snapshot.val();
    if (!cloudData) {
      // Nếu trên đám mây chưa có dữ liệu cho CLB này, tự động đẩy dữ liệu hiện tại lên
      if (AppState && AppState.members && AppState.members.length > 0 && !isSyncingToCloud) {
        pushDataToCloud();
      }
      return;
    }

    // Nếu đang trong quá trình mình đẩy lên thì bỏ qua
    if (isSyncingToCloud) return;

    // Kiểm tra xem dữ liệu đám mây có mới hơn không
    const localTime = AppState._lastModified || 0;
    const cloudTime = cloudData._lastModified || 0;

    const localMemberCount = AppState.members?.length || 0;
    const cloudMemberCount = cloudData.members?.length || 0;
    const localTxCount = AppState.transactions?.length || 0;
    const cloudTxCount = cloudData.transactions?.length || 0;

    // Hợp nhất dữ liệu thông minh hai chiều (tránh mất thành viên vừa tạo trên một thiết bị)
    if (AppState && AppState.members && cloudData.members) {
      const cloudMemberIds = new Set(cloudData.members.map(m => m.id));
      const newLocalMembers = AppState.members.filter(m => !cloudMemberIds.has(m.id));
      if (newLocalMembers.length > 0) {
        cloudData.members = cloudData.members.concat(newLocalMembers);
        setTimeout(() => { pushDataToCloud(); }, 300);
      }
    }

    const isDifferent = (cloudTime > localTime) || (localMemberCount !== cloudMemberCount) || (localTxCount !== cloudTxCount);

    if (isDifferent) {
      isReceivingFromCloud = true;
      AppState = cloudData;
      STORAGE_KEY = getCurrentClubStorageKey();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
      } catch (e) {}

      applyThemeColor(AppState.config?.themeColor || 'emerald');
      const nameEl = document.getElementById('headerClubName');
      if (nameEl) nameEl.textContent = AppState.config?.clubName || 'CLB CẦU LÔNG';

      renderDashboard();
      renderMemberManagementList();
      renderFinanceTab();
      if (currentTab === 'attendance') renderAttendanceTab();
      renderClubSwitcher();
      populateLeadershipSelects();

      showToast(`☁️ Đã đồng bộ số liệu mới nhất từ đám mây (${AppState.members?.length || 0} thành viên)!`, 'info');
      setTimeout(() => { isReceivingFromCloud = false; }, 600);
    }
  }, err => {
    console.error('Lỗi lắng nghe Firebase:', err);
    updateCloudSyncUI('ERROR', err.message);
  });
}

function pushDataToCloud() {
  if (!firebaseDb || isReceivingFromCloud) return;
  const club = getActiveClub();
  const cleanSlug = (club?.accessSlug || club?.id || 'clb').toLowerCase().replace(/[^a-z0-9_-]/g, '-');

  clearTimeout(cloudSyncDebounceTimer);
  cloudSyncDebounceTimer = setTimeout(() => {
    if (!firebaseDb || isReceivingFromCloud) return;
    isSyncingToCloud = true;
    updateCloudSyncUI('SYNCING');

    AppState._lastModified = Date.now();

    firebaseDb.ref('clubs/' + cleanSlug).set(AppState)
      .then(() => {
        isSyncingToCloud = false;
        updateCloudSyncUI('CONNECTED');
      })
      .catch(err => {
        isSyncingToCloud = false;
        console.error('Lỗi đẩy dữ liệu lên Firebase:', err);
        updateCloudSyncUI('ERROR', err.message);
      });
  }, 400);
}

function openCloudSyncModal() {
  const modal = document.getElementById('modalCloudSync');
  if (!modal) return;

  const input = document.getElementById('cloudFirebaseConfigInput');
  const stored = getStoredFirebaseConfig();
  if (input) {
    input.value = stored ? JSON.stringify(stored, null, 2) : '';
  }

  const storedConfig = getStoredFirebaseConfig();
  if (storedConfig) {
    updateCloudSyncUI(firebaseDb ? 'CONNECTED' : 'CONNECTING');
  } else {
    updateCloudSyncUI('OFFLINE');
  }

  openModal('modalCloudSync');
}

function saveCloudConfigAndConnect() {
  const input = document.getElementById('cloudFirebaseConfigInput');
  const raw = input ? input.value.trim() : '';

  if (!raw) {
    showToast('Vui lòng dán mã cấu hình Firebase!', 'warning');
    return;
  }

  const parsed = parseFirebaseConfigInput(raw);
  if (!parsed || (!parsed.databaseURL && !parsed.projectId)) {
    showToast('Mã cấu hình không hợp lệ! Vui lòng kiểm tra lại databaseURL hoặc projectId.', 'error');
    return;
  }

  localStorage.setItem(CLOUD_CONFIG_STORAGE_KEY, JSON.stringify(parsed));
  showToast('✓ Đã lưu cấu hình Firebase! Đang tiến hành kết nối...', 'info');

  initFirebaseCloudSync();

  // Đẩy dữ liệu hiện tại lên đám mây ngay lập tức
  setTimeout(() => {
    if (firebaseDb) {
      pushDataToCloud();
      showToast('🎉 Kết nối đám mây thành công! Dữ liệu đã được tải lên máy chủ Google.', 'success');
    }
  }, 1000);
}

function disconnectCloudSync() {
  if (!confirm('Bạn có chắc chắn muốn ngắt kết nối đồng bộ đám mây?\nDữ liệu trên máy này vẫn sẽ được lưu trữ bình thường trong trình duyệt.')) {
    return;
  }

  if (currentCloudClubRef) {
    try { currentCloudClubRef.off(); } catch (e) {}
  }
  firebaseDb = null;
  localStorage.removeItem(CLOUD_CONFIG_STORAGE_KEY);
  updateCloudSyncUI('OFFLINE');

  const input = document.getElementById('cloudFirebaseConfigInput');
  if (input) input.value = '';

  showToast('Đã ngắt kết nối đám mây. Ứng dụng chuyển sang chế độ ngoại tuyến.', 'info');
}

function testCloudConnection() {
  const stored = getStoredFirebaseConfig();
  if (!stored) {
    showToast('Chưa có cấu hình đám mây. Vui lòng dán mã Firebase trước.', 'warning');
    return;
  }

  updateCloudSyncUI('CONNECTING');
  showToast('Đang kiểm tra kết nối đến Google Firebase...', 'info');

  if (!firebaseDb) {
    initFirebaseCloudSync();
  }

  setTimeout(() => {
    if (firebaseDb) {
      updateCloudSyncUI('CONNECTED');
      showToast('✓ Kết nối đám mây hoạt động hoàn hảo!', 'success');
    } else {
      updateCloudSyncUI('ERROR', 'Không thể kết nối đến Firebase');
      showToast('Không thể kết nối đến Firebase! Vui lòng kiểm tra quyền Realtime Database (Test mode).', 'error');
    }
  }, 1500);
}

function copyMobileSyncUrl() {
  const stored = getStoredFirebaseConfig();
  if (!stored) {
    showToast('Vui lòng kết nối cấu hình Firebase trước khi tạo link cho điện thoại!', 'warning');
    openCloudSyncModal();
    return;
  }

  const club = getActiveClub();
  const slug = club?.accessSlug || club?.id || 'clb';
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(stored))));
  const baseUrl = window.location.href.split('#')[0].split('?')[0];
  const syncUrl = `${baseUrl}?club=${encodeURIComponent(slug)}&cloud_cfg=${encodeURIComponent(encoded)}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(syncUrl).then(() => {
      showToast('📋 Đã sao chép link đồng bộ! Hãy gửi link qua Zalo và mở trên Điện thoại để tự động kết nối.', 'success');
    }).catch(() => {
      prompt('Sao chép link đồng bộ này và gửi qua Zalo cho Điện thoại:', syncUrl);
    });
  } else {
    prompt('Sao chép link đồng bộ này và gửi qua Zalo cho Điện thoại:', syncUrl);
  }
}

function manualTriggerCloudSync() {
  const stored = getStoredFirebaseConfig();
  if (!stored) {
    showToast('Chưa kết nối đám mây. Hãy bấm "Cài đặt Kết Nối Đám Mây" trước.', 'warning');
    openCloudSyncModal();
    return;
  }

  if (!firebaseDb) {
    initFirebaseCloudSync();
  }

  showToast('Đang đồng bộ dữ liệu hai chiều...', 'info');
  pushDataToCloud();
  setTimeout(() => {
    showToast('✓ Đồng bộ đám mây hoàn tất!', 'success');
  }, 1000);
}
