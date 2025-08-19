import React from 'react';
import {Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Database, Download, Info, Moon, RefreshCw, Sun, Trash2, Upload} from 'lucide-react-native';
import {useApp} from '@/contexts/AppContext';
import {Card} from '@/components/ui/Card';
import {openDatabaseSync} from 'expo-sqlite';
import {dbManager} from '@/services/db';
import * as Sharing from 'expo-sharing';

// Abre banco de dados local
const db = openDatabaseSync('stockify.db');

// --------------------------
// Funções de dados (síncronas)
// --------------------------
const clearAllData = async () => {
    const products = await dbManager.db.getProducts();
    await Promise.all(products.map(p => dbManager.db.deleteProduct(p.id)));

    const categories = await dbManager.db.getCategories();
    await Promise.all(categories.map(c => dbManager.db.deleteCategory(c.id)));
};


const exportDataToJson = async () => {
    const products = await dbManager.db.getProducts();
    const categories = await dbManager.db.getCategories();

    return {
        products,
        categories
    };
};

const importDataFromJson = async (data: { products: any[]; categories: any[] }) => {
    try {
        // Limpa os dados atuais
        await clearAllData();

        // Importa as categorias
        for (const category of data.categories) {
            await dbManager.db.createCategory({
                name: category.name,
                color: category.color
            });
        }

        // Importa os produtos
        for (const product of data.products) {
            await dbManager.db.createProduct({
                name: product.name,
                categoryId: product.categoryId, // Use categoryId instead of category
                quantity: product.quantity,
                purchasePrice: product.purchasePrice,
                salePrice: product.salePrice,
                expirationDate: product.expirationDate,
                notes: product.notes
            });
        }

        return true;
    } catch (error) {
        console.error('Erro ao importar dados:', error);
        throw error;
    }
};

