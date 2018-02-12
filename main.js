var yyy = document.getElementById('xxx');
var context = yyy.getContext('2d');
var eraser = document.getElementById('eraser');
var brush = document.getElementById('brush');
var black = document.getElementById('black');
var red = document.getElementById('red');
var yellow = document.getElementById('yellow');
var blue = document.getElementById('blue');
var clear = document.getElementById('clear');
var thin = document.getElementById('thin');
var thick = document.getElementById('thick');
var download = document.getElementById('download');
var lineWidth = 1;


autoSetCanvas(yyy);

listenToUser(yyy);

//判断橡皮
var eraserEnabled = false;
brush.onclick = function () {
    eraserEnabled = false;
    brush.classList.add('active');
    eraser.classList.remove('active');
    clear.classList.remove('active');
    download.classList.remove('active');
    thin.classList.add('active');
    thick.classList.remove('active');
};
eraser.onclick = function () {
    eraserEnabled = true;
    eraser.classList.add('active');
    brush.classList.remove('active');
    clear.classList.remove('active');
    thin.classList.remove('active');
    thick.classList.remove('active');
    download.classList.remove('active');
};
//清除所有痕迹
clear.onclick = function clearCanvas() {
    yyy.height = yyy.height;
    clear.classList.add('active');
    brush.classList.remove('active');
    eraser.classList.remove('active');
    thin.classList.remove('active');
    thick.classList.remove('active');
    download.classList.remove('active');
};
//download
download.onclick = function () {
    download.classList.add('active');
    eraser.classList.remove('active');
    brush.classList.remove('active');
    clear.classList.remove('active');
    thin.classList.remove('active');
    thick.classList.remove('active');

    var url = yyy.toDataURL("image/png");
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'download';
    a.target = '_blank';
    a.click();
};

//更改颜色
black.onclick = function () {
    context.strokeStyle = 'red';
    context.fillStyle = 'red';
    black.classList.add('active');
    red.classList.remove('active');
    yellow.classList.remove('active');
    blue.classList.remove('active');
};
red.onclick = function () {
    context.strokeStyle = 'red';
    context.fillStyle = 'red';
    red.classList.add('active');
    black.classList.remove('active');
    yellow.classList.remove('active');
    blue.classList.remove('active');
};
yellow.onclick = function () {
    context.strokeStyle = 'yellow';
    context.fillStyle = 'yellow';
    yellow.classList.add('active');
    red.classList.remove('active');
    blue.classList.remove('active');
    black.classList.remove('active');
};
blue.onclick = function () {
    context.strokeStyle = 'blue';
    context.fillStyle = 'blue';
    blue.classList.add('active');
    yellow.classList.remove('active');
    red.classList.remove('active');
    black.classList.remove('active');
};

//线的粗细
thin.onclick = function () {
    lineWidth = 1;
    thin.classList.add('active');
    thick.classList.remove('active');
};
thick.onclick = function () {
    lineWidth = 5;
    thick.classList.add('active');
    thin.classList.remove('active');
};


//工具函数
function autoSetCanvas(canvas) {
    setCanvasSize();

    //获取页面宽高
    function setCanvasSize() {
        var pageWidth = document.documentElement.clientWidth;
        var pageHeight = document.documentElement.clientHeight;
        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }

    //用户更改视窗大小,重新获取页面宽高
    window.onresize = function () {
        setCanvasSize();
    };
}

function listenToUser(canvas) {
    var using = false;
    var lastPoint = {x: undefined, y: undefined};//记录上一个点

    //特性检测
    if (document.body.ontouchstart !== undefined) {
        //触屏设备
        canvas.ontouchstart = function (ev) {
            console.log(ev);
            var x = ev.touches[0].clientX;
            var y = ev.touches[0].clientY;
            using = true;
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10);
            } else {
                lastPoint = {"x": x, "y": y};
            }
        };

        canvas.ontouchmove = function (ev) {
            var x = ev.touches[0].clientX;
            var y = ev.touches[0].clientY;
            if (!using) {
                return;
            }
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10);
            } else {
                var newPoint = {"x": x, "y": y};
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }
        };

        canvas.ontouchend = function () {
            using = false;
        };
    } else {
        //非触屏设备
        //鼠标点下
        canvas.onmousedown = function (ev) {
            var x = ev.clientX;
            var y = ev.clientY;
            using = true;
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10);
            } else {
                lastPoint = {"x": x, "y": y};
            }
        };
        //鼠标移动
        canvas.onmousemove = function (ev) {
            var x = ev.clientX;
            var y = ev.clientY;
            if (!using) {
                return;
            }
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10);
            } else {
                var newPoint = {"x": x, "y": y};
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }
        };
        //鼠标抬起
        canvas.onmouseup = function () {
            using = false;
        };
    }

}

function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);//起点
    context.lineWidth = lineWidth;
    context.lineTo(x2, y2);//终点
    context.closePath();
    context.stroke();
}