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
  camposSonValidos: function(campos,req) {
    for (var i=0; i<campos.length ; i++){
      var field = campos[i];
      if ( req.body[field] == null || req.body[field] == undefined) {
        return false;
      }
    }
    return true;
  }
}
