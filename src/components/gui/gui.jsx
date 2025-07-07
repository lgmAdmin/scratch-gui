import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React , {useEffect, useState,useRef }from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import MediaQuery from 'react-responsive';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'scratch-vm';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import StageWrapper from '../../containers/stage-wrapper.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';
import CostumeLibrary from '../../containers/costume-library.jsx';
import BackdropLibrary from '../../containers/backdrop-library.jsx';
import Watermark from '../../containers/watermark.jsx';

import Backpack from '../../containers/backpack.jsx';
import BrowserModal from '../browser-modal/browser-modal.jsx';
import TipsLibrary from '../../containers/tips-library.jsx';
import Cards from '../../containers/cards.jsx';
import Alerts from '../../containers/alerts.jsx';
import DragLayer from '../../containers/drag-layer.jsx';
import ConnectionModal from '../../containers/connection-modal.jsx';
import TelemetryModal from '../telemetry-modal/telemetry-modal.jsx';
import TWUsernameModal from '../../containers/tw-username-modal.jsx';
import TWSettingsModal from '../../containers/tw-settings-modal.jsx';
import TWSecurityManager from '../../containers/tw-security-manager.jsx';
import TWCustomExtensionModal from '../../containers/tw-custom-extension-modal.jsx';
import TWRestorePointManager from '../../containers/tw-restore-point-manager.jsx';
import TWFontsModal from '../../containers/tw-fonts-modal.jsx';
import TWUnknownPlatformModal from '../../containers/tw-unknown-platform-modal.jsx';
import TWInvalidProjectModal from '../../containers/tw-invalid-project-modal.jsx';
import TextComponent from '../textcomponent/text-component.jsx';
import CodeMirrorComponent from 'scratch-gui/src/components/CodeMirrorComponent/CodeMirrorComponent.jsx';
import FloatingBall from '../float-ball/FloatingBall .jsx'

import {STAGE_SIZE_MODES, FIXED_WIDTH, UNCONSTRAINED_NON_STAGE_WIDTH} from '../../lib/layout-constants';
import {resolveStageSize} from '../../lib/screen-utils';
import {Theme} from '../../lib/themes';

import {isRendererSupported, isBrowserSupported} from '../../lib/tw-environment-support-prober';

import styles from './gui.css';
import mainCon from './conn_main_con.svg'
import connMotor from './conn_motor.svg'
import connSound from './conn_sound.svg'
import connTilt from './conn_tilt.svg'
import consoleDistance from './console_distance.svg'
import consoleEncoder from './console_encoder.svg'
import consoleGesture from './console_gesture.svg'
import consoleMotor from './console_motor.svg'
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from '!../../lib/tw-recolor/build!./icon--code.svg';
import costumesIcon from '!../../lib/tw-recolor/build!./icon--costumes.svg';
import soundsIcon from '!../../lib/tw-recolor/build!./icon--sounds.svg';
import { setIsMaster ,setIsBricks,getIsBricks,setRobotIp,setCurrent, getCurrent} from 'scratch-gui/src/components/utils/utils.js';
import codeModule from '../../../../../utils/global.js'
// import { getExtension,setExtension } from '../../../../../utils/extensionWho.js';
import Button from '../ble-button/bleButton.jsx';
import { getIsCode, setIsCode } from '../../../../../utils/whatModule.js';
import { setAdd } from '../../../../../utils/isAddMaster.js';
import {setLan,getLan} from '../../../../../utils/lanMode.js'
import { setIsRobot,getShowCodeDb,setShowCodeDb ,addLoadExtension,delLoadExtension,getLoadExtension,getAllLoaded,setAllLoaded} from 'scratch-gui/src/components/utils/utils.js';

import LoadingOverlay from '../LoadingOverlay/LoadingOverlay.jsx';  // 引入 LoadingOverlay 组件
import BurnLogs from 'scratch-gui/src/components/Burn-logs/BurnLogs.jsx';
import TrainPage from '../TrainPage/TrainPage.jsx'

import SerialMonitor from 'scratch-gui/src/components/SerialData/SerialData.jsx';
import TabSwitcher from 'scratch-gui/src/components/TabSwitcher/TabSwitcher.jsx';


import formatMessage from 'format-message'


// let pythonCode = `
// def hello_world():
//     print("Hello, World!")

// hello_world()
//     `;
let attemptCount=0
const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

const getFullscreenBackgroundColor = () => {
    const params = new URLSearchParams(location.search);
    if (params.has('fullscreen-background')) {
        return params.get('fullscreen-background');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return '#111';
    }
    return 'white';
};
let extensionSelect=[false,false,false]

let isRecive=false

let isUpLoadMode=false
let IP

let reciveTimer=''
let hasReceivedResponse = false; // 记录是否收到回应
let isPostIp=false

let socketSuccess=false
let socketTimer
let whatConnect=[0,0,0]
const fullscreenBackgroundColor = getFullscreenBackgroundColor();

let bleDownloadTimer

