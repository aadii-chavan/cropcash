import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, Calendar, Users, Package, DollarSign, Eye, CreditCard as Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function PlotDetailsPage() {
  const { colors } = useTheme();
  const { id, plotData } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'income', 'expense', 'inventory', 'labor'

  // Parse plot data from params
  const plot = plotData ? JSON.parse(decodeURIComponent(plotData as string)) : null;

  if (!plot) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Plot not found</Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Sample data for different tabs
  const incomeEntries = [
    { id: 1, amount: 5000, date: '2024-01-15', category: 'Crop Sale', description: 'Wheat harvest sale' },
    { id: 2, amount: 3500, date: '2024-01-20', category: 'Subsidy', description: 'Government subsidy' },
    { id: 3, amount: 4000, date: '2024-01-25', category: 'Crop Sale', description: 'Additional wheat sale' },
  ];

  const expenseEntries = [
    { id: 1, amount: 2000, date: '2024-01-10', category: 'Seeds', description: 'Wheat seeds purchase', type: 'Manual' },
    { id: 2, amount: 1500, date: '2024-01-12', category: 'Fertilizer', description: 'Urea fertilizer', type: 'Inventory' },
    { id: 3, amount: 3000, date: '2024-01-15', category: 'Labor', description: 'Daily wages', type: 'Labor' },
  ];

  const inventoryItems = [
    { id: 1, name: 'Urea Fertilizer', quantity: 10, unit: 'kg', cost: 500, allocationDate: '2024-01-12' },
    { id: 2, name: 'Wheat Seeds', quantity: 25, unit: 'kg', cost: 1250, allocationDate: '2024-01-10' },
    { id: 3, name: 'Pesticide Spray', quantity: 2, unit: 'litre', cost: 400, allocationDate: '2024-01-18' },
  ];

  const laborAssignments = [
    { id: 1, name: 'Rajesh Kumar', wage: 300, frequency: 'Daily', daysWorked: 15, totalWage: 4500 },
    { id: 2, name: 'Priya Sharma', wage: 12000, frequency: 'Monthly', daysWorked: 30, totalWage: 12000 },
  ];

  const tabs = [
    { id: 'overview', title: 'Overview', icon: Eye },
    { id: 'income', title: 'Income', icon: TrendingUp },
    { id: 'expenses', title: 'Expenses', icon: TrendingDown },
    { id: 'inventory', title: 'Inventory', icon: Package },
    { id: 'labor', title: 'Labor', icon: Users },
  ];

  const handleAddEntry = (type: string) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Plot Summary Card */}
      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <View style={styles.summaryHeader}>
          <View>
            <Text style={[styles.plotTitle, { color: colors.text }]}>{plot.name}</Text>
            <Text style={[styles.plotSubtitle, { color: colors.textSecondary }]}>{plot.crop} • {plot.size}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${colors.success}15` }]}>
            <Text style={[styles.statusText, { color: colors.success }]}>{plot.status}</Text>
          </View>
        </View>
        
        <View style={styles.plotInfoGrid}>
          <View style={styles.plotInfoItem}>
            <Text style={[styles.plotInfoLabel, { color: colors.textSecondary }]}>Sowing Date</Text>
            <Text style={[styles.plotInfoValue, { color: colors.text }]}>{formatDate(plot.sowingDate)}</Text>
          </View>
          {plot.notes && (
            <View style={[styles.plotInfoItem, { gridColumn: 'span 2' }]}>
              <Text style={[styles.plotInfoLabel, { color: colors.textSecondary }]}>Notes</Text>
              <Text style={[styles.plotInfoValue, { color: colors.text }]}>{plot.notes}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Financial Overview */}
      <View style={[styles.financialOverview, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Financial Overview</Text>
        <View style={styles.financialGrid}>
          <View style={styles.financialCard}>
            <View style={[styles.financialIcon, { backgroundColor: `${colors.success}15` }]}>
              <TrendingUp size={24} color={colors.success} />
            </View>
            <Text style={[styles.financialLabel, { color: colors.textSecondary }]}>Total Income</Text>
            <Text style={[styles.financialValue, { color: colors.success }]}>{plot.income}</Text>
          </View>
          <View style={styles.financialCard}>
            <View style={[styles.financialIcon, { backgroundColor: `${colors.error}15` }]}>
              <TrendingDown size={24} color={colors.error} />
            </View>
            <Text style={[styles.financialLabel, { color: colors.textSecondary }]}>Total Expenses</Text>
            <Text style={[styles.financialValue, { color: colors.error }]}>{plot.expense}</Text>
          </View>
          <View style={styles.financialCard}>
            <View style={[styles.financialIcon, { backgroundColor: `${colors.info}15` }]}>
              <DollarSign size={24} color={colors.info} />
            </View>
            <Text style={[styles.financialLabel, { color: colors.textSecondary }]}>Net Profit</Text>
            <Text style={[styles.financialValue, { color: colors.info }]}>{plot.profit}</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={[styles.quickStats, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{incomeEntries.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Income Entries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{expenseEntries.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Expense Entries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{inventoryItems.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Inventory Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{laborAssignments.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Labor Assigned</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderIncomeTab = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.success }]}
        onPress={() => handleAddEntry('income')}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Income Entry</Text>
      </TouchableOpacity>
      
      <View style={styles.entriesContainer}>
        {incomeEntries.map((entry) => (
          <View key={entry.id} style={[styles.entryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.entryHeader}>
              <View style={styles.entryHeaderLeft}>
                <Text style={[styles.entryAmount, { color: colors.success }]}>+₹{entry.amount.toLocaleString()}</Text>
                <Text style={[styles.entryCategory, { color: colors.text }]}>{entry.category}</Text>
              </View>
              <Text style={[styles.entryDate, { color: colors.textSecondary }]}>{formatDate(entry.date)}</Text>
            </View>
            <Text style={[styles.entryDescription, { color: colors.textSecondary }]}>{entry.description}</Text>
            <View style={styles.entryActions}>
              <TouchableOpacity style={[styles.entryActionButton, { borderColor: colors.border }]}>
                <Edit size={14} color={colors.textSecondary} />
                <Text style={[styles.entryActionText, { color: colors.textSecondary }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.entryActionButton, { borderColor: colors.border }]}>
                <Trash2 size={14} color={colors.error} />
                <Text style={[styles.entryActionText, { color: colors.error }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderExpensesTab = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.error }]}
        onPress={() => handleAddEntry('expense')}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Expense Entry</Text>
      </TouchableOpacity>
      
      <View style={styles.entriesContainer}>
        {expenseEntries.map((entry) => (
          <View key={entry.id} style={[styles.entryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.entryHeader}>
              <View style={styles.entryHeaderLeft}>
                <Text style={[styles.entryAmount, { color: colors.error }]}>-₹{entry.amount.toLocaleString()}</Text>
                <View style={styles.entryMeta}>
                  <Text style={[styles.entryCategory, { color: colors.text }]}>{entry.category}</Text>
                  <View style={[styles.typeBadge, { backgroundColor: `${colors.info}15` }]}>
                    <Text style={[styles.typeText, { color: colors.info }]}>{entry.type}</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.entryDate, { color: colors.textSecondary }]}>{formatDate(entry.date)}</Text>
            </View>
            <Text style={[styles.entryDescription, { color: colors.textSecondary }]}>{entry.description}</Text>
            <View style={styles.entryActions}>
              <TouchableOpacity style={[styles.entryActionButton, { borderColor: colors.border }]}>
                <Edit size={14} color={colors.textSecondary} />
                <Text style={[styles.entryActionText, { color: colors.textSecondary }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.entryActionButton, { borderColor: colors.border }]}>
                <Trash2 size={14} color={colors.error} />
                <Text style={[styles.entryActionText, { color: colors.error }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderInventoryTab = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.warning }]}
        onPress={() => handleAddEntry('inventory')}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Allocate Inventory</Text>
      </TouchableOpacity>
      
      <View style={styles.entriesContainer}>
        {inventoryItems.map((item) => (
          <View key={item.id} style={[styles.entryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.entryHeader}>
              <View style={styles.entryHeaderLeft}>
                <Text style={[styles.entryCategory, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.inventoryDetails, { color: colors.textSecondary }]}>
                  {item.quantity} {item.unit} • ₹{item.cost.toLocaleString()}
                </Text>
              </View>
              <Text style={[styles.entryDate, { color: colors.textSecondary }]}>{formatDate(item.allocationDate)}</Text>
            </View>
            <View style={styles.entryActions}>
              <TouchableOpacity style={[styles.entryActionButton, { borderColor: colors.border }]}>
                <Edit size={14} color={colors.textSecondary} />
                <Text style={[styles.entryActionText, { color: colors.textSecondary }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.entryActionButton, { borderColor: colors.border }]}>
                <Trash2 size={14} color={colors.error} />
                <Text style={[styles.entryActionText, { color: colors.error }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderLaborTab = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.info }]}
        onPress={() => handleAddEntry('labor')}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Assign Labor</Text>
      </TouchableOpacity>
      
      <View style={styles.entriesContainer}>
        {laborAssignments.map((labor) => (
          <View key={labor.id} style={[styles.entryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.entryHeader}>
              <View style={styles.entryHeaderLeft}>
                <Text style={[styles.entryCategory, { color: colors.text }]}>{labor.name}</Text>
                <Text style={[styles.laborDetails, { color: colors.textSecondary }]}>
                  ₹{labor.wage} / {labor.frequency} • {labor.daysWorked} days worked
                </Text>
              </View>
              <Text style={[styles.entryAmount, { color: colors.success }]}>₹{labor.totalWage.toLocaleString()}</Text>
            </View>
            <View style={styles.entryActions}>
              <TouchableOpacity style={[styles.entryActionButton, { borderColor: colors.border }]}>
                <Edit size={14} color={colors.textSecondary} />
                <Text style={[styles.entryActionText, { color: colors.textSecondary }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.entryActionButton, { borderColor: colors.border }]}>
                <Trash2 size={14} color={colors.error} />
                <Text style={[styles.entryActionText, { color: colors.error }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'income': return renderIncomeTab();
      case 'expenses': return renderExpensesTab();
      case 'inventory': return renderInventoryTab();
      case 'labor': return renderLaborTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{plot.name}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{plot.crop} • {plot.size}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={[styles.tabsContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && { borderBottomColor: colors.primary }
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} color={activeTab === tab.id ? colors.primary : colors.textSecondary} />
            <Text style={[
              styles.tabText,
              { color: activeTab === tab.id ? colors.primary : colors.textSecondary }
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add Entry Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)} Entry
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Amount</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="Enter amount"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="Enter description"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.saveButtonText}>Add Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerBackButton: {
    padding: 4,
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  headerRight: {
    width: 40,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    maxHeight: 60,
  },
  tabsContent: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    minWidth: 100,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  plotTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  plotSubtitle: {
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  plotInfoGrid: {
    gap: 12,
  },
  plotInfoItem: {
    marginBottom: 8,
  },
  plotInfoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  plotInfoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  financialOverview: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  financialGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  financialCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  financialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  financialLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  quickStats: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  entriesContainer: {
    gap: 12,
  },
  entryCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  entryHeaderLeft: {
    flex: 1,
  },
  entryAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  entryCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  entryDate: {
    fontSize: 12,
  },
  entryDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  entryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  entryActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inventoryDetails: {
    fontSize: 14,
    marginTop: 2,
  },
  laborDetails: {
    fontSize: 14,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});