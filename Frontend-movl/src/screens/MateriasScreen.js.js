import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import API from '../services/api';

const MateriasScreen = ({ navigation }) => {

    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerMaterias();
    }, []);

    const obtenerMaterias = async () => {

        try {

            const raw = await AsyncStorage.getItem('usuario');

            const usuario = JSON.parse(raw);

            const idUsuario =
                usuario.idUsuario || usuario.idusuario;

            const response = await API.get(
                `/actuales/${idUsuario}`
            );

            console.log(response.data);

            if (response.data.success) {

                setMaterias(
                    response.data.data.notas
                );

            }

        } catch (error) {

            console.log(error);

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

    const renderItem = ({ item }) => (

        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate(
                    'NotasDetalle',
                    { materia: item }
                )
            }
        >

            <View style={{ flex: 1 }}>

                <Text style={styles.codigo}>
                    {item.materia_codigo}
                </Text>

                <Text style={styles.nombre}>
                    {item.materia_nombre}
                </Text>

            </View>

            <Text style={styles.promedio}>
                {item.promedio_actual || '0'}
            </Text>

        </TouchableOpacity>
    );

    return (

        <SafeAreaView style={styles.container}>

            <Text style={styles.titulo}>
                Ciclo actual
            </Text>

            <FlatList
                data={materias}
                keyExtractor={(item, index) =>
                    index.toString()
                }
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingBottom: 20
                }}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 15
    },

    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3
    },

    codigo: {
        fontSize: 12,
        color: '#777'
    },

    nombre: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 5
    },

    promedio: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2196F3'
    }

});

export default MateriasScreen;