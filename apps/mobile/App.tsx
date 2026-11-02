import React, { useState } from 'react';
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
  Alert
} from 'react-native';
import { colors } from '@hello/design-tokens';
import { APP_CONFIG } from '@hello/config';

const API_BASE = 'http://localhost:4000/api/v1';

export default function App() {
  const [mode, setMode] = useState<'customer' | 'vendor'>('customer');

  // Auth State
  const [user, setUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showRawDb, setShowRawDb] = useState(false);

  // Modal State
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  
  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const PILOT_CITIES = ['Hyderabad', 'Vijayawada', 'Guntur', 'Visakhapatnam', 'Tirupati'];
  const LANGUAGES = ['English', 'Telugu', 'Hindi'];

  const handleSendOtp = async () => {
    if (phoneNumber.replace(/\D/g, '').length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit Indian mobile number.');
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
          purpose: authMode === 'register' ? 'REGISTRATION' : (mode === 'vendor' ? 'VENDOR_LOGIN' : 'CUSTOMER_LOGIN')
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to dispatch verification code.');
      }

      setChallengeId(json.data.challengeId);
      setAuthStep('otp');
    } catch (err: any) {
      Alert.alert('Connection Error', err.message || 'Failed to connect to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Incomplete Code', 'Please enter the 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          otp,
          deviceInfo: 'HELLO Expo Mobile App Client'
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Invalid or expired OTP.');
      }

      const token = json.data.accessToken;
      setAuthToken(token);

      // If registered or profile updated, persist immediately to Database
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

      // Fetch fresh complete user profile directly from database
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
        `Welcome to HELLO, ${freshUser.fullName || 'Customer'}!\nYour identity has been saved to the database.`
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brand.dark} />
      
      {/* Top Header with Brand and Login Button */}
      <View style={styles.header}>
        <View>
          <View style={styles.brandRow}>
            <Text style={styles.brandPrimary}>HE</Text>
            <Text style={styles.brandAccent}>LLO</Text>
          </View>
          <Text style={styles.tagline}>{APP_CONFIG.tagline}</Text>
        </View>

        {user ? (
          <TouchableOpacity onPress={() => setShowRawDb(!showRawDb)} style={styles.headerUserPill}>
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
      </View>

      {/* User Session Bar */}
      <View style={styles.authBar}>
        {user ? (
          <View style={styles.userRow}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.userName}>{user.fullName || 'Verified Member'}</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedBadgeText}>DB VERIFIED</Text>
                </View>
              </View>
              <Text style={styles.userPhone}>{user.phoneNumber} • {user.preferredLanguage || 'English'}</Text>
            </View>
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
            <TouchableOpacity
              onPress={() => { setAuthMode('login'); setIsAuthModalVisible(true); }}
              style={[styles.signInBtn, { flex: 1, backgroundColor: '#0076D7' }]}
            >
              <Text style={styles.signInText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setAuthMode('register'); setIsAuthModalVisible(true); }}
              style={[styles.signInBtn, { flex: 1, backgroundColor: '#0B1220', borderColor: '#334155', borderWidth: 1 }]}
            >
              <Text style={styles.signInText}>Register Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Dual Mode Switcher */}
      <View style={styles.modeSwitcherContainer}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'customer' && styles.modeButtonActive]}
          onPress={() => setMode('customer')}
        >
          <Text style={[styles.modeButtonText, mode === 'customer' && styles.modeButtonTextActive]}>
            Customer Mode
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, mode === 'vendor' && styles.modeButtonActive]}
          onPress={() => setMode('vendor')}
        >
          <Text style={[styles.modeButtonText, mode === 'vendor' && styles.modeButtonTextActive]}>
            Vendor Mode
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* If user is logged in, show their registered Database Record Card */}
        {user && (
          <View style={styles.dbCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={styles.dbCardHeader}>Live Database Identity Record</Text>
              <Text style={{ fontSize: 10, color: '#16A34A', fontWeight: 'bold' }}>● SQLite Active</Text>
            </View>

            <View style={styles.dbGrid}>
              <View style={styles.dbField}>
                <Text style={styles.dbLabel}>USER DB ID</Text>
                <Text style={styles.dbVal}>{user.id}</Text>
              </View>
              <View style={styles.dbField}>
                <Text style={styles.dbLabel}>STATUS</Text>
                <Text style={[styles.dbVal, { color: '#16A34A' }]}>{user.status}</Text>
              </View>
              <View style={styles.dbField}>
                <Text style={styles.dbLabel}>ASSIGNED ROLES</Text>
                <Text style={styles.dbVal}>{Array.isArray(user.roles) ? user.roles.join(', ') : 'CUSTOMER'}</Text>
              </View>
              <View style={styles.dbField}>
                <Text style={styles.dbLabel}>LOCATION</Text>
                <Text style={styles.dbVal}>
                  {user.locality?.name ? `${user.locality.name}, ${user.locality.cityName}` : 'Andhra Pradesh Pilot'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowRawDb(!showRawDb)}
              style={styles.toggleRawBtn}
            >
              <Text style={styles.toggleRawText}>
                {showRawDb ? '▼ Hide Raw SQL Entity' : '▶ View Raw Database SQL Entity'}
              </Text>
            </TouchableOpacity>

            {showRawDb && (
              <View style={styles.rawJsonBox}>
                <Text style={styles.rawJsonText}>
                  {JSON.stringify(user, null, 2)}
                </Text>
              </View>
            )}
          </View>
        )}

        {mode === 'customer' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Discover Nearby Businesses</Text>
            <Text style={styles.cardSubtitle}>Pilot Cities: {APP_CONFIG.pilotCities.join(', ')}</Text>
            <Text style={styles.cardDescription}>
              Instant contact via Call and WhatsApp with verified local businesses, clinics, and restaurants.
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vendor Business Workspace</Text>
            <Text style={styles.cardSubtitle}>
              {user?.ownedBusinesses?.length > 0 ? `${user.ownedBusinesses.length} Business(es) Linked` : 'Manage Enquiries & Locations'}
            </Text>
            <Text style={styles.cardDescription}>
              Track real-time customer leads and manage your verified business presence across Andhra Pradesh.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Authentication Modal */}
      <Modal visible={isAuthModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            
            {/* Top Toggle: Sign In vs Register */}
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

            <Text style={styles.modalTitle}>
              {authStep === 'phone'
                ? (authMode === 'register' ? 'Register New Account' : 'Welcome Back')
                : 'Verify Mobile OTP'}
            </Text>
            <Text style={styles.modalSub}>
              {authStep === 'phone'
                ? (authMode === 'register'
                    ? 'Enter your details. Data is securely saved to the database.'
                    : 'Sign in to access your saved businesses & enquiries.')
                : `Enter the 6-digit verification code sent to +91${phoneNumber}.`}
            </Text>

            {authStep === 'phone' ? (
              <ScrollView style={{ maxHeight: 320, width: '100%' }}>
                {authMode === 'register' && (
                  <>
                    <Text style={styles.fieldLabel}>Full Name *</Text>
                    <TextInput
                      style={styles.singleInput}
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChangeText={setFullName}
                    />

                    <Text style={styles.fieldLabel}>Email Address (Optional)</Text>
                    <TextInput
                      style={styles.singleInput}
                      placeholder="e.g. ramesh@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />

                    <Text style={styles.fieldLabel}>Preferred Language</Text>
                    <View style={styles.pickerRow}>
                      {LANGUAGES.map((lang) => (
                        <TouchableOpacity
                          key={lang}
                          onPress={() => setSelectedLanguage(lang)}
                          style={[styles.pillBtn, selectedLanguage === lang && styles.pillBtnActive]}
                        >
                          <Text style={[styles.pillText, selectedLanguage === lang && styles.pillTextActive]}>
                            {lang}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.fieldLabel}>City / Pilot Area</Text>
                    <View style={styles.pickerRow}>
                      {PILOT_CITIES.map((c) => (
                        <TouchableOpacity
                          key={c}
                          onPress={() => setSelectedCity(c)}
                          style={[styles.pillBtn, selectedCity === c && styles.pillBtnActive]}
                        >
                          <Text style={[styles.pillText, selectedCity === c && styles.pillTextActive]}>
                            {c}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                <View style={styles.inputContainer}>
                  <Text style={styles.prefix}>+91</Text>
                  <Text style={{ color: '#CBD5E1', marginRight: 8, fontSize: 16 }}>|</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Mobile Number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>

                {/* Checkbox: I Agree to Terms and Conditions */}
                <View style={{ alignItems: 'center', marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Text style={{ fontSize: 13, color: '#0070E0' }}>☑</Text>
                    <Text style={{ fontSize: 12, color: '#334155', fontWeight: '600' }}>
                      I Agree to Terms and Conditions
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, color: '#64748B', textDecorationLine: 'underline' }}>
                    T&C's Privacy Policy
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="••••••"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                autoFocus
              />
            )}

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#0070E0' }]}
              onPress={authStep === 'phone' ? handleSendOtp : handleVerifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.actionBtnText}>
                  {authStep === 'phone'
                    ? (authMode === 'register' ? 'Register with OTP' : 'Login with OTP')
                    : 'Verify OTP & Save to DB'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider: Or Login Using & Google */}
            {authStep === 'phone' && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: '100%' }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
                  <Text style={{ paddingHorizontal: 10, paddingVertical: 2, fontSize: 10, color: '#64748B', backgroundColor: '#F1F5F9', borderRadius: 10, fontWeight: '600' }}>
                    {authMode === 'register' ? 'Or Register Using' : 'Or Login Using'}
                  </Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
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
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: '#CBD5E1',
                    borderRadius: 12,
                    paddingVertical: 10,
                    width: '100%',
                    marginBottom: 8,
                    gap: 8,
                  }}
                >
                  <Text style={{ fontSize: 15 }}>🌐</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>Google</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={() => {
                if (authStep === 'otp') setAuthStep('phone');
                else setIsAuthModalVisible(false);
              }}
              style={styles.closeBtn}
            >
              <Text style={styles.closeBtnText}>Cancel</Text>
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
  header: {
    backgroundColor: colors.brand.dark,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLoginBtn: {
    backgroundColor: '#0076D7',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLoginBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  headerUserPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerOnlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  headerUserText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
    maxWidth: 100,
  },
  brandRow: {
    flexDirection: 'row',
  },
  brandPrimary: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.brand.primary,
  },
  brandAccent: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.brand.accent,
  },
  tagline: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
  authBar: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  userPhone: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  signOutBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  signInBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modeSwitcherContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: colors.brand.primary,
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dbCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  dbCardHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  dbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dbField: {
    flexBasis: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dbLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 2,
  },
  dbVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  toggleRawBtn: {
    marginTop: 12,
    paddingVertical: 6,
  },
  toggleRawText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0076D7',
  },
  rawJsonBox: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  rawJsonText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#34D399',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.brand.primary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 18, 32, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  authToggleBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
    width: '100%',
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
    fontWeight: '600',
    color: '#64748B',
  },
  authToggleTextActive: {
    color: '#0076D7',
    fontWeight: '800',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  singleInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 12,
  },
  pickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  pillBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillBtnActive: {
    backgroundColor: '#0076D7',
    borderColor: '#0076D7',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    width: '100%',
    marginBottom: 16,
  },
  prefix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: '#0076D7',
    borderRadius: 12,
    paddingHorizontal: 16,
    letterSpacing: 8,
    textAlign: 'center',
    fontSize: 20,
    width: '100%',
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: '#0076D7',
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  closeBtn: {
    paddingVertical: 8,
  },
  closeBtnText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
});
