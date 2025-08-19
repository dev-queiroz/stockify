import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react-native';
import { StockMovement, Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function HistoryScreen() {
  const { stockMovements, products, theme, createStockMovement } = useApp();

  const [showAddMovement, setShowAddMovement] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  const filteredMovements = useMemo(() => {
    if (filterType === 'ALL') return stockMovements;
    return stockMovements.filter(movement => movement.type === filterType);
  }, [stockMovements, filterType]);

  const handleAddMovement = async () => {
    if (!selectedProduct || !quantity || !reason) return;

    const movementData: Omit<StockMovement, 'id'> = {
      productId: selectedProduct.id,
      type: movementType,
      quantity: parseInt(quantity),
      reason,
      date: new Date().toISOString(),
    };

    await createStockMovement(movementData);

    setShowAddMovement(false);
    setSelectedProduct(null);
    setQuantity('');
    setReason('');
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Produto não encontrado';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      marginLeft: 8,
    },
    filterContainer: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    filterButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: theme.colors.border,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    filterButtonText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    filterButtonTextActive: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    emptyStateText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    movementCard: {
      marginBottom: 12,
    },
    movementHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    movementIcon: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      marginRight: 12,
    },
    movementInfo: {
      flex: 1,
    },
    productName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    movementReason: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    movementMeta: {
      alignItems: 'flex-end',
    },
    quantityText: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 2,
    },
    quantityIn: {
      color: theme.colors.success,
    },
    quantityOut: {
      color: theme.colors.error,
    },
    dateText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    notes: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 8,
      fontStyle: 'italic',
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      margin: 20,
      minWidth: '90%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    typeSelector: {
      flexDirection: 'row',
      marginBottom: 16,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 4,
    },
    typeButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 6,
    },
    typeButtonActive: {
      backgroundColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    typeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    typeButtonTextActive: {
      color: theme.colors.primary,
    },
    productSelector: {
      marginBottom: 16,
    },
    productButton: {
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
    },
    productButtonText: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    modalActionButton: {
      flex: 1,
    },
  });

  const renderMovementItem = ({ item }: { item: StockMovement }) => (
    <Card style={styles.movementCard}>
      <View style={styles.movementHeader}>
        <View style={styles.movementIcon}>
          {item.type === 'IN' ? (
            <TrendingUp size={20} color={theme.colors.success} />
          ) : (
            <TrendingDown size={20} color={theme.colors.error} />
          )}
        </View>

        <View style={styles.movementInfo}>
          <Text style={styles.productName}>{getProductName(item.productId)}</Text>
          <Text style={styles.movementReason}>{item.reason}</Text>
        </View>

        <View style={styles.movementMeta}>
          <Text
            style={[
              styles.quantityText,
              item.type === 'IN' ? styles.quantityIn : styles.quantityOut,
            ]}
          >
            {item.type === 'IN' ? '+' : '-'}
            {item.quantity}
          </Text>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
      </View>

      {item.notes && <Text style={styles.notes}>Obs: {item.notes}</Text>}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico de Movimentações</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddMovement(true)}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Nova Movimentação</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {(['ALL', 'IN', 'OUT'] as const).map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                filterType === type && styles.filterButtonActive,
              ]}
              onPress={() => setFilterType(type)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === type && styles.filterButtonTextActive,
                ]}
              >
                {type === 'ALL' ? 'Todas' : type === 'IN' ? 'Entradas' : 'Saídas'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {filteredMovements.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Nenhuma movimentação registrada ainda.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredMovements}
            keyExtractor={item => item.id}
            renderItem={renderMovementItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* MODAL: Adicionar Movimentação */}
      <Modal
        visible={showAddMovement}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddMovement(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Movimentação</Text>

            {/* Tipo de Movimento */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  movementType === 'IN' && styles.typeButtonActive,
                ]}
                onPress={() => setMovementType('IN')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    movementType === 'IN' && styles.typeButtonTextActive,
                  ]}
                >
                  Entrada
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  movementType === 'OUT' && styles.typeButtonActive,
                ]}
                onPress={() => setMovementType('OUT')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    movementType === 'OUT' && styles.typeButtonTextActive,
                  ]}
                >
                  Saída
                </Text>
              </TouchableOpacity>
            </View>

            {/* Produto */}
            <View style={styles.productSelector}>
              <Text style={{ color: theme.colors.text, marginBottom: 8 }}>
                Produto
              </Text>
              <TouchableOpacity
                style={styles.productButton}
                onPress={() => setShowProductSelector(true)}
              >
                <Text style={styles.productButtonText}>
                  {selectedProduct ? selectedProduct.name : 'Selecionar produto'}
                </Text>
              </TouchableOpacity>
            </View>

            <Input
              label="Quantidade"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="0"
              keyboardType="numeric"
            />

            <Input
              label="Motivo"
              value={reason}
              onChangeText={setReason}
              placeholder="Ex: Compra, Venda, Ajuste..."
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowAddMovement(false)}
                variant="outline"
                style={styles.modalActionButton}
              />
              <Button
                title="Salvar"
                onPress={handleAddMovement}
                disabled={!selectedProduct || !quantity || !reason}
                style={styles.modalActionButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: Selecionar Produto */}
      <Modal
        visible={showProductSelector}
        animationType="slide"
        transparent
        onRequestClose={() => setShowProductSelector(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Produto</Text>

            <FlatList
              data={products}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.productButton,
                    selectedProduct?.id === item.id && {
                      backgroundColor: theme.colors.primary + '30',
                    },
                  ]}
                  onPress={() => {
                    setSelectedProduct(item);
                    setShowProductSelector(false);
                  }}
                >
                  <Text
                    style={[
                      styles.productButtonText,
                      selectedProduct?.id === item.id && { color: theme.colors.primary },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.modalActions}>
              <Button
                title="Fechar"
                onPress={() => setShowProductSelector(false)}
                style={styles.modalActionButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}