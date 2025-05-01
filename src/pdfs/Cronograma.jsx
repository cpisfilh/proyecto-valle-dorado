import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 40,
      position: 'relative',
      fontSize: 10,
      fontFamily: 'Helvetica',
    },
    watermark: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: 842, // A4 height in pt
      opacity: 0.8,
    },
    section: {
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 3,
    },
    cell: {
      fontSize: 10,
      paddingVertical: 6,
      paddingHorizontal: 4,
      border: '1px solid #bbb',
      width: '20%',
      textAlign: 'center',
      borderRadius: 2,
    },
    headerCell: {
      backgroundColor: '#e8f1fa', // azul suave
      color: '#2b4d70',
      fontWeight: 'bold',
    },
    title: {
      marginBottom: 16,
      marginTop: 80,
      fontSize: 14,
      textAlign: 'center',
      color: '#1a1a1a',
      fontWeight: 'bold',
    },
    label: {
      fontSize: 10,
      color: '#444',
      marginBottom: 1,
    },
    value: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#111',
    },
  });
  

const chunkArray = (arr, size) =>
  arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

const Cronograma = ({ formData, cuotas, formatearFecha }) => {
  const fechas = cuotas.map((c) => formatearFecha(c.fecha_vencimiento));
  const montos = cuotas.map((c) => parseFloat(c.monto));

  const fechaChunks = chunkArray(fechas, 5);
  const montoChunks = chunkArray(montos, 5);


  return (
    <Document>
      <Page size="A4"  style={styles.page}>
      {/* Marca de agua */}
      <Image src="/img/MARCAAGUA.jpg" style={styles.watermark} fixed />
        <Text style={styles.title}>
          Cronograma de pagos - Lote {formData.predio?.lote}, Mz. {formData.predio?.manzana}
        </Text>

        {/* Info inicial */}
        <View style={styles.section}>
          <Text style={styles.label}>Cliente(s):</Text>
          {
            formData.cliente_pago.map(e =>(
                <Text key={e.cliente_id} style={styles.value}>{e.cliente_nombre + " " + e.cliente_apellido + " - " + e.cliente_dni}</Text>
            ))
          }
        </View>

        {/* Cuotas agrupadas */}
        {fechaChunks.map((grupoFechas, idx) => (
          <View key={idx} style={{ marginBottom: 10 }}>
            {/* Fila de fechas */}
            <View style={styles.row}>
              {grupoFechas.map((fecha, i) => (
                <Text key={i} style={[styles.cell, styles.headerCell]}>
                  {fecha}
                </Text>
              ))}
            </View>
            {/* Fila de montos */}
            <View style={styles.row}>
              {montoChunks[idx]?.map((monto, i) => (
                <Text key={i} style={styles.cell}>
                  S/ {monto.toFixed(2)}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default Cronograma;
