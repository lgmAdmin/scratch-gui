$('#load').text(window.parent.block_msg_load_model);
$('#nameTilt').text(window.parent.block_msg_name);
$('#instructionsTilt').text(window.parent.block_msg_instructions);
$('#addClass').text(window.parent.block_msg_addClass);
$('#trainingModel').text(window.parent.block_msg_trainingModel);
$('#exportModel').text(window.parent.block_msg_exportModel);
$('#playModel').text(window.parent.block_msg_playModel);
$('#c1').val(window.parent.block_msg_class+" 1");
$('#c2').val(window.parent.block_msg_class+" 2");
$('#n1').text(window.parent.block_msg_sample_num);
$('#n2').text(window.parent.block_msg_sample_num);


var openFileName = GetQueryString("name");//编程项目名称
var opennum = GetQueryString("opennum");//打开项目的下标
var MType = GetQueryString("MType");//当前项目类型
var  oldProjectName='';
var p = window.parent;
let NUM_CLASS = 2;//新增类数量
let SUM_CLASS = NUM_CLASS;//所有类之和

let NUM_IMG = 0;//新增图片累计数量

let sampleSize = 0;//所有样本数量
let MINsampleSize = 10;//最小训练数量

let imageDATA=[];//图像数据
let cameraType1 = false;

let playModelType = false;
let openFileEnd='T';//判断打开文件成功与否


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = decodeURIComponent(r[2]);
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

if(opennum>=0){//打开的项目
    openFileEnd="F";
    //p.openMP(opennum);//会跳转去初始化
}




/*const*/
let classChecked_div;//当前选中的div（类）

let video = document.getElementById('cameraView');//相机视图

let trainingModel = $('#trainingModel');//训练按钮
let trainingModel_progress = $('#trainingModel_progress');//训练进度条整体
let progressText = $('#progressText');//进度条文本描述
let barTrain = $('#barTrain');//进度条块

let show_video = document.getElementById('show_cameraView');//展示视图

const cardContainer = document.getElementById('cards-container');

/*点击返回上一界面*/
$('#back').click(function() {
    saveProject(false);
    p.page= 'ai_choice';
    location.replace("ai_choice.html?name="+openFileName);
});

/*点击标题*/
$('#tilt').click(function() {
    openEdit_win();
});
/*点击编辑标题按钮*/
$('#tiltEdit').click(function() {
    openEdit_win();
});

/*点击遮罩层*/
$('#maskLayer').click(function() {
    $('#tilt').text( $('#name').val() );
    closeEdit_win()
});
/*点击导出项目*/
$('#exportProject').click(function() {
    saveProject(true);
});
/*点击开始训练*/
$('#trainingModel').click(function() {
    if(sampleSize < MINsampleSize) return;//超出无功能
    var canTrain = true;
    $("#cards-container").find(".card_numText_n").each(function(index, element) {//空类不允许训练
        var value = $(element).text();
        //console.log("Card " + (index + 1) + " 的样本数量是: " + value);
        if(parseInt(value)<=0){
            alert("样本数量不能为空")
            canTrain = false;
            return false;
        }
    });
    if(!canTrain) return;

    //createModel()
    trainingModel.css('display', 'none');
    trainingModel_progress.css('display', 'block');
    // 强制重新渲染再执行 trainModel
    setTimeout(function() {
        trainModel();
    }, 100);
});
/*点击导出模型*/
$('#exportModel').click(function() {
console.log(!isTrain)
    if(!isTrain) return;
    //alert('导出模型--功能暂未开放')

    if(playModelType){
        endShow();
    }else{
        startShow();
    }

});
/*点击使用模型*/
$('#playModel').click(async function() {
    if(!isTrain) return;
    saveProject(false);//保存模型项目文件
    saveModel();//保存模型
});
function goPlay(name){//跳转编程界面
    p.page= 'index';
    location.replace("../tests/play_M1.html?type=o&name="+openFileName+".bricksm&MdType="+MType+"&modelName="+name);
}

/*点击翻转相机*/
$('#cameraWinButton_cut').click(function() {
    closeCamera(); // 关闭当前摄像头
    cameraType1 = !cameraType1; // 切换摄像头类型
    setupCamera(); // 重新打开摄像头
});
/*拍摄按钮开始点击*/
$('#cameraWinButton_shoot').on('touchstart mousedown', function(e) {
    handleButtonStart(e);
});
/*拍摄按钮结束点击*/
$('#cameraWinButton_shoot').on('touchend mouseup', function(e) {
    handleButtonEnd(e);
    /*e.preventDefault();
    e.stopPropagation();
    clearInterval(shootTime);*/
});


function handleButtonEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    clearInterval(shootTime);
}
/*点击关闭相机窗口*/
$('#cameraWinButton_close').click(function() {
    closeCameraWin();
});

