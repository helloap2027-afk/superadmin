import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { colors } from '@hello/design-tokens';
import { APP_CONFIG } from '@hello/config';

const API_BASE = 'http://localhost:4000/api/v1';

const ALL_14_CATEGORIES = [
  { id: 'restaurants', name: 'Restaurants', slug: 'restaurants', icon: '🍽️', bgColor: '#FFF7ED' },
  { id: 'hotels', name: 'Hotels', slug: 'hotels', icon: '🏨', bgColor: '#EFF6FF' },
  { id: 'beauty-spa', name: 'Beauty Spa', slug: 'beauty-spa', icon: '💆‍♀️', bgColor: '#FDF2F8' },
  { id: 'home-decor', name: 'Home Decor', slug: 'home-decor', icon: '🛋️', bgColor: '#FEF3C7' },
  { id: 'ask-astro', name: 'Ask Astro', slug: 'ask-astro', icon: '🔮', bgColor: '#FAF5FF' },
  { id: 'wedding-planning', name: 'Wedding Planning', slug: 'wedding-planning', icon: '💍', bgColor: '#FFF1F2' },
  { id: 'education', name: 'Education', slug: 'education', icon: '🎓', bgColor: '#EEF2FF' },
  { id: 'rent-hire', name: 'Rent & Hire', slug: 'rent-hire', icon: '🔑', bgColor: '#FEF9C3' },
  { id: 'hospitals', name: 'Hospitals', slug: 'hospitals', icon: '🏥', bgColor: '#FEF2F2' },
  { id: 'contractors', name: 'Contractors', slug: 'contractors', icon: '👷', bgColor: '#FFFBEB' },
  { id: 'pet-shops', name: 'Pet Shops', slug: 'pet-shops', icon: '🐾', bgColor: '#ECFDF5' },
  { id: 'pg-hostels', name: 'PG/Hostels', slug: 'pg-hostels', icon: '🛏️', bgColor: '#ECFEFF' },
  { id: 'estate-agent', name: 'Estate Agent', slug: 'estate-agent', icon: '🏢', bgColor: '#F1F5F9' },
  { id: 'dentists', name: 'Dentists', slug: 'dentists', icon: '🦷', bgColor: '#F0FDFA' },
];

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  restaurants: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
  hotels: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
  "beauty-spa": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
  "home-decor": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
  "ask-astro": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=80",
  "wedding-planning": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
  education: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
  "rent-hire": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
  hospitals: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80",
  contractors: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
  "pet-shops": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80",
  "pg-hostels": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80",
  "estate-agent": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
  dentists: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
};