const GUIComponent = props => {
    const {
        accountNavOpen,
        activeTabIndex,
        alertsVisible,
        authorId,
        authorThumbnailUrl,
        authorUsername,
        basePath,
        backdropLibraryVisible,
        backpackHost,
        backpackVisible,
        blocksId,
        blocksTabVisible,
        cardsVisible,
        canChangeLanguage,
        canChangeTheme,
        canCreateNew,
        canEditTitle,
        canManageFiles,
        canRemix,
        canSave,
        canCreateCopy,
        canShare,
        canUseCloud,
        children,
        connectionModalVisible,
        costumeLibraryVisible,
        costumesTabVisible,
        customStageSize,
        enableCommunity,
        intl,
        isCreating,
        isEmbedded,
        isFullScreen,
        isPlayerOnly,
        isRtl,
        isShared,
        isWindowFullScreen,
        isTelemetryEnabled,
        isTotallyNormal,
        loading,
        logo,
        renderLogin,
        onClickAbout,
        onClickAccountNav,
        onCloseAccountNav,
        onClickAddonSettings,
        onClickMaster,
        onClickConnect,
        onClickFirmware,
        onClickDesktopSettings,
        clickSerialConnect,
        download,
        SerialDownload,
        saveCode,
        loadCode,
        cancelload,
        clickBleConnect,
        clickDownloadCode,
        clickEspSend,
        clickSendWifi,
        onClickNewWindow,
        onClickPackager,
        onLogOut,
        onOpenRegistration,
        onToggleLoginOpen,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        onClickLogo,
        onExtensionButtonClick,
        onOpenCustomExtensionModal,
        onProjectTelemetryEvent,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        onRequestCloseTelemetryModal,
        onSeeCommunity,
        onShare,
        onShowPrivacyPolicy,
        onStartSelectingFileUpload,
        onTelemetryModalCancel,
        onTelemetryModalOptIn,
        onTelemetryModalOptOut,
        securityManager,
        showComingSoon,
        showOpenFilePicker,
        showSaveFilePicker,
        soundsTabVisible,
        stageSizeMode,
        targetIsStage,
        telemetryModalVisible,
        theme,
        tipsLibraryVisible,
        usernameModalVisible,
        settingsModalVisible,
        customExtensionModalVisible,
        fontsModalVisible,
        unknownPlatformModalVisible,
        invalidProjectModalVisible,
        vm,
        ...componentProps
    } = omit(props, 'dispatch');
    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }
    // handleSelect(12)
    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };

    const unconstrainedWidth = (
        UNCONSTRAINED_NON_STAGE_WIDTH +
        FIXED_WIDTH +
        Math.max(0, customStageSize.width - FIXED_WIDTH)
    );
    
    // setInterval(async ()=>{
    //     await fetch('http://localhost:3000/get-extension')
    //     .then(response => {
    //         if (response.ok) {
    //         return response.text();
    //         } else {
    //         throw new Error('请求失败，状态码：' + response.status);
    //         }
    //     })
    //     .then(extension => {
    //         console.log('返回的变量值：', extension);
    //         if(extension==1 && !extensionSelect[extension-1]){
    //             extensionSelect[extension-1]=true
    //             setIsMaster(true)
    //             onExtensionButtonClick()
    //         }
    //     })
    //     .catch(error => {
    //         console.error('发生错误：', error);
    //     });
    // },2000)
    const [pythonCode, setPythonCode] = useState('print("Hello, World!")');
    const [childData, setChildData] = useState(1);

    // 这个函数传给子组件，子组件调用它来传数据回来
    const handleChildData = async(data) => {
        setChildData(data+1);
        console.log('子组件传来的数据:', data);
        // let downloadCode = pythonCode;
        // if (!downloadCode.includes('while')) {
        //     downloadCode += '\nwhile True:\n    pass\n';
        // }
        // downloadCode=modifyPythonCode(downloadCode)
        // console.log(downloadCode)
        // await new Promise(resolve => setTimeout(resolve, 100));  
        downloadCodeTotal(data+1)
    };
    // const handleCodeChange = (newCode) => {
    //     setPythonCode(newCode);
    // };

    // setInterval(()=>{
    //    setPythonCode(codeModule.getCode())
    //    console.log(codeModule.getCode())
    //    console.log(pythonCode)
    // },3000)

    const [isTrain, setIsTrain] = useState(false);

    const channelMode=new BroadcastChannel('mode')
    useEffect(() => {
        console.log('发送了一次当前模式')
        channelMode.postMessage(!getShowCodeDb())
    }, []); // 空依赖数组确保定时器只设置一次
    
    const channel1 = new BroadcastChannel('extensionSecondly');
    const channel2 = new BroadcastChannel('startRobotSocket');
    const channelBleIsDown = new BroadcastChannel('ble-download')

    const channelLoadExtension = new BroadcastChannel('loadExtension')
    channel2.addEventListener('message',(event)=>{
        if(event.data=='response'){
            hasReceivedResponse=true
        }
    })

    
    
    const channelHostPot=new BroadcastChannel('hostpot')
    const channelSendIp=new BroadcastChannel('sendIp')

    const channelTrain=new BroadcastChannel('channelTrain')
    channelTrain.addEventListener('message',(event)=>{
        setIsTrain(event.data)
    })



    // const [robotSoc, setRobotSoc] = useState(null); // Store the WebSocket instance
    // useEffect(() => {
    //     const Socket = new WebSocket('ws://192.168.4.1:8083');
    //     setRobotSoc(Socket)
    
    //     Socket.addEventListener('open', (event) => {
    //       console.log('连接成功');
    //     });
    
    //     // Handle incoming WebSocket messages
    //     Socket.addEventListener('message', (event) => {
    //         if(JSON.parse(event.data)=='success'){
    //             isRecive=true
    //         }
    //     })
    //     // Cleanup WebSocket connection when component unmounts
    //     return () => {
    //         console.log('Cleaning up WebSocket connection');
    //         Socket.close();
    //         };
    //     }, []); // Empty dependency array to run only once

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         // console.log('fetch')
    //         fetch(`http://localhost:3000/get-extension?timestamp=${new Date().getTime()}`,{
    //                 method: 'GET'
    //         })
    //         .then(response => {
    //             if (response.ok) {
    //             return response.text();
    //             } else {
    //             throw new Error('请求失败，状态码：' + response.status);
    //             }
    //         })
    //         .then(async extension => {
    //             // console.log('返回的变量值：', extension);
    //             if(extension==1){
    //                 // extensionSelect[extension-1]=true
    //                 if( extensionSelect[extension-1]){
    //                     setIsBricks(true)
    //                     channel1.postMessage(extension)
    //                     await new Promise(resolve => setTimeout(resolve, 100));
    //                     await fetch('http://localhost:3000/set-extension', {
    //                         method: 'POST',
    //                         headers: {
    //                             'Content-Type': 'text/plain'
    //                         },
    //                         body: 0
    //                         })
    //                         .then(response => response.text())
    //                         .then(data => {
    //                         // console.log('服务器响应:', data);
    //                         })
    //                         .catch(error => {
    //                         console.error('错误:', error);
    //                         });
    //                 }else{
    //                     setIsLoading(true)
    //                     setIsMaster(true)
    //                     setIsBricks(true)
    //                     setAdd(true)
    //                     onExtensionButtonClick()
    //                     extensionSelect[extension-1]=true
    //                 }
                    
    //                 // setExtension(false)
    //             }else if(extension==2){
    //                 // let timeOut = setInterval(() => {
    //                 //     try{
    //                 //         const Socket = new WebSocket('ws://192.168.4.1:8084');
                
    //                 //         Socket.addEventListener('open', (event) => {
    //                 //             channel2.postMessage(true)
    //                 //             console.log('连接成功');
    //                 //             let timer=setInterval(()=>{
    //                 //                 Socket.send('scratch')
    //                 //                 console.log(typeof 'scratch')
    //                 //                 if(isRecive){
    //                 //                     isRecive=false
    //                 //                     Socket.close()
    //                 //                     clearInterval(timer)
    //                 //                     clearInterval(timeOut)
    //                 //                 }
                                   
    //                 //             },1000)
    //                 //         });
    //                 //         Socket.addEventListener('message', (event) => {
    //                 //             if(event.data=='success'){
    //                 //                 isRecive=true
    //                 //             }
    //                 //         })
    //                 //     }catch(e){

    //                 //     }
                   
    //                 // }, 1000);
                    
                    
    //                 if( extensionSelect[extension-1]){
    //                     setIsBricks(false)
    //                     channel1.postMessage(extension)
    //                     await new Promise(resolve => setTimeout(resolve, 100));
    //                     await fetch('http://localhost:3000/set-extension', {
    //                         method: 'POST',
    //                         headers: {
    //                             'Content-Type': 'text/plain'
    //                         },
    //                         body: 0
    //                         })
    //                         .then(response => response.text())
    //                         .then(data => {
    //                         // console.log('服务器响应:', data);
    //                         })
    //                         .catch(error => {
    //                         console.error('错误:', error);
    //                         });
    //                 }else{
    //                     setIsLoading(true)
    //                     setIsBricks(false)
    //                     setIsMaster(true)
    //                     setIsRobot(true)
    //                     setAdd(true)
    //                     onExtensionButtonClick()
    //                     extensionSelect[extension-1]=true
    //                 }
                   
    //             }
    //         })
    //         .catch(error => {
    //             console.error('发生错误：', error);
    //         });
    
           
               
    //     }, 2000);
      
    //     // 清除定时器
    //     return () => {
    //         console.log('清除定时器')
    //         clearInterval(interval);
    //     }
    //   }, []); // 空依赖数组确保定时器只设置一次

    useEffect(() => {
        const intervalId = setInterval(() => {
          setPythonCode(prevCode => codeModule.getCode());
        }, 1000);
      
        // 清除定时器
        return () => clearInterval(intervalId);
      }, []); // 空依赖数组确保定时器只设置一次
      
    //   useEffect(() => {
    //     console.log('Updated Python Code:', pythonCode);
    //   }, [pythonCode]); // 当pythonCode变化时，这个effect会运行

    const [isBricks, setbricks] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
          setbricks(prevCode => getIsBricks());
        }, 1000);
      
        // 清除定时器
        return () => clearInterval(intervalId);
      }, []); // 空依赖数组确保定时器只设置一次
    
    const [showCode, setShowCode] = useState(getShowCodeDb());

    const [lanMode,setLanMode] = useState(getLan())

    const [isDown, setIsDown] = useState(true);

    const [currentExtension, setCurrentExtension] = useState('2');



    const [isLoading, setIsLoading] = useState(false);

    const [isFlashing, setIsFlashing] = useState(false);

    const [logs, setLogs] = useState([]);

    const [extensionName, setExtensionName] = useState(getCurrent().length>0 ? getCurrent() :'选择设备');
    
    useEffect(() => {
        const channelLoad = new BroadcastChannel('isLoading');
        channelLoad.addEventListener('message',(event)=>{
            if(!event.data){
                setIsLoading(event.data)
            }else{
                setIsLoading(event.data)
            }
        })
    }, []);


    const mainBall = {
        image: mainCon,
        text: '',
      };
    const [childBalls, setChildBalls] = useState([
    { image: '', text: '1',data:'',isShow:false},
    { image: '', text: '2' ,data:'',isShow:false},
    { image: '', text: '3' ,data:'',isShow:false},
    { image: '', text: '4' ,data:'',isShow:false},
    { image: '', text: '5' ,data:'',isShow:false},
    { image: '', text: '6' ,data:'',isShow:false},
    { image: '', text: '7' ,data:'',isShow:false},
    { image: '', text: '8' ,data:'',isShow:false},
    ]);
    //   const childBalls = [
    //     { image: '', text: '1',data:'',isShow:false},
    //     { image: '', text: '2' ,data:'',isShow:false},
    //     { image: '', text: '3' ,data:'',isShow:false},
    //     { image: '', text: '4' ,data:'',isShow:false},
    //     { image: '', text: '5' ,data:'',isShow:false},
    //     { image: '', text: '6' ,data:'',isShow:false},
    //     { image: '', text: '7' ,data:'',isShow:false},
    //     { image: '', text: '8' ,data:'',isShow:false},
    //   ];

    // const socket = new WebSocket('ws://localhost:8080');
    const updateChildBallText = (index, image,data,isShow) => {
        setChildBalls((prev) =>
          prev.map((child, i) =>
            i === index ? { ...child, image: image, data:data, isShow:isShow } : child
          )
          
        );
    };
    const [socket, setSocket] = useState(null); // Store the WebSocket instance
    const [soc, setSoc] = useState(null); // Store the WebSocket instance


    const [upload,setUpload] = useState(null)
    const portArr=[7,0,6,1,5,2,4,3]
    let preDistance = '';

    const stopAll=new BroadcastChannel('stopAll')
    const channel = new BroadcastChannel('distance_channel');

    let state=[[],[],[],[],[],[],[]]

    // Create WebSocket connection only once when the component mounts
  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8082');
    setSocket(newSocket);

    newSocket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened');
    });

    // Handle incoming WebSocket messages
    newSocket.addEventListener('message', (event) => {
        // console.log(event.data)
        // console.log(JSON.parse(event.data))
        let sensorState=JSON.parse(event.data)
    //   let distance = event.data.split(',');
    //   distance = distance.map(Number);

      channel.postMessage(sensorState);  // 广播数据给其他页面


    //   sensorState.forEach((distance,index) => {
    //     // console.log(element)

    //     if(index==0 && distance.length>2 && JSON.stringify(distance) != JSON.stringify(state[index])){
    //         updateChildBallText(portArr.indexOf(distance[0]), consoleDistance, distance[2], true);
    //         state[index]=distance
    //     }else if(index==1 && distance.length>2 && JSON.stringify(distance) != JSON.stringify(state[index])){
    //         if(distance[4]==0){
    //             updateChildBallText(portArr.indexOf(distance[0]), connTilt, `${distance[2]} ${distance[3]}`, true);
    //         }else if(distance[4]==64 && distance[3]!=0){
    //             updateChildBallText(portArr.indexOf(distance[0]), connTilt, `${distance[2]} -${distance[3]}`, true);
    //         }else if(distance[4]==192 && distance[2]!=0 && distance[3]!=0){
    //             updateChildBallText(portArr.indexOf(distance[0]), connTilt, `-${distance[2]} -${distance[3]}`, true);
    //         }else if(distance[4]==192 && distance[2]!=0 && distance[3]==0){
    //             updateChildBallText(portArr.indexOf(distance[0]), connTilt, `-${distance[2]} ${distance[3]}`, true);
    //         }else if(distance[4]==128 && distance[2]!=0){
    //             updateChildBallText(portArr.indexOf(distance[0]), connTilt, `-${distance[2]} ${distance[3]}`, true);
    //         }else if(distance[2]==0 && distance[3]==0){
    //             updateChildBallText(portArr.indexOf(distance[0]), connTilt, `${distance[2]} ${distance[3]}`, true);
    //         }
            
    //         state[index]=distance
    //     }else if(index==2 && distance.length>2 && JSON.stringify(distance) != JSON.stringify(state[index])){
    //         state[index]=distance
    //     }else if(index==3 && distance.length>2 && JSON.stringify(distance) != JSON.stringify(state[index])){
    //         updateChildBallText(portArr.indexOf(distance[0]), connSound, distance[2], true);
    //         state[index]=distance
    //     }else if(index==4 && distance.length>2 && JSON.stringify(distance) != JSON.stringify(state[index])){
    //         updateChildBallText(portArr.indexOf(distance[0]), consoleGesture, distance[2], true);
    //         state[index]=distance
    //     }else if(index==5 && distance.length>2 && JSON.stringify(distance) != JSON.stringify(state[index])){
    //         updateChildBallText(portArr.indexOf(distance[0]), consoleEncoder, distance[3], true);
    //         state[index]=distance
    //     }else if(index==6 && distance.length>2 && JSON.stringify(distance) != JSON.stringify(state[index])){
    //         if(distance[3]==0){
    //             updateChildBallText(portArr.indexOf(distance[0]), consoleMotor, distance[2], true);
    //         }else if(distance[3]==1){
    //             updateChildBallText(portArr.indexOf(distance[0]), consoleMotor, `-${distance[2]}`, true);
    //         }
            
    //         state[index]=distance
    //     }else if(distance.length==0 && state[index].length != 0){
    //         updateChildBallText(portArr.indexOf(state[index][0]), '', '', false);
    //         state[index]=distance
    //     }
    //   });



      // Compare with previous distance to avoid unnecessary updates
    //   if (JSON.stringify(distance) !== JSON.stringify(preDistance)) {
    //     console.log(distance);
    //     if (distance.length > 2) {
    //       switch (distance[1]) {
    //         case 41: // 距离
    //           updateChildBallText(portArr.indexOf(distance[0]), consoleDistance, distance[2], true);
    //           break;
    //         case 57: // 手势
    //           updateChildBallText(portArr.indexOf(distance[0]), consoleGesture, distance[2], true);
    //           break;
    //         case 104: // 倾斜
    //           updateChildBallText(portArr.indexOf(distance[0]), connTilt, `${distance[2]} ${distance[3]}`, true);
    //           break;
    //         case 54: // 编码器
    //           updateChildBallText(portArr.indexOf(distance[0]), consoleEncoder, distance[3], true);
    //           break;
    //         case 72: // 声音
    //           updateChildBallText(portArr.indexOf(distance[0]), connSound, distance[2], true);
    //           break;
    //         case 0: // 断开
    //           updateChildBallText(portArr.indexOf(distance[0]), '', '', false);
    //           break;
    //         default:
    //           break;
    //       }
    //     }
    //     preDistance = distance; // Update the previous distance to current one
    //   }
    });
    // Cleanup WebSocket connection when component unmounts
    return () => {
        console.log('Cleaning up WebSocket connection');
        newSocket.close();
        };
    }, []); // Empty dependency array to run only once


    // useEffect(() => {
    //     const socket=new WebSocket('ws://192.168.4.1:8080')
    //     setUpload(socket)
    // }, []);

    const channelMasterClose = new BroadcastChannel('master_close');
    const [data, setData] = useState(''); // 串口数据状态
    // window.addEventListener('offline',()=>{
    //     soc.send(JSON.stringify({
    //         type:'offline',
    //         data:{message:'true'}
    //     }))
    //     whatConnect[1]=0
    //     channelHostPot.postMessage(false)
    //     console.log('1111111111111111111111111111111111111111111')
    // })

    useEffect(() => {
        const handleOffline = () => {
            if (soc?.readyState === WebSocket.OPEN) {
                soc.send(JSON.stringify({
                    type: 'offline',
                    data: { message: 'true' }
                }));
            }
            whatConnect[1] = 0;
            channelHostPot.postMessage(false);
            console.log('Offline event handled');
        };

        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('offline', handleOffline); // ✅ 清除绑定，防止重复
        };
    }, []); // 👈 空依赖数组，确保只绑定一次
    // useEffect(() => {
    //     console.log(window)
    //     let Socket = new WebSocket('ws://localhost:8081');
    //     setSoc(Socket)
    
    //     // Socket.addEventListener('open', (event) => {
    //     //   console.log('WebSocket connection opened');
    //     // });

    //     const channelPort=new BroadcastChannel('channelPort')
    //     channelPort.addEventListener('message',(event)=>{
    //         Socket.send(JSON.stringify({
    //             type:'port',
    //             data:{message:event.data}
    //         }))
    //     })

    //     let socketMode;
    //     const channelSerialData=new BroadcastChannel('serial-data')

    //     let loadTimer;
    
    //     // Socket.addEventListener('close', () => {
    //     //     console.warn('8081 WebSocket closed unexpectedly!');
    //     // });


    //     function logWithTime(msg) {
    //         console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
    //     }
        
    //     Socket.addEventListener('open', (event) => {
    //         logWithTime('WebSocket connection opened');
    //         console.log('readyState:', Socket.readyState); // 打开后通常是 1
    //     });
        
    //     Socket.addEventListener('close', (event) => {
    //         logWithTime(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
    //         console.warn('readyState:', Socket.readyState); // 关闭后通常是 3
    //         // Socket=new WebSocket('ws://localhost:8081');
    //     });
        
    //     Socket.addEventListener('error', (event) => {
    //         logWithTime('WebSocket error occurred!');
    //         console.error(event);
    //         console.warn('readyState:', Socket.readyState);
    //     });
        

    //     // Handle incoming WebSocket messages
    //     Socket.addEventListener('message', async (event) => {
    //         try{
    //             // console.log(JSON.parse(event.data))
    //             console.log(JSON.parse(event.data).data.message)
    //             if(JSON.parse(event.data).type=='bricks'){
    //                 setIsDown(!JSON.parse(event.data).data.message)
    //             }else if(JSON.parse(event.data).type=='wifiDown'){
    //                 if(JSON.parse(event.data).data.message=='success'){
    //                     alert('下载成功')
    //                 }else{
    //                     alert('下载失败')
    //                 }
    //             }else if(JSON.parse(event.data).type=='ble'){
    //                 if(JSON.parse(event.data).data.message){
    //                     whatConnect[0]=0
    //                     portArr.forEach(port=>{
    //                         updateChildBallText(port, '', '', false);
    //                     })
    //                     setIsDown(true)
    //                 }
                    
    //             }else if(JSON.parse(event.data).type=='wifi'){
    
    //                 if(JSON.parse(event.data).data.message){
    //                     console.log(isUpLoadMode)
    //                     attemptCount=0
    //                     if(!isUpLoadMode){
    //                         console.log('应该发送scratch')
    //                         let timeOut = setInterval(() => {
    //                             try{
    //                                 if (attemptCount >= 2) { // 超过 3 次就停止
    //                                     clearInterval(timeOut);
    //                                     console.log("尝试连接 2 次，停止重试");
    //                                     if(!isRecive){
    //                                         alert('socket连接失败')
    //                                     }else{
    //                                         alert('socket连接成功')
    //                                     }
    //                                     return;
    //                                 }
                            
    //                                 attemptCount++; // 递增计数器
    //                                 console.log(`尝试连接第 ${attemptCount} 次`);
    //                                 const Socket = new WebSocket('ws://192.168.4.1:8084');
                        
    //                                 Socket.addEventListener('open', (event) => {
                                        
    //                                     console.log('连接成功');
    //                                     let timer=setInterval(async ()=>{
    //                                         Socket.send('scratch')
    //                                         await new Promise(resolve => setTimeout(resolve, 100));
    //                                         Socket.send('stop')
                                            
    //                                         if(isRecive){
    //                                             isRecive=false
    //                                             Socket.close()
                                                
    //                                             clearInterval(timer)
    //                                             clearInterval(timeOut)
    //                                             channel2.postMessage(true)
    //                                         }
                                            
    //                                     },1000)
    //                                 });
    //                                 Socket.addEventListener('message', (event) => {
    //                                     if(event.data=='success'){
    //                                         isRecive=true
    //                                     }
    //                                 })
    //                             }catch(e){
        
    //                             }
                            
    //                         }, 1000);
                            
    //                     }else{
    //                         console.log('应该发送file')
    //                         let timeOut = setInterval(() => {
    //                             try{
    //                                 if (attemptCount >= 2) { // 超过 3 次就停止
    //                                     clearInterval(timeOut);
    //                                     console.log("尝试连接 2 次，停止重试");
    //                                     if(!isRecive){
    //                                         alert('socket连接失败')
    //                                     }else{
    //                                         alert('socket连接成功')
    //                                     }
    //                                     return;
    //                                 }
                            
    //                                 attemptCount++; // 递增计数器
    //                                 console.log(`尝试连接第 ${attemptCount} 次`);
    //                                 const Socket = new WebSocket('ws://192.168.4.1:8084');
                        
    //                                 Socket.addEventListener('open', (event) => {
    //                                     // channel2.postMessage(true)
    //                                     console.log('连接成功');
    //                                     let timer=setInterval(()=>{
    //                                         Socket.send('file')
    //                                         if(isRecive){
    //                                             isRecive=false
    //                                             Socket.close()
    //                                             clearInterval(timer)
    //                                             clearInterval(timeOut)
    //                                         }
                                            
    //                                     },1000)
    //                                 });
    //                                 Socket.addEventListener('message', (event) => {
    //                                     if(event.data=='success'){
    //                                         isRecive=true
    //                                     }
    //                                 })
    //                             }catch(e){
        
    //                             }
                            
    //                         }, 1000);
    //                     }
    //                 }
    //             }else if(JSON.parse(event.data).type=='masterClose'){
    //                 channelMasterClose.postMessage(JSON.parse(event.data).data.message)
    //             }else if(JSON.parse(event.data).type=='setExtension'){
    //                 let extension=JSON.parse(event.data).data.message
    //                 if(extension==1){
    //                     console.log('########################################################')
    //                     // extensionSelect[extension-1]=true
    //                     if( extensionSelect[extension-1]){
    //                         setIsBricks(true)
    //                         channel1.postMessage(extension)
    //                         await new Promise(resolve => setTimeout(resolve, 100));
    //                         await fetch('http://localhost:3000/set-extension', {
    //                             method: 'POST',
    //                             headers: {
    //                                 'Content-Type': 'text/plain'
    //                             },
    //                             body: 0
    //                             })
    //                             .then(response => response.text())
    //                             .then(data => {
    //                             // console.log('服务器响应:', data);
    //                             })
    //                             .catch(error => {
    //                             console.error('错误:', error);
    //                             });
    //                     }else{
    //                         setIsLoading(true)
    //                         setIsMaster(true)
    //                         setIsBricks(true)
    //                         setAdd(true)
    //                         onExtensionButtonClick()
    //                         extensionSelect[extension-1]=true
    //                     }
    
    //                     setLan('Lua');
    //                     setLanMode('Lua');
    //                     codeModule.setCode('');
                        
    //                     // setExtension(false)
    //                 }else if(extension==2){
    //                      console.log('**********************************************')
                        
    //                     if( extensionSelect[extension-1]){
    //                         setIsBricks(false)
    //                         channel1.postMessage(extension)
    //                         await new Promise(resolve => setTimeout(resolve, 100));
    //                         await fetch('http://localhost:3000/set-extension', {
    //                             method: 'POST',
    //                             headers: {
    //                                 'Content-Type': 'text/plain'
    //                             },
    //                             body: 0
    //                             })
    //                             .then(response => response.text())
    //                             .then(data => {
    //                             // console.log('服务器响应:', data);
    //                             })
    //                             .catch(error => {
    //                             console.error('错误:', error);
    //                             });
    //                     }else{
    //                         setIsLoading(true)
    //                         setIsBricks(false)
    //                         setIsMaster(true)
    //                         setIsRobot(true)
    //                         setAdd(true)
    //                         onExtensionButtonClick()
    //                         extensionSelect[extension-1]=true
    //                         // await new Promise(resolve => setTimeout(resolve, 3000));
    //                         // if(isPostIp){
    //                         //     channelSendIp.postMessage(IP)
    //                         //     channel2.postMessage(true)
    //                         //     isPostIp=false
    //                         // }
    //                     }
    //                     setLan('Python');
    //                     setLanMode('Python');
    //                     codeModule.setCode('');
                        
    //                 }
    //             }else if(JSON.parse(event.data).type=='whatIp'){
    //                 // setIsLoading(true)
    //                 // await new Promise(resolve => setTimeout(resolve, 500));
    //                 // // if(JSON.parse(event.data).data.message!='192.168.4.1'){
    //                 // //     channelHostPot.postMessage(true)
    //                 // // }
    //                 // channelHostPot.postMessage(true)
                    
    //                 // IP=JSON.parse(event.data).data.message
    //                 // let ip=JSON.parse(event.data).data.message
    //                 // console.log(ip)
    
    //                 // const socketMode = new WebSocket(`ws://${ip}:8084`);
    //                 // socketTimer=setTimeout(()=>{
    //                 //     alert('socket连接失败')
    //                 //     setIsLoading(false)
    //                 //     socketMode.close()
    //                 // },10000)
    
                    
    //                 // console.log('已发送')
    //                 // let timer
                    
    //                 // socketMode.addEventListener('open', (event) => {
    //                 //     socketMode.addEventListener('message', async(event) => {
    //                 //         console.log(event.data)
    //                 //         if(event.data=='success'){
    //                 //             if(socketTimer){
    //                 //                 clearTimeout(socketTimer)
    //                 //             }
    //                 //             setIsLoading(false)
                                
    //                 //             // if(!extensionSelect[1]){
    //                 //             //     isPostIp=true
    //                 //             //     alert('socket连接成功')
    //                 //             //     Socket.close()
    //                 //             // }else{
    //                 //             //     channelSendIp.postMessage(ip)
    //                 //             //     channel2.postMessage(true)
        
    //                 //             //     alert('socket连接成功')
    //                 //             //     Socket.close()
    //                 //             // }
    //                 //             channelSendIp.postMessage(ip)
    //                 //             channel2.postMessage(true)
    //                 //             if(reciveTimer){
    //                 //                 clearInterval(reciveTimer)
    //                 //             }
    //                 //             reciveTimer=setInterval(async ()=>{
    //                 //                 if(!hasReceivedResponse){
    //                 //                     console.log('继续发送')
    //                 //                     channelSendIp.postMessage(ip)
    //                 //                     // await new Promise(resolve => setTimeout(resolve, 1000));
    //                 //                     channel2.postMessage(true)
    //                 //                 }else{
    //                 //                     console.log('停止发送')
    //                 //                     clearInterval(reciveTimer)
    //                 //                     hasReceivedResponse=false
    //                 //                     alert('socket连接成功')
    //                 //                     whatConnect[1]=1
    //                 //                     socketMode.close()
    //                 //                     clearInterval(timer)
    //                 //                 }
    //                 //             },1000)
                                
                                
    //                 //         }
                            
    //                 //     })
    //                 //     console.log('333333')
    //                 //     socketMode.addEventListener('close',()=>{
    //                 //         console.log('8084已关闭')
    //                 //     })
                        
    //                 //     console.log('连接成功');
                        
    //                 //     let count=0
    //                 //     timer=setInterval(()=>{
    //                 //         count++
    //                 //         if(count>2){
    //                 //             clearInterval(timer)
    //                 //             return
    //                 //         }
    //                 //         if(!isUpLoadMode){
    //                 //             socketMode.send('scratch')
    //                 //             // await new Promise(resolve => setTimeout(resolve, 100));
    //                 //             socketMode.send('stop')
    //                 //         }else{
    //                 //             socketMode.send('file')
    //                 //         }
                            
    //                 //     },1000)
                        
                        
    
                        
    //                 // });
    
    //                 setIsLoading(true);
    //                 await new Promise(resolve => setTimeout(resolve, 500));
    
    //                 channelHostPot.postMessage(true);
    //                 IP = JSON.parse(event.data).data.message;
    //                 let ip = IP;
    //                 console.log(ip);
    //                 setRobotIp(ip)
    
    //                 const socketMode = new WebSocket(`ws://${ip}:8084`);
    
    //                 let hasReceivedSuccess = false;
    //                 let sendInterval;
    //                 let socketTimer = setTimeout(() => {
    //                     alert('socket连接失败');
    //                     setIsLoading(false);
    //                     socketMode.close();
    //                     channelSendIp.postMessage('');
    //                     clearInterval(sendInterval);
    //                     clearInterval(loadTimer)
    //                 }, 10000); // 10秒超时
    
                    
    
    //                 socketMode.addEventListener('open', () => {
    //                     console.log('连接成功');
    
    //                     // 每秒发送指令
    //                     sendInterval = setInterval(() => {
    //                         if (hasReceivedSuccess) return;
    
    //                         if (!isUpLoadMode) {
    //                             socketMode.send('scratch');
    //                             socketMode.send('stop');
    //                         } else {
    //                             socketMode.send('file');
    //                         }
    //                     }, 1000);
    
    //                     socketMode.addEventListener('message', (event) => {
    //                         console.log(event.data);
    //                         if (event.data === 'success') {
    //                             hasReceivedSuccess = true;
    //                             clearTimeout(socketTimer);
    //                             clearInterval(sendInterval);
    //                             setIsLoading(false);
    //                             clearInterval(loadTimer)
    
    //                             channelSendIp.postMessage(ip);
    //                             channel2.postMessage(true);
    
    //                             if (reciveTimer) clearInterval(reciveTimer);
    
    //                             reciveTimer = setInterval(() => {
    //                                 if (!hasReceivedResponse) {
    //                                     console.log('继续发送');
    //                                     channelSendIp.postMessage(ip);
    //                                     channel2.postMessage(true);
    //                                 } else {
    //                                     console.log('停止发送');
    //                                     clearInterval(reciveTimer);
    //                                     hasReceivedResponse = false;
    //                                     alert('socket连接成功');
    //                                     whatConnect[1] = 1;
    //                                     socketMode.close();
    //                                 }
    //                             }, 1000);
    //                         }
    //                     });
    
    //                     socketMode.addEventListener('close', () => {
    //                         console.log('8084已关闭');
    //                     });
    //                 });
    
                    
                    
    //             }else if(JSON.parse(event.data).type=='espIpStatus'){
    //                 if(JSON.parse(event.data).data.message){
    //                     channelHostPot.postMessage(false)
    //                     alert('机器人连接已断开')
    //                 }
    //             }else if(JSON.parse(event.data).type=='isOpenPort'){
    //                 if(JSON.parse(event.data).data.message){
    //                     whatConnect[2]=1
    //                 }else{
    //                     whatConnect[2]=0
    //                 }
    //                 channelPort.postMessage(JSON.parse(event.data).data.message)
    //             }else if(JSON.parse(event.data).type=='serialData'){
    //                 channelSerialData.postMessage(JSON.parse(event.data).data.message)
    
    //                 setData(prev => prev + JSON.parse(event.data).data.message);
    //             }else if(JSON.parse(event.data).type=='ble-connect'){
    //                 console.log('蓝牙已连接')
    //                 whatConnect[0]=1
    //             }else if(JSON.parse(event.data).type=='addLoad'){
    //                 console.log('添加遮罩')
    //                 setIsLoading(true);

    //                 if(loadTimer) clearInterval(loadTimer)
    //                 loadTimer=setInterval(() => {
    //                     setIsLoading(false);
    //                     alert('socket连接失败')
    //                 }, 30000);
    //             }else if(JSON.parse(event.data).type=='wifiIsConnected'){
    //                 channelHostPot.postMessage(false)
    //             }else if(JSON.parse(event.data).type=='burnLogs'){
    //                 console.log(JSON.parse(event.data).data.message)
    //                 setIsFlashing(JSON.parse(event.data).data.message.flashing)
    //                  if (typeof JSON.parse(event.data).data.message.logs === 'string') {
    //                     const newLines = JSON.parse(event.data).data.message.logs.split(/\r?\n/).filter(line => line.trim() !== '');
    //                     setLogs(prevLogs => [...prevLogs, ...newLines]);
    //                 }
    //             }
                
    //         }catch(e){
    //             console.log('8081error'+e)
    //         }
         

    //     });
    //     // Cleanup WebSocket connection when component unmounts
    //     return () => {
    //         console.log('Cleaning up WebSocket connection');
    //         Socket.close();
    //         };
    //     }, []); // Empty dependency array to run only once


    // 处理 Python 代码缩进与插入 time.sleep
    function modifyPythonCode(code) {
        const lines = code.split('\n');
        let modifiedLines = [];
        let insideWhile = false;
        let whileStack = [];
        let importTimeAdded = false;
        let addedSleepLines = new Set();


        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            modifiedLines.push(line);

            let trimmed = line.trim();
            let indentLevel = line.match(/^ */)[0].length;

            if (/^while\b.*:\s*$/.test(trimmed)) {
                whileStack.push({
                    startLine: i,
                    indent: indentLevel,
                    lineTrackingFound: false,
                    bodyStart: null
                });
            }

            // 如果在 while 栈中
            if (whileStack.length > 0) {
                const currentWhile = whileStack[whileStack.length - 1];

                if (currentWhile.bodyStart === null && indentLevel > currentWhile.indent) {
                    currentWhile.bodyStart = i;
                }

                if (trimmed.includes('icrobot.rgb_sensor.line_tracking')) {
                    currentWhile.lineTrackingFound = true;
                }

                // 当前缩进小于或等于 while 缩进，说明 while 块结束
                if (i > currentWhile.startLine && indentLevel <= currentWhile.indent) {
                    if (currentWhile.lineTrackingFound && currentWhile.bodyStart !== null) {
                        let insertIndent = ' '.repeat(currentWhile.indent + 4);
                        modifiedLines.splice(i, 0, insertIndent + 'time.sleep(0.05)');
                        i++; // 因为插入了一行
                    }
                    whileStack.pop();
                }
            }
        }

        // 若 while 块到文件末尾才结束，需补充 sleep
        whileStack.forEach(w => {
            if (w.lineTrackingFound && w.bodyStart !== null) {
                let insertIndent = ' '.repeat(w.indent + 4);
                modifiedLines.push(insertIndent + 'time.sleep(0.05)');
            }
        });

        return modifiedLines.join('\n');
    }

    async function downloadCodeTotal(args){
        if(whatConnect[2]==1){
            console.log('串口下载')
            // let place = await new Promise(resolve => {
            //     resolve(prompt('请输入坑位(1-5)'));
            // });
            let place=args
            if (place > 0 && place < 6) {
                SerialDownload(place);
            } else {
                alert(formatMessage({
                        id: 'gui.alert.selectplace',
                        default: 'Please select the correct slot',
                        description: 'gui.alert.selectplace'
                    }));
            }
        }else if(whatConnect[2]==0 && whatConnect[0]==1){
            console.log('蓝牙下载')
            console.log(args)
            if (args==0) {
                download();
                setIsLoading(true)
                if(bleDownloadTimer){
                    clearTimeout(bleDownloadTimer)
                }
                bleDownloadTimer=setTimeout(()=>{
                    setIsLoading(false)
                    alert(formatMessage({
                        id: 'gui.alert.downFailed',
                        default: 'Download failed',
                        description: 'gui.alert.downFailed'
                    }))
                },6000)
                
            } else {
                cancelload();
            }
            setIsDown(!isDown);
        }else if(whatConnect[2]==0 && whatConnect[1]==1){
            console.log('wifi下载')

            setIsLoading(true)
            let timerLoad=setTimeout(()=>{
                alert(formatMessage({
                        id: 'gui.alert.downFailed',
                        default: 'Download failed',
                        description: 'gui.alert.downFailed'
                    }))
                setIsLoading(false)
            },8000)
            let downloadCode = pythonCode;
            if (!downloadCode.includes('while')) {
                downloadCode += '\nwhile True:\n    pass\n';
            }
            downloadCode=modifyPythonCode(downloadCode)
            console.log(downloadCode)

            // let place = await new Promise(resolve => {
            //     resolve(prompt('请输入坑位(1-5)'));
            // });
            let place = args
            console.log(place)
            if (place > 0 && place < 6) {
                let socket = new WebSocket(`ws://${IP}:8084`);
                socket.addEventListener('open', async () => {
                    socket.addEventListener('message', (event) => {
                        if (event.data === 'success') {
                            alert(formatMessage({
                                id: 'gui.alert.downSuccess',
                                default: 'Download successful',
                                description: 'gui.alert.downSuccess'
                            }));
                            socket.close();
                            clearTimeout(timerLoad)
                            setIsLoading(false)
                        } else if (event.data === 'failed') {
                            alert(formatMessage({
                                id: 'gui.alert.downFailed',
                                default: 'Download failed',
                                description: 'gui.alert.downFailed'
                            }));
                            socket.close();
                            clearTimeout(timerLoad)
                            setIsLoading(false)
                        }
                    });
                    const jsonData = {
                        command: "upload_script",
                        params: {
                            name: `${place}.py`,
                            script: downloadCode
                        }
                    };
                    socket.send(JSON.stringify(jsonData));
                });
            } else {
                alert(formatMessage({
                        id: 'gui.alert.selectplace',
                        default: '请选择正确坑位',
                        description: 'gui.alert.selectplace'
                    }));
            }
        }
    }


    function showToast(message, duration = 3000) {
        // 如果 toast 容器不存在，则创建一个
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            Object.assign(container.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            });
            document.body.appendChild(container);
        }
    
        // 创建 toast 元素
        const toast = document.createElement('div');
        toast.textContent = message;
    
        // 样式设置
        Object.assign(toast.style, {
            background: '#333',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            maxWidth: '300px'
        });
    
        // 添加 toast 到容器
        container.appendChild(toast);
    
        // 强制触发重绘以启用动画
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
    
        // 3秒后移除
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                toast.remove();
                // 若容器内无子元素则移除容器
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300); // 等动画结束
        }, duration);
    }

    let isUnMount=false
    useEffect(() => {
        isUnMount=false
        console.log(window);
        let Socket = new WebSocket('ws://localhost:8081');
        setSoc(Socket);

        const RECONNECT_INTERVAL = 3000; // 3 秒重连一次
        const MAX_RETRIES = 10;
        let retryCount = 0;
        let reconnectTimer = null;

        const channelPort = new BroadcastChannel('channelPort');
        channelPort.addEventListener('message', (event) => {
            Socket?.send(JSON.stringify({
                type: 'port',
                data: { message: event.data }
            }));
        });

        let loadTimer
        const channelSerialData = new BroadcastChannel('serial-data');

        function logWithTime(msg) {
            console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
        }

        const setupListeners = (sock) => {
            sock.addEventListener('open', () => {
                logWithTime('WebSocket connection opened');
                console.log('readyState:', sock.readyState);
                retryCount = 0;
            });

            sock.addEventListener('close', (event) => {
                logWithTime(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
                console.warn('readyState:', sock.readyState);

                if(!isUnMount){
                    // isUnMount=false
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        reconnectTimer = setTimeout(() => {
                            logWithTime(`Reconnecting... attempt ${retryCount}`);
                            Socket = new WebSocket('ws://localhost:8081');
                            setSoc(Socket);
                            setupListeners(Socket);
                        }, RECONNECT_INTERVAL);
                    } else {
                        console.error('Max reconnect attempts reached.');
                    }
                }
            });

            sock.addEventListener('error', (event) => {
                logWithTime('WebSocket error occurred!');
                console.error(event);
                console.warn('readyState:', sock.readyState);
            });

            sock.addEventListener('message', async (event) => {
                
                try{
                    // console.log(JSON.parse(event.data))
                    console.log(JSON.parse(event.data).data.message)
                    if(JSON.parse(event.data).type=='bricks'){
                        setIsDown(!JSON.parse(event.data).data.message)
                    }else if(JSON.parse(event.data).type=='wifiDown'){
                        if(JSON.parse(event.data).data.message=='success'){
                            alert('下载成功')
                        }else{
                            alert('下载失败')
                        }
                    }else if(JSON.parse(event.data).type=='ble'){
                        if(JSON.parse(event.data).data.message){
                            whatConnect[0]=0
                            portArr.forEach(port=>{
                                updateChildBallText(port, '', '', false);
                            })
                            setIsDown(true)
                        }
                        
                    }else if(JSON.parse(event.data).type=='wifi'){

                        if(JSON.parse(event.data).data.message){
                            console.log(isUpLoadMode)
                            attemptCount=0
                            if(!isUpLoadMode){
                                console.log('应该发送scratch')
                                let timeOut = setInterval(() => {
                                    try{
                                        if (attemptCount >= 2) { // 超过 3 次就停止
                                            clearInterval(timeOut);
                                            console.log("尝试连接 2 次，停止重试");
                                            if(!isRecive){
                                                alert('socket连接失败')
                                            }else{
                                                // alert('socket连接成功')
                                            }
                                            return;
                                        }
                                
                                        attemptCount++; // 递增计数器
                                        console.log(`尝试连接第 ${attemptCount} 次`);
                                        const Socket = new WebSocket('ws://192.168.4.1:8084');
                            
                                        Socket.addEventListener('open', (event) => {
                                            
                                            console.log('连接成功');
                                            let timer=setInterval(async ()=>{
                                                Socket.send('scratch')
                                                await new Promise(resolve => setTimeout(resolve, 100));
                                                Socket.send('stop')
                                                
                                                if(isRecive){
                                                    isRecive=false
                                                    Socket.close()
                                                    
                                                    clearInterval(timer)
                                                    clearInterval(timeOut)
                                                    channel2.postMessage(true)
                                                }
                                                
                                            },1000)
                                        });
                                        Socket.addEventListener('message', (event) => {
                                            if(event.data=='success'){
                                                isRecive=true
                                            }
                                        })
                                    }catch(e){

                                    }
                                
                                }, 1000);
                                
                            }else{
                                console.log('应该发送file')
                                let timeOut = setInterval(() => {
                                    try{
                                        if (attemptCount >= 2) { // 超过 3 次就停止
                                            clearInterval(timeOut);
                                            console.log("尝试连接 2 次，停止重试");
                                            if(!isRecive){
                                                alert('socket连接失败')
                                            }else{
                                                // alert('socket连接成功')
                                            }
                                            return;
                                        }
                                
                                        attemptCount++; // 递增计数器
                                        console.log(`尝试连接第 ${attemptCount} 次`);
                                        const Socket = new WebSocket('ws://192.168.4.1:8084');
                            
                                        Socket.addEventListener('open', (event) => {
                                            // channel2.postMessage(true)
                                            console.log('连接成功');
                                            let timer=setInterval(()=>{
                                                Socket.send('file')
                                                if(isRecive){
                                                    isRecive=false
                                                    Socket.close()
                                                    clearInterval(timer)
                                                    clearInterval(timeOut)
                                                }
                                                
                                            },1000)
                                        });
                                        Socket.addEventListener('message', (event) => {
                                            if(event.data=='success'){
                                                isRecive=true
                                            }
                                        })
                                    }catch(e){

                                    }
                                
                                }, 1000);
                            }
                        }
                    }else if(JSON.parse(event.data).type=='masterClose'){
                        channelMasterClose.postMessage(JSON.parse(event.data).data.message)
                        // console.log(JSON.parse(event.data).data.message)
                        if(!JSON.parse(event.data).data.message[1]){
                            stopAll.postMessage(true)
                        }
                        setExtensionName('选择设备')
                        setCurrent('')
                    }else if(JSON.parse(event.data).type=='setExtension'){
                        stopAll.postMessage(true)
                        let extension=JSON.parse(event.data).data.message
                        if(extension==1){
                            
                            setCurrentExtension('1')
                            setExtensionName('ICBricks')
                            setCurrent('ICBricks')
                            console.log('选了bricks')
                            // console.log('########################################################')
                            // extensionSelect[extension-1]=true
                            if( extensionSelect[extension-1]){
                                setIsBricks(true)
                                channel1.postMessage(extension)
                               
                                await new Promise(resolve => setTimeout(resolve, 100));
                                await fetch('http://localhost:3000/set-extension', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'text/plain'
                                    },
                                    body: 0
                                    })
                                    .then(response => response.text())
                                    .then(data => {
                                    // console.log('服务器响应:', data);
                                    })
                                    .catch(error => {
                                    console.error('错误:', error);
                                    });
                            }else{
                                setIsLoading(true)
                                setIsMaster(true)
                                setIsBricks(true)
                                setAdd(true)
                                onExtensionButtonClick()
                                extensionSelect[extension-1]=true
                            }

                            setLan('Lua');
                            setLanMode('Lua');
                            codeModule.setCode('');
                            
                            // setExtension(false)
                        }else if(extension==2){
                                // console.log('**********************************************')
                            setCurrentExtension('2')
                            setExtensionName('ICRobot')
                            setCurrent('ICRobot')
                            console.log('选了robot')
                            if( extensionSelect[extension-1]){
                                setIsBricks(false)
                                channel1.postMessage(extension)
                                 let extensionName=[
                                    'robotimg',
                                    'robotapriltag',
                                    'robotcat',
                                    'robotcolordete',
                                    'robotcolorplace',
                                    'robotcolorxy',
                                    'robotface',
                                    'robotgood',
                                    'robotqr',
                                    'robottraffic'
                                ]

                                for(let i=0;i<10;i++){
                            
                                    if(getAllLoaded().includes(extensionName[i])){
                                        console.log('执行了这里')
                                        // channelLoadExtension.postMessage({
                                        //     op:'restore',
                                        //     id:extensionName[i]
                                        // })
                                        addLoadExtension(extensionName[i])
                                    }else{
                                        addLoadExtension(extensionName[i])
                                        setAllLoaded(extensionName[i])
                                    }
                                    
                                }
                                await new Promise(resolve => setTimeout(resolve, 100));
                                await fetch('http://localhost:3000/set-extension', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'text/plain'
                                    },
                                    body: 0
                                    })
                                    .then(response => response.text())
                                    .then(data => {
                                    // console.log('服务器响应:', data);
                                    })
                                    .catch(error => {
                                    console.error('错误:', error);
                                    });
                            }else{
                                setIsLoading(true)
                                setIsBricks(false)
                                setIsMaster(true)
                                setIsRobot(true)
                                setAdd(true)
                                onExtensionButtonClick()
                                extensionSelect[extension-1]=true
                                // await new Promise(resolve => setTimeout(resolve, 3000));
                                // if(isPostIp){
                                //     channelSendIp.postMessage(IP)
                                //     channel2.postMessage(true)
                                //     isPostIp=false
                                // }
                            }
                            setLan('Python');
                            setLanMode('Python');
                            codeModule.setCode('');
                            
                        }else if(extension==3){
                                // console.log('**********************************************')
                            setCurrentExtension('3')
                            setExtensionName('Microbit')
                            setCurrent('Microbit')
                            console.log('选了microbit')
                            if( extensionSelect[extension-1]){
                                setIsBricks(false)
                                channel1.postMessage(extension)
                                await new Promise(resolve => setTimeout(resolve, 100));
                                await fetch('http://localhost:3000/set-extension', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'text/plain'
                                    },
                                    body: 0
                                    })
                                    .then(response => response.text())
                                    .then(data => {
                                    // console.log('服务器响应:', data);
                                    })
                                    .catch(error => {
                                    console.error('错误:', error);
                                    });
                            }else{
                                setIsLoading(true)
                                setIsBricks(false)
                                setIsMaster(true)
                                setIsRobot(false)
                                setAdd(true)
                                onExtensionButtonClick()
                                extensionSelect[extension-1]=true
                                // await new Promise(resolve => setTimeout(resolve, 3000));
                                // if(isPostIp){
                                //     channelSendIp.postMessage(IP)
                                //     channel2.postMessage(true)
                                //     isPostIp=false
                                // }
                            }
                            setLan('Python');
                            setLanMode('Python');
                            codeModule.setCode('');
                            
                        }
                    }else if(JSON.parse(event.data).type=='whatIp'){
                        // setIsLoading(true)
                        // await new Promise(resolve => setTimeout(resolve, 500));
                        // // if(JSON.parse(event.data).data.message!='192.168.4.1'){
                        // //     channelHostPot.postMessage(true)
                        // // }
                        // channelHostPot.postMessage(true)
                        
                        // IP=JSON.parse(event.data).data.message
                        // let ip=JSON.parse(event.data).data.message
                        // console.log(ip)

                        // const socketMode = new WebSocket(`ws://${ip}:8084`);
                        // socketTimer=setTimeout(()=>{
                        //     alert('socket连接失败')
                        //     setIsLoading(false)
                        //     socketMode.close()
                        // },10000)

                        
                        // console.log('已发送')
                        // let timer
                        
                        // socketMode.addEventListener('open', (event) => {
                        //     socketMode.addEventListener('message', async(event) => {
                        //         console.log(event.data)
                        //         if(event.data=='success'){
                        //             if(socketTimer){
                        //                 clearTimeout(socketTimer)
                        //             }
                        //             setIsLoading(false)
                                    
                        //             // if(!extensionSelect[1]){
                        //             //     isPostIp=true
                        //             //     alert('socket连接成功')
                        //             //     Socket.close()
                        //             // }else{
                        //             //     channelSendIp.postMessage(ip)
                        //             //     channel2.postMessage(true)

                        //             //     alert('socket连接成功')
                        //             //     Socket.close()
                        //             // }
                        //             channelSendIp.postMessage(ip)
                        //             channel2.postMessage(true)
                        //             if(reciveTimer){
                        //                 clearInterval(reciveTimer)
                        //             }
                        //             reciveTimer=setInterval(async ()=>{
                        //                 if(!hasReceivedResponse){
                        //                     console.log('继续发送')
                        //                     channelSendIp.postMessage(ip)
                        //                     // await new Promise(resolve => setTimeout(resolve, 1000));
                        //                     channel2.postMessage(true)
                        //                 }else{
                        //                     console.log('停止发送')
                        //                     clearInterval(reciveTimer)
                        //                     hasReceivedResponse=false
                        //                     alert('socket连接成功')
                        //                     whatConnect[1]=1
                        //                     socketMode.close()
                        //                     clearInterval(timer)
                        //                 }
                        //             },1000)
                                    
                                    
                        //         }
                                
                        //     })
                        //     console.log('333333')
                        //     socketMode.addEventListener('close',()=>{
                        //         console.log('8084已关闭')
                        //     })
                            
                        //     console.log('连接成功');
                            
                        //     let count=0
                        //     timer=setInterval(()=>{
                        //         count++
                        //         if(count>2){
                        //             clearInterval(timer)
                        //             return
                        //         }
                        //         if(!isUpLoadMode){
                        //             socketMode.send('scratch')
                        //             // await new Promise(resolve => setTimeout(resolve, 100));
                        //             socketMode.send('stop')
                        //         }else{
                        //             socketMode.send('file')
                        //         }
                                
                        //     },1000)
                            
                            

                            
                        // });

                        setIsLoading(true);
                        await new Promise(resolve => setTimeout(resolve, 500));

                        channelHostPot.postMessage(true);
                        IP = JSON.parse(event.data).data.message;
                        let ip = IP;
                        console.log(ip);
                        setRobotIp(ip)

                        const socketMode = new WebSocket(`ws://${ip}:8084`);

                        let hasReceivedSuccess = false;
                        let sendInterval;
                        let socketTimer = setTimeout(() => {
                            alert(formatMessage({
                                id: 'gui.alert.connectFailed',
                                default:'Connection failed',
                                description:'gui.alert.connectFailed'
                            }));
                            setIsLoading(false);
                            socketMode.close();
                            channelSendIp.postMessage('');
                            clearInterval(sendInterval);
                            clearInterval(loadTimer)
                        }, 10000); // 10秒超时

                        

                        socketMode.addEventListener('open', () => {
                            console.log('连接成功');

                            // 每秒发送指令
                            sendInterval = setInterval(() => {
                                if (hasReceivedSuccess) return;

                                if (!isUpLoadMode) {
                                    socketMode.send('scratch');
                                    socketMode.send('stop');
                                } else {
                                    socketMode.send('file');
                                }
                            }, 1000);

                            socketMode.addEventListener('message', (event) => {
                                console.log(event.data);
                                if (event.data === 'success') {
                                    hasReceivedSuccess = true;
                                    clearTimeout(socketTimer);
                                    clearInterval(sendInterval);
                                    setIsLoading(false);
                                    clearInterval(loadTimer)

                                    channelSendIp.postMessage(ip);
                                    channel2.postMessage(true);

                                    if (reciveTimer) clearInterval(reciveTimer);

                                    reciveTimer = setInterval(() => {
                                        if (!hasReceivedResponse) {
                                            console.log('继续发送');
                                            channelSendIp.postMessage(ip);
                                            channel2.postMessage(true);
                                        } else {
                                            console.log('停止发送');
                                            clearInterval(reciveTimer);
                                            hasReceivedResponse = false;
                                            // alert('socket连接成功');
                                            whatConnect[1] = 1;
                                            socketMode.close();
                                        }
                                    }, 1000);
                                }
                            });

                            socketMode.addEventListener('close', () => {
                                console.log('8084已关闭');
                            });
                        });

                        
                        
                    }else if(JSON.parse(event.data).type=='espIpStatus'){
                        if(JSON.parse(event.data).data.message){
                            channelHostPot.postMessage(false)
                            // console.log('222222222222222222222222')
                            showToast(formatMessage({
                                id: 'gui.alert.robotDisConnect',
                                default:'Robot disconnected',
                                description:'gui.alert.robotDisConnect'
                            }))
                        }
                    }else if(JSON.parse(event.data).type=='isOpenPort'){
                        if(JSON.parse(event.data).data.message){
                            whatConnect[2]=1
                        }else{
                            whatConnect[2]=0
                        }
                        channelPort.postMessage(JSON.parse(event.data).data.message)
                    }else if(JSON.parse(event.data).type=='serialData'){
                        channelSerialData.postMessage(JSON.parse(event.data).data.message)

                        setData(prev => prev + JSON.parse(event.data).data.message);
                    }else if(JSON.parse(event.data).type=='ble-connect'){
                        console.log('蓝牙已连接')
                        whatConnect[0]=1
                    }else if(JSON.parse(event.data).type=='addLoad'){

                        if(JSON.parse(event.data).data.message){
                            console.log('添加遮罩')
                            setIsLoading(true);
                        }else{
                            
                            setTimeout(()=>{
                                setIsLoading(false);
                            },5000)

                        }
                        // if(loadTimer) clearTimeout(loadTimer)
                        // loadTimer=setTimeout(()=>{
                        //     setIsLoading(false);
                        //     // alert('socket连接失败')
                        //     showToast('连接超时')
                        // },60000)

                        // if(loadTimer) clearInterval(loadTimer)
                        // loadTimer=setInterval(() => {
                        //     setIsLoading(false);
                        //     // alert('socket连接失败')
                        //     showToast('连接超时')
                        // }, 60000);
                    }else if(JSON.parse(event.data).type=='wifiIsConnected'){
                        showToast(formatMessage({
                                id: 'gui.alert.robotDisConnect',
                                default:'Robot disconnected',
                                description:'gui.alert.robotDisConnect'
                            }))
                        channelHostPot.postMessage(false)
                        console.log('333333333333333333333333')
                    }else if(JSON.parse(event.data).type=='burnLogs'){
                        console.log(JSON.parse(event.data).data.message)
                        if(JSON.parse(event.data).data.message.flashing){
                            setIsFlashing(JSON.parse(event.data).data.message.flashing)
                        }else{
                            await new Promise(resolve => setTimeout(resolve, 1000)); 
                            setIsFlashing(JSON.parse(event.data).data.message.flashing)
                        }
                        
                        if (typeof JSON.parse(event.data).data.message.logs === 'string') {
                            const newLines = JSON.parse(event.data).data.message.logs.split(/\r?\n/).filter(line => line.trim() !== '');
                            setLogs(prevLogs => [...prevLogs, ...newLines]);
                        }

                        if(JSON.parse(event.data).data.message.flashing && JSON.parse(event.data).data.message.logs.includes('A serial exception error occurred:')){
                            alert(formatMessage({
                                id: 'gui.alert.espToolTimeout',
                                default:'Flashing timed out. Please check the port connection',
                                description:'gui.alert.espToolTimeout'
                            }))
                        }
                        if(!JSON.parse(event.data).data.message.flashing && JSON.parse(event.data).data.message.logs=='success'){
                            alert(formatMessage({
                                id: 'gui.alert.espToolFinish',
                                default:'Flashing completed',
                                description:'gui.alert.espToolFinish'
                            }))
                        }else if(!JSON.parse(event.data).data.message.flashing && JSON.parse(event.data).data.message.logs=='Failed'){
                            alert(formatMessage({
                                id: 'gui.alert.espToolFailed',
                                default:'Flashing failed',
                                description:'gui.alert.espToolFailed'
                            }))
                        }
                    }else if(JSON.parse(event.data).type=='bleIsDownLoad'){
                        console.log(JSON.parse(event.data).data.message)
                        if(JSON.parse(event.data).data.message){
                            // console.log('蓝牙下载成功')
                            channelBleIsDown.postMessage(true)
                            setIsLoading(false)
                            clearTimeout(bleDownloadTimer)
                        }
                    }
                    
                }catch(e){
                    console.log('8081error'+e)
                }
            });
        };

        setupListeners(Socket); // 初始绑定事件监听器

        return () => {
            isUnMount=true
            Socket?.close();
            channelPort.close();
            channelSerialData.close();
            if (reconnectTimer) clearTimeout(reconnectTimer);
            // window.location.reload(true)
        };
    }, []);



        const [selectedOption, setSelectedOption] = useState('');

        const [modeValue, setModeValue] = useState('interactive'); // 控制 ModeToggle 状态
        const handleModeChange = (mode) => {
            console.log('主页面收到模式变更：', mode);
            let result = confirm(
                 formatMessage({
                        id: 'gui.alert.confirmchangemode',
                        default: 'This operation will clear the workspace. Continue?',
                        description: 'gui.alert.confirmchangemode'
                    })
            );
            if(result){
                let enableChange=false
                extensionSelect.forEach((ex)=>{
                    if(ex){
                        enableChange=true
                    }
                })
                if(!enableChange){
                    // alert('请先选择设备')
                    alert(
                        formatMessage({
                            id: 'gui.alert.selectDevice',
                            default: 'Please select a device first',
                            description: 'gui.alert.selectDevice'
                        })
                    )
                    return
                }

                // 模式真正切换
                setModeValue(mode); // 更新 ModeToggle 状态
                setShowCode(!showCode)
                setShowCodeDb(!showCode)
                setIsCode(!showCode)
                channelMode.postMessage(showCode)
                codeModule.setCode('')

                if(!showCode){
                    isUpLoadMode=true

                    const Socket = new WebSocket(`ws://${IP}:8084`);

                    Socket.addEventListener('open', (event) => {
                        console.log('连接成功');
                        let timer=setInterval(async()=>{
                            Socket.send('file')
                            if(isRecive){
                                isRecive=false
                                Socket.close()
                                clearInterval(timer)
                                await new Promise(resolve => setTimeout(resolve, 100)); 
                                channel2.postMessage(true)
                            }
                        
                        },1000)
                    });

                    Socket.addEventListener('message', (event) => {
                        if(event.data=='success'){
                            isRecive=true
                        }
                    })
                }else{
                    isUpLoadMode=false
                    
                    const Socket = new WebSocket(`ws://${IP}:8084`);

                    Socket.addEventListener('open', (event) => {
                        console.log('连接成功');
                        let timer=setInterval(()=>{
                            Socket.send('scratch')
                            if(isRecive){
                                isRecive=false
                                Socket.close()
                                clearInterval(timer)
                                channel2.postMessage(true)
                            }
                        
                        },1000)
                    });

                    Socket.addEventListener('message', (event) => {
                        if(event.data=='success'){
                            isRecive=true
                        }
                    })
                }
            }
        };

        

    
    return (<MediaQuery minWidth={unconstrainedWidth}>{isUnconstrained => {
        const stageSize = resolveStageSize(stageSizeMode, isUnconstrained);

         
        const alwaysEnabledModals = (
            <React.Fragment>
                <TWSecurityManager securityManager={securityManager} />
                <TWRestorePointManager />
                {usernameModalVisible && <TWUsernameModal />}
                {settingsModalVisible && <TWSettingsModal />}
                {customExtensionModalVisible && <TWCustomExtensionModal />}
                {fontsModalVisible && <TWFontsModal />}
                {unknownPlatformModalVisible && <TWUnknownPlatformModal />}
                {invalidProjectModalVisible && <TWInvalidProjectModal />}
            </React.Fragment>
        );

        return isPlayerOnly ? (
            <React.Fragment>
                {/* TW: When the window is fullscreen, use an element to display the background color */}
                {/* The default color for transparency is inconsistent between browsers and there isn't an existing */}
                {/* element for us to style that fills the entire screen. */}
                
                {isWindowFullScreen ? (
                    <div
                        className={styles.fullscreenBackground}
                        style={{
                            backgroundColor: fullscreenBackgroundColor
                        }}
                    />
                ) : null}
                <StageWrapper
                    isFullScreen={isFullScreen}
                    isEmbedded={isEmbedded}
                    isRendererSupported={isRendererSupported()}
                    isRtl={isRtl}
                    loading={loading}
                    stageSize={STAGE_SIZE_MODES.full}
                    vm={vm}
                >
                    {alertsVisible ? (
                        <Alerts className={styles.alertsContainer} />
                    ) : null}
                </StageWrapper>
                {alwaysEnabledModals}
            </React.Fragment>
        ) : (
            <Box
                className={styles.pageWrapper}
                dir={isRtl ? 'rtl' : 'ltr'}
                style={{
                    minWidth: 1024 + Math.max(0, customStageSize.width - 480),
                    minHeight: 640 + Math.max(0, customStageSize.height - 360)
                }}
                {...componentProps}
            >
                
                {alwaysEnabledModals}
                {telemetryModalVisible ? (
                    <TelemetryModal
                        isRtl={isRtl}
                        isTelemetryEnabled={isTelemetryEnabled}
                        onCancel={onTelemetryModalCancel}
                        onOptIn={onTelemetryModalOptIn}
                        onOptOut={onTelemetryModalOptOut}
                        onRequestClose={onRequestCloseTelemetryModal}
                        onShowPrivacyPolicy={onShowPrivacyPolicy}
                    />
                ) : null}
                {loading ? (
                    <Loader isFullScreen />
                ) : null}
                {isCreating ? (
                    <Loader
                        isFullScreen
                        messageId="gui.loader.creating"
                    />
                ) : null}
                {isBrowserSupported() ? null : (
                    <BrowserModal isRtl={isRtl} />
                )}
                {tipsLibraryVisible ? (
                    <TipsLibrary />
                ) : null}
                {cardsVisible ? (
                    <Cards />
                ) : null}
                {alertsVisible ? (
                    <Alerts className={styles.alertsContainer} />
                ) : null}
                {connectionModalVisible ? (
                    <ConnectionModal
                        vm={vm}
                    />
                ) : null}
                {costumeLibraryVisible ? (
                    <CostumeLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseCostumeLibrary}
                    />
                ) : null}
                {backdropLibraryVisible ? (
                    <BackdropLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseBackdropLibrary}
                    />
                ) : null}
                
                <MenuBar
                    accountNavOpen={accountNavOpen}
                    authorId={authorId}
                    authorThumbnailUrl={authorThumbnailUrl}
                    authorUsername={authorUsername}
                    canChangeLanguage={canChangeLanguage}
                    canChangeTheme={canChangeTheme}
                    canCreateCopy={canCreateCopy}
                    canCreateNew={canCreateNew}
                    canEditTitle={canEditTitle}
                    canManageFiles={canManageFiles}
                    canRemix={canRemix}
                    canSave={canSave}
                    canShare={canShare}
                    className={styles.menuBarPosition}
                    enableCommunity={enableCommunity}
                    isShared={isShared}
                    isTotallyNormal={isTotallyNormal}
                    logo={logo}
                    renderLogin={renderLogin}
                    showComingSoon={showComingSoon}
                    showOpenFilePicker={showOpenFilePicker}
                    showSaveFilePicker={showSaveFilePicker}
                    onClickAbout={onClickAbout}
                    onClickAccountNav={onClickAccountNav}
                    onClickAddonSettings={onClickAddonSettings}
                    onClickMaster={onClickMaster}
                    onClickConnect={onClickConnect}
                    onClickFirmware={onClickFirmware}
                    onClickDesktopSettings={onClickDesktopSettings}
                    clickSerialConnect={clickSerialConnect}
                    clickBleConnect={clickBleConnect}
                    clickDownloadCode={clickDownloadCode}
                    clickEspSend={clickEspSend}
                    clickSendWifi={clickSendWifi}
                    onClickNewWindow={onClickNewWindow}
                    onClickPackager={onClickPackager}
                    onClickLogo={onClickLogo}
                    onCloseAccountNav={onCloseAccountNav}
                    onLogOut={onLogOut}
                    onOpenRegistration={onOpenRegistration}
                    onProjectTelemetryEvent={onProjectTelemetryEvent}
                    onSeeCommunity={onSeeCommunity}
                    onShare={onShare}
                    onStartSelectingFileUpload={onStartSelectingFileUpload}
                    onToggleLoginOpen={onToggleLoginOpen}
                    onModeChange={handleModeChange}
                    modeValue={modeValue}
                    extensionName={extensionName}
                />
                <Box className={styles.bodyWrapper}>
                    <Box className={styles.flexWrapper}>
                        <Box className={styles.editorWrapper}>
                            <Tabs
                                forceRenderTabPanel
                                className={tabClassNames.tabs}
                                selectedIndex={activeTabIndex}
                                selectedTabClassName={tabClassNames.tabSelected}
                                selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                                onSelect={onActivateTab}
                            >
                                <TabList className={tabClassNames.tabList} style={{
                                    position: 'relative', // 或 absolute/fixed，视情况而定
                                    zIndex: 100          // 设置比其他元素高的值
                                }}>
                                    <Tab className={tabClassNames.tab}>
                                        <img
                                            draggable={false}
                                            src={codeIcon()}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Code"
                                            description="Button to get to the code panel"
                                            id="gui.gui.codeTab"
                                        />
                                    </Tab>
                                    <Tab
                                        className={tabClassNames.tab}
                                        onClick={onActivateCostumesTab}
                                    >
                                        <img
                                            draggable={false}
                                            src={costumesIcon()}
                                        />
                                        {targetIsStage ? (
                                            <FormattedMessage
                                                defaultMessage="Backdrops"
                                                description="Button to get to the backdrops panel"
                                                id="gui.gui.backdropsTab"
                                            />
                                        ) : (
                                            <FormattedMessage
                                                defaultMessage="Costumes"
                                                description="Button to get to the costumes panel"
                                                id="gui.gui.costumesTab"
                                            />
                                        )}
                                    </Tab>
                                    <Tab
                                        className={tabClassNames.tab}
                                        onClick={onActivateSoundsTab}
                                    >
                                        <img
                                            draggable={false}
                                            src={soundsIcon()}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Sounds"
                                            description="Button to get to the sounds panel"
                                            id="gui.gui.soundsTab"
                                        />
                                    </Tab>
                                </TabList>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    <Box className={styles.blocksWrapper}>
                                        <Blocks
                                            //这里注释掉是因为有这一行可能会导致Blocks挂载两次，暂时不知道啥原因
                                            // key={`${blocksId}/${theme.id}`}
                                            canUseCloud={canUseCloud}
                                            grow={1}
                                            isVisible={blocksTabVisible}
                                            options={{
                                                media: `${basePath}static/${theme.getBlocksMediaFolder()}/`
                                            }}
                                            stageSize={stageSize}
                                            onOpenCustomExtensionModal={onOpenCustomExtensionModal}
                                            theme={theme}
                                            vm={vm}
                                        />
                                        
                                    </Box>
                                    <Box className={styles.extensionButtonContainer}>
                                        <button
                                            className={styles.extensionButton}
                                            title={intl.formatMessage(messages.addExtension)}
                                            // onClick={onExtensionButtonClick}
                                            onClick={(e) => {
                                                if (!showCode) {
                                                    onExtensionButtonClick(e);
                                                }
                                            }}
                                        >
                                            <img
                                                className={styles.extensionButtonIcon}
                                                draggable={false}
                                                src={addExtensionIcon}
                                            />
                                        </button>
                                    </Box>
                                    <Box className={styles.watermark}>
                                        <Watermark />
                                    </Box>
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {costumesTabVisible ? <CostumeTab
                                        vm={vm}
                                    /> : null}
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                                </TabPanel>
                            </Tabs>
                            {/* 书包 */}
                            {/* {backpackVisible ? (
                                <Backpack host={backpackHost} />
                            ) : null} */}
                        </Box>

                        {/* <div>
                            <CodeMirrorComponent code={pythonCode} />
                        </div> */}
                        {/* <div style={{position:'absolute',top:'100px',right:'500px'}}>
                            {isBricks && <FloatingBall mainBall={mainBall} childBalls={childBalls} />}
                        </div> */}

                        {/* 加载层 */}
                        <LoadingOverlay isLoading={isLoading} />
                        <BurnLogs isLoading={isFlashing} logs={logs}></BurnLogs>

                        {/* 覆盖页面，当 isTrain 为 true 时显示 */}
                        <TrainPage isTrain={isTrain}></TrainPage>
                        
                        <Box className={classNames(styles.stageAndTargetWrapper, styles[stageSize])}>
                        
                            {/* <button style={{ backgroundColor: '#C6E2FF',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '12px 20px',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease-in-out',
                                            boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
                                           }} 
                                    onClick={() => {
                                        let result = confirm("此操作将会清空工作区，确定继续？");
                                        if(result){
                                            let enableChange=false
                                            extensionSelect.forEach((ex)=>{
                                                if(ex){
                                                    enableChange=true
                                                }
                                            })
                                            if(!enableChange){
                                                alert('请先导入扩展')
                                                return
                                            }
                                            setShowCode(!showCode)
                                            setIsCode(!showCode)
                                            channelMode.postMessage(showCode)
                                            codeModule.setCode('')

                                            if(!showCode){
                                                isUpLoadMode=true

                                                const Socket = new WebSocket(`ws://${IP}:8084`);
                            
                                                Socket.addEventListener('open', (event) => {
                                                    console.log('连接成功');
                                                    let timer=setInterval(()=>{
                                                        Socket.send('file')
                                                        if(isRecive){
                                                            isRecive=false
                                                            Socket.close()
                                                            clearInterval(timer)
                                                        }
                                                    
                                                    },1000)
                                                });
            
                                                Socket.addEventListener('message', (event) => {
                                                    if(event.data=='success'){
                                                        isRecive=true
                                                    }
                                                })
                                            }else{
                                                isUpLoadMode=false
                                                
                                                const Socket = new WebSocket(`ws://${IP}:8084`);
                            
                                                Socket.addEventListener('open', (event) => {
                                                    console.log('连接成功');
                                                    let timer=setInterval(()=>{
                                                        Socket.send('scratch')
                                                        if(isRecive){
                                                            isRecive=false
                                                            Socket.close()
                                                            clearInterval(timer)
                                                            channel2.postMessage(true)
                                                        }
                                                    
                                                    },1000)
                                                });
            
                                                Socket.addEventListener('message', (event) => {
                                                    if(event.data=='success'){
                                                        isRecive=true
                                                    }
                                                })
                                            }
                                        }

                               
                                
                            }}>
                                {showCode ? '互动' : '上传'}
                            </button> */}
                            {/* <Button text='连接蓝牙' onClick={async ()=>{
                                let device = await navigator.bluetooth.requestDevice({
                                    filters: [{ services: ['108f94d5-570b-4a6c-9a47-12f428f362e6'] }],
                                    optionalServices: ['108f94d5-570b-4a6c-9a47-12f428f362e6', '4e8d78da-f40e-4983-9cc6-9b888aab1800']
                                  }).catch(e=>{
                                    console.log(e);
                                    
                                  })
                      
                                  console.log(device)
                                  console.log('开始');
                                  
                                  let server = await device.gatt.connect();
                                  console.log('结束');
                            }}>
                            </Button> */}

                            {/* <button style={{backgroundColor: '#f9f9f9',width:'40%'}} onClick={async () => {
                                 let device = await navigator.bluetooth.requestDevice({
                                    filters: [{ services: ['108f94d5-570b-4a6c-9a47-12f428f362e6'] }],
                                    optionalServices: ['108f94d5-570b-4a6c-9a47-12f428f362e6', '4e8d78da-f40e-4983-9cc6-9b888aab1800']
                                  }).catch(e=>{
                                    console.log(e);
                                    
                                  })
                      
                                  console.log(device)
                                  console.log('开始');
                                  
                                  let server = await device.gatt.connect();
                                  console.log('结束');
                            }}>
                                连接蓝牙
                            </button> */}


                            {/* <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', alignItems: 'center' }}>
                                {showCode && (
                                    <>
                                        <select
                                            value={selectedOption}
                                            onChange={(e) => setSelectedOption(e.target.value)}
                                            style={{
                                                padding: '10px',
                                                fontSize: '14px',
                                                borderRadius: '5px',
                                                border: '1px solid #ccc',
                                                width: '200px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="">选择操作</option>
                                            <option value="bluetooth">{isDown ? '蓝牙下载' : '结束执行'}</option>
                                            <option value="serial">串口下载</option>
                                            <option value="wifi">WIFI下载</option>
                                            <option value="save">保存代码</option>
                                            <option value="load">导入代码</option>
                                            <option value="switchToLua">切换为Lua模式</option>
                                            <option value="switchToPython">切换为Python模式</option>
                                        </select>

                                        <button
                                            onClick={async () => {
                                                switch (selectedOption) {
                                                    case 'bluetooth':
                                                        if (isDown) {
                                                            download();
                                                        } else {
                                                            cancelload();
                                                        }
                                                        setIsDown(!isDown);
                                                        break;
                                                    case 'serial': {
                                                        let place = await new Promise(resolve => {
                                                            resolve(prompt('请输入坑位(1-5)'));
                                                        });
                                                        if (place > 0 && place < 6) {
                                                            SerialDownload(place);
                                                        } else {
                                                            alert('请选择正确坑位！');
                                                        }
                                                        break;
                                                    }
                                                    case 'wifi': {
                                                        let downloadCode = pythonCode;
                                                        if (!downloadCode.includes('while')) {
                                                            downloadCode += '\nwhile True:\n    pass\n';
                                                        }

                                                        let place = await new Promise(resolve => {
                                                            resolve(prompt('请输入坑位(1-5)'));
                                                        });
                                                        if (place > 0 && place < 6) {
                                                            let socket = new WebSocket(`ws://${IP}:8084`);
                                                            socket.addEventListener('open', async () => {
                                                                socket.addEventListener('message', (event) => {
                                                                    if (event.data === 'success') {
                                                                        alert('下载成功');
                                                                        socket.close();
                                                                    } else if (event.data === 'failed') {
                                                                        alert('下载失败');
                                                                        socket.close();
                                                                    }
                                                                });
                                                                const jsonData = {
                                                                    command: "upload_script",
                                                                    params: {
                                                                        name: `${place}.py`,
                                                                        script: downloadCode
                                                                    }
                                                                };
                                                                socket.send(JSON.stringify(jsonData));
                                                            });
                                                        } else {
                                                            alert('请选择正确坑位');
                                                        }
                                                        break;
                                                    }
                                                    case 'save':
                                                        saveCode(extensionSelect);
                                                        break;
                                                    case 'load':
                                                        loadCode();
                                                        break;
                                                    case 'switchToLua':
                                                        if (lanMode === 'Python') {
                                                            setLan('Lua');
                                                            setLanMode('Lua');
                                                            codeModule.setCode('');
                                                        }
                                                        break;
                                                    case 'switchToPython':
                                                        if (lanMode === 'Lua') {
                                                            setLan('Python');
                                                            setLanMode('Python');
                                                            codeModule.setCode('');
                                                        }
                                                        break;
                                                    default:
                                                        alert('请选择一个操作');
                                                }
                                            }}
                                            style={{
                                                backgroundColor: '#4CAF50',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                padding: '10px 15px',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease-in-out',
                                                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)'
                                            }}
                                        >
                                            开始执行
                                        </button>
                                    </>
                                )}
                            </div> */}

                            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', alignItems: 'center',paddingTop:'10px'}}>
                                
                                {/* 上传代码按钮 */}
                                {/* {showCode && <button
                                    style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '6px 10px',
                                    border: '2px solidrgb(12, 243, 243)',
                                    borderRadius: '4px',
                                    color: '#239393',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    }}

                                    onClick={()=>{
                                        downloadCodeTotal()
                                    }}
                                >
                                    <svg
                                    viewBox="0 0 24 24"
                                    style={{ width: '16px', height: '16px', marginRight: '5px', fill: '#239393' }}
                                    >
                                    <path d="M5 20h14v-2H5v2zM12 2L6.5 7.5h3V15h3V7.5h3L12 2z" />
                                    </svg>
                                    {isDown ? '下载代码' : '结束执行'}
                                </button>} */}

                                {/* 保存图标按钮 */}
                               {showCode &&  <button
                                    style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    }}
                                    onClick={()=>{
                                        saveCode(extensionSelect);
                                    }}
                                >
                                    <svg
                                    viewBox="0 0 24 24"
                                    style={{ width: '20px', height: '20px', fill: '#239393' }}
                                    >
                                    <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3-8H7V5h8v4z" />
                                    </svg>
                                </button>}

                                {showCode && <button
                                    style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    }}

                                    onClick={()=>{
                                        loadCode();
                                    }}
                                >
                                    {/* <svg
                                    viewBox="0 0 24 24"
                                    style={{ width: '20px', height: '20px', fill: '#239393' }}
                                    >
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                    </svg> */}
                                     <FormattedMessage
                                            defaultMessage="导入"
                                            description="Button to get to the code panel"
                                            id="gui.importFile"
                                        />
                                </button>}

                                </div>
                            
                            {/* 根据状态决定是否渲染代码文本组件 */}
                            {showCode && <CodeMirrorComponent code={pythonCode}/>}
                            
                            {/* {showCode &&  <SerialMonitor serialData={data} />} */}

                            {showCode && <TabSwitcher serialData={data} onSendData={handleChildData} extension={currentExtension}/>}
                            {!showCode && <StageWrapper
                                isFullScreen={isFullScreen}
                                isRendererSupported={isRendererSupported()}
                                isRtl={isRtl}
                                stageSize={stageSize}
                                vm={vm}
                            />}
                            {/* <TextComponent text="Hello, World!" isBold /> */}
                            {!showCode && <Box className={styles.targetWrapper}>
                                <TargetPane
                                    stageSize={stageSize}
                                    vm={vm}
                                />
                            </Box>}
                            
                        </Box>
                    </Box>
                </Box>
                <DragLayer />
            </Box>
        );
    }}</MediaQuery>);
};

