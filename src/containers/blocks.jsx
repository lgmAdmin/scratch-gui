import bindAll from 'lodash.bindall';
import debounce from 'lodash.debounce';
import defaultsDeep from 'lodash.defaultsdeep';
import makeToolboxXML from '../lib/make-toolbox-xml';
import PropTypes from 'prop-types';
import React from 'react';
import {intlShape, injectIntl, defineMessages} from 'react-intl';
import VMScratchBlocks from '../lib/blocks';
import VM from 'scratch-vm';

import log from '../lib/log.js';
import Prompt from './prompt.jsx';
import BlocksComponent from '../components/blocks/blocks.jsx';
import ExtensionLibrary from './extension-library.jsx';
import extensionData from '../lib/libraries/extensions/index.jsx';
import CustomProcedures from './custom-procedures.jsx';
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import {BLOCKS_DEFAULT_SCALE, STAGE_DISPLAY_SIZES} from '../lib/layout-constants';
import DropAreaHOC from '../lib/drop-area-hoc.jsx';
import DragConstants from '../lib/drag-constants';
import defineDynamicBlock from '../lib/define-dynamic-block';
import {Theme} from '../lib/themes';
import {injectExtensionBlockTheme, injectExtensionCategoryTheme} from '../lib/themes/blockHelpers';

import {connect} from 'react-redux';
import {updateToolbox} from '../reducers/toolbox';
import {activateColorPicker} from '../reducers/color-picker';
import {
    closeExtensionLibrary,
    openSoundRecorder,
    openConnectionModal,
    openCustomExtensionModal
} from '../reducers/modals';
import {activateCustomProcedures, deactivateCustomProcedures} from '../reducers/custom-procedures';
import {setConnectionModalExtensionId} from '../reducers/connection-modal';
import {updateMetrics} from '../reducers/workspace-metrics';
import {isTimeTravel2020} from '../reducers/time-travel';

import {
    activateTab,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';
import AddonHooks from '../addons/hooks.js';
import LoadScratchBlocksHOC from '../lib/tw-load-scratch-blocks-hoc.jsx';
import {findTopBlock} from '../lib/backpack/code-payload.js';
import {gentlyRequestPersistentStorage} from '../lib/tw-persistent-storage.js';

import codeModule from '../../../../utils/global.js';
import { setIsCode,getIsCode } from '../../../../utils/whatModule.js';

import { setBlock } from '../../../../utils/isAddMaster.js';

import {setLan,getLan} from '../../../../utils/lanMode.js'
import { getIsRobot ,getDelete,setDelete,getCurrent, getDeletedCate,setDeletedCate,delCategro,getHiddenBlocks,setHiddenBlocks,delHiddenBlocks,getShowCodeDb} from 'scratch-gui/src/components/utils/utils.js';
// const {getCode,setCode} =codeModule;
// const {getCode,setCode} =require('../../../../utils/global.js')

// TW: Strings we add to scratch-blocks are localized here
const messages = defineMessages({
    PROCEDURES_RETURN: {
        defaultMessage: 'return {v}',
        // eslint-disable-next-line max-len
        description: 'The name of the "return" block from the Custom Reporters extension. {v} is replaced with a slot to insert a value.',
        id: 'tw.blocks.PROCEDURES_RETURN'
    },
    PROCEDURES_TO_REPORTER: {
        defaultMessage: 'Change To Reporter',
        // eslint-disable-next-line max-len
        description: 'Context menu item to change a command-shaped custom block into a reporter. Part of the Custom Reporters extension.',
        id: 'tw.blocks.PROCEDURES_TO_REPORTER'
    },
    PROCEDURES_TO_STATEMENT: {
        defaultMessage: 'Change To Statement',
        // eslint-disable-next-line max-len
        description: 'Context menu item to change a reporter-shaped custom block into a statement/command. Part of the Custom Reporters extension.',
        id: 'tw.blocks.PROCEDURES_TO_STATEMENT'
    },
    PROCEDURES_DOCS: {
        defaultMessage: 'How to use return',
        // eslint-disable-next-line max-len
        description: 'Button in extension list to learn how to use the "return" block from the Custom Reporters extension.',
        id: 'tw.blocks.PROCEDURES_DOCS'
    }
});

const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function (...args) {
        const result = oldFn.apply(this, args);
        callback.apply(this, result);
        return result;
    };
};

const DroppableBlocks = DropAreaHOC([
    DragConstants.BACKPACK_CODE
])(BlocksComponent);

let dataXML;

let currentModule=false

let isBlockBeingDragged = false;
let isRunning=false

let preClose=[false,false,false]

