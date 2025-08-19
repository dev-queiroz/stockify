import {useEffect, useState} from 'react';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {dbManager} from '@/services/db';
import { Product } from '@/types';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadProducts() {
        try {
            const items = await dbManager.db.getProducts();
            setProducts(items);
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
        } finally {
            setLoading(false);
        }
    }

    async function deleteProduct(id: string) {
        try {
            await dbManager.db.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Erro ao excluir produto:', err);
        }
    }

    async function exportProducts() {
        try {
            const json = JSON.stringify(products, null, 2);
            const fileUri = FileSystem.documentDirectory + 'products.json';
            await FileSystem.writeAsStringAsync(fileUri, json, {
                encoding: FileSystem.EncodingType.UTF8,
            });
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                console.log('Arquivo salvo em:', fileUri);
            }
        } catch (err) {
            console.error('Erro ao exportar produtos:', err);
        }
    }

    async function importProducts(fileUri: string) {
        try {
            const content = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.UTF8,
            });
            const items: Array<Pick<Product, 'name' | 'quantity' | 'categoryId' | 'purchasePrice' | 'salePrice' | 'expirationDate' | 'notes'>> = JSON.parse(content);

            for (const p of items) {
                await dbManager.db.createProduct({
                    name: p.name,
                    categoryId: p.categoryId || 'default-category',
                    quantity: p.quantity || 0,
                    purchasePrice: p.purchasePrice || 0,
                    salePrice: p.salePrice || 0,
                    expirationDate: p.expirationDate,
                    notes: p.notes
                });
            }

            await loadProducts();
        } catch (err) {
            console.error('Erro ao importar produtos:', err);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    return {
        products,
        loading,
        reload: loadProducts,
        deleteProduct,
        exportProducts,
        importProducts
    };
}
