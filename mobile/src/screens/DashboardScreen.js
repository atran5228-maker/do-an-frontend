import { useCallback, useState } from 'react'
import { View, Text, ScrollView, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { walletApi, transactionApi, getErrorMessage } from '../api'
import { fmtVND, fmtDate } from '../format'

export default function DashboardScreen() {
  const [wallets, setWallets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const [wRes, tRes] = await Promise.all([walletApi.getAll(), transactionApi.getAll()])
      setWallets(wRes.data)
      setTransactions(tRes.data)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Mỗi lần mở tab này, tải lại dữ liệu mới
  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  const now = new Date()
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthTx = transactions.filter((t) => (t.transaction_date || '').startsWith(prefix))
  const sum = (list, type) =>
    list.filter((t) => t.type === type).reduce((s, t) => s + Number(t.amount), 0)

  const totalBalance = wallets.reduce((s, w) => s + Number(w.balance), 0)
  const income = sum(monthTx, 'income')
  const expense = sum(monthTx, 'expense')

  const recent = [...transactions]
    .sort((a, b) => String(b.transaction_date).localeCompare(String(a.transaction_date)))
    .slice(0, 6)

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            load()
          }}
        />
      }
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Tổng số dư</Text>
        <Text style={styles.balanceValue}>{fmtVND(totalBalance)}</Text>
        <Text style={styles.balanceSub}>{wallets.length} ví</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.miniCard, { borderColor: '#bbf7d0' }]}>
          <Text style={styles.miniLabel}>Thu tháng {now.getMonth() + 1}</Text>
          <Text style={[styles.miniValue, { color: '#059669' }]}>{fmtVND(income)}</Text>
        </View>
        <View style={[styles.miniCard, { borderColor: '#fecdd3' }]}>
          <Text style={styles.miniLabel}>Chi tháng {now.getMonth() + 1}</Text>
          <Text style={[styles.miniValue, { color: '#e11d48' }]}>{fmtVND(expense)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
      {recent.length === 0 ? (
        <Text style={styles.empty}>Chưa có giao dịch nào.</Text>
      ) : (
        recent.map((t) => (
          <View key={t.id} style={styles.txRow}>
            <Text style={styles.txIcon}>{t.Category?.icon || '🏷️'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.txName}>{t.Category?.name || 'Khác'}</Text>
              <Text style={styles.txSub}>
                {t.Wallet?.name} · {fmtDate(t.transaction_date)}
              </Text>
            </View>
            <Text style={[styles.txAmount, { color: t.type === 'income' ? '#059669' : '#e11d48' }]}>
              {t.type === 'income' ? '+' : '-'}
              {fmtVND(t.amount)}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  error: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  balanceCard: { backgroundColor: '#2563eb', borderRadius: 16, padding: 20, marginBottom: 12 },
  balanceLabel: { color: '#bfdbfe', fontWeight: '600' },
  balanceValue: { color: '#ffffff', fontSize: 28, fontWeight: '800', marginVertical: 4 },
  balanceSub: { color: '#bfdbfe', fontSize: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  miniCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  miniLabel: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  miniValue: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 10 },
  empty: { color: '#64748b', textAlign: 'center', paddingVertical: 20 },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  txIcon: { fontSize: 22, marginRight: 12 },
  txName: { fontWeight: '700', color: '#0f172a' },
  txSub: { color: '#64748b', fontSize: 12, marginTop: 2 },
  txAmount: { fontWeight: '800' },
})