class Blocks extends React.Component {
    constructor (props) {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        super(props);
        this.ScratchBlocks = VMScratchBlocks(props.vm, false);

        this._mountedOnce=false
        // console.log(props.vm)
        window.ScratchBlocks = this.ScratchBlocks;
        AddonHooks.blockly = this.ScratchBlocks;
        AddonHooks.blocklyCallbacks.forEach(i => i());
        AddonHooks.blocklyCallbacks.length = [];

        // this.deletedCategories = [];
        // // this.deletedCategoriesID = ['robotwifi'];
        // this.deletedCategoriesID =[];
        // this.deletedCategoriesID.push('robotwifi');
        // this.deletedCategoriesID.push('robotcat');
        // this.hiddenBlocksTypes = ['robotsensors_asrStart','robotsensors_asrStop','robotsensors_asrResult','robotevent_when','robotimg_isCat','robotimg_catNum','robotimg_catPlace','robotimg_isOpenModel'];


        this.downEnableCategories=['control','operators','variables','myBlocks','robot','bricks','Microbit']
        this.mode=!getShowCodeDb()
        this.channelMode=new BroadcastChannel('mode')
        this.channelMode.addEventListener('message',(event)=>{
            console.log('改变了模式')
            this.mode=event.data
            if(getCurrent()=='ICRobot'){

                if(!this.mode){
                    // let index = this.deletedCategoriesID.indexOf('robotwifi');
                    // if (index !== -1) {
                    //     this.deletedCategoriesID.splice(index, 1);
                    // }
                    

                    //恢复
                    let toMoveCategory=['robotwifi','robotcat']
                    for (let i = getDeletedCate().length - 1; i >= 0; i--) {
                        if (toMoveCategory.includes( getDeletedCate()[i])) {
                            delCategro(i,1)
                        }
                    }
                    let toMove=['robotsensors_asrStart','robotsensors_asrStop','robotsensors_asrResult','robotevent_when','robotimg_isCat','robotimg_catNum','robotimg_catPlace','robotimg_isOpenModel']
                    for (let i = getHiddenBlocks().length - 1; i >= 0; i--) {
                        if (toMove.includes( getHiddenBlocks()[i])) {
                            delHiddenBlocks(i,1)
                        }
                    }


                    //隐藏
                    // this.hiddenBlocksTypes.push('robotcolordete_readColor')
                    setHiddenBlocks('robotface_symFace')
                    setHiddenBlocks('robotface_isSymFace')
                    setHiddenBlocks('robotface_faceName')
                    setHiddenBlocks('robotface_symFacePlace')
                    // this.hiddenBlocksTypes.push('robotgood_isGood')
                    // this.hiddenBlocksTypes.push('robotgood_goodPlace')
                    setHiddenBlocks('robotimg_isTraffic')
                    setHiddenBlocks('robotimg_trafficPlace')
                    setHiddenBlocks('robotsensors_cstartsound')
                    setHiddenBlocks('robotimg_cstartComputerCamera')
                    setHiddenBlocks('robotimg_cstopComputerCamera')
                    
                    // this.hiddenBlocksTypes.push('robotimg_cstartCamera')
                    setHiddenBlocks('robotqr_getQrPlace')
                    setHiddenBlocks('robotqr_getQrWh')
                    setHiddenBlocks('robotevent_whenPressed')
                    setHiddenBlocks('robotimg_csetCamera')
                    setHiddenBlocks('robotface_getFaceWh')
                    // this.hiddenBlocksTypes.push('robotimg_getGoodWh')
                    setHiddenBlocks('robotcolorxy_getColorWh')
                    // this.hiddenBlocksTypes.push('robotimg_whatPlaceColor')
                    setHiddenBlocks('robotimg_cstartNetCamera')
                    setHiddenBlocks('robotimg_isOpenCamera')
                    setHiddenBlocks('robotsound_playLocalMusic')
                    setHiddenBlocks('robotimg_howStartCamera')
                    
                    
                    setDeletedCate('robotcolordete');
                    setDeletedCate('robotcolorplace');
                    setDeletedCate('robotgood');
                    setDeletedCate('robottraffic');
                    // this.hiddenBlocksTypes.push('robotimg_isApril')
                    // this.hiddenBlocksTypes.push('robotimg_getAprilContent')
                    // this.hiddenBlocksTypes.push('robotimg_getAprilPlace')
                    // this.hiddenBlocksTypes.push('robotimg_getAprilWh')
                }else{
                    setDeletedCate('robotwifi')
                    setDeletedCate('robotcat')
                    // this.deletedCategoriesID.push('robotevent')
                    setHiddenBlocks('robotsensors_asrStart')
                    setHiddenBlocks('robotsensors_asrStop')
                    setHiddenBlocks('robotsensors_asrResult')
                    setHiddenBlocks('robotevent_when')

                    setHiddenBlocks('robotimg_isCat')
                    setHiddenBlocks('robotimg_catNum')
                    setHiddenBlocks('robotimg_catPlace')
                    setHiddenBlocks('robotimg_isOpenModel')

                    let toMove=['robotface_symFace','robotface_isSymFace','robotface_faceName','robotface_symFacePlace','robotimg_isTraffic','robotimg_trafficPlace','robotsensors_cstartsound','robotimg_cstartComputerCamera','robotimg_cstopComputerCamera','robotqr_getQrPlace','robotqr_getQrWh','robotevent_whenPressed','robotimg_csetCamera','robotface_getFaceWh','robotcolorxy_getColorWh','robotimg_cstartNetCamera','robotimg_isOpenCamera','robotsound_playLocalMusic','robotimg_howStartCamera']
                    for (let i = getHiddenBlocks().length - 1; i >= 0; i--) {
                        if (toMove.includes( getHiddenBlocks()[i])) {
                            delHiddenBlocks(i, 1);
                        }
                    }

                    let toMoveCategory=['robotcolordete','robotcolorplace','robotgood','robottraffic']
                    for (let i = getDeletedCate().length - 1; i >= 0; i--) {
                        if (toMoveCategory.includes(getDeletedCate()[i])) {
                            delCategro(i, 1);
                        }
                    }
                    // this.hiddenBlocksTypes=[]
                }
            }else if(getCurrent()=='ICBricks'){
                if(!this.mode){

                    let toMove=['brickstwomotor_speedmoveplace']
                    for (let i = getHiddenBlocks().length - 1; i >= 0; i--) {
                        if (toMove.includes( getHiddenBlocks()[i])) {
                            delHiddenBlocks(i,1)
                        }
                    }

                }else{
                    
                    setHiddenBlocks('brickstwomotor_speedmoveplace')

                    // this.hiddenBlocksTypes=[]
                }
            }
            
            const toolboxDom = this.ScratchBlocks.Xml.textToDom(this.getToolboxXML())
            // console.log(toolboxDom)

            if(!this.mode){
                // const children = toolboxDom.children;
                // for (let i = 0; i < children.length; i++) {
                //     console.log(children[i]);
                //     if(children[i].id){

                //     }
                // }


                const children = toolboxDom.children;
                

                for (let i = 0; i < children.length; i++) {
                    const id = children[i].id;

                    if(id){
                        const match = this.downEnableCategories.some(cat =>
                            id === cat || id.startsWith(cat)
                        );

                        if (match) {
                            // ✅ id 与数组中的某个值相等或以其开头
                            // console.log('匹配：', id);
                            // 这里写你的操作...
                        } else {
                            // ❌ 不匹配
                            // console.log('不匹配：', id);
                            setDeletedCate(id);

                            // 这里写另一些操作...
                        }
                        if(id=='robotteachable'){
                            setDeletedCate(id);
                        }
                    }
                   
                }
            }else{


                const deleted = getDeletedCate();
                console.log(deleted)
                for (let i = deleted.length - 1; i >= 0; i--) {
                    const id = deleted[i];
                    console.log(id)
                    if(typeof id =='string'){
                        const match = this.downEnableCategories.some(cat =>
                            id === cat || id.startsWith(cat)
                        );
                        if (!match) {
                            console.log('不匹配', id);
                            delCategro(i, 1);  // 安全地删除
                        }
                        if(id=='robotteachable'){
                            delCategro(i, 1);
                        }
                    }
                    
                }

            }
            

            // 1. 获取当前 workspace 的完整 XML DOM
            const fullDom = this.ScratchBlocks.Xml.workspaceToDom(this.workspace);

            console.log(fullDom)
            // 2. 提取 <variables> 节点
            const variablesTags = fullDom.getElementsByTagName('variables');
            let variablesXml = '';

            if (variablesTags.length > 0) {
                // 3. 转为字符串
                const wrapper = document.createElement('xml');
                wrapper.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
                wrapper.appendChild(variablesTags[0].cloneNode(true));
                variablesXml = wrapper.outerHTML;
            }

            // 4. 传给函数
            this.onWorkspaceUpdate({ xml: variablesXml });
            // this.onWorkspaceUpdate(dataXML)
            // this.workspace.clear()
            // window.location.reload()
            if(!this.mode){
                // 创建初始块，不可删除
                const block = this.workspace.newBlock('event_when');
                console.log(block)
                block.initSvg();
                block.render();
                block.moveBy(200, 100);
        
                block.setDeletable(false);
                // block.setMovable(false);
            }

        })

        const channelLoadExtension = new BroadcastChannel('loadExtension')
        channelLoadExtension.addEventListener('message',async (event)=>{
            console.log(event.data)

            if(event.data.op=='remove'){
                await this.removeCategoryFromToolbox([
                    event.data.id
                ]);
                this.onWorkspaceUpdate(dataXML)
                this.workspace.clear()
            }else{
                await this.restoreCategoriesToToolbox([
                    event.data.id
                ]);
                this.onWorkspaceUpdate(dataXML)
                this.workspace.clear()
            }
             
        })


        bindAll(this, [
            'attachVM',
            'detachVM',
            'getToolboxXML',
            'removeCategoryFromToolbox',
            'restoreCategoriesToToolbox',
            'handleCategorySelected',
            'handleConnectionModalStart',
            'handleDrop',
            'handleStatusButtonUpdate',
            'handleOpenSoundRecorder',
            'handlePromptStart',
            'handlePromptCallback',
            'handlePromptClose',
            'handleCustomProceduresClose',
            'onScriptGlowOn',
            'onScriptGlowOff',
            'onBlockGlowOn',
            'onBlockGlowOff',
            'handleMonitorsUpdate',
            'handleExtensionAdded',
            'handleBlocksInfoUpdate',
            'onTargetsUpdate',
            'onVisualReport',
            'onWorkspaceUpdate',
            'onWorkspaceMetricsChange',
            'setBlocks',
            'setLocale',
            'handleEnableProcedureReturns',
            'workspaceToCode',
            'unindentCode',
            'findSecondTopParent',
            'handleRuntimeStop',
            'arraysAreEqual'
        ]);
        this.ScratchBlocks.prompt = this.handlePromptStart;
        this.ScratchBlocks.statusButtonCallback = this.handleConnectionModalStart;
        this.ScratchBlocks.recordSoundCallback = this.handleOpenSoundRecorder;
        

        this.state = {
            prompt: null
        };
        this.onTargetsUpdate = debounce(this.onTargetsUpdate, 100);
        this.toolboxUpdateQueue = [];

        

        this.channel = new BroadcastChannel('extensionSecondly');
        this.channel.addEventListener('message', async (event) => {
            // console.log('恢复工具箱')
            if(event.data=='1'){
                console.log('11111111111111111111')
                await this.restoreCategoriesToToolbox([
                    'bricksmotor',
                    'brickslight',
                    'brickssensors',
                    'brickstwomotor'
                ]);
                this.onWorkspaceUpdate(dataXML)
                this.workspace.clear()
            }else if(event.data=='2'){
                console.log(getDeletedCate())
                if(this.mode){
                    console.log('22222222222222')
                    await this.restoreCategoriesToToolbox([
                            'robotmove',
                            'robotemote',
                            'robotshow',
                            'robotsound',
                            'robotactuator',
                            'robotsensors',
                            'robotimg',
                            'robotble',
                            // 'robotteachable',
                            'robotapriltag',
                            'robotcolordete',
                            'robotcolorplace',
                            'robotcolorxy',
                            'robotface',
                            'robotgood',
                            'robotqr',
                            'robottraffic'
                    ]);
                    this.onWorkspaceUpdate(dataXML)
                    this.workspace.clear()
                }else{
                    console.log('33333333333333333')
                    await this.restoreCategoriesToToolbox([
                            'robotmove',
                            'robotemote',
                            'robotshow',
                            'robotsound',
                            'robotactuator',
                            'robotsensors',
                            'robotimg',
                            'robotble',
                            // 'robotteachable',
                             'robotapriltag',
                            'robotcat',
                            'robotcolorxy',
                            'robotface',
                            'robotqr',
                    ]);
                    this.onWorkspaceUpdate(dataXML)
                    this.workspace.clear()
                }
                
            }else if(event.data=='3'){
                 await this.restoreCategoriesToToolbox([
                    'MicrobitIcreate',
                    'MicrobiteIcreateP'

                ]);
                this.onWorkspaceUpdate(dataXML)
                this.workspace.clear()
                
            }

            if(!this.mode){
                // 创建初始块，不可删除
                const block = this.workspace.newBlock('event_when');
                console.log(block)
                block.initSvg();
                block.render();
                block.moveBy(200, 100);
        
                block.setDeletable(false);
                // block.setMovable(false);
            }
        })

        this.oneExtension=new BroadcastChannel('oneExtension')

        this.oneExtension.addEventListener('message',async (event)=>{

            // console.log('+++++++++++++++')
            // console.log(this.deletedCategories)
            // console.log(this.deletedCategoriesID)
            // console.log(dataXML)
            if(!this.mode){
                // 创建初始块，不可删除
                const block = this.workspace.newBlock('event_when');
                console.log(block)
                block.initSvg();
                block.render();
                block.moveBy(200, 100);
        
                block.setDeletable(false);
                // block.setMovable(false);
            }
            if(event.data==1){
                console.log('4444444444444')
                await this.restoreCategoriesToToolbox([
                        'robotimg',
                ]);
            }
        })

        // setInterval(()=>{

        //     if(currentModule!=getIsCode()){
        //         this.onWorkspaceUpdate(dataXML)
        //         this.workspace.clear()
        //         // this.removeCategoryFromToolbox('bricksmotor')
        //         currentModule=getIsCode()
        //         // console.log(this.getToolboxXML())
        //     }
            
        //     // console.log(this.getToolboxXML())
            
        // },1000)

        // setInterval(()=>{
        //     if(this.workspace){
        //         console.log(this.workspace.blockDB_)
        //         for(let child in this.workspace.blockDB_){
        //             console.log('-----------------------------------------')
        //             if(!getIsCode() && this.workspace.blockDB_[child].type.startsWith('robotmove')){
        
        //                 console.log('#####################')
        //                 console.log(this.workspace.blockDB_[child])
        //                 // this.workspace.blockDB_[child].setEnabled(false);
        //                 this.workspace.blockDB_[child].setColour(255,255,255)
        //                 this.workspace.blockDB_[child].setMovable(false)
        //             }
        //         }
        //     }
        // },2000)


        // setInterval(()=>{
            
        //     // 1. 获取工具箱 XML 并转换为 DOM 对象
        //     const toolboxXMLUpdate = this.getToolboxXML();  // 获取工具箱 XML
        //     const toolboxDomUpdate = this.ScratchBlocks.Xml.textToDom(toolboxXMLUpdate);  // 将 XML 字符串转换为 DOM

        //     // 2. 查找并修改特定类型的块
        //     const blocks = toolboxDomUpdate.getElementsByTagName('block');  // 获取所有的 <block> 元素

        //     // 假设你想禁用 type 为 'math_number' 的块
        //     for (let i = 0; i < blocks.length; i++) {
        //         const block = blocks[i];
                
        //         // 检查该块的 type 属性
        //         if (block.getAttribute('type') === 'robotmove_move') {

        //             // 修改 disabled 属性为 true
        //             console.log(block);
        //             block.setAttribute('disabled', true);
        //         }
        //     }

        //     // 3. 将修改后的 DOM 转回 XML 字符串
        //     const updatedToolboxXML = this.ScratchBlocks.Xml.domToText(toolboxDomUpdate);
        //     // console.log(updatedToolboxXML)

        //     // 4. 更新工具箱状态
        //     // this.props.updateToolboxState(updatedToolboxXML);
        //     this.updateToolbox()
        //     this.getToolboxXML()

            
        //     console.log('更新完成')
        // },2000)

        const channelMasterClose = new BroadcastChannel('master_close');
        channelMasterClose.addEventListener('message',async (event)=>{
            console.log(event.data)
            let close=event.data

            if(preClose[0] && !close[0]){
                await this.removeCategoryFromToolbox([
                    'bricksmotor',
                    'brickslight',
                    'brickssensors',
                    'brickstwomotor'
                ]);
                this.onWorkspaceUpdate(dataXML)
                this.workspace.clear()
            }else if(preClose[1] && !close[1]){


                await this.removeCategoryFromToolbox([
                    'robotmove',
                    'robotemote',
                    'robotshow',
                    'robotsound',
                    'robotactuator',
                    'robotsensors',
                    'robotimg',
                    'robotble',
                    // 'robotteachable',
                    'robotapriltag',
                    'robotcat',
                    'robotcolordete',
                    'robotcolorplace',
                    'robotcolorxy',
                    'robotface',
                    'robotgood',
                    'robotqr',
                    'robottraffic'
                    
                ]);
                console.log(getDeletedCate())
                this.onWorkspaceUpdate(dataXML)
                this.workspace.clear()
            }else if(preClose[2] && !close[2]){


                await this.removeCategoryFromToolbox([
                    'MicrobitIcreate',
                    'MicrobiteIcreateP'
                    
                ]);
                this.onWorkspaceUpdate(dataXML)
                this.workspace.clear()
            }
            preClose[0]=close[0]
            preClose[1]=close[1]
            preClose[2]=close[2]
        })
       

        // setInterval(()=>{
        //     fetch(`http://localhost:3000/get-close?timestamp=${new Date().getTime()}`,{
        //         method: 'GET'
        //     })
        //     .then(response => {
        //         if (response.ok) {
        //         return response.text();
        //         }
        //     })
        //     .then(async closeNum => {
        //         let close=JSON.parse(closeNum)
        //         // console.log('---------------')
        //         // console.log(close)
        //         // console.log(preClose)
        //         // console.log('---------------')

        //         if(preClose[0] && !close[0]){
        //             // await this.removeCategoryFromToolbox('bricksmotor')
        //             // await this.removeCategoryFromToolbox('bricksevent')
        //             // await this.removeCategoryFromToolbox('brickslight')
        //             // await this.removeCategoryFromToolbox('brickssensors')
        //             // await this.removeCategoryFromToolbox('brickstwomotor')
        //             await this.removeCategoryFromToolbox([
        //                 'bricksmotor',
        //                 'bricksevent',
        //                 'brickslight',
        //                 'brickssensors',
        //                 'brickstwomotor'
        //             ]);
        //         }else if(preClose[1] && !close[1]){
        //             // this.removeCategoryFromToolbox('robotevent')
        //             // this.removeCategoryFromToolbox('robotimg')
        //             // this.removeCategoryFromToolbox('robotmove')
        //             // this.removeCategoryFromToolbox('robotsensors')


        //             // console.log('++++++++++++++++++++++++++++++')


        //             await this.removeCategoryFromToolbox([
        //                 'robotevent',
        //                 'robotmove',
        //                 'robotemote',
        //                 'robotshow',
        //                 'robotsound',
        //                 'robotactuator',
        //                 'robotsensors',
        //                 'robotimg',
        //                 'robotwifi',
        //                 'robotble',
        //                 'robotteachable'
                        
                        
                        
                        
                        
                        
        //             ]);
        //         }
        //         preClose[0]=close[0]
        //         preClose[1]=close[1]
        //         // if(!this.arraysAreEqual(preClose,close)){
        //         //     console.log('不相等')
        //         //     console.log(typeof close[0])
        //         //     try{
        //         //         console.log(!close[0])
        //         //         if(!close[0]){
        //         //             console.log('执行了remove')
        //         //             this.removeCategoryFromToolbox('brIiiicksmotor')
        //         //             // this.removeCategoryFromToolbox('bricksevent')
        //         //             // this.removeCategoryFromToolbox('brickslight')
        //         //             // this.removeCategoryFromToolbox('brickssensors')
        //         //             // this.removeCategoryFromToolbox('brickstwomotor')
        //         //         }
        //         //         for(let i=0;i<close;i++){
        //         //             preClose[i]=close[i]
        //         //         }
        //         //     }catch(e){
        //         //         console.log(e)
        //         //     }

                    
        //         // }
        //     })
        //     .catch(error => {
        //         console.error('发生错误：', error);
        //     });
        // },2500)

        function checkPropertyInArray(arr, value) {
            // 检查数组是否为空
            if (!Array.isArray(arr) || arr.length === 0) {
                return false;
            }
        
            // 遍历数组
            for (let i = 0; i < arr.length; i++) {
                // 判断数组中的每个对象是否有该属性并且该属性的值是否匹配
                if (arr[i].topBlock === value) {
                    return true;  // 找到匹配的返回true
                }
            }
        
            return false;  // 没有找到匹配项，返回false
        }
        
        // setInterval(async ()=>{

        //     console.log(props.vm.runtime.threads)
        //     console.log(props.vm.runtime.startHats())
        //     // if(props.vm.runtime.threads.length>0 && props.vm.runtime.threads[0].topBlock=='|/}*p]k9u;H1ep?s`,_V'){
        //     //     isRunning=true
        //     // }else{

        //     // }
        //     console.log(checkPropertyInArray(props.vm.runtime.threads,'|/}*p]k9u;H1ep?s`,_V'))
        //     if(checkPropertyInArray(props.vm.runtime.threads,'|/}*p]k9u;H1ep?s`,_V')){
        //         isRunning=true
        //     }else{
        //         if(isRunning){

        //             if(getIsRobot()){
        //                 await fetch(`http://192.168.4.1:8082/flag?num=0`,{
        //                     method:'GET'
        //                 })
        //                     .then(response => {
        //                         if (!response.ok) {
        //                             throw new Error('Network response was not ok');
        //                         }
        //                         return response.text();
        //                     })
        //                     .then(data => {
        //                         console.log('Success:', data);
        //                         isRunning=false
        //                     })
        //                     .catch(error => {
        //                         console.error('There was an error with the fetch operation:', error);
        //                     });
        //             }

                    
        //         }
        //     }

            
        // },1000)

        


        
        
    }

