export const numeroATexto = (montoTexto) => {
    // Extraer el valor numérico del texto (eliminar "S/" y comas)
    let numero = parseFloat(montoTexto.replace("S/", "").replace(/,/g, ""));

    const unidades = ["", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const especiales = ["once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
    const especiales2 = ["dieci", "veinti"];
    const centenas = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

    if (numero === 0) return "cero";

    let texto = "";

    // Convertir la parte entera
    let entero = Math.floor(numero);
    if (entero >= 1000) {
        const miles = Math.floor(entero / 1000);
        texto += (miles === 1 ? "mil" : unidades[miles] + " mil") + " ";
        entero %= 1000;
    }
    if (entero >= 100) {
        const cientos = Math.floor(entero / 100);
        texto += centenas[cientos] + " ";
        entero %= 100;
    }
    if (entero >= 20) {
        if (entero < 30) {
            texto += especiales2[Math.floor(entero / 10) - 1] + unidades[entero % 10] + " ";
        } else {
            texto += decenas[Math.floor(entero / 10)];
            if (entero % 10 !== 0) {
                texto += " y " + unidades[entero % 10];
            }
            texto += " ";
        }
        entero = 0;
    } else if (entero >= 11) {
        texto += especiales[entero - 11] + " ";
        entero = 0;
    }
    if (entero > 0 && entero < 10) {
        texto += unidades[entero] + " ";
    }

    // Convertir los céntimos
    const centavos = Math.round((numero - Math.floor(numero)) * 100);
    texto += `nuevos soles con ${centavos.toString().padStart(2, "0")}/100`;

    return texto.trim();
};
