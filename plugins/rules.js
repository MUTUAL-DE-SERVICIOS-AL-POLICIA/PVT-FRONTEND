'use strict'

export default (context, inject) => {
  const Rules = {
    sinDato() {
      return 'Dato no encontrado'
    },
    obligatoria(campo, msg) {
      return v => !!v || (msg || `Campo requerido ${campo}`)
    },
    obligatoriaIncluyendoCero(msg) {
      return v => (!!v || v === 0) || (msg || 'Campo requerido')
    },
    obligatoriaExcluyendoCero(msg) {
      return v => {
        const validNumber = /^[1-9]\d*$/;
        return validNumber.test(v) || (msg || 'El campo no puede ser cero o contener ceros a la izquierda');
      }
    },
    obligatoriaSiCondicion(condicion, msg) {
      return v => (!!v || !condicion) || (msg || 'Campo requerido')
    },
    obligatoriaSiExiste(msg) {
      return v => (v === '' ? true : !!v) || (msg || 'Campo requerido')
    },
    soloNumeros(msg) {
      return v => /^[0-9]*$/.test(v) || (msg || 'Solamente se permiten números')
    },
    soloNumerosRango(min, max, msg) {
      return v => (/^[0-9]*$/.test(v) && parseInt(v) >= min && parseInt(v) <= max) || (msg || `Solamente se permiten números en el rango de ${min} a ${max}`)
    },
    soloNumerosSiExiste(msg) {
      return v => v => (v === '' || v === null ? true : /^[0-9]*$/.test(v)) || (msg || 'Solamente se permiten números')
    },
    soloNumerosYLetras(msg) {
      return v => /^[A-Za-z0-9-]*$/.test(v) || (msg || 'Solamente se permiten números y letras')
    },
    soloLetras(msg) {
      return v => /^[A-Za-z ]*$/.test(v) || (msg || 'Solamente se permiten letras')
    },
    soloLetrasSiExiste(msg) {
      return v => (v === '' ? true : /^[ A-Za-z]*$/.test(v)) || (msg || 'Solamente se permiten letras')
    },
    soloLetrasBarraBajaMedia(msg) {
      return v => (v === '' ? true : /^[ A-Za-zñÑÁáÉéÍíóÓúÚ_.]*$/.test(v)) || (msg || 'Solamente se permiten letras')
    },
    soloLetrasEsp(msg) {
      return v => /^[ A-Za-zñÑÁáÉéÍíóÓúÚüÜ]*$/.test(v) || (msg || 'Solamente se permiten letras')
    },
    soloLetrasCasosEsp(msg) {
      return v => /^[ A-Za-zñÑÁáÉéÍíóÓúÚüÜ'"-_.]*$/.test(v) || (msg || 'Solamente se permiten letras y caracteres especiales permitidos')
    },
    soloLetrasCasosSiExiste(msg) {
      return v => (v === '' ? true : /^[ A-Za-zñÑÁáÉéÍíóÓúÚüÜ"'-_.]*$/.test(v)) || (msg || 'Solamente se permiten letras')
    },
    soloLetrasEspSiExiste(msg) {
      return v => (v === '' ? true : /^[ A-Za-zñÑÁáÉéÍíóÓúÚüÜ]*$/.test(v)) || (msg || 'Solamente se permiten letras')
    },
    formatoCorreo(msg) {
      return v => (v && /^.+@[^.].*\.[a-zA-Z]{2,}$/.test(v)) || (msg || 'Formato de correo inválido')
    },
    formatoPassword(msg) {
      return v => /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W_]){1,})(?!.*\s).{8,}$/.test(v) || (msg || 'Debe tener al menos 8 caracteres, una letra mayúscula (A-Z), minúscula (a-z), un número (0-9) y un caracter especial, por ejemplo ( @ # $ % ^ & * ç )')
    },
    sinCaracteresEspeciales(msg) {
      return v => /^[a-zA-Z0-9-_/.*(),.;:=#°ñÑÁáÉéÍíóÓúÚüÜ ]+$/.test(v) || (msg || 'Carácter especial no permitido')
    },
    tamanioDocumento(val, msg) {
      return v => (v === '' || v === null || (v != null && v.size < val)) || 'El tamaño del archivo no puede exceder más de ' + val + ' bytes'
    },
    soloNumerosFloat(msg) {
      return v => /^[0-9.]*$/.test(v) || (msg || 'Solamente se permiten números')
    },
    longitudMinima(val, msg) {
      return v => v && v.length > 0 ? v.length >= (val || 0) || (msg || `Al menos ${val || 0} carácteres permitidos`) : true
    },
    longitudMaxima(val, msg) {
      return v => v && v.length > 0 ? v.length <= (val || 100) || (msg || `Máximo ${val || 100} carácteres permitidos`) : true
    },
    formatoFecha(val, msg) {
      return v => (v && /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](18|19|20|21|22|23)\d\d$/.test(v)) || (msg || `Fecha no válida`)
    },
    formatoFechaSiExiste(msg) {
      return v => (v === '' || v === null ? true : /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](18|19|20|21|22|23)\d\d$/.test(v)) || (msg || `Fecha no válida`)
    },
    formatoComplementoMayusculas(msg) {
      return v => (v && /^CH$|^LP$|^CB$|^OR$|^PT$|^TJ$|^SC$|^BN$|^PN$/.test(v)) || (msg || `Complemento no válido`)
    },
    formatoUrl(msg) {
      return v => (v && /^(http)s?:\/\/(www\.)?([-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}|localhost)\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/i.test(v)) || (msg || `Formato no válido`)
    },
    soloArchivosTipoImagen(msg) {
      return v => {
        if (v !== null && v !== undefined) {
          const regex = /\.(jpeg|jpg|png)$/i
          const isValid = regex.test(v.name)
          return isValid ?? (msg || 'Solo se permiten archivos JPEG, JPG o PNG')
        }
        return false
      }
    },
    soloArchivoCSV(msg) {
      return v => {
        if (v !== null && v !== undefined) {
          const regex = /\.(csv)$/i
          const isValid = regex.test(v.name)
          return isValid ?? (msg || 'Solo se permite archivo CSV')
        }
        return false
      }
    }
    // pasaporte rules
    // pasaporteRules: [v => !!v || 'Este campo es requerido pasaporte', v => /^[A-Za-z0-9]{1,4}-[0-9]{1,10}$/.test(v) || 'En nro de pasaporte no es válido'],
    // numero cuenta rules
    // nroCuentaRules: [v => !!v || 'Nro de cuenta es requerido', v => /^[0-9-]+$/.test(v) || 'El número de cuenta no es válido'],
  }

  inject('rules', Rules)
}
