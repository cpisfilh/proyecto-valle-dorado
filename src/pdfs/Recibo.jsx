import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { numeroALetras } from '@/utils';

Font.register({
    family: 'Open Sans',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 }
    ]
});
// Estilos para el documento
const styles = StyleSheet.create({
    page: {
        padding: 50,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 10,
        marginTop: 40
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
    watermark: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: 595.28,  // tamaño real A4 en pt
        height: 841.89,
        opacity: 1,
    },
    voucher: {
        width: 250,
        marginTop: 20,
        marginBottom: 20,
        objectFit: 'cover',
    },
    imageContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    }
});

function montoALetras(monto) {
    if (!monto) return;

    // 1. Eliminar comas
    const montoLimpio = monto.replace(/,/g, '');

    // 2. Separar parte entera y decimal
    const [enteros, decimales = '00'] = montoLimpio.split('.');

    // 3. Convertir parte entera a número y pasarla a letras
    const texto = numeroALetras(parseInt(enteros, 10));

    // 4. Formar la salida final
    return `${texto} nuevos soles con ${decimales.padEnd(2, '0')}/100`;
}



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
                {/* Marca de agua */}
                <Image src="/img/MARCAAGUA.jpg" style={styles.watermark} fixed />
                <View style={styles.header}>
                    {/* <Image src="/img/logo_pdf.png" style={styles.logo} /> */}
                    <Text style={styles.title}>RECIBO DE DINERO</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.text}>
                        Recibo de{" "}
                        {
                            data.persona && data.persona.map((persona, index, array) => (
                                <Text key={index}>
                                    <Text style={styles.bold}>{persona.nombre.toUpperCase()}</Text> identificado(a) con DNI N° <Text style={styles.bold}>{persona.dni}</Text>
                                    {index < array.length - 2 && <Text>, </Text>}
                                    {index === array.length - 2 && <Text> y </Text>}
                                </Text>
                            ))
                        }
                        , la cantidad de <Text style={styles.bold}>S/ {data.montoRecibo}</Text>{" "}
                        (<Text>{montoALetras(data.montoRecibo)}</Text>), por concepto de <Text style={styles.bold}>{data.concepto}</Text> por el{" "}
                        <Text style={styles.bold}>lote {data.predio.lote} mz. {data.predio.manzana}</Text> del proyecto para casas
                        de campo <Text style={styles.bold}>Valle Dorado</Text>, ubicado en distrito y provincia de Sullana, departamento de Piura
                        (Predio rústico La Capilla RC 18882).
                    </Text>
                    {/* <Text style={styles.text}>
                    Será descontado del monto total del precio que es <Text style={styles.bold}>S/ {" "}{data.montoTotal}</Text> ({montoALetras(data.montoTotal)}) del lote según lo establecido en el acuerdo.
                </Text> */}
                    <Text style={styles.text}>
                        Forma de pago: <Text style={styles.bold}>{data.tipoPago}</Text>
                    </Text>
                    <Text style={styles.text}>
                        Fecha de pago: <Text style={styles.bold}>{data.fecha}</Text>
                    </Text>
                </View>
                {
                    data.voucher && (
                        <View style={styles.imageContainer}>
                            <Image src={data.voucher} style={styles.voucher} />
                        </View>
                    )
                }
            </Page>
        </Document>
    )
}

export default Recibo;