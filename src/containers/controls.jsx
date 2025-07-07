import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import ControlsComponent from '../components/controls/controls.jsx';
import { getAdd ,getBlock} from '../../../../utils/isAddMaster.js';
import { getIsRobot ,getRobotIp} from 'scratch-gui/src/components/utils/utils.js';


const channel = new BroadcastChannel('flag_channel');
class Controls extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleGreenFlagClick',
            'handleStopAllClick'
        ]);
        this.stopAll = new BroadcastChannel('stopAll')
        this.ip=getRobotIp()
        this.channelSendIp=new BroadcastChannel('sendIp')
        this.channelSendIp.addEventListener('message',(event)=>{
            this.ip=event.data
        })

        this.whatSendFun='net'
        this.channelPort = new BroadcastChannel('channelPort')
        this.channelPort.addEventListener('message',(event)=>{
            console.log(event.data)
            if(event.data){
                this.whatSendFun='port'
            }else{
                this.whatSendFun='net'
            }
            
        })
    }
    handleGreenFlagClick (e) {
        e.preventDefault();
        e.persist(); // 保留事件对象
        console.log('小绿旗')
        fetch(`http://localhost:3000/get-ble`,{
            method: 'GET'
        })
        .then(response => {
            if (response.ok) {
            return response.text();
            } else {
            throw new Error('请求失败，状态码：' + response.status);
            }
        })
        .then(isble => {
            console.log('蓝牙是否连接', isble);
            console.log(getAdd())
            if(isble!='0' && getAdd() && getBlock()){
                alert('请先连接蓝牙')
            }else{
                if(getIsRobot()){
                    // fetch(`http://192.168.4.1:8080/flag?num=1`,{
                    //     method:'GET'
                    // })
                    //     .then(response => {
                    //         if (!response.ok) {
                    //             throw new Error('Network response was not ok');
                    //         }
                    //         return response.text();
                    //     })
                    //     .then(data => {
                    //         channel.postMessage('1')
                    //         console.log('Success:', data);
                    //     })
                    //     .catch(error => {
                    //         console.error('There was an error with the fetch operation:', error);
                    //     });
                }
                // console.log('control按钮')
                // tw: implement alt+click and right click to toggle FPS
                if (e.shiftKey || e.altKey || e.type === 'contextmenu') {
                    if (e.shiftKey) {
                        this.props.vm.setTurboMode(!this.props.turbo);
                    }
                    if (e.altKey || e.type === 'contextmenu') {
                        if (this.props.framerate === 30) {
                            this.props.vm.setFramerate(60);
                        } else {
                            this.props.vm.setFramerate(30);
                        }
                    }
                } else {
                    if (!this.props.isStarted) {
                        this.props.vm.start();
                    }
                    this.props.vm.greenFlag();
                }
            }
        })
        .catch(error => {
            console.error('发生错误：', error);
        });
        
       
    }
    handleStopAllClick (e) {
        e.preventDefault();
        this.props.vm.stopAll();
        console.log('停止')
        this.stopAll.postMessage(true)
        if(getIsRobot()){

            if(this.whatSendFun=='net'){
                const Socket = new WebSocket(`ws://${this.ip}:8084`);
                    
                Socket.addEventListener('open', async (event) => {
                    console.log('连接成功');
                    Socket.send('stop')
                    await new Promise(resolve => setTimeout(resolve, 100));
                    Socket.close()
    
                        
                });
            }else{
                this.channelPort.postMessage('stop')
            }
            
            
            // fetch(`http://192.168.4.1:8080/flag?num=0`,{
            //     method:'GET'
            // })
            //     .then(response => {
            //         if (!response.ok) {
            //             throw new Error('Network response was not ok');
            //         }
            //         return response.text();
            //     })
            //     .then(data => {
            //         channel.postMessage('0')
            //         console.log('Success:', data);
            //     })
            //     .catch(error => {
            //         console.error('There was an error with the fetch operation:', error);
            //     });
        }
    }
    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            isStarted, // eslint-disable-line no-unused-vars
            projectRunning,
            turbo,
            ...props
        } = this.props;
        return (
            <ControlsComponent
                {...props}
                active={projectRunning && isStarted}
                turbo={turbo}
                onGreenFlagClick={this.handleGreenFlagClick}
                onStopAllClick={this.handleStopAllClick}
            />
        );
    }
}

Controls.propTypes = {
    isStarted: PropTypes.bool.isRequired,
    projectRunning: PropTypes.bool.isRequired,
    turbo: PropTypes.bool.isRequired,
    framerate: PropTypes.number.isRequired,
    interpolation: PropTypes.bool.isRequired,
    isSmall: PropTypes.bool,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    isStarted: state.scratchGui.vmStatus.started,
    projectRunning: state.scratchGui.vmStatus.running,
    framerate: state.scratchGui.tw.framerate,
    interpolation: state.scratchGui.tw.interpolation,
    turbo: state.scratchGui.vmStatus.turbo
});
// no-op function to prevent dispatch prop being passed to component
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
