;import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, Eye, CreditCard as Edit, RotateCcw, Trash2, Calendar, Phone, MapPin, Clock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function LaborPage() {
  const { colors } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLaborer, setSelectedLaborer] = useState(null);
  const [viewMode, setViewMode] = useState('workers'); // 'workers' or 'wages'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  
  // Form states
  const [laborerName, setLaborerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [wage, setWage] = useState('');
  const [frequency, setFrequency] = useState('Daily');

  const [laborers, setLaborers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      role: 'Field Worker',
      wage: 300,
      frequency: 'Daily',
      assignedPlot: 'North Field',
      status: 'Active',
      daysWorked: 25,
      totalWage: 7500
    },
    {
      id: 2,
      name: 'Priya Sharma',
      phone: '+91 9876543211',
      role: 'Irrigation Specialist',
      wage: 12000,
      frequency: 'Monthly',
      assignedPlot: 'South Field',
      status: 'Active',
      daysWorked: 30,
      totalWage: 12000
    },
    {
      id: 3,
      name: 'Suresh Patel',
      phone: '+91 9876543212',
      role: 'Harvester',
      wage: 350,
      frequency: 'Daily',
      assignedPlot: 'East Field',
      status: 'Active',
      daysWorked: 20,
      totalWage: 7000
    },
    {
      id: 4,
      name: 'Meera Devi',
      phone: '+91 9876543213',
      role: 'Supervisor',
      wage: 45000,
      frequency: 'Monthly',
      assignedPlot: 'All Fields',
      status: 'Inactive',
      daysWorked: 15,
      totalWage: 22500
    },
  ]);

  const wageHistory = [
    {
      id: 1,
      laborer: 'Rajesh Kumar',
      plot: 'North Field',
      period: 'Jan 2024',
      daysWorked: 25,
      totalWage: 7500,
      status: 'Paid'
    },
    {
      id: 2,
      laborer: 'Priya Sharma',
      plot: 'South Field',
      period: 'Jan 2024',
      daysWorked: 30,
      totalWage: 12000,
      status: 'Pending'
    },
    {
      id: 3,
      laborer: 'Suresh Patel',
      plot: 'East Field',
      period: 'Jan 2024',
      daysWorked: 20,
      totalWage: 7000,
      status: 'Paid'
    },
  ];

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const isDateMarked = (date, laborerId) => {
    const key = `${laborerId}-${formatDateKey(date)}`;
    return attendanceData[key] || false;
  };

  const toggleAttendance = (date, laborerId) => {
    const key = `${laborerId}-${formatDateKey(date)}`;
    setAttendanceData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const markTodayAttendance = () => {
    if (!selectedLaborer) return;
    
    const today = new Date();
    const key = `${selectedLaborer.id}-${formatDateKey(today)}`;
    setAttendanceData(prev => ({
      ...prev,
      [key]: true
    }));
    
    alert(`Attendance marked for ${selectedLaborer.name} today`);
  };

  const getWorkedDays = (laborerId, month) => {
    const days = generateCalendarDays(month);
    return days.filter(day => isDateMarked(day, laborerId)).length;
  };

  const handleAddLaborer = () => {
    if (!laborerName.trim() || !phoneNumber.trim() || !role.trim() || !wage.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newLaborer = {
      id: laborers.length + 1,
      name: laborerName.trim(),
      phone: phoneNumber.trim(),
      role: role.trim(),
      wage: parseInt(wage),
      frequency: frequency,
      assignedPlot: 'North Field', // Default assignment
      status: 'Active',
      daysWorked: 0,
      totalWage: 0
    };

    setLaborers([...laborers, newLaborer]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setLaborerName('');
    setPhoneNumber('');
    setRole('');
    setWage('');
    setFrequency('Daily');
  };

  const handleAttendance = (laborer) => {
    setSelectedLaborer(laborer);
    setShowAttendanceModal(true);
  };

  const handleViewLaborer = (laborer) => {
    setSelectedLaborer(laborer);
    setShowViewModal(true);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#7AC74F';
      case 'Inactive': return '#EF4444';
      case 'Paid': return '#7AC74F';
      case 'Pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const LaborerCard = ({ laborer }) => (
    <View style={[styles.laborerCard, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={[styles.laborerName, { color: colors.text }]}>{laborer.name}</Text>
          <View style={styles.contactInfo}>
            <Phone size={12} color={colors.textSecondary} />
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>{laborer.phone}</Text>
          </View>
          <View style={styles.contactInfo}>
            <MapPin size={12} color={colors.textSecondary} />
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>{laborer.assignedPlot}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(laborer.status)}15` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(laborer.status) }]}>
            {laborer.status}
          </Text>
        </View>
      </View>

      <View style={styles.laborerDetails}>
        <Text style={[styles.laborerRole, { color: colors.text }]}>{laborer.role}</Text>
        <Text style={[styles.laborerWage, { color: colors.success }]}>₹{laborer.wage} / {laborer.frequency}</Text>
        <Text style={[styles.laborerStats, { color: colors.textSecondary }]}>Worked: {getWorkedDays(laborer.id, currentMonth)} days • Total: ₹{laborer.totalWage}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={() => handleAttendance(laborer)}
        >
          <Calendar size={14} color={colors.success} />
          <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Edit size={14} color={colors.textSecondary} />
          <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={() => handleViewLaborer(laborer)}
        >
          <Eye size={14} color={colors.textSecondary} />
          <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const WageCard = ({ wage }) => (
    <View style={[styles.wageCard, { backgroundColor: colors.surface }]}>
      <View style={styles.wageHeader}>
        <View>
          <Text style={[styles.wageLaborerName, { color: colors.text }]}>{wage.laborer}</Text>
          <Text style={[styles.wagePlot, { color: colors.textSecondary }]}>{wage.plot} • {wage.period}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(wage.status)}15` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(wage.status) }]}>
            {wage.status}
          </Text>
        </View>
      </View>
      <View style={styles.wageDetails}>
        <Text style={[styles.wageDays, { color: colors.textSecondary }]}>{wage.daysWorked} days worked</Text>
        <Text style={[styles.wageAmount, { color: colors.success }]}>₹{wage.totalWage}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Labor Management</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={() => setShowAddModal(true)}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.tab, viewMode === 'workers' && { borderBottomColor: colors.primary }]}
          onPress={() => setViewMode('workers')}
        >
          <Text style={[styles.tabText, { color: viewMode === 'workers' ? colors.primary : colors.textSecondary }]}>Workers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, viewMode === 'wages' && { borderBottomColor: colors.primary }]}
          onPress={() => setViewMode('wages')}
        >
          <Text style={[styles.tabText, { color: viewMode === 'wages' ? colors.primary : colors.textSecondary }]}>Wages</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {viewMode === 'workers' ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Labor ({laborers.length})</Text>
            {laborers.map((laborer) => (
              <LaborerCard key={laborer.id} laborer={laborer} />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Wage History ({wageHistory.length})</Text>
            {wageHistory.map((wage) => (
              <WageCard key={wage.id} wage={wage} />
            ))}
          </View>
        )}
        
        {/* Bottom padding for safe area */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add Labor Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Labor</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Name</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={laborerName}
                onChangeText={setLaborerName}
                placeholder="Enter laborer name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+91 9876543210"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Role</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={role}
                onChangeText={setRole}
                placeholder="e.g., Field Worker, Supervisor"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Wage</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={wage}
                  onChangeText={setWage}
                  placeholder="300"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Frequency</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={frequency}
                  onChangeText={setFrequency}
                  placeholder="Daily/Monthly"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleAddLaborer}
              >
                <Text style={styles.saveButtonText}>Add Labor</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Attendance Modal */}
      <Modal
        visible={showAttendanceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAttendanceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Mark Attendance</Text>
            
            {selectedLaborer && (
              <View style={[styles.selectedLaborerInfo, { backgroundColor: colors.background }]}>
                <Text style={[styles.selectedLaborerName, { color: colors.text }]}>{selectedLaborer.name}</Text>
                <Text style={[styles.selectedLaborerRole, { color: colors.textSecondary }]}>{selectedLaborer.role} • {selectedLaborer.assignedPlot}</Text>
              </View>
            )}

            <View style={styles.attendanceCalendar}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={() => navigateMonth(-1)}>
                  <Text style={[styles.navButton, { color: colors.primary }]}>‹</Text>
                </TouchableOpacity>
                <Text style={[styles.calendarTitle, { color: colors.text }]}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={() => navigateMonth(1)}>
                  <Text style={[styles.navButton, { color: colors.primary }]}>›</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.calendarGrid}>
                {generateCalendarDays(currentMonth).map((date, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={[
                    styles.calendarDay,
                    { backgroundColor: colors.background },
                    isDateMarked(date, selectedLaborer?.id) && { backgroundColor: `${colors.success}15` }
                  ]}
                    onPress={() => selectedLaborer && toggleAttendance(date, selectedLaborer.id)}
                  >
                    <Text style={[
                      styles.calendarDayText,
                      { color: colors.textSecondary },
                      isDateMarked(date, selectedLaborer?.id) && { color: colors.success, fontWeight: '600' }
                    ]}>
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.attendanceStats}>
              <View style={styles.attendanceStat}>
                <Text style={[styles.attendanceStatValue, { color: colors.text }]}>
                  {selectedLaborer ? getWorkedDays(selectedLaborer.id, currentMonth) : 0}
                </Text>
                <Text style={[styles.attendanceStatLabel, { color: colors.textSecondary }]}>Days Worked</Text>
              </View>
              <View style={styles.attendanceStat}>
                <Text style={[styles.attendanceStatValue, { color: colors.text }]}>
                  ₹{selectedLaborer ? (getWorkedDays(selectedLaborer.id, currentMonth) * selectedLaborer.wage) : 0}
                </Text>
                <Text style={[styles.attendanceStatLabel, { color: colors.textSecondary }]}>Total Wage</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => setShowAttendanceModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={markTodayAttendance}
              >
                <Text style={styles.saveButtonText}>Mark Today</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Laborer Modal */}
      <Modal
        visible={showViewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowViewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Laborer Details</Text>
            
            {selectedLaborer && (
              <View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Name:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>{selectedLaborer.name}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Phone:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>{selectedLaborer.phone}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Role:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>{selectedLaborer.role}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Wage:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>₹{selectedLaborer.wage} / {selectedLaborer.frequency}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Assigned Plot:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>{selectedLaborer.assignedPlot}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Status:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(selectedLaborer.status)}15` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(selectedLaborer.status) }]}>
                      {selectedLaborer.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Days Worked:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>{getWorkedDays(selectedLaborer.id, currentMonth)} this month</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Total Wage:</Text>
                  <Text style={[styles.viewValue, { color: colors.success }]}>₹{getWorkedDays(selectedLaborer.id, currentMonth) * selectedLaborer.wage}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.background, marginTop: 24 }]}
              onPress={() => setShowViewModal(false)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Close</Text>
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  laborerCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  laborerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  contactText: {
    fontSize: 12,
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
  laborerDetails: {
    marginBottom: 12,
  },
  laborerRole: {
    fontSize: 14,
    marginBottom: 4,
  },
  laborerWage: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  laborerStats: {
    fontSize: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '500',
  },
  wageCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  wageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  wageLaborerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  wagePlot: {
    fontSize: 14,
  },
  wageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wageDays: {
    fontSize: 14,
  },
  wageAmount: {
    fontSize: 16,
    fontWeight: '600',
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
  selectedLaborerInfo: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedLaborerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedLaborerRole: {
    fontSize: 14,
  },
  attendanceCalendar: {
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navButton: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 12,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  calendarDay: {
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  calendarDayText: {
    fontSize: 12,
  },
  attendanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  attendanceStat: {
    alignItems: 'center',
  },
  attendanceStatValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  attendanceStatLabel: {
    fontSize: 12,
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewLabel: {
    fontSize: 14,
    width: 120,
  },
  viewValue: {
    fontSize: 14,
    flex: 1,
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