import { useCallback, useState } from 'react'
import { View, Text, FlatList, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { walletApi, getErrorMessage } from '../api'
import { fmtVND, walletTypeLabel } from '../format'

export default function WalletsScreen() {
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const res = await walletApi.getAll()
      setWallets(res.data)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

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

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      data={wallets}
      keyExtractor={(w) => String(w.id)}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            load()
          }}
        />
      }
      ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : null}
      ListEmptyComponent={<Text style={styles.empty}>Bạn chưa có ví nào.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.type}>{walletTypeLabel[item.type] || item.type}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.balance}>{fmtVND(item.balance)}</Text>
        </View>
      )}
    />
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
  empty: { color: '#64748b', textAlign: 'center', paddingVertical: 30 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  type: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  name: { fontSize: 17, fontWeight: '800', color: '#0f172a', marginVertical: 2 },
  balance: { fontSize: 20, fontWeight: '800', color: '#2563eb', marginTop: 4 },
})