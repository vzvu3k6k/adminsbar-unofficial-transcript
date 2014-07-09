document.addEventListener("DOMContentLoaded", function(){
  var wrapper = Popcorn.HTMLSoundCloudAudioElement(document.querySelector('#audio'));
  wrapper.src = 'https://soundcloud.com/adminsbar/adminsbar-1';
  wrapper.controls = true;
  var popcorn = Popcorn(wrapper);

  function toSec(str){ // "01:10" -> 70 (sec)
    return str.split(':').reverse().reduce(function(prev, current, idx){
      return prev + parseInt(current, 10) * Math.pow(60, idx);
    }, 0);
  }

  var timeline = Array.prototype.map.call(
    document.querySelectorAll('.transcript > p'),
    function($p){
      return {
        node: $p,
        startTime: toSec($p.dataset.startTime),
        endTime: toSec($p.dataset.endTime)
      };
    }
  );

  function clearSpeaking(){
    Array.prototype.forEach.call(
      document.querySelectorAll('.speaking'),
      function(i){i.classList.remove('speaking')}
    );
  }

  function setSpeaking(node){
    clearSpeaking();
    node.classList.add('speaking');
    scrollIntoMiddle(node);
  }

  function scrollIntoMiddle(node){
    var parent = node.parentNode;
    parent.scrollTop += node.getBoundingClientRect().top - parent.getBoundingClientRect().top - parent.clientHeight/2;
  }

  timeline.forEach(function(i){
    popcorn.cue(i.startTime, setSpeaking.bind(null, i.node));
    popcorn.cue(i.endTime, clearSpeaking);
  });

  var style = document.createElement('style');
  style.textContent = '.transcript p {cursor: pointer;}' +
    '.transcript p:hover:not(.speaking) {background-color: #ddd;}';
  document.head.appendChild(style);

  document.querySelector('.transcript').addEventListener('click', function(event){
    var startTime = event.target.dataset.startTime;
    if(startTime){
      popcorn.play(toSec(startTime));
    }
  });

  // seeked event is not triggered when you seek on soundcloud player
  popcorn.on('seeked', function(){
    for(var i = 0; i < timeline.length; i++){
      if(timeline[i].startTime <= this.currentTime()){
        if(timeline[i].endTime > this.currentTime()){
          setSpeaking(timeline[i].node);
          return;
        }else if(i == timeline.length - 1 ||
                 timeline[i + 1].startTime > this.currentTime()){
          scrollIntoMiddle(timeline[i].node);
          return;
        }
      }
    }
    clearSpeaking();
  });
}, false);
