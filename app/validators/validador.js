module.exports = {
  cedulaEsValida: function(cedula) {
    var cedulaToNumber=Number(cedula);//Se convierte a numeros la cédula
    if(isNaN(cedulaToNumber)){
      return false;
    }
    else{
      if(cedula.length!=10){
        return false;
      }
      else{
        return true;
      }
    }
  },
  celularEsValida: function(celular) {
    if(celular != undefined && celular != "" ){
      if(celular.length!=10){
        return false;
      }
      else{
        return true;
      }
    }
    else {
      return true;
    }
  },
  camposSonValidos: function(campos,req) {
    for (var i=0; i<campos.length ; i++){
      var field = campos[i];
      if ( req.body[field] == null || req.body[field] == undefined || req.body[field] == "") {
        return false;
      }
    }
    return true;
  },
  parametrosSonValidos: function(datos) {
    campos=["nombreDato","valorDato","unidadDato"];
    for (var i=0; i<datos.length ; i++){
      var field = datos[i];
        if(field.nombreDato == undefined || field.nombreDato == "" || field.valorDato == undefined || field.valorDato == "" || field.unidadDato == undefined || field.unidadDato == ""){
          return false;
        }
    }
    return true;
  },
  validarCedula: function(numeroCedula) {
    /*  True == Fail validation  */
    if(numeroCedula != undefined && numeroCedula != "" ){
      var array = numeroCedula.split('');
      var num = array.length;
      if ( num != 10 ) {
          return true;
      }
      else {
        // Casos especiales
        if ( numeroCedula == '0000000000' || numeroCedula == '2222222222' || numeroCedula == '4444444444' || numeroCedula == '5555555555' || numeroCedula == '7777777777' || numeroCedula == '9999999999' ){
          return true;
        }
        var total = 0;
        var digito = (array[9]*1);
        for(var i=0; i < (num-1); i++ ){
          var mult = 0;
          if ( ( i%2 ) !== 0 ) {
            total = total + ( array[i] * 1 );
          }
          else {
            mult = array[i] * 2;
            if ( mult > 9 ){
              total = total + ( mult - 9 );
            }
            else {
              total = total + mult;
            }
          }
        }
        var decena = total / 10;
        decena = Math.floor( decena );
        decena = ( decena + 1 ) * 10;
        var final = ( decena - total );
        if ( ( final == 10 && digito === 0 ) || ( final == digito ) ) {
          return false;
        }
        else {
          return true;
        }
      } // else
    }
  }
}
