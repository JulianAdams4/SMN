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
    }
}
