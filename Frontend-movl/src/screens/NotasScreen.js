import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import API from '../services/api';

const NotasScreen = ({ route }) => {
    const [idUsuario, setIdUsuario] = useState(
        route?.params?.idUsuario || route?.params?.params?.idUsuario || null
    );
    const [loading, setLoading] = useState(true);
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState(null);
    const isFocused = useIsFocused();

    // Obtener idUsuario desde AsyncStorage si no vino por params
    useEffect(() => {
        const resolverIdUsuario = async () => {
            if (idUsuario) return;
            try {
                const raw = await AsyncStorage.getItem('usuario');
                if (raw) {
                    const u = JSON.parse(raw);
                    setIdUsuario(u.idUsuario || u.idusuario);
                }
            } catch {}
        };
        resolverIdUsuario();
    }, []);

    // Recargar cuando el tab recibe foco
    useEffect(() => {
        if (isFocused && idUsuario) obtenerNotas();
    }, [isFocused, idUsuario]);

    const obtenerNotas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await API.get(`/actuales/${idUsuario}`);
            if (response.data.success) {
                setDatos(response.data.data);
            } else {
                setError('No se encontraron notas.');
            }
        } catch (err) {
            setError('Error al conectar con el servidor.');
            console.error('Error notas:', err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
    }

    if (error || !datos) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#666', fontSize: 16 }}>{error || 'Sin inscripciones activas.'}</Text>
                </View>
            </SafeAreaView>
        );
    }

    const renderMateria = ({ item }) => (
        <View style={styles.notaRow}>
            <View style={styles.materiaInfo}>
                <Text style={styles.materiaCodigo}>{item.materia_codigo}</Text>
                <Text style={styles.materiaNombre}>{item.materia_nombre}</Text>
            </View>
            <Text style={[styles.notaFinalText, { color: parseFloat(item.promedio_actual) >= 6 ? '#2E7D32' : '#C62828' }]}>
                {item.promedio_actual ? parseFloat(item.promedio_actual).toFixed(1) : '0.0'}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cardMain}>
                <View style={styles.headerTable}>
                    <Text style={styles.headerText}>📅 CICLO ACTUAL</Text>
                    <Text style={styles.headerText}>NOTA FINAL</Text>
                </View>

                {datos.notas.length === 0 ? (
                    <View style={{ padding: 30, alignItems: 'center' }}>
                        <Text style={{ color: '#999' }}>No hay materias inscritas activas.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={datos.notas}
                        keyExtractor={(item) => item.materia_codigo}
                        renderItem={renderMateria}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>

            <View style={styles.resumenContainer}>
                <View style={styles.resumenItem}>
                    <Text style={styles.resumenLabel}>Total UV</Text>
                    <Text style={styles.resumenValue}>{datos.resumen?.totalUV ?? '0.0'}</Text>
                </View>
                <View style={styles.resumenItem}>
                    <Text style={styles.resumenLabel}>Nota * UV</Text>
                    <Text style={styles.resumenValue}>{datos.resumen?.notaUV ?? '0.0'}</Text>
                </View>
                <View style={styles.resumenItem}>
                    <Text style={styles.resumenLabel}>CUM de ciclo</Text>
                    <Text style={styles.resumenValue}>{datos.resumen?.cumCiclo ?? '0.0'}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5', padding: 15 },
    cardMain: { 
        backgroundColor: '#FFF', 
        borderRadius: 15, 
        elevation: 3, 
        marginBottom: 20,
        overflow: 'hidden'
    },
    headerTable: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#EEE' 
    },
    headerText: { fontWeight: 'bold', color: '#333' },
    listContent: { paddingBottom: 10 },
    notaRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 15, 
        borderBottomWidth: 0.5, 
        borderBottomColor: '#F0F0F0' 
    },
    materiaInfo: { flex: 0.8 },
    materiaCodigo: { fontSize: 12, color: '#666' },
    materiaNombre: { fontSize: 14, fontWeight: '500' },
    notaFinalText: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
    resumenContainer: { 
        flexDirection: 'row', 
        backgroundColor: '#E0E0E0', 
        borderRadius: 15, 
        padding: 15, 
        justifyContent: 'space-around' 
    },
    resumenItem: { alignItems: 'center' },
    resumenLabel: { fontSize: 12, color: '#555' },
    resumenValue: { fontSize: 16, fontWeight: 'bold', color: '#333' }
});

export default NotasScreen;
