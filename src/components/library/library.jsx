import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React, { Children } from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import LibraryItem from '../../containers/library-item.jsx';
import Modal from '../../containers/modal.jsx';
import Divider from '../divider/divider.jsx';
import Filter from '../filter/filter.jsx';
import TagButton from '../../containers/tag-button.jsx';
import Spinner from '../spinner/spinner.jsx';
import Separator from '../tw-extension-separator/separator.jsx';
import RemovedTrademarks from '../tw-removed-trademarks/removed-trademarks.jsx';
import {APP_NAME} from '../../lib/brand.js';
import {setContent} from '../../../../../utils/updataExtension.js'
import styles from './library.css';
// import GUIComponent from '../gui/gui.jsx'
import { getIsMaster,setIsMaster,addLoadExtension,delLoadExtension,getLoadExtension,getAllLoaded,setAllLoaded } from 'scratch-gui/src/components/utils/utils.js';
import axios from 'axios'

import { setIsLoad } from 'scratch-gui/src/components/utils/utils.js';


// axios.defaults.baseURL = 'http://192.168.4.1:8080'


const messages = defineMessages({
    filterPlaceholder: {
        id: 'gui.library.filterPlaceholder',
        defaultMessage: 'Search',
        description: 'Placeholder text for library search field'
    },
    allTag: {
        id: 'gui.library.allTag',
        defaultMessage: 'All',
        description: 'Label for library tag to revert to all items after filtering by tag.'
    },
    mainCon: {
        id: 'gui.library.mainCon',
        defaultMessage: 'ICreateCode',
        description: 'Label for library tag to revert to all items after filtering by tag.'
    }
});


const HIDDEN_EXTENSIONS = [
    'bricksmotor',
    'brickstwomotor',
    'brickslight',
    'brickssensors',
    'bricksevent',
    'robotmove',
    'robotsensors',
    'robotevent',
    'robotwifi',
    'robotemote',
    'robotshow',
    'robotsound',
    'robotactuator',
    'robotble',
    'MicrobitIcreate',
    'MicrobiteIcreateP'

];


const ALL_TAG = {tag: 'all', intlLabel: messages.allTag};
const MAIN_TAG={tag: 'main', intlLabel: messages.mainCon};
const tagListPrefix = [ALL_TAG,MAIN_TAG];

