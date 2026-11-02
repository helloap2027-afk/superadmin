import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { colors } from '@hello/design-tokens';
import { APP_CONFIG } from '@hello/config';

export default function App() {
  const [mode, setMode] = useState<'customer' | 'vendor'>('customer');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brand.dark} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandPrimary}>HE</Text>
          <Text style={styles.brandAccent}>LLO</Text>
        </View>
        <Text style={styles.tagline}>{APP_CONFIG.tagline}</Text>
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
        {mode === 'customer' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Discover Nearby Businesses</Text>
            <Text style={styles.cardSubtitle}>Pilot Cities: {APP_CONFIG.pilotCities.join(', ')}</Text>
            <Text style={styles.cardDescription}>
              Instant contact via Call and WhatsApp with verified local businesses.
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vendor Business Workspace</Text>
            <Text style={styles.cardSubtitle}>Manage Enquiries & Locations</Text>
            <Text style={styles.cardDescription}>
              Track real-time customer leads and manage your verified business presence.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand.bgBase,
  },
  header: {
    backgroundColor: colors.brand.dark,
    paddingVertical: 18,
    alignItems: 'center',
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
  modeSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    margin: 16,
    borderRadius: 9999,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9999,
  },
  modeButtonActive: {
    backgroundColor: colors.brand.primary,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.brand.dark,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.brand.primary,
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    lineHeight: 20,
  },
});

