import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, Calendar, Users, Package, DollarSign, Eye, CreditCard as Edit, Trash2 } from 'lucide-react-native';
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
        <Text style={[styles.errorText, { color: colors.text }]}>Plot not found</Text>
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
    { id: 'income', title: 'Income', icon: DollarSign },
    { id: 'expenses', title: 'Expenses', icon: DollarSign },
    { id: 'inventory', title: 'Inventory', icon: Package },
    { id: 'labor', title: 'Labor', icon: Users },
  ];

  const handleAddEntry = (type: string) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.overviewCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.overviewTitle, { color: colors.text }]}>Plot Information</Text>
        <View style={styles.overviewRow}>
          <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Crop:</Text>
          <Text style={[styles.overviewValue, { color: colors.text }]}>{plot.crop}</Text>
        </View>
        <View style={styles.overviewRow}>
          <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Size:</Text>
          <Text style={[styles.overviewValue, { color: colors.text }]}>{plot.size}</Text>
        </View>
        <View style={styles.overviewRow}>
          <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${colors.success}15` }]}>
            <Text style={[styles.statusText, { color: colors.success }]}>{plot.status}</Text>
          </View>
        </View>
        <View style={styles.overviewRow}>
          <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Sowing Date:</Text>
          <Text style={[styles.overviewValue, { color: colors.text }]}>{plot.sowingDate}</Text>
        </View>
        {plot.notes && (
          <View style={styles.overviewRow}>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Notes:</Text>
            <Text style={[styles.overviewValue, { color: colors.text }]}>{plot.notes}</Text>
          </View>
        )}
      </View>

      <View style={[styles.overviewCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.overviewTitle, { color: colors.text }]}>Financial Summary</Text>
        <View style={styles.financialStats}>
          <View style={styles.financialStat}>
            <Text style={[styles.financialStatValue, { color: colors.success }]}>{plot.income}</Text>
            <Text style={[styles.financialStatLabel, { color: colors.textSecondary }]}>Total Income</Text>
          </View>
          <View style={styles.financialStat}>
            <Text style={[styles.financialStatValue, { color: colors.error }]}>{plot.expense}</Text>
            <Text style={[styles.financialStatLabel, { color: colors.textSecondary }]}>Total Expenses</Text>
          </View>
          <View style={styles.financialStat}>
            <Text style={[styles.financialStatValue, { color: colors.info }]}>{plot.profit}</Text>
            <Text style={[styles.financialStatLabel, { color: colors.textSecondary }]}>Net Profit</Text>
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
        <Text style={styles.addButtonText}>Add Income</Text>
      </TouchableOpacity>
      
      {incomeEntries.map((entry) => (
        <View key={entry.id} style={[styles.entryCard, { backgroundColor: colors.surface }]}>
          <View style={styles.entryHeader}>
            <Text style={[styles.entryAmount, { color: colors.success }]}>+₹{entry.amount}</Text>
            <Text style={[styles.entryDate, { color: colors.textSecondary }]}>{entry.date}</Text>
          </View>
          <Text style={[styles.entryCategory, { color: colors.text }]}>{entry.category}</Text>
          <Text style={[styles.entryDescription, { color: colors.textSecondary }]}>{entry.description}</Text>
        </View>
      ))}
    </View>
  );

  const renderExpensesTab = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.error }]}
        onPress={() => handleAddEntry('expense')}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>
      
      {expenseEntries.map((entry) => (
        <View key={entry.id} style={[styles.entryCard, { backgroundColor: colors.surface }]}>
          <View style={styles.entryHeader}>
            <Text style={[styles.entryAmount, { color: colors.error }]}>-₹{entry.amount}</Text>
            <Text style={[styles.entryDate, { color: colors.textSecondary }]}>{entry.date}</Text>
          </View>
          <View style={styles.entryMeta}>
            <Text style={[styles.entryCategory, { color: colors.text }]}>{entry.category}</Text>
            <View style={[styles.typeBadge, { backgroundColor: `${colors.info}15` }]}>
              <Text style={[styles.typeText, { color: colors.info }]}>{entry.type}</Text>
            </View>
          </View>
          <Text style={[styles.entryDescription, { color: colors.textSecondary }]}>{entry.description}</Text>
        </View>
      ))}
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
      
      {inventoryItems.map((item) => (
        <View key={item.id} style={[styles.entryCard, { backgroundColor: colors.surface }]}>
          <View style={styles.entryHeader}>
            <Text style={[styles.entryCategory, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.entryDate, { color: colors.textSecondary }]}>{item.allocationDate}</Text>
          </View>
          <Text style={[styles.inventoryDetails, { color: colors.textSecondary }]}>
            {item.quantity} {item.unit} • ₹{item.cost}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderLaborTab = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.info }]}
        onPress={() => handleAddEntry('labor')}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Labor to Plot</Text>
      </TouchableOpacity>
      
      {laborAssignments.map((labor) => (
        <View key={labor.id} style={[styles.entryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.entryCategory, { color: colors.text }]}>{labor.name}</Text>
          <Text style={[styles.laborDetails, { color: colors.textSecondary }]}>
            ₹{labor.wage} / {labor.frequency} • {labor.daysWorked} days worked
          </Text>
          <Text style={[styles.entryAmount, { color: colors.success }]}>Total: ₹{labor.totalWage}</Text>
        </View>
      ))}
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{plot.name}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.tabsContainer, { backgroundColor: colors.surface }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && { borderBottomColor: colors.primary }
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} color={activeTab === tab.id ? colors.primary : colors.textSecondary} />
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
              Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
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
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="Enter description"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.background }]}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 32,
  },
  tabsContainer: {
    borderBottomWidth: 1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabContent: {
    paddingTop: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  overviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 14,
    width: 100,
  },
  overviewValue: {
    fontSize: 14,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  financialStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  financialStat: {
    alignItems: 'center',
  },
  financialStatValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  financialStatLabel: {
    fontSize: 12,
  },
  entryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  entryDate: {
    fontSize: 12,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  entryCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  entryDescription: {
    fontSize: 12,
  },
  inventoryDetails: {
    fontSize: 12,
    marginTop: 4,
  },
  laborDetails: {
    fontSize: 12,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
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
    maxHeight: '80%',
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
    fontWeight: '500',
  },
});