    unindentCode(code) {
            // 将代码按行分割
            let lines = code.split('\n');
            
            // 使用map遍历每一行，先取消四个空格缩进，再检查并取消恰好两个空格的缩进
            const unindentedLines = lines.map(line => {
                // 记录原始行
                let originalLine = line;
                
                // 尝试取消四个空格的缩进
                let newLine = line.replace(/^\s{4}/, '');
                
                // 如果四个空格缩进已经被取消，检查是否有恰好两个空格的缩进
                if (newLine !== originalLine) {
                // 只有在四个空格缩进被取消后，才检查恰好两个空格的缩进
                newLine = newLine.replace(/^\s{2}(?! )/, '');
                }
                
                return newLine;
            });
      
        // 将处理后的行重新组合成一个字符串
        return unindentedLines.join('\n');
      }

      indentPythonFunctions(code) {
        const lines = code.split('\n');
        let result = [];
        let inFunction = false;
      
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
      
          if (line.trim().startsWith('def ')) {
            // 函数定义行
            inFunction = true;
            result.push(line); // 原样添加
            continue;
          }
      
          // 空行代表函数体结束
          if (line.trim() === '') {
            inFunction = false;
            result.push(line);
            continue;
          }
      
          // 缩进函数体（不在 def 行且处于函数中）
          if (inFunction) {
            result.push('    ' + line);
          } else {
            result.push(line);
          }
        }
      
