var SN=[];
var verse=[];
var chorus=[]

//var console = {};
//console.log = function(){};

var isEmpty = function(data) {
    if (typeof(data) === 'object') {
      if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') {
        return true;
      } else if (!data) {
        return true;
      }
      return false;
    } else if (typeof(data) === 'string') {
      if (!data.trim()) {
        return true;
      }
      return false;
    } else if (typeof(data) === 'undefined') {
      return true;
    } else {
      return false;
    }
}
  

function read(Arr, src){
    d3.text(src).then(function(data) {
        console.log(data);
        let parsedCSV = d3.csvParseRows(data);
        let key;
        let begin;
        let duration;
        let end;
        let subtitle = '';
        let x;
        let y;
        let width;
        let height;
        let color;
        let strokeColor;
        let writing_mode;
        let rotate=null;
        let flag = false;
        let fontSize;
        console.log(parsedCSV);
        function initP(){
            key=null;
            begin=null;
            duration=null;
            end=null;
            subtitle = '';
            x=null;
            y=null;
            width=null;
            height=null;
            fontSize=null;
            color=null;
            strokeColor=null;
            writing_mode=0;
            rotate=null;
            flag = false;
        }
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
                        'duration': duration,
                        'x': x,
                        'y': y,
                        'width':width,
                        'height':height,
                        'fontSize':fontSize,
                        'color':color,
                        'strokeColor':strokeColor,
                        'writing-mode':writing_mode,
                        'rotate': rotate,
                        'subtitle': subtitle
                    });
                    initP();
                } else if (d.length === 3 && !flag) {
                    console.log('Time', d);
                    var minute;
                    var second;

                    minute = parseInt(d[0][3]) * 10 + parseInt(d[0][4]);
                    second = parseInt(d[0][6]) * 10 + parseInt(d[0][7]);
                    begin = minute * 60 + second + parseInt(d[1][0]) / 10.0 + parseInt(d[1][1]) / 100.0;

                    minute = parseInt(d[1][11]) * 10 + parseInt(d[1][12]);
                    second = parseInt(d[1][14]) * 10 + parseInt(d[1][15]);
                    end = minute * 60 + second + parseInt(d[2][0]) / 10.0 + parseInt(d[2][1]) / 100.0;
                    flag = !flag;
                    console.log(end);
                } else if (d.length > 3 && !isNaN(begin)) {
                    x=d[0];
                    y=parseInt(d[1]);
                    width=parseInt(d[2]);
                    height=parseInt(d[3]);
                    fontSize=parseInt(d[4]);
                    color=d[5];
                    strokeColor=d[6];
                    writing_mode=parseInt(d[7]);
                    duration = end - begin;
                    if(d.length> 8){
                        rotate = {
                            'degree': d[8]                        }
                    }
                } else {
                    if (subtitle === '') 
                        subtitle = d[0];
                }
            });
    });
}

function playGD(width, height, currentTime){
    console.log('GD');
    console.log(SN);
    console.log(verse);
    console.log(chorus);
    d3.select('#SN')
        .attr('width', width)
        .attr('height', height)
        .selectAll('text')
        .data(SN.concat(verse).concat(chorus))
        .enter()
        .append('text')
        .text(function(d) {
            return d.subtitle;
        })
        .attr('x', function(d) {
            return d.x;
        })
        .attr('y', function(d) {
            return d.y;
        })
        .attr('font-size', function(d) {
            return d.fontSize;
        })
        .attr('transform',function(d){
            if(!isEmpty(d.rotate)){
                console.log('rotate',d);
                return 'rotate('+ d.rotate['degree'] +','+ $(this).attr('x') +','+ $(this).attr('y') +')';
            }
            return '';
        })
        .attr('fill', function(d){ return d.color})
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline','central')
        .attr('stroke', function(d){ return d.strokeColor})
        .attr('stroke-width','1px')
        .attr('writing-mode',function(d){
            if(d['writing-mode']==1){
                return 'tb';
            }
            return '';
        })
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
}