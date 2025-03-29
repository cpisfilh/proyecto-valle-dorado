import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Open Sans',
    fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 1000 }
    ]
    });
// Estilos para el documento
const styles = StyleSheet.create({
    page: {
        padding: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 80,
        marginRight: 20,
    },
    title: {
        fontFamily: 'Open Sans',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        paddingRight: 50
    },
    section: {
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
    bold: {
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
    },
});

// Componente del recibo
const Recibo = ({ data }) => {
    if (!data) {
        return (
            <Document>
                <Page size="A4" style={styles.page}></Page>
                    <View style={styles.header}>
                        <Image src="/img/logo_pdf.png" style={styles.logo} />
                        <Text style={styles.title}>RECIBO DE DINERO</Text>
                    </View>
            </Document>
        );
    }

    return (
        <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Image src="/img/logo_pdf.png" style={styles.logo} />
                <Text style={styles.title}>RECIBO DE DINERO</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.text}>
                    Recibo de {" "}
                    {
                        data.persona && data.persona.map((persona, index, array) => (
                            <Text key={index}>
                                <Text style={styles.bold}>{persona.nombre}</Text> identificado(a) con DNI N° <Text style={styles.bold}>{persona.dni}</Text>
                                {index < array.length - 2 && ", "} {/* Agrega una coma si no es el penúltimo */}
                                {index === array.length - 2 && " y "} {/* Agrega "y" antes del último */}
                            </Text>
                        ))
                    }
                    , la cantidad de <Text style={styles.bold}>S/ {" "}{data.montoRecibo}</Text>{" "}
                    ({`${data.montoReciboTexto} nuevos soles con ${data.centavosRecibo}/100`}), por concepto de {data.concepto} por el {" "}
                    <Text style={styles.bold}>lote {data.predio.lote} mz. {data.predio.manzana} del proyecto para casas
                        de campo Valle Dorado</Text>, ubicado en distrito y provincia de Sullana, departamento de Plura
                    (Predio rústico La Capilla RC 18882).
                </Text>
                <Text style={styles.text}>
                    Será descontado del monto total del precio que es <Text style={styles.bold}>S/ {" "}{data.montoTotal}</Text> ({`${data.montoTotalTexto} nuevos soles con ${data.centavosTotal}/100`}) del lote según lo establecido en el acuerdo.
                </Text>
                <Text style={styles.text}>
                    Forma de pago: <Text style={styles.bold}>{data.tipoPago}</Text>
                </Text>
                <Text style={styles.text}>
                    Fecha de pago: <Text style={styles.bold}>{data.fecha}</Text>
                </Text>
            </View>
        </Page>
    </Document>
    )
}

export default Recibo;