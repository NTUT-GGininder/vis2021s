var cm;
var dp;

var myArray = [];
var Rick = [3,4,5,6,11,13];
var leftArray = [];
var rightArray = [];
var FontSize = 30;

function readData(Arr, src){
    d3.text(src).then(function(data) {
        console.log(data);
        var parsedCSV = d3.csvParseRows(data);
        var key;
        var begin;
        var end;
        var orgsubtitle = '';
        var subtitle = '';
        console.log(parsedCSV);
        d3.select('body')
            .data(parsedCSV)
            .enter()
            .text(function(d) {
                if (!isNaN(d) && d != '') {
                    key = parseInt(d) - 1;
                } else if (d == '') {
                    Arr.push({
                        'key': key,
                        'begin': begin,
                        'end': end,
                        'duration': end - begin,
                        'orgsubtitle': orgsubtitle,
                        'subtitle': subtitle
                    });
                    orgsubtitle = '';
                } else if (d.length === 3) {
                    console.log('Time', d);
                    var minute;
                    var second;

                    minute = parseInt(d[0][3]) * 10 + parseInt(d[0][4]);
                    second = parseInt(d[0][6]) * 10 + parseInt(d[0][7]);
                    begin = minute * 60 + second + parseInt(d[1][0]) / 10.0 + parseInt(d[1][1]) / 100.0;

                    minute = parseInt(d[1][11]) * 10 + parseInt(d[1][12]);
                    second = parseInt(d[1][14]) * 10 + parseInt(d[1][15]);
                    end = minute * 60 + second + parseInt(d[2][0]) / 10.0 + parseInt(d[2][1]) / 100.0;
                    console.log(end);
                } else {
                    if (orgsubtitle === '') {
                        orgsubtitle = d[0];
                    } else {
                        subtitle = d[0];
                    }
                }
            });
    });
}
function play(){
    $("svg").empty();
    let height = 40;
    let width = $('#video').width();
    // $('#mixU').attr('viewBox', '0 0 '+width+' '+height+'px');
    playGrandBlue(width, height, this.currentTime);
}
//init
$(function(){
    readData(myArray, './src/grand_blue.srt');
    console.log(myArray);
    readData(leftArray, './src/left.srt');
    readData(rightArray,'./src/right.srt')
    console.log(leftArray);
    $("#video").on("play seeked", play);
    $("#video").on("pause",function(e){
        console.log("pause");
        $("svg").empty();
    })
});


