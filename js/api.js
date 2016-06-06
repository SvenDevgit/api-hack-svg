var bar1 = {
  xFrom : 100,
  yFrom : 60,
  height : 40,
  colorBar : 'Red',
  xFromText : 10,
  yFromText : 85,
  colorText : 'Black' 
}

var bar2 = {
  xFrom : 100,
  yFrom : 120,
  height : 40,
  colorBar : 'Green',
  xFromText : 10,
  yFromText : 145,
  colorText : 'Black'
}

 var i = 0;
 var data = [];

function getStateName(stateNumber){
  var states = {
    '06' : 'California',
    '12' : 'Florida',
    '15' : 'Hawaii', 
    '20' : 'Kansas',
    '29' : 'Missouri',
    '56' : 'Wyoming'
  };
  return states[stateNumber];
}

function fillData(result, year){
   //var i = 0;
   //data = [];
   $('#chartsvg').empty();
   for (value of result){
     var obj = {};
     if (value[0] != 'P001001' && value[0] != 'P0010001'){
       obj.stateName  = getStateName(value[1]); 
       obj.populationM = (value[0]/1000000);
       obj.barLength  = Math.round(value[0]/50000); 
       obj.year = year;
       data.push(obj);
       i += i;
       //console.log('i' + i + value[0]);
       //console.log('data'  + data[i].stateName + 'pop ' + data[i].populationM + 'year ' + data[i].year);
     }
   } 
}

function getData(){
  return data.sort();
}

function apiCall(state1, state2){
  i=0;
  data = [];
  var vKey = '98c792ff74119a20565d7a84335db06fb6e0f679';
  var vFor = 'state:' + state1 + ',' + state2;
  var vGet = 'P001001'; //'P0010001';
  var apiUrl = 'http://api.census.gov/data/2000/sf1';
  var year = '2000';
  getStateData(state1, state2, vKey, vGet, vFor, apiUrl, year);
  apiUrl = 'https://api.census.gov/data/2010/sf1';
  vGet = 'P0010001';
  year = '2010';
  getStateData(state1, state2, vKey, vGet, vFor, apiUrl, year);
}

function getStateData(state1, state2, vKey, vGet, vFor, apiUrl, year){
  //console.log('begin getStateData');
  $.ajax({
    url: apiUrl,
    data: ({ key: vKey, get: vGet , for: vFor }),
    //dataType: 'json',//use jsonp to avoid cross origin issues
    type: 'GET'
    })
  .done(function(result){ //tis waits for the ajax to return with a succesful promise object
     //console.log('in the done');
     //console.log(result);
     //console.log(result[1][1]);
     // here call the function to draw the two columns
     fillData(result,year);
     drawBars(state1, state2, result);

  })
  .fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
      console.log('in the fail');
      console.log(jqXHR);
  });
}


function drawBars(state1, state2, result){
  var width = 1200;
  var height = 700;
  var barHeight = 40;
  var dataSet = getData();
  //console.log(dataSet[0].stateName);
  // fill the data array

  // create the chart
  var chart = d3.select('.chart')
      .attr('width', width)
      .attr('height', height);
  // create the bars in the chart
  var bar = chart.selectAll('g')
      .data(dataSet)
      .enter().append('g')
      .attr('transform', function(d, i) { return 'translate(50,' + ((i * barHeight)+50) + ')'; });
  bar.append('rect')
      .attr('width', function(d) { return d.barLength; })
      .attr('height', barHeight-2);
  
  bar.append('text')
    .attr('x', 210)
    .attr('y', barHeight / 2)
    .attr('dy', '0.35rem')
    .text(function(d){ return ' Census ' + d.year + ' ' + d.stateName +' Pop: ' + d.populationM + 'M'})    
}  

$(function(){
 	console.log('ready');
  //console.log(getAjaxRequest());
  var selected1 = $(this).find("select[name='states1']").val();
  var selected2 = $(this).find("select[name='states2']").val();
  apiCall(selected1, selected2);
  // register listener for the submit
  $('.choose-form').submit( function(e){
    e.preventDefault();
    var selected1 = $(this).find("select[name='states1']").val();
    var selected2 = $(this).find("select[name='states2']").val();
    apiCall(selected1, selected2);
    //console.log('statename ' + getStateName(selected1));
  });
  //drawBars();

});