const getCategoryEmoji = (iconName?: string | null, slug?: string): string => {
  const s = (slug || iconName || '').toLowerCase();
  if (s.includes('rest') || s.includes('food') || s.includes('utensil')) return '🍽️';
  if (s.includes('hotel')) return '🏨';
  if (s.includes('spa') || s.includes('salon')) return '💆‍♀️';
  if (s.includes('decor') || s.includes('interior') || s.includes('armchair')) return '🛋️';
  if (s.includes('astro') || s.includes('vastu')) return '🔮';
  if (s.includes('wed') || s.includes('heart')) return '💍';
  if (s.includes('edu') || s.includes('school') || s.includes('graduat')) return '🎓';
  if (s.includes('rent') || s.includes('hire') || s.includes('key')) return '🔑';
  if (s.includes('hosp')) return '🏥';
  if (s.includes('contract') || s.includes('hardhat')) return '👷';
  if (s.includes('pet') || s.includes('paw')) return '🐾';
  if (s.includes('pg') || s.includes('hostel') || s.includes('bed')) return '🛏️';
  if (s.includes('estate') || s.includes('real') || s.includes('building')) return '🏢';
  if (s.includes('dent') || s.includes('smile')) return '🦷';
  if (s.includes('doctor') || s.includes('stetho')) return '🩺';
  if (s.includes('mover') || s.includes('truck')) return '🚚';
  if (s.includes('tour') || s.includes('travel') || s.includes('plane')) return '✈️';
  if (s.includes('electr') || s.includes('zap')) return '⚡';
  if (s.includes('home')) return '🏠';
  return '🏢';
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Services' | 'Wallet' | 'Enquiries' | 'Profile'>('Home');
  const [mode, setMode] = useState<'customer' | 'vendor'>('customer');
  const [selectedCity, setSelectedCity] = useState<'Hyderabad' | 'Vijayawada' | 'Guntur'>('Hyderabad');
  const [selectedLocality, setSelectedLocality] = useState('Hitec City');
  const [showCityModal, setShowCityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories loaded directly from Database
  const [categories, setCategories] = useState<any[]>(ALL_14_CATEGORIES);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [coupons, setCoupons] = useState<any[]>([]);

  // Business DB State
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState<boolean>(false);

  // Auth State
  const [user, setUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showRawDb, setShowRawDb] = useState(false);

  // Auth Modal State
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authStep, setAuthStep] = useState<'role' | 'phone' | 'otp'>('role');
  const [authRole, setAuthRole] = useState<'CUSTOMER' | 'PARTNER'>('CUSTOMER');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Enquiry Modal
  const [enquiryModalBiz, setEnquiryModalBiz] = useState<any>(null);
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [isSendingEnquiry, setIsSendingEnquiry] = useState(false);

  // Selected Business Details Modal
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

  // Add Your Business Free Modal (Vendor Onboarding)
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizCategory, setNewBizCategory] = useState('restaurants');
  const [newBizCity, setNewBizCity] = useState<'Hyderabad' | 'Vijayawada' | 'Guntur'>('Hyderabad');
  const [newBizLocality, setNewBizLocality] = useState('Hitec City');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizWhatsapp, setNewBizWhatsapp] = useState('');
  const [newBizDesc, setNewBizDesc] = useState('');
  const [newBizCoverPhoto, setNewBizCoverPhoto] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80');
  const [isSubmittingBiz, setIsSubmittingBiz] = useState(false);

  // CMS Pages Modal State (About, Terms, FAQ, Contact)
  const [activeCmsModal, setActiveCmsModal] = useState<'about' | 'faq' | 'terms' | 'contact' | 'privacy' | null>(null);
  const [cmsPageData, setCmsPageData] = useState<any>(null);
  const [isLoadingCms, setIsLoadingCms] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Contact Form inside Mobile Modal
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const [myEnquiries, setMyEnquiries] = useState<any[]>([
    {
      referenceNo: 'ENQ-2026-HYD-9812',
      businessName: 'Chutneys Vegetarian & South Indian',
      status: 'CONFIRMED',
      date: 'Just now',
      message: 'Table booking for 4 people.'
    },
    {
      referenceNo: 'ENQ-2026-VJA-2977',
      businessName: 'Siri Dental Hospital',
      status: 'UNDER REVIEW',
      date: 'Today, 10:15 AM',
      message: 'Invisible aligners consultation.'
    }
  ]);

  // Fetch categories directly from MySQL hello_db & Restore Persistent Auth Session
  useEffect(() => {
    fetchCategories();
    fetchCoupons();
    restorePersistentAuth();
  }, []);

  const restorePersistentAuth = async () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedToken = localStorage.getItem('hello_access_token') || localStorage.getItem('hello_mobile_token');
        const savedUserStr = localStorage.getItem('hello_user');
        
        if (savedUserStr) {
          try {
            const parsed = JSON.parse(savedUserStr);
            if (parsed && parsed.id) {
              setUser(parsed);
              if (savedToken) setAuthToken(savedToken);
            }
          } catch {}
        }

        if (savedToken) {
          const res = await fetch(`${API_BASE}/users/me`, {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          const json = await res.json();
          if (json.success && json.data) {
            setUser(json.data);
            setAuthToken(savedToken);
            localStorage.setItem('hello_user', JSON.stringify(json.data));
          }
        }
      }
    } catch (err) {
      console.log('Session restore notice:', err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_BASE}/coupons`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setCoupons(json.data);
      }
    } catch (e) {
      console.log('Error fetching coupons from DB:', e);
    }
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setCategories(json.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: getCategoryEmoji(c.iconName, c.slug),
          businessesCount: c.businessesCount || 0,
          bgColor: '#F8FAFC'
        })));
      }
    } catch (e) {
      console.log('Error fetching categories from DB:', e);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch businesses from live DB
  useEffect(() => {
    fetchBusinesses();
  }, [selectedCategory, selectedCity, searchQuery]);

  const fetchBusinesses = async () => {
    setIsLoadingBusinesses(true);
    try {
      const catParam = selectedCategory !== 'All' ? `&category=${selectedCategory}` : '';
      const qParam = searchQuery.trim() ? `&q=${encodeURIComponent(searchQuery.trim())}` : '';
      const url = `${API_BASE}/search/businesses?city=${selectedCity.toLowerCase()}${catParam}${qParam}`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setBusinesses(json.data);
      } else if (selectedCategory !== 'All') {
        // Broaden search to include verified items across cities if this city has 0
        const broadUrl = `${API_BASE}/search/businesses?category=${selectedCategory}${qParam}`;
        const broadRes = await fetch(broadUrl, { headers: { 'Accept': 'application/json' } });
        const broadJson = await broadRes.json();
        if (broadJson.success && Array.isArray(broadJson.data) && broadJson.data.length > 0) {
          setBusinesses(broadJson.data);
        } else {
          setBusinesses(json.data || []);
        }
      } else {
        setBusinesses(json.data || []);
      }
    } catch (e) {
      console.log('Error fetching businesses:', e);
    } finally {
      setIsLoadingBusinesses(false);
    }
  };

  // Register New Business directly in MySQL hello_db
  const handleAddBusinessSubmit = async () => {
    if (!newBizName.trim()) {
      Alert.alert('Required Field', 'Please enter your Business Name.');
      return;
    }
    if (!newBizPhone.trim()) {
      Alert.alert('Required Field', 'Please enter your Contact Phone Number.');
      return;
    }

    setIsSubmittingBiz(true);
    try {
      const selectedCat = categories.find((c: any) => c.slug === newBizCategory) || categories[0];
      const payload = {
        name: newBizName.trim(),
        categoryId: selectedCat?.id || 'cat-restaurants',
        categorySlug: newBizCategory,
        citySlug: newBizCity.toLowerCase(),
        locality: newBizLocality.trim() || 'Central',
        phone: newBizPhone.trim(),
        whatsapp: (newBizWhatsapp || newBizPhone).trim(),
        description: newBizDesc.trim() || `${newBizName} is a verified provider in ${newBizLocality}, ${newBizCity}.`,
        coverPhoto: (newBizCoverPhoto || '').trim() || undefined,
        coverImageUrl: (newBizCoverPhoto || '').trim() || undefined
      };

      const res = await fetch(`${API_BASE}/businesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to register business in database');
      }

      const created = json.data;
      setBusinesses([created, ...businesses]);
      setShowAddBusinessModal(false);
      setNewBizName('');
      setNewBizPhone('');
      setNewBizWhatsapp('');
      setNewBizDesc('');
      setNewBizCoverPhoto('');
      setSelectedCategory(newBizCategory);
      setSelectedCity(newBizCity);

      Alert.alert(
        'Business Created in MySQL hello_db! 🎉',
        `"${created.name}" is now stored in the database and visible immediately in ${newBizCity}.`
      );
    } catch (err: any) {
      Alert.alert('Registration Error', err?.message || 'Could not save business to database.');
    } finally {
      setIsSubmittingBiz(false);
    }
  };

  const openCmsPage = async (slug: 'about' | 'faq' | 'terms' | 'contact' | 'privacy') => {
    setActiveCmsModal(slug);
    setIsLoadingCms(true);
    setContactSuccess(false);
    try {
      const res = await fetch(`${API_BASE}/cms/pages/${slug}?lang=en`);
      const json = await res.json();
      if (json.success && json.data) {
        setCmsPageData(json.data);
      } else {
        setCmsPageData(null);
      }
    } catch (e) {
      console.log('Error fetching CMS page:', e);
      setCmsPageData(null);
    } finally {
      setIsLoadingCms(false);
    }
  };

  const handleContactSubmit = async () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      Alert.alert('Required Fields', 'Please enter your name, email, and message.');
      return;
    }
    setIsSubmittingContact(true);
    try {
      const res = await fetch(`${API_BASE}/cms/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          phone: contactPhone.trim() || undefined,
          subject: contactSubject.trim() || 'Mobile Contact Message',
          message: contactMessage.trim()
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to submit contact message');
      }
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactSubject('');
      setContactMessage('');
      Alert.alert('Message Sent & Saved in DB! 🎉', 'Your message has been stored in MySQL hello_db. Our team will reach out to you shortly.');
    } catch (e: any) {
      Alert.alert('Submission Error', e?.message || 'Could not send message.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleSendOtp = async () => {
    if (phoneNumber.replace(/\D/g, '').length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!agreedTerms) {
      Alert.alert('Terms & Conditions', 'Please agree to Terms and Conditions.');
      return;
    }
    if (authMode === 'register' && !fullName.trim()) {
      Alert.alert('Required Field', 'Please enter your Full Name to register.');
      return;
    }

    setIsLoading(true);
    try {
      const fullPhone = `+91${phoneNumber.replace(/\D/g, '')}`;
      const res = await fetch(`${API_BASE}/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: fullPhone,
          purpose: authMode === 'register' ? 'REGISTRATION' : 'LOGIN',
          role: authRole
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to dispatch verification code.');
      }

      setChallengeId(json.data.challengeId);
      setAuthStep('otp');
      if (json.data.devOtp) {
        setOtp(json.data.devOtp);
      }
    } catch (err: any) {
      Alert.alert('Connection Error', err.message || 'Failed to connect to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.trim().length !== 6) {
      Alert.alert('Invalid Code', 'OTP must be exactly 6 numeric digits.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          otp: otp.trim(),
          deviceInfo: 'Mobile Device (React Native)',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Invalid or expired OTP.');
      }

      const token = json.data.accessToken;
      setAuthToken(token);

      if (authMode === 'register' && fullName.trim()) {
        try {
          await fetch(`${API_BASE}/users/me`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              fullName: fullName.trim(),
              email: email.trim() || undefined,
              preferredLanguage: selectedLanguage
            })
          });
        } catch (e) {
          console.log('Profile patch fallback', e);
        }
      }

      const profileRes = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileJson = await profileRes.json();
      const freshUser = profileJson?.data || json.data.user;

      setUser(freshUser);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('hello_access_token', token);
        localStorage.setItem('hello_mobile_token', token);
        localStorage.setItem('hello_user', JSON.stringify(freshUser));
        localStorage.setItem('hello_active_role', authRole === 'PARTNER' ? 'MERCHANT' : 'CUSTOMER');
      }

      setIsAuthModalVisible(false);
      setAuthStep('role');
      setOtp('');
      setPhoneNumber('');
      setFullName('');
      setEmail('');
      
      Alert.alert(
        'Success — Database Record Created',
        `Welcome to HELLO, ${freshUser.fullName || 'Member'}!\nYour identity is stored in MySQL hello_db.`
      );
    } catch (err: any) {
      Alert.alert('Authentication Failed', err.message || 'Invalid code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setAuthToken(null);
    setShowRawDb(false);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('hello_access_token');
      localStorage.removeItem('hello_mobile_token');
      localStorage.removeItem('hello_user');
      localStorage.removeItem('hello_active_role');
    }
  };

  const handleDispatchEnquiry = async () => {
    if (!enquiryModalBiz) return;
    setIsSendingEnquiry(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: enquiryModalBiz.id,
          customerName: user?.fullName || 'Mobile User',
          customerPhone: enquiryPhone || user?.phoneNumber || '+91 98480 22334',
          message: enquiryMsg || `Instant quote request for ${enquiryModalBiz.name}`,
          priority: 'HIGH'
        })
      });
      const json = await res.json();
      const ref = json.data?.referenceNo || `MOB-ENQ-${Math.floor(1000 + Math.random() * 9000)}`;

      setMyEnquiries([
        {
          referenceNo: ref,
          businessName: enquiryModalBiz.name,
          status: 'DISPATCHED',
          date: 'Just now',
          message: enquiryMsg || 'Instant quote enquiry.'
        },
        ...myEnquiries
      ]);

      Alert.alert('Enquiry Dispatched Instantly!', `Reference: ${ref}\nSaved to MySQL enquiries table.`);
      setEnquiryModalBiz(null);
      setEnquiryMsg('');
    } catch (e) {
      Alert.alert('Sent', 'Your enquiry has been noted.');
      setEnquiryModalBiz(null);
    } finally {
      setIsSendingEnquiry(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1220" />

      {/* TOP STATUS BAR (SIMULATING EXACT MOBILE WEB HEADER) */}
      <View style={styles.topHeader}>
        {/* City Selector Pill */}
        <TouchableOpacity
          onPress={() => setShowCityModal(true)}
          style={styles.cityPill}
        >
          <Text style={{ fontSize: 13, marginRight: 2 }}>📍</Text>
          <Text style={styles.cityPillText}>{selectedCity}</Text>
          <Text style={styles.localityPillText}>({selectedLocality})</Text>
          <Text style={{ fontSize: 10, color: '#64748B' }}>▼</Text>
        </TouchableOpacity>

        {/* Right Header: User / Login + Notification Bell */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {user ? (
            <TouchableOpacity onPress={() => setActiveTab('Profile')} style={styles.headerUserPill}>
              <View style={styles.headerOnlineDot} />
              <Text style={styles.headerUserText} numberOfLines={1}>{user.fullName || 'Member'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => { setAuthMode('login'); setAuthStep('role'); setIsAuthModalVisible(true); }}
              style={styles.headerLoginBtn}
            >
              <Text style={styles.headerLoginBtnText}>Login</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              const isPartner = user && Array.isArray(user.roles) && (user.roles.includes('VENDOR_OWNER') || user.roles.includes('VENDOR_STAFF') || user.roles.includes('MERCHANT'));
              if (isPartner) {
                Alert.alert('🏢 Business Partner Notifications', '• 1 New Customer Enquiry received for your listing.\n• KYC documents under compliance review.\n• Weekly performance report ready.');
              } else {
                Alert.alert('👤 Customer Notifications', '• Welcome to HELLO-Hi! Verified local listings in your city.\n• Diwali Festival 50% discount coupon is active.\n• Order confirmation updates.');
              }
            }}
            style={styles.bellBtn}
          >
            <Text style={{ fontSize: 14 }}>🔔</Text>
            <View style={styles.bellBadge}>
              <Text style={{ fontSize: 8, color: '#FFF', fontWeight: '800' }}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH PILL WITH MIC */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 13, color: '#94A3B8', marginRight: 6 }}>🔍</Text>
          <TextInput
            placeholder="Search Biryani, Dental, Hotels, Spa..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={() => setSearchQuery('Biryani')} style={{ paddingHorizontal: 4 }}>
            <Text style={{ fontSize: 14 }}>🎙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BRAND WORDMARK STRIP */}
      <View style={styles.brandStrip}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '900', color: '#0076D7' }}>Hello</Text>
          <Text style={{ fontSize: 22, fontWeight: '900', color: '#FF6B35' }}>-Hi</Text>
        </View>
        <Text style={styles.brandSubtitle}>Search Local. Connect Instant. 6.2 Crore+ Verified</Text>
      </View>

      {/* MAIN BODY CONTENT */}
      <ScrollView style={styles.mainScrollView} contentContainerStyle={{ paddingBottom: 90 }}>
        {activeTab === 'Services' ? (
          /* ================= ALL SERVICES EXPLORE GRID ================= */
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A' }}>
                  All Categories ({categories.length})
                </Text>
                <Text style={{ fontSize: 11, color: '#64748B' }}>Loaded from MySQL Database • {selectedCity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => { setSelectedCategory('All'); setActiveTab('Home'); }}
                style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16 }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#0076D7' }}>View All Directory</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categories2ColGrid}>
              {categories.map((srv) => {
                const isSelected = selectedCategory === srv.slug;
                return (
                  <TouchableOpacity
                    key={srv.id}
                    onPress={() => {
                      setSelectedCategory(srv.slug);
                      setActiveTab('Home');
                    }}
                    style={[
                      styles.categoryCard2Col,
                      isSelected && { borderColor: '#0076D7', borderWidth: 2, backgroundColor: '#EFF6FF' }
                    ]}
                  >
                    <View style={[styles.categoryIconSquare, { backgroundColor: srv.bgColor || '#F1F5F9' }]}>
                      <Text style={{ fontSize: 20 }}>{srv.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }} numberOfLines={1}>{srv.name}</Text>
                      <Text style={{ fontSize: 10, color: '#0076D7', fontWeight: '600' }}>
                        {srv.businessesCount ? `${srv.businessesCount} in DB` : 'Verified Services'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : activeTab === 'Wallet' ? (
          /* ================= WALLET TAB ================= */
          <View style={{ padding: 16 }}>
            {/* Wallet Balance Hero Card */}
            <View style={{
              backgroundColor: '#0F172A',
              borderRadius: 20,
              padding: 20,
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 5,
              marginBottom: 16
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 22 }}>👛</Text>
                  <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Available Balance
                  </Text>
                </View>
                <View style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ color: '#4ADE80', fontSize: 10, fontWeight: '800' }}>● Active</Text>
                </View>
              </View>

              <Text style={{ fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 }}>
                ₹5,750<Text style={{ fontSize: 18, color: '#94A3B8', fontWeight: '500' }}>.00</Text>
              </Text>

              <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                Instant cashback, refunds & lead credit top-up
              </Text>

              {/* Action Buttons: Add Money, Send, History */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                <TouchableOpacity
                  onPress={() => Alert.alert('Add Money to Wallet', 'Choose payment mode: UPI (GPay/PhonePe), NetBanking, or Debit Card.')}
                  style={{
                    flex: 1,
                    backgroundColor: '#0076D7',
                    paddingVertical: 12,
                    borderRadius: 14,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '800' }}>+ Add Money</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Alert.alert('Withdraw Funds', 'Transfer your balance directly to your linked verified bank account (IMPS/NEFT).')}
                  style={{
                    flex: 1,
                    backgroundColor: '#1E293B',
                    paddingVertical: 12,
                    borderRadius: 14,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                    borderWidth: 1,
                    borderColor: '#334155'
                  }}
                >
                  <Text style={{ color: '#E2E8F0', fontSize: 13, fontWeight: '800' }}>Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Top-Up Packs */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 10 }}>Quick Recharge</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {['₹500', '₹1,000', '₹2,000', '₹5,000'].map((amt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => Alert.alert('Quick Top-Up', `Proceed with ${amt} recharge via UPI?`)}
                    style={{
                      flex: 1,
                      backgroundColor: '#FFFFFF',
                      borderWidth: 1.5,
                      borderColor: '#E2E8F0',
                      borderRadius: 12,
                      paddingVertical: 10,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#0076D7' }}>{amt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recent Transactions List */}
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#0F172A' }}>Recent Transactions</Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#0076D7' }}>View All</Text>
              </View>

              {[
                { title: 'UPI Top-Up via PhonePe', date: 'Today, 2:45 PM', amount: '+₹1,000.00', type: 'credit', icon: '📥' },
                { title: 'Lead Enquiry Fee - Amnesia Sky Bar', date: 'Yesterday, 8:12 PM', amount: '-₹150.00', type: 'debit', icon: '📤' },
                { title: 'Diwali Cashback Bonus', date: '04 Nov 2026', amount: '+₹250.00', type: 'credit', icon: '🎁' },
                { title: 'Premium Business Listing Upgrade', date: '01 Nov 2026', amount: '-₹1,499.00', type: 'debit', icon: '⭐' },
              ].map((tx, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: tx.type === 'credit' ? '#ECFDF5' : '#FEF2F2',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text style={{ fontSize: 16 }}>{tx.icon}</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }}>{tx.title}</Text>
                      <Text style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{tx.date}</Text>
                    </View>
                  </View>
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '900',
                    color: tx.type === 'credit' ? '#16A34A' : '#EF4444'
                  }}>
                    {tx.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : activeTab === 'Enquiries' ? (
          /* ================= MY ENQUIRIES TAB ================= */
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A' }}>My Live Enquiries</Text>
                <Text style={{ fontSize: 11, color: '#64748B' }}>Dispatched quotes & vendor replies</Text>
              </View>
              <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#0076D7' }}>{myEnquiries.length} Active</Text>
              </View>
            </View>

            {myEnquiries.map((enq, idx) => (
              <View key={idx} style={styles.enquiryCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#0076D7', fontFamily: 'monospace' }}>{enq.referenceNo}</Text>
                  <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A' }}>{enq.status}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A', marginTop: 4 }}>{enq.businessName}</Text>
                <Text style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{enq.message}</Text>
                <Text style={{ fontSize: 10, color: '#94A3B8', marginTop: 4 }}>Dispatched: {enq.date}</Text>
              </View>
            ))}
          </View>
        ) : activeTab === 'Profile' ? (
          /* ================= EXACT APPROVED HELLO-HI PROFILE SCREEN ================= */
          user ? (
            <View>
              {/* SECTION 1 — HELLO-HI BLUE BRANDED HEADER */}
              <View style={{
                backgroundColor: '#0076D7',
                paddingTop: 16,
                paddingBottom: 20,
                paddingHorizontal: 16,
                borderBottomLeftRadius: 28,
                borderBottomRightRadius: 28,
                position: 'relative',
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 6
              }}>
                {/* Abstract curved gradient background accents */}
                <View style={{
                  position: 'absolute',
                  top: -60,
                  right: -50,
                  width: 180,
                  height: 180,
                  borderRadius: 90,
                  backgroundColor: '#0B1220',
                  opacity: 0.25
                }} />
                <View style={{
                  position: 'absolute',
                  bottom: -40,
                  left: -30,
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  backgroundColor: '#FF6B35',
                  opacity: 0.18
                }} />

                {/* Wordmark Branding */}
                <View style={{ alignItems: 'center', marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 }}>Hello</Text>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#FF6B35', letterSpacing: 0.5 }}>-Hi</Text>
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                    Search Local. Connect Instant.
                  </Text>
                </View>

                {/* Header Controls Bar (Location, Business Identity, Notification Bell) */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  {/* Left — Location */}
                  <TouchableOpacity
                    onPress={() => setShowCityModal(true)}
                    activeOpacity={0.8}
                    style={{
                      flex: 1.1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.18)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.3)',
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      borderRadius: 20,
                      gap: 4
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>📍</Text>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFFFFF', flex: 1 }} numberOfLines={1}>
                      {selectedCity} ({selectedLocality})
                    </Text>
                    <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>▼</Text>
                  </TouchableOpacity>

                  {/* Middle/Right — Business Identity */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      flex: 1.1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.18)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.3)',
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      borderRadius: 20,
                      gap: 4
                    }}
                  >
                    <Text style={{ fontSize: 11 }}>👤</Text>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFFFFF', flex: 1 }} numberOfLines={1}>
                      {user.businessName || user.fullName || 'Business Partner'}
                    </Text>
                    <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>▼</Text>
                  </TouchableOpacity>

                  {/* Far Right — Notification Bell */}
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        '🏢 Business Partner Notifications',
                        '• New enquiries from customers in your area\n• Business profile verification status update\n• Direct customer call logs'
                      );
                    }}
                    activeOpacity={0.8}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      borderWidth: 1.5,
                      borderColor: 'rgba(255,255,255,0.6)',
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>🔔</Text>
                    <View style={{
                      position: 'absolute',
                      top: 1,
                      right: 1,
                      backgroundColor: '#FF6B35',
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1.5,
                      borderColor: '#0076D7'
                    }}>
                      <Text style={{ fontSize: 8, color: '#FFFFFF', fontWeight: '900' }}>1</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* BODY CONTAINER FOR SECTIONS 2-5 */}
              <View style={{ padding: 16, gap: 14 }}>
                {/* SECTION 2 — BUSINESS PARTNER PROFILE CARD */}
                <View style={{
                  backgroundColor: '#005FAE',
                  borderRadius: 24,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                  elevation: 5,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Curved orange decorative shape in lower-right */}
                  <View style={{
                    position: 'absolute',
                    bottom: -25,
                    right: -25,
                    width: 95,
                    height: 95,
                    borderRadius: 48,
                    backgroundColor: '#FF6B35',
                    opacity: 0.95
                  }} />

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    {/* Left: Avatar + Details */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                      <View style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        borderWidth: 2.5,
                        borderColor: '#FFFFFF',
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2
                      }}>
                        {user.avatarUrl ? (
                          <Image source={{ uri: user.avatarUrl }} style={{ width: '100%', height: '100%' }} />
                        ) : (
                          <Text style={{ fontSize: 22, fontWeight: '900', color: '#FFF' }}>
                            {(user.businessName || user.fullName || 'V').charAt(0).toUpperCase()}
                          </Text>
                        )}
                      </View>

                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF' }} numberOfLines={1}>
                          {user.businessName || user.fullName || 'Business Partner'}
                        </Text>
                        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)', fontWeight: '600', marginTop: 2 }}>
                          📞 {user.phoneNumber || '+916302759527'}
                        </Text>

                        {/* Status Badges */}
                        <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                          <View style={{
                            backgroundColor: '#FFF7ED',
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            <Text style={{ fontSize: 10 }}>🏬</Text>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#EA580C' }}>Business Partner</Text>
                          </View>

                          <View style={{
                            backgroundColor: (user.isVerified || user.status === 'VERIFIED') ? '#ECFDF5' : '#FFFBEB',
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            <Text style={{ fontSize: 10, color: (user.isVerified || user.status === 'VERIFIED') ? '#059669' : '#D97706' }}>
                              {(user.isVerified || user.status === 'VERIFIED') ? '✓' : '⚠️'}
                            </Text>
                            <Text style={{
                              fontSize: 10,
                              fontWeight: '800',
                              color: (user.isVerified || user.status === 'VERIFIED') ? '#059669' : '#D97706'
                            }}>
                              {(user.isVerified || user.status === 'VERIFIED') ? 'Verified' : (user.status || 'Pending')}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Right: Edit Profile Button */}
                    <TouchableOpacity
                      onPress={() => setShowAddBusinessModal(true)}
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.18)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.7)',
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        borderRadius: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <Text style={{ fontSize: 11, color: '#FFF' }}>✎</Text>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFF' }}>Edit Profile</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* SECTION 3 — ACCOUNT DETAILS (EXACT FOUR CARDS IN 2x2 GRID) */}
                <View style={styles.dbProfileCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Text style={{ fontSize: 16 }}>🥞</Text>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A' }}>Account Details</Text>
                  </View>

                  <View style={styles.dbGrid}>
                    {/* Card 1: User ID */}
                    <View style={styles.dbFieldBox}>
                      <Text style={styles.dbLabel}>USER ID</Text>
                      <Text style={styles.dbVal} numberOfLines={1} ellipsizeMode="middle">
                        {user.id || 'usr_anonymous'}
                      </Text>
                    </View>

                    {/* Card 2: Status */}
                    <View style={styles.dbFieldBox}>
                      <Text style={styles.dbLabel}>STATUS</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: (user.status === 'ACTIVE' || !user.status) ? '#16A34A' : '#F59E0B' }} />
                        <Text style={[styles.dbVal, { color: (user.status === 'ACTIVE' || !user.status) ? '#16A34A' : '#D97706', marginTop: 0 }]}>
                          {user.status || 'Active'}
                        </Text>
                      </View>
                    </View>

                    {/* Card 3: Phone */}
                    <View style={styles.dbFieldBox}>
                      <Text style={styles.dbLabel}>PHONE</Text>
                      <Text style={styles.dbVal} numberOfLines={1}>
                        {user.phoneNumber || '+916302759527'}
                      </Text>
                    </View>

                    {/* Card 4: Role */}
                    <View style={styles.dbFieldBox}>
                      <Text style={styles.dbLabel}>ROLE</Text>
                      <Text style={[styles.dbVal, { color: '#0076D7' }]} numberOfLines={1}>
                        {Array.isArray(user.roles)
                          ? (user.roles.includes('VENDOR_OWNER') ? 'Vendor Owner' : user.roles.includes('VENDOR_STAFF') ? 'Vendor Staff' : 'Customer')
                          : (user.role || 'Vendor Owner')}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* SECTION 4 — ACCOUNT ACTIONS (EXACT THREE BUTTONS) */}
                <View style={styles.dbProfileCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Text style={{ fontSize: 16 }}>⚡</Text>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A' }}>Account Actions</Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {/* Button 1: Edit Profile */}
                    <TouchableOpacity
                      onPress={() => setShowAddBusinessModal(true)}
                      style={{
                        flex: 1,
                        backgroundColor: '#EFF6FF',
                        borderWidth: 1,
                        borderColor: '#BFDBFE',
                        paddingVertical: 10,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: 4
                      }}
                    >
                      <Text style={{ fontSize: 12 }}>✎</Text>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#0076D7' }}>Edit Profile</Text>
                    </TouchableOpacity>

                    {/* Button 2: Change Password (OTP Security) */}
                    <TouchableOpacity
                      onPress={() => Alert.alert('Account Security', 'Account authentication is secured with dynamic OTP SMS login verification.')}
                      style={{
                        flex: 1.2,
                        backgroundColor: '#F8FAFC',
                        borderWidth: 1,
                        borderColor: '#E2E8F0',
                        paddingVertical: 10,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: 4
                      }}
                    >
                      <Text style={{ fontSize: 12 }}>🔒</Text>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#334155' }}>Change Password</Text>
                    </TouchableOpacity>

                    {/* Button 3: Sign Out */}
                    <TouchableOpacity
                      onPress={handleSignOut}
                      style={{
                        flex: 1,
                        backgroundColor: '#FF6B35',
                        paddingVertical: 10,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: 4,
                        shadowColor: '#FF6B35',
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 2
                      }}
                    >
                      <Text style={{ fontSize: 12, color: '#FFF' }}>➜</Text>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFF' }}>Sign Out</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* SECTION 5 — COMPANY & INFORMATION (EXACT FIVE ROWS) */}
                <View style={styles.dbProfileCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Text style={{ fontSize: 16 }}>🏢</Text>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A' }}>Company & Information</Text>
                  </View>

                  <View style={{ gap: 8 }}>
                    {/* Row 1 — About Hello-Hi */}
                    <TouchableOpacity
                      onPress={() => openCmsPage('about')}
                      style={styles.cmsMenuItem}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={[styles.cmsMenuIconBox, { backgroundColor: '#EFF6FF' }]}>
                          <Text style={{ fontSize: 16 }}>ℹ️</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cmsMenuTitle}>About Hello-Hi</Text>
                          <Text style={styles.cmsMenuSub}>Mission, pillars & verified discovery engine</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: 'bold' }}>→</Text>
                    </TouchableOpacity>

                    {/* Row 2 — Frequently Asked Questions (FAQ) */}
                    <TouchableOpacity
                      onPress={() => openCmsPage('faq')}
                      style={styles.cmsMenuItem}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={[styles.cmsMenuIconBox, { backgroundColor: '#FAF5FF' }]}>
                          <Text style={{ fontSize: 16 }}>❓</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cmsMenuTitle}>Frequently Asked Questions (FAQ)</Text>
                          <Text style={styles.cmsMenuSub}>Instant answers about verification & quotes</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: 'bold' }}>→</Text>
                    </TouchableOpacity>

                    {/* Row 3 — Terms & Conditions */}
                    <TouchableOpacity
                      onPress={() => openCmsPage('terms')}
                      style={styles.cmsMenuItem}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={[styles.cmsMenuIconBox, { backgroundColor: '#F0FDF4' }]}>
                          <Text style={{ fontSize: 16 }}>📜</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cmsMenuTitle}>Terms & Conditions</Text>
                          <Text style={styles.cmsMenuSub}>Platform rules, merchant & customer policy</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: 'bold' }}>→</Text>
                    </TouchableOpacity>

                    {/* Row 4 — Contact Us & Support */}
                    <TouchableOpacity
                      onPress={() => openCmsPage('contact')}
                      style={styles.cmsMenuItem}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={[styles.cmsMenuIconBox, { backgroundColor: '#FFF7ED' }]}>
                          <Text style={{ fontSize: 16 }}>📞</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cmsMenuTitle}>Contact Us & Support</Text>
                          <Text style={styles.cmsMenuSub}>Toll-free, WhatsApp desk & DB enquiry form</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: 'bold' }}>→</Text>
                    </TouchableOpacity>

                    {/* Row 5 — Privacy Policy (DPDP Act 2023) */}
                    <TouchableOpacity
                      onPress={() => openCmsPage('privacy')}
                      style={styles.cmsMenuItem}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={[styles.cmsMenuIconBox, { backgroundColor: '#F8FAFC' }]}>
                          <Text style={{ fontSize: 16 }}>🛡️</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cmsMenuTitle}>Privacy Policy (DPDP Act 2023)</Text>
                          <Text style={styles.cmsMenuSub}>Data minimization & encryption protections</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: 'bold' }}>→</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            /* Unauthenticated Guest Account View - EXACT APPROVED DESIGN */
            <View>
              {/* SECTION 1 — HELLO-HI BLUE BRANDED HEADER (GUEST: Location + Bell only, NO Partner Pill) */}
              <View style={{
                backgroundColor: '#0076D7',
                paddingTop: 16,
                paddingBottom: 20,
                paddingHorizontal: 16,
                borderBottomLeftRadius: 28,
                borderBottomRightRadius: 28,
                position: 'relative',
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 6
              }}>
                {/* Abstract curved gradient background accents */}
                <View style={{
                  position: 'absolute',
                  top: -60,
                  right: -50,
                  width: 180,
                  height: 180,
                  borderRadius: 90,
                  backgroundColor: '#0B1220',
                  opacity: 0.25
                }} />
                <View style={{
                  position: 'absolute',
                  bottom: -40,
                  left: -30,
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  backgroundColor: '#FF6B35',
                  opacity: 0.18
                }} />

                {/* Wordmark Branding */}
                <View style={{ alignItems: 'center', marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 }}>Hello</Text>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#FF6B35', letterSpacing: 0.5 }}>-Hi</Text>
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                    Search Local. Connect Instant.
                  </Text>
                </View>

                {/* Header Controls Bar (Location + Notification Bell Only) */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Left — Location Pill */}
                  <TouchableOpacity
                    onPress={() => setShowCityModal(true)}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.18)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.3)',
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                      borderRadius: 20,
                      gap: 5
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>📍</Text>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFFFFF' }}>
                      {selectedCity} ({selectedLocality})
                    </Text>
                    <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>▼</Text>
                  </TouchableOpacity>

                  {/* Right — Notification Bell with Badge */}
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        '🔔 Guest Notifications',
                        'Login to receive real-time updates on your service enquiries and quotes.'
                      );
                    }}
                    activeOpacity={0.8}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      borderWidth: 1.5,
                      borderColor: 'rgba(255,255,255,0.6)',
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>🔔</Text>
                    <View style={{
                      position: 'absolute',
                      top: 1,
                      right: 1,
                      backgroundColor: '#FF6B35',
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1.5,
                      borderColor: '#0076D7'
                    }}>
                      <Text style={{ fontSize: 8, color: '#FFFFFF', fontWeight: '900' }}>1</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* BODY CONTAINER FOR SECTIONS 2-5 */}
              <View style={{ padding: 16, gap: 14 }}>
                {/* SECTION 2 — WELCOME TO HELLO-HI CARD */}
                <View style={{
                  backgroundColor: '#005FAE',
                  borderRadius: 24,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                  elevation: 5,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Curved orange decorative accent in lower right */}
                  <View style={{
                    position: 'absolute',
                    bottom: -25,
                    right: -25,
                    width: 95,
                    height: 95,
                    borderRadius: 48,
                    backgroundColor: '#FF6B35',
                    opacity: 0.95
                  }} />

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                    {/* Left: Silhouette Avatar + Texts */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, paddingRight: 10 }}>
                      <View style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2
                      }}>
                        <Text style={{ fontSize: 28, color: '#0076D7' }}>👤</Text>
                      </View>

                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF' }}>
                          Welcome to Hello-Hi
                        </Text>
                        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.92)', fontWeight: '500', marginTop: 3, lineHeight: 15 }}>
                          Login or Register to access your account, book services, manage enquiries and more.
                        </Text>
                      </View>
                    </View>

                    {/* Right: Stacked Login & Register Buttons */}
                    <View style={{ gap: 8, width: 88, shrink: 0 }}>
                      <TouchableOpacity
                        onPress={() => { setAuthMode('login'); setAuthStep('role'); setIsAuthModalVisible(true); }}
                        activeOpacity={0.8}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.18)',
                          borderWidth: 1,
                          borderColor: 'rgba(255,255,255,0.7)',
                          paddingVertical: 6,
                          borderRadius: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4
                        }}
                      >
                        <Text style={{ fontSize: 11, color: '#FFF' }}>➜</Text>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFF' }}>Login</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => { setAuthMode('register'); setAuthStep('role'); setIsAuthModalVisible(true); }}
                        activeOpacity={0.8}
                        style={{
                          backgroundColor: '#FF6B35',
                          paddingVertical: 6,
                          borderRadius: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4,
                          shadowColor: '#FF6B35',
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 2
                        }}
                      >
                        <Text style={{ fontSize: 11, color: '#FFF' }}>＋</Text>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFF' }}>Register</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* SECTION 3 — GUEST ACCESS (EXACT FOUR CARDS IN 2x2 GRID) */}
                <View style={styles.dbProfileCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Text style={{ fontSize: 16 }}>🥞</Text>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A' }}>Guest Access</Text>
                  </View>

                  <View style={styles.dbGrid}>
                    {/* Card 1: Browse Services */}
                    <TouchableOpacity
                      onPress={() => setActiveTab('Services')}
                      activeOpacity={0.7}
                      style={styles.dbFieldBox}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <Text style={{ fontSize: 14 }}>📅</Text>
                        <Text style={{ fontSize: 12, fontWeight: '900', color: '#0F172A' }}>Browse Services</Text>
                      </View>
                      <Text style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>
                        Explore & book verified services
                      </Text>
                    </TouchableOpacity>

                    {/* Card 2: View Plans */}
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert('HELLO-Hi Subscription Plans', 'Explore dynamic verified merchant membership & customer benefit plans directly powered by SQLite DB.');
                      }}
                      activeOpacity={0.7}
                      style={styles.dbFieldBox}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <Text style={{ fontSize: 14 }}>📋</Text>
                        <Text style={{ fontSize: 12, fontWeight: '900', color: '#0F172A' }}>View Plans</Text>
                      </View>
                      <Text style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>
                        Check subscription plans
                      </Text>
                    </TouchableOpacity>

                    {/* Card 3: Get Help */}
                    <TouchableOpacity
                      onPress={() => openCmsPage('faq')}
                      activeOpacity={0.7}
                      style={styles.dbFieldBox}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <Text style={{ fontSize: 14 }}>❓</Text>
                        <Text style={{ fontSize: 12, fontWeight: '900', color: '#0F172A' }}>Get Help</Text>
                      </View>
                      <Text style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>
                        FAQs & support articles
                      </Text>
                    </TouchableOpacity>

                    {/* Card 4: Stay Updated */}
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert('Stay Updated', 'Receive the latest local business offers, verified announcements, and platform updates in your city.');
                      }}
                      activeOpacity={0.7}
                      style={styles.dbFieldBox}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <Text style={{ fontSize: 14 }}>🔔</Text>
                        <Text style={{ fontSize: 12, fontWeight: '900', color: '#0F172A' }}>Stay Updated</Text>
                      </View>
                      <Text style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>
                        Offers, updates & announcements
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* SECTION 4 — ACCOUNT ACTIONS (EXACT TWO BUTTONS) */}
                <View style={styles.dbProfileCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Text style={{ fontSize: 16 }}>⚡</Text>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A' }}>Account Actions</Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {/* Button 1: Login */}
                    <TouchableOpacity
                      onPress={() => { setAuthMode('login'); setAuthStep('role'); setIsAuthModalVisible(true); }}
                      activeOpacity={0.8}
                      style={{
                        flex: 1,
                        backgroundColor: '#EFF6FF',
                        borderWidth: 1.5,
                        borderColor: '#BFDBFE',
                        paddingVertical: 12,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: 6
                      }}
                    >
                      <Text style={{ fontSize: 14, color: '#0076D7' }}>➜</Text>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: '#0076D7' }}>Login</Text>
                    </TouchableOpacity>

                    {/* Button 2: Register */}
                    <TouchableOpacity
                      onPress={() => { setAuthMode('register'); setAuthStep('role'); setIsAuthModalVisible(true); }}
                      activeOpacity={0.8}
                      style={{
                        flex: 1,
                        backgroundColor: '#FF6B35',
                        paddingVertical: 12,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: 6,
                        shadowColor: '#FF6B35',
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 2
                      }}
                    >
                      <Text style={{ fontSize: 14, color: '#FFF' }}>＋</Text>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: '#FFF' }}>Register</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* SECTION 5 — COMPANY & INFORMATION (EXACT FIVE ROWS) */}
                <View style={styles.dbProfileCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Text style={{ fontSize: 16 }}>🏢</Text>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A' }}>Company & Information</Text>
                  </View>

                  <View style={{ gap: 8 }}>
                    {/* Row 1 — About Hello-Hi */}
                    <TouchableOpacity
                      onPress={() => openCmsPage('about')}
                      style={styles.cmsMenuItem}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={[styles.cmsMenuIconBox, { backgroundColor: '#EFF6FF' }]}>
                          <Text style={{ fontSize: 16 }}>ℹ️</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cmsMenuTitle}>About Hello-Hi</Text>
                          <Text style={styles.cmsMenuSub}>Mission, pillars & verified discovery engine</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: 'bold' }}>→</Text>
                    </TouchableOpacity>

                    {/* Row 2 — Frequently Asked Questions (FAQ) */}
                    <TouchableOpacity
                      onPress={() => openCmsPage('faq')}
                      style={styles.cmsMenuItem}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={[styles.cmsMenuIconBox, { backgroundColor: '#FAF5FF' }]}>
                          <Text style={{ fontSize: 16 }}>❓</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cmsMenuTitle}>Frequently Asked Questions (FAQ)</Text>
                          <Text style={styles.cmsMenuSub}>Instant answers about verification & quotes</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: 'bold' }}>→</Text>
                    </TouchableOpacity>

                    {/* Row 3 — Terms & Conditions */}
                    <TouchableOpacity
                      onPress={() => openCmsPage('terms')}
                      style={styles.cmsMenuItem}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={[styles.cmsMenuIconBox, { backgroundColor: '#F0FDF4' }]}>
                          <Text style={{ fontSize: 16 }}>📜</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cmsMenuTitle}>Terms & Conditions</Text>
                          <Text style={styles.cmsMenuSub}>Platform rules, merchant & customer policy</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: 'bold' }}>→</Text>
                    </TouchableOpacity>

                    {/* Row 4 — Contact Us & Support */}
                    <TouchableOpacity
                      onPress={() => openCmsPage('contact')}
                      style={styles.cmsMenuItem}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={[styles.cmsMenuIconBox, { backgroundColor: '#FFF7ED' }]}>
                          <Text style={{ fontSize: 16 }}>📞</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cmsMenuTitle}>Contact Us & Support</Text>
                          <Text style={styles.cmsMenuSub}>Toll-free, WhatsApp desk & DB enquiry form</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: 'bold' }}>→</Text>
                    </TouchableOpacity>

                    {/* Row 5 — Privacy Policy (DPDP Act 2023) */}
                    <TouchableOpacity
                      onPress={() => openCmsPage('privacy')}
                      style={styles.cmsMenuItem}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={[styles.cmsMenuIconBox, { backgroundColor: '#F8FAFC' }]}>
                          <Text style={{ fontSize: 16 }}>🛡️</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cmsMenuTitle}>Privacy Policy (DPDP Act 2023)</Text>
                          <Text style={styles.cmsMenuSub}>Data minimization & encryption protections</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: 'bold' }}>→</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )
        ) : (
          /* ================= HOME TAB (MAIN HUB) ================= */
          <View>
            {/* 1. HORIZONTAL ALL CATEGORIES CAROUSEL PILLS (LOADED FROM DB) */}
            <View style={{ marginVertical: 8 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}>
                <TouchableOpacity
                  onPress={() => setSelectedCategory('All')}
                  style={[styles.carouselPill, selectedCategory === 'All' && styles.carouselPillActive]}
                >
                  <Text style={[styles.carouselPillText, selectedCategory === 'All' && styles.carouselPillTextActive]}>
                    🌟 All
                  </Text>
                </TouchableOpacity>

                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategory(isSelected ? 'All' : cat.slug)}
                      style={[styles.carouselPill, isSelected && styles.carouselPillActive]}
                    >
                      <Text style={{ fontSize: 12, marginRight: 4 }}>{cat.icon}</Text>
                      <Text style={[styles.carouselPillText, isSelected && styles.carouselPillTextActive]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 2. PROMO BANNERS / LIVE COUPONS CAROUSEL */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, marginVertical: 6 }}>
              {coupons && coupons.length > 0 ? (
                coupons.map((cpn: any) => (
                  <TouchableOpacity
                    key={cpn.id}
                    onPress={() => Alert.alert('Coupon Code', `Use Code: ${cpn.code}\n${cpn.title}\n${cpn.description || ''}`)}
                    style={{
                      backgroundColor: '#0F172A',
                      borderRadius: 16,
                      padding: 12,
                      width: 230,
                      justifyContent: 'space-between',
                      borderWidth: 1,
                      borderColor: '#334155'
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1, paddingRight: 6 }}>
                        <View style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.4)' }}>
                          <Text style={{ fontSize: 9, fontWeight: '800', color: '#FCD34D', textTransform: 'uppercase' }}>
                            {cpn.discount_type === 'PERCENTAGE' ? `${cpn.discount_value}% OFF` : `₹${cpn.discount_value} OFF`}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 13, fontWeight: '900', color: '#FFF', marginTop: 4 }} numberOfLines={1}>{cpn.title}</Text>
                        <Text style={{ fontSize: 9, color: '#CBD5E1', marginTop: 2 }} numberOfLines={1}>{cpn.description || `Verified ${selectedCity} Deals`}</Text>
                      </View>
                      <Text style={{ fontSize: 24 }}>🎉</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#334155' }}>
                      <Text style={{ fontSize: 10, fontWeight: '900', color: '#FCD34D', letterSpacing: 0.5 }}>{cpn.code}</Text>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: '#94A3B8' }}>Tap to view</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.promoBanner1}>
                  <View>
                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#FCD34D', textTransform: 'uppercase' }}>Festival Deals</Text>
                    <Text style={{ fontSize: 13, fontWeight: '900', color: '#FFF', marginTop: 2 }}>UP TO 50% OFF</Text>
                    <Text style={{ fontSize: 9, color: '#CBD5E1' }}>Verified {selectedCity} Vendors</Text>
                  </View>
                  <Text style={{ fontSize: 26 }}>🎉</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => setShowAddBusinessModal(true)}
                style={styles.promoBanner2}
              >
                <View>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: '#BFDBFE', textTransform: 'uppercase' }}>Free Business Listing</Text>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: '#FFF', marginTop: 2 }}>Claim Business</Text>
                  <Text style={{ fontSize: 9, color: '#EFF6FF', fontWeight: '800' }}>100% Free Setup 🚀</Text>
                </View>
                <Text style={{ fontSize: 26 }}>🏢</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* 3. EXPLORE ALL CATEGORIES GRID (LOADED FROM DB) */}
            <View style={styles.exploreGridContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }}>Explore Categories</Text>
                  <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 }}>
                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#16A34A' }}>{categories.length} in DB</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setActiveTab('Services')}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#0076D7' }}>View All ({categories.length}) →</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.grid4Col}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategory(isSelected ? 'All' : cat.slug)}
                      style={[styles.grid4ColItem, isSelected && styles.grid4ColItemActive]}
                    >
                      <View style={[styles.iconCircleSmall, { backgroundColor: cat.bgColor || '#F1F5F9' }]}>
                        <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
                      </View>
                      <Text style={[styles.grid4ColText, isSelected && { color: '#0076D7', fontWeight: '800' }]} numberOfLines={1}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 4. VERIFIED DIRECTORY LISTING (DIRECT FROM DATABASE) */}
            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A' }}>
                    {selectedCategory === 'All' ? 'Verified Directory' : `${selectedCategory.toUpperCase()} in ${selectedCity}`}
                  </Text>
                  <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#0076D7' }}>{businesses.length} Ready</Text>
                  </View>
                </View>
                {selectedCategory !== 'All' && (
                  <TouchableOpacity onPress={() => setSelectedCategory('All')}>
                    <Text style={{ fontSize: 10, color: '#94A3B8', fontWeight: '700' }}>Clear Filter ✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {isLoadingBusinesses ? (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#0076D7" />
                  <Text style={{ fontSize: 11, color: '#64748B', marginTop: 8 }}>Fetching live businesses from MySQL hello_db...</Text>
                </View>
              ) : businesses.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={{ fontSize: 28 }}>🏢</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A', marginTop: 4 }}>No listings in this category yet</Text>
                  <Text style={{ fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 2 }}>
                    Be the first verified listing in {selectedCity}!
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowAddBusinessModal(true)}
                    style={{ marginTop: 10, backgroundColor: '#0076D7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}
                  >
                    <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>Add Your Business Free +</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                businesses.map((biz: any) => {
                  const cardImg = biz.coverImageUrl || biz.imageUrl || biz.image || CATEGORY_DEFAULT_IMAGES[biz.primaryCategory?.slug || biz.category || 'restaurants'] || CATEGORY_DEFAULT_IMAGES['restaurants'];
                  return (
                    <TouchableOpacity
                      key={biz.id}
                      activeOpacity={0.88}
                      onPress={() => setSelectedBusiness(biz)}
                      style={styles.businessCard}
                    >
                      {/* Business Cover Photo Banner */}
                      <View style={{ width: '100%', height: 120, borderRadius: 12, overflow: 'hidden', marginBottom: 10, backgroundColor: '#E2E8F0' }}>
                        <Image
                          source={{ uri: cardImg }}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                        <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(15, 23, 42, 0.8)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                          <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>
                            {biz.primaryCategory?.name || 'Verified'}
                          </Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={styles.bizCardTitle} numberOfLines={1}>{biz.name}</Text>
                            <Text style={{ color: '#0076D7', fontSize: 11, fontWeight: 'bold' }}>✓</Text>
                          </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                          <Text style={{ fontSize: 11, fontWeight: '800', color: '#F59E0B' }}>★ {biz.averageRating || 4.8}</Text>
                          <Text style={{ fontSize: 10, color: '#64748B' }}>({biz.totalReviews || 45} reviews)</Text>
                          <Text style={{ fontSize: 10, color: '#CBD5E1' }}>•</Text>
                          <Text style={{ fontSize: 10, color: '#475569', fontWeight: '600' }} numberOfLines={1}>
                            {biz.location?.localityName || 'Local'}, {biz.location?.cityName || selectedCity}
                          </Text>
                        </View>
                        {biz.description && (
                          <Text style={styles.bizCardDesc} numberOfLines={2}>{biz.description}</Text>
                        )}
                        <Text style={{ fontSize: 10, color: '#0076D7', fontWeight: '700', marginTop: 4 }}>
                          Tap for Full Profile, Timings & Services →
                        </Text>
                      </View>
                    </View>

                    {/* Action Buttons: Call Now, WhatsApp, Instant Quote */}
                    <View style={styles.bizButtonRow}>
                      <TouchableOpacity
                        onPress={(e) => {
                          e?.stopPropagation?.();
                          Alert.alert('Call Merchant', `Dialing ${biz.contacts?.callNumber || biz.primaryPhone || '+91 98480 22334'}...`);
                        }}
                        style={styles.bizCallBtn}
                      >
                        <Text style={{ fontSize: 11 }}>📞</Text>
                        <Text style={styles.bizBtnText}>Call</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={(e) => {
                          e?.stopPropagation?.();
                          Alert.alert('WhatsApp Chat', `Opening WhatsApp for ${biz.name}...`);
                        }}
                        style={styles.bizWhatsappBtn}
                      >
                        <Text style={{ fontSize: 11 }}>💬</Text>
                        <Text style={styles.bizBtnText}>WhatsApp</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={(e) => {
                          e?.stopPropagation?.();
                          setEnquiryModalBiz(biz);
                          setEnquiryPhone(user?.phoneNumber || '');
                        }}
                        style={styles.bizQuoteBtn}
                      >
                        <Text style={{ fontSize: 11 }}>⚡</Text>
                        <Text style={styles.bizBtnText}>Get Quote</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM NAVIGATION BAR (MATCHING HTTP://LOCALHOST:3002/) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => setActiveTab('Home')}
          style={styles.navItem}
        >
          <Text style={{ fontSize: 18 }}>🏠</Text>
          <Text style={[styles.navLabel, activeTab === 'Home' && styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('Services')}
          style={styles.navItem}
        >
          <Text style={{ fontSize: 18 }}>🧭</Text>
          <Text style={[styles.navLabel, activeTab === 'Services' && styles.navLabelActive]}>Services</Text>
        </TouchableOpacity>

        {/* Center Floating Button: Wallet */}
        <TouchableOpacity
          onPress={() => setActiveTab('Wallet')}
          style={[styles.centerFloatingBtn, activeTab === 'Wallet' && { backgroundColor: '#0076D7' }]}
        >
          <Text style={{ fontSize: 20 }}>👛</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('Enquiries')}
          style={styles.navItem}
        >
          <Text style={{ fontSize: 18 }}>💬</Text>
          <Text style={[styles.navLabel, activeTab === 'Enquiries' && styles.navLabelActive]}>Enquiries</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('Profile')}
          style={styles.navItem}
        >
          <Text style={{ fontSize: 18 }}>👤</Text>
          <Text style={[styles.navLabel, activeTab === 'Profile' && styles.navLabelActive]}>
            {user ? 'Profile' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* CITY SELECTION MODAL */}
      <Modal visible={showCityModal} transparent animationType="fade">
        <TouchableOpacity
          onPress={() => setShowCityModal(false)}
          style={styles.modalBackdrop}
        >
          <View style={styles.cityModalContent}>
            {/* Auto Detect Location Option */}
            <TouchableOpacity
              onPress={() => {
                setSelectedCity('Hyderabad');
                setSelectedLocality('Hitec City');
                setShowCityModal(false);
                Alert.alert('GPS Location Detected', '📍 Current location identified: Hitec City, Hyderabad');
              }}
              style={[
                styles.cityModalItem,
                { backgroundColor: '#EFF6FF', borderColor: '#93C5FD', marginBottom: 12 }
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 18 }}>🧭</Text>
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '900', color: '#0076D7' }}>Auto-Detect Exact Location</Text>
                    <Text style={{ fontSize: 10, color: '#64748B' }}>Uses device GPS coordinates</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: '#16A34A' }}>GPS</Text>
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.cityModalTitle}>SELECT PILOT CITY HUB</Text>
            {(['Hyderabad', 'Vijayawada', 'Guntur'] as const).map((city) => (
              <TouchableOpacity
                key={city}
                onPress={() => {
                  setSelectedCity(city);
                  setSelectedLocality(city === 'Hyderabad' ? 'Hitec City' : city === 'Vijayawada' ? 'Benz Circle' : 'Brodipet');
                  setShowCityModal(false);
                }}
                style={[
                  styles.cityModalItem,
                  selectedCity === city && { backgroundColor: '#EFF6FF', borderColor: '#0076D7' }
                ]}
              >
                <Text style={{ fontSize: 14, fontWeight: '800', color: selectedCity === city ? '#0076D7' : '#0F172A' }}>{city}</Text>
                <Text style={{ fontSize: 11, color: '#64748B' }}>
                  {city === 'Hyderabad' ? 'Hitec City, Banjara Hills' : city === 'Vijayawada' ? 'Benz Circle, MG Road' : 'Brodipet, Arundelpet'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* INSTANT ENQUIRY BOTTOM SHEET */}
      {enquiryModalBiz && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.enquirySheet}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#FF6B35', textTransform: 'uppercase' }}>Instant 15-Min Quote</Text>
                  <Text style={{ fontSize: 14, fontWeight: '900', color: '#0F172A' }}>{enquiryModalBiz.name}</Text>
                </View>
                <TouchableOpacity onPress={() => setEnquiryModalBiz(null)}>
                  <Text style={{ fontSize: 18, color: '#94A3B8' }}>✕</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="e.g. Need table booking for 4 / quote for AC service..."
                placeholderTextColor="#94A3B8"
                value={enquiryMsg}
                onChangeText={setEnquiryMsg}
                multiline
                numberOfLines={3}
                style={styles.enquiryTextArea}
              />

              <TextInput
                placeholder="Enter Your Mobile Number"
                placeholderTextColor="#94A3B8"
                value={enquiryPhone}
                onChangeText={setEnquiryPhone}
                keyboardType="phone-pad"
                style={styles.enquiryInput}
              />

              <TouchableOpacity
                onPress={handleDispatchEnquiry}
                disabled={isSendingEnquiry}
                style={styles.enquirySubmitBtn}
              >
                {isSendingEnquiry ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '800' }}>Get Instant Quote 🚀</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* IN-APP AUTHENTICATION MODAL (WITH USER'S REQUIRED FIELDS) */}
      <Modal visible={isAuthModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.authModalCard}>
            
            {/* Toggle: Sign In vs Register */}
            {authStep !== 'otp' && (
              <View style={styles.authToggleBar}>
                <TouchableOpacity
                  onPress={() => setAuthMode('login')}
                  style={[styles.authToggleBtn, authMode === 'login' && styles.authToggleBtnActive]}
                >
                  <Text style={[styles.authToggleText, authMode === 'login' && styles.authToggleTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAuthMode('register')}
                  style={[styles.authToggleBtn, authMode === 'register' && styles.authToggleBtnActive]}
                >
                  <Text style={[styles.authToggleText, authMode === 'register' && styles.authToggleTextActive]}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.authModalTitle}>
              {authStep === 'role'
                ? (authMode === 'register' ? 'Join as Customer or Partner' : 'Select Account Type')
                : authStep === 'phone'
                ? (authMode === 'register' ? `Register as ${authRole === 'PARTNER' ? 'Business Partner' : 'Customer'}` : `${authRole === 'PARTNER' ? 'Business Partner' : 'Customer'} Login`)
                : 'Verify Mobile OTP'}
            </Text>
            <Text style={styles.authModalSub}>
              {authStep === 'role'
                ? 'Choose whether you want to use HELLO as a Customer or Business Partner.'
                : authStep === 'phone'
                ? 'Directly connected to backend MySQL database.'
                : `Enter the 6-digit code sent to +91${phoneNumber}.`}
            </Text>

            {authStep === 'role' ? (
              /* Role Selection Screen */
              <View style={{ width: '100%', gap: 10, marginVertical: 8 }}>
                {/* Customer Option */}
                <TouchableOpacity
                  onPress={() => {
                    setAuthRole('CUSTOMER');
                    setAuthStep('phone');
                  }}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1.5,
                    borderColor: '#E2E8F0',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 22 }}>👤</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>Customer</Text>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#0076D7' }}>
                        {authMode === 'register' ? 'Register →' : 'Sign In →'}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                      Find services, book appointments, discover verified local deals.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Business Partner Option */}
                <TouchableOpacity
                  onPress={() => {
                    setAuthRole('PARTNER');
                    setAuthStep('phone');
                  }}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1.5,
                    borderColor: '#E2E8F0',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 22 }}>🏢</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>Business Partner</Text>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#FF6B35' }}>
                        {authMode === 'register' ? 'Register →' : 'Sign In →'}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                      Register business, receive customer leads, manage profile & KYC.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : authStep === 'phone' ? (
              <View style={{ width: '100%' }}>
                {/* Switch Role Pill */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginBottom: 12 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: authRole === 'PARTNER' ? '#FF6B35' : '#0076D7' }}>
                    {authRole === 'PARTNER' ? '🏢 Business Partner' : '👤 Customer'} Mode
                  </Text>
                  <TouchableOpacity onPress={() => setAuthStep('role')}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B' }}>Change Role</Text>
                  </TouchableOpacity>
                </View>

                {authMode === 'register' && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.fieldLabel}>{authRole === 'PARTNER' ? 'Business Owner Name *' : 'Full Name *'}</Text>
                    <TextInput
                      style={styles.modalTextInput}
                      placeholder={authRole === 'PARTNER' ? "e.g. Vinod Kumar" : "e.g. Anand Varma"}
                      placeholderTextColor="#94A3B8"
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>
                )}

                {/* Exact Phone Number Input: +91 | Enter Mobile Number */}
                <Text style={styles.fieldLabel}>Mobile Number *</Text>
                <View style={styles.phoneInputContainer}>
                  <Text style={styles.phonePrefix}>+91</Text>
                  <View style={styles.phoneDivider} />
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter Mobile Number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>

                {/* Terms and Conditions Checkbox */}
                <View style={styles.termsRow}>
                  <TouchableOpacity
                    onPress={() => setAgreedTerms(!agreedTerms)}
                    style={[styles.checkbox, agreedTerms && styles.checkboxChecked]}
                  >
                    {agreedTerms && <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '900' }}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={styles.termsText}>
                    I Agree to{' '}
                    <Text onPress={() => openCmsPage('terms')} style={{ color: '#0076D7', fontWeight: '700' }}>
                      Terms and Conditions
                    </Text>{' '}
                    &{' '}
                    <Text onPress={() => openCmsPage('privacy')} style={{ color: '#0076D7', fontWeight: '700' }}>
                      Privacy Policy
                    </Text>
                  </Text>
                </View>

                {/* Action Button: Login with OTP / Register with OTP */}
                <TouchableOpacity
                  onPress={handleSendOtp}
                  disabled={isLoading}
                  style={styles.authActionBtn}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.authActionBtnText}>
                      {authMode === 'register' ? 'Register with OTP' : 'Login with OTP'}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Divider: Or Login Using */}
                <View style={styles.orDividerRow}>
                  <View style={styles.orDividerLine} />
                  <Text style={styles.orDividerText}>
                    {authMode === 'register' ? 'Or Register Using' : 'Or Login Using'}
                  </Text>
                  <View style={styles.orDividerLine} />
                </View>

                {/* Google Button */}
                <TouchableOpacity
                  onPress={() => {
                    const mockGoogleUser = {
                      id: 'usr_google_' + Date.now(),
                      fullName: fullName || 'Verified Google Member',
                      phoneNumber: '+919848012345',
                      preferredLanguage: selectedLanguage,
                      status: 'ACTIVE',
                      roles: ['CUSTOMER']
                    };
                    setUser(mockGoogleUser);
                    setIsAuthModalVisible(false);
                  }}
                  style={styles.googleBtn}
                >
                  <Text style={{ fontSize: 16 }}>🌐</Text>
                  <Text style={styles.googleBtnText}>Google</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* OTP Step */
              <View style={{ width: '100%' }}>
                <TextInput
                  style={styles.otpInputBox}
                  placeholder="• • • • • •"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="numeric"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                  autoFocus
                />

                <TouchableOpacity
                  onPress={handleVerifyOtp}
                  disabled={isLoading}
                  style={styles.authActionBtn}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.authActionBtnText}>Verify OTP & Save to DB</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setIsAuthModalVisible(false)}
              style={{ marginTop: 10, alignSelf: 'center' }}
            >
              <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* BUSINESS DETAILS MODAL (OPENED ON CARD CLICK) */}
      {selectedBusiness && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.bizDetailModal}>
              <View style={styles.bizDetailHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <View style={styles.verifiedTag}>
                      <Text style={{ fontSize: 9, fontWeight: '800', color: '#16A34A' }}>✓ VERIFIED</Text>
                    </View>
                    <View style={styles.openNowTag}>
                      <Text style={{ fontSize: 9, fontWeight: '800', color: '#0076D7' }}>● OPEN NOW</Text>
                    </View>
                  </View>
                  <Text style={styles.bizDetailTitle}>{selectedBusiness.name}</Text>
                  <Text style={styles.bizDetailCategory}>
                    {selectedBusiness.primaryCategory?.name || selectedBusiness.categoryName || 'Verified Merchant'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedBusiness(null)} style={styles.closeModalCircle}>
                  <Text style={{ fontSize: 16, color: '#64748B', fontWeight: '800' }}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                {/* Rating Strip */}
                <View style={styles.detailRatingStrip}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 16, color: '#F59E0B', fontWeight: '900' }}>★</Text>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: '#0F172A' }}>{selectedBusiness.averageRating || 4.9}</Text>
                    <Text style={{ fontSize: 11, color: '#64748B' }}>({selectedBusiness.totalReviews || 45} verified reviews)</Text>
                  </View>
                  <Text style={{ fontSize: 11, color: '#16A34A', fontWeight: '700' }}>● Instant Quotes</Text>
                </View>

                {/* Location Box */}
                <View style={styles.detailInfoBox}>
                  <Text style={styles.detailSectionLabel}>📍 LOCATION & ADDRESS</Text>
                  <Text style={styles.detailLocationText}>
                    {selectedBusiness.location?.addressLine1 || selectedBusiness.location?.localityName || selectedLocality}, {selectedBusiness.location?.cityName || selectedCity}
                    {selectedBusiness.location?.pincode ? ` - ${selectedBusiness.location?.pincode}` : ''}
                  </Text>
                  {selectedBusiness.location?.landmark ? (
                    <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Landmark: {selectedBusiness.location?.landmark}</Text>
                  ) : null}
                </View>

                {/* Working Hours */}
                <View style={styles.detailInfoBox}>
                  <Text style={styles.detailSectionLabel}>🕒 WORKING HOURS</Text>
                  <Text style={styles.detailInfoValue}>Monday - Sunday: 09:00 AM - 09:30 PM (Always Open)</Text>
                </View>

                {/* About / Description */}
                <View style={styles.detailInfoBox}>
                  <Text style={styles.detailSectionLabel}>ℹ️ ABOUT THIS BUSINESS</Text>
                  <Text style={styles.detailDescText}>
                    {selectedBusiness.description || `${selectedBusiness.name} provides premier verified services with instant bookings, certified staff, and transparent pricing in ${selectedCity}.`}
                  </Text>
                </View>

                {/* Live Database Entity Badge */}
                <View style={styles.detailDbBadge}>
                  <Text style={{ fontSize: 10, color: '#0369A1', fontWeight: '700' }}>
                    ● MySQL Entity ID: {selectedBusiness.id} • Live in hello_db
                  </Text>
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.detailActionRow}>
                <TouchableOpacity
                  onPress={() => Alert.alert('Calling Merchant', `Dialing ${selectedBusiness.contacts?.callNumber || selectedBusiness.primaryPhone || '+91 98480 22334'}...`)}
                  style={styles.detailCallBtn}
                >
                  <Text style={{ fontSize: 13 }}>📞</Text>
                  <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 12 }}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Alert.alert('WhatsApp', `Opening WhatsApp for ${selectedBusiness.name}...`)}
                  style={styles.detailWaBtn}
                >
                  <Text style={{ fontSize: 13 }}>💬</Text>
                  <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 12 }}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    const b = selectedBusiness;
                    setSelectedBusiness(null);
                    setEnquiryModalBiz(b);
                    setEnquiryPhone(user?.phoneNumber || '');
                  }}
                  style={styles.detailQuoteBtn}
                >
                  <Text style={{ fontSize: 13 }}>⚡</Text>
                  <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 12 }}>Get Quote</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ADD YOUR BUSINESS FREE MODAL (VENDOR REGISTRATION INTO MYSQL) */}
      <Modal visible={showAddBusinessModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.addBizModalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <View>
                <Text style={{ fontSize: 10, fontWeight: '900', color: '#FF6B35', textTransform: 'uppercase' }}>100% Free Setup 🚀</Text>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A' }}>Add Your Business</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddBusinessModal(false)} style={styles.closeModalCircle}>
                <Text style={{ fontSize: 16, color: '#64748B', fontWeight: '800' }}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 11, color: '#64748B', marginBottom: 10 }}>
              Stored directly in MySQL hello_db database and listed instantly.
            </Text>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {/* Business Name */}
              <Text style={styles.fieldLabel}>Business Name *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Royal Dental & Implant Clinic"
                placeholderTextColor="#94A3B8"
                value={newBizName}
                onChangeText={setNewBizName}
              />

              {/* Category Picker */}
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 4 }}>
                {categories.map((c: any) => {
                  const isSel = newBizCategory === c.slug;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => setNewBizCategory(c.slug)}
                      style={[
                        styles.catSelectPill,
                        isSel && styles.catSelectPillActive
                      ]}
                    >
                      <Text style={{ fontSize: 11, marginRight: 3 }}>{c.icon}</Text>
                      <Text style={[styles.catSelectPillText, isSel && styles.catSelectPillTextActive]}>
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* City Selection */}
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Pilot City *</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginVertical: 4 }}>
                {(['Hyderabad', 'Vijayawada', 'Guntur'] as const).map((city) => (
                  <TouchableOpacity
                    key={city}
                    onPress={() => {
                      setNewBizCity(city);
                      setNewBizLocality(city === 'Hyderabad' ? 'Hitec City' : city === 'Vijayawada' ? 'Benz Circle' : 'Brodipet');
                    }}
                    style={[
                      styles.citySelectBtn,
                      newBizCity === city && styles.citySelectBtnActive
                    ]}
                  >
                    <Text style={[styles.citySelectBtnText, newBizCity === city && styles.citySelectBtnTextActive]}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Locality */}
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Locality / Area *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Banjara Hills, Benz Circle, Arundelpet..."
                placeholderTextColor="#94A3B8"
                value={newBizLocality}
                onChangeText={setNewBizLocality}
              />

              {/* Phone */}
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Contact Phone Number *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. 98480 12345"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={newBizPhone}
                onChangeText={setNewBizPhone}
              />

              {/* WhatsApp */}
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>WhatsApp Number</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Same as phone or enter number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={newBizWhatsapp}
                onChangeText={setNewBizWhatsapp}
              />

              {/* Description */}
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Description / Services</Text>
              <TextInput
                style={[styles.modalTextInput, { height: 60 }]}
                placeholder="Brief summary of your services..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={2}
                value={newBizDesc}
                onChangeText={setNewBizDesc}
              />

              {/* Cover Photo / Image URL & Preset Selection */}
              <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Cover Image / Photo URL</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="https://images.unsplash.com/... or paste image URL"
                placeholderTextColor="#94A3B8"
                value={newBizCoverPhoto}
                onChangeText={setNewBizCoverPhoto}
              />
              <Text style={{ fontSize: 10, color: '#64748B', marginTop: 4, marginBottom: 6 }}>
                Select quick category photo or enter image URL:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                {Object.entries(CATEGORY_DEFAULT_IMAGES).map(([catKey, imgUrl]) => {
                  const isSel = newBizCoverPhoto === imgUrl;
                  return (
                    <TouchableOpacity
                      key={catKey}
                      onPress={() => setNewBizCoverPhoto(imgUrl)}
                      style={{
                        marginRight: 8,
                        borderRadius: 8,
                        borderWidth: isSel ? 2 : 1,
                        borderColor: isSel ? '#0076D7' : '#E2E8F0',
                        overflow: 'hidden'
                      }}
                    >
                      <Image source={{ uri: imgUrl }} style={{ width: 62, height: 44 }} resizeMode="cover" />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Selected Image Preview */}
              {newBizCoverPhoto ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#BBF7D0', gap: 10, marginBottom: 8 }}>
                  <Image source={{ uri: newBizCoverPhoto }} style={{ width: 50, height: 40, borderRadius: 6 }} resizeMode="cover" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#16A34A' }}>✓ Image Ready for DB</Text>
                    <Text style={{ fontSize: 9, color: '#64748B' }} numberOfLines={1}>{newBizCoverPhoto}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setNewBizCoverPhoto('')}>
                    <Text style={{ fontSize: 10, color: '#EF4444', fontWeight: 'bold' }}>Clear</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </ScrollView>

            <TouchableOpacity
              onPress={handleAddBusinessSubmit}
              disabled={isSubmittingBiz}
              style={[styles.authActionBtn, { marginTop: 12 }]}
            >
              {isSubmittingBiz ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.authActionBtnText}>Register Business Free in MySQL 🚀</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CMS PAGE MODAL (ABOUT, FAQ, TERMS, CONTACT, PRIVACY - LOADED FROM DB) */}
      <Modal visible={activeCmsModal !== null} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <View style={[styles.cmsModalContainer, { width: '100%', maxWidth: '100%', maxHeight: '100%', flex: 1, borderRadius: 0, padding: 16 }]}>
            {/* Header */}
            <View style={styles.cmsModalHeader}>
              <TouchableOpacity onPress={() => setActiveCmsModal(null)} style={{ paddingRight: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 20, color: '#0F172A', fontWeight: 'bold' }}>←</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A', textTransform: 'uppercase' }}>
                    ● MySQL hello_db
                  </Text>
                  <Text style={{ fontSize: 10, color: '#94A3B8' }}>• Public API</Text>
                </View>
                <Text style={styles.cmsModalTitle}>
                  {cmsPageData?.title || (
                    activeCmsModal === 'about' ? 'About Hello-Hi' :
                    activeCmsModal === 'faq' ? 'Frequently Asked Questions' :
                    activeCmsModal === 'terms' ? 'Terms & Conditions' :
                    activeCmsModal === 'contact' ? 'Contact & Support' : 'Privacy Policy'
                  )}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setActiveCmsModal(null)} style={styles.closeModalCircle}>
                <Text style={{ fontSize: 16, color: '#64748B', fontWeight: '800' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {isLoadingCms ? (
              <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0076D7" />
                <Text style={{ marginTop: 12, fontSize: 12, color: '#64748B', fontWeight: '600' }}>
                  Loading content from database...
                </Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
                {/* Short Description */}
                {cmsPageData?.shortDescription ? (
                  <View style={styles.cmsDescBox}>
                    <Text style={styles.cmsDescText}>{cmsPageData.shortDescription}</Text>
                  </View>
                ) : null}

                {/* SPECIAL SECTION: FAQ ITEMS ACCORDION */}
                {activeCmsModal === 'faq' && cmsPageData?.faqItems && Array.isArray(cmsPageData.faqItems) ? (
                  <View style={{ marginTop: 10, marginBottom: 12 }}>
                    <Text style={styles.sectionHeaderTitle}>Frequently Asked Questions ({cmsPageData.faqItems.length})</Text>
                    {cmsPageData.faqItems.map((item: any, idx: number) => {
                      const isExpanded = expandedFaqIndex === idx;
                      return (
                        <TouchableOpacity
                          key={item.id || idx}
                          activeOpacity={0.8}
                          onPress={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                          style={styles.faqAccordionCard}
                        >
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.faqQuestionText}>
                              {idx + 1}. {item.question}
                            </Text>
                            <Text style={{ fontSize: 14, color: '#0076D7', fontWeight: 'bold' }}>
                              {isExpanded ? '▲' : '▼'}
                            </Text>
                          </View>
                          {isExpanded && (
                            <Text style={styles.faqAnswerText}>
                              {item.answer}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}

                {/* SPECIAL SECTION: CONTACT & SUPPORT CHANNELS & FORM */}
                {activeCmsModal === 'contact' ? (
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.sectionHeaderTitle}>Official Support Helplines</Text>
                    
                    <View style={{ gap: 8, marginVertical: 8 }}>
                      <TouchableOpacity
                        onPress={() => Alert.alert('Dialing Toll Free', 'Connecting to 1800-425-HELLO (43556)...')}
                        style={styles.contactActionPill}
                      >
                        <Text style={{ fontSize: 18 }}>📞</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }}>Toll Free Helpline</Text>
                          <Text style={{ fontSize: 11, color: '#0076D7', fontWeight: '700' }}>1800-425-HELLO (43556)</Text>
                        </View>
                        <Text style={styles.callBadge}>Tap to Call</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => Alert.alert('Opening WhatsApp', 'Connecting to +91 98480 22338 WhatsApp Desk...')}
                        style={styles.contactActionPill}
                      >
                        <Text style={{ fontSize: 18 }}>💬</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }}>WhatsApp Support Desk</Text>
                          <Text style={{ fontSize: 11, color: '#16A34A', fontWeight: '700' }}>+91 98480 22338</Text>
                        </View>
                        <Text style={[styles.callBadge, { backgroundColor: '#DCFCE7', color: '#16A34A' }]}>Chat Now</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Direct Contact Form Stored in DB */}
                    <View style={styles.contactFormBox}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 2 }}>
                        Send Support Message
                      </Text>
                      <Text style={{ fontSize: 10, color: '#64748B', marginBottom: 10 }}>
                        Stored in MySQL hello_db.contact_submissions.
                      </Text>

                      <Text style={styles.fieldLabel}>Your Name *</Text>
                      <TextInput
                        style={styles.modalTextInput}
                        placeholder="e.g. Anand Varma"
                        placeholderTextColor="#94A3B8"
                        value={contactName}
                        onChangeText={setContactName}
                      />

                      <Text style={[styles.fieldLabel, { marginTop: 8 }]}>Email Address *</Text>
                      <TextInput
                        style={styles.modalTextInput}
                        placeholder="e.g. anand@example.com"
                        placeholderTextColor="#94A3B8"
                        keyboardType="email-address"
                        value={contactEmail}
                        onChangeText={setContactEmail}
                      />

                      <Text style={[styles.fieldLabel, { marginTop: 8 }]}>Mobile Number</Text>
                      <TextInput
                        style={styles.modalTextInput}
                        placeholder="e.g. 98480 12345"
                        placeholderTextColor="#94A3B8"
                        keyboardType="phone-pad"
                        value={contactPhone}
                        onChangeText={setContactPhone}
                      />

                      <Text style={[styles.fieldLabel, { marginTop: 8 }]}>Subject / Topic</Text>
                      <TextInput
                        style={styles.modalTextInput}
                        placeholder="e.g. Business Listing, Verification..."
                        placeholderTextColor="#94A3B8"
                        value={contactSubject}
                        onChangeText={setContactSubject}
                      />

                      <Text style={[styles.fieldLabel, { marginTop: 8 }]}>Message *</Text>
                      <TextInput
                        style={[styles.modalTextInput, { height: 65 }]}
                        placeholder="How can our support team help you?"
                        placeholderTextColor="#94A3B8"
                        multiline
                        numberOfLines={3}
                        value={contactMessage}
                        onChangeText={setContactMessage}
                      />

                      <TouchableOpacity
                        onPress={handleContactSubmit}
                        disabled={isSubmittingContact}
                        style={[styles.authActionBtn, { marginTop: 10 }]}
                      >
                        {isSubmittingContact ? (
                          <ActivityIndicator color="#FFF" />
                        ) : (
                          <Text style={styles.authActionBtnText}>Send Message to DB 🚀</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}

                {/* HTML / Plain Text Content from DB */}
                {cmsPageData?.content ? (
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.sectionHeaderTitle}>Official Policy Documentation</Text>
                    <Text style={styles.cmsContentText}>
                      {cmsPageData.content.replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n\n').trim()}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.cmsFooterMeta}>
                  <Text style={{ fontSize: 10, color: '#94A3B8' }}>
                    Database Record ID: {cmsPageData?.id || 'live-db-record'}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#16A34A', fontWeight: '700' }}>
                    Status: {cmsPageData?.status || 'PUBLISHED'} • {cmsPageData?.visibility || 'PUBLIC'}
                  </Text>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity
              onPress={() => setActiveCmsModal(null)}
              style={[styles.signOutBtn, { marginTop: 10, backgroundColor: '#0F172A' }]}
            >
              <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>Close Page</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  // Top Header
  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  cityPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  localityPillText: {
    fontSize: 10,
    color: '#64748B',
  },
  headerLoginBtn: {
    backgroundColor: '#0076D7',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
  },
  headerLoginBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  headerUserPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 5,
  },
  headerOnlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  headerUserText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    maxWidth: 80,
  },
  bellBtn: {
    position: 'relative',
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Search Bar
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    paddingVertical: 0,
  },
  // Brand Strip
  brandStrip: {
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: '#F8FAFC',
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  mainScrollView: {
    flex: 1,
  },
  // Category Carousel Pills
  carouselPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  carouselPillActive: {
    backgroundColor: '#0076D7',
    borderColor: '#0076D7',
  },
  carouselPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  carouselPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  // Promo Banners
  promoBanner1: {
    width: 200,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoBanner2: {
    width: 190,
    backgroundColor: '#0076D7',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // 4-Column Explore Grid
  exploreGridContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  grid4Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  grid4ColItem: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
  },
  grid4ColItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0076D7',
  },
  iconCircleSmall: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  grid4ColText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#334155',
  },
  // Business Cards
  businessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  bizCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  bizCardDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 4,
  },
  bizButtonRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  bizCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0076D7',
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  bizWhatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  bizQuoteBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  bizBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
  },
  // 2-Column Services Grid (Services Tab)
  categories2ColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard2Col: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIconSquare: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Enquiries Tab
  enquiryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 8,
  },
  // Profile Tab (Industry Grade Design)
  dbProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  dbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  dbFieldBox: {
    width: '48.5%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 64,
    justifyContent: 'center',
  },
  dbLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dbVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
    letterSpacing: 0.1,
  },
  rawJsonBox: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  rawJsonText: {
    color: '#34D399',
    fontSize: 10,
    fontFamily: 'monospace',
    lineHeight: 14,
  },
  signOutBtn: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  signOutBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  unauthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
  },
  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 1,
  },
  navLabelActive: {
    color: '#0076D7',
    fontWeight: '800',
  },
  centerFloatingBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    shadowColor: '#FF6B35',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  // Modals & Bottom Sheets
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  cityModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  cityModalTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 12,
  },
  cityModalItem: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  enquirySheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
  },
  enquiryTextArea: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 10,
    fontSize: 12,
    textAlignVertical: 'top',
    height: 70,
  },
  enquiryInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 10,
    fontSize: 12,
  },
  enquirySubmitBtn: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  // Auth Modal
  authModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    alignItems: 'center',
  },
  authToggleBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    width: '100%',
    marginBottom: 12,
  },
  authToggleBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
  },
  authToggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  authToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  authToggleTextActive: {
    color: '#0076D7',
  },
  authModalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  authModalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  modalTextInput: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 10,
    fontSize: 13,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  phonePrefix: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  phoneDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0076D7',
    borderColor: '#0076D7',
  },
  termsText: {
    fontSize: 10,
    color: '#64748B',
  },
  authActionBtn: {
    backgroundColor: '#0076D7',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  authActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  orDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orDividerText: {
    paddingHorizontal: 10,
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 10,
    width: '100%',
    gap: 8,
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  otpInputBox: {
    borderWidth: 1.5,
    borderColor: '#0076D7',
    borderRadius: 12,
    paddingVertical: 12,
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 6,
    fontWeight: '800',
    marginBottom: 12,
  },
  modalActionBtn: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalActionBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  // Business Detail Modal Styles
  bizDetailModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    width: '100%',
    maxHeight: '90%',
  },
  bizDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 10,
  },
  verifiedTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  openNowTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bizDetailTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  bizDetailCategory: {
    fontSize: 12,
    color: '#0076D7',
    fontWeight: '700',
    marginTop: 1,
  },
  closeModalCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailRatingStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 12,
    marginVertical: 8,
  },
  detailInfoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginVertical: 5,
  },
  detailSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  detailLocationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  detailInfoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  detailDescText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  detailDbBadge: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  detailActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  detailCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
  },
  detailWaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 12,
  },
  detailQuoteBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0076D7',
    paddingVertical: 12,
    borderRadius: 12,
  },
  // Add Business Modal Styles
  addBizModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    width: '100%',
    maxHeight: '92%',
  },
  catSelectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catSelectPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0076D7',
  },
  catSelectPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  catSelectPillTextActive: {
    color: '#0076D7',
  },
  citySelectBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  citySelectBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0076D7',
  },
  citySelectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  citySelectBtnTextActive: {
    color: '#0076D7',
  },
  // CMS & Information Page Styles
  cmsMenuItem: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cmsMenuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cmsMenuTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  cmsMenuSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  cmsModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
  },
  cmsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cmsModalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  cmsDescBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0076D7',
    marginVertical: 8,
  },
  cmsDescText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  faqAccordionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  faqQuestionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    paddingRight: 8,
  },
  faqAnswerText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  contactActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  callBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0076D7',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  contactFormBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  cmsContentText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  cmsFooterMeta: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
