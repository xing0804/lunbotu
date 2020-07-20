/*
    无缝轮播图    
    wins  String  元素的选择器  要放入轮播图地窗口  //选择器
    imgOpts  json格式  实现轮播图地各种选项
    img   数组  要包含轮播图图片的数组
    links  数组  图片跳转链接地址
    imgColor  数组  图片的底部颜色，用于全屏显示的颜色拼接
    imgSize  数组  第一个参数代表宽度，第二个参数代表高度
    btnColor  String  按钮的颜色 
    btnActive  String  获得焦点的按钮的颜色
    btnPos  数组   第一个参数代表的是X的位置，第二个参数代表的是y位置
*/

function wheel(wins, imgOpts,moveOpts) {
    //参数的初始化
    var wins = document.querySelector(wins);

    if (wins.nodeType != 1) {
        console.error("窗口元素not find");
        return;
    }
    //最后添加一个图片地址
    imgOpts.imgs.push(imgOpts.imgs[0]);
    //最后添加一个链接地址
    imgOpts.links.push(imgOpts.links[0]);
    //最后添加图片的颜色
    imgOpts.imgColor.push(imgOpts.imgColor[0]);

    var imgLength = imgOpts.imgs.length;
    console.log(imgLength);
    if (imgLength == 0) {
        console.error("没有传入相应的轮播内容");
        return;
    }
    var imgSize = imgOpts.imgSize;
    console.log(typeof imgSize);
    console.log(imgSize);
    // console.log(typeof Array);
    if (!imgSize instanceof Array) {
        console.error("请传入合法的尺寸类型");
    }
    if (imgSize.length == 0) {
        imgSize[0] = document.documentElement.clientWidth;
        imgSize[1] = 400;
    }

    if (imgSize.some(function (val) {
        return val == 0;
    })) {
        for (var i = 0; i < 2; i++) {
            if (imgSize[i] == 0) {
                imgSize[i] = 500;
            }
        }
    }

    var btnColor = imgOpts.btnColor || "green";
    var btnActive = imgOpts.btnActive || "red";
    var btnPos = imgOpts.btnPos ||["center", "20"];
    var time=moveOpts.time||5000;
    var movetime=moveOpts.movetime||500;
    var moveStyle=null;
    if(moveOpts.moveStyle=="linear"||!(moveOpts.moveStyle)){
        moveStyle=Tween.Linear;
    }else if(moveOpts.moveStyle=="in"){
        moveStyle=Tween.Quad.easeIn;
    }else if(moveOpts.moveStyle=="out"){
        moveStyle=Tween.Quad.easeOut;
    }

    //创建html结构和样式
    //1.win样式
    wins.style.cssText = "width:100%;height:" + imgSize[1] + "px;overflow:hidden;position:relative;";
    //2.添加容器
    var box = document.createElement("div");
    box.style.cssText = "width:" + imgLength * 100 + "%;height:100%;background:#ccc;";
    wins.appendChild(box);

    //创建每一个轮播图
    for (var i = 0; i < imgLength; i++) {
        var divList = document.createElement("div");
        divList.style.cssText = `float:left;width:${100 / imgLength}%;height:100%;background:${imgOpts.imgColor[i]}`;

        var link = document.createElement("a");
        link.href = imgOpts.links[i];
        link.style.cssText = "width:" + imgSize[0] + "px;height:" + imgSize[1] + "px;display:block;margin:0 auto;background:url(" + imgOpts.imgs[i] + ") no-repeat 0 0";
        divList.appendChild(link);
        box.appendChild(divList);
    }

    //创建按钮

    var btnBox = document.createElement("div");
    btnBox.style.cssText = "width:120px;height:20px;position:absolute;left:0;right:0;margin:auto;bottom:" + btnPos[1] + "px";
    var btns = [];

    for (var i = 0; i < imgLength - 1; i++) {

        if (i == 0) {
            var bgcolor = btnActive;
        } else {
            var bgcolor = btnColor;
        }
        // console.log(bgcolor);
        var btn = document.createElement("div");
        btn.style.cssText = "width:20px;height:20px;background:" + bgcolor + ";border-radius:50%;margin:0 10px;cursor:pointer;float:left";
        btnBox.appendChild(btn);
        btns.push(btn);
    }

    wins.appendChild(btnBox);

    //开始轮播

    //获取窗口大小
    var winW = parseInt(getComputedStyle(wins, null).width);
    console.log(winW);

    //滚动的函数

    function rotation() {
        num++;
        if (num > btns.length - 1) {
            animate(box, {
                "marginLeft": -num * winW
            }, movetime, moveStyle, function () {
                box.style.marginLeft = 0;
            });
            num = 0;
        } else {
            animate(box, {
                "marginLeft": -num * winW
            }, movetime,moveStyle)
        }

        for (var i = 0; i < btns.length; i++) {
            btns[i].style.background = btnColor;
        }
        btns[num].style.background = btnActive;
    }

    //自动轮播
    var num = 0;
    var t = setInterval(rotation, time)


    //按钮点击实现轮播
    for (let i = 0; i < btns.length; i++) {
        btns[i].onclick = function () {
            num = i;
            animate(box, {
                "marginLeft": -num * winW
            }, movetime)

            for (var j = 0; j < btns.length; j++) {
                btns[j].style.background = btnColor;
            }
            btns[num].style.background = btnActive;
        }
    }


    //鼠标移入移出事件

    wins.onmouseover = function () {
        clearInterval(t);
    }
    wins.onmouseout = function () {
        t = setInterval(rotation, 3000)
    }





}