GUIComponent.propTypes = {
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    backdropLibraryVisible: PropTypes.bool,
    backpackHost: PropTypes.string,
    backpackVisible: PropTypes.bool,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    blocksId: PropTypes.string,
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    enableCommunity: PropTypes.bool,
    intl: intlShape.isRequired,
    isCreating: PropTypes.bool,
    isEmbedded: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isWindowFullScreen: PropTypes.bool,
    isTotallyNormal: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickAddonSettings: PropTypes.func,
    onClickMaster: PropTypes.func,
    onClickConnect:PropTypes.func,
    onClickFirmware:PropTypes.func,
    onClickDesktopSettings: PropTypes.func,
    clickSerialConnect: PropTypes.func,
    download:PropTypes.func,
    SerialDownload:PropTypes.func,
    saveCode:PropTypes.func,
    loadCode:PropTypes.func,
    cancelload:PropTypes.func,
    clickBleConnect: PropTypes.func,
    clickDownloadCode: PropTypes.func,
    clickEspSend: PropTypes.func,
    clickSendWifi: PropTypes.func,
    onClickNewWindow: PropTypes.func,
    onClickPackager: PropTypes.func,
    onClickLogo: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onOpenCustomExtensionModal: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onShowPrivacyPolicy: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onTabSelect: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    renderLogin: PropTypes.func,
    securityManager: PropTypes.shape({}),
    showComingSoon: PropTypes.bool,
    showOpenFilePicker: PropTypes.func,
    showSaveFilePicker: PropTypes.func,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    telemetryModalVisible: PropTypes.bool,
    theme: PropTypes.instanceOf(Theme),
    tipsLibraryVisible: PropTypes.bool,
    usernameModalVisible: PropTypes.bool,
    settingsModalVisible: PropTypes.bool,
    customExtensionModalVisible: PropTypes.bool,
    fontsModalVisible: PropTypes.bool,
    unknownPlatformModalVisible: PropTypes.bool,
    invalidProjectModalVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
};
GUIComponent.defaultProps = {
    backpackHost: null,
    backpackVisible: false,
    basePath: './',
    blocksId: 'original',
    canChangeLanguage: true,
    canChangeTheme: true,
    canCreateNew: false,
    canEditTitle: false,
    canManageFiles: true,
    canRemix: false,
    canSave: false,
    canCreateCopy: false,
    canShare: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    isTotallyNormal: false,
    loading: false,
    showComingSoon: false,
    stageSizeMode: STAGE_SIZE_MODES.large,
    
};

const mapStateToProps = state => ({
    customStageSize: state.scratchGui.customStageSize,
    isWindowFullScreen: state.scratchGui.tw.isWindowFullScreen,
    // This is the button's mode, as opposed to the actual current state
    blocksId: state.scratchGui.timeTravel.year.toString(),
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    theme: state.scratchGui.theme.theme
});

export default injectIntl(connect(
    mapStateToProps
)(GUIComponent));
