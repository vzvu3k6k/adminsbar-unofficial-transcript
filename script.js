document.addEventListener("DOMContentLoaded", function(){
  var $audio = document.querySelector('audio');
  var popcorn = Popcorn($audio);
  popcorn.footnote({
    start: 1,
    end: 6,
    text: "Pop!",
    target: "footnote"
  });
  popcorn.on('playing', function(event){
    console.log(1);
  });

  var timeline = Array.prototype.map.call(
    document.querySelectorAll('.transcript > p'),
    function($p){
      function toSec(str){
        // data-time="01:10" -> 70 (sec)
        return str.split(':').reverse().reduce(function(prev, current, idx){
          return prev + parseInt(current, 10) * Math.pow(60, idx);
        }, 0);
      }

      var result = {node: $p, startTime: toSec($p.dataset.startTime)};
      if($p.dataset.endTime){
        result.endTime = toSec($p.dataset.endTime);
      }
      return result;
    }
  );

  function clearHighlight(){
    Array.prototype.forEach.call(
      document.querySelectorAll('.speaking'),
      function(i){i.classList.remove('speaking')}
    );
  }

  function setHighlight(node){
    clearHighlight();
    node.classList.add('speaking');
  }

  timeline.forEach(function(i){
    popcorn.cue(i.startTime, setHighlight.bind(null, i.node));
    if(i.endTime){
      popcorn.cue(i.endTime, clearHighlight);
    }
  });

  popcorn.play();
}, false);
