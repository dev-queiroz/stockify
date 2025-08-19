import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Package, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';

export default function AnalyticsScreen() {
  const { products, stockMovements, theme } = useApp();

  const analytics = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);
    const totalRevenueValue = products.reduce((sum, p) => sum + (p.quantity * p.salePrice), 0);
    const potentialProfit = totalRevenueValue - totalValue;
    const profitMargin = totalValue > 0 ? ((potentialProfit / totalValue) * 100) : 0;

    const lowStockProducts = products.filter(p => p.quantity < 10);
    const expiringSoonProducts = products.filter(p => {
      if (!p.expirationDate) return false;
      const expirationDate = new Date(p.expirationDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
    });

    const categoryStats = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = {
          count: 0,
          totalValue: 0,
          totalQuantity: 0,
        };
      }
      acc[product.category].count++;
      acc[product.category].totalValue += product.quantity * product.purchasePrice;
      acc[product.category].totalQuantity += product.quantity;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number; totalQuantity: number }>);

    const recentMovements = stockMovements.slice(0, 10);
    const inMovements = stockMovements.filter(m => m.type === 'IN');
    const outMovements = stockMovements.filter(m => m.type === 'OUT');
    const totalIn = inMovements.reduce((sum, m) => sum + m.quantity, 0);
    const totalOut = outMovements.reduce((sum, m) => sum + m.quantity, 0);

    return {
      totalProducts,
      totalValue,
      totalRevenueValue,
      potentialProfit,
      profitMargin,
      lowStockProducts,
      expiringSoonProducts,
      categoryStats,
      totalIn,
      totalOut,
      recentMovements,
    };
  }, [products, stockMovements]);

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
    },
    content: {
      flex: 1,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      minWidth: '47%',
      padding: 16,
    },
    statIcon: {
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    profitPositive: {
      color: theme.colors.success,
    },
    profitNegative: {
      color: theme.colors.error,
    },
    categoryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
    },
    categoryStats: {
      alignItems: 'flex-end',
    },
    categoryValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.success,
    },
    categoryCount: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    alertsList: {
      gap: 8,
    },
    alertItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderLeftWidth: 4,
    },
    alertLowStock: {
      borderLeftColor: theme.colors.error,
      borderColor: theme.colors.border,
    },
    alertExpiring: {
      borderLeftColor: theme.colors.warning,
      borderColor: theme.colors.border,
    },
    alertText: {
      flex: 1,
      marginLeft: 12,
    },
    alertTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    alertSubtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relatórios e Análises</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estatísticas Principais */}
        <Text style={styles.sectionTitle}>Visão Geral</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Package size={24} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statValue}>{analytics.totalProducts}</Text>
            <Text style={styles.statLabel}>Total de Produtos</Text>
          </Card>

          <Card style={styles.statCard}>
            <TrendingUp size={24} color={theme.colors.success} style={styles.statIcon} />
            <Text style={[styles.statValue, styles.profitPositive]}>
              {formatCurrency(analytics.totalValue)}
            </Text>
            <Text style={styles.statLabel}>Valor em Estoque</Text>
          </Card>

          <Card style={styles.statCard}>
            <TrendingUp size={24} color={theme.colors.secondary} style={styles.statIcon} />
            <Text style={[styles.statValue, styles.profitPositive]}>
              {formatCurrency(analytics.potentialProfit)}
            </Text>
            <Text style={styles.statLabel}>Lucro Potencial</Text>
          </Card>

          <Card style={styles.statCard}>
            <TrendingUp size={24} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statValue}>
              {analytics.profitMargin.toFixed(1)}%
            </Text>
            <Text style={styles.statLabel}>Margem de Lucro</Text>
          </Card>
        </View>

        {/* Movimentações */}
        <Text style={styles.sectionTitle}>Movimentações</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <TrendingUp size={24} color={theme.colors.success} style={styles.statIcon} />
            <Text style={[styles.statValue, styles.profitPositive]}>
              {analytics.totalIn}
            </Text>
            <Text style={styles.statLabel}>Total de Entradas</Text>
          </Card>

          <Card style={styles.statCard}>
            <TrendingDown size={24} color={theme.colors.error} style={styles.statIcon} />
            <Text style={[styles.statValue, styles.profitNegative]}>
              {analytics.totalOut}
            </Text>
            <Text style={styles.statLabel}>Total de Saídas</Text>
          </Card>
        </View>

        {/* Estatísticas por Categoria */}
        <Text style={styles.sectionTitle}>Por Categoria</Text>
        <Card>
          {Object.entries(analytics.categoryStats).map(([category, stats]) => (
            <View key={category} style={styles.categoryItem}>
              <Text style={styles.categoryName}>{category}</Text>
              <View style={styles.categoryStats}>
                <Text style={styles.categoryValue}>
                  {formatCurrency(stats.totalValue)}
                </Text>
                <Text style={styles.categoryCount}>
                  {stats.count} produtos • {stats.totalQuantity} unidades
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Alertas */}
        <Text style={styles.sectionTitle}>Alertas</Text>
        <View style={styles.alertsList}>
          {analytics.lowStockProducts.map((product) => (
            <View key={`low-${product.id}`} style={[styles.alertItem, styles.alertLowStock]}>
              <AlertTriangle size={20} color={theme.colors.error} />
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>Estoque baixo</Text>
                <Text style={styles.alertSubtitle}>
                  {product.name} - {product.quantity} unidades restantes
                </Text>
              </View>
            </View>
          ))}

          {analytics.expiringSoonProducts.map((product) => (
            <View key={`exp-${product.id}`} style={[styles.alertItem, styles.alertExpiring]}>
              <AlertTriangle size={20} color={theme.colors.warning} />
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>Vence em breve</Text>
                <Text style={styles.alertSubtitle}>
                  {product.name} - Válido até {formatDate(product.expirationDate!)}
                </Text>
              </View>
            </View>
          ))}

          {analytics.lowStockProducts.length === 0 && analytics.expiringSoonProducts.length === 0 && (
            <Card>
              <Text style={[styles.statLabel, { textAlign: 'center', padding: 20 }]}>
                Nenhum alerta no momento
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}