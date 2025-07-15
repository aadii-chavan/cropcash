import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Package, Eye, CreditCard as Edit, Trash2, AlertTriangle, TrendingDown } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function InventoryPage() {
  const { colors } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('items'); // 'items' or 'allocations'
  
  // Form states
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [supplier, setSupplier] = useState('');
  const [category, setCategory] = useState('');

  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: 'Urea Fertilizer',
      category: 'Fertilizer',
      quantity: 50,
      unit: 'kg',
      costPerUnit: 50,
      totalCost: 2500,
      supplier: 'AgriSupply Co.',
      purchaseDate: '2024-01-10',
      status: 'In Stock',
      minStock: 10,
      allocated: 15
    },
    {
      id: 2,
      name: 'Wheat Seeds',
      category: 'Seeds',
      quantity: 100,
      unit: 'kg',
      costPerUnit: 50,
      totalCost: 5000,
      supplier: 'Seed Mart',
      purchaseDate: '2024-01-08',
      status: 'In Stock',
      minStock: 20,
      allocated: 25
    },
    {
      id: 3,
      name: 'Pesticide Spray',
      category: 'Pesticide',
      quantity: 5,
      unit: 'litre',
      costPerUnit: 200,
      totalCost: 1000,
      supplier: 'ChemAgri Ltd.',
      purchaseDate: '2024-01-15',
      status: 'Low Stock',
      minStock: 3,
      allocated: 2
    },
    {
      id: 4,
      name: 'NPK Fertilizer',
      category: 'Fertilizer',
      quantity: 2,
      unit: 'kg',
      costPerUnit: 80,
      totalCost: 160,
      supplier: 'FertilizerHub',
      purchaseDate: '2024-01-12',
      status: 'Critical',
      minStock: 5,
      allocated: 0
    },
  ]);

  const allocations = [
    {
      id: 1,
      itemName: 'Urea Fertilizer',
      plot: 'North Field',
      quantity: 10,
      unit: 'kg',
      allocationDate: '2024-01-12',
      allocatedBy: 'Ramesh Kumar'
    },
    {
      id: 2,
      itemName: 'Wheat Seeds',
      plot: 'North Field',
      quantity: 25,
      unit: 'kg',
      allocationDate: '2024-01-10',
      allocatedBy: 'Ramesh Kumar'
    },
    {
      id: 3,
      itemName: 'Pesticide Spray',
      plot: 'South Field',
      quantity: 2,
      unit: 'litre',
      allocationDate: '2024-01-18',
      allocatedBy: 'Ramesh Kumar'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return colors.success;
      case 'Low Stock': return colors.warning;
      case 'Critical': return colors.error;
      case 'Out of Stock': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getStockStatus = (item) => {
    const availableStock = item.quantity - item.allocated;
    if (availableStock <= 0) return 'Out of Stock';
    if (availableStock <= item.minStock) return 'Critical';
    if (availableStock <= item.minStock * 2) return 'Low Stock';
    return 'In Stock';
  };

  const handleAddItem = () => {
    if (!itemName.trim() || !quantity.trim() || !unit.trim() || !costPerUnit.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newItem = {
      id: inventoryItems.length + 1,
      name: itemName.trim(),
      category: category.trim() || 'General',
      quantity: parseInt(quantity),
      unit: unit.trim(),
      costPerUnit: parseFloat(costPerUnit),
      totalCost: parseInt(quantity) * parseFloat(costPerUnit),
      supplier: supplier.trim() || 'Unknown',
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'In Stock',
      minStock: Math.ceil(parseInt(quantity) * 0.2), // 20% of quantity as min stock
      allocated: 0
    };

    setInventoryItems([...inventoryItems, newItem]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setItemName('');
    setQuantity('');
    setUnit('');
    setCostPerUnit('');
    setSupplier('');
    setCategory('');
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const lowStockItems = inventoryItems.filter(item => {
    const status = getStockStatus(item);
    return status === 'Low Stock' || status === 'Critical' || status === 'Out of Stock';
  });

  const InventoryCard = ({ item }) => {
    const status = getStockStatus(item);
    const availableStock = item.quantity - item.allocated;
    
    return (
      <View style={[styles.inventoryCard, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.itemCategory, { color: colors.textSecondary }]}>{item.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(status)}15` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
              {status}
            </Text>
          </View>
        </View>

        <View style={styles.stockInfo}>
          <View style={styles.stockRow}>
            <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Total Stock:</Text>
            <Text style={[styles.stockValue, { color: colors.text }]}>{item.quantity} {item.unit}</Text>
          </View>
          <View style={styles.stockRow}>
            <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Allocated:</Text>
            <Text style={[styles.stockValue, { color: colors.warning }]}>{item.allocated} {item.unit}</Text>
          </View>
          <View style={styles.stockRow}>
            <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Available:</Text>
            <Text style={[styles.stockValue, { color: availableStock > item.minStock ? colors.success : colors.error }]}>
              {availableStock} {item.unit}
            </Text>
          </View>
        </View>

        <View style={styles.itemDetails}>
          <Text style={[styles.itemCost, { color: colors.text }]}>₹{item.costPerUnit} per {item.unit}</Text>
          <Text style={[styles.itemSupplier, { color: colors.textSecondary }]}>{item.supplier}</Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
            onPress={() => handleViewItem(item)}
          >
            <Eye size={14} color={colors.textSecondary} />
            <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Edit size={14} color={colors.textSecondary} />
            <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Package size={14} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>Allocate</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const AllocationCard = ({ allocation }) => (
    <View style={[styles.allocationCard, { backgroundColor: colors.surface }]}>
      <View style={styles.allocationHeader}>
        <Text style={[styles.allocationItem, { color: colors.text }]}>{allocation.itemName}</Text>
        <Text style={[styles.allocationDate, { color: colors.textSecondary }]}>{allocation.allocationDate}</Text>
      </View>
      <View style={styles.allocationDetails}>
        <Text style={[styles.allocationPlot, { color: colors.primary }]}>{allocation.plot}</Text>
        <Text style={[styles.allocationQuantity, { color: colors.textSecondary }]}>
          {allocation.quantity} {allocation.unit}
        </Text>
      </View>
      <Text style={[styles.allocationBy, { color: colors.textSecondary }]}>
        Allocated by: {allocation.allocatedBy}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Inventory Management</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={() => setShowAddModal(true)}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <View style={[styles.alertBanner, { backgroundColor: `${colors.warning}15`, borderColor: colors.warning }]}>
          <AlertTriangle size={20} color={colors.warning} />
          <Text style={[styles.alertText, { color: colors.warning }]}>
            {lowStockItems.length} item(s) need restocking
          </Text>
        </View>
      )}

      <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.tab, viewMode === 'items' && { borderBottomColor: colors.primary }]}
          onPress={() => setViewMode('items')}
        >
          <Text style={[styles.tabText, { color: viewMode === 'items' ? colors.primary : colors.textSecondary }]}>
            Items ({inventoryItems.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, viewMode === 'allocations' && { borderBottomColor: colors.primary }]}
          onPress={() => setViewMode('allocations')}
        >
          <Text style={[styles.tabText, { color: viewMode === 'allocations' ? colors.primary : colors.textSecondary }]}>
            Allocations ({allocations.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {viewMode === 'items' ? (
          <View style={styles.section}>
            {inventoryItems.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            {allocations.map((allocation) => (
              <AllocationCard key={allocation.id} allocation={allocation} />
            ))}
          </View>
        )}
        
        {/* Bottom padding for safe area */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Inventory Item</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Item Name</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={itemName}
                onChangeText={setItemName}
                placeholder="Enter item name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Quantity</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="100"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Unit</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={unit}
                  onChangeText={setUnit}
                  placeholder="kg"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Cost per Unit (₹)</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={costPerUnit}
                onChangeText={setCostPerUnit}
                placeholder="50"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Category</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={category}
                onChangeText={setCategory}
                placeholder="e.g., Fertilizer, Seeds, Pesticide"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Supplier</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={supplier}
                onChangeText={setSupplier}
                placeholder="Supplier name"
                placeholderTextColor={colors.textSecondary}
              />
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
                onPress={handleAddItem}
              >
                <Text style={styles.saveButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Item Modal */}
      <Modal
        visible={showViewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowViewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Item Details</Text>
            
            {selectedItem && (
              <View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Name:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>{selectedItem.name}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Category:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>{selectedItem.category}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Total Stock:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>{selectedItem.quantity} {selectedItem.unit}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Allocated:</Text>
                  <Text style={[styles.viewValue, { color: colors.warning }]}>{selectedItem.allocated} {selectedItem.unit}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Available:</Text>
                  <Text style={[styles.viewValue, { color: colors.success }]}>
                    {selectedItem.quantity - selectedItem.allocated} {selectedItem.unit}
                  </Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Cost per Unit:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>₹{selectedItem.costPerUnit}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Total Cost:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>₹{selectedItem.totalCost}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Supplier:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>{selectedItem.supplier}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Purchase Date:</Text>
                  <Text style={[styles.viewValue, { color: colors.text }]}>{selectedItem.purchaseDate}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewLabel, { color: colors.textSecondary }]}>Status:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(getStockStatus(selectedItem))}15` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(getStockStatus(selectedItem)) }]}>
                      {getStockStatus(selectedItem)}
                    </Text>
                  </View>
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
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginTop: 16,
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
    marginTop: 16,
  },
  inventoryCard: {
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
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCategory: {
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
  stockInfo: {
    marginBottom: 12,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stockLabel: {
    fontSize: 12,
  },
  stockValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemCost: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemSupplier: {
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
  allocationCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  allocationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  allocationItem: {
    fontSize: 16,
    fontWeight: '600',
  },
  allocationDate: {
    fontSize: 12,
  },
  allocationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  allocationPlot: {
    fontSize: 14,
    fontWeight: '500',
  },
  allocationQuantity: {
    fontSize: 14,
  },
  allocationBy: {
    fontSize: 12,
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