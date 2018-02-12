var yyy = document.getElementById('xxx');
var context = yyy.getContext('2d');
var eraser = document.getElementById('eraser');
var brush = document.getElementById('brush');
var actions = document.getElementById('actions');

autoSetCanvas(yyy);

listenToUser(yyy);

//判断橡皮
var eraserEnabled = false;
eraser.onclick = function () {
    eraserEnabled = true;
    actions.className = 'actions x';
};
brush.onclick = function () {
    eraserEnabled = false;
    actions.className = 'actions';
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
    context.lineWidth = 5;
    context.lineTo(x2, y2);//终点
    context.closePath();
    context.stroke();
}