        return result.join('\n');
      }
      

    
    
    


      arraysAreEqual(arr1, arr2) {
        // 如果数组长度不同，直接返回 false
        if (arr1.length !== arr2.length) {
            return false;
        }
    
        // 比较每个元素
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
    
        // 如果所有检查都通过，返回 true
        return true;
    }
      findSecondTopParent(block) {
        let parentBlock = block.getParent();
        let secondTopParent = null;
      
        if (!parentBlock) {
          return false; // No parent block found
        }
        if(parentBlock.type == 'control_forever'){
            return true
        }
      
        while (parentBlock.getParent()) {
          secondTopParent = parentBlock;
          parentBlock = parentBlock.getParent();
          if(parentBlock.type == 'control_forever'){
            return true
            }
        }
      
        return false;
      }
    
    workspaceToCode (event) {
        
        // console.log('--------------------')
        console.log(event.type)
        // console.log(this.workspace.blockDB_)
        if(event.type=='endDrag' || event.type=='change'){
            //绿旗能不能执行
            setBlock(false)
            let eventWhenBlocks = [];
            let code;
            // console.log(typeof this.workspace.blockDB_)
            // console.log(this.workspace.blockDB_)
    
            for(let child in this.workspace.blockDB_){
                // console.log(this.workspace.blockDB_[child].type)
                if(this.workspace.blockDB_[child].type.startsWith('bricks')){
                    setBlock(true)
                }

                if (this.workspace.blockDB_[child].type === 'event_when' && !this.mode) {
                    this.workspace.blockDB_[child].setDeletable(false);
                }

                // 查找 event_when 块
                if (this.workspace.blockDB_[child].type === 'event_when') {
                    eventWhenBlocks.push(this.workspace.blockDB_[child]);
                }

                
                // console.log(this.findSecondTopParent(this.workspace.blockDB_[child]))
                // if(this.findSecondTopParent(this.workspace.blockDB_[child])){
                //     if(this.workspace.blockDB_[child].type.startsWith('robotimg') && this.findSecondTopParent(this.workspace.blockDB_[child]).type=='control_forever'){
                //         this.workspace.blockDB_[child].dispose()
                //     }
                // }

                // if(this.workspace.blockDB_[child].type.startsWith('robotimg_c') && this.findSecondTopParent(this.workspace.blockDB_[child])){
                //     this.workspace.blockDB_[child].dispose()
                // }


                
            }


            if(!this.mode){
                // 超过一个时，删除多余的小绿旗块
                if (eventWhenBlocks.length > 1) {
                    for (let i = 1; i < eventWhenBlocks.length; i++) {
                        eventWhenBlocks[i].dispose();
                    }
                }

                if (eventWhenBlocks.length === 0) {
                    // 创建初始块，不可删除
                    const block = this.workspace.newBlock('event_when');
                    console.log(block)
                    block.initSvg();
                    block.render();
                    block.moveBy(200, 100);

                    block.setDeletable(false);
                }
            }else{
                if (eventWhenBlocks.length > 0) {
                    for (let i = 0; i < eventWhenBlocks.length; i++) {
                        eventWhenBlocks[i].dispose();
                    }
                }
            }
            

            try {
                const generatorName = getLan();
                // alert(this.ScratchBlocks.Python.workspaceToCode())
                code = this.ScratchBlocks[generatorName].workspaceToCode(this.workspace);
                
                // setCode(code)
                // console.log(code)
                // console.log(this.unindentCode(code))
                
                codeModule.setCode(this.indentPythonFunctions(this.unindentCode(code)))
                // console.log(code)
                
                // alert(getCode())
            } catch (e) {
                code = e.message;
                // console.log(code)
            }
    
            // const generatorName = 'Lua';
            // code = this.ScratchBlocks[generatorName].workspaceToCode(this.workspace);
            
            // codeModule.setCode(code)
            // console.log(code)
            
            // // alert(getCode())
            return code;
        }
        return ''
       
    }
    

    handleRuntimeStop=()=>{
        // console.log('程序停止')
    }

    componentDidMount () {

        if (this._mountedOnce) return;
        this._mountedOnce = true;

        console.log('BLOCKS componentDidMount__________________________________________')
        console.log('BLOCKS componentDidMount - id:', Math.random());
        this.ScratchBlocks = VMScratchBlocks(this.props.vm, this.props.useCatBlocks);
        this.ScratchBlocks.prompt = this.handlePromptStart;
        this.ScratchBlocks.statusButtonCallback = this.handleConnectionModalStart;
        this.ScratchBlocks.recordSoundCallback = this.handleOpenSoundRecorder;

        this.ScratchBlocks.FieldColourSlider.activateEyedropper_ = this.props.onActivateColorPicker;
        this.ScratchBlocks.Procedures.externalProcedureDefCallback = this.props.onActivateCustomProcedures;
        this.ScratchBlocks.ScratchMsgs.setLocale(this.props.locale);

        const Msg = this.ScratchBlocks.Msg;
        Msg.PROCEDURES_RETURN = this.props.intl.formatMessage(messages.PROCEDURES_RETURN, {
            v: '%1'
        });
        Msg.PROCEDURES_TO_REPORTER = this.props.intl.formatMessage(messages.PROCEDURES_TO_REPORTER);
        Msg.PROCEDURES_TO_STATEMENT = this.props.intl.formatMessage(messages.PROCEDURES_TO_STATEMENT);
        Msg.PROCEDURES_DOCS = this.props.intl.formatMessage(messages.PROCEDURES_DOCS);

        const workspaceConfig = defaultsDeep({},
            this.props.options,
            {
                rtl: this.props.isRtl,
                toolbox: this.props.toolboxXML,
                colours: this.props.theme.getBlockColors(),
                grid: {
                    colour: this.props.theme.getBlockColors().gridColor
                }
            },
            Blocks.defaultOptions
        );
        this.workspace = this.ScratchBlocks.inject(this.blocks, workspaceConfig);
        AddonHooks.blocklyWorkspace = this.workspace;

        this.workspace.addChangeListener(this.workspaceToCode);

       
        // Register buttons under new callback keys for creating variables,
        // lists, and procedures from extensions.

        const toolboxWorkspace = this.workspace.getFlyout().getWorkspace();

        const varListButtonCallback = type =>
            (() => this.ScratchBlocks.Variables.createVariable(this.workspace, null, type));
        const procButtonCallback = () => {
            this.ScratchBlocks.Procedures.createProcedureDefCallback_(this.workspace);
        };

        toolboxWorkspace.registerButtonCallback('MAKE_A_VARIABLE', varListButtonCallback(''));
        toolboxWorkspace.registerButtonCallback('MAKE_A_LIST', varListButtonCallback('list'));
        toolboxWorkspace.registerButtonCallback('MAKE_A_PROCEDURE', procButtonCallback);
        toolboxWorkspace.registerButtonCallback('EXTENSION_CALLBACK', block => {
            this.props.vm.handleExtensionButtonPress(block.callbackData_);
        });
        toolboxWorkspace.registerButtonCallback('OPEN_EXTENSION_DOCS', block => {
            const docsURI = block.callbackData_;
            const url = new URL(docsURI);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                window.open(docsURI, '_blank');
            }
        });
        toolboxWorkspace.registerButtonCallback('OPEN_RETURN_DOCS', () => {
            window.open('https://docs.turbowarp.org/return', '_blank');
        });

        // Store the xml of the toolbox that is actually rendered.
        // This is used in componentDidUpdate instead of prevProps, because
        // the xml can change while e.g. on the costumes tab.
        this._renderedToolboxXML = this.props.toolboxXML;

        // we actually never want the workspace to enable "refresh toolbox" - this basically re-renders the
        // entire toolbox every time we reset the workspace.  We call updateToolbox as a part of
        // componentDidUpdate so the toolbox will still correctly be updated
        this.setToolboxRefreshEnabled = this.workspace.setToolboxRefreshEnabled.bind(this.workspace);
        this.workspace.setToolboxRefreshEnabled = () => {
            this.setToolboxRefreshEnabled(false);
        };

        // @todo change this when blockly supports UI events
        addFunctionListener(this.workspace, 'translate', this.onWorkspaceMetricsChange);
        addFunctionListener(this.workspace, 'zoom', this.onWorkspaceMetricsChange);

        this.props.vm.setCompilerOptions({
            warpTimer: true
        });

        this.attachVM();
        // Only update blocks/vm locale when visible to avoid sizing issues
        // If locale changes while not visible it will get handled in didUpdate
        if (this.props.isVisible) {
            this.setLocale();
        }

        // tw: Handle when extensions are added when Blocks isn't mounted
        for (const category of this.props.vm.runtime._blockInfo) {
            this.handleExtensionAdded(category);
        }

        gentlyRequestPersistentStorage();


        // setInterval(()=>{
        //     console.log(this.deletedCategories)
        //     console.log(this.deletedCategoriesID)
        // },500)
        this.props.vm.runtime.on('PROJECT_RUN_STOP',()=>{
            // console.log('程序停止')
        })

    }
    shouldComponentUpdate (nextProps, nextState) {
        return (
            this.state.prompt !== nextState.prompt ||
            this.props.isVisible !== nextProps.isVisible ||
            this._renderedToolboxXML !== nextProps.toolboxXML ||
            this.props.extensionLibraryVisible !== nextProps.extensionLibraryVisible ||
            this.props.customProceduresVisible !== nextProps.customProceduresVisible ||
            this.props.locale !== nextProps.locale ||
            this.props.anyModalVisible !== nextProps.anyModalVisible ||
            this.props.stageSize !== nextProps.stageSize ||
            this.props.customStageSize !== nextProps.customStageSize
        );
    }
    componentDidUpdate (prevProps) {
        // If any modals are open, call hideChaff to close z-indexed field editors
        if (this.props.anyModalVisible && !prevProps.anyModalVisible) {
            this.ScratchBlocks.hideChaff();
        }

        // Only rerender the toolbox when the blocks are visible and the xml is
        // different from the previously rendered toolbox xml.
        // Do not check against prevProps.toolboxXML because that may not have been rendered.
        if (this.props.isVisible && this.props.toolboxXML !== this._renderedToolboxXML) {
            this.requestToolboxUpdate();
        }

        if (this.props.isVisible === prevProps.isVisible) {
            if (
                this.props.stageSize !== prevProps.stageSize ||
                this.props.customStageSize !== prevProps.customStageSize
            ) {
                // force workspace to redraw for the new stage size
                window.dispatchEvent(new Event('resize'));
            }
            return;
        }
        // @todo hack to resize blockly manually in case resize happened while hidden
        // @todo hack to reload the workspace due to gui bug #413
        if (this.props.isVisible) { // Scripts tab
            this.workspace.setVisible(true);
            if (prevProps.locale !== this.props.locale || this.props.locale !== this.props.vm.getLocale()) {
                // call setLocale if the locale has changed, or changed while the blocks were hidden.
                // vm.getLocale() will be out of sync if locale was changed while not visible
                this.setLocale();
            } else {
                this.props.vm.refreshWorkspace();
                this.requestToolboxUpdate();
            }

            window.dispatchEvent(new Event('resize'));
        } else {
            this.workspace.setVisible(false);
        }
    }
    componentWillUnmount () {

        console.log('Blocks unmounted');
        if (this.channelMode) {
            this.channelMode.close();
        }
        if (this.channel) {
            this.channel.close();
        }
        if (this.oneExtension) {
            this.oneExtension.close();
        }
        this.detachVM();
        this.unmounted = true;
        this.workspace.dispose();
        clearTimeout(this.toolboxUpdateTimeout);

        // Clear the flyout blocks so that they can be recreated on mount.
        this.props.vm.clearFlyoutBlocks();

        AddonHooks.blocklyWorkspace = null;
    }
    requestToolboxUpdate () {
        clearTimeout(this.toolboxUpdateTimeout);
        this.toolboxUpdateTimeout = setTimeout(() => {
            this.updateToolbox();
        }, 0);
    }
    setLocale () {
        this.ScratchBlocks.ScratchMsgs.setLocale(this.props.locale);
        this.props.vm.setLocale(this.props.locale, this.props.messages)
            .then(() => {
                if (this.unmounted) return;
                this.workspace.getFlyout().setRecyclingEnabled(false);
                this.props.vm.refreshWorkspace();
                this.requestToolboxUpdate();
                this.withToolboxUpdates(() => {
                    this.workspace.getFlyout().setRecyclingEnabled(true);
                });
            });
    }

    updateToolbox () {
        this.toolboxUpdateTimeout = false;

        const categoryId = this.workspace.toolbox_.getSelectedCategoryId();
        const offset = this.workspace.toolbox_.getCategoryScrollOffset();
        this.workspace.updateToolbox(this.props.toolboxXML);
        this._renderedToolboxXML = this.props.toolboxXML;

        // In order to catch any changes that mutate the toolbox during "normal runtime"
        // (variable changes/etc), re-enable toolbox refresh.
        // Using the setter function will rerender the entire toolbox which we just rendered.
        this.workspace.toolboxRefreshEnabled_ = true;

        const currentCategoryPos = this.workspace.toolbox_.getCategoryPositionById(categoryId);
        const currentCategoryLen = this.workspace.toolbox_.getCategoryLengthById(categoryId);
        if (offset < currentCategoryLen) {
            this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos + offset);
        } else {
            this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos);
        }

        const queue = this.toolboxUpdateQueue;
        this.toolboxUpdateQueue = [];
        queue.forEach(fn => fn());
    }

    withToolboxUpdates (fn) {
        // if there is a queued toolbox update, we need to wait
        if (this.toolboxUpdateTimeout) {
            this.toolboxUpdateQueue.push(fn);
        } else {
            fn();
        }
    }

    attachVM () {
        this.workspace.addChangeListener(this.props.vm.blockListener);
        this.flyoutWorkspace = this.workspace
            .getFlyout()
            .getWorkspace();
        this.flyoutWorkspace.addChangeListener(this.props.vm.flyoutBlockListener);
        this.flyoutWorkspace.addChangeListener(this.props.vm.monitorBlockListener);
        this.props.vm.addListener('SCRIPT_GLOW_ON', this.onScriptGlowOn);
        this.props.vm.addListener('SCRIPT_GLOW_OFF', this.onScriptGlowOff);
        this.props.vm.addListener('BLOCK_GLOW_ON', this.onBlockGlowOn);
        this.props.vm.addListener('BLOCK_GLOW_OFF', this.onBlockGlowOff);
        this.props.vm.addListener('VISUAL_REPORT', this.onVisualReport);
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.addListener('targetsUpdate', this.onTargetsUpdate);
        this.props.vm.addListener('MONITORS_UPDATE', this.handleMonitorsUpdate);
        this.props.vm.addListener('EXTENSION_ADDED', this.handleExtensionAdded);
        this.props.vm.addListener('BLOCKSINFO_UPDATE', this.handleBlocksInfoUpdate);
        this.props.vm.addListener('PERIPHERAL_CONNECTED', this.handleStatusButtonUpdate);
        this.props.vm.addListener('PERIPHERAL_DISCONNECTED', this.handleStatusButtonUpdate);
    }
    detachVM () {
        this.props.vm.removeListener('SCRIPT_GLOW_ON', this.onScriptGlowOn);
        this.props.vm.removeListener('SCRIPT_GLOW_OFF', this.onScriptGlowOff);
        this.props.vm.removeListener('BLOCK_GLOW_ON', this.onBlockGlowOn);
        this.props.vm.removeListener('BLOCK_GLOW_OFF', this.onBlockGlowOff);
        this.props.vm.removeListener('VISUAL_REPORT', this.onVisualReport);
        this.props.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.removeListener('targetsUpdate', this.onTargetsUpdate);
        this.props.vm.removeListener('MONITORS_UPDATE', this.handleMonitorsUpdate);
        this.props.vm.removeListener('EXTENSION_ADDED', this.handleExtensionAdded);
        this.props.vm.removeListener('BLOCKSINFO_UPDATE', this.handleBlocksInfoUpdate);
        this.props.vm.removeListener('PERIPHERAL_CONNECTED', this.handleStatusButtonUpdate);
        this.props.vm.removeListener('PERIPHERAL_DISCONNECTED', this.handleStatusButtonUpdate);
    }

    updateToolboxBlockValue (id, value) {
        this.withToolboxUpdates(() => {
            const block = this.workspace
                .getFlyout()
                .getWorkspace()
                .getBlockById(id);
            if (block) {
                block.inputList[0].fieldRow[0].setValue(value);
            }
        });
    }

    onTargetsUpdate () {
        if (this.props.vm.editingTarget && this.workspace.getFlyout()) {
            ['glide', 'move', 'set'].forEach(prefix => {
                this.updateToolboxBlockValue(`${prefix}x`, Math.round(this.props.vm.editingTarget.x).toString());
                this.updateToolboxBlockValue(`${prefix}y`, Math.round(this.props.vm.editingTarget.y).toString());
            });
        }
    }
    onWorkspaceMetricsChange () {
        const target = this.props.vm.editingTarget;
        if (target && target.id) {
            // Dispatch updateMetrics later, since onWorkspaceMetricsChange may be (very indirectly)
            // called from a reducer, i.e. when you create a custom procedure.
            // TODO: Is this a vehement hack?
            setTimeout(() => {
                this.props.updateMetrics({
                    targetID: target.id,
                    scrollX: this.workspace.scrollX,
                    scrollY: this.workspace.scrollY,
                    scale: this.workspace.scale
                });
            }, 0);
        }
    }
    onScriptGlowOn (data) {
        this.workspace.glowStack(data.id, true);
    }
    onScriptGlowOff (data) {
        this.workspace.glowStack(data.id, false);
    }
    onBlockGlowOn (data) {
        this.workspace.glowBlock(data.id, true);
    }
    onBlockGlowOff (data) {
        this.workspace.glowBlock(data.id, false);
    }
    onVisualReport (data) {
        this.workspace.reportValue(data.id, data.value);
    }




    createWatchedArray(arrName = 'watchedArray') {
        const handler = {
            get(target, prop, receiver) {
                const value = Reflect.get(target, prop, receiver);
                if (typeof value === 'function') {
                    return function (...args) {
                        const now = new Date().toISOString();
                        const result = value.apply(target, args);
                        console.log(`[${arrName}] 修改时间: ${now}`);
                        console.log(`[${arrName}] 方法调用: ${prop}`);
                        console.log(`[${arrName}] 参数:`, args);
                        // console.trace(`[${arrName}] 修改堆栈:`);
                        console.log(`[${arrName}] 当前值:`, [...target]); // ✅ 放在这里
                        return result;
                    };
                }
                return value;
            },
            set(target, prop, value, receiver) {
                const now = new Date().toISOString();
                console.log(`[${arrName}] 修改时间: ${now}`);
                console.log(`[${arrName}] 属性设置: target[${prop}] =`, value);
                // console.trace(`[${arrName}] 修改堆栈:`);
                console.log(`[${arrName}] 当前值:`, [...target]); // ✅ 放在这里
                return Reflect.set(target, prop, value, receiver);
            }
        };
        return new Proxy([], handler);
    }



    getToolboxXML () {
        // console.log('****************************************')
        // Use try/catch because this requires digging pretty deep into the VM
        // Code inside intentionally ignores several error situations (no stage, etc.)
        // Because they would get caught by this try/catch
        // console.log('执行了')
        try {
            console.log(getDelete())
            // console.log(this.deletedCategories)
            // console.log(this.deletedCategoriesID)
            let {editingTarget: target, runtime} = this.props.vm;
            const stage = runtime.getTargetForStage();
            if (!target) target = stage; // If no editingTarget, use the stage

            const stageCostumes = stage.getCostumes();
            const targetCostumes = target.getCostumes();
            const targetSounds = target.getSounds();
            let dynamicBlocksXML = injectExtensionCategoryTheme(
                this.props.vm.runtime.getBlocksXML(target),
                this.props.theme
            );
            // console.log(dynamicBlocksXML)

            // 过滤掉被删除的类别
            // console.log(this.deletedCategories)



            try{
                dynamicBlocksXML = dynamicBlocksXML.filter(category => {
                    // console.log(category.id)
                    return !getDeletedCate().includes(category.id); // 保留未删除的类别
                });

                // 过滤掉需要隐藏的块类型
                dynamicBlocksXML = dynamicBlocksXML.map(category => {
                    // 解析 category.xml 为 DOM 对象
                    const parser = new DOMParser();
                    const categoryDom = parser.parseFromString(category.xml, 'application/xml');
                    
                    // 获取所有的 block 元素
                    const blocks = categoryDom.getElementsByTagName('block');
                    
                    
                     // 倒序遍历并删除匹配的 block
                    for (let i = blocks.length - 1; i >= 0; i--) {
                        const block = blocks[i];
                        if (getHiddenBlocks().includes(block.getAttribute('type'))) {
                            // console.log(block.getAttribute('type') + ' 已被删除');
                            block.remove();
                        }
                    }


                    
                    
                    // 将修改后的 DOM 转回 XML 字符串
                    category.xml = new XMLSerializer().serializeToString(categoryDom.documentElement);

                    return category;
                });

                // console.log(this.deletedCategoriesID)
                // console.log(this.hiddenBlocksTypes)
            }catch(e){
                console.log(e)
            }

            // console.log(dynamicBlocksXML)
            

            // console.log(dynamicBlocksXML)

            return makeToolboxXML(false, target.isStage, target.id, dynamicBlocksXML,
                targetCostumes[targetCostumes.length - 1].name,
                stageCostumes[stageCostumes.length - 1].name,
                targetSounds.length > 0 ? targetSounds[targetSounds.length - 1].name : '',
                this.props.theme.getBlockColors()
            );
        } catch {
            return null;
        }
    }


    // async removeCategoryFromToolbox(categoryId) {
    //     try {
    //         // Get the current toolbox XML
    //         const toolboxXML = this.getToolboxXML();
    //         const toolboxDom = this.ScratchBlocks.Xml.textToDom(toolboxXML);
            
    //         // Find and remove the category by its ID
    //         const categories = toolboxDom.getElementsByTagName('category');
    //         for (let category of categories) {
    //             if (category.getAttribute('id') === categoryId) {
    //                 console.log(category)
    //                 this.deletedCategories.push(category);
    //                 await toolboxDom.removeChild(category);
    //             }
    //         }
            
    //         // Convert the DOM back to XML and update the toolbox
    //         const updatedToolboxXML = this.ScratchBlocks.Xml.domToText(toolboxDom);
            
    //         // Update the toolbox state
    //         await this.props.updateToolboxState(updatedToolboxXML);
    
    //     } catch (error) {
    //         console.error('Error removing category from toolbox', error);
    //     }
    // }


    async removeCategoryFromToolbox(categoriesToRemove) {
        console.log('执行了移除函数')
        const runtime =this.props.vm.runtime
        // console.log(runtime)
        try {
            const toolboxXML = this.getToolboxXML();
            const toolboxDom = this.ScratchBlocks.Xml.textToDom(toolboxXML);
    
            const categories = toolboxDom.getElementsByTagName('category');
            
            // Collect categories to remove
            for (let category of categories) {
                if (categoriesToRemove.includes(category.getAttribute('id'))) {
                    setDeletedCate(category);
                    setDeletedCate(category.getAttribute('id'))
                }
            }
    
            // setDelete(this.deletedCategoriesID)
            // Remove all matched categories
            // this.deletedCategories.forEach(category => {
            //     toolboxDom.removeChild(category);
            // });

            // const toolboxXMLUpdate = this.getToolboxXML();
            // const toolboxDomUpdate = this.ScratchBlocks.Xml.textToDom(toolboxXMLUpdate);
    
            
            // const updatedToolboxXML = this.ScratchBlocks.Xml.domToText(toolboxDomUpdate);
            // // console.log(updatedToolboxXML)
            // this.props.updateToolboxState(updatedToolboxXML);


            // console.log(this.getToolboxXML())
    
        } catch (error) {
            console.error('Error removing categories from toolbox', error);
        }
    }


    // restoreCategoryToToolbox(categoryId) {
    //     try {
    //         // Get the current toolbox XML
    //         const toolboxXML = this.getToolboxXML();
    //         const toolboxDom = this.ScratchBlocks.Xml.textToDom(toolboxXML);

    //         // Find the saved category based on ID
    //         const categoryToRestore = this.deletedCategories.find(category => category.getAttribute('id') === categoryId);

    //         if (categoryToRestore) {
    //             // If the category exists in the deletedCategories array, restore it
    //             toolboxDom.appendChild(categoryToRestore);

    //             console.log(`Category ${categoryId} restored to toolbox.`);
    //             // Convert the DOM back to XML and update the toolbox
    //             const updatedToolboxXML = this.ScratchBlocks.Xml.domToText(toolboxDom);
    //             // Update the toolbox state
    //             this.props.updateToolboxState(updatedToolboxXML);
    //         } else {
    //             console.error(`Category with id ${categoryId} not found in deleted categories.`);
    //         }
    //     } catch (error) {
    //         console.error('Error restoring category to toolbox', error);
    //     }
    // }

    async restoreCategoriesToToolbox(categoriesToRestore) {
    console.log('执行了恢复函数')
        try {
            
    
            // this.deletedCategoriesID = this.deletedCategoriesID.filter(item => !categoriesToRestore.includes(item));
            // this.deletedCategories = this.deletedCategories.filter(item => !categoriesToRestore.includes(item.id));

            // console.log('head:'+this.deletedCategoriesID)
            for (let i = getDeletedCate().length - 1; i >= 0; i--) {
                if (categoriesToRestore.includes(getDeletedCate()[i])) {
                    // console.log('删除了'+this.deletedCategoriesID[i])
                    delCategro(i, 1);
                }
                // setDelete(this.deletedCategoriesID)
            }
            // console.log(categoriesToRestore)
            // console.log(this.deletedCategoriesID)
            

            // for (let i = this.deletedCategories.length - 1; i >= 0; i--) {
            //     if (categoriesToRestore.includes(this.deletedCategories[i].id)) {
            //         this.deletedCategories.splice(i, 1);
            //     }
            // }

            // console.log(this.deletedCategoriesID)

            // // 获取当前工具箱的 XML
            // const toolboxXML = this.getToolboxXML();
            // // console.log(toolboxXML)
            // const toolboxDom = this.ScratchBlocks.Xml.textToDom(toolboxXML);


            // 遍历传入的类别 ID 列表
            // categoriesToRestore.forEach(categoryId => {
            //     // 根据 ID 查找已删除的类别
            //     const categoryToRestore = this.deletedCategories.find(category => category.getAttribute('id') === categoryId);
    
            //     if (categoryToRestore) {
            //         // 恢复该类别
            //         toolboxDom.appendChild(categoryToRestore);
            //         console.log(`Category ${categoryId} restored to toolbox.`);
            //     } else {
            //         console.error(`Category with id ${categoryId} not found in deleted categories.`);
            //     }
            // });
    
            // // 将修改后的 DOM 转回 XML，并更新工具箱
            // const updatedToolboxXML = this.ScratchBlocks.Xml.domToText(toolboxDom);
            // this.props.updateToolboxState(updatedToolboxXML);
    
        } catch (error) {
            console.error('Error restoring categories to toolbox', error);
        }
    }

    onWorkspaceUpdate (data) {
         
        // console.log(data)
        // console.log('updata workspace')
        dataXML=data
        // When we change sprites, update the toolbox to have the new sprite's blocks
        const toolboxXML = this.getToolboxXML();
        if (toolboxXML) {
             // 小技巧：加个没意义的注释防止缓存
            const modifiedXML = toolboxXML.replace('</xml>', `<!--force update--> </xml>`);
            // console.log(modifiedXML)
            this.props.updateToolboxState(modifiedXML);
            // this.props.updateToolboxState(toolboxXML);
        }

        if (this.props.vm.editingTarget && !this.props.workspaceMetrics.targets[this.props.vm.editingTarget.id]) {
            this.onWorkspaceMetricsChange();
        }

        // Remove and reattach the workspace listener (but allow flyout events)
        this.workspace.removeChangeListener(this.props.vm.blockListener);
        const dom = this.ScratchBlocks.Xml.textToDom(data.xml);
        try {
            this.ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, this.workspace);
        } catch (error) {
            // The workspace is likely incomplete. What did update should be
            // functional.
            //
            // Instead of throwing the error, by logging it and continuing as
            // normal lets the other workspace update processes complete in the
            // gui and vm, which lets the vm run even if the workspace is
            // incomplete. Throwing the error would keep things like setting the
            // correct editing target from happening which can interfere with
            // some blocks and processes in the vm.
            if (error.message) {
                error.message = `Workspace Update Error: ${error.message}`;
            }
            log.error(error);
        }
        this.workspace.addChangeListener(this.props.vm.blockListener);

        if (this.props.vm.editingTarget && this.props.workspaceMetrics.targets[this.props.vm.editingTarget.id]) {
            const {scrollX, scrollY, scale} = this.props.workspaceMetrics.targets[this.props.vm.editingTarget.id];
            this.workspace.scrollX = scrollX;
            this.workspace.scrollY = scrollY;
            this.workspace.scale = scale;
            this.workspace.resize();
        }

        // Clear the undo state of the workspace since this is a
        // fresh workspace and we don't want any changes made to another sprites
        // workspace to be 'undone' here.
        this.workspace.clearUndo();
        // console.log('11111111111111111111')
    }
    handleMonitorsUpdate (monitors) {
        // Update the checkboxes of the relevant monitors.
        // TODO: What about monitors that have fields? See todo in scratch-vm blocks.js changeBlock:
        // https://github.com/LLK/scratch-vm/blob/2373f9483edaf705f11d62662f7bb2a57fbb5e28/src/engine/blocks.js#L569-L576
        const flyout = this.workspace.getFlyout();
        for (const monitor of monitors.values()) {
            const blockId = monitor.get('id');
            const isVisible = monitor.get('visible');
            flyout.setCheckboxState(blockId, isVisible);
            // We also need to update the isMonitored flag for this block on the VM, since it's used to determine
            // whether the checkbox is activated or not when the checkbox is re-displayed (e.g. local variables/blocks
            // when switching between sprites).
            const block = this.props.vm.runtime.monitorBlocks.getBlock(blockId);
            if (block) {
                block.isMonitored = isVisible;
            }
        }
    }
    handleExtensionAdded (categoryInfo) {
        const defineBlocks = blockInfoArray => {
            if (blockInfoArray && blockInfoArray.length > 0) {
                const staticBlocksJson = [];
                const dynamicBlocksInfo = [];
                blockInfoArray.forEach(blockInfo => {
                    if (blockInfo.info && blockInfo.info.isDynamic) {
                        dynamicBlocksInfo.push(blockInfo);
                    } else if (blockInfo.json) {
                        staticBlocksJson.push(injectExtensionBlockTheme(blockInfo.json, this.props.theme));
                    }
                    // otherwise it's a non-block entry such as '---'
                });

                this.ScratchBlocks.defineBlocksWithJsonArray(staticBlocksJson);
                dynamicBlocksInfo.forEach(blockInfo => {
                    // This is creating the block factory / constructor -- NOT a specific instance of the block.
                    // The factory should only know static info about the block: the category info and the opcode.
                    // Anything else will be picked up from the XML attached to the block instance.
                    const extendedOpcode = `${categoryInfo.id}_${blockInfo.info.opcode}`;
                    const blockDefinition = defineDynamicBlock(
                        this.ScratchBlocks,
                        categoryInfo,
                        blockInfo,
                        extendedOpcode,
                        this.props.theme
                    );
                    this.ScratchBlocks.Blocks[extendedOpcode] = blockDefinition;
                });
            }
        };

        // scratch-blocks implements a menu or custom field as a special kind of block ("shadow" block)
        // these actually define blocks and MUST run regardless of the UI state
        defineBlocks(
            Object.getOwnPropertyNames(categoryInfo.customFieldTypes)
                .map(fieldTypeName => categoryInfo.customFieldTypes[fieldTypeName].scratchBlocksDefinition));
        defineBlocks(categoryInfo.menus);
        defineBlocks(categoryInfo.blocks);

        // Update the toolbox with new blocks if possible
        const toolboxXML = this.getToolboxXML();
        if (toolboxXML) {
            this.props.updateToolboxState(toolboxXML);
        }
    }
    handleBlocksInfoUpdate (categoryInfo) {
        // @todo Later we should replace this to avoid all the warnings from redefining blocks.
        this.handleExtensionAdded(categoryInfo);
    }
    handleCategorySelected (categoryId) {
        const extension = extensionData.find(ext => ext.extensionId === categoryId);
        if (extension && extension.launchPeripheralConnectionFlow) {
            this.handleConnectionModalStart(categoryId);
        }

        this.withToolboxUpdates(() => {
            this.workspace.toolbox_.setSelectedCategoryById(categoryId);
        });
    }
    setBlocks (blocks) {
        this.blocks = blocks;
    }
    handlePromptStart (message, defaultValue, callback, optTitle, optVarType) {
        const p = {prompt: {callback, message, defaultValue}};
        p.prompt.title = optTitle ? optTitle :
            this.ScratchBlocks.Msg.VARIABLE_MODAL_TITLE;
        p.prompt.varType = typeof optVarType === 'string' ?
            optVarType : this.ScratchBlocks.SCALAR_VARIABLE_TYPE;
        p.prompt.showVariableOptions = // This flag means that we should show variable/list options about scope
            optVarType !== this.ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE &&
            p.prompt.title !== this.ScratchBlocks.Msg.RENAME_VARIABLE_MODAL_TITLE &&
            p.prompt.title !== this.ScratchBlocks.Msg.RENAME_LIST_MODAL_TITLE;
        p.prompt.showCloudOption = (optVarType === this.ScratchBlocks.SCALAR_VARIABLE_TYPE) && this.props.canUseCloud;
        this.setState(p);
    }
    handleConnectionModalStart (extensionId) {
        this.props.onOpenConnectionModal(extensionId);
    }
    handleStatusButtonUpdate () {
        this.ScratchBlocks.refreshStatusButtons(this.workspace);
    }
    handleOpenSoundRecorder () {
        this.props.onOpenSoundRecorder();
    }

    /*
     * Pass along information about proposed name and variable options (scope and isCloud)
     * and additional potentially conflicting variable names from the VM
     * to the variable validation prompt callback used in scratch-blocks.
     */
    handlePromptCallback (input, variableOptions) {
        this.state.prompt.callback(
            input,
            this.props.vm.runtime.getAllVarNamesOfType(this.state.prompt.varType),
            variableOptions);
        this.handlePromptClose();
    }
    handlePromptClose () {
        this.setState({prompt: null});
    }
    handleCustomProceduresClose (data) {
        this.props.onRequestCloseCustomProcedures(data);
        const ws = this.workspace;
        ws.refreshToolboxSelection_();
        ws.toolbox_.scrollToCategoryById('myBlocks');
    }
    handleDrop (dragInfo) {
        fetch(dragInfo.payload.bodyUrl)
            .then(response => response.json())
            .then(payload => {
                // based on https://github.com/ScratchAddons/ScratchAddons/pull/7028
                const topBlock = findTopBlock(payload);
                if (topBlock) {
                    const metrics = this.props.workspaceMetrics.targets[this.props.vm.editingTarget.id];
                    if (metrics) {
                        const {x, y} = dragInfo.currentOffset;
                        const {left, right} = this.workspace.scrollbar.hScroll.outerSvg_.getBoundingClientRect();
                        const {top} = this.workspace.scrollbar.vScroll.outerSvg_.getBoundingClientRect();
                        topBlock.x = (
                            this.props.isRtl ? metrics.scrollX - x + right : -metrics.scrollX + x - left
                        ) / metrics.scale;
                        topBlock.y = (-metrics.scrollY - top + y) / metrics.scale;
                    }
                }
                return this.props.vm.shareBlocksToTarget(payload, this.props.vm.editingTarget.id);
            })
            .then(() => {
                this.props.vm.refreshWorkspace();
                this.updateToolbox(); // To show new variables/custom blocks
            });
    }
    handleEnableProcedureReturns () {
        this.workspace.enableProcedureReturns();
        this.requestToolboxUpdate();
    }
    render () {
        /* eslint-disable no-unused-vars */
        const {
            anyModalVisible,
            canUseCloud,
            customStageSize,
            customProceduresVisible,
            extensionLibraryVisible,
            options,
            stageSize,
            vm,
            isRtl,
            isVisible,
            onActivateColorPicker,
            onOpenConnectionModal,
            onOpenSoundRecorder,
            onOpenCustomExtensionModal,
            reduxOnOpenCustomExtensionModal,
            updateToolboxState,
            onActivateCustomProcedures,
            onRequestCloseExtensionLibrary,
            onRequestCloseCustomProcedures,
            toolboxXML,
            updateMetrics: updateMetricsProp,
            useCatBlocks,
            workspaceMetrics,
            ...props
        } = this.props;
        /* eslint-enable no-unused-vars */
        return (
            <React.Fragment>
                <DroppableBlocks
                    componentRef={this.setBlocks}
                    onDrop={this.handleDrop}
                    {...props}
                />
                {this.state.prompt ? (
                    <Prompt
                        defaultValue={this.state.prompt.defaultValue}
                        isStage={vm.runtime.getEditingTarget().isStage}
                        showListMessage={this.state.prompt.varType === this.ScratchBlocks.LIST_VARIABLE_TYPE}
                        label={this.state.prompt.message}
                        showCloudOption={this.state.prompt.showCloudOption}
                        showVariableOptions={this.state.prompt.showVariableOptions}
                        title={this.state.prompt.title}
                        vm={vm}
                        onCancel={this.handlePromptClose}
                        onOk={this.handlePromptCallback}
                    />
                ) : null}
                {extensionLibraryVisible ? (
                    <ExtensionLibrary
                        vm={vm}
                        onCategorySelected={this.handleCategorySelected}
                        onEnableProcedureReturns={this.handleEnableProcedureReturns}
                        onRequestClose={onRequestCloseExtensionLibrary}
                        onOpenCustomExtensionModal={onOpenCustomExtensionModal || reduxOnOpenCustomExtensionModal}
                    />
                ) : null}
                {customProceduresVisible ? (
                    <CustomProcedures
                        options={{
                            media: options.media
                        }}
                        onRequestClose={this.handleCustomProceduresClose}
                    />
                ) : null}
            </React.Fragment>
        );
    }
}

