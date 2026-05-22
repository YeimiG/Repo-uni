
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const NotasScreen = ({ route }) => {

    const { materia } = route.params;

    return (

        <SafeAreaView style={styles.container}>

            <Text style={styles.titulo}>
                Ciclo actual
            </Text>

            <View style={styles.card}>

                <Text style={styles.tituloMateria}>
                    {materia.materia_nombre}
                </Text>

                <View style={styles.fila}>
                    <Text style={styles.label}>
                        Primer parcial
                    </Text>

                    <Text style={styles.valor}>
                        {materia.nota1 || '00'}
                    </Text>
                </View>

                <View style={styles.fila}>
                    <Text style={styles.label}>
                        Primer laboratorio
                    </Text>

                    <Text style={styles.valor}>
                        {materia.nota2 || '00'}
                    </Text>
                </View>

                <View style={styles.fila}>
                    <Text style={styles.label}>
                        Segundo parcial
                    </Text>

                    <Text style={styles.valor}>
                        {materia.nota3 || '00'}
                    </Text>
                </View>

                <View style={styles.fila}>
                    <Text style={styles.label}>
                        Segundo laboratorio
                    </Text>

                    <Text style={styles.valor}>
                        {materia.nota4 || '00'}
                    </Text>
                </View>

                <View style={styles.fila}>
                    <Text style={styles.label}>
                        Parcial final
                    </Text>

                    <Text style={styles.valor}>
                        {materia.nota5 || '00'}
                    </Text>
                </View>

                <View style={styles.linea} />

                <View style={styles.fila}>
                    <Text style={styles.finalLabel}>
                        Nota final
                    </Text>

                    <Text style={styles.finalValor}>
                        {materia.promedio_actual || '00'}
                    </Text>
                </View>

            </View>

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
        marginVertical: 20
    },

    card: {
        backgroundColor: '#B9D8E8',
        borderRadius: 25,
        padding: 25
    },

    tituloMateria: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 25
    },

    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },

    label: {
        fontSize: 22
    },

    valor: {
        fontSize: 22
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