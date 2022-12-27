'use strict'
import Moment from 'moment'
export default (context, inject) => {
  const Filters = {
    money (value) {
        if(value == 0) return '0,00'
        else 
        return parseFloat(value).toLocaleString("de-DE", {minimumFractionDigits: 2, maximumFractionDigits: 2})
    },
    thousands (value) {
        if(value == 0) return '0'
        else 
        return parseFloat(value).toLocaleString("de-DE", {minimumFractionDigits: 0, maximumFractionDigits: 0})
    },
    dateTime(value){
      if(value != null)
      return Moment(value).format('DD/MM/YYYY HH:mm:ss')
      else ''
    },
    date(value){
      if(value != null)
      return Moment(value).format('DD/MM/YYYY')
      else ''
    }

  }

  inject('filters', Filters)
}
