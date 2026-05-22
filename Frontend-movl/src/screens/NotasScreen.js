import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import API from '../services/api';

const NotasScreen = ({ route }) => {

    const [idUsuario, setIdUsuario] = useState(
        route?.params?.idUsuario ||
        route?.params?.params?.idUsuario ||
        null
    );

    const [loading, setLoading] = useState(true);
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState(null);

    const isFocused = useIsFocused();

    useEffect(() => {

        const resolverIdUsuario = async () => {

            if (idUsuario) return;

            try {

                const raw = await AsyncStorage.getItem('usuario');

                if (raw) {

                    const u = JSON.parse(raw);

                    setIdUsuario(
                        u.idUsuario || u.idusuario
                    );
                }

            } catch {}

        };

        resolverIdUsuario();

    }, []);

    useEffect(() => {

        if (isFocused && idUsuario) {
            obtenerNotas();
        }

    }, [isFocused, idUsuario]);

    const obtenerNotas = async () => {

        try {

            setLoading(true);
            setError(null);

            const response = await API.get(
                `/actuales/${idUsuario}`
            );

            console.log(response.data);

            if (response.data.success) {

                setDatos(response.data.data);

            } else {

                setError('No se encontraron notas.');

            }

        } catch (err) {

            console.error(err);

            setError('Error al conectar con servidor.');

        } finally {

            setLoading(false);

        }
    };

    if (loading) {

        return (
            <ActivityIndicator
                size="large"
                color="#2196F3"
                style={{ flex: 1 }}
            />
        );
    }

    if (error || !datos) {

        return (
            <SafeAreaView style={styles.container}>
                <Text>{error}</Text>
            </SafeAreaView>
        );
    }

    const renderMateria = ({ item, index }) => (

        <View style={styles.card}>

            <Text style={styles.tituloMateria}>
                {item.materia_nombre}
            </Text>

            <View style={styles.fila}>
                <Text style={styles.label}>Primer parcial</Text>
                <Text style={styles.valor}>
                    {item.nota1 || '00'}
                </Text>
            </View>

            <View style={styles.fila}>
                <Text style={styles.label}>Primer laboratorio</Text>
                <Text style={styles.valor}>
                    {item.nota2 || '00'}
                </Text>
            </View>

            <View style={styles.fila}>
                <Text style={styles.label}>Segundo parcial</Text>
                <Text style={styles.valor}>
                    {item.nota3 || '00'}
                </Text>
            </View>

            <View style={styles.fila}>
                <Text style={styles.label}>Segundo laboratorio</Text>
                <Text style={styles.valor}>
                    {item.nota4 || '00'}
                </Text>
            </View>

            <View style={styles.fila}>
                <Text style={styles.label}>Parcial final</Text>
                <Text style={styles.valor}>
                    {item.nota5 || '00'}
                </Text>
            </View>

            <View style={styles.linea} />

            <View style={styles.fila}>
                <Text style={styles.finalLabel}>
                    Nota final
                </Text>

                <Text style={styles.finalValor}>
                    {item.promedio_actual || '00'}
                </Text>
            </View>

        </View>
    );

    return (

        <SafeAreaView style={styles.container}>

            <Text style={styles.titulo}>
                Ciclo actual
            </Text>

            <FlatList
                data={datos.notas}
                keyExtractor={(item, index) =>
                    index.toString()
                }
                renderItem={renderMateria}
                contentContainerStyle={{
                    paddingBottom: 40
                }}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#EAEAEA',
        padding: 15
    },

    titulo: {
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#000'
    },

    card: {
        backgroundColor: '#B9D8E8',
        borderRadius: 25,
        padding: 25,
        marginBottom: 25
    },

    tituloMateria: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#000'
    },

    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },

    label: {
        fontSize: 22,
        color: '#000'
    },

    valor: {
        fontSize: 22,
        color: '#000'
    },

    linea: {
        borderBottomWidth: 3,
        borderBottomColor: '#000',
        marginVertical: 15
    },

    finalLabel: {
        fontSize: 24,
        fontWeight: 'bold'
    },

    finalValor: {
        fontSize: 24,
        fontWeight: 'bold'
    }

});

export default NotasScreen;