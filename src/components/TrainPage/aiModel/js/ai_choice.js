var openFileName = GetQueryString("name")+'';
var p = window.parent;
var currentPage = "ai_choice";

// 页面加载时默认显示模型选择界面
$('#modelSelection').css('display', 'flex');
//alert(openFileName)


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


/*返回*/
$('#back').click(function() {
    if(currentPage != 'ai_choice'){
        showmodelSelection();
        return;
    }
    p.page= 'index';
    var FileName = openFileName+".bricksm";
    var spname = FileName.split('-');
    if(spname.length>8){
        var modelname = spname[7]+'-'+spname[8].slice(0, -8);
        location.replace("../play_M1.html?type=o&name="+FileName+"&MdType="+modelname[modelname.length-2]+"&modelName="+modelname)
    }else{
        location.replace("../play_M1.html?type=o&name="+FileName);
    }
    //location.replace("../play_M1.html?type=o&name="+openFileName+".bricksm");
});

// 显示项目管理界面
function showProjectManagement(type) {
    currentPage = type;
    if(currentPage=='posture'){//姿态
        p.refreshDirMP('.icPMP');
    }else if(currentPage=='gesture'){//手势
        p.refreshDirMP('.icGMP');
    }else if(currentPage=='image'){//图像
        p.refreshDirMP('.icIMP');
    }else if(currentPage=='sound'){//声音
           // alert("敬请期待")
           // return
        p.refreshDirMP('.icSMP');
    }else{
        alert("敬请期待")
        return
    }
    setTimeout(() => {//增加一段延时，项目加载一会
        $('#modelSelection').css('display', 'none');
        $('#projectManagement').css('display', 'flex');
        $('#topBar_tilt').text(window.parent.block_msg_project_title);//'项 目 管 理'
    }, 200);

}

// 显示模型选择界面
function showmodelSelection() {
    currentPage = "ai_choice";
    $('#modelSelection').css('display', 'flex');
    $('#projectManagement').css('display', 'none');
    $('#topBar_tilt').text(window.parent.block_msg_trainingM_title);//'训 练 模 型'
}

/*新建项目*/
$('#newProject').click(function() {
    goLearn(-1);
});

/*上传项目*/
$('#uploadingProject').click(function() {
    alert("敬请期待")
});



/*跳转学习界面*/
function goLearn(num){
    if(currentPage=='posture'){//姿态
        p.page="learn_posture";
        location.replace("learn.html?name="+openFileName+"&opennum="+num+"&MType=P");
    }else if(currentPage=='gesture'){//手势
        p.page="learn_gesture";
        location.replace("learn_g.html?name="+openFileName+"&opennum="+num+"&MType=G");
    }else if(currentPage=='image'){//图像
        p.page="learn_image";
        location.replace("learn_i.html?name="+openFileName+"&opennum="+num+"&MType=I");
    }else if(currentPage=='sound'){//声音
        p.page="learn_sound";
        location.replace("learn_s.html?name="+openFileName+"&opennum="+num+"&MType=S");
    }
}


// 获取卡片容器
const cardContainer = document.getElementById('projectContainer');
/*创建项目卡片*/
function addCardToUI(projectName, projectDescription,num) {
    // 创建卡片的外部div
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    // 创建图像元素
    const img = document.createElement('img');
    img.src = "../../img/AI/pg_"+currentPage+".svg"; // 设置图像路径
    //img.alt = "项目图标";

    // 创建标题div（项目名称）
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('card_title');
    titleDiv.textContent = projectName; // 设置项目名称

    // 创建描述div（项目说明）
    const descDiv = document.createElement('div');
    descDiv.classList.add('card_description');
    descDiv.textContent = window.parent.block_msg_instructions + projectDescription; // "说明："

    // 创建底部div
    const bottomDiv = document.createElement('div');
    bottomDiv.classList.add('card_bottom');

    // 创建编辑按钮
    const editButton = document.createElement('button');
    editButton.classList.add('edit_button');
    editButton.textContent = window.parent.block_msg_editor;//"编 辑"
    // 添加点击事件监听器
    editButton.addEventListener('click', function() {
        goLearn(num)
    });

    // 将按钮添加到底部div
    bottomDiv.appendChild(editButton);

    // 创建删除按钮
    const delDiv = document.createElement('div');
    delDiv.classList.add('card_del');
    delDiv.textContent = "×";
    // 添加点击事件监听器
    delDiv.addEventListener('click', function() {
        p.delProject(num);
        cardContainer.removeChild(this.parentElement);
    });

    // 将所有元素添加到卡片div中
    cardDiv.appendChild(img);
    cardDiv.appendChild(titleDiv);
    cardDiv.appendChild(descDiv);
    cardDiv.appendChild(bottomDiv);
    cardDiv.appendChild(delDiv);

    // 将卡片添加到容器中
    cardContainer.appendChild(cardDiv);
}


