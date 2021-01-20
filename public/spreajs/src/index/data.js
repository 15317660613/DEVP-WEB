function data(){
  var designer = GC.Spread.Sheets.Designer;
  var spread = designer.wrapper.spread;  //创建spread实例
  // var id='';
  // spread.fromJSON(model);
  // var data={
  //   Name:"qixn",
  //   Data:new Date(),
  //   product:[
  //     {Id:1,number:10,name:'iphone',city:'NewYork'},
  //     {Id:1,number:10,name:'iphone',city:'NewYork'}
  //   ]
  // }
  // var spreadNs=GC.Spread.Sheets;
  // var bindata=new spreadNs.Bindings.CellBindingSource(data)
  // $("#dataLoading").click(function(){
  //   var sheet=spread.getSheet(0);
  //   sheet.setDataSource(datasource);
   
  //   $.ajax({
  //     type: "GET",
  //     url: "http://192.168.13.89:50019/code/codeElement/getconnectSign",
  //     contentType:"application/json; charset=UTF-8",
  //     success: function (response) {
  //       sheet.setDataSource(response);
  //     }
  //   });
  // });
  
  //渲染下拉框
  function getSelectData(){
    $("#chooseData").empty();
    $.ajax({
    type: "GET",
    url: "http://192.168.13.159:8080/queryAllSqlName",
    contentType:"application/json; charset=UTF-8",
    success: function (response) {
      
      var optionString = "<option grade=\'请选择数据源\' selected = \'selected\'>--请选择数据源--</option>";
      var beanList = JSON.parse(response.data.NameAndConnectionId);            //返回的json数据
      if(beanList){                   
          for(var i=0; i<beanList.length; i++){ //遍历，动态赋值
              id=beanList[i].connectionid;
              optionString +="<option value=\""+beanList[i].sqlname+"\"";  
              optionString += ">"+beanList[i].sqlname+"</option>";  //动态添加数据  
          }  $("#chooseData").append(optionString);  // 为当前name为asd的select添加数据。
      }  
    }
    }); 
  };
  getSelectData();
    $("#chooseData").change(function(){
      var apiName=$('#chooseData').val();
      $.ajax({
        type: "GET",
        url: 'http://192.168.13.159:8080/runSqlByName/'+apiName+'/'+id,
        contentType:"application/json; charset=UTF-8",
        crossDomain: true,
        xhrFields: {
        withCredentials: true
        },
        //data:{sqlName:apiName, connectId:id},
        success: function (response) { 
          if(response.success){
            let beanList = JSON.parse(response.data.sqlQueryResult);
            let sheet=spread.getSheet(0);
            sheet.setDataSource(beanList)
          }
        }
      });
    });

  $("#saveDatatoDb").click(function(){
    var sheet=spread.getSheet(0);
    console.log(sheet.getDataSource());
  })
  
  // var sheet=spread.getSheet(0);
  // sheet.autoGenerateColumns = true;
  // sheet.setDataSource(datasource);
}
