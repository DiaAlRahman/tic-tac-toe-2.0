const animateSmoke = (() => {
  function animatePoof() {
    var bgTop = 0,
      frame = 0,
      frames = 6,
      frameSize = 32,
      frameRate = 160;
    let puff = document.getElementById('puff');

    var animate = function () {
      if (frame < frames) {
        puff.style.backgroundPosition = "0 " + bgTop + "px";
        bgTop = bgTop - frameSize;
        frame++;
        setTimeout(animate, frameRate);
      }
    };

    animate();
    setTimeout(() => {
      puff.style.display = 'none';
    }, frames * frameRate);
  }

  let tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => {
    tile.addEventListener('click', (e) => {
      var xOffset = 24;
      var yOffset = 24;
      let puff = document.getElementById('puff');
      puff.style.left = (e.pageX - xOffset) + 'px';
      puff.style.top = (e.pageY - yOffset) + 'px';
      puff.style.display = 'block';
      animatePoof();
    });
  });
})();



//   var xOffset = 24;
//   var yOffset = 24;
//   // $(this).fadeOut('fast');
//   $('#puff').css({
//     left: e.pageX - xOffset + 'px',
//     top: e.pageY - yOffset + 'px'
//   }).show();
//   animatePoof();
// });
