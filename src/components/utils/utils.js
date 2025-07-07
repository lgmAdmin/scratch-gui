let isMaster=false;
let distance=[]
let isBricks=false;
let isRobot=false;
let isLoad=false

let deleteCater=[]

let robotIp=''

let currentExtension=''

let loadExtensions=[]

let allLoaded=[]

let deletedCategoriesID = ['robotwifi', 'robotcat'];

let hiddenBlocksTypes = ['robotsensors_asrStart','robotsensors_asrStop','robotsensors_asrResult','robotevent_when','robotimg_isCat','robotimg_catNum','robotimg_catPlace','robotimg_isOpenModel','brickstwomotor_speedmoveplace'];

let showCode=false

let isDown=false

function setIsMaster(a){
    isMaster=a
}
function getIsMaster(){
    return isMaster
}

function setDistance(a){
    distance=a
}
function getDistance(){
    return distance
}

function setIsBricks(a){
    isBricks=a
}
function getIsBricks(){
    return isBricks
}

function setIsRobot(a){
    isRobot=a
}
function getIsRobot(){
    return isRobot
}


function setIsLoad(a){
    isLoad=a
}

function getIsLoad(){
    return isLoad
}

function setRobotIp(a){
    robotIp=a
}

function getRobotIp(){
    return robotIp
}

function setDelete(a){
    deleteCater=[]
    for(let i=0;i<a.length;i++){
        console.log(a[i])
        deleteCater.push(a[i])
    }
}

function getDelete(){
    return deleteCater
}

function setCurrent(a){
    currentExtension=a
}

function getCurrent(){
    return currentExtension
}

function addLoadExtension(a){
    loadExtensions.push(a)

    loadExtensions = [...new Set(loadExtensions)];
}
function delLoadExtension(a){
    const index = loadExtensions.indexOf(a); // 查找元素的索引

    if (index > -1) {
        loadExtensions.splice(index, 1); // 从索引处删除一个元素
    }
}

function getLoadExtension(){
    return loadExtensions
}

function setAllLoaded(a){
    allLoaded.push(a)

    allLoaded = [...new Set(allLoaded)];
}

function getAllLoaded(){
    return allLoaded
}

function getDeletedCate(){
    return deletedCategoriesID
}

function setDeletedCate(a){
    deletedCategoriesID.push(a)
}

function delCategro(index,len){
    deletedCategoriesID.splice(index,len)
}


function getHiddenBlocks(){
    return hiddenBlocksTypes
}

function setHiddenBlocks(a){
    hiddenBlocksTypes.push(a)
}

function delHiddenBlocks(index,len){
    hiddenBlocksTypes.splice(index,len)
}

function getShowCodeDb(){
    return showCode
}

function setShowCodeDb(a){
    showCode=a
}

function setLongIsDown(a){
    isDown=a
}

function getLongIsDown(){
    return isDown
}
export {
    setIsMaster,
    getIsMaster,
    setDistance,
    getDistance,
    setIsBricks,
    getIsBricks,
    setIsRobot,
    getIsRobot,
    setIsLoad,
    getIsLoad,
    setRobotIp,
    getRobotIp,
    setDelete,
    getDelete,
    setCurrent,
    getCurrent,
    addLoadExtension,
    delLoadExtension,
    getLoadExtension,
    setAllLoaded,
    getAllLoaded,
    getDeletedCate,
    setDeletedCate,
    delCategro,
    getHiddenBlocks,
    setHiddenBlocks,
    delHiddenBlocks,
    getShowCodeDb,
    setShowCodeDb,
    setLongIsDown,
    getLongIsDown
}