Blocks.propTypes = {
    intl: intlShape,
    anyModalVisible: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    customProceduresVisible: PropTypes.bool,
    extensionLibraryVisible: PropTypes.bool,
    isRtl: PropTypes.bool,
    isVisible: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    messages: PropTypes.objectOf(PropTypes.string),
    onActivateColorPicker: PropTypes.func,
    onActivateCustomProcedures: PropTypes.func,
    onOpenConnectionModal: PropTypes.func,
    onOpenSoundRecorder: PropTypes.func,
    onOpenCustomExtensionModal: PropTypes.func,
    reduxOnOpenCustomExtensionModal: PropTypes.func,
    onRequestCloseCustomProcedures: PropTypes.func,
    onRequestCloseExtensionLibrary: PropTypes.func,
    options: PropTypes.shape({
        media: PropTypes.string,
        zoom: PropTypes.shape({
            controls: PropTypes.bool,
            wheel: PropTypes.bool,
            startScale: PropTypes.number
        }),
        comments: PropTypes.bool,
        collapse: PropTypes.bool
    }),
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    theme: PropTypes.instanceOf(Theme),
    toolboxXML: PropTypes.string,
    updateMetrics: PropTypes.func,
    updateToolboxState: PropTypes.func,
    useCatBlocks: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
    workspaceMetrics: PropTypes.shape({
        targets: PropTypes.objectOf(PropTypes.object)
    })
};