function playGrandBlue(width, height, currentTime) { 
    console.log(currentTime)
    d3.select('#sperate')
        .style('display', 'none')
        d3.select('#mix')
        .style('display', '')

    d3.select('#mixU')
        .selectAll('text')
        .data(myArray)
        .enter()
        .append('text')
        .text(function(d) {
            return d.orgsubtitle;
        })
        .attr('x', width / 2)
        .attr('y', height/2)
        .attr('font-size', FontSize+'pt')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline','central')
        .attr('stroke',function(d){
            if(Rick.includes(d.key))
                return '#6F4E37';
            return '#29799e';
        })
        .attr('stroke-width','1px')
        .attr('opacity', 0)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime)
                return 0;
            return (d.begin - currentTime) * 1000;
        })
        .duration(0)
        .attr('opacity', 1)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime && d.end > currentTime)
                return (d.end - currentTime)*1000;
            else if(currentTime <= d.begin)
                return d.duration * 1000;
            else
                return 0;
        })
        .attr('opacity', 0);

    d3.select('#mixD')
        .selectAll('text')
        .data(myArray)
        .enter()
        .append('text')
        .text(function(d) {
            return d.subtitle;
        })
        .attr('x', width / 2)
        .attr('y', height/2)
        .attr('font-size', FontSize+'pt')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline','central')
        .attr('stroke',function(d){
            if(Rick.includes(d.key))
                return '#6F4E37';
            return '#29799e';
        })
        .attr('stroke-width','1px')
        .attr('opacity', 0)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime)
                return 0;
            return (d.begin - currentTime) * 1000;
        })
        .duration(0)
        .attr('opacity', 1)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime && d.end > currentTime)
                return (d.end - currentTime)*1000;
            else if(currentTime <= d.begin)
                return d.duration * 1000;
            else
                return 0;
        })
        .attr('opacity', 0);

        d3.select('#speRU')
        .attr('width', width/2)
        .selectAll('text')
        .data(rightArray)
        .enter()
        .append('text')
        .text(function(d) {
            return d.orgsubtitle;
        })
        .attr('x', width / 4)
        .attr('y', height/2)
        .attr('font-size', FontSize/2+'pt')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline','central')
        .attr('stroke','#29799e')
        .attr('stroke-width','1px')
        .attr('opacity', 0)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime)
                return 0;
            return (d.begin - currentTime) * 1000;
        })
        .duration(0)
        .attr('opacity', 1)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime && d.end > currentTime)
                return (d.end - currentTime)*1000;
            else if(currentTime <= d.begin)
                return d.duration * 1000;
            else
                return 0;
        })
        .attr('opacity', 0);

        d3.select('#speRD')
        .attr('width', width/2)
        .selectAll('text')
        .data(rightArray)
        .enter()
        .append('text')
        .text(function(d) {
            return d.subtitle;
        })
        .attr('x', width / 4)
        .attr('y', height/2)
        .attr('font-size', FontSize/2+'pt')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline','central')
        .attr('stroke','#29799e')
        .attr('stroke-width','1px')
        .attr('opacity', 0)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime)
                return 0;
            return (d.begin - currentTime) * 1000;
        })
        .duration(0)
        .attr('opacity', 1)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime && d.end > currentTime)
                return (d.end - currentTime)*1000;
            else if(currentTime <= d.begin)
                return d.duration * 1000;
            else
                return 0;
        })
        .attr('opacity', 0);

        d3.select('#speLU')
        .attr('width', width/2)
        .selectAll('text')
        .data(leftArray)
        .enter()
        .append('text')
        .text(function(d) {
            return d.orgsubtitle;
        })
        .attr('x', width / 4)
        .attr('y', height/2)
        .attr('font-size', FontSize/2+'pt')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline','central')
        .attr('stroke','#6F4E37')
        .attr('stroke-width','1px')
        .attr('opacity', 0)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime)
                return 0;
            return (d.begin - currentTime) * 1000;
        })
        .duration(0)
        .attr('opacity', 1)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime && d.end > currentTime)
                return (d.end - currentTime)*1000;
            else if(currentTime <= d.begin)
                return d.duration * 1000;
            else
                return 0;
        })
        .attr('opacity', 0);

        d3.select('#speLD')
        .attr('width', width/2)
        .selectAll('text')
        .data(leftArray)
        .enter()
        .append('text')
        .text(function(d) {
            return d.subtitle;
        })
        .attr('x', width / 4)
        .attr('y', height/2)
        .attr('font-size', FontSize/2+'pt')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline','central')
        .attr('stroke','#6F4E37')
        .attr('stroke-width','1px')
        .attr('opacity', 0)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime)
                return 0;
            return (d.begin - currentTime) * 1000;
        })
        .duration(0)
        .attr('opacity', 1)
        .transition()
        .delay(function(d) {
            if(d.begin < currentTime && d.end > currentTime)
                return (d.end - currentTime)*1000;
            else if(currentTime <= d.begin)
                return d.duration * 1000;
            else
                return 0;
        })
        .attr('opacity', 0);
    
    d3.select('#mix')
        .transition()
        .delay(function(){
            if(currentTime > myArray[myArray.length-1].end)
                return 0;
            return (myArray[myArray.length-1].end - currentTime) * 1000
        })
        .style('display', 'none')
    d3.select('#sperate')
        .attr('width', width)
        .transition()
        .delay(function(){
            if(currentTime > myArray[myArray.length-1].end)
                return 0;
            return (myArray[myArray.length-1].end - currentTime) * 1000
        })
        .style('display', '');
    }
