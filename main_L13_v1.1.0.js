var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');
try{
  var secPubNub=0;
  var BottleSorterct = null,
      BottleSorterresults = null,
      BottleSorteractual = 0,
      BottleSortertime = 0,
      BottleSortersec = 0,
      BottleSorterflagStopped = false,
      BottleSorterstate = 0,
      BottleSorterspeed = 0,
      BottleSorterspeedTemp = 0,
      BottleSorterflagPrint = 0,
      BottleSortersecStop = 0,
      BottleSorterdeltaRejected = null,
      BottleSorterONS = 0,
      BottleSorterStartTime = null,
      BottleSortertimeStop = 45, //NOTE: Timestop
      BottleSorterWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
      BottleSorterflagRunning = false,
      BottleSorterRejectFlag = false,
      BottleSorterReject,
      CntOutBottleSorter=null;
      var Fillerct = null,
          Fillerresults = null,
          Filleractual = 0,
          Fillertime = 0,
          Fillersec = 0,
          FillerflagStopped = false,
          Fillerstate = 0,
          Fillerspeed = 0,
          FillerspeedTemp = 0,
          FillerflagPrint = 0,
          FillersecStop = 0,
          FillerdeltaRejected = null,
          FillerONS = 0,
          FillerStartTime = null,
          FillertimeStop = 45, //NOTE: Timestop
          FillerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
          FillerflagRunning = false,
          FillerRejectFlag = false,
          FillerReject,
          CntInFiller=null,
          CntOutFiller=null;
          var CapSupplyct = null,
              CapSupplyresults = null,
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
              CapSupplyONS = 0,
              CapSupplyStartTime = null,
              CapSupplytimeStop = 50, //NOTE: Timestop
              CapSupplyWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
              CapSupplyflagRunning = false;
              var Labellerct = null,
                  Labellerresults = null,
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
                  LabellerONS = 0,
                  LabellerStartTime = null,
                  LabellertimeStop = 45, //NOTE: Timestop
                  LabellerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
                  LabellerflagRunning = false,
                  LabellerRejectFlag = false,
                  LabellerReject,
                  CntInLabeller=null,
                  CntOutLabeller=null;
                  var LabelWatcherct = null,
                      LabelWatcherresults = null,
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
                      LabelWatcherONS = 0,
                      LabelWatcherStartTime = null,
                      LabelWatchertimeStop = 45, //NOTE: Timestop
                      LabelWatcherWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
                      LabelWatcherflagRunning = false,
                      LabelWatcherRejectFlag = false,
                      LabelWatcherReject,
                      CntInLabelWatcher=null,
                      CntOutLabelWatcher=null;
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
                          CasePackerONS = 0,
                          CasePackerStartTime = null,
                          CasePackertimeStop = 50, //NOTE: Timestop
                          CasePackerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
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
                              CaseFormerONS = 0,
                              CaseFormerStartTime = null,
                              CaseFormertimeStop = 50, //NOTE: Timestop
                              CaseFormerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
                              CaseFormerflagRunning = false;
  var CntOutEOL=null,
      secEOL=0;
  var publishConfig;
      var intId1,intId2;
      var files = fs.readdirSync("C:/PULSE/L13_LOGS/"); //Leer documentos
      var actualdate = Date.now(); //Fecha actual
      var text2send=[];//Vector a enviar
      var flagInfo2Send=0;
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
var BottleSorterVerify = function(){
      try{
        BottleSorterReject = fs.readFileSync('BottleSorterRejected.json');
        if(BottleSorterReject.toString().indexOf('}') > 0 && BottleSorterReject.toString().indexOf('{\"rejected\":') != -1){
          BottleSorterReject = JSON.parse(BottleSorterReject);
        }else{
          throw 12121212;
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('BottleSorterRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
          BottleSorterReject = {
            rejected : 0
          };
        }
      }
    };
BottleSorterVerify();
var FillerVerify = function(){
      try{
        FillerReject = fs.readFileSync('FillerRejected.json');
        if(FillerReject.toString().indexOf('}') > 0 && FillerReject.toString().indexOf('{\"rejected\":') != -1){
          FillerReject = JSON.parse(FillerReject);
        }else{
          throw 12121212;
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('FillerRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
          FillerReject = {
            rejected : 0
          };
        }
      }
    };

FillerVerify();
var LabellerVerify = function(){
      try{
        LabellerReject = fs.readFileSync('LabellerRejected.json');
        if(LabellerReject.toString().indexOf('}') > 0 && LabellerReject.toString().indexOf('{\"rejected\":') != -1){
          LabellerReject = JSON.parse(LabellerReject);
        }else{
          throw 12121212;
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('LabellerRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
          LabellerReject = {
            rejected : 0
          };
        }
      }
    };

LabellerVerify();
var LabelWatcherVerify = function(){
      try{
        LabelWatcherReject = fs.readFileSync('LabelWatcherRejected.json');
        if(LabelWatcherReject.toString().indexOf('}') > 0 && LabelWatcherReject.toString().indexOf('{\"rejected\":') != -1){
          LabelWatcherReject = JSON.parse(LabelWatcherReject);
        }else{
          throw 12121212;
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('LabelWatcherRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
          LabelWatcherReject = {
            rejected : 0
          };
        }
      }
    };

LabelWatcherVerify();
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
          CntInFiller = CntOutBottleSorter;
          //CntInFiller = joinWord(resp.register[12], resp.register[13]);
          CntOutFiller = joinWord(resp.register[6], resp.register[7]);
          CntOutCapSupply = joinWord(resp.register[4], resp.register[5]);
          CntInLabeller       = joinWord(resp.register[2], resp.register[3]);
          CntOutLabeller      = joinWord(resp.register[0], resp.register[1]);
          CntInLabelWatcher   = joinWord(resp.register[10], resp.register[11]);
          CntOutLabelWatcher  = joinWord(resp.register[8], resp.register[9]);
          //------------------------------------------BottleSorter----------------------------------------------
                BottleSorterct = CntOutBottleSorter; // NOTE: igualar al contador de salida
                if (BottleSorterONS == 0 && BottleSorterct) {
                  BottleSorterspeedTemp = BottleSorterct;
                  BottleSorterStartTime = Date.now();
                  BottleSorterONS = 1;
                }
                if(BottleSorterct > BottleSorteractual){
                  if(BottleSorterflagStopped){
                    BottleSorterspeed = BottleSorterct - BottleSorterspeedTemp;
                    BottleSorterspeedTemp = BottleSorterct;
                    BottleSorterStartTime = Date.now();
                    BottleSortersec = 0;
                  }
                  BottleSortersecStop = 0;
                  BottleSortersec++;
                  BottleSortertime = Date.now();
                  BottleSorterstate = 1;
                  BottleSorterflagStopped = false;
                  BottleSorterflagRunning = true;
                } else if( BottleSorterct == BottleSorteractual ){
                  if(BottleSortersecStop == 0){
                    BottleSortertime = Date.now();
                  }
                  BottleSortersecStop++;
                  if(BottleSortersecStop >= BottleSortertimeStop){
                    BottleSorterspeed = 0;
                    BottleSorterstate = 2;
                    BottleSorterspeedTemp = BottleSorterct;
                    BottleSorterflagStopped = true;
                    BottleSorterflagRunning = false;
                  }
                  if(BottleSortersecStop % (BottleSortertimeStop*3) == 0 || BottleSortersecStop == BottleSortertimeStop ){
                    BottleSorterflagPrint = 1;

                    if(BottleSortersecStop % (BottleSortertimeStop*3) == 0){
                      BottleSortertime = Date.now();
                    }
                  }
                }
                BottleSorteractual = BottleSorterct;
                if(BottleSortersec == BottleSorterWorktime){
                  BottleSortersec = 0;
                  if(BottleSorterflagRunning && BottleSorterct){
                    BottleSorterflagPrint = 1;
                    BottleSortersecStop = 0;
                    BottleSorterspeed = Math.floor( (BottleSorterct - BottleSorterspeedTemp) / (Date.now() - BottleSorterStartTime) * 60000 );
                    BottleSorterspeedTemp = BottleSorterct;
                    BottleSorterStartTime = Date.now();
                  }
                }
                BottleSorterresults = {
                  ST: BottleSorterstate,
                  CPQO : CntOutBottleSorter,
                  SP: BottleSorterspeed
                };
                if (BottleSorterflagPrint == 1 && BottleSorterct) {
                  for (var key in BottleSorterresults) {
                    if(BottleSorterresults[key] != null && ! isNaN(BottleSorterresults[key]))
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_BottleSorter_L13.log', 'tt=' + BottleSortertime + ',var=' + key + ',val=' + BottleSorterresults[key] + '\n');
                  }
                  BottleSorterflagPrint = 0;
                }
          //------------------------------------------BottleSorter----------------------------------------------
          //------------------------------------------Filler----------------------------------------------
                Fillerct = CntOutFiller; // NOTE: igualar al contador de salida
                if (FillerONS == 0 && Fillerct) {
                  FillerspeedTemp = Fillerct;
                  FillerStartTime = Date.now();
                  FillerONS = 1;
                }
                if(Fillerct > Filleractual){
                  if(FillerflagStopped){
                    Fillerspeed = Fillerct -FillerspeedTemp;
                    FillerspeedTemp = Fillerct;
                    Fillersec = 0;
                    FillerStartTime = Date.now();
                    FillerdeltaRejected = null;
                    FillerRejectFlag = false;
                  }
                  FillersecStop = 0;
                  Fillersec++;
                  Fillertime = Date.now();
                  Fillerstate = 1;
                  FillerflagStopped = false;
                  FillerflagRunning = true;
                } else if( Fillerct == Filleractual ){
                  if(FillersecStop == 0){
                    Fillertime = Date.now();
                  }
                  FillersecStop++;
                  if(FillersecStop >= FillertimeStop){
                    Fillerspeed = 0;
                    Fillerstate = 2;
                    FillerspeedTemp = Fillerct;
                    FillerflagStopped = true;
                    FillerflagRunning = false;

                    if(CntInFiller - CntOutFiller - FillerReject.rejected != 0 && ! FillerRejectFlag){
                      FillerdeltaRejected = CntInFiller - CntOutFiller - FillerReject.rejected;
                      FillerReject.rejected = CntInFiller - CntOutFiller;
                      fs.writeFileSync('FillerRejected.json','{"rejected": ' + FillerReject.rejected + '}');
                      FillerRejectFlag = true;
                    }else{
                      FillerdeltaRejected = 0;
                    }
                  }
                  if(FillersecStop % (FillertimeStop * 3) == 0 ||FillersecStop == FillertimeStop ){
                    FillerflagPrint=1;

                    if(FillersecStop % (FillertimeStop * 3) == 0){
                      Fillertime = Date.now();
                      FillerdeltaRejected = null;
                    }
                  }
                }
                Filleractual = Fillerct;
                if(Fillersec == FillerWorktime){
                  Fillersec = 0;
                  if(FillerflagRunning && Fillerct){
                    FillerflagPrint = 1;
                    FillersecStop = 0;
                    Fillerspeed = Math.floor( (Fillerct - FillerspeedTemp) / (Date.now() - FillerStartTime) * 60000 );
                    FillerspeedTemp = Fillerct;
                  }
                }
                Fillerresults = {
                  ST: Fillerstate,
                  CPQI: CntInFiller,
                  CPQO: CntOutFiller,
                  CPQR: FillerdeltaRejected,
                  SP: Fillerspeed
                };
                if (FillerflagPrint == 1) {
                  for (var key in Fillerresults) {
                    if(Fillerresults[key]!=null&&!isNaN(Fillerresults[key]))
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/PULSE/L13_LOGS/mex_PCL_FillerCapper_L13.log', 'tt=' + Fillertime + ',var=' + key + ',val=' + Fillerresults[key] + '\n');
                  }
                  FillerflagPrint = 0;
                }
          //------------------------------------------Filler----------------------------------------------
          //------------------------------------------CapSupply----------------------------------------------
                CapSupplyct = CntOutCapSupply; // NOTE: igualar al contador de salida
                if (CapSupplyONS == 0 && CapSupplyct) {
                  CapSupplyspeedTemp = CapSupplyct;
                  CapSupplyStartTime = Date.now();
                  CapSupplyONS = 1;
                }
                if(CapSupplyct > CapSupplyactual){
                  if(CapSupplyflagStopped){
                    CapSupplyspeed = CapSupplyct - CapSupplyspeedTemp;
                    CapSupplyspeedTemp = CapSupplyct;
                    CapSupplyStartTime = Date.now();
                    CapSupplysec = 0;
                  }
                  CapSupplysecStop = 0;
                  CapSupplysec++;
                  CapSupplytime = Date.now();
                  CapSupplystate = 1;
                  CapSupplyflagStopped = false;
                  CapSupplyflagRunning = true;
                } else if( CapSupplyct == CapSupplyactual ){
                  if(CapSupplysecStop == 0){
                    CapSupplytime = Date.now();
                  }
                  CapSupplysecStop++;
                  if(CapSupplysecStop >= CapSupplytimeStop){
                    CapSupplyspeed = 0;
                    CapSupplystate = 2;
                    CapSupplyspeedTemp = CapSupplyct;
                    CapSupplyflagStopped = true;
                    CapSupplyflagRunning = false;
                  }
                  if(CapSupplysecStop % (CapSupplytimeStop*3) == 0 || CapSupplysecStop == CapSupplytimeStop ){
                    CapSupplyflagPrint = 1;

                    if(CapSupplysecStop % (CapSupplytimeStop*3) == 0){
                      CapSupplytime = Date.now();
                    }
                  }
                }
                CapSupplyactual = CapSupplyct;
                if(CapSupplysec == CapSupplyWorktime){
                  CapSupplysec = 0;
                  if(CapSupplyflagRunning && CapSupplyct){
                    CapSupplyflagPrint = 1;
                    CapSupplysecStop = 0;
                    CapSupplyspeed = Math.floor( (CapSupplyct - CapSupplyspeedTemp) / (Date.now() - CapSupplyStartTime) * 60000 );
                    CapSupplyspeedTemp = CapSupplyct;
                    CapSupplyStartTime = Date.now();
                  }
                }
                CapSupplyresults = {
                  ST: CapSupplystate,
                  CPQO : CntOutCapSupply,
                  SP: CapSupplyspeed
                };
                if (CapSupplyflagPrint == 1 && CapSupplyct) {
                  for (var key in CapSupplyresults) {
                    if(CapSupplyresults[key] != null && ! isNaN(CapSupplyresults[key]))
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/PULSE/L13_LOGS/mex_PCL_CapSupply_L13.log', 'tt=' + CapSupplytime + ',var=' + key + ',val=' + CapSupplyresults[key] + '\n');
                  }
                  CapSupplyflagPrint = 0;
                }
          //------------------------------------------CapSupply----------------------------------------------
          //------------------------------------------Labeller----------------------------------------------
                Labellerct = CntOutLabeller; // NOTE: igualar al contador de salida
                if (LabellerONS == 0 && Labellerct) {
                  LabellerspeedTemp = Labellerct;
                  LabellerStartTime = Date.now();
                  LabellerONS = 1;
                }
                if(Labellerct > Labelleractual){
                  if(LabellerflagStopped){
                    Labellerspeed = Labellerct -LabellerspeedTemp;
                    LabellerspeedTemp = Labellerct;
                    Labellersec = 0;
                    LabellerStartTime = Date.now();
                    LabellerdeltaRejected = null;
                    LabellerRejectFlag = false;
                  }
                  LabellersecStop = 0;
                  Labellersec++;
                  Labellertime = Date.now();
                  Labellerstate = 1;
                  LabellerflagStopped = false;
                  LabellerflagRunning = true;
                } else if( Labellerct == Labelleractual ){
                  if(LabellersecStop == 0){
                    Labellertime = Date.now();
                  }
                  LabellersecStop++;
                  if(LabellersecStop >= LabellertimeStop){
                    Labellerspeed = 0;
                    Labellerstate = 2;
                    LabellerspeedTemp = Labellerct;
                    LabellerflagStopped = true;
                    LabellerflagRunning = false;

                    if(CntInLabeller - CntOutLabeller - LabellerReject.rejected != 0 && ! LabellerRejectFlag){
                      LabellerdeltaRejected = CntInLabeller - CntOutLabeller - LabellerReject.rejected;
                      LabellerReject.rejected = CntInLabeller - CntOutLabeller;
                      fs.writeFileSync('LabellerRejected.json','{"rejected": ' + LabellerReject.rejected + '}');
                      LabellerRejectFlag = true;
                    }else{
                      LabellerdeltaRejected = 0;
                    }
                  }
                  if(LabellersecStop % (LabellertimeStop * 3) == 0 ||LabellersecStop == LabellertimeStop ){
                    LabellerflagPrint=1;

                    if(LabellersecStop % (LabellertimeStop * 3) == 0){
                      Labellertime = Date.now();
                      LabellerdeltaRejected = null;
                    }
                  }
                }
                Labelleractual = Labellerct;
                if(Labellersec == LabellerWorktime){
                  Labellersec = 0;
                  if(LabellerflagRunning && Labellerct){
                    LabellerflagPrint = 1;
                    LabellersecStop = 0;
                    Labellerspeed = Math.floor( (Labellerct - LabellerspeedTemp) / (Date.now() - LabellerStartTime) * 60000 );
                    LabellerspeedTemp = Labellerct;
                  }
                }
                Labellerresults = {
                  ST: Labellerstate,
                  CPQI: CntInLabeller,
                  CPQO: CntOutLabeller,
                  CPQR: LabellerdeltaRejected,
                  SP: Labellerspeed
                };
                if (LabellerflagPrint == 1) {
                  for (var key in Labellerresults) {
                    if(Labellerresults[key]!=null&&!isNaN(Labellerresults[key]))
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_Labeller_l13.log', 'tt=' + Labellertime + ',var=' + key + ',val=' + Labellerresults[key] + '\n');
                  }
                  LabellerflagPrint = 0;
                }
          //------------------------------------------Labeller----------------------------------------------
          //------------------------------------------LabelWatcher----------------------------------------------
                LabelWatcherct = CntOutLabelWatcher; // NOTE: igualar al contador de salida
                if (LabelWatcherONS == 0 && LabelWatcherct) {
                  LabelWatcherspeedTemp = LabelWatcherct;
                  LabelWatcherStartTime = Date.now();
                  LabelWatcherONS = 1;
                }
                if(LabelWatcherct > LabelWatcheractual){
                  if(LabelWatcherflagStopped){
                    LabelWatcherspeed = LabelWatcherct -LabelWatcherspeedTemp;
                    LabelWatcherspeedTemp = LabelWatcherct;
                    LabelWatchersec = 0;
                    LabelWatcherStartTime = Date.now();
                    LabelWatcherdeltaRejected = null;
                    LabelWatcherRejectFlag = false;
                  }
                  LabelWatchersecStop = 0;
                  LabelWatchersec++;
                  LabelWatchertime = Date.now();
                  LabelWatcherstate = 1;
                  LabelWatcherflagStopped = false;
                  LabelWatcherflagRunning = true;
                } else if( LabelWatcherct == LabelWatcheractual ){
                  if(LabelWatchersecStop == 0){
                    LabelWatchertime = Date.now();
                  }
                  LabelWatchersecStop++;
                  if(LabelWatchersecStop >= LabelWatchertimeStop){
                    LabelWatcherspeed = 0;
                    LabelWatcherstate = 2;
                    LabelWatcherspeedTemp = LabelWatcherct;
                    LabelWatcherflagStopped = true;
                    LabelWatcherflagRunning = false;

                    if(CntInLabelWatcher - CntOutLabelWatcher - LabelWatcherReject.rejected != 0 && ! LabelWatcherRejectFlag){
                      LabelWatcherdeltaRejected = CntInLabelWatcher - CntOutLabelWatcher - LabelWatcherReject.rejected;
                      LabelWatcherReject.rejected = CntInLabelWatcher - CntOutLabelWatcher;
                      fs.writeFileSync('LabelWatcherRejected.json','{"rejected": ' + LabelWatcherReject.rejected + '}');
                      LabelWatcherRejectFlag = true;
                    }else{
                      LabelWatcherdeltaRejected = 0;
                    }
                  }
                  if(LabelWatchersecStop % (LabelWatchertimeStop * 3) == 0 ||LabelWatchersecStop == LabelWatchertimeStop ){
                    LabelWatcherflagPrint=1;

                    if(LabelWatchersecStop % (LabelWatchertimeStop * 3) == 0){
                      LabelWatchertime = Date.now();
                      LabelWatcherdeltaRejected = null;
                    }
                  }
                }
                LabelWatcheractual = LabelWatcherct;
                if(LabelWatchersec == LabelWatcherWorktime){
                  LabelWatchersec = 0;
                  if(LabelWatcherflagRunning && LabelWatcherct){
                    LabelWatcherflagPrint = 1;
                    LabelWatchersecStop = 0;
                    LabelWatcherspeed = Math.floor( (LabelWatcherct - LabelWatcherspeedTemp) / (Date.now() - LabelWatcherStartTime) * 60000 );
                    LabelWatcherspeedTemp = LabelWatcherct;
                  }
                }
                LabelWatcherresults = {
                  ST: LabelWatcherstate,
                  CPQI: CntInLabelWatcher,
                  CPQO: CntOutLabelWatcher,
                  CPQR: LabelWatcherdeltaRejected,
                  SP: LabelWatcherspeed
                };
                if (LabelWatcherflagPrint == 1) {
                  for (var key in LabelWatcherresults) {
                    if(LabelWatcherresults[key]!=null&&!isNaN(LabelWatcherresults[key]))
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_LabelWatcher_l13.log', 'tt=' + LabelWatchertime + ',var=' + key + ',val=' + LabelWatcherresults[key] + '\n');
                  }
                  LabelWatcherflagPrint = 0;
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
                      CasePackerct = CntOutCasePacker; // NOTE: igualar al contador de salida
                      if (CasePackerONS == 0 && CasePackerct) {
                        CasePackerspeedTemp = CasePackerct;
                        CasePackerStartTime = Date.now();
                        CasePackerONS = 1;
                      }
                      if(CasePackerct > CasePackeractual){
                        if(CasePackerflagStopped){
                          CasePackerspeed = CasePackerct - CasePackerspeedTemp;
                          CasePackerspeedTemp = CasePackerct;
                          CasePackerStartTime = Date.now();
                          CasePackersec = 0;
                        }
                        CasePackersecStop = 0;
                        CasePackersec++;
                        CasePackertime = Date.now();
                        CasePackerstate = 1;
                        CasePackerflagStopped = false;
                        CasePackerflagRunning = true;
                      } else if( CasePackerct == CasePackeractual ){
                        if(CasePackersecStop == 0){
                          CasePackertime = Date.now();
                        }
                        CasePackersecStop++;
                        if(CasePackersecStop >= CasePackertimeStop){
                          CasePackerspeed = 0;
                          CasePackerstate = 2;
                          CasePackerspeedTemp = CasePackerct;
                          CasePackerflagStopped = true;
                          CasePackerflagRunning = false;
                        }
                        if(CasePackersecStop % (CasePackertimeStop*3) == 0 || CasePackersecStop == CasePackertimeStop ){
                          CasePackerflagPrint = 1;

                          if(CasePackersecStop % (CasePackertimeStop*3) == 0){
                            CasePackertime = Date.now();
                          }
                        }
                      }
                      CasePackeractual = CasePackerct;
                      if(CasePackersec == CasePackerWorktime){
                        CasePackersec = 0;
                        if(CasePackerflagRunning && CasePackerct){
                          CasePackerflagPrint = 1;
                          CasePackersecStop = 0;
                          CasePackerspeed = Math.floor( (CasePackerct - CasePackerspeedTemp) / (Date.now() - CasePackerStartTime) * 60000 );
                          CasePackerspeedTemp = CasePackerct;
                          CasePackerStartTime = Date.now();
                        }
                      }
                      CasePackerresults = {
                        ST: CasePackerstate,
                        CPQI : CntInCasePacker,
                        CPQO : CntOutCasePacker,
                        SP: CasePackerspeed
                      };
                      if (CasePackerflagPrint == 1 && CasePackerct) {
                        for (var key in CasePackerresults) {
                          if(CasePackerresults[key] != null && ! isNaN(CasePackerresults[key]))
                          //NOTE: Cambiar path
                          fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_CasePacker_l13.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n');
                        }
                        CasePackerflagPrint = 0;
                      }
                //------------------------------------------CasePacker----------------------------------------------
                //------------------------------------------CaseFormer----------------------------------------------
                      CaseFormerct = CntOutCaseFormer; // NOTE: igualar al contador de salida
                      if (CaseFormerONS == 0 && CaseFormerct) {
                        CaseFormerspeedTemp = CaseFormerct;
                        CaseFormerStartTime = Date.now();
                        CaseFormerONS = 1;
                      }
                      if(CaseFormerct > CaseFormeractual){
                        if(CaseFormerflagStopped){
                          CaseFormerspeed = CaseFormerct - CaseFormerspeedTemp;
                          CaseFormerspeedTemp = CaseFormerct;
                          CaseFormerStartTime = Date.now();
                          CaseFormersec = 0;
                        }
                        CaseFormersecStop = 0;
                        CaseFormersec++;
                        CaseFormertime = Date.now();
                        CaseFormerstate = 1;
                        CaseFormerflagStopped = false;
                        CaseFormerflagRunning = true;
                      } else if( CaseFormerct == CaseFormeractual ){
                        if(CaseFormersecStop == 0){
                          CaseFormertime = Date.now();
                        }
                        CaseFormersecStop++;
                        if(CaseFormersecStop >= CaseFormertimeStop){
                          CaseFormerspeed = 0;
                          CaseFormerstate = 2;
                          CaseFormerspeedTemp = CaseFormerct;
                          CaseFormerflagStopped = true;
                          CaseFormerflagRunning = false;
                        }
                        if(CaseFormersecStop % (CaseFormertimeStop*3) == 0 || CaseFormersecStop == CaseFormertimeStop ){
                          CaseFormerflagPrint = 1;

                          if(CaseFormersecStop % (CaseFormertimeStop*3) == 0){
                            CaseFormertime = Date.now();
                          }
                        }
                      }
                      CaseFormeractual = CaseFormerct;
                      if(CaseFormersec == CaseFormerWorktime){
                        CaseFormersec = 0;
                        if(CaseFormerflagRunning && CaseFormerct){
                          CaseFormerflagPrint = 1;
                          CaseFormersecStop = 0;
                          CaseFormerspeed = Math.floor( (CaseFormerct - CaseFormerspeedTemp) / (Date.now() - CaseFormerStartTime) * 60000 );
                          CaseFormerspeedTemp = CaseFormerct;
                          CaseFormerStartTime = Date.now();
                        }
                      }
                      CaseFormerresults = {
                        ST: CaseFormerstate,
                        CPQO : CntOutCaseFormer,
                        SP: CaseFormerspeed
                      };
                      if (CaseFormerflagPrint == 1 && CaseFormerct) {
                        for (var key in CaseFormerresults) {
                          if(CaseFormerresults[key] != null && ! isNaN(CaseFormerresults[key]))
                          //NOTE: Cambiar path
                          fs.appendFileSync('C:/PULSE/L13_LOGS/mex_pcl_CaseFormer_l13.log', 'tt=' + CaseFormertime + ',var=' + key + ',val=' + CaseFormerresults[key] + '\n');
                        }
                        CaseFormerflagPrint = 0;
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
}catch(err){
    fs.appendFileSync("error.log",err + '\n');
}
