var cm;
var dp;

var myArray = new Array();
var Ricks = new Array();
var Rick = [3,4,5,6,11,13];
var leftArray = [];
var rightArray = [];
var FontSize = 30;
var sub1 = [];

function playSub(svgID, texts, width, height, fontSize, currentTime=0){
    d3.select('#'+ svgID)
        .attr('width', width)
        .attr('height', height)
        .selectAll('text')
        .data(texts)
        .enter()
        .append('text')
        .text(function(d) {
            return d.subtitle;
        })
        .attr('x', width / 2)
        .attr('y', height/2)
        .attr('font-size', fontSize)
        .attr('fill', function(d){ return d.color})
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline','central')
        .attr('stroke', function(d){ return d.strokeColor})
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
}

function playOrgSub(svgID, texts, width, height, fontSize, currentTime=0){
    d3.select('#'+ svgID)
        .attr('width', width)
        .attr('height', height)
        .selectAll('text')
        .data(texts)
        .enter()
        .append('text')
        .text(function(d) {
            return d.orgsubtitle;
        })
        .attr('x', width / 2)
        .attr('y', height/2)
        .attr('font-size', fontSize)
        .attr('fill', function(d){ return d.color})
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline','middle')
        .attr('stroke', function(d){ return d.strokeColor})
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
}

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
//init
$(function(){
    readData(myArray, './src/grand_blue.srt');
    readData(sub1, './src/Sincerely.srt');
    console.log(myArray);
    console.log(sub1);
    readData(leftArray, './src/left.srt');
    readData(rightArray,'./src/right.srt')
    console.log(leftArray);

    read(SN, './src/Goodbye Declaration/SongName.srt');
    read(verse, './src/Goodbye Declaration/verse.srt');
    read(chorus,'./src/Goodbye Declaration/chorus.srt')
    $('.custom-seekbar').css('width', function(){
        console.log($(this).closest('.container').find('video').width())
        return $(this).closest('.container').find('video').width();
    });
    $("#video").on("play seeked", function(e){
        this.controls = false;
        $(this).closest('.container').find('svg').empty();
        let height = $(this).closest(".container").find('.overlay').height() / 2;
        let width = $('#video').width();
        playGrandBlue(width, height, this.currentTime);
    });
    $("video").on("pause",function(e){
        this.controls = true;
        console.log("pause");
        $(this).closest('.container').find('svg').empty();
    })
    $("#video1").on("play seeked", function(e){
        this.controls = false;
        $(this).closest('.container').find('svg').empty();
        let height = $(this).closest(".container").find('.overlay').height() / 2;
        let width = $('#video1').width();
        playSincerely(width, height, this.currentTime);
    });
    $("#video2").on("play seeked", function(e){
        this.controls = false;
        $(this).closest('.container').find('svg').empty();
        $(this).closest('.container').find('.overlayAll').css("display","");
        let height = $(this).height();
        let width = $(this).width();
        playGD(width, height, this.currentTime);
    });

    $('video').on('timeupdate',function(){
        // console.log('update');
        var percentage = ( this.currentTime / this.duration ) * 100;
        // console.log($(this).closest('.container').find(".custom-seekbar span"));
        $(this).closest('.container').find(".custom-seekbar span").css("width", percentage+"%");
    });
      
    $(".custom-seekbar").on("click", function(e){
        let vid = $(this).closest('.container').find('video')[0];
        var offset = $(this).offset();
        console.log(offset)
        var left = (e.pageX - offset.left);
        console.log(e.pageX)
        var totalWidth = $(".custom-seekbar").width();
        console.log(totalWidth)
        var percentage = ( left / totalWidth );
        var vidTime = vid.duration * percentage;
        console.log(vid);
        console.log(vid.currentTime);
        vid.currentTime  = vidTime;
    });
    $("#video2").on("pause", function(e){
        $(this).closest('.container').find('svg').empty();
        $(this).closest('.container').find('.overlayAll').css("display","none");
    });
});


function playGrandBlue(width, height, currentTime) { 
    console.log(currentTime)
    if( myArray.length !==0 && rightArray.length !==0 && leftArray.length !==0){
        for(let i=myArray.length-1;i>=0;i--){
            myArray[i]['color'] = 'white';
            if(Rick.includes(i))
                myArray[i]['strokeColor'] = '#6F4E37';
            else
                myArray[i]['strokeColor'] = '#29799e';
        }
        for(let i=rightArray.length-1;i>=0;i--){
            rightArray[i]['color'] = 'white';
            rightArray[i]['strokeColor'] = '#29799e';
        }
        for(let i=leftArray.length-1;i>=0;i--){
            leftArray[i]['color'] = 'white';
            leftArray[i]['strokeColor'] = '#6F4E37';
        }
    }
    d3.select('#sperate')
        .style('display', 'none')
    d3.select('#mix')
        .style('display', '')

    playOrgSub('mixU', myArray, width, height, height*0.8, currentTime);
    playSub('mixD', myArray, width, height, height*0.8, currentTime);
    playOrgSub('mixU', Ricks, width, height, height*0.8, currentTime);
    playSub('mixD', Ricks, width, height, height*0.8, currentTime);
    playOrgSub('speRU', rightArray, width/2, height/2, height*0.8/2, currentTime);
    playSub('speRD', rightArray, width/2, height/2, height*0.8/2, currentTime);
    playOrgSub('speLU', leftArray, width/2, height/2, height*0.8/2, currentTime);
    playSub('speLD', leftArray, width/2, height/2, height*0.8/2, currentTime);
    
    d3.select('#mix')
        .transition()
        .delay(function(){
            console.log(currentTime > myArray[myArray.length-1].end)
            if(currentTime > myArray[myArray.length-1].end)
                return 0;
            console.log(currentTime > myArray[myArray.length-1].end * 1000)
            return (myArray[myArray.length-1].end - currentTime) * 1000
        })
        .style('display', 'none')
    d3.select('#sperate')
        .style('width', width+'px')
        .transition()
        .delay(function(){
            if(currentTime > myArray[myArray.length-1].end)
                return 0;
            return (myArray[myArray.length-1].end - currentTime) * 1000
        })
        .style('display', '');
}

function playSincerely(width, height, currentTime){
    if(sub1.length!==0){
        for(let i=sub1.length-1;i>=0;i--){
            sub1[i]['color'] = 'white';
            sub1[i]['strokeColor'] = '#f6e9cc';
        }
        console.log(sub1);
    }
    playOrgSub('sub1U', sub1, width, height, FontSize, currentTime);
    playSub('sub1D', sub1, width, height, FontSize, currentTime);
}
