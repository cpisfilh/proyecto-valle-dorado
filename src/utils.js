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


export function parseFechaReferenciaUTC(dateStr) {
    const date = new Date(dateStr);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }

export function numeroALetras(num) {
    console.log(num);
    const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  
    function seccion(n) {
      let texto = '';
      if (n === 100) return 'cien';
      if (n > 99) {
        texto += centenas[Math.floor(n / 100)] + ' ';
        n %= 100;
      }
      if (n >= 10 && n <= 19) {
        texto += especiales[n - 10];
      } else if (n >= 20 && n < 30) {
        if (n === 20) {
          texto += 'veinte';
        } else {
          texto += 'veinti' + unidades[n % 10];
        }
      } else {
        if (n >= 30) {
          texto += decenas[Math.floor(n / 10)];
          if (n % 10 > 0) texto += ' y ' + unidades[n % 10];
        } else if (n > 0) {
          texto += unidades[n];
        }
      }
      return texto.trim();
    }
  
    function miles(n) {
      if (n < 1000) return seccion(n);
      if (n < 2000) return 'mil ' + seccion(n % 1000);
      return seccion(Math.floor(n / 1000)) + ' mil ' + seccion(n % 1000);
    }
  
    function millones(n) {
      if (n < 1000000) return miles(n);
      if (n < 2000000) return 'un millón ' + miles(n % 1000000);
      return seccion(Math.floor(n / 1000000)) + ' millones ' + miles(n % 1000000);
    }
  
    function capitalizar(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function ajustarUnMil(texto) {
        return texto
          .replace(/\bveintiuno mil\b/i, 'veintiún mil')
          .replace(/\btreinta y uno mil\b/i, 'treinta y un mil')
          .replace(/\bcuarenta y uno mil\b/i, 'cuarenta y un mil')
          .replace(/\bcincuenta y uno mil\b/i, 'cincuenta y un mil')
          .replace(/\bsesenta y uno mil\b/i, 'sesenta y un mil')
          .replace(/\bsetenta y uno mil\b/i, 'setenta y un mil')
          .replace(/\bochenta y uno mil\b/i, 'ochenta y un mil')
          .replace(/\bnoventa y uno mil\b/i, 'noventa y un mil')
          .replace(/\buno mil\b/i, 'mil'); // por si acaso
      }
      
  
    const [enteroStr] = num.toString().split('.');
    const entero = parseInt(enteroStr, 10);
  
    let resultado = millones(entero).trim();
  
    return capitalizar(ajustarUnMil(resultado));
  }