// --------------------------
// Componente
// --------------------------
export default function SettingsScreen() {
    const {theme, toggleTheme, loadProducts, loadCategories} = useApp();

    // --------------------------
    // Handlers
    // --------------------------
    const handleClearData = () => {
        Alert.alert(
            'Confirmar Limpeza',
            'Esta ação irá apagar todos os dados do aplicativo. Esta ação não pode ser desfeita.',
            [
                {text: 'Cancelar', style: 'cancel'},
                {
                    text: 'Confirmar',
                    style: 'destructive',
                    onPress: () => {
                        try {
                            clearAllData();
                            Alert.alert('Sucesso', 'Todos os dados foram apagados com sucesso');
                        } catch {
                            Alert.alert('Erro', 'Não foi possível apagar os dados');
                        }
                    },
                },
            ]
        );
    };

    const handleExportData = async () => {
        try {
            const jsonData = await exportDataToJson();
            const fileName = `stockify_backup_${new Date().toISOString().split('T')[0]}.json`;
            const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
            
            // Garante que o diretório existe
            await FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory!, { intermediates: true });
            
            // Salva o arquivo
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(jsonData, null, 2));
            
            // Compartilha o arquivo
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/json',
                dialogTitle: 'Backup Stockify',
                UTI: 'public.json'
            });

        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            Alert.alert('Erro', 'Não foi possível exportar os dados. Tente novamente.');
        }
    };

    const handleImportData = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true, // Copy file to cache directory first
            });

            if (result.canceled) {
                return;
            }

            const file = result.assets?.[0];
            if (!file) {
                throw new Error('Nenhum arquivo selecionado');
            }

            let contentUri = file.uri;
            
            // If the file is in the cache directory, read it directly
            if (!contentUri.startsWith('file://')) {
                // For Android content URIs, we need to use a different approach
                const cacheDir = FileSystem.cacheDirectory || '';
                const fileName = file.uri.split('/').pop() || 'backup.json';
                const destPath = `${cacheDir}${fileName}`;
                
                // Copy the file to cache directory
                await FileSystem.copyAsync({
                    from: file.uri,
                    to: destPath,
                });
                contentUri = destPath;
            }

            // Read the file content
            const fileContent = await FileSystem.readAsStringAsync(contentUri, { encoding: FileSystem.EncodingType.UTF8 });
            const jsonData = JSON.parse(fileContent);

            // Validate the JSON structure
            if (!jsonData.products || !jsonData.categories) {
                throw new Error('Formato de arquivo inválido. O arquivo deve conter produtos e categorias.');
            }

            await importDataFromJson(jsonData);
            Alert.alert('Sucesso', 'Dados importados com sucesso!');
            loadProducts();
            loadCategories();
        } catch (error) {
            console.error('Import error:', error);
            Alert.alert('Erro', 'Não foi possível importar os dados. Verifique se o arquivo é válido.');
        }
    };


    const handleRefreshData = () => {
        try {
            loadProducts();
            loadCategories();
            Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
        } catch {
            Alert.alert('Erro', 'Não foi possível atualizar os dados');
        }
    };

    // --------------------------
    // Estilos
    // --------------------------
    const styles = StyleSheet.create({
        container: {flex: 1, backgroundColor: theme.colors.background},
        header: {
            padding: 16,
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
        },
        headerTitle: {fontSize: 28, fontWeight: '700', color: theme.colors.text},
        content: {flex: 1, padding: 16},
        sectionTitle: {fontSize: 18, fontWeight: '600', color: theme.colors.text, marginBottom: 12, marginTop: 20},
        settingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        settingIcon: {marginRight: 16},
        settingContent: {flex: 1},
        settingTitle: {fontSize: 16, fontWeight: '500', color: theme.colors.text, marginBottom: 2},
        settingDescription: {fontSize: 14, color: theme.colors.textSecondary},
        aboutCard: {marginTop: 20, alignItems: 'center', padding: 20},
        appName: {fontSize: 20, fontWeight: '700', color: theme.colors.text, marginBottom: 4},
        appVersion: {fontSize: 14, color: theme.colors.textSecondary, marginBottom: 12},
        appDescription: {fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 20},
        databaseInfo: {padding: 12, backgroundColor: theme.colors.background, borderRadius: 8, marginTop: 8},
        databaseInfoText: {fontSize: 12, color: theme.colors.textSecondary, textAlign: 'center'},
    });

    // --------------------------
    // Render
    // --------------------------
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Configurações</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Aparência */}
                <Text style={styles.sectionTitle}>Aparência</Text>
                <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
                    <View style={styles.settingIcon}>{theme.isDark ? <Sun size={24} color={theme.colors.primary}/> :
                        <Moon size={24} color={theme.colors.primary}/>}</View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Tema</Text>
                        <Text
                            style={styles.settingDescription}>{theme.isDark ? 'Modo escuro ativo' : 'Modo claro ativo'}</Text>
                    </View>
                </TouchableOpacity>

                {/* Dados */}
                <Text style={styles.sectionTitle}>Dados</Text>

                <TouchableOpacity style={styles.settingItem} onPress={handleRefreshData}>
                    <View style={styles.settingIcon}>
                        <RefreshCw size={24} color={theme.colors.primary}/>
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Atualizar Dados</Text>
                        <Text style={styles.settingDescription}>Recarregar todos os dados do banco local</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
                    <View style={styles.settingIcon}>
                        <Upload size={24} color={theme.colors.success}/>
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Exportar Dados</Text>
                        <Text style={styles.settingDescription}>Salvar dados em arquivo para backup</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={handleImportData}>
                    <View style={styles.settingIcon}>
                        <Download size={24} color={theme.colors.primary}/>
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Importar Dados</Text>
                        <Text style={styles.settingDescription}>Restaurar dados de um arquivo de backup</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
                    <View style={styles.settingIcon}>
                        <Trash2 size={24} color={theme.colors.error}/>
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Limpar Dados</Text>
                        <Text style={styles.settingDescription}>Apagar todos os dados do aplicativo</Text>
                    </View>
                </TouchableOpacity>

                {/* Banco de Dados */}
                <Text style={styles.sectionTitle}>Banco de Dados</Text>
                <Card>
                    <View style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Database size={24} color={theme.colors.primary}/>
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>SQLite Local</Text>
                            <Text style={styles.settingDescription}>Banco de dados local do dispositivo</Text>
                            <View style={styles.databaseInfo}>
                                <Text style={styles.databaseInfoText}>
                                    Para migrar para Supabase ou Neon.tech, consulte o README.md
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>

                {/* Sobre */}
                <Card style={styles.aboutCard}>
                    <Info size={32} color={theme.colors.primary}/>
                    <Text style={styles.appName}>Controle de Estoque</Text>
                    <Text style={styles.appVersion}>Versão 1.0.0</Text>
                    <Text style={styles.appDescription}>
                        Aplicativo desenvolvido com Expo SDK 53, React Native 0.79 e TypeScript.
                        Arquitetura preparada para escalabilidade e migração de banco de dados.
                    </Text>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
