import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function AccountScreen({ user, onLogout }) {
  const name = user?.name || user?.username || ''
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <TouchableOpacity style={styles.logout} onPress={onLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#ffffff', fontSize: 28, fontWeight: '800' },
  name: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  email: { color: '#64748b', marginTop: 4, marginBottom: 24 },
  logout: { backgroundColor: '#ef4444', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 10 },
  logoutText: { color: '#ffffff', fontWeight: '700' },
})