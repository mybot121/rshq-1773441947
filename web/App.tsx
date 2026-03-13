
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  User as UserIcon, 
  ArrowLeftRight, 
  LogOut, 
  Search, 
  Lock, 
  Mail, 
  Send,
  Trash2,
  Edit,
  XCircle,
  ChevronLeft,
  Settings2,
  Coins,
  ArrowUpRight,
  History,
  Plus,
  ExternalLink,
  Wallet,
  CheckCircle,
  Package,
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Info,
  KeyRound,
  Eye,
  UserPlus,
  MinusCircle,
  Users,
  Layers,
  ShoppingBag,
  Target,
  BarChart3,
  Globe,
  PlusCircle,
  LayoutDashboard,
  CreditCard,
  Smartphone,
  Check,
  Clock,
  ShieldCheck,
  Zap,
  Trash,
  ChevronRight,
  Calculator,
  Link as LinkIcon,
  Star,
  Timer,
  Activity,
  X,
  Play,
  RotateCcw,
  Server,
  ShieldAlert,
  ArrowRight,
  Palette,
  Construction
} from 'lucide-react';
import { User, Category, Service, Order, Transfer, RechargeRequest, ProviderSettings, Platform } from './types';
import { ADMIN_CREDENTIALS_ENCODED } from './constants';

const ASIA_LOGO = "https://cdn.discordapp.com/attachments/1437189300327419935/1466747233847214296/Screenshot_2026-01-30_134925.png?ex=697dde4f&is=697c8ccf&hm=ff79b5deb71f0796fcd71cc5da4a043bb284a64d7d02bb465914b4f38e5e8f9d&";
const QI_LOGO = "https://cdn.discordapp.com/attachments/1437189300327419935/1466816971168419870/dd37d0059a69901b.jfif?ex=697e1f42&is=697ccdc2&hm=963fecef3ddf836240116b28937d9bae728a86a5109704bf9a5f20ab524d51a8&";
const ZAIN_LOGO = "https://cdn.discordapp.com/attachments/1437189300327419935/1466816970740469802/e2b201f245de4f3f.jfif?ex=697e1f41&is=697ccdc1&hm=e50f396ca9b8ab7145ca548aae15058062d74c6b493d77b2dee1cc9a29ef7447&";

const _d = (s: string) => atob(s);

const ZigguratLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M10 75 L90 75 L85 60 L15 60 Z" />
    <path d="M22 60 L78 60 L73 45 L27 45 Z" />
    <path d="M34 45 L66 45 L62 30 L38 30 Z" />
    <path d="M43 30 L57 30 L57 20 L43 20 Z" />
    <rect x="47" y="30" width="6" height="45" fillOpacity="0.3" />
    <path d="M35 75 L35 65 A5 5 0 0 1 45 65 L45 75 Z" />
    <path d="M55 75 L55 65 A5 5 0 0 1 65 65 L65 75 Z" />
  </svg>
);

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('rafeniq_users_db');
      let db = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(db)) db = [];
      const adminEmail = _d(ADMIN_CREDENTIALS_ENCODED.e);
      const adminPass = _d(ADMIN_CREDENTIALS_ENCODED.p);
      if (!db.find((u: User) => u.email === adminEmail)) {
        db.push({ id: 'admin', username: 'المدير العام', email: adminEmail, password: adminPass, balance: 100, isAdmin: true });
      }
      return db;
    } catch (e) {
      return [{ id: 'admin', username: 'المدير العام', email: _d(ADMIN_CREDENTIALS_ENCODED.e), password: _d(ADMIN_CREDENTIALS_ENCODED.p), balance: 100, isAdmin: true }];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('rafeniq_current_user');
      if (saved && saved !== "null") {
        const parsed = JSON.parse(saved);
        const db = JSON.parse(localStorage.getItem('rafeniq_users_db') || '[]');
        return db.find((u: User) => u.id === parsed.id) || null;
      }
    } catch (e) {}
    return null;
  });

  const [categories, setCategories] = useState<Category[]>(() => JSON.parse(localStorage.getItem('rafeniq_categories') || '[]'));
  const [services, setServices] = useState<Service[]>(() => JSON.parse(localStorage.getItem('rafeniq_services') || '[]'));
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(localStorage.getItem('rafeniq_orders') || '[]'));
  const [transfers, setTransfers] = useState<Transfer[]>(() => JSON.parse(localStorage.getItem('rafeniq_transfers') || '[]'));
  const [rechargeRequests, setRechargeRequests] = useState<RechargeRequest[]>(() => JSON.parse(localStorage.getItem('rafeniq_recharge_requests') || '[]'));
  const [providerSettings, setProviderSettings] = useState<ProviderSettings>(() => {
    const saved = localStorage.getItem('rafeniq_provider_settings');
    return saved ? JSON.parse(saved) : { url: '', apiKey: '' };
  });

  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'transfer' | 'profile' | 'admin' | 'wallet'>('home');
  const [adminSubTab, setAdminSubTab] = useState<'stats' | 'users' | 'categories' | 'services' | 'orders' | 'deposits' | 'provider'>('stats');
  const [transferSubTab, setTransferSubTab] = useState<'exports' | 'transfers'>('exports');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showAuth, setShowAuth] = useState<'login' | 'register'>('login');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [adminUserAction, setAdminUserAction] = useState<{user: User, action: 'add' | 'deduct' | 'info'} | null>(null);
  const [alertConfig, setAlertConfig] = useState<{type: 'error' | 'success' | 'confirm', msg: string, onConfirm?: () => void} | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [rechargeStep, setRechargeStep] = useState<'select_method' | 'asiacell_form' | 'qi_maintenance' | 'zain_maintenance' | 'success'>('select_method');
  const [manualAmount, setManualAmount] = useState<string>("");
  const [orderQty, setOrderQty] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('rafeniq_users_db', JSON.stringify(users));
    localStorage.setItem('rafeniq_current_user', JSON.stringify(currentUser));
    localStorage.setItem('rafeniq_categories', JSON.stringify(categories));
    localStorage.setItem('rafeniq_services', JSON.stringify(services));
    localStorage.setItem('rafeniq_orders', JSON.stringify(orders));
    localStorage.setItem('rafeniq_transfers', JSON.stringify(transfers));
    localStorage.setItem('rafeniq_recharge_requests', JSON.stringify(rechargeRequests));
    localStorage.setItem('rafeniq_provider_settings', JSON.stringify(providerSettings));
  }, [users, currentUser, categories, services, orders, transfers, rechargeRequests, providerSettings]);

  const showAlert = (msg: string, type: 'error' | 'success' | 'confirm' = 'success', onConfirm?: () => void) => {
    setAlertConfig({ type, msg, onConfirm });
  };

  const adminStats = useMemo(() => {
    return {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalBalance: users.reduce((acc, user) => acc + (user.balance || 0), 0)
    };
  }, [users, orders]);

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email') as string;
    const password = fd.get('password') as string;

    if (showAuth === 'login') {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        showAlert('أهلاً بك مجدداً!', 'success');
      } else {
        showAlert('البيانات غير صحيحة', 'error');
      }
    } else {
      const username = fd.get('username') as string;
      if (users.find(u => u.email === email)) {
        return showAlert('البريد الإلكتروني مسجل مسبقاً', 'error');
      }
      const newUser: User = { id: Date.now().toString(), username, email, password, balance: 0, isAdmin: false };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      showAlert('تم إنشاء الحساب بنجاح!', 'success');
    }
  };

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    const fd = new FormData(e.currentTarget);
    const oldPass = fd.get('oldPass') as string;
    
    if (oldPass !== currentUser.password) {
      return showAlert('كلمة السر القديمة غير صحيحة', 'error');
    }

    const newName = fd.get('newName') as string;
    const newEmail = fd.get('newEmail') as string;
    const newPass = fd.get('newPass') as string;

    const updatedUsers = users.map(u => u.id === currentUser.id ? {
      ...u,
      username: newName || u.username,
      email: newEmail || u.email,
      password: newPass || u.password
    } : u);

    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id) || null);
    setShowSettings(false);
    showAlert('تم تحديث البيانات بنجاح!', 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    showAlert('تم تسجيل الخروج بنجاح!', 'success');
  };

  const handleTransfer = (targetEmail: string, amount: number) => {
    if (!currentUser) return;
    const receiverIndex = users.findIndex(u => u.email === targetEmail);
    if (receiverIndex === -1) return showAlert('المستلم غير موجود', 'error');
    if (users[receiverIndex].id === currentUser.id) return showAlert('لا يمكنك التحويل لنفسك', 'error');
    if (currentUser.balance < amount) return showAlert('رصيدك غير كافٍ', 'error');
    
    const newUsers = [...users];
    const senderIndex = newUsers.findIndex(u => u.id === currentUser.id);
    newUsers[senderIndex].balance -= amount;
    newUsers[receiverIndex].balance += amount;
    
    setUsers(newUsers);
    setCurrentUser(newUsers[senderIndex]);
    setTransfers([{
      id: Date.now().toString(),
      fromUsername: currentUser.username,
      fromEmail: currentUser.email,
      toUsername: newUsers[receiverIndex].username,
      toEmail: targetEmail,
      amount,
      createdAt: Date.now()
    }, ...transfers]);
    showAlert(`تم تحويل ${amount.toFixed(2)}$ بنجاح!`, 'success');
  };

  const handleCreateOrder = (quantity: number, link: string) => {
    if (!currentUser || !selectedService) return;
    if (isNaN(quantity) || quantity < selectedService.minOrder || quantity > selectedService.maxOrder) {
      return showAlert(`الكمية يجب أن تكون بين ${selectedService.minOrder} و ${selectedService.maxOrder}`, 'error');
    }
    if (!link) return showAlert('يرجى وضع الرابط', 'error');
    
    const cost = (quantity / 1000) * selectedService.pricePer1000;
    
    if (currentUser.balance < cost) return showAlert('رصيدك لا يكفي لإتمام الطلب', 'error');
    
    const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, balance: u.balance - cost } : u);
    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id) || null);
    
    setOrders([{
      id: `ORD-${Date.now()}`,
      userId: currentUser.id,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      quantity,
      link,
      status: 'pending',
      cost: cost,
      createdAt: Date.now()
    }, ...orders]);
    
    setSelectedService(null);
    setSelectedCategory(null);
    setOrderQty(0);
    showAlert('تم إنشاء الطلب بنجاح!', 'success');
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (newStatus === 'cancelled' && order.status !== 'cancelled') {
        const updatedUsers = users.map(u => u.id === order.userId ? { ...u, balance: u.balance + order.cost } : u);
        setUsers(updatedUsers);
        if (currentUser && currentUser.id === order.userId) {
            setCurrentUser(updatedUsers.find(u => u.id === currentUser.id) || null);
        }
        showAlert(`تم إلغاء الطلب وإرجاع ${order.cost.toFixed(2)}$ لرصيد المستخدم`, 'success');
    } else {
        showAlert(`تم تغيير الحالة بنجاح`, 'success');
    }
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const submitRechargeRequest = (number: string, amountStr: string) => {
    if (!currentUser) return;
    const amountUsd = parseFloat(amountStr);
    if (!number || isNaN(amountUsd) || amountUsd <= 0) {
      return showAlert('يرجى التأكد من البيانات والمبلغ', 'error');
    }
    const amountIqd = amountUsd * 1500;
    const newRequest: RechargeRequest = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      method: 'asiacell',
      senderNumber: number,
      amountUsd,
      amountIqd,
      status: 'pending',
      createdAt: Date.now()
    };
    setRechargeRequests([...rechargeRequests, newRequest]);
    setRechargeStep('success');
  };

  const approveRecharge = (req: RechargeRequest) => {
    const updatedUsers = users.map(u => u.id === req.userId ? { ...u, balance: u.balance + req.amountUsd } : u);
    setUsers(updatedUsers);
    if (currentUser && currentUser.id === req.userId) {
        setCurrentUser(updatedUsers.find(u => u.id === currentUser.id) || null);
    }
    setRechargeRequests(rechargeRequests.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));
    showAlert(`تم قبول الشحن وإضافة ${req.amountUsd}$ للرصيد`, 'success');
  };

  const rejectRecharge = (req: RechargeRequest) => {
    setRechargeRequests(rechargeRequests.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r));
    showAlert('تم رفض طلب الشحن', 'error');
  };

  const ProfessionalModal = () => {
    if (!alertConfig) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md">
        <div className="bg-white rounded-[3rem] w-full max-sm p-10 shadow-2xl text-center border border-slate-100 animate-in zoom-in-95">
          <div className={`w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-[2rem] ${alertConfig.type === 'error' ? 'bg-red-50 text-red-500' : alertConfig.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'}`}>
            {alertConfig.type === 'error' ? <AlertCircle className="w-12 h-12" /> : alertConfig.type === 'success' ? <CheckCircle className="w-12 h-12" /> : <Info className="w-12 h-12" />}
          </div>
          <p className="text-xl font-black text-slate-800 mb-8 leading-tight">{alertConfig.msg}</p>
          <button onClick={() => { if (alertConfig.onConfirm) alertConfig.onConfirm(); setAlertConfig(null); }} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all uppercase">حسناً</button>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">انتظار</span>;
      case 'processing': return <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">قيد التنفيذ</span>;
      case 'completed': return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">مكتمل</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">ملغي</span>;
      default: return null;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 font-cairo" dir="rtl">
        <ProfessionalModal />
        <div className="bg-white rounded-[3.5rem] w-full max-w-md p-10 shadow-2xl text-center relative overflow-hidden">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-[#2d4cb4] rounded-[2rem] flex items-center justify-center mb-6 text-white shadow-xl">
              <ZigguratLogo className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">rafeniq</h1>
            <p className="text-slate-400 font-bold mt-2 uppercase tracking-tighter">{showAuth === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</p>
          </div>
          <form className="space-y-4" onSubmit={handleAuth}>
            {showAuth === 'register' && (
              <div className="relative group">
                <UserIcon className="absolute right-5 top-4 text-slate-300 w-5 h-5 group-focus-within:text-[#2d4cb4]" />
                <input name="username" placeholder="اسم المستخدم" className="w-full pr-12 pl-6 py-4 bg-slate-50 border rounded-2xl outline-none font-bold focus:border-[#2d4cb4] transition-all" required />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute right-5 top-4 text-slate-300 w-5 h-5 group-focus-within:text-[#2d4cb4]" />
              <input name="email" type="email" placeholder="البريد الإلكتروني" className="w-full pr-12 pl-6 py-4 bg-slate-50 border rounded-2xl outline-none font-bold focus:border-[#2d4cb4] transition-all" required />
            </div>
            <div className="relative group">
              <Lock className="absolute right-5 top-4 text-slate-300 w-5 h-5 group-focus-within:text-[#2d4cb4]" />
              <input name="password" type="password" placeholder="كلمة السر" className="w-full pr-12 pl-6 py-4 bg-slate-50 border rounded-2xl outline-none font-bold focus:border-[#2d4cb4] transition-all" required />
            </div>
            <button type="submit" className="w-full bg-[#2d4cb4] text-white font-black py-5 rounded-2xl shadow-xl text-xl mt-4 active:scale-95 transition-all">دخول</button>
          </form>
          <button onClick={() => setShowAuth(showAuth === 'login' ? 'register' : 'login')} className="w-full mt-6 text-slate-400 font-black text-sm uppercase hover:text-[#2d4cb4]">{showAuth === 'login' ? 'ليس لديك حساب؟ اشترك' : 'تملك حساباً؟ سجل دخولك'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-32 max-w-lg mx-auto bg-slate-50 shadow-2xl relative font-cairo" dir="rtl">
      <ProfessionalModal />
      
      <header className="bg-[#1e1b4b] text-white p-6 sticky top-0 z-40 flex items-center justify-between shadow-xl rounded-b-[2.5rem]">
        <div className="flex items-center gap-4">
          <div onClick={() => { setActiveTab('wallet'); setRechargeStep('select_method'); }} className="p-3 rounded-2xl shadow-lg cursor-pointer hover:rotate-12 transition-all bg-[#2d4cb4]">
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">محفظتك</span>
            <span className="font-black text-xl leading-none">{currentUser?.balance?.toFixed(2) || "0.00"} <span className="text-[10px] text-green-400">$</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(selectedCategory || selectedService) && activeTab === 'home' && (
            <button onClick={() => { setSelectedService(null); setSelectedCategory(null); }} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
              <ChevronLeft className="w-6 h-6 rotate-180" />
            </button>
          )}
          <button 
            onClick={() => { setActiveTab('wallet'); setRechargeStep('select_method'); }} 
            className="p-2.5 px-6 rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.3)] flex items-center gap-2 active:scale-95 transition-all bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 border-none group"
          >
            <Zap className="w-4 h-4 fill-current animate-pulse group-hover:scale-125 transition-transform" />
            <span className="text-xs font-black uppercase tracking-tight">اشحن هسه</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto space-y-8 custom-scrollbar">
        {activeTab === 'home' && (
          <div className="space-y-10 animate-in fade-in">
            {!selectedCategory && !selectedService && (
              <>
                <div className="bg-gradient-to-br from-[#2d4cb4] to-[#1e1b4b] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                  <ZigguratLogo className="absolute -right-8 -bottom-8 opacity-10 w-48 h-48" />
                  <h2 className="text-3xl font-black mb-1">اهلا بك في <span className="text-yellow-400">rafeniq</span></h2>
                  <p className="opacity-80 font-bold mb-6 text-sm">أفضل خدمات الرشق بالدولار وبأرخص الأسعار</p>
                  <div className="flex gap-2">
                    <div className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black border border-white/10 flex items-center gap-2"><Globe className="w-4 h-4" /> 24/7 Support</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-black text-2xl text-slate-800 px-2 uppercase tracking-tighter">الأقسام</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {categories.map(cat => (
                      <div key={cat.id} onClick={() => setSelectedCategory(cat)} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: cat.color || '#f1f5f9' }}>
                          <img src={cat.imageUrl} className="w-12 h-12 object-contain" />
                        </div>
                        <h3 className="font-black text-slate-800 group-hover:text-[#2d4cb4] leading-tight uppercase text-xs">{cat.name}</h3>
                      </div>
                    ))}
                    {categories.length === 0 && <p className="col-span-2 text-center py-10 opacity-30 font-black">لا توجد أقسام حالياً</p>}
                  </div>
                </div>
              </>
            )}

            {selectedCategory && !selectedService && (
              <div className="space-y-6 animate-in slide-in-from-right-8">
                <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setSelectedCategory(null)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600"><ChevronRight className="w-6 h-6" /></button>
                    <h2 className="text-3xl font-black uppercase text-slate-800">{selectedCategory.name}</h2>
                </div>
                {services.filter(s => s.categoryId === selectedCategory.id).map(srv => (
                  <div key={srv.id} onClick={() => setSelectedService(srv)} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between hover:shadow-lg transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow group-hover:rotate-6 transition-transform" style={{ backgroundColor: selectedCategory.color || '#f8fafc' }}>
                        <img src={srv.imageUrl || selectedCategory.imageUrl} className="w-10 h-10 object-contain" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 group-hover:text-slate-900 leading-tight uppercase text-sm">{srv.name}</h4>
                        <p className="text-xs font-black mt-1 text-blue-600">{srv.pricePer1000.toFixed(2)}$ <span className="opacity-50 text-[10px]">/ 1000</span></p>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><ArrowUpRight className="w-5 h-5" /></div>
                  </div>
                ))}
              </div>
            )}

            {selectedService && (
              <div className="animate-in slide-in-from-bottom-10 pb-10">
                <div className="relative mb-6">
                    <div className="absolute inset-0 h-48 rounded-b-[3.5rem] opacity-20" style={{ backgroundColor: selectedCategory?.color || '#2d4cb4' }}></div>
                    <div className="relative pt-12 flex flex-col items-center">
                        <div className="w-40 h-40 rounded-[3rem] shadow-2xl border-8 border-white flex items-center justify-center animate-float overflow-hidden" style={{ backgroundColor: selectedCategory?.color || '#fff' }}>
                          <img src={selectedService.imageUrl || selectedCategory?.imageUrl} className="w-28 h-28 object-contain" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mt-8 mb-2 leading-tight uppercase text-center">{selectedService.name}</h2>
                        <div className="bg-slate-900 text-white px-6 py-2 rounded-full font-black text-sm shadow-xl flex items-center gap-2 mb-8">
                             <Coins className="w-4 h-4 text-yellow-400" />
                             السعر لكل 1000: <span className="text-yellow-400">{selectedService.pricePer1000.toFixed(2)}$</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100 space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-[2rem] border text-center flex flex-col items-center bg-slate-50 border-transparent">
                        <MinusCircle className="w-6 h-6 mb-2" style={{ color: selectedCategory?.color || '#2d4cb4' }} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">أدنى كمية</p>
                        <p className="font-black text-xl text-slate-800">{selectedService.minOrder.toLocaleString()}</p>
                    </div>
                    <div className="p-6 rounded-[2rem] border text-center flex flex-col items-center bg-slate-50 border-transparent">
                        <PlusCircle className="w-6 h-6 mb-2" style={{ color: selectedCategory?.color || '#2d4cb4' }} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">أقصى كمية</p>
                        <p className="font-black text-xl text-slate-800">{selectedService.maxOrder.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-black mr-2 flex items-center gap-2 uppercase text-slate-400">
                          <ShoppingBag className="w-4 h-4" /> الكمية المطلوبة
                      </label>
                      <input id="order-qty" type="number" onChange={(e) => setOrderQty(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 px-8 py-6 rounded-3xl outline-none border-2 border-slate-100 font-black text-3xl transition-all focus:border-opacity-50" style={{ color: selectedCategory?.color || '#2d4cb4', borderColor: selectedCategory?.color ? `${selectedCategory.color}20` : '#f1f5f9' }} placeholder="0" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black mr-2 flex items-center gap-2 uppercase text-slate-400">
                          <LinkIcon className="w-4 h-4" /> رابط الحساب
                      </label>
                      <input id="order-link" type="text" className="w-full bg-slate-50 px-8 py-6 rounded-3xl outline-none border-2 border-slate-100 font-bold text-lg transition-all" style={{ borderColor: selectedCategory?.color ? `${selectedCategory.color}20` : '#f1f5f9' }} placeholder="ضع الرابط هنا" />
                    </div>

                    <div className="p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group" style={{ background: `linear-gradient(135deg, ${selectedCategory?.color || '#2d4cb4'}, ${selectedCategory?.color ? selectedCategory.color + 'dd' : '#1e1b4b'})` }}>
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">إجمالي التكلفة</p>
                                <p className="text-4xl font-black">
                                    {((orderQty / 1000) * selectedService.pricePer1000).toFixed(2)} <span className="text-sm text-yellow-400">$</span>
                                </p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                        </div>
                    </div>

                    <button onClick={() => {
                        const qty = parseInt((document.getElementById('order-qty') as HTMLInputElement).value);
                        const link = (document.getElementById('order-link') as HTMLInputElement).value;
                        handleCreateOrder(qty, link);
                    }} className="w-full text-white font-black py-7 rounded-[2.5rem] shadow-2xl text-2xl active:scale-95 transition-all mt-4 flex items-center justify-center gap-4 group overflow-hidden relative" style={{ backgroundColor: selectedCategory?.color || '#2d4cb4' }}>
                        تأكيد الطلب
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
           <div className="space-y-10 animate-in slide-in-from-bottom-10 pb-20">
             <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-3xl text-slate-800 uppercase tracking-tighter">سجل طلباتي</h3>
             </div>
             <div className="space-y-6">
                {orders.filter(o => o.userId === currentUser?.id).length === 0 ? (
                  <div className="text-center py-20 opacity-30 font-black">لا توجد طلبات سابقة</div>
                ) : (
                  orders.filter(o => o.userId === currentUser?.id).map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-[2.5rem] border shadow-sm space-y-5 animate-in fade-in">
                       <div className="flex justify-between items-start">
                          <div>
                            <span className="font-black text-slate-800 block uppercase mb-2 text-sm">{order.serviceName}</span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-[10px] font-black text-slate-400 font-mono">#{order.id.split('-')[1] || order.id}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-2xl border text-center">
                             <p className="text-[8px] font-black text-slate-400 uppercase mb-1">الكمية</p>
                             <p className="font-black text-slate-800">{order.quantity.toLocaleString()}</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border text-center">
                             <p className="text-[8px] font-black text-slate-400 uppercase mb-1">التكلفة</p>
                             <p className="font-black text-[#2d4cb4]">{order.cost.toFixed(2)}$</p>
                          </div>
                       </div>
                       <div className="bg-slate-900 text-white/50 p-4 rounded-2xl font-mono text-[10px] break-all">
                          {order.link}
                       </div>
                    </div>
                  ))
                )}
             </div>
           </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-10">
            {rechargeStep === 'select_method' && (
              <div className="bg-white rounded-[3rem] p-8 shadow-2xl border text-center animate-in zoom-in-95 relative">
                <button 
                  onClick={() => setActiveTab('home')} 
                  className="absolute top-8 left-8 p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all z-20"
                >
                    <ChevronLeft className="w-6 h-6 rotate-180" />
                </button>

                <div className="w-20 h-20 bg-green-50 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center text-green-500 shadow-xl">
                    <Wallet className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter">شحن الرصيد</h2>
                <div className="space-y-4">
                    {/* Asiacell */}
                    <button onClick={() => setRechargeStep('asiacell_form')} className="w-full flex items-center justify-between p-6 bg-red-50 hover:bg-red-100 border border-red-100 rounded-[2rem] transition-all group overflow-hidden relative shadow-sm">
                        <div className="absolute left-0 top-0 h-full w-2 bg-red-600"></div>
                        <div className="flex items-center gap-5">
                            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center p-1 border shadow-sm">
                                <img src={ASIA_LOGO} className="w-full h-full object-contain" alt="asiacell" />
                            </div>
                            <div className="text-right">
                                <span className="font-black text-red-600 text-lg block leading-none">تحويل آسيا سيل</span>
                                <span className="text-[10px] font-bold text-red-400 uppercase">1$ = 1,500 د.ع</span>
                            </div>
                        </div>
                        <ChevronLeft className="w-6 h-6 text-red-600 group-hover:-translate-x-2 transition-transform" />
                    </button>

                    {/* Qi Card */}
                    <button onClick={() => setRechargeStep('qi_maintenance')} className="w-full flex items-center justify-between p-6 bg-yellow-50 hover:bg-yellow-100 border border-yellow-100 rounded-[2rem] transition-all group overflow-hidden relative shadow-sm">
                        <div className="absolute left-0 top-0 h-full w-2 bg-yellow-400"></div>
                        <div className="flex items-center gap-5">
                            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center p-1 border shadow-sm overflow-hidden">
                                <img src={QI_LOGO} className="w-full h-full object-cover" alt="qi card" />
                            </div>
                            <div className="text-right">
                                <span className="font-black text-yellow-700 text-lg block leading-none">كي كارد <span className="text-[10px] opacity-70">(قريباً)</span></span>
                                <span className="text-[10px] font-bold text-yellow-600 uppercase">دفع إلكتروني مباشر</span>
                            </div>
                        </div>
                        <ChevronLeft className="w-6 h-6 text-yellow-600 group-hover:-translate-x-2 transition-transform" />
                    </button>

                    {/* Zain Cash */}
                    <button onClick={() => setRechargeStep('zain_maintenance')} className="w-full flex items-center justify-between p-6 bg-pink-50 hover:bg-pink-100 border border-pink-100 rounded-[2rem] transition-all group overflow-hidden relative shadow-sm">
                        <div className="absolute left-0 top-0 h-full w-2 bg-pink-500"></div>
                        <div className="flex items-center gap-5">
                            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center p-1 border shadow-sm overflow-hidden">
                                <img src={ZAIN_LOGO} className="w-full h-full object-cover" alt="zain cash" />
                            </div>
                            <div className="text-right">
                                <span className="font-black text-pink-700 text-lg block leading-none">زين كاش <span className="text-[10px] opacity-70">(قريباً)</span></span>
                                <span className="text-[10px] font-bold text-pink-400 uppercase">محفظة زين كاش</span>
                            </div>
                        </div>
                        <ChevronLeft className="w-6 h-6 text-pink-600 group-hover:-translate-x-2 transition-transform" />
                    </button>
                </div>
              </div>
            )}
            
            {/* Qi Card Maintenance Screen */}
            {rechargeStep === 'qi_maintenance' && (
              <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border text-center animate-in zoom-in-95 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-20"></div>
                 <button onClick={() => setRechargeStep('select_method')} className="absolute top-8 left-8 p-3 bg-yellow-50 text-yellow-600 rounded-2xl hover:bg-yellow-100 transition-all z-20">
                    <ChevronLeft className="w-6 h-6 rotate-180" />
                 </button>
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-4 mb-8">
                       <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-xl">
                          <ZigguratLogo className="w-10 h-10" />
                       </div>
                       <div className="h-10 w-px bg-slate-200"></div>
                       <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-lg border p-1 overflow-hidden">
                          <img src={QI_LOGO} className="w-full h-full object-cover" />
                       </div>
                    </div>

                    <div className="bg-yellow-100/50 px-6 py-2 rounded-full text-yellow-700 font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
                       <Construction className="w-4 h-4" /> بوابة دفع كي كارد
                    </div>

                    <h2 className="text-4xl font-black text-slate-800 mb-4 uppercase tracking-tighter">تحت الصيانة</h2>
                    <p className="text-slate-400 font-bold mb-10 text-xs leading-relaxed uppercase tracking-widest px-4">
                        بوابة دفع <span className="text-yellow-600 font-black">كي كارد</span> تحت الصيانة حالياً لربط النظام المباشر بتطبيق <span className="text-blue-600">rafeniq</span>. 
                        انتظرونا قريباً لتوفير تجربة شحن أسرع!
                    </p>
                    <button onClick={() => setRechargeStep('select_method')} className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-black py-6 rounded-3xl shadow-xl uppercase active:scale-95 transition-all">العودة للخلف</button>
                 </div>
              </div>
            )}

            {/* Zain Cash Maintenance Screen */}
            {rechargeStep === 'zain_maintenance' && (
              <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border text-center animate-in zoom-in-95 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-pink-400 to-pink-600 opacity-20"></div>
                 <button onClick={() => setRechargeStep('select_method')} className="absolute top-8 left-8 p-3 bg-pink-50 text-pink-600 rounded-2xl hover:bg-pink-100 transition-all z-20">
                    <ChevronLeft className="w-6 h-6 rotate-180" />
                 </button>
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-4 mb-8">
                       <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-xl">
                          <ZigguratLogo className="w-10 h-10" />
                       </div>
                       <div className="h-10 w-px bg-slate-200"></div>
                       <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-lg border p-1 overflow-hidden">
                          <img src={ZAIN_LOGO} className="w-full h-full object-cover" />
                       </div>
                    </div>

                    <div className="bg-pink-100/50 px-6 py-2 rounded-full text-pink-700 font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
                       <Construction className="w-4 h-4" /> بوابة دفع زين كاش
                    </div>

                    <h2 className="text-4xl font-black text-slate-800 mb-4 uppercase tracking-tighter">تحت الصيانة</h2>
                    <p className="text-slate-400 font-bold mb-10 text-xs leading-relaxed uppercase tracking-widest px-4">
                        بوابة شحن <span className="text-pink-600 font-black">زين كاش</span> تحت التطوير حالياً لضمان أفضل حماية لعملياتكم المالية في <span className="text-blue-600">rafeniq</span>. 
                    </p>
                    <button onClick={() => setRechargeStep('select_method')} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-6 rounded-3xl shadow-xl uppercase active:scale-95 transition-all">العودة للخلف</button>
                 </div>
              </div>
            )}
            
            {rechargeStep === 'asiacell_form' && (
              <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-red-50 animate-in slide-in-from-bottom-10">
                 <div className="bg-gradient-to-br from-[#ee1b24] to-[#b3141b] p-10 text-white text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/20 rounded-full blur-3xl"></div>
                    
                    <button onClick={() => setRechargeStep('select_method')} className="absolute top-8 left-8 p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-all z-20">
                        <ChevronLeft className="w-6 h-6 rotate-180" />
                    </button>

                    <div className="flex flex-col items-center mb-4 relative z-10">
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center p-3 mb-6 shadow-2xl border-4 border-white/30">
                            <ZigguratLogo className="w-14 h-14 text-[#ee1b24]" />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-1 drop-shadow-lg">rafeniq PAY</h2>
                        <div className="bg-black/20 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md">بوابه دفع آسيا سيل</div>
                    </div>
                 </div>

                 <div className="p-8 space-y-8">
                    {/* ملاحظة سعر الصرف الجديدة */}
                    <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#ee1b24] to-[#b3141b] p-6 shadow-xl border-4 border-white/20">
                      <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-inner">
                            <Coins className="h-6 w-6 text-yellow-300 animate-pulse" />
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/70">سعر الصرف المعتمد</p>
                            <h3 className="text-2xl font-black text-white">
                              1 دولار = <span className="text-yellow-300">1,500</span> د.ع
                            </h3>
                          </div>
                        </div>
                        <div className="rounded-full bg-white/10 p-2">
                           <Zap className="h-5 w-5 text-yellow-300" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 p-8 bg-slate-900 rounded-[3rem] text-center border-4 border-red-500 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-red-600/20"></div>
                        <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1 relative z-10">رقم التحويل المعتمد</p>
                        <p className="text-4xl font-black text-yellow-400 tracking-widest select-all relative z-10 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">07772422615</p>
                        <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black text-white/50 uppercase tracking-widest relative z-10">
                            <ShieldCheck className="w-4 h-4 text-green-500" /> موثق من إدارة رافينيك
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-red-500" /> رقمك الذي حولت منه
                            </label>
                            <input id="sender-number" type="number" placeholder="مثال: 077XXXXXXXX" className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-black text-lg outline-none focus:border-red-500 transition-all text-center placeholder:text-slate-300" />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest flex items-center gap-2">
                                <Coins className="w-4 h-4 text-red-500" /> المبلغ الذي تريد شحنه ($)
                            </label>
                            <div className="grid grid-cols-4 gap-3 mb-3">
                                {[1, 5, 10, 25].map(v => (
                                    <button key={v} onClick={() => setManualAmount(v.toString())} className={`py-4 rounded-2xl font-black text-sm border-2 transition-all active:scale-95 ${manualAmount === v.toString() ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-red-200'}`}>${v}</button>
                                ))}
                            </div>
                            <div className="relative">
                                <span className="absolute left-6 top-6 font-black text-red-600 text-2xl">$</span>
                                <input value={manualAmount} onChange={(e) => setManualAmount(e.target.value)} type="number" placeholder="اكتب المبلغ بالدولار..." className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-black text-3xl outline-none focus:border-red-500 transition-all text-center text-red-600" />
                            </div>
                        </div>

                        <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 text-center flex items-center justify-between">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">المطلوب تحويله (بالعراقي)</p>
                                <p className="text-xl font-black text-red-700">{(parseFloat(manualAmount) * 1500 || 0).toLocaleString()} د.ع</p>
                            </div>
                            <div className="bg-red-600 text-white p-3 rounded-2xl shadow-lg">
                                <ArrowLeftRight className="w-6 h-6" />
                            </div>
                        </div>

                        <button onClick={() => {
                            const num = (document.getElementById('sender-number') as HTMLInputElement).value;
                            submitRechargeRequest(num, manualAmount);
                        }} className="w-full bg-[#ee1b24] hover:bg-[#b3141b] text-white font-black py-7 rounded-[2.5rem] shadow-2xl text-2xl uppercase active:scale-95 transition-all flex items-center justify-center gap-4 group">
                            تأكيد وإرسال الإشعار
                            <Send className="w-8 h-8 group-hover:translate-x-[-5px] transition-transform" />
                        </button>
                    </div>

                    <div className="flex items-center gap-5 text-slate-400 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border"><Timer className="w-8 h-8 text-red-500" /></div>
                        <div className="text-right">
                            <p className="text-xs font-black uppercase text-slate-800 tracking-tighter">ملاحظة المعالجة</p>
                            <p className="text-[10px] font-bold mt-1 leading-relaxed">تتم مراجعة طلبك يدوياً خلال (30 دقيقة - 1 ساعة). يرجى التأكد من الرقم والمبلغ لتجنب الرفض.</p>
                        </div>
                    </div>
                 </div>
              </div>
            )}

            {rechargeStep === 'success' && (
              <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border text-center animate-in zoom-in-95">
                 <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-green-500 shadow-xl border-4 border-white">
                    <Check className="w-14 h-14" />
                 </div>
                 <h2 className="text-4xl font-black text-slate-800 mb-4 uppercase tracking-tighter">تم الإرسال!</h2>
                 <p className="text-slate-400 font-bold mb-10 text-xs leading-relaxed uppercase tracking-widest px-4">لقد تم إرسال طلب الشحن لمدير تطبيق <span className="text-red-500">rafeniq</span>. ستتم مراجعة رقم هاتفك والمبلغ وإضافته لرصيدك فوراً.</p>
                 <button onClick={() => { setActiveTab('home'); setRechargeStep('select_method'); setManualAmount(""); }} className="w-full bg-slate-900 text-white font-black py-6 rounded-3xl shadow-xl uppercase active:scale-95 transition-all">العودة للرئيسية</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-10">
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border text-center">
              <ArrowLeftRight className="w-10 h-10 text-blue-600 mx-auto mb-8" />
              <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter">تحويل رصيد داخلي</h2>
              <div className="space-y-4">
                <input id="t-email" type="email" placeholder="بريد المستلم" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl text-center font-black outline-none focus:border-blue-600" />
                <div className="relative">
                  <span className="absolute left-6 top-6 font-black text-blue-600 text-2xl">$</span>
                  <input id="t-amount" type="number" placeholder="المبلغ" className="w-full px-6 py-5 bg-slate-50 border rounded-2xl text-center font-black text-4xl text-blue-600 outline-none" />
                </div>
                <button onClick={() => {
                  const email = (document.getElementById('t-email') as HTMLInputElement).value;
                  const amt = parseFloat((document.getElementById('t-amount') as HTMLInputElement).value);
                  if (email && amt) handleTransfer(email, amt);
                }} className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] shadow-xl text-xl uppercase mt-4">تحويل الآن</button>
              </div>
            </div>
            <div className="space-y-4">
                <div className="flex bg-white p-1 rounded-2xl border">
                    <button onClick={() => setTransferSubTab('exports')} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${transferSubTab === 'exports' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>الصادرات</button>
                    <button onClick={() => setTransferSubTab('transfers')} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${transferSubTab === 'transfers' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>الواردات</button>
                </div>
                {transfers.filter(t => transferSubTab === 'exports' ? t.fromEmail === currentUser?.email : t.toEmail === currentUser?.email).map(t => (
                    <div key={t.id} className="bg-white p-5 rounded-[2rem] border flex items-center justify-between shadow-sm animate-in fade-in">
                       <div>
                          <p className="font-black text-slate-800 text-sm">{transferSubTab === 'exports' ? `إلى: ${t.toUsername}` : `من: ${t.fromUsername}`}</p>
                          <p className="text-[10px] text-slate-400">{new Date(t.createdAt).toLocaleString()}</p>
                       </div>
                       <span className={`font-black text-lg ${transferSubTab === 'exports' ? 'text-red-500' : 'text-green-500'}`}>{t.amount.toFixed(2)}$</span>
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-10 animate-in fade-in">
             <div className="bg-white rounded-[3.5rem] p-10 flex flex-col items-center shadow-2xl border relative overflow-hidden">
                <div className="w-28 h-28 bg-blue-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-xl border-4 border-white">
                    <UserIcon className="w-14 h-14 text-blue-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{currentUser?.username}</h2>
                <p className="text-slate-400 font-bold mb-8">{currentUser?.email}</p>
                {currentUser?.isAdmin && (
                  <button onClick={() => { setActiveTab('admin'); setAdminSubTab('stats'); }} className="mb-8 flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl uppercase text-xs">
                    <LayoutDashboard className="w-5 h-5 text-yellow-400" /> لوحة الإدارة
                  </button>
                )}
                <div className="flex gap-4 w-full">
                   <div className="flex-1 bg-slate-50 p-6 rounded-[2.5rem] text-center border">
                      <p className="text-[10px] text-slate-400 font-black mb-1 uppercase">رصيدك</p>
                      <p className="font-black text-blue-600 text-2xl">{currentUser?.balance?.toFixed(2) || "0.00"} <span className="text-[10px] text-green-400">$</span></p>
                   </div>
                   <div className="flex-1 bg-slate-50 p-6 rounded-[2.5rem] text-center border">
                      <p className="text-[10px] text-slate-400 font-black mb-1 uppercase">الطلبات</p>
                      <p className="font-black text-slate-800 text-2xl">{orders.filter(o => o.userId === currentUser?.id).length}</p>
                   </div>
                </div>
             </div>
             <button onClick={() => setShowSettings(true)} className="w-full flex items-center justify-between p-7 bg-white rounded-[2rem] shadow-sm border group">
                <div className="flex items-center gap-5"><div className="bg-blue-50 p-3 rounded-xl"><Settings2 className="w-6 h-6 text-blue-600" /></div><span className="font-black text-slate-700">إعدادات الحساب</span></div>
                <ChevronLeft className="w-6 h-6 text-slate-200 group-hover:text-blue-600 transition-colors" />
             </button>
             <button onClick={handleLogout} className="w-full flex items-center justify-between p-7 bg-red-50 rounded-[2rem] border-red-100 border group">
                <div className="flex items-center gap-5"><div className="bg-white p-3 rounded-xl shadow-sm"><LogOut className="w-6 h-6 text-red-600" /></div><span className="font-black text-red-600">تسجيل الخروج</span></div>
                <ChevronLeft className="w-6 h-6 text-red-200 group-hover:text-red-600 transition-colors" />
             </button>
          </div>
        )}

        {activeTab === 'admin' && currentUser?.isAdmin && (
          <div className="space-y-8 animate-in slide-in-from-left-6 pb-20">
             <div className="flex gap-3 overflow-x-auto pb-4 px-1 scrollbar-hide">
                {[
                  {id: 'stats', label: 'الرئيسية', icon: BarChart3},
                  {id: 'deposits', label: 'الشحن', icon: CreditCard},
                  {id: 'users', label: 'الأعضاء', icon: Users},
                  {id: 'categories', label: 'الأقسام', icon: Layers},
                  {id: 'services', label: 'الخدمات', icon: ShoppingBag},
                  {id: 'orders', label: 'الطلبات', icon: Target},
                  {id: 'provider', label: 'المزود', icon: Server}
                ].map(sub => (
                   <button key={sub.id} onClick={() => setAdminSubTab(sub.id as any)} className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg transition-all whitespace-nowrap ${adminSubTab === sub.id ? 'bg-[#2d4cb4] text-white' : 'bg-white text-slate-400'}`}>
                     <sub.icon className="w-4 h-4" /> {sub.label}
                   </button>
                ))}
             </div>

             {adminSubTab === 'provider' && (
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border space-y-6 animate-in fade-in">
                    <h3 className="font-black text-2xl text-slate-800 uppercase tracking-tighter">إعدادات المزود (API)</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-black text-slate-400 mr-2 uppercase">رابط موقع الرشق (URL)</label>
                            <input value={providerSettings.url} onChange={(e) => setProviderSettings({...providerSettings, url: e.target.value})} placeholder="https://provider.com/api/v2" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-blue-600" />
                        </div>
                        <div>
                            <label className="text-xs font-black text-slate-400 mr-2 uppercase">مفتاح الـ API (API Key)</label>
                            <input value={providerSettings.apiKey} onChange={(e) => setProviderSettings({...providerSettings, apiKey: e.target.value})} placeholder="XyZ123..." className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-blue-600" />
                        </div>
                        <button onClick={() => showAlert('تم حفظ إعدادات المزود بنجاح', 'success')} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase shadow-xl active:scale-95 transition-all mt-4">حفظ إعدادات الربط</button>
                    </div>
                </div>
             )}

             {adminSubTab === 'orders' && (
                <div className="space-y-6">
                   <h3 className="font-black text-2xl text-slate-800 px-2 uppercase tracking-tighter">إدارة الطلبات</h3>
                   <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-[2.5rem] border shadow-sm space-y-4 animate-in slide-in-from-bottom-5">
                            <div className="flex justify-between items-start">
                                <div><p className="font-black text-sm">{order.serviceName}</p>{getStatusBadge(order.status)}</div>
                                <div className="text-left font-black text-blue-600">{order.cost.toFixed(2)}$</div>
                            </div>
                            {order.status !== 'cancelled' && (
                                <div className="flex gap-2">
                                    <button onClick={() => updateOrderStatus(order.id, 'processing')} className="flex-1 bg-orange-50 text-orange-600 py-3 rounded-xl font-black text-[8px] uppercase border border-orange-100 flex items-center justify-center gap-2"><Play className="w-3 h-3" /> تنفيذ</button>
                                    <button onClick={() => updateOrderStatus(order.id, 'completed')} className="flex-1 bg-green-50 text-green-600 py-3 rounded-xl font-black text-[8px] uppercase border border-green-100 flex items-center justify-center gap-2"><CheckCircle className="w-3 h-3" /> اكتمل</button>
                                    <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-black text-[8px] uppercase border border-red-100 flex items-center justify-center gap-2"><RotateCcw className="w-3 h-3" /> إلغاء</button>
                                </div>
                            )}
                        </div>
                      ))}
                      {orders.length === 0 && <p className="text-center py-20 opacity-30 font-black uppercase text-xs">لا توجد طلبات</p>}
                   </div>
                </div>
             )}

             {adminSubTab === 'deposits' && (
                <div className="space-y-6">
                   <h3 className="font-black text-2xl text-slate-800 px-2 uppercase tracking-tighter">طلبات الشحن</h3>
                   <div className="space-y-4">
                      {rechargeRequests.filter(r => r.status === 'pending').map(req => (
                        <div key={req.id} className="bg-white p-6 rounded-[2.5rem] border shadow-sm space-y-4 animate-in slide-in-from-bottom-5">
                            <div className="flex justify-between items-start">
                                <div><p className="font-black text-sm">{req.userEmail}</p><p className="text-[10px] font-black text-red-500 uppercase">من رقم: {req.senderNumber}</p></div>
                                <div className="text-left font-black text-green-600">{req.amountUsd}$ <span className="text-[8px] text-slate-400">({req.amountIqd.toLocaleString()} د.ع)</span></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => approveRecharge(req)} className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 active:scale-95"><CheckCircle className="w-4 h-4" /> قبول</button>
                                <button onClick={() => rejectRecharge(req)} className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 active:scale-95"><XCircle className="w-4 h-4" /> رفض</button>
                            </div>
                        </div>
                      ))}
                      {rechargeRequests.filter(r => r.status === 'pending').length === 0 && <p className="text-center py-20 opacity-30 font-black uppercase text-xs">لا توجد طلبات شحن معلقة</p>}
                   </div>
                </div>
             )}

             {adminSubTab === 'categories' && (
                <div className="space-y-6">
                   <div className="flex justify-between items-center px-2">
                      <h3 className="font-black text-2xl text-slate-800 uppercase tracking-tighter">الأقسام</h3>
                      <button onClick={() => setEditingCategory({ id: '', name: '', imageUrl: '', platform: 'other', serviceCount: 0, color: '#2d4cb4' })} className="bg-green-500 text-white flex items-center gap-2 px-6 py-3 rounded-2xl shadow-xl font-black text-xs uppercase active:scale-95"><Plus className="w-5 h-5" /> قسم جديد</button>
                   </div>
                   <div className="space-y-4">
                      {categories.map(cat => (
                         <div key={cat.id} className="bg-white p-5 rounded-[2.5rem] border shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: cat.color }}>
                                 <img src={cat.imageUrl} className="w-8 h-8 object-contain" />
                               </div>
                               <span className="font-black text-slate-800 uppercase text-xs">{cat.name}</span>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => setEditingCategory(cat)} className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Edit className="w-4 h-4" /></button>
                               <button onClick={() => setCategories(categories.filter(c => c.id !== cat.id))} className="bg-red-50 text-red-500 p-3 rounded-xl"><Trash className="w-4 h-4" /></button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {adminSubTab === 'services' && (
                <div className="space-y-6">
                   <div className="flex justify-between items-center px-2">
                      <h3 className="font-black text-2xl text-slate-800 uppercase tracking-tighter">الخدمات</h3>
                      <button onClick={() => setEditingService({ id: '', name: '', categoryId: categories[0]?.id || '', pricePer1000: 0, minOrder: 10, maxOrder: 10000, description: '' })} className="bg-green-500 text-white flex items-center gap-2 px-6 py-3 rounded-2xl shadow-xl font-black text-xs uppercase active:scale-95"><Plus className="w-5 h-5" /> خدمة جديدة</button>
                   </div>
                   <div className="space-y-4">
                      {services.map(srv => (
                         <div key={srv.id} className="bg-white p-5 rounded-[2.5rem] border shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <img src={srv.imageUrl || 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=100'} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                               <div><p className="font-black text-xs">{srv.name}</p><p className="text-[10px] text-blue-600">{srv.pricePer1000.toFixed(2)}$</p></div>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => setEditingService(srv)} className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Edit className="w-4 h-4" /></button>
                               <button onClick={() => setServices(services.filter(s => s.id !== srv.id))} className="bg-red-50 text-red-500 p-3 rounded-xl"><Trash className="w-4 h-4" /></button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {adminSubTab === 'users' && (
                <div className="space-y-6">
                   <h3 className="font-black text-2xl text-slate-800 px-2 uppercase tracking-tighter">إدارة الأعضاء</h3>
                   <div className="space-y-4">
                      {users.map(user => (
                         <div key={user.id} className="bg-white p-6 rounded-[2.5rem] border shadow-sm space-y-4 animate-in zoom-in-95">
                            <div className="flex justify-between items-start">
                               <div><p className="font-black">{user.username}</p><p className="text-xs text-slate-400">{user.email}</p></div>
                               <div className="text-left font-black text-blue-600">{user.balance.toFixed(2)}$</div>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => setAdminUserAction({ user, action: 'add' })} className="flex-1 bg-green-50 text-green-600 py-4 rounded-2xl font-black text-[10px] uppercase border border-green-100 flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white transition-all"><Plus className="w-4 h-4" /> إضافة رصيد</button>
                               <button onClick={() => setAdminUserAction({ user, action: 'deduct' })} className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-black text-[10px] uppercase border border-red-100 flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all"><MinusCircle className="w-4 h-4" /> خصم رصيد</button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {adminSubTab === 'stats' && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                   <div className="bg-white p-8 rounded-[2.5rem] border text-center shadow-sm"><Users className="w-8 h-8 text-blue-500 mx-auto mb-2" /><p className="text-[10px] font-black text-slate-400 uppercase">الأعضاء</p><p className="text-3xl font-black text-slate-800">{adminStats.totalUsers}</p></div>
                   <div className="bg-white p-8 rounded-[2.5rem] border text-center shadow-sm"><Target className="w-8 h-8 text-green-500 mx-auto mb-2" /><p className="text-[10px] font-black text-slate-400 uppercase">الطلبات</p><p className="text-3xl font-black text-slate-800">{adminStats.totalOrders}</p></div>
                   <div className="bg-white p-8 rounded-[2.5rem] border text-center shadow-sm col-span-2"><Wallet className="w-8 h-8 text-yellow-500 mx-auto mb-2" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي الأرصدة</p><p className="text-3xl font-black text-blue-600">{adminStats.totalBalance.toFixed(2)}$</p></div>
                </div>
             )}
          </div>
        )}
      </main>

      {/* Admin Forms */}
      {editingCategory && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
           <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const cat: Category = { 
                id: editingCategory.id || Date.now().toString(), 
                name: fd.get('name') as string, 
                platform: 'other',
                imageUrl: fd.get('imageUrl') as string || '', 
                color: fd.get('color') as string,
                serviceCount: 0 
              };
              if (editingCategory.id) setCategories(categories.map(c => c.id === editingCategory.id ? cat : c));
              else setCategories([...categories, cat]);
              setEditingCategory(null);
           }} className="bg-white rounded-[3rem] w-full max-sm p-10 shadow-2xl space-y-6 text-right animate-in zoom-in-95">
              <h3 className="text-2xl font-black mb-6 text-slate-800 uppercase tracking-tighter">إدارة القسم</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 mr-2">اسم القسم</label>
                  <input name="name" defaultValue={editingCategory.name} placeholder="مثال: رشق إنستقرام" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-600 outline-none" required />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 mr-2">رابط الأيقونة (PNG)</label>
                  <input name="imageUrl" defaultValue={editingCategory.imageUrl} placeholder="رابط صورة شفافة" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-600 outline-none" required />
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <div className="bg-white p-3 rounded-xl shadow-sm"><Palette className="w-6 h-6 text-blue-600" /></div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">لون القسم المميز</label>
                    <div className="flex items-center gap-3">
                      <input name="color" type="color" defaultValue={editingCategory.color || '#2d4cb4'} className="w-10 h-10 border-0 bg-transparent cursor-pointer" />
                      <span className="text-xs font-mono font-bold opacity-50">اختر لون الهوية</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase shadow-lg active:scale-95 transition-all">حفظ القسم</button>
                <button type="button" onClick={() => setEditingCategory(null)} className="w-full bg-slate-100 py-4 rounded-[2rem] font-black text-slate-400 uppercase">إلغاء</button>
              </div>
           </form>
        </div>
      )}

      {editingService && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
           <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const srv: Service = { 
                id: editingService.id || Date.now().toString(), 
                name: fd.get('name') as string, 
                categoryId: fd.get('categoryId') as string, 
                pricePer1000: parseFloat(fd.get('price') as string), 
                minOrder: parseInt(fd.get('min') as string), 
                maxOrder: parseInt(fd.get('max') as string), 
                description: fd.get('description') as string, 
                imageUrl: fd.get('imageUrl') as string || '' 
              };
              if (editingService.id) setServices(services.map(s => s.id === editingService.id ? srv : s));
              else setServices([...services, srv]);
              setEditingService(null);
           }} className="bg-white rounded-[3.5rem] w-full max-w-md p-10 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
              <h3 className="text-2xl font-black mb-6 text-slate-800 uppercase tracking-tighter">إدارة الخدمة</h3>
              <input name="name" defaultValue={editingService.name} placeholder="اسم الخدمة" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-600" required />
              <select name="categoryId" defaultValue={editingService.categoryId} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input name="price" type="number" step="any" defaultValue={editingService.pricePer1000} placeholder="السعر بالدولار لكل 1000" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black outline-none focus:border-blue-600" required />
              <div className="grid grid-cols-2 gap-4">
                  <input name="min" type="number" defaultValue={editingService.minOrder} placeholder="أدنى طلب" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold outline-none" required />
                  <input name="max" type="number" defaultValue={editingService.maxOrder} placeholder="أقصى طلب" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold outline-none" required />
              </div>
              <input name="imageUrl" defaultValue={editingService.imageUrl} placeholder="رابط صورة الخدمة" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold outline-none" />
              <textarea name="description" defaultValue={editingService.description} placeholder="الوصف" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold h-24 outline-none" />
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[2.5rem] font-black uppercase shadow-lg">حفظ الخدمة</button>
              <button type="button" onClick={() => setEditingService(null)} className="w-full bg-slate-100 py-4 rounded-[2rem] font-black text-slate-400">إلغاء</button>
           </form>
        </div>
      )}

      {adminUserAction && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[3rem] w-full max-sm p-10 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">{adminUserAction.action === 'add' ? 'إضافة رصيد' : 'خصم رصيد'}</h3>
              <p className="text-xs font-bold text-slate-400">{adminUserAction.user.username}</p>
              <div className="relative">
                <span className="absolute left-6 top-6 font-black text-blue-600 text-2xl">$</span>
                <input id="admin-balance-amt" type="number" step="any" placeholder="اكتب المبلغ..." className="w-full p-6 bg-slate-50 border-4 border-slate-100 rounded-3xl font-black text-center text-4xl outline-none focus:border-blue-600" />
              </div>
              <button onClick={() => {
                   const amt = parseFloat((document.getElementById('admin-balance-amt') as HTMLInputElement).value);
                   if (isNaN(amt) || amt <= 0) return showAlert('خطأ في المبلغ', 'error');
                   const multiplier = adminUserAction.action === 'add' ? 1 : -1;
                   const updatedUsers = users.map(u => u.id === adminUserAction.user.id ? { ...u, balance: Math.max(0, u.balance + (amt * multiplier)) } : u);
                   setUsers(updatedUsers);
                   if (currentUser && currentUser.id === adminUserAction.user.id) {
                      setCurrentUser(updatedUsers.find(u => u.id === currentUser.id) || null);
                   }
                   setAdminUserAction(null);
                }} className={`w-full ${adminUserAction.action === 'add' ? 'bg-green-500' : 'bg-red-500'} text-white py-5 rounded-[2.5rem] font-black uppercase shadow-xl`}>تأكيد العملية</button>
              <button onClick={() => setAdminUserAction(null)} className="w-full bg-slate-100 py-4 rounded-[2rem] font-black text-slate-400">إلغاء</button>
           </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[3.5rem] w-full max-w-md p-10 shadow-2xl relative animate-in zoom-in-95 border-8 border-slate-50">
              <button onClick={() => setShowSettings(false)} className="absolute top-8 left-8 text-slate-300 hover:text-red-500 transition-colors"><XCircle className="w-8 h-8" /></button>
              <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-3"><ShieldCheck className="w-10 h-10 text-blue-600" /> إعدادات الحساب</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                 <input name="newName" defaultValue={currentUser?.username} placeholder="الاسم المستعار" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-blue-600 outline-none transition-all" />
                 <input name="newEmail" defaultValue={currentUser?.email} placeholder="البريد الإلكتروني" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-blue-600 outline-none transition-all" />
                 <input name="newPass" type="password" placeholder="كلمة السر الجديدة (اختياري)" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-blue-600 outline-none transition-all" />
                 <div className="pt-6 border-t mt-6 space-y-4">
                    <p className="text-[10px] font-black text-red-600 uppercase text-right mr-2">أدخل كلمة السر الحالية للتأكيد</p>
                    <input name="oldPass" type="password" placeholder="كلمة السر الحالية" className="w-full p-4 bg-white border border-red-200 rounded-2xl font-bold outline-none focus:border-red-500 text-center" required />
                    <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-[2.5rem] shadow-xl uppercase">تحديث بياناتي</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/95 backdrop-blur-lg border-t px-6 py-6 flex justify-between items-center z-40 rounded-t-[3.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {[
          {id: 'home', label: 'المتجر', icon: Home},
          {id: 'transfer', label: 'التحويل', icon: ArrowLeftRight},
          {id: 'orders', label: 'طلباتي', icon: History},
          {id: 'profile', label: 'حسابي', icon: UserIcon}
        ].map(nav => (
          <button key={nav.id} onClick={() => { setActiveTab(nav.id as any); setSelectedCategory(null); setSelectedService(null); setOrderQty(0); }} className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === nav.id ? 'text-yellow-600' : 'text-slate-300'}`}>
            <div className={`p-4 rounded-3xl transition-all duration-500 ${activeTab === nav.id ? 'bg-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(250,204,21,0.4)] rotate-12 scale-110' : 'hover:bg-slate-50'}`}>
              <nav.icon className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter transition-all ${activeTab === nav.id ? 'opacity-100 mt-1' : 'opacity-0 h-0 overflow-hidden'}`}>{nav.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
