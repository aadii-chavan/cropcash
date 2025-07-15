import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Eye, CreditCard as Edit, Calendar, ChevronDown } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function PlotsPage() {
  const { colors } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [plotName, setPlotName] = useState('');
  const [plotSize, setPlotSize] = useState('');
  const [cropType, setCropType] = useState('');
  const [sowingDate, setSowingDate] = useState('Select date');
  const [notes, setNotes] = useState('');
  const [plots, setPlots] = useState([
    {
      id: 1,
      name: 'North Field',
      crop: 'Wheat',
      size: '2.5 acres',
      sowingDate: '2024-01-15',
      status: 'Active',
      income: '₹12,500',
      expense: '₹8,200',
      profit: '₹4,300',
      notes: 'High yield variety planted'
    },
    {
      id: 2,
      name: 'South Field',
      crop: 'Rice',
      size: '3.0 acres',
      sowingDate: '2024-01-20',
      status: 'Active',
      income: '₹18,750',
      expense: '₹12,100',
      profit: '₹6,650',
      notes: 'Organic farming method'
    },
    {
      id: 3,
      name: 'East Field',
      crop: 'Tomato',
      size: '1.5 acres',
      sowingDate: '2024-02-01',
      status: 'Active',
      income: '₹14,000',
      expense: '₹11,800',
      profit: '₹2,200',
      notes: 'Greenhouse cultivation'
    },
  ]);


  const harvestedPlots = [
    {
      id: 4,
      name: 'West Field',
      crop: 'Corn',
      size: '2.0 acres',
      sowingDate: '2023-10-15',
      status: 'Harvested',
      income: '₹22,000',
      expense: '₹15,000',
      profit: '₹7,000'
    },
  ];

  const activePlots = plots.filter(plot => plot.status === 'Active');

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = -30; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleAddPlot = () => {
    if (!plotName.trim() || !plotSize.trim() || !cropType.trim() || sowingDate === 'Select date') {
      alert('Please fill in all required fields');
      return;
    }

    const newPlot = {
      id: plots.length + 1,
      name: plotName.trim(),
      crop: capitalizeFirstLetter(cropType.trim()),
      size: plotSize.trim(),
      sowingDate,
      status: 'Active',
      income: '₹0',
      expense: '₹0',
      profit: '₹0',
      notes: notes.trim()
    };

    setPlots([...plots, newPlot]);
    setShowAddModal(false);
    
    // Reset form
    setPlotName('');
    setPlotSize('');
    setCropType('');
    setSowingDate('Select date');
    setNotes('');
  };

  const handleViewPlot = (plot: any) => {
    router.push(`/plot-details/${plot.id}?plotData=${encodeURIComponent(JSON.stringify(plot))}`);
  };

  const PlotCard = ({ plot, isHarvested = false }) => (
    <View style={[styles.plotCard, { backgroundColor: colors.surface }, isHarvested && styles.harvestedCard]}>
      <View style={styles.plotHeader}>
        <View>
          <Text style={[styles.plotName, { color: colors.text }]}>{plot.name}</Text>
          <Text style={[styles.plotDetails, { color: colors.textSecondary }]}>{plot.crop} • {plot.size}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: isHarvested ? `${colors.textSecondary}15` : `${colors.success}15` }]}>
          <Text style={[styles.statusText, { color: isHarvested ? colors.textSecondary : colors.success }]}>
            {plot.status}
          </Text>
        </View>
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
        {!isHarvested && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Plus size={16} color={colors.success} />
            <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>Add</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={() => handleViewPlot(plot)}
        >
          <Eye size={16} color={colors.textSecondary} />
          <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>View</Text>
        </TouchableOpacity>
        {!isHarvested && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Edit size={16} color={colors.textSecondary} />
            <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Plot Management</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={() => setShowAddModal(true)}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Plots ({activePlots.length})</Text>
          {activePlots.map((plot) => (
            <PlotCard key={plot.id} plot={plot} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Harvested Plots ({harvestedPlots.length})</Text>
          {harvestedPlots.map((plot) => (
            <PlotCard key={plot.id} plot={plot} isHarvested={true} />
          ))}
        </View>
        
        {/* Bottom padding for safe area */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add Plot Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Plot</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Plot Name</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={plotName}
                onChangeText={setPlotName}
                placeholder="Enter plot name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Size</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={plotSize}
                onChangeText={setPlotSize}
                placeholder="e.g., 2.5 acres"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Crop Type</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={cropType}
                onChangeText={(text) => setCropType(capitalizeFirstLetter(text))}
                placeholder="e.g., Wheat, Rice, Tomato"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Sowing Date</Text>
              <TouchableOpacity 
                style={[styles.dateInput, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={20} color={colors.textSecondary} />
                <Text style={[styles.dateText, { color: sowingDate === 'Select date' ? colors.textSecondary : colors.text }]}>
                  {sowingDate}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Notes (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any additional notes..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleAddPlot}
              >
                <Text style={styles.saveButtonText}>Create Plot</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Sowing Date</Text>
            
            <ScrollView style={styles.datePickerContainer} showsVerticalScrollIndicator={false}>
              {generateDates().map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateOption,
                    { borderBottomColor: colors.border },
                    sowingDate === formatDate(date) && { backgroundColor: `${colors.primary}15` }
                  ]}
                  onPress={() => {
                    setSowingDate(formatDate(date));
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={[
                    styles.dateOptionText,
                    { color: sowingDate === formatDate(date) ? colors.primary : colors.text }
                  ]}>
                    {date.toLocaleDateString('en-IN', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.background, marginTop: 16 }]}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
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
  harvestedCard: {
    opacity: 0.7,
  },
  plotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  plotName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  plotDetails: {
    fontSize: 14,
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
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 16,
  },
  datePickerContainer: {
    maxHeight: 300,
    marginTop: 4,
  },
  dateOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dateOptionText: {
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