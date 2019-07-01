var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');
try{
  var secPubNub=0;
var BottleSorterct = null,
    BottleSorterresults = null,
    CntInBottleSorter = null,
    CntOutBottleSorter = null,
    BottleSorteractual = 0,
    BottleSortertime = 0,
    BottleSortersec = 0,
    BottleSorterflagStopped = false,
    BottleSorterstate = 0,
    BottleSorterspeed = 0,
    BottleSorterspeedTemp = 0,
    BottleSorterflagPrint = 0,
    BottleSortersecStop = 0,
    BottleSorterONS = false,
    BottleSortertimeStop = 60, //NOTE: Timestop
    BottleSorterWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    BottleSorterflagRunning = false;
var FillerCapperct = null,
    FillerCapperresults = null,
    CntInFillerCapper = null,
    CntOutFillerCapper = null,
    FillerCapperactual = 0,
    FillerCappertime = 0,
    FillerCappersec = 0,
    FillerCapperflagStopped = false,
    FillerCapperstate = 0,
    FillerCapperspeed = 0,
    FillerCapperspeedTemp = 0,
    FillerCapperflagPrint = 0,
    FillerCappersecStop = 0,
    FillerCapperdeltaRejected = null,
    FillerCapperONS = false,
    FillerCappertimeStop = 60, //NOTE: Timestop
    FillerCapperWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    FillerCapperflagRunning = false,
    FillerCapperRejectFlag = false,
    FillerCapperReject,
    FillerCapperVerify = (function(){
      try{
        FillerCapperReject = fs.readFileSync('FillerCapperRejected.json')
        if(FillerCapperReject.toString().indexOf('}') > 0 && FillerCapperReject.toString().indexOf('{\"rejected\":') != -1){
          FillerCapperReject = JSON.parse(FillerCapperReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('FillerCapperRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          FillerCapperReject = {
            rejected : 0
          }
        }
      }
    })();
var CapSupplyct = null,
    CapSupplyresults = null,
    CntInCapSupply = null,
    CntOutCapSupply = null,
    CapSupplyactual = 0,
    CapSupplytime = 0,
    CapSupplysec = 0,
    CapSupplyflagStopped = false,
    CapSupplystate = 0,
    CapSupplyspeed = 0,
    CapSupplyspeedTemp = 0,
    CapSupplyflagPrint = 0,
    CapSupplysecStop = 0,
    CapSupplyONS = false,
    CapSupplytimeStop = 60, //NOTE: Timestop
    CapSupplyWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CapSupplyflagRunning = false;
var Labellerct = null,
    Labellerresults = null,
    CntInLabeller = null,
    CntOutLabeller = null,
    Labelleractual = 0,
    Labellertime = 0,
    Labellersec = 0,
    LabellerflagStopped = false,
    Labellerstate = 0,
    Labellerspeed = 0,
    LabellerspeedTemp = 0,
    LabellerflagPrint = 0,
    LabellersecStop = 0,
    LabellerdeltaRejected = null,
    LabellerONS = false,
    LabellertimeStop = 60, //NOTE: Timestop
    LabellerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    LabellerflagRunning = false,
    LabellerRejectFlag = false,
    LabellerReject,
    LabellerVerify = (function(){
      try{
        LabellerReject = fs.readFileSync('LabellerRejected.json')
        if(LabellerReject.toString().indexOf('}') > 0 && LabellerReject.toString().indexOf('{\"rejected\":') != -1){
          LabellerReject = JSON.parse(LabellerReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('LabellerRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          LabellerReject = {
            rejected : 0
          }
        }
      }
    })();
var LabelWatcherct = null,
    LabelWatcherresults = null,
    CntInLabelWatcher = null,
    CntOutLabelWatcher = null,
    LabelWatcheractual = 0,
    LabelWatchertime = 0,
    LabelWatchersec = 0,
    LabelWatcherflagStopped = false,
    LabelWatcherstate = 0,
    LabelWatcherspeed = 0,
    LabelWatcherspeedTemp = 0,
    LabelWatcherflagPrint = 0,
    LabelWatchersecStop = 0,
    LabelWatcherdeltaRejected = null,
    LabelWatcherONS = false,
    LabelWatchertimeStop = 60, //NOTE: Timestop
    LabelWatcherWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    LabelWatcherflagRunning = false,
    LabelWatcherRejectFlag = false,
    LabelWatcherReject,
    LabelWatcherVerify = (function(){
      try{
        LabelWatcherReject = fs.readFileSync('LabelWatcherRejected.json')
        if(LabelWatcherReject.toString().indexOf('}') > 0 && LabelWatcherReject.toString().indexOf('{\"rejected\":') != -1){
          LabelWatcherReject = JSON.parse(LabelWatcherReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('LabelWatcherRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          LabelWatcherReject = {
            rejected : 0
          }
        }
      }
    })();
var CasePackerct = null,
    CasePackerresults = null,
    CntInCasePacker = null,
    CntOutCasePacker = null,
    CasePackeractual = 0,
    CasePackertime = 0,
    CasePackersec = 0,
    CasePackerflagStopped = false,
    CasePackerstate = 0,
    CasePackerspeed = 0,
    CasePackerspeedTemp = 0,
    CasePackerflagPrint = 0,
    CasePackersecStop = 0,
    CasePackerONS = false,
    CasePackertimeStop = 60, //NOTE: Timestop
    CasePackerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CasePackerflagRunning = false;
var CaseFormerct = null,
    CaseFormerresults = null,
    CntInCaseFormer = null,
    CntOutCaseFormer = null,
    CaseFormeractual = 0,
    CaseFormertime = 0,
    CaseFormersec = 0,
    CaseFormerflagStopped = false,
    CaseFormerstate = 0,
    CaseFormerspeed = 0,
    CaseFormerspeedTemp = 0,
    CaseFormerflagPrint = 0,
    CaseFormersecStop = 0,
    CaseFormerONS = false,
    CaseFormertimeStop = 60, //NOTE: Timestop
    CaseFormerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CaseFormerflagRunning = false;
  var CntOutEOL=null,
      secEOL=0;
  var publishConfig;
  var intId1,intId2;
  var files = fs.readdirSync("C:/PULSE/L13_LOGS/"); //Leer documentos
  var text2send=[];//Vector a enviar
  var i=0;
  var pubnub = new PubNub({
    publishKey:		"pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
  subscribeKey: 		"sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
    uuid: "CUE_PCL_LINE12"
  });


      var senderData = function (){
        pubnub.publish(publishConfig, function(status, response) {
      });}


      var client1 = modbus.client.tcp.complete({
        'host': "192.168.10.104",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
      var client2 = modbus.client.tcp.complete({
        'host': "192.168.10.105",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
}catch(err){
    fs.appendFileSync("error_declarations.log",err + '\n');
}
try{
  client1.connect();
  client2.connect();
}catch(err){
  fs.appendFileSync("error_connection.log",err + '\n');
}
try{
  /*----------------------------------------------------------------------------------Funcction-------------------------------------------------------------------------------------------*/

  var joinWord=function(num1, num2) {
    var bits = "00000000000000000000000000000000";
    var bin1 = num1.toString(2),
      bin2 = num2.toString(2),
      newNum = bits.split("");

    for (i = 0; i < bin1.length; i++) {
      newNum[31 - i] = bin1[(bin1.length - 1) - i];
    }
    for (i = 0; i < bin2.length; i++) {
      newNum[15 - i] = bin2[(bin2.length - 1) - i];
    }
    bits = newNum.join("");
    return parseInt(bits, 2);
  };
//PubNub --------------------------------------------------------------------------------------------------------------------
setInterval(function(){
        if(secPubNub>=60*5){

          var idle=function(){
            i=0;
            text2send=[];
            for (var k=0;k<files.length;k++){//Verificar los archivos
              var stats = fs.statSync("C:/PULSE/L13_LOGS/"+files[k]);
              var mtime = new Date(stats.mtime).getTime();
              if (mtime< (Date.now() - (15*60*1000))&&files[k].indexOf("serialbox")==-1){
                flagInfo2Send=1;
                text2send[i]=files[k];
                i++;
              }
            }
          };
          secPubNub=0;
          publishConfig = {
            channel : "Cue_PCL_Monitor",
            message : {
                  line: "13",
                  tt: Date.now(),
                  machines:text2send

                }
          };
          senderData();
        }
        secPubNub++;
      },1000);
//PubNub --------------------------------------------------------------------------------------------------------------------


client1.on('connect', function(err) {
  intId1 =
    setInterval(function(){
        client1.readHoldingRegisters(0, 16).then(function(resp) {
          CntOutBottleSorter =  joinWord(resp.register[14], resp.register[15]);
          CntInFillerCapper = CntOutBottleSorter;
          //CntInFillerCapper = joinWord(resp.register[12], resp.register[13]);
          CntOutFillerCapper = joinWord(resp.register[6], resp.register[7]);
          CntOutCapSupply = joinWord(resp.register[4], resp.register[5]);
          CntInLabeller       = joinWord(resp.register[2], resp.register[3]);
          CntOutLabeller      = joinWord(resp.register[0], resp.register[1]);
          CntOutLabelWatcher   = joinWord(resp.register[10], resp.register[11]);
          CntInLabelWatcher  = joinWord(resp.register[8], resp.register[9]);
        //------------------------------------------BottleSorter----------------------------------------------
              BottleSorterct = CntOutBottleSorter // NOTE: igualar al contador de salida
              if (!BottleSorterONS && BottleSorterct) {
                BottleSorterspeedTemp = BottleSorterct
                BottleSortersec = Date.now()
                BottleSorterONS = true
                BottleSortertime = Date.now()
              }
              if(BottleSorterct > BottleSorteractual){
                if(BottleSorterflagStopped){
                  BottleSorterspeed = BottleSorterct - BottleSorterspeedTemp
                  BottleSorterspeedTemp = BottleSorterct
                  BottleSortersec = Date.now()
                  BottleSortertime = Date.now()
                }
                BottleSortersecStop = 0
                BottleSorterstate = 1
                BottleSorterflagStopped = false
                BottleSorterflagRunning = true
              } else if( BottleSorterct == BottleSorteractual ){
                if(BottleSortersecStop == 0){
                  BottleSortertime = Date.now()
                  BottleSortersecStop = Date.now()
                }
                if( ( Date.now() - ( BottleSortertimeStop * 1000 ) ) >= BottleSortersecStop ){
                  BottleSorterspeed = 0
                  BottleSorterstate = 2
                  BottleSorterspeedTemp = BottleSorterct
                  BottleSorterflagStopped = true
                  BottleSorterflagRunning = false
                  BottleSorterflagPrint = 1
                }
              }
              BottleSorteractual = BottleSorterct
              if(Date.now() - 60000 * BottleSorterWorktime >= BottleSortersec && BottleSortersecStop == 0){
                if(BottleSorterflagRunning && BottleSorterct){
                  BottleSorterflagPrint = 1
                  BottleSortersecStop = 0
                  BottleSorterspeed = BottleSorterct - BottleSorterspeedTemp
                  BottleSorterspeedTemp = BottleSorterct
                  BottleSortersec = Date.now()
                }
              }
              BottleSorterresults = {
                ST: BottleSorterstate,
                CPQO:  CntOutBottleSorter,
                SP: BottleSorterspeed
              }
              if (BottleSorterflagPrint == 1) {
                for (var key in BottleSorterresults) {
                  if( BottleSorterresults[key] != null && ! isNaN(BottleSorterresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_BottleSorter_L13.log', 'tt=' + BottleSortertime + ',var=' + key + ',val=' + BottleSorterresults[key] + '\n')
                }
                BottleSorterflagPrint = 0
                BottleSortersecStop = 0
                BottleSortertime = Date.now()
              }
        //------------------------------------------BottleSorter----------------------------------------------
        //------------------------------------------FillerCapper----------------------------------------------
              FillerCapperct = CntOutFillerCapper // NOTE: igualar al contador de salida
              if (!FillerCapperONS && FillerCapperct) {
                FillerCapperspeedTemp = FillerCapperct
                FillerCappersec = Date.now()
                FillerCapperONS = true
                FillerCappertime = Date.now()
              }
              if(FillerCapperct > FillerCapperactual){
                if(FillerCapperflagStopped){
                  FillerCapperspeed = FillerCapperct - FillerCapperspeedTemp
                  FillerCapperspeedTemp = FillerCapperct
                  FillerCappersec = Date.now()
                  FillerCapperdeltaRejected = null
                  FillerCapperRejectFlag = false
                  FillerCappertime = Date.now()
                }
                FillerCappersecStop = 0
                FillerCapperstate = 1
                FillerCapperflagStopped = false
                FillerCapperflagRunning = true
              } else if( FillerCapperct == FillerCapperactual ){
                if(FillerCappersecStop == 0){
                  FillerCappertime = Date.now()
                  FillerCappersecStop = Date.now()
                }
                if( ( Date.now() - ( FillerCappertimeStop * 1000 ) ) >= FillerCappersecStop ){
                  //FillerCapperspeed = 0
                  FillerCapperstate = 2
                  FillerCapperspeedTemp = FillerCapperct
                  FillerCapperflagStopped = true
                  FillerCapperflagRunning = false
                  FillerCapperflagPrint = 1
                }
              }
              FillerCapperactual = FillerCapperct
              if(Date.now() - 60000 * FillerCapperWorktime >= FillerCappersec && FillerCappersecStop == 0){
                if(FillerCapperflagRunning && FillerCapperct){
                  FillerCapperflagPrint = 1
                  FillerCappersecStop = 0
                  FillerCapperspeed = FillerCapperct - FillerCapperspeedTemp
                  FillerCapperspeedTemp = FillerCapperct
                  FillerCappersec = Date.now()
                }
              }
              FillerCapperresults = {
                ST: FillerCapperstate,
                CPQI : CntInFillerCapper,
                CPQO : CntOutFillerCapper,
                //CPQR : FillerCapperdeltaRejected,
                SP: FillerCapperspeed
              }
              if (FillerCapperflagPrint == 1) {
                for (var key in FillerCapperresults) {
                  if( FillerCapperresults[key] != null && ! isNaN(FillerCapperresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_FillerCapper_L13.log', 'tt=' + FillerCappertime + ',var=' + key + ',val=' + FillerCapperresults[key] + '\n')
                }
                FillerCapperflagPrint = 0
                FillerCappersecStop = 0
                FillerCappertime = Date.now()
              }
        //------------------------------------------FillerCapper----------------------------------------------
        //------------------------------------------CapSupply----------------------------------------------
              CapSupplyct = CntOutCapSupply // NOTE: igualar al contador de salida
              if (!CapSupplyONS && CapSupplyct) {
                CapSupplyspeedTemp = CapSupplyct
                CapSupplysec = Date.now()
                CapSupplyONS = true
                CapSupplytime = Date.now()
              }
              if(CapSupplyct > CapSupplyactual){
                if(CapSupplyflagStopped){
                  CapSupplyspeed = CapSupplyct - CapSupplyspeedTemp
                  CapSupplyspeedTemp = CapSupplyct
                  CapSupplysec = Date.now()
                  CapSupplytime = Date.now()
                }
                CapSupplysecStop = 0
                CapSupplystate = 1
                CapSupplyflagStopped = false
                CapSupplyflagRunning = true
              } else if( CapSupplyct == CapSupplyactual ){
                if(CapSupplysecStop == 0){
                  CapSupplytime = Date.now()
                  CapSupplysecStop = Date.now()
                }
                if( ( Date.now() - ( CapSupplytimeStop * 1000 ) ) >= CapSupplysecStop ){
                  CapSupplyspeed = 0
                  CapSupplystate = 2
                  CapSupplyspeedTemp = CapSupplyct
                  CapSupplyflagStopped = true
                  CapSupplyflagRunning = false
                  CapSupplyflagPrint = 1
                }
              }
              CapSupplyactual = CapSupplyct
              if(Date.now() - 60000 * CapSupplyWorktime >= CapSupplysec && CapSupplysecStop == 0){
                if(CapSupplyflagRunning && CapSupplyct){
                  CapSupplyflagPrint = 1
                  CapSupplysecStop = 0
                  CapSupplyspeed = CapSupplyct - CapSupplyspeedTemp
                  CapSupplyspeedTemp = CapSupplyct
                  CapSupplysec = Date.now()
                }
              }
              CapSupplyresults = {
                ST: CapSupplystate,
                CPQO:  CntOutCapSupply,
                SP: CapSupplyspeed
              }
              if (CapSupplyflagPrint == 1) {
                for (var key in CapSupplyresults) {
                  if( CapSupplyresults[key] != null && ! isNaN(CapSupplyresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_CapSupply_L13.log', 'tt=' + CapSupplytime + ',var=' + key + ',val=' + CapSupplyresults[key] + '\n')
                }
                CapSupplyflagPrint = 0
                CapSupplysecStop = 0
                CapSupplytime = Date.now()
              }
        //------------------------------------------CapSupply----------------------------------------------
        //------------------------------------------Labeller----------------------------------------------
              Labellerct = CntOutLabeller // NOTE: igualar al contador de salida
              if (!LabellerONS && Labellerct) {
                LabellerspeedTemp = Labellerct
                Labellersec = Date.now()
                LabellerONS = true
                Labellertime = Date.now()
              }
              if(Labellerct > Labelleractual){
                if(LabellerflagStopped){
                  Labellerspeed = Labellerct - LabellerspeedTemp
                  LabellerspeedTemp = Labellerct
                  Labellersec = Date.now()
                  LabellerdeltaRejected = null
                  LabellerRejectFlag = false
                  Labellertime = Date.now()
                }
                LabellersecStop = 0
                Labellerstate = 1
                LabellerflagStopped = false
                LabellerflagRunning = true
              } else if( Labellerct == Labelleractual ){
                if(LabellersecStop == 0){
                  Labellertime = Date.now()
                  LabellersecStop = Date.now()
                }
                if( ( Date.now() - ( LabellertimeStop * 1000 ) ) >= LabellersecStop ){
                  //Labellerspeed = 0
                  Labellerstate = 2
                  LabellerspeedTemp = Labellerct
                  LabellerflagStopped = true
                  LabellerflagRunning = false
                  LabellerflagPrint = 1
                }
              }
              Labelleractual = Labellerct
              if(Date.now() - 60000 * LabellerWorktime >= Labellersec && LabellersecStop == 0){
                if(LabellerflagRunning && Labellerct){
                  LabellerflagPrint = 1
                  LabellersecStop = 0
                  Labellerspeed = Labellerct - LabellerspeedTemp
                  LabellerspeedTemp = Labellerct
                  Labellersec = Date.now()
                }
              }
              Labellerresults = {
                ST: Labellerstate,
                CPQI : CntInLabeller,
                CPQO : CntOutLabeller,
                //CPQR : LabellerdeltaRejected,
                SP: Labellerspeed
              }
              if (LabellerflagPrint == 1) {
                for (var key in Labellerresults) {
                  if( Labellerresults[key] != null && ! isNaN(Labellerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_Labeller_L13.log', 'tt=' + Labellertime + ',var=' + key + ',val=' + Labellerresults[key] + '\n')
                }
                LabellerflagPrint = 0
                LabellersecStop = 0
                Labellertime = Date.now()
              }
        //------------------------------------------Labeller----------------------------------------------
        //------------------------------------------LabelWatcher----------------------------------------------
              LabelWatcherct = CntOutLabelWatcher // NOTE: igualar al contador de salida
              if (!LabelWatcherONS && LabelWatcherct) {
                LabelWatcherspeedTemp = LabelWatcherct
                LabelWatchersec = Date.now()
                LabelWatcherONS = true
                LabelWatchertime = Date.now()
              }
              if(LabelWatcherct > LabelWatcheractual){
                if(LabelWatcherflagStopped){
                  LabelWatcherspeed = LabelWatcherct - LabelWatcherspeedTemp
                  LabelWatcherspeedTemp = LabelWatcherct
                  LabelWatchersec = Date.now()
                  LabelWatcherdeltaRejected = null
                  LabelWatcherRejectFlag = false
                  LabelWatchertime = Date.now()
                }
                LabelWatchersecStop = 0
                LabelWatcherstate = 1
                LabelWatcherflagStopped = false
                LabelWatcherflagRunning = true
              } else if( LabelWatcherct == LabelWatcheractual ){
                if(LabelWatchersecStop == 0){
                  LabelWatchertime = Date.now()
                  LabelWatchersecStop = Date.now()
                }
                if( ( Date.now() - ( LabelWatchertimeStop * 1000 ) ) >= LabelWatchersecStop ){
                  //LabelWatcherspeed = 0
                  LabelWatcherstate = 2
                  LabelWatcherspeedTemp = LabelWatcherct
                  LabelWatcherflagStopped = true
                  LabelWatcherflagRunning = false
                  LabelWatcherflagPrint = 1
                }
              }
              LabelWatcheractual = LabelWatcherct
              if(Date.now() - 60000 * LabelWatcherWorktime >= LabelWatchersec && LabelWatchersecStop == 0){
                if(LabelWatcherflagRunning && LabelWatcherct){
                  LabelWatcherflagPrint = 1
                  LabelWatchersecStop = 0
                  LabelWatcherspeed = LabelWatcherct - LabelWatcherspeedTemp
                  LabelWatcherspeedTemp = LabelWatcherct
                  LabelWatchersec = Date.now()
                }
              }
              LabelWatcherresults = {
                ST: LabelWatcherstate,
                CPQI : CntInLabelWatcher,
                CPQO : CntOutLabelWatcher,
                //CPQR : LabelWatcherdeltaRejected,
                SP: LabelWatcherspeed
              }
              if (LabelWatcherflagPrint == 1) {
                for (var key in LabelWatcherresults) {
                  if( LabelWatcherresults[key] != null && ! isNaN(LabelWatcherresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_LabelWatcher_L13.log', 'tt=' + LabelWatchertime + ',var=' + key + ',val=' + LabelWatcherresults[key] + '\n')
                }
                LabelWatcherflagPrint = 0
                LabelWatchersecStop = 0
                LabelWatchertime = Date.now()
              }
        //------------------------------------------LabelWatcher----------------------------------------------
        });//Cierre de lectura
      },1000);
  });//Cierre de cliente

  client1.on('error', function(err){
    clearInterval(intId1);
  });
  client1.on('close', function() {
  	clearInterval(intId1);
  });

client2.on('connect', function(err) {
          intId2 = setInterval(function(){
              client2.readHoldingRegisters(0, 16).then(function(resp) {
                //CntOutLabeller    = joinWord(resp.register[0], resp.register[1]);
                CntOutCasePacker = joinWord(resp.register[0], resp.register[1]);
                CntInCasePacker  = joinWord(resp.register[2], resp.register[3]);
                CntOutCaseFormer = joinWord(resp.register[6], resp.register[7]);
                CntOutEOL = joinWord(resp.register[4], resp.register[5]);
        //------------------------------------------CasePacker----------------------------------------------
              CasePackerct = CntOutCasePacker // NOTE: igualar al contador de salida
              if (!CasePackerONS && CasePackerct) {
                CasePackerspeedTemp = CasePackerct
                CasePackersec = Date.now()
                CasePackerONS = true
                CasePackertime = Date.now()
              }
              if(CasePackerct > CasePackeractual){
                if(CasePackerflagStopped){
                  CasePackerspeed = CasePackerct - CasePackerspeedTemp
                  CasePackerspeedTemp = CasePackerct
                  CasePackersec = Date.now()
                  CasePackertime = Date.now()
                }
                CasePackersecStop = 0
                CasePackerstate = 1
                CasePackerflagStopped = false
                CasePackerflagRunning = true
              } else if( CasePackerct == CasePackeractual ){
                if(CasePackersecStop == 0){
                  CasePackertime = Date.now()
                  CasePackersecStop = Date.now()
                }
                if( ( Date.now() - ( CasePackertimeStop * 1000 ) ) >= CasePackersecStop ){
                  CasePackerspeed = 0
                  CasePackerstate = 2
                  CasePackerspeedTemp = CasePackerct
                  CasePackerflagStopped = true
                  CasePackerflagRunning = false
                  CasePackerflagPrint = 1
                }
              }
              CasePackeractual = CasePackerct
              if(Date.now() - 60000 * CasePackerWorktime >= CasePackersec && CasePackersecStop == 0){
                if(CasePackerflagRunning && CasePackerct){
                  CasePackerflagPrint = 1
                  CasePackersecStop = 0
                  CasePackerspeed = CasePackerct - CasePackerspeedTemp
                  CasePackerspeedTemp = CasePackerct
                  CasePackersec = Date.now()
                }
              }
              CasePackerresults = {
                ST: CasePackerstate,
                CPQI : CntInCasePacker,
                CPQO:  CntOutCasePacker,
                SP: CasePackerspeed
              }
              if (CasePackerflagPrint == 1) {
                for (var key in CasePackerresults) {
                  if( CasePackerresults[key] != null && ! isNaN(CasePackerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_CasePacker_L13.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n')
                }
                CasePackerflagPrint = 0
                CasePackersecStop = 0
                CasePackertime = Date.now()
              }
        //------------------------------------------CasePacker----------------------------------------------
        //------------------------------------------CaseFormer----------------------------------------------
              CaseFormerct = CntOutCaseFormer // NOTE: igualar al contador de salida
              if (!CaseFormerONS && CaseFormerct) {
                CaseFormerspeedTemp = CaseFormerct
                CaseFormersec = Date.now()
                CaseFormerONS = true
                CaseFormertime = Date.now()
              }
              if(CaseFormerct > CaseFormeractual){
                if(CaseFormerflagStopped){
                  CaseFormerspeed = CaseFormerct - CaseFormerspeedTemp
                  CaseFormerspeedTemp = CaseFormerct
                  CaseFormersec = Date.now()
                  CaseFormertime = Date.now()
                }
                CaseFormersecStop = 0
                CaseFormerstate = 1
                CaseFormerflagStopped = false
                CaseFormerflagRunning = true
              } else if( CaseFormerct == CaseFormeractual ){
                if(CaseFormersecStop == 0){
                  CaseFormertime = Date.now()
                  CaseFormersecStop = Date.now()
                }
                if( ( Date.now() - ( CaseFormertimeStop * 1000 ) ) >= CaseFormersecStop ){
                  CaseFormerspeed = 0
                  CaseFormerstate = 2
                  CaseFormerspeedTemp = CaseFormerct
                  CaseFormerflagStopped = true
                  CaseFormerflagRunning = false
                  CaseFormerflagPrint = 1
                }
              }
              CaseFormeractual = CaseFormerct
              if(Date.now() - 60000 * CaseFormerWorktime >= CaseFormersec && CaseFormersecStop == 0){
                if(CaseFormerflagRunning && CaseFormerct){
                  CaseFormerflagPrint = 1
                  CaseFormersecStop = 0
                  CaseFormerspeed = CaseFormerct - CaseFormerspeedTemp
                  CaseFormerspeedTemp = CaseFormerct
                  CaseFormersec = Date.now()
                }
              }
              CaseFormerresults = {
                ST: CaseFormerstate,
                CPQO:  CntOutCaseFormer,
                SP: CaseFormerspeed
              }
              if (CaseFormerflagPrint == 1) {
                for (var key in CaseFormerresults) {
                  if( CaseFormerresults[key] != null && ! isNaN(CaseFormerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_CaseFormer_L13.log', 'tt=' + CaseFormertime + ',var=' + key + ',val=' + CaseFormerresults[key] + '\n')
                }
                CaseFormerflagPrint = 0
                CaseFormersecStop = 0
                CaseFormertime = Date.now()
              }
        //------------------------------------------CaseFormer----------------------------------------------
            /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
                  if(secEOL>=60 && CntOutEOL){
                    fs.appendFileSync("C:/PULSE/L13_LOGS/mex_pcl_EOL_l13.log","tt="+Date.now()+",var=EOL"+",val="+CntOutEOL+"\n");
                    secEOL=0;
                  }else{
                    secEOL++;
                  }
            /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
              });//Cierre de lectura

            },1000);
        });//Cierre de cliente
  client2.on('error', function(err) {
    clearInterval(intId2);
  });
  client2.on('close', function() {
  	clearInterval(intId2);
  });
  function getRejects() {
    var FillerCapperDif = CntInFillerCapper - CntOutFillerCapper
    fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_FillerCapper_L13.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(FillerCapperDif - FillerCapperReject.rejected) + '\n')
    FillerCapperReject.rejected = FillerCapperDif
    fs.writeFileSync('FillerCapperRejected.json', '{"rejected": ' + FillerCapperReject.rejected + '}')
    var LabellerDif = CntInLabeller - CntOutLabeller
    fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_Labeller_L13.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(LabellerDif - LabellerReject.rejected) + '\n')
    LabellerReject.rejected = LabellerDif
    fs.writeFileSync('LabellerRejected.json', '{"rejected": ' + LabellerReject.rejected + '}')
    var LabelWatcherDif = CntInLabelWatcher - CntOutLabelWatcher
    fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_LabelWatcher_L13.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(LabelWatcherDif - LabelWatcherReject.rejected) + '\n')
    LabelWatcherReject.rejected = LabelWatcherDif
    fs.writeFileSync('LabelWatcherRejected.json', '{"rejected": ' + LabelWatcherReject.rejected + '}')
  }
  //setTimeout(getRejects, 60000);
  //var storeReject = setInterval(getRejects, 1740000);
}catch(err){
    fs.appendFileSync("error.log",err + '\n');
}
