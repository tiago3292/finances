import { useCallback, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { getDashboard, getCurrentUser } from "../api/users";
import { formatCurrency } from "../utils/format";
import { useAuth } from "../contexts/AuthContext";

function toEntries(value) {
    return value && typeof value === "object" ? Object.entries(value) : [];
}

export default function Dashboard() {
    const router = useRouter();
    const { signOut } = useAuth();
    const [data, setData] = useState(null);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useFocusEffect(
        useCallback(() => {
            async function load() {
                try {
                    setError(null);
                    const [dashboard, user] = await Promise.all([getDashboard(), getCurrentUser()]);
                    setData(dashboard);
                    setUsername(user.username);
                } catch (e) {
                    setError(e.response ? "Não foi possível carregar o resumo." : "sem conexção com o servidor.");
                } finally {
                    setLoading(false);
                }
            }
            load();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
                <Pressable onPress={() => router.back()}>
                    <Text style={styles.link}>Voltar</Text>
                </Pressable>
            </View>
        );
    }

    const saldo = Number(data["Saldo atual"] ?? 0);
    const gastos = toEntries(data["Resumo de gastos"]);
    const ganhos = toEntries(data["Resumo de ganhos"]);
    const maiorGasto = toEntries(data["Gasto com o maior valor"])[0];
    const maiorGanho = toEntries(data["Ganho com o maior valor"])[0];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Olá, {username}!</Text>
                    <Pressable onPress={() => router.push("/new-item")}>
                        <Text style={styles.add}>+ Nova</Text>
                    </Pressable>
                    <Pressable onPress={() => router.push("/itemsPage")}>
                        <Text style={styles.add}>Transações</Text>
                    </Pressable>
                    <Pressable onPress={signOut}>
                        <Text style={styles.logout}>Sair</Text>
                    </Pressable>
                </View>

                <View style={styles.balanceCard}>
                    <Text style={styles.cardLabel}>Saldo atual</Text>
                    <Text style={[styles.balance, { color: saldo < 0 ? "#dc2626" : "#16a34a" }]}>
                        {formatCurrency(saldo)}
                    </Text>
                </View>

                <View style={styles.row}>
                    <SummaryCard
                        label="Total de ganhos"
                        total={data["Total de ganhos"]}
                        biggest={maiorGanho}
                        color="#16a34a"
                    />
                    <SummaryCard
                        label="Total de gastos"
                        total={data["Total de gastos"]}
                        biggest={maiorGasto}
                        color="#dc2626"
                    />
                </View>

                <CategoryBars title="Ganhos por categoria" entries={ganhos} color="#16a34a" />
                <CategoryBars title="Gastos por categoria" entries={gastos} color="#dc2626" />
            </ScrollView>
        </SafeAreaView>
    );
}

function SummaryCard({ label, total, biggest, color }) {
    return (
        <View style={[styles.card, styles.flex1]}>
            <Text style={styles.cardLabel}>{label}</Text>
            <Text style={[styles.cardValue, { color }]}>{formatCurrency(total)}</Text>
            {biggest && (
                <Text style={styles.biggest}>
                    Maior: {biggest[0]} ({formatCurrency(biggest[1])})
                </Text>
            )}
        </View>
    );
}

function CategoryBars({ title, entries, color }) {
    return (
        <View style={styles.card}>
            <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
            {entries.length === 0 ? (
                <Text style={styles.empty}>Sem dados.</Text>
            ) : (
                entries.map(([categoria, percentual]) => {
                    const pct = parseFloat(String(percentual));
                    return (
                        <View key={categoria} style={styles.barRow}>
                            <View style={styles.barLabels}>
                                <Text style={styles.barName}>{categoria}</Text>
                                <Text style={styles.barPercent}>{pct}%</Text>
                            </View>
                            <View style={styles.barTrack}>
                                <View style={[styles.barFill, { width: `${pct}`, backgroundColor: color }]} />
                            </View>
                        </View>
                    );
                })
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, gap: 12 },
    center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
    header: {flexDirection: "row", justifyContent: "space-between", alignItems: "center"},
    title: { fontSize: 24, fontWeight: "bold" },
    add: { color: "#2563eb", fontWeight: "600" },
    link: { color: "#2563eb", fontWeight: "600" },
    error: { color: "#dc2626" },
    row: { flexDirection: "row", gap: 12 },
    flex1: { flex: 1 },
    card: { backgroundColor: "#f3f4f6", borderRadius: 10, padding: 14 },
    balanceCard: { backgroundColor: "#f3f4f6", borderRadius: 10, padding: 18 },
    cardLabel: { color: "#6b7280", fontSize: 12, textTransform: "uppercase", fontWeight: "600" },
    balance: { fontSize: 32, fontWeight: "bold", marginTop: 4 },
    cardValue: { fontSize: 20, fontWeight: "bold", marginTop: 4 },
    biggest: { color: "#374151", fontSize: 12, marginTop: 8 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
    empty: { color: "#6b7280" },
    barRow: { marginBottom: 10 },
    barLabel: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
    barName: { textTransform: "capitalize" },
    barPercent: { fontWeight: "600" },
    barTrack: { height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, overflow: "hidden" },
    barFill: { height: 8, borderRadius: 4 },
});