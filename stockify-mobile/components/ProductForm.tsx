import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const { theme } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    purchasePrice: '',
    salePrice: '',
    expirationDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        quantity: product.quantity.toString(),
        purchasePrice: product.purchasePrice.toString(),
        salePrice: product.salePrice.toString(),
        expirationDate: product.expirationDate || '',
        notes: product.notes || '',
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.quantity.trim() || isNaN(Number(formData.quantity))) {
      newErrors.quantity = 'Quantidade deve ser um número válido';
    }

    if (!formData.purchasePrice.trim() || isNaN(Number(formData.purchasePrice))) {
      newErrors.purchasePrice = 'Preço de compra deve ser um número válido';
    }

    if (!formData.salePrice.trim() || isNaN(Number(formData.salePrice))) {
      newErrors.salePrice = 'Preço de venda deve ser um número válido';
    }

    const quantity = Number(formData.quantity);
    const purchasePrice = Number(formData.purchasePrice);
    const salePrice = Number(formData.salePrice);

    if (quantity < 0) {
      newErrors.quantity = 'Quantidade não pode ser negativa';
    }

    if (purchasePrice < 0) {
      newErrors.purchasePrice = 'Preço de compra não pode ser negativo';
    }

    if (salePrice < 0) {
      newErrors.salePrice = 'Preço de venda não pode ser negativo';
    }

    if (salePrice < purchasePrice) {
      Alert.alert(
        'Atenção',
        'O preço de venda é menor que o preço de compra. Deseja continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => handleSubmit(newErrors) }
        ]
      );
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (validationErrors = errors) => {
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const productData = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      quantity: Number(formData.quantity),
      purchasePrice: Number(formData.purchasePrice),
      salePrice: Number(formData.salePrice),
      expirationDate: formData.expirationDate.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };

    onSubmit(productData);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    halfWidth: {
      flex: 1,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    actionButton: {
      flex: 1,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card>
          <Text style={styles.title}>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </Text>

          <Input
            label="Nome do Produto*"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            error={errors.name}
            placeholder="Digite o nome do produto"
          />

          <Input
            label="Categoria*"
            value={formData.category}
            onChangeText={(text) => setFormData({ ...formData, category: text })}
            error={errors.category}
            placeholder="Ex: Eletrônicos, Roupas..."
          />

          <Input
            label="Quantidade*"
            value={formData.quantity}
            onChangeText={(text) => setFormData({ ...formData, quantity: text })}
            error={errors.quantity}
            placeholder="0"
            keyboardType="numeric"
          />

          <View style={styles.row}>
            <Input
              label="Preço de Compra*"
              value={formData.purchasePrice}
              onChangeText={(text) => setFormData({ ...formData, purchasePrice: text })}
              error={errors.purchasePrice}
              placeholder="0.00"
              keyboardType="numeric"
              containerStyle={styles.halfWidth}
            />

            <Input
              label="Preço de Venda*"
              value={formData.salePrice}
              onChangeText={(text) => setFormData({ ...formData, salePrice: text })}
              error={errors.salePrice}
              placeholder="0.00"
              keyboardType="numeric"
              containerStyle={styles.halfWidth}
            />
          </View>

          <Input
            label="Data de Validade"
            value={formData.expirationDate}
            onChangeText={(text) => setFormData({ ...formData, expirationDate: text })}
            placeholder="AAAA-MM-DD"
          />

          <Input
            label="Observações"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Observações sobre o produto..."
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: 'top' }}
          />

          <View style={styles.actions}>
            <Button
              title="Cancelar"
              onPress={onCancel}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title={product ? 'Salvar' : 'Criar'}
              onPress={() => validateForm() && handleSubmit()}
              style={styles.actionButton}
            />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}