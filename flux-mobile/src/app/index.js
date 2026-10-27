import { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getItems } from "../api/items";
import { useAuth } from "../contexts/AuthContext";

function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Index() {
    const { signOut } = useAuth();
    const [items, setItems] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const loadItems = useCallback(async () => {
        try {
            setError(null);
            const data = await getItems();
            setItems(data);
        } catch (e) {
            setError("Não foi possível carregar as transações.");
        }
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    async function handleRefresh() {
        setRefreshing(true);
        await loadItems();
        setRefreshing(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Transações</Text>
                <Pressable onPress={signOut}>
                    <Text style={styles.logout}>Sair</Text>
                </Pressable>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <FlatList
                data={items}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemCategory}>{item.category}</Text>
                        </View>
                        <Text
                            style={[
                                styles.itemValue,
                                item.type === "ganho" ? styles.earning: styles.expense,
                            ]}
                        >
                            {item.type === "gasto" ? "- " : "+ "}
                            {formatCurrency(item.value)}
                        </Text>
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
    title: { fontSize: 24, fontWeight: "bold" },
    logout: { color: "#dc2626", fontWeight: "600" },
    error: { color: "#dc2626", marginBottom: 8 },
    card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, borderRadius: 10, backgroundColor: "#f3f4f6", marginBottom: 10 },
    itemTitle: { fontSize: 16, fontWeight: "600" },
    itemCategory: { color: "#6b7280", fontWeight: "bold" },
    earning: { color: "#16a34a" },
    expense: { color: "#dc2626" },
    empty: { textAlign: "center", marginTop: 40, color: "#6b7280" },
});