/*打开标题编辑窗口*/
function openEdit_win(){
    $('#name').val( $('#tilt').text() );
    $('#maskLayer').css('display', 'block');
    $('#editWin').css('display', 'block');
}
/*关闭标题编辑窗口*/
function closeEdit_win(){
    $('#maskLayer').css('display', 'none');
    $('#editWin').css('display', 'none');
}
/*新增类*/
function addCard() {
    NUM_CLASS++;
    SUM_CLASS++;//类之和累加

    const card = document.createElement('div');
    card.classList.add('card');
    card.id = 'card-'+NUM_CLASS;
    card.innerHTML = `
        <div class="card_top" id="card-${NUM_CLASS}"></div>
        <input type="text"  value="${window.parent.block_msg_class} ${NUM_CLASS}" />
        <button class="delete" onclick="deleteCard(this)">×</button>
        <button class="camera" onclick="openCamera(this)"></button>
        <button class="upload gray" onmousedown="handleButtonStart(event)" onmouseup="handleButtonEnd(event)" ontouchstart="handleButtonStart(event)" ontouchend="handleButtonEnd(event)"></button>
        <p class="card_numText"><span class="card_numText_n">0</span>${window.parent.block_msg_sample_num}</p>
        <div class="photoLibrary"> </div>
    `;
    cardContainer.appendChild(card);
    if(MType=='I'){
        createModel();//重新创建训练模型
    }else{
        model = createModel();//重新创建训练模型
    }

    // 自动滚动到父级 class_add 的最底部
    const classAdd = document.querySelector('.class_add');
    classAdd.scrollTop = classAdd.scrollHeight;
}

/*删除卡片*/
function deleteCard(button) {
    if(cameraType) return;
    var card = button.parentElement;
    var dellab = parseInt(card.id.split('-')[1])-1;
    //删除数据
    data.forEach((da,index)=>{
       if(da.label==dellab){
           data.splice(index,1)
       }
    })

    for(let i = data.length - 1; i >= 0; i--){
        var da = data[i]
        if(da.label==dellab){
           data.splice(i,1)
        }
    }
    for(let i = imageDATA.length - 1; i >= 0; i--){
        var con = imageDATA[i]
        if(con.data.label==dellab){
           imageDATA.splice(i,1)
        }
    }
    //删除card
    card.remove();
    //样本总量减少
    sampleSize -= parseInt($(card).find('.card_numText_n').text());
    SUM_CLASS -= 1;//类之和减少
    /*if(MType=='I'){
        createModel();//重新创建训练模型
    }else{
        model = createModel();//重新创建训练模型
    }*/
}

/*删除照片*/
function deletePhoto(button) {
    var photo = button.parentElement;
    var card = (photo.parentElement).parentElement;

    //删除数据
    var pd,lab;
    relation.forEach(rela=>{
        if(rela.img==photo.id){
            pd=rela.pose
            lab=rela.label
        }
    })
    data.forEach((da,index)=>{
        if(da.pose==pd && da.label==lab){
            data.splice(index,1)
        }
    })
    imageDATA.forEach((con,index)=>{
        if(con.data.pose==pd && con.data.label==lab){
            imageDATA.splice(index,1)
        }
    })

    //删除img
    photo.remove()

    //样本总量减少
    card.querySelector('.card_numText_n').textContent = parseInt(card.querySelector('.card_numText_n').textContent)-1;
    sampleSize--;
}


/*展开相机窗口*/
function openCamera(button) {
    if(cameraType==true && classChecked_div==button.parentNode){//如果摄像头打开，再次点击该按键，关闭摄像头
        closeCameraWin();
    }else if(cameraType==false){//如果相机未打开，直接打开
        classChecked_div = button.parentNode;
        cameraShow();  // 打开相机
    }

}
/*关闭相机窗口*/
function closeCameraWin() {
    closeCamera();  // 关闭相机
    $('#cameraWin').css('display', 'none');//隐藏窗口
    cameraType = false;
    stopDetection();//停止检测

    classChecked_div.querySelector('.photoLibrary').classList.remove('photoLibrary_b');//移除边框
    classChecked_div.querySelector('.upload').classList.add('gray');//增加禁用
}


// 成功回调
function onSuccess(imageURI) {
    // 显示导入的图片
    /*var img = document.getElementById('importedImage');
    img.src = imageURI;
    img.style.display = 'block'; // 显示图像*/
    alert('选择图像成功: ');
}

// 失败回调
function onFail(message) {
    alert('选择图像失败: ' + message);
}

