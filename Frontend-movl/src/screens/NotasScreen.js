import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import API from '../services/api';

const NotasScreen = ({ route }) => {
    const { idUsuario } = route.params; // Se recibe desde el login o el perfil
    const [loading, setLoading] = useState(true);
    const [datos, setDatos] = useState(null);

    useEffect(() => {
        obtenerNotas();
    }, []);

   const obtenerNotas = async () => {
    try {
        setLoading(true);
        
        // URL FINAL: baseURL + /app/actuales/ID
       // En tu NotasScreen.js
            const response = await API.get(`/actuales/${idUsuario}`);
        
        if (response.data.success) {
            setDatos(response.data.data);
            console.log("Notas cargadas con éxito");
        }
    } catch (error) {
        console.error("Error al traer notas:", error.response?.status);
        // Si sale 404 aquí, revisa que el archivo appMobileRoutes.js 
        // realmente tenga el router.get("/actuales/:idUsuario")
    } finally {
        setLoading(false);
    }
};

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
    }

    const renderMateria = ({ item }) => (
        <View style={styles.notaRow}>
            <View style={styles.materiaInfo}>
                <Text style={styles.materiaCodigo}>{item.materia_codigo}</Text>
                <Text style={styles.materiaNombre}>{item.materia_nombre}</Text>
            </View>
            <Text style={styles.notaFinalText}>
                {item.promedio_actual ? parseFloat(item.promedio_actual).toFixed(1) : '0.0'}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cardMain}>
                <View style={styles.headerTable}>
                    <Text style={styles.headerText}>📅 CICLO 01/26</Text>
                    <Text style={styles.headerText}>NOTA FINAL</Text>
                </View>

                <FlatList
                    data={datos?.notas}
                    keyExtractor={(item) => item.materia_codigo}
                    renderItem={renderMateria}
                    contentContainerStyle={styles.listContent}
                />
            </View>

            {/* Cuadro de Resumen Inferior */}
            <View style={styles.resumenContainer}>
                <View style={styles.resumenItem}>
                    <Text style={styles.resumenLabel}>Total UV</Text>
                    <Text style={styles.resumenValue}>{datos?.resumen.totalUV}</Text>
                </View>
                <View style={styles.resumenItem}>
                    <Text style={styles.resumenLabel}>Nota * UV</Text>
                    <Text style={styles.resumenValue}>{datos?.resumen.notaUV}</Text>
                </View>
                <View style={styles.resumenItem}>
                    <Text style={styles.resumenLabel}>CUM de ciclo</Text>
                    <Text style={styles.resumenValue}>{datos?.resumen.cumCiclo}</Text>
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