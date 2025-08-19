import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Package, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Card } from './ui/Card';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onPress?: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete, onPress }: ProductCardProps) {
  const { theme } = useApp();

  const isLowStock = product.quantity < 10;
  const isExpiringSoon = product.expirationDate && 
    new Date(product.expirationDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    category: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    details: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    quantity: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityText: {
      fontSize: 16,
      fontWeight: '500',
      color: isLowStock ? theme.colors.error : theme.colors.text,
      marginLeft: 4,
    },
    prices: {
      alignItems: 'flex-end',
    },
    priceText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    salePriceText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.success,
    },
    alerts: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    alert: {
      fontSize: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
    },
    lowStockAlert: {
      backgroundColor: theme.colors.error + '20',
      color: theme.colors.error,
    },
    expiringAlert: {
      backgroundColor: theme.colors.warning + '20',
      color: theme.colors.warning,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
      borderRadius: 8,
    },
    editButton: {
      backgroundColor: theme.colors.primary + '20',
    },
    deleteButton: {
      backgroundColor: theme.colors.error + '20',
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <TouchableOpacity onPress={() => onPress?.(product)} activeOpacity={0.7}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.category}>{product.category}</Text>
        </View>

        <View style={styles.details}>
          <View style={styles.quantity}>
            <Package size={16} color={isLowStock ? theme.colors.error : theme.colors.textSecondary} />
            <Text style={styles.quantityText}>{product.quantity} un.</Text>
          </View>

          <View style={styles.prices}>
            <Text style={styles.priceText}>
              Compra: {formatCurrency(product.purchasePrice)}
            </Text>
            <Text style={styles.salePriceText}>
              Venda: {formatCurrency(product.salePrice)}
            </Text>
          </View>
        </View>

        {(isLowStock || isExpiringSoon) && (
          <View style={styles.alerts}>
            {isLowStock && (
              <Text style={[styles.alert, styles.lowStockAlert]}>
                Estoque baixo
              </Text>
            )}
            {isExpiringSoon && (
              <Text style={[styles.alert, styles.expiringAlert]}>
                Vence em breve
              </Text>
            )}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(product)}
          >
            <Edit size={16} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(product)}
          >
            <Trash2 size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}