let videoStream = null;
var cameraType = false;
async function cameraShow() {
      endShow();//关闭模型测试
      cameraType1 = false;//摄像头类型
      if (cameraType) return;
     // 首先检查是否已经授予了摄像头权限
     try {
//         const permissionStatus = await navigator.permissions.query({ name: 'camera' });
//         if (permissionStatus.state === 'granted') {// 已授予权限，直接调用摄像头
//             await setupCamera();
//         } else if (permissionStatus.state === 'prompt') {// 未请求过权限，主动请求
//             await setupCamera();
//         } else if (permissionStatus.state === 'denied') {
//             alert("您已拒绝摄像头权限，请前往设置中启用相机权限。");
//         }
          p.checkCameraPermission()
     } catch (error) {
         console.log('无法检查权限状态：', error);
         // 直接尝试打开摄像头
         await setupCamera();
     }
}

// 设置相机并处理视频流
async function setupCamera() {
    try {
        const constraints = {
            video: {
                facingMode: cameraType1 ? 'environment' : 'user' // 根据 cameraType 设置前置或后置摄像头
            }
        };
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);//{ video: true }
        video.srcObject = videoStream;
        $('#cameraWin').css('display', 'block');//显示窗口
        cameraType = true;
        classChecked_div.querySelector('.photoLibrary').classList.add('photoLibrary_b');//增加边框
        classChecked_div.querySelector('.upload').classList.remove('gray');//移除禁用

        startDetection();//开启检测

    } catch (error) {
        console.error('摄像头错误', error);
        //alert("无法打开摄像头，请检查相机权限是否已启用。");
    }
}
//关闭摄像头
function closeCamera() {
    // 停止所有视频流
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        videoStream = null;//
    }
}

/*训练结束，恢复样式*/
function trainModel_end(){
    //显示两个模型按钮
    $('#exportModel').removeClass('exportGray');
    $('#playModel').removeClass('playGray');

    //恢复中间训练按钮
    trainingModel.text(window.parent.block_msg_trainingModel_again);//"再次训练"
    trainingModel.css('display', 'block');
    trainingModel_progress.css('display', 'none');
    progressText.text ('0%');
    barTrain.css('width', '0%');

}

// 实时监测样本数量变化
setInterval(() => {
    checkSampleSize();
}, 100);
//检测样本数量，改变训练按钮
function checkSampleSize() {
    if (sampleSize >= MINsampleSize) {
        trainingModel.removeClass('trainGray');
    } else {
        trainingModel.addClass('trainGray');
    }
}


/*----------------------------------------------------------声音----------------------------------------------------*/
let audioContext, analyser, microphone, dataArray;
let canvasWidth, canvasHeight, centerY, totalFrames;
let recordingComplete = false;
var drawInterval;
var isLiveInput = false; // 录制状态
var mediaStreamSource = null;
var audioStream = null;
var waveCanvas, wavectx;

var dh = 5;
const fftSize = 4096;
var baseNoteF;
var chartHeight = 0;

var scrollSpeed = 2; // 滚动速度
var scrollPos = 0; // 滚动的位置
var recordTimeout = null; // 录制计时器

//数据
// One frame is ~23ms of audio.
const NUM_FRAMES = 33;
let centExamples=[]

const spectrogramDiv = document.getElementById('spectrogram');
const Micro_record = document.getElementById('Micro_record');

//打开录音
function openMicro(button) {
   /*if(cameraType==true && classChecked_div==button.parentNode){//如果摄像头打开，再次点击该按键，关闭摄像头
          closeCameraWin();
      }else if(cameraType==false){//如果相机未打开，直接打开
          classChecked_div = button.parentNode;
          cameraShow();  // 打开相机
      }*/
   //startRecord();


   $('#Micro_record').text("记录20秒");
   spectrogramDiv.innerHTML = '<canvas id="spectrumCanvas"></canvas>';
   $('#cameraWin').css('display', 'block');//显示窗口
}
var recordType=false;
/*点击录制按钮*/
$('#Micro_record').click(function() {
    if(recordType) return;
    spectrogramDiv.innerHTML = '<canvas id="spectrumCanvas"></canvas>';
    startRecord();
});

/*录制准备*/
async function startRecord() {
    waveCanvas = document.getElementById("spectrumCanvas");
    wavectx = waveCanvas.getContext("2d");
    wavectx.strokeStyle = "black";
    wavectx.lineWidth = 1;
    wavectx.font = "12px monospace";

    chartHeight = 60;
    waveCanvas.height = chartHeight;
    waveCanvas.scrollIntoView(false);

    let baseFreq = 27.5 * Math.pow(2, 7);
    baseNoteF = notefFromPitch(baseFreq);

   startPitchDetect();

}

// 停止录制
function stopPitchDetect() {
    if (isLiveInput) {
        isLiveInput = false;
        window.cancelAnimationFrame(rafID);

        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
            audioStream = null;
        }

        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }

        if (recognizer.isListening()) {
            recognizer.stopListening();
        }

        drawSplitLine(); // 录制结束后，画分割线
    }
}

// 开始录制
function startPitchDetect() {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    centExamples=[];//清空数据
    let flagNum=0


    /*navigator.mediaDevices.getUserMedia({
        "audio": {
            deviceId: { exact: 'default' },
            noiseSuppression: { exact: true },
            echoCancellation: { exact: false },
            autoGainControl: { exact: false }
        },
    }).then((stream) => {
        // **清空画布**
        wavectx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
        scrollPos = 0; // 重新从头开始绘制
        scrollSpeed = 0; // **初始不滚动**
        setTimeout(() => { scrollSpeed = 2.5; }, 400); // **400ms 后开始滚动**

        audioStream = stream;
        mediaStreamSource = audioContext.createMediaStreamSource(stream);

        const gainNode = audioContext.createGain();
        gainNode.gain.value = 100;

        analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;

        mediaStreamSource.connect(gainNode);
        gainNode.connect(analyser);

        isLiveInput = true;
        updatePitch();

        // **2秒后自动停止**
        recordTimeout = setTimeout(stopPitchDetect, 2000);

    }).catch((err) => {
        console.error(`${err.name}: ${err.message}`);
        alert('Stream generation failed.');
    });*/
}

var rafID = null;
var buf_freq = null;

function generateRainbowColors() {
    const colors = [];
    for (let i = 0; i < 256; i++) {
        const minHue = 240, maxHue = 0;
        let curPercent = i / 255;
        let colString = "hsl(" + ((curPercent * (maxHue - minHue)) + minHue) + ",100%,50%)";
        colors.push(colString);
    }
    return colors;
}

const rainbowColors = generateRainbowColors();

function notefFromPitch(frequency) {
    var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return noteNum;
}

// 绘制声波瀑布
function drawWaterfall() {
    if (!analyser) return;
    const buf_size = analyser.frequencyBinCount;
    if (!buf_freq) {
        buf_freq = new Uint8Array(buf_size);
    }
    analyser.getByteFrequencyData(buf_freq);

    const max_freq = audioContext.sampleRate / 2;

    for (var i = 0; i < buf_size; i++) {
        const v = buf_freq[i];
        if (v > 0) {
            const f = i / buf_size * max_freq;
            let _p = notefFromPitch(f);
            let _y = Math.floor(chartHeight - (_p - baseNoteF) * dh);
            wavectx.fillStyle = rainbowColors[v];
            wavectx.fillRect(scrollPos, _y, 2, dh);
        }
    }

    // **更新滚动位置**
    scrollPos += scrollSpeed;
}

// **绘制分割线**
function drawSplitLine() {
    if (scrollPos === 0) return; // 没有绘制数据时不分割

    let halfWidth = scrollPos / 2; // **1秒钟的宽度**

    wavectx.strokeStyle = "#fff";
    wavectx.lineWidth = 2;

    // **在1秒钟的位置画一条竖线**
    wavectx.beginPath();
    wavectx.moveTo(halfWidth, 0);
    wavectx.lineTo(halfWidth, waveCanvas.height);
    wavectx.stroke();
}

function updatePitch() {
    if (!isLiveInput) return;
    drawWaterfall();
    rafID = window.requestAnimationFrame(updatePitch);
}









function splitIntoSegments() {
    const segmentWidth = canvasWidth / 20;

    for (let i = 0; i < 20; i++) {
        const segmentCanvas = document.createElement('canvas');
        const segmentCtx = segmentCanvas.getContext('2d');
        segmentCanvas.width = segmentWidth;
        segmentCanvas.height = canvasHeight;

        segmentCtx.drawImage(
            spectrumCanvas,
            i * segmentWidth, 0, segmentWidth, canvasHeight,
            0, 0, segmentWidth, canvasHeight
        );

        const segmentDiv = document.createElement('div');
        segmentDiv.classList.add('segment');
        segmentDiv.style.backgroundImage = `url(${segmentCanvas.toDataURL()})`;
        segmentDiv.style.backgroundSize = 'cover';

        spectrogramDiv.appendChild(segmentDiv);
    }
    spectrogramDiv.removeChild(spectrogramDiv.children[0]);//去除老画布
    $('#Micro_record').text("记录20秒")
    $('#Micro_record').css("background","#38ceb1");
    recordType = false;//录制状态--结束
}

/*点击提取按钮*/
$('#Micro_withdraw').click(function() {
    //startRecord();
});
/*录音关闭按钮*/
$('#MicroWinButton_close').click(function() {
    // 停止录制和绘制
    clearInterval(drawInterval);
    if (audioContext) {
        audioContext.close(); // 关闭音频上下文
    }
    /*if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop()); // 停止所有音轨
    }*/

    // 重置录制按钮和状态
    $('#Micro_record').css("background","#38ceb1");
    recordType = false;

    // 隐藏窗口
    $('#cameraWin').css('display', 'none');
});
