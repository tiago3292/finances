import { act, useCallback, useState } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { View, Text, FlatList, Pressable, RefreshControl, Alert, Platform, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getItems, deleteItem } from "../api/items";
import { useAuth } from "../contexts/AuthContext";
import { saveItemsCache, loadItemsCache } from "../storage/cache";
import { formatCurrency, formatDateTime } from "../utils/format";
import * as ImagePicker from "expo-image-picker";
import { uploadFile, deleteFile } from "../api/uploads";

function confirmDelete(title) {
    if (Platform.OS === "web") {
        return Promise.resolve(window.confirm(`Excluir "${title}"?`));
    }
    return new Promise((resolve) => {
        Alert.alert(
            "Excluir transação",
            `Excluir "${title}"?`,
            [
                { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
                { text: "Excluir", style: "destructive", onPress: () => resolve(true) },
            ],
            { cancelable: true, onDismiss: () => resolve(false) }
        );
    });
}

export default function Index() {
    const { signOut } = useAuth();
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [offlineSavedAt, setOfflineSavedAt] = useState(null);
    const [uploadingId, setUploadingId] = useState(null);

    const loadItems = useCallback(async () => {
        try {
            setError(null);
            setOfflineSavedAt(null);
            const data = await getItems();
            setItems(data);
            saveItemsCache(data).catch(() => {});
        } catch (e) {
            if (e.response) {
                setError("Não foi possível carregar as transações.");
                return;
            }
            const cache = await loadItemsCache();
            if (cache) {
                setItems(cache.items);
                setOfflineSavedAt(cache.savedAt);
            } else {
                setError("Sem conexão e nenhum dado salve neste aparelho.")
            }
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadItems();
        }, [loadItems])
    );

    async function handleRefresh() {
        setRefreshing(true);
        await loadItems();
        setRefreshing(false);
    }

    async function handleDelete(item) {
        const confirmed = await confirmDelete(item.title);
        if (!confirmed) return;

        try {
            await deleteItem(item.id);
            await loadItems();
        } catch (e) {
            setError (
                e.response
                ? "Não foi possível excluir a transação."
                : "Sem conexão: Não é possível excluir offline."
            );
        }
    }

    async function handleAttach(item) {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.7,
        });
        if (result.canceled) return;

        const asset = result.assets[0];

        setUploadingId(item.id);
        try {
            await uploadFile(item.id, asset);
            await loadItems();
        } catch (e) {
            const detail = e.response?.data?.detail;
            if (typeof detail === "string") {
                setError(detail);
            } else {
                setError(
                    e.response
                    ? "Não foi possível enviar o comprovante."
                    : "Sem conexão: Não é possível enviar offline."
                );
            }
        } finally {
            setUploadingId(null);
        }
    }

    async function handleRemoveFile(item) {
        try {
            await deleteFile(item.uploaded_file);
            await loadItems();
        } catch (e) {
            setError(
                e.response
                ? "Não foi possível remover o comprovante."
                : "Sem conexão: Não é possível remover offline."
            );
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Transações</Text>
                <View style={styles.headerActions}>
                    <Pressable onPress={() => router.push("/new-item")}>
                        <Text style={styles.add}>+ Nova</Text>
                    </Pressable>
                    <Pressable onPress={() => router.push("/dashboard")}>
                        <Text style={styles.add}>Resumo</Text>
                    </Pressable>
                    <Pressable onPress={signOut}>
                        <Text style={styles.logout}>Sair</Text>
                    </Pressable>
                </View>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            {offlineSavedAt && (
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>
                        Sem conexão. Mostrando dados salvos em {formatDateTime(offlineSavedAt)}.
                    </Text>
                </View>
            )}

            <FlatList
                data={items}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardTop}>
                            <View style={styles.cardInfo}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemCategory}>{item.category}</Text>
                            </View>
                            <Text
                                style={[
                                    styles.itemValue,
                                    item.type === "ganho" ? styles.earning : styles.expense,
                                ]}
                            >
                                {item.type === "gasto" ? "- " : "+ "}
                                {formatCurrency(item.value)}
                            </Text>
                        </View>

                        {item.uploaded_file && (
                            <Image
                                source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/static/${item.uploaded_file}` }}
                                style={styles.thumb}
                                resizeMode="cover"
                            />
                        )}

                        <View style={styles.cardActions}>
                            {item.uploaded_file ? (
                                <Pressable onPress={() => handleRemoveFile(item)} hitSlop={8}>
                                    <Text style={styles.action}>Remover comprovante</Text>
                                </Pressable>
                            ) : (
                                Platform.OS !== "web" && (
                                    <Pressable
                                        onPress={() => handleAttach(item)}
                                        disabled={uploadingId === item.id}
                                        hitSlop={8}
                                    >
                                        <Text style={styles.action}>
                                            {uploadingId === item.id ? "Enviando..." : "Anexar comprovante"}
                                        </Text>
                                    </Pressable>
                                )
                            )}
                            <Pressable onPress={() => handleDelete(item)} hitSlop={8}>
                                <Text style={styles.delete}>Excluir</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={<Text style={styles.empty}>Nenhuma transação ainda.</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16 },
    header: {flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16},
    headerActions: { flexDirection: "row", gap: 16 },
    add: { color: "#2563eb", fontWeight: "600" },
    delete: { color: "#dc2626", fontSize: 12 },
    title: { fontSize: 24, fontWeight: "bold" },
    logout: { color: "#dc2626", fontWeight: "600" },
    error: { color: "#dc2626", marginBottom: 8 },
    card: { padding: 14, borderRadius: 10, backgroundColor: "#f3f4f6", marginBottom: 10 },
    cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    cardInfo: { flex: 1, marginRight: 8 },
    cardActions: { flexDirection: "row", justifyContent: "flex-end", gap: 16, marginTop: 10 },
    action: { color: "#2563eb", fontSize: 12},
    itemTitle: { fontSize: 16, fontWeight: "600" },
    itemCategory: { color: "#6b7280", fontWeight: "bold" },
    earning: { color: "#16a34a" },
    expense: { color: "#dc2626" },
    empty: { textAlign: "center", marginTop: 40, color: "#6b7280" },
    banner: { backgroundColor: "#fef3c7", padding: 10, borderRadius: 8, marginBottom: 10 },
    bannerText: { color: "#92400e" },
    thumb: { width: "100%", height: 140, borderRadius: 8, marginTop: 10 },
});