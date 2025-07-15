import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, ChevronDown, Settings, Coins, CreditCard, TrendingUp, Wheat, Package, Users, Plus, Eye, TriangleAlert as AlertTriangle, CloudRain, Clock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomePage() {
  const { colors } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const languages = ['English', 'Hindi', 'Marathi'];

  const summaryCards = [
    { icon: Coins, title: 'Total Income', value: '₹45,250', color: '#7AC74F' },
    { icon: CreditCard, title: 'Total Expenses', value: '₹32,100', color: '#EF4444' },
    { icon: TrendingUp, title: 'Net Profit', value: '₹13,150', color: '#3B82F6' },
    { icon: Wheat, title: 'Active Plots', value: '4', color: '#F59E0B' },
    { icon: Package, title: 'Inventory Items', value: '12', color: '#8B5CF6' },
    { icon: Users, title: 'Active Laborers', value: '6', color: '#EC4899' },
  ];

  const alerts = [
    { icon: AlertTriangle, title: 'Low Stock Alert', message: 'Fertilizer running low', type: 'warning' },
    { icon: CloudRain, title: 'Weather Update', message: 'Heavy rain expected tomorrow', type: 'info' },
    { icon: Clock, title: 'Wage Reminder', message: 'Monthly wages due in 2 days', type: 'reminder' },
  ];

  const activePlots = [
    { id: 1, name: 'North Field', crop: 'Wheat', size: '2.5 acres', income: '₹12,500', expense: '₹8,200', profit: '₹4,300', status: 'Active', sowingDate: '2024-01-15', notes: 'High yield variety planted' },
    { id: 2, name: 'South Field', crop: 'Rice', size: '3.0 acres', income: '₹18,750', expense: '₹12,100', profit: '₹6,650', status: 'Active', sowingDate: '2024-01-20', notes: 'Organic farming method' },
    { id: 3, name: 'East Field', crop: 'Tomato', size: '1.5 acres', income: '₹14,000', expense: '₹11,800', profit: '₹2,200', status: 'Active', sowingDate: '2024-02-01', notes: 'Greenhouse cultivation' },
  ];

  const quickActions = [
    { icon: Plus, title: 'Add Plot', color: '#7AC74F' },
    { icon: CreditCard, title: 'Add Expense', color: '#EF4444' },
    { icon: Package, title: 'Allocate Inventory', color: '#8B5CF6' },
    { icon: Users, title: 'Add Labor', color: '#EC4899' },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return '#F59E0B';
      case 'info': return '#3B82F6';
      case 'reminder': return '#EC4899';
      default: return '#4B5563';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.text }]}>Hi, Ramesh</Text>
            <TouchableOpacity 
              style={styles.languageSelector}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={[styles.languageText, { color: colors.textSecondary }]}>{selectedLanguage}</Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.profileIcon}>
            <Settings size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScrollView}>
            {summaryCards.map((card, index) => (
              <View key={index} style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.cardIcon, { backgroundColor: `${card.color}15` }]}>
                  <card.icon size={24} color={card.color} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>{card.title}</Text>
                <Text style={[styles.cardValue, { color: colors.text }]}>{card.value}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Alerts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Alerts</Text>
          {alerts.map((alert, index) => (
            <View key={index} style={[styles.alertCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.alertIcon, { backgroundColor: `${getAlertColor(alert.type)}15` }]}>
                <alert.icon size={20} color={getAlertColor(alert.type)} />
              </View>
              <View style={styles.alertContent}>
                <Text style={[styles.alertTitle, { color: colors.text }]}>{alert.title}</Text>
                <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>{alert.message}</Text>
              </View>
              <TouchableOpacity style={styles.alertAction}>
                <Text style={[styles.alertActionText, { color: colors.textSecondary }]}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Active Plots */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Most Active Plots</Text>
          {activePlots.map((plot) => (
            <View key={plot.id} style={[styles.plotCard, { backgroundColor: colors.surface }]}>
              <View style={styles.plotHeader}>
                <Text style={[styles.plotName, { color: colors.text }]}>{plot.name}</Text>
                <Text style={[styles.plotCrop, { color: colors.primary, backgroundColor: `${colors.primary}15` }]}>{plot.crop}</Text>
              </View>
              <View style={styles.plotStats}>
                <View style={styles.plotStat}>
                  <Text style={[styles.plotStatLabel, { color: colors.textSecondary }]}>Income</Text>
                  <Text style={[styles.plotStatValue, { color: colors.success }]}>{plot.income}</Text>
                </View>
                <View style={styles.plotStat}>
                  <Text style={[styles.plotStatLabel, { color: colors.textSecondary }]}>Expense</Text>
                  <Text style={[styles.plotStatValue, { color: colors.error }]}>{plot.expense}</Text>
                </View>
                <View style={styles.plotStat}>
                  <Text style={[styles.plotStatLabel, { color: colors.textSecondary }]}>Profit</Text>
                  <Text style={[styles.plotStatValue, { color: colors.info }]}>{plot.profit}</Text>
                </View>
              </View>
              <View style={styles.plotActions}>
                <TouchableOpacity style={[styles.plotActionButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Plus size={16} color={colors.success} />
                  <Text style={[styles.plotActionText, { color: colors.textSecondary }]}>Add Entry</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.plotActionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={() => router.push(`/plot-details/${plot.id}?plotData=${encodeURIComponent(JSON.stringify(plot))}`)}
                >
                  <Eye size={16} color={colors.textSecondary} />
                  <Text style={[styles.plotActionText, { color: colors.textSecondary }]}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={[styles.quickActionCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Bottom padding for safe area */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowLanguageModal(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Language</Text>
            {languages.map((language) => (
              <TouchableOpacity
                key={language}
                style={[
                  styles.languageOption,
                  selectedLanguage === language && { backgroundColor: `${colors.primary}15` }
                ]}
                onPress={() => {
                  setSelectedLanguage(language);
                  setShowLanguageModal(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  { color: selectedLanguage === language ? colors.primary : colors.textSecondary },
                  selectedLanguage === language && { fontWeight: '600' }
                ]}>
                  {language}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  languageText: {
    fontSize: 14,
  },
  profileIcon: {
    padding: 8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  cardScrollView: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  alertCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 12,
  },
  alertAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  alertActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  plotCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  plotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  plotName: {
    fontSize: 16,
    fontWeight: '600',
  },
  plotCrop: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  plotStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  plotStat: {
    alignItems: 'center',
  },
  plotStatLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  plotStatValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  plotActions: {
    flexDirection: 'row',
    gap: 12,
  },
  plotActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  plotActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    padding: 16,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  languageOptionText: {
    fontSize: 16,
  },
});