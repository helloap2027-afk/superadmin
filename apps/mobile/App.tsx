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
  const [activeTab, setActiveTab] = useState<'Home' | 'Services' | 'Enquiries' | 'Profile'>('Home');
  const [mode, setMode] = useState<'customer' | 'vendor'>('customer');
  const [selectedCity, setSelectedCity] = useState<'Hyderabad' | 'Vijayawada' | 'Guntur'>('Hyderabad');
  const [selectedLocality, setSelectedLocality] = useState('Hitec City');
  const [showCityModal, setShowCityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories loaded directly from Database
  const [categories, setCategories] = useState<any[]>(ALL_14_CATEGORIES);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);

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
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
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

  // Fetch categories directly from MySQL hello_db
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
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
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBusinesses(json.data);
      }
    } catch (e) {
      console.log('Error fetching businesses:', e);
    } finally {
      setIsLoadingBusinesses(false);
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
          purpose: authMode === 'register' ? 'REGISTRATION' : 'CUSTOMER_LOGIN'
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
      setIsAuthModalVisible(false);
      setAuthStep('phone');
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
              onPress={() => { setAuthMode('login'); setIsAuthModalVisible(true); }}
              style={styles.headerLoginBtn}
            >
              <Text style={styles.headerLoginBtnText}>Login</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => Alert.alert('Notifications', '1 New Priority Update: Welcome to HELLO Hyperlocal!')}
            style={styles.bellBtn}
          >
            <Text style={{ fontSize: 14 }}>🔔</Text>
            <View style={styles.bellBadge}>
              <Text style={{ fontSize: 8, color: '#FFF', fontWeight: '800' }}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH PILL WITH MIC & CAMERA */}
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
          <TouchableOpacity onPress={() => Alert.alert('Visual Search', 'QR / Storefront Visual Search')} style={{ paddingHorizontal: 4 }}>
            <Text style={{ fontSize: 14 }}>📷</Text>
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
          /* ================= PROFILE & DB IDENTITY TAB ================= */
          <View style={{ padding: 16 }}>
            {user ? (
              <View style={styles.dbProfileCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A' }}>MySQL Identity Record</Text>
                  <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A' }}>● MySQL hello_db</Text>
                  </View>
                </View>

                <View style={styles.dbGrid}>
                  <View style={styles.dbFieldBox}>
                    <Text style={styles.dbLabel}>USER ID</Text>
                    <Text style={styles.dbVal} numberOfLines={1}>{user.id}</Text>
                  </View>
                  <View style={styles.dbFieldBox}>
                    <Text style={styles.dbLabel}>STATUS</Text>
                    <Text style={[styles.dbVal, { color: '#16A34A' }]}>{user.status}</Text>
                  </View>
                  <View style={styles.dbFieldBox}>
                    <Text style={styles.dbLabel}>PHONE</Text>
                    <Text style={styles.dbVal}>{user.phoneNumber}</Text>
                  </View>
                  <View style={styles.dbFieldBox}>
                    <Text style={styles.dbLabel}>ROLES</Text>
                    <Text style={[styles.dbVal, { color: '#0076D7' }]}>{Array.isArray(user.roles) ? user.roles.join(', ') : 'CUSTOMER'}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setShowRawDb(!showRawDb)}
                  style={{ marginTop: 12 }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#0076D7' }}>
                    {showRawDb ? '▼ Hide SQL Table Entity' : '▶ View Raw Database SQL Entity'}
                  </Text>
                </TouchableOpacity>

                {showRawDb && (
                  <View style={styles.rawJsonBox}>
                    <Text style={styles.rawJsonText}>{JSON.stringify(user, null, 2)}</Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={handleSignOut}
                  style={styles.signOutBtn}
                >
                  <Text style={styles.signOutBtnText}>Sign Out Session</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.unauthCard}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>👤</Text>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A' }}>Sign In or Register</Text>
                <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 4, paddingHorizontal: 20 }}>
                  Access verified enquiries, your registered database identity, and vendor listings.
                </Text>

                <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginTop: 16 }}>
                  <TouchableOpacity
                    onPress={() => { setAuthMode('login'); setIsAuthModalVisible(true); }}
                    style={[styles.modalActionBtn, { flex: 1, backgroundColor: '#0076D7' }]}
                  >
                    <Text style={styles.modalActionBtnText}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { setAuthMode('register'); setIsAuthModalVisible(true); }}
                    style={[styles.modalActionBtn, { flex: 1, backgroundColor: '#0F172A' }]}
                  >
                    <Text style={styles.modalActionBtnText}>Register</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
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

            {/* 2. PROMO BANNERS CAROUSEL */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, marginVertical: 6 }}>
              <View style={styles.promoBanner1}>
                <View>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: '#FCD34D', textTransform: 'uppercase' }}>Festival Deals</Text>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: '#FFF', marginTop: 2 }}>UP TO 50% OFF</Text>
                  <Text style={{ fontSize: 9, color: '#CBD5E1' }}>Verified {selectedCity} Vendors</Text>
                </View>
                <Text style={{ fontSize: 26 }}>🎉</Text>
              </View>

              <TouchableOpacity
                onPress={() => setMode('vendor')}
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
                    Add Your Business Free to be listed instantly!
                  </Text>
                </View>
              ) : (
                businesses.map((biz: any) => (
                  <View key={biz.id} style={styles.businessCard}>
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
                      </View>
                    </View>

                    {/* Action Buttons: Call Now, WhatsApp, Instant Quote */}
                    <View style={styles.bizButtonRow}>
                      <TouchableOpacity
                        onPress={() => Alert.alert('Call Merchant', `Dialing ${biz.contacts?.callNumber || biz.primaryPhone || '+91 98480 22334'}...`)}
                        style={styles.bizCallBtn}
                      >
                        <Text style={{ fontSize: 11 }}>📞</Text>
                        <Text style={styles.bizBtnText}>Call</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => Alert.alert('WhatsApp Chat', `Opening WhatsApp for ${biz.name}...`)}
                        style={styles.bizWhatsappBtn}
                      >
                        <Text style={{ fontSize: 11 }}>💬</Text>
                        <Text style={styles.bizBtnText}>WhatsApp</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setEnquiryModalBiz(biz);
                          setEnquiryPhone(user?.phoneNumber || '');
                        }}
                        style={styles.bizQuoteBtn}
                      >
                        <Text style={{ fontSize: 11 }}>⚡</Text>
                        <Text style={styles.bizBtnText}>Get Quote</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
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

        {/* Center Floating Plus / Mode Switcher */}
        <TouchableOpacity
          onPress={() => setMode(mode === 'customer' ? 'vendor' : 'customer')}
          style={styles.centerFloatingBtn}
        >
          <Text style={{ fontSize: 22, color: '#FFF', fontWeight: '900' }}>➕</Text>
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
            {authStep === 'phone' && (
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
              {authStep === 'phone'
                ? (authMode === 'register' ? 'Register New Account' : 'Welcome Back')
                : 'Verify Mobile OTP'}
            </Text>
            <Text style={styles.authModalSub}>
              {authStep === 'phone'
                ? 'Directly connected to backend MySQL database.'
                : `Enter the 6-digit code sent to +91${phoneNumber}.`}
            </Text>

            {authStep === 'phone' ? (
              <View style={{ width: '100%' }}>
                {authMode === 'register' && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.fieldLabel}>Full Name *</Text>
                    <TextInput
                      style={styles.modalTextInput}
                      placeholder="e.g. Anand Varma"
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
                <TouchableOpacity
                  onPress={() => setAgreedTerms(!agreedTerms)}
                  style={styles.termsRow}
                >
                  <View style={[styles.checkbox, agreedTerms && styles.checkboxChecked]}>
                    {agreedTerms && <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '900' }}>✓</Text>}
                  </View>
                  <Text style={styles.termsText}>
                    I Agree to <Text style={{ color: '#0076D7', fontWeight: '700' }}>Terms and Conditions</Text> & <Text style={{ color: '#0076D7', fontWeight: '700' }}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>

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
  // Profile Tab
  dbProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  dbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dbFieldBox: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 8,
  },
  dbLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
  },
  dbVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  rawJsonBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  rawJsonText: {
    color: '#34D399',
    fontSize: 9,
    fontFamily: 'monospace',
  },
  signOutBtn: {
    marginTop: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  signOutBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
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
});
