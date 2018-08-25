window.onload = function () {
  var audio = new Audio();
  audio.src = 'music/Starting.mp3';

  var button_pause = document.getElementById('pause');
  button_pause.addEventListener('click',function () {
    audio.pause();
  });

  var button_play = document.getElementById('play_m');
  button_play.addEventListener('click',function () {
    audio.play();
  });

  var poind_show = document.getElementById('points');
  var button_start = document.getElementById('staring');

  button_start.addEventListener('click',function () {

    var canvas = document.getElementById('game');
    var context = canvas.getContext('2d');
    canvas.style.cursor = 'none';

    var i, ship, Timer;
    var aster = [];
    var fire = [];
    var expl = [];
    var heart = [{x: 0, y: 5}, {x: 35, y: 5}, {x: 70, y: 5}];
    var point = 0;
//загрузка ресурсов
    var aster_img = new Image();
    aster_img.src = 'img/astero.png';

    var shield_img = new Image();
    shield_img.src = 'img/shield.png';

    var fire_img = new Image();
    fire_img.src = 'img/fire.png';

    var ship_img = new Image();
    ship_img.src = 'img/ship.png';

    var expl_img = new Image();
    expl_img.src = 'img/expl222.png';

    var fon_img = new Image();
    fon_img.src = 'img/fonStart.png';

    var heart_img = new Image();
    heart_img.src = 'img/heart.png';

//старт игры
    fon_img.onload = function () {
      poind_show.innerText = point;
      init();
      game();
    };


//совместимость с браузерами
    var requestAnimFrame = (function () {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 20);
        };
    })();

//начальные установки
    function init() {
      canvas.addEventListener("mousemove", function (event) {
        ship.x = event.offsetX - 25;
        ship.y = event.offsetY - 13;
      });

      Timer = 0;
      ship = {x: 300, y: 300, animx: 0, animy: 0};
      audio.play();
    }

//основной игровой цикл
    function game() {
      if (heart.length == 0) {
        alert(point);
        audio.pause();
        return 0;}
      update();
      render();

      requestAnimFrame(game);
    }

//функция обновления состояния игры
    function update() {
      Timer++;


//спавн астероидов
      if (Timer % 40 == 0) {
        aster.push({
          angle: 0,
          dxangle: Math.random() * 0.2 - 0.1,
          del: 0,
          x: Math.random() * 650,
          y: -50,
          dx: Math.random() * 2 - 1,
          dy: Math.random() * 2 + 1
        });

      }
//выстрел
      if (Timer % 30 == 0) {
        fire.push({x: ship.x + 10, y: ship.y, dx: 0, dy: -5.2});
      }

//движение астероидов
      for (i in aster) {
        aster[i].x = aster[i].x + aster[i].dx;
        aster[i].y = aster[i].y + aster[i].dy;
        aster[i].angle = aster[i].angle + aster[i].dxangle;

        //граничные условия (коллайдер со стенками)
        if (aster[i].x <= 0 || aster[i].x >= 650) aster[i].dx = -aster[i].dx;
        if (aster[i].y >= 650) aster.splice(i, 1);

        //проверим каждый астероид на столкновение с каждой пулей
        for (j in fire) {


          if (Math.abs(aster[i].x + 25 - fire[j].x - 15) < 50 && Math.abs(aster[i].y - fire[j].y) < 25) {
            //произошло столкновение

            //спавн взрыва
            expl.push({x: aster[i].x - 25, y: aster[i].y - 25, animx: 0, animy: 0});

            //помечаем астероид на удаление
            aster[i].del = 1;
            fire.splice(j, 1);
            // добавляем очки и меняем фон, музыку
            point += 100;
            poind_show.innerText = point;

            if (point == 1000){
              fon_img.src = 'img/fonEnd.png';
              audio.src = 'music/EarthMusic.mp3';
              audio.play();
            }
            break;
          }
        }
        //проверим каждый астероид на столкновение с короблем
        for (j in aster) {


          if (Math.abs(aster[i].x + 25 - ship.x - 15) < 50 && Math.abs(aster[i].y - ship.y) < 25) {
            //произошло столкновение

            //спавн взрыва
            expl.push({x: aster[i].x - 25, y: aster[i].y - 25, animx: 0, animy: 0});

            //помечаем астероид на удаление
            aster[i].del = 1;
            heart.pop();

            break;
          }
        }

        //удаляем астероиды
        if (aster[i].del == 1) aster.splice(i, 1);
      }

//двигаем пули
      for (i in fire) {
        fire[i].x = fire[i].x + fire[i].dx;
        fire[i].y = fire[i].y + fire[i].dy;

        if (fire[i].y < -30) fire.splice(i, 1);
      }

//Анимация взрывов
      for (i in expl) {
        expl[i].animx = expl[i].animx + 0.5;
        if (expl[i].animx > 7) {
          expl[i].animy++;
          expl[i].animx = 0
        }
        if (expl[i].animy > 7)
          expl.splice(i, 1);
      }

//анимация щита
      ship.animx = ship.animx + 1;
      if (ship.animx > 4) {
        ship.animy++;
        ship.animx = 0
      }
      if (ship.animy > 3) {
        ship.animx = 0;
        ship.animy = 0;
      }
    }

    function render() {
      //рисуем фон
      context.drawImage(fon_img, 0, 0, 700, 600);
      //рисуем пули
      for (i in fire) {
        context.drawImage(fire_img, fire[i].x, fire[i].y, 30, 30);
      }
      //рисуем корабль
      context.drawImage(ship_img, ship.x, ship.y);
      //рисуем щит
      context.drawImage(shield_img, 192 * Math.floor(ship.animx), 192 * Math.floor(ship.animy), 192, 192, ship.x - 25, ship.y - 25, 100, 100);
      //рисуем астероиды
      for (i in aster) {
        //вращение астероидов
        context.save();
        context.translate(aster[i].x + 25, aster[i].y + 25);
        context.rotate(aster[i].angle);
        context.drawImage(aster_img, -25, -25, 50, 50);
        context.restore();
      }
      //рисуем взрывы
      for (i in expl) {
        context.drawImage(expl_img, 128 * Math.floor(expl[i].animx), 128 * Math.floor(expl[i].animy), 128, 128, expl[i].x, expl[i].y, 100, 100);
      }
      //рисуем жизни
      for (i in heart) {
        context.drawImage(heart_img, heart[i].x, heart[i].y, 60, 60)
      }
    }






  });


};