Blocks.defaultOptions = {
    zoom: {
        controls: true,
        wheel: true,
        startScale: BLOCKS_DEFAULT_SCALE
    },
    grid: {
        spacing: 40,
        length: 2,
        colour: '#ddd'
    },
    comments: true,
    collapse: false,
    sounds: false
};

Blocks.defaultProps = {
    isVisible: true,
    options: Blocks.defaultOptions,
    theme: Theme.light
};

const mapStateToProps = state => ({
    anyModalVisible: (
        Object.keys(state.scratchGui.modals).some(key => state.scratchGui.modals[key]) ||
        state.scratchGui.mode.isFullScreen
    ),
    customStageSize: state.scratchGui.customStageSize,
    extensionLibraryVisible: state.scratchGui.modals.extensionLibrary,
    isRtl: state.locales.isRtl,
    locale: state.locales.locale,
    messages: state.locales.messages,
    toolboxXML: state.scratchGui.toolbox.toolboxXML,
    customProceduresVisible: state.scratchGui.customProcedures.active,
    workspaceMetrics: state.scratchGui.workspaceMetrics,
    useCatBlocks: isTimeTravel2020(state)
});

const mapDispatchToProps = dispatch => ({
    onActivateColorPicker: callback => dispatch(activateColorPicker(callback)),
    onActivateCustomProcedures: (data, callback) => dispatch(activateCustomProcedures(data, callback)),
    onOpenConnectionModal: id => {
        dispatch(setConnectionModalExtensionId(id));
        dispatch(openConnectionModal());
    },
    onOpenSoundRecorder: () => {
        dispatch(activateTab(SOUNDS_TAB_INDEX));
        dispatch(openSoundRecorder());
    },
    reduxOnOpenCustomExtensionModal: () => dispatch(openCustomExtensionModal()),
    onRequestCloseExtensionLibrary: () => {
        dispatch(closeExtensionLibrary());
    },
    onRequestCloseCustomProcedures: data => {
        dispatch(deactivateCustomProcedures(data));
    },
    updateToolboxState: toolboxXML => {
        dispatch(updateToolbox(toolboxXML));
    },
    updateMetrics: metrics => {
        dispatch(updateMetrics(metrics));
    }
});




export default injectIntl(errorBoundaryHOC('Blocks')(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LoadScratchBlocksHOC(Blocks))
));