//防抖
let debounceTimer = null;
const keyPressTimestamps = {}; // 用于存储每个按键的上一次按下时间
const QUICK_PRESS_THRESHOLD = 500; // 定义快速按下的时间阈值（毫秒）
let allKeyPress=Date.now()
let allKeyUp=Date.now()
const pressedKeys = new Set();  // 用于记录当前按下的键
let preKey=null
let preSpeed=null
const keyState = {
    W: false, // W键是否按下
    A: false, // A键是否按下
    S: false, // S键是否按下
    D: false,  // D键是否按下
    R: false,  // R键是否按下
    B: false,
    C: false,
    E: false,
    F: false,
    G: false,
    H: false,
    I: false,
    J: false,
    K: false,
    L: false,
    M: false,
    N: false,
    O: false,
    P: false,
    Q: false,
    T: false,
    U: false,
    V: false,
    X: false,
    Y: false,
    Z: false,
};
class LibraryComponent extends React.Component {
    constructor (props) {
        super(props);
        this.oneExtension=new BroadcastChannel('oneExtension')
        // console.log('执行了')
        bindAll(this, [
            'handleClose',
            'handleFilterChange',
            'handleFilterClear',
            'handleMouseEnter',
            'handleMouseLeave',
            'handlePlayingEnd',
            'handleSelect',
            'handleFavorite',
            'handleTagClick',
            'setFilteredDataRef',
            'handleTest',
            'handleOnline',
            'sendMove',
            'sort'
        ]);
        const favorites = this.readFavoritesFromStorage();
        // this.allLoaded=[] //已经添加过的扩展
        this.state = {
            playingItem: null,
            filterQuery: '',
            selectedTag: ALL_TAG.tag,
            canDisplay: false,
            favorites,
            initialFavorites: favorites
        };
        this.channelLoadExtension = new BroadcastChannel('loadExtension')
        this.channelClose = new BroadcastChannel('closePage')
        this.channelClose.addEventListener('message',(event)=>{
            this.handleClose()
        })


        this.channelMasterClose = new BroadcastChannel('master_close')
        this.channelMasterClose.addEventListener('message',(event)=>{
            if(!event.data[1]){
                delLoadExtension('robotimg')
                delLoadExtension('robotapriltag')
                delLoadExtension('robotcat')
                delLoadExtension('robotcolordete')
                delLoadExtension('robotcolorplace')
                delLoadExtension('robotcolorxy')
                delLoadExtension('robotface')
                // delLoadExtension('robotgood')
                delLoadExtension('robotqr')
                delLoadExtension('robottraffic')
            }
            
        })
    }
    
    
    componentDidMount () {

        
        // Rendering all the items in the library can take a bit, so we'll always
        // show one frame with a loading spinner.
        const channelLoad = new BroadcastChannel('isLoading');
        setTimeout(() => {
            this.setState({
                canDisplay: true
            });
        });
        setTimeout(()=>{
            fetch('http://localhost:3000/get-extension')
            .then(response => {
                if (response.ok) {
                return response.text();
                } else {
                throw new Error('请求失败，状态码：' + response.status);
                }
            })
            .then(extension => {
                // console.log('返回的变量值：', extension);
                // console.log(this.getFilteredData())
                if(extension==1 && getIsMaster()){
                    // this.props.onItemSelected(this.getFilteredData()[16]);
                    // this.props.onItemSelected(this.getFilteredData()[12]);
                    // this.props.onItemSelected(this.getFilteredData()[13]);
                    // this.props.onItemSelected(this.getFilteredData()[14]);
                    // this.handleSelect(15)

                    // this.props.onItemSelected(this.getHiddenData()[4]);
                    this.props.onItemSelected(this.getHiddenData()[0]);
                    this.props.onItemSelected(this.getHiddenData()[1]);
                    this.props.onItemSelected(this.getHiddenData()[2]);
                    this.props.onItemSelected(this.getHiddenData()[3]);
                    console.log('发送了3')
                    this.oneExtension.postMessage(3)
                    this.handleClose();
                    setIsMaster(false)

                    channelLoad.postMessage(false)
                    // alert('添加完成')
                    fetch('http://localhost:3000/set-extension', {
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
                }else if(extension==2 && getIsMaster()){
                    // this.props.onItemSelected(this.getFilteredData()[20]);
                    // this.props.onItemSelected(this.getFilteredData()[18]);
                    // this.props.onItemSelected(this.getFilteredData()[22]);
                    // this.props.onItemSelected(this.getFilteredData()[23]);
                    // this.props.onItemSelected(this.getFilteredData()[24]);
                    // this.props.onItemSelected(this.getFilteredData()[25]);
                    // this.props.onItemSelected(this.getFilteredData()[19]);
                    // this.props.onItemSelected(this.getFilteredData()[1]);
                    
                    // this.handleSelect(21)

                    // this.props.onItemSelected(this.getHiddenData()[7]);
                    this.props.onItemSelected(this.getHiddenData()[5]);
                    // this.props.onItemSelected(this.getHiddenData()[9]);
                    this.props.onItemSelected(this.getHiddenData()[10]);
                    this.props.onItemSelected(this.getHiddenData()[11]);
                    this.props.onItemSelected(this.getHiddenData()[12]);
                    this.props.onItemSelected(this.getHiddenData()[6]);
                    this.props.onItemSelected(this.getFilteredData()[1]);
                    this.props.onItemSelected(this.getFilteredData()[2]);
                    this.props.onItemSelected(this.getFilteredData()[3]);
                    this.props.onItemSelected(this.getFilteredData()[4]);
                    // this.props.onItemSelected(this.getFilteredData()[5]);物体识别
                    this.props.onItemSelected(this.getFilteredData()[6]);
                    this.props.onItemSelected(this.getFilteredData()[7]);
                    this.props.onItemSelected(this.getFilteredData()[8]);
                    this.props.onItemSelected(this.getFilteredData()[9]);
                    this.props.onItemSelected(this.getFilteredData()[10]);
                    // this.props.onItemSelected(this.getHiddenData()[8]);
                    for(let i=0;i<10;i++){

                        if(getAllLoaded().includes(this.props.data[i+1].extensionId)){
                            if(this.props.data[i+1].extensionId=='robotgood'){
                                continue;
                            }
                            console.log('执行了这里')
                            this.channelLoadExtension.postMessage({
                                op:'restore',
                                id:this.props.data[i+1].extensionId
                            })
                            addLoadExtension(this.props.data[i+1].extensionId)
                            this.handleClose();
                        }else{
                            if(this.props.data[i+1].extensionId=='robotgood'){
                                continue;
                            }
                            addLoadExtension(this.props.data[i+1].extensionId)
                            setAllLoaded(this.props.data[i+1].extensionId)
                        }
                        
                    }
                    console.log('发送了8')
                    this.oneExtension.postMessage(8)
                    this.handleClose();
                    setIsMaster(false)

                    channelLoad.postMessage(false)
                    // alert('添加完成')
                    fetch('http://localhost:3000/set-extension', {
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
                }else if(extension==3 && getIsMaster()){

                    
                    this.props.onItemSelected(this.getHiddenData()[14]);
                    this.props.onItemSelected(this.getHiddenData()[15]);

                    console.log('发送了8')
                    this.oneExtension.postMessage(15)
                    this.handleClose();
                    setIsMaster(false)

                    channelLoad.postMessage(false)
                    // alert('添加完成')
                    fetch('http://localhost:3000/set-extension', {
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
                }
            })
            .catch(error => {
                console.error('发生错误：', error);
            });
        },500)

        
        // this.intervalId=setInterval(async ()=>{
            
        // },500)
        
        if (this.props.setStopHandler) this.props.setStopHandler(this.handlePlayingEnd);
    }
    componentWillUnmount() {
        // 清除定时器以防止内存泄漏
        // clearInterval(this.intervalId);
        setIsMaster(false)
    }
    componentDidUpdate (prevProps, prevState) {
        if (prevState.filterQuery !== this.state.filterQuery ||
            prevState.selectedTag !== this.state.selectedTag) {
            this.scrollToTop();
        }

        if (this.state.favorites !== prevState.favorites) {
            try {
                localStorage.setItem(this.getFavoriteStorageKey(), JSON.stringify(this.state.favorites));
            } catch (error) {
                // ignore
            }
        }
    }


    sort(key){

        const currentTime = Date.now(); // 获取当前时间戳

        // 检查按键是否是快速按下
        if (keyPressTimestamps[key] && (currentTime - keyPressTimestamps[key] < QUICK_PRESS_THRESHOLD)) {
            // console.log(`${key} 被快速按下，忽略发送`);
            return; // 快速按下，忽略本次操作
        }

        // console.log(currentTime - allKeyPress)
        if (allKeyPress && (currentTime - allKeyPress < 300)) {
            // console.log(`按键被快速按下，忽略发送`);
            allKeyPress=currentTime
            return; // 快速按下，忽略本次操作
        }

        allKeyPress=currentTime

        

        // 更新按键的上一次按下时间
        


        // for (let Key in keyPressTimestamps) {
        //     if (keyPressTimestamps.hasOwnProperty(Key)) {  // 确保是对象自身的属性，而不是继承的属性
        //     //   console.log(key, keyPressTimestamps[key]);
        //         if(Key!=key && currentTime - keyPressTimestamps[Key] <700){
        //             return
        //         }
        //     }
        //   }

        keyPressTimestamps[key] = currentTime;


        switch (key) {
            case 'w':
            case 'W':
                keyState.W = true;
                this.sendMove('w',1)
                break;
            case 'a':
            case 'A':
                keyState.A = true;
                this.sendMove('a',1)
                break;
            case 's':
            case 'S':
                keyState.S = true;
                this.sendMove('s',1)
                break;
            case 'd':
            case 'D':
                keyState.D = true;
                this.sendMove('d',1)
                break;
            case 'r':
            case 'R':
                keyState.R = true;
                this.sendMove('r',1)
                break;
            case 'b':
            case 'B':
                keyState.B = true;
                this.sendMove('b',1)
                break;
            case 'c':
            case 'C':
                keyState.C = true;
                this.sendMove('c',1)
                break;
            case 'e':
            case 'E':
                keyState.E = true;
                this.sendMove('e',1)
                break;
            case 'f':
            case 'F':
                keyState.F = true;
                this.sendMove('f',1)
                break;
            case 'g':
            case 'G':
                keyState.G = true;
                this.sendMove('g',1)
                break;
            case 'h':
            case 'H':
                keyState.H = true;
                this.sendMove('h',1)
                break;
            case 'i':
            case 'I':
                keyState.I = true;
                this.sendMove('i',1)
                break;
            case 'j':
            case 'J':
                keyState.J = true;
                this.sendMove('j',1)
                break;
            case 'k':
            case 'K':
                keyState.K = true;
                this.sendMove('k',1)
                break;
            case 'l':
            case 'L':
                keyState.L = true;
                this.sendMove('l',1)
                break;
            case 'm':
            case 'M':
                keyState.M = true;
                this.sendMove('m',1)
                break;
            case 'n':
            case 'N':
                keyState.N = true;
                this.sendMove('n',1)
                break;
            case 'o':
            case 'O':
                keyState.O = true;
                this.sendMove('o',1)
                break;
            case 'p':
            case 'P':
                keyState.P = true;
                this.sendMove('p',1)
                break;

            case 'q':
            case 'Q':
                keyState.Q = true;
                this.sendMove('q',1)
                break;
            case 't':
            case 'T':
                keyState.T = true;
                this.sendMove('t',1)
                break;
            case 'u':
            case 'U':
                keyState.U = true;
                this.sendMove('u',1)
                break;
            case 'v':
            case 'V':
                keyState.V = true;
                this.sendMove('v',1)
                break;
            case 'x':
            case 'X':
                keyState.X = true;
                this.sendMove('x',1)
                break;
            case 'y':
            case 'Y':
                keyState.Y = true;
                this.sendMove('y',1)
                break;
            case 'z':
            case 'Z':
                keyState.Z = true;
                this.sendMove('z',1)
                break;
            default:
                // 其他按键不处理
                break;
        }
    
    }

    async sendMove(dir,speed){
       

        if(dir==preKey && speed==preSpeed){
            return
        }
        preKey=dir
        preSpeed=speed


        // const url = `https://cors-anywhere.herokuapp.com/http://192.168.4.1:8080/move?move=${dir}&speed=${speed}`;
        // // const data = {recive: dir,speed:speed};
        // const postResponse = await axios.post(url,{headers: {
        //     'Content-Type': 'application/json;charset=utf-8',
        //   }});
        // console.log('posT请求成功：',postResponse.data)



        fetch(`http://192.168.4.1:8080/move?move=${dir}&speed=${speed}`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json;'
            },
          })
          .then(response => response.text())
          .then(data => {
            console.log('服务器响应:', data);
          })
          .catch(error => {
            console.error('错误:', error);
          });
    }
    
    handleSelect (id) {
        console.log('############################')
        // console.log(id)
        // console.log('进入了hanleSelect')
        // console.log(this.props.data)
        // console.log(this.getFilteredData())
        if(getAllLoaded().includes(this.getFilteredData()[id].extensionId)){
            console.log('执行了这里')
            this.channelLoadExtension.postMessage({
                op:'restore',
                id:this.getFilteredData()[id].extensionId
            })
            addLoadExtension(this.getFilteredData()[id].extensionId)
            this.handleClose();
        }else{
            console.log('进入else条件')
            // console.log(this.props.data)

            if(this.getFilteredData()[id].extensionId){
                addLoadExtension(this.getFilteredData()[id].extensionId)
                setAllLoaded(this.getFilteredData()[id].extensionId)
            }
            

            this.oneExtension.postMessage(id)
            this.handleClose();
            // console.log(this.getHiddenData())
            this.props.onItemSelected(this.getFilteredData()[id]);
            // console.log(this.getFilteredData());
            setIsMaster(false)
        }

        //  this.oneExtension.postMessage(id)
        // this.handleClose();
        // // console.log(this.getHiddenData())
        // this.props.onItemSelected(this.getFilteredData()[id]);
        // // console.log(this.getFilteredData());
        // setIsMaster(false)
      
        
    }
    readFavoritesFromStorage () {
        let data;
        try {
            data = JSON.parse(localStorage.getItem(this.getFavoriteStorageKey()));
        } catch (error) {
            // ignore
        }
        if (!Array.isArray(data)) {
            data = [];
        }
        return data;
    }
    getFavoriteStorageKey () {
        return `tw:library-favorites:${this.props.id}`;
    }
    handleFavorite (id) {
        // alert('收藏')
        const data = this.getFilteredData()[id];
        const key = data[this.props.persistableKey];
        this.setState(oldState => ({
            favorites: oldState.favorites.includes(key) ? (
                oldState.favorites.filter(i => i !== key)
            ) : (
                [...oldState.favorites, key]
            )
        }));
    }
    handleClose () {
        console.log('**********************')
        this.props.onRequestClose();
    }
    handleTagClick (tag) {
        if (this.state.playingItem === null) {
            this.setState({
                filterQuery: '',
                selectedTag: tag.toLowerCase()
            });
        } else {
            this.props.onItemMouseLeave(this.getFilteredData()[[this.state.playingItem]]);
            this.setState({
                filterQuery: '',
                playingItem: null,
                selectedTag: tag.toLowerCase()
            });
        }
    }
    handleMouseEnter (id) {
        // don't restart if mouse over already playing item
        if (this.props.onItemMouseEnter && this.state.playingItem !== id) {
            this.props.onItemMouseEnter(this.getFilteredData()[id]);
            this.setState({
                playingItem: id
            });
        }
    }
    handleMouseLeave (id) {
        if (this.props.onItemMouseLeave) {
            this.props.onItemMouseLeave(this.getFilteredData()[id]);
            this.setState({
                playingItem: null
            });
        }
    }
    handlePlayingEnd () {
        if (this.state.playingItem !== null) {
            this.setState({
                playingItem: null
            });
        }
    }
    handleFilterChange (event) {
        if (this.state.playingItem === null) {
            this.setState({
                filterQuery: event.target.value,
                selectedTag: ALL_TAG.tag
            });
        } else {
            this.props.onItemMouseLeave(this.getFilteredData()[[this.state.playingItem]]);
            this.setState({
                filterQuery: event.target.value,
                playingItem: null,
                selectedTag: ALL_TAG.tag
            });
        }
    }
    handleFilterClear () {
        this.setState({filterQuery: ''});
    }
    handleTest (id){
       
        let input = document.createElement('input')
        input.type = 'file'
        input.id='file-input'+id
        input.style.display = 'none'
        input.click()
        input.addEventListener('change',async (e)=>{
            const file = e.target.files[0];
            console.log(file)
            let fileContent
            const reader = new FileReader();
            reader.onload = await async function(event) {
                fileContent = await event.target.result;
                console.log('File Content:', fileContent);
                setContent(fileContent)
            };
            reader.readAsText(file); // 读取文件内容为文本

            
        })
    }

    handleOnline () {
        // alert('在线更新')
        const fileUrl = 'http://8.130.129.159:9000/test/index.js';
        fetch(fileUrl,{
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不是OK');
                }
                return response.text();
            })
            .then(data => {
                // console.log('JS 文件内容:', data);
                // 在这里可以进一步处理 JS 文件内容
                setContent(data)
            })
            .catch(error => {
                console.error('获取文件时出错:', error);
            });
        
    }
    getHiddenData() {
        const filteredData = this.props.data.filter(item => 
            item === '---' ||  // 保留分隔符
            (typeof item === 'object' && 
            HIDDEN_EXTENSIONS.includes(item.extensionId))
        );
    

        // When filtering, favorites are just listed first, not in a separate section.
        const favoriteItems = [];
        const nonFavoriteItems = [];
        for (const dataItem of filteredData) {
            if (dataItem === '---') {
                // ignore
            } else if (this.state.initialFavorites.includes(dataItem[this.props.persistableKey])) {
                favoriteItems.push(dataItem);
            } else {
                nonFavoriteItems.push(dataItem);
            }
        }

        let filteredItems = favoriteItems.concat(nonFavoriteItems);

        if (this.state.selectedTag !== 'all') {
            filteredItems = filteredItems.filter(dataItem => (
                dataItem.tags &&
                dataItem.tags.map(i => i.toLowerCase()).includes(this.state.selectedTag)
            ));
        }

        if (this.state.filterQuery) {
            filteredItems = filteredItems.filter(dataItem => {
                const search = [...dataItem.tags];
                if (dataItem.name) {
                    // Use the name if it is a string, else use formatMessage to get the translated name
                    if (typeof dataItem.name === 'string') {
                        search.push(dataItem.name);
                    } else {
                        search.push(this.props.intl.formatMessage(dataItem.name.props, {
                            APP_NAME
                        }));
                    }
                }
                if (dataItem.description) {
                    search.push(dataItem.description);
                }
                return search
                    .join('\n')
                    .toLowerCase()
                    .includes(this.state.filterQuery.toLowerCase());
            });
        }

        return filteredItems;
    }
    getFilteredData () {

        console.log(this.props.data)

         // 添加过滤条件排除指定扩展
            const filteredData = this.props.data.filter(item => 
                item === '---' ||  // 保留分隔符
                (typeof item === 'object' && 
                !HIDDEN_EXTENSIONS.includes(item.extensionId))
            );
        
        // When no filtering, favorites get their own section
        if (this.state.selectedTag === 'all' && !this.state.filterQuery) {
            const favoriteItems = filteredData
                .filter(dataItem => (
                    this.state.initialFavorites.includes(dataItem[this.props.persistableKey])
                ))
                .map(dataItem => ({
                    ...dataItem,
                    key: `favorite-${dataItem[this.props.persistableKey]}`
                }));

            if (favoriteItems.length) {
                favoriteItems.push('---');
            }

            return [
                ...favoriteItems,
                ...filteredData
            ];
        }

        // When filtering, favorites are just listed first, not in a separate section.
        const favoriteItems = [];
        const nonFavoriteItems = [];
        for (const dataItem of filteredData) {
            if (dataItem === '---') {
                // ignore
            } else if (this.state.initialFavorites.includes(dataItem[this.props.persistableKey])) {
                favoriteItems.push(dataItem);
            } else {
                nonFavoriteItems.push(dataItem);
            }
        }

        let filteredItems = favoriteItems.concat(nonFavoriteItems);

        if (this.state.selectedTag !== 'all') {
            filteredItems = filteredItems.filter(dataItem => (
                dataItem.tags &&
                dataItem.tags.map(i => i.toLowerCase()).includes(this.state.selectedTag)
            ));
        }

        if (this.state.filterQuery) {
            filteredItems = filteredItems.filter(dataItem => {
                const search = [...dataItem.tags];
                if (dataItem.name) {
                    // Use the name if it is a string, else use formatMessage to get the translated name
                    if (typeof dataItem.name === 'string') {
                        search.push(dataItem.name);
                    } else {
                        search.push(this.props.intl.formatMessage(dataItem.name.props, {
                            APP_NAME
                        }));
                    }
                }
                if (dataItem.description) {
                    search.push(dataItem.description);
                }
                return search
                    .join('\n')
                    .toLowerCase()
                    .includes(this.state.filterQuery.toLowerCase());
            });
        }

        return filteredItems;
    }
    scrollToTop () {
        this.filteredDataRef.scrollTop = 0;
    }
    setFilteredDataRef (ref) {
        this.filteredDataRef = ref;
    }
    
    render () {
        const filteredData = this.state.canDisplay && this.props.data && this.getFilteredData();
        // console.log(getIsMaster())
        if (getIsMaster()) return null;
        return (
            <Modal
                fullScreen
                contentLabel={this.props.title}
                id={this.props.id}
                onRequestClose={this.handleClose}
            >
                {(this.props.filterable || this.props.tags) && (
                    <div className={styles.filterBar}>
                        {this.props.filterable && (
                            <Filter
                                className={classNames(
                                    styles.filterBarItem,
                                    styles.filter
                                )}
                                filterQuery={this.state.filterQuery}
                                inputClassName={styles.filterInput}
                                placeholderText={this.props.intl.formatMessage(messages.filterPlaceholder)}
                                onChange={this.handleFilterChange}
                                onClear={this.handleFilterClear}
                            />
                        )}
                        {this.props.filterable && this.props.tags && (
                            <Divider className={classNames(styles.filterBarItem, styles.divider)} />
                        )}
                        {/* tagListPrefix.concat(this.props.tags) */}
                        {this.props.tags &&
                            <div className={styles.tagWrapper}>
                                {tagListPrefix.concat(this.props.tags).map((tagProps, id) => (
                                    <TagButton
                                        active={this.state.selectedTag === tagProps.tag.toLowerCase()}
                                        className={classNames(
                                            styles.filterBarItem,
                                            styles.tagButton,
                                            tagProps.className
                                        )}
                                        key={`tag-button-${id}`}
                                        onClick={this.handleTagClick}
                                        {...tagProps}
                                    />
                                ))}
                            </div>
                        }
                    </div>
                )}
                <div
                    className={classNames(styles.libraryScrollGrid, {
                        [styles.withFilterBar]: this.props.filterable || this.props.tags
                    })}
                    ref={this.setFilteredDataRef}
                >
                    {filteredData && this.getFilteredData().map((dataItem, index) => (
                        dataItem === '---' ? (
                            <Separator key={index} />
                        ) : (
                            <LibraryItem
                                bluetoothRequired={dataItem.bluetoothRequired}
                                collaborator={dataItem.collaborator}
                                description={dataItem.description}
                                disabled={dataItem.disabled}
                                extensionId={dataItem.extensionId}
                                href={dataItem.href}
                                featured={dataItem.featured}
                                hidden={dataItem.hidden}
                                iconMd5={dataItem.costumes ? dataItem.costumes[0].md5ext : dataItem.md5ext}
                                iconRawURL={dataItem.rawURL}
                                icons={dataItem.costumes}
                                id={index}
                                incompatibleWithScratch={dataItem.incompatibleWithScratch}
                                favorite={this.state.favorites.includes(dataItem[this.props.persistableKey])}
                                onFavorite={this.handleFavorite}
                                onTest={this.handleTest}
                                onOnline={this.handleOnline}
                                insetIconURL={dataItem.insetIconURL}
                                internetConnectionRequired={dataItem.internetConnectionRequired}
                                isPlaying={this.state.playingItem === index}
                                key={dataItem.key || (
                                    typeof dataItem.name === 'string' ?
                                        dataItem.name :
                                        dataItem.rawURL
                                )}
                                name={dataItem.name}
                                credits={dataItem.credits}
                                samples={dataItem.samples}
                                docsURI={dataItem.docsURI}
                                showPlayButton={this.props.showPlayButton}
                                onMouseEnter={this.handleMouseEnter}
                                onMouseLeave={this.handleMouseLeave}
                                onSelect={this.handleSelect}
                                onClose={this.handleClose}
                            />
                        )
                    ))}
                    {filteredData && this.props.removedTrademarks && (
                        <React.Fragment>
                            {filteredData.length > 0 && (
                                <Separator />
                            )}
                            <RemovedTrademarks />
                        </React.Fragment>
                    )}
                    {!filteredData && (
                        <div className={styles.spinnerWrapper}>
                            <Spinner
                                large
                                level="primary"
                            />
                        </div>
                    )}
                </div>
            </Modal>
            
        );
        
    }
}

LibraryComponent.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([
            /* eslint-disable react/no-unused-prop-types, lines-around-comment */
            // An item in the library
            PropTypes.shape({
                // @todo remove md5/rawURL prop from library, refactor to use storage
                md5: PropTypes.string,
                name: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.node
                ]),
                rawURL: PropTypes.string
            }),
            PropTypes.string
            /* eslint-enable react/no-unused-prop-types, lines-around-comment */
        ])),
        PropTypes.instanceOf(Promise)
    ]),
    filterable: PropTypes.bool,
    id: PropTypes.string.isRequired,
    persistableKey: PropTypes.string,
    intl: intlShape.isRequired,
    onItemMouseEnter: PropTypes.func,
    onItemMouseLeave: PropTypes.func,
    onItemSelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    setStopHandler: PropTypes.func,
    showPlayButton: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.shape(TagButton.propTypes)),
    title: PropTypes.string.isRequired,
    removedTrademarks: PropTypes.bool
};

LibraryComponent.defaultProps = {
    filterable: true,
    persistableKey: 'name',
    showPlayButton: false
};

export default injectIntl(LibraryComponent);
