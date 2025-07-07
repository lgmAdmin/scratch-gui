import React from 'react';
import {FormattedMessage} from 'react-intl';

import musicIconURL from './music/music.png';
import musicInsetIconURL from './music/music-small.svg';

import penIconURL from './pen/pen.png';
import penInsetIconURL from './pen/pen-small.svg';

import videoSensingIconURL from './videoSensing/video-sensing.png';
import videoSensingInsetIconURL from './videoSensing/video-sensing-small.svg';

import text2speechIconURL from './text2speech/text2speech.png';
import text2speechInsetIconURL from './text2speech/text2speech-small.svg';

import translateIconURL from './translate/translate.png';
import translateInsetIconURL from './translate/translate-small.png';

import makeymakeyIconURL from './makeymakey/makeymakey.png';
import makeymakeyInsetIconURL from './makeymakey/makeymakey-small.svg';

import microbitIconURL from './microbit/microbit.png';
import microbitInsetIconURL from './microbit/microbit-small.svg';
import microbitConnectionIconURL from './microbit/microbit-illustration.svg';
import microbitConnectionSmallIconURL from './microbit/microbit-small.svg';

import ev3IconURL from './ev3/ev3.png';
import ev3InsetIconURL from './ev3/ev3-small.svg';
import ev3ConnectionIconURL from './ev3/ev3-hub-illustration.svg';
import ev3ConnectionSmallIconURL from './ev3/ev3-small.svg';

import wedo2IconURL from './wedo2/wedo.png'; // TODO: Rename file names to match variable/prop names?
import wedo2InsetIconURL from './wedo2/wedo-small.svg';
import wedo2ConnectionIconURL from './wedo2/wedo-illustration.svg';
import wedo2ConnectionSmallIconURL from './wedo2/wedo-small.svg';
import wedo2ConnectionTipIconURL from './wedo2/wedo-button-illustration.svg';

import boostIconURL from './boost/boost.png';
import boostInsetIconURL from './boost/boost-small.svg';
import boostConnectionIconURL from './boost/boost-illustration.svg';
import boostConnectionSmallIconURL from './boost/boost-small.svg';
import boostConnectionTipIconURL from './boost/boost-button-illustration.svg';

import gdxforIconURL from './gdxfor/gdxfor.png';
import gdxforInsetIconURL from './gdxfor/gdxfor-small.svg';
import gdxforConnectionIconURL from './gdxfor/gdxfor-illustration.svg';
import gdxforConnectionSmallIconURL from './gdxfor/gdxfor-small.svg';

//hello world 
import helloworldImage from './helloworld/center.png';
import helloworldInsetImage from './helloworld/bottom.svg';

//bricks motor
import bricksMotorImage from './bricksmotor/motor-center.png';
import bricksMotorInsetImage from './bricksmotor/motor-bottom.svg';

//bricks two motor
import bricksTwoMotorImage from './brickstwomotor/two-motor-center.png';
import bricksTwoMotorInsetImage from './brickstwomotor/two-motor.svg';

//bricks light
import bricksLightImage from './brickslight/light_center.png';
import bricksLightInsetImage from './brickslight/light_bottom.svg';

//bricks sensors
import bricksSensorsImage from './brickssensors/sensors_center.png';
import bricksSensorsInsetImage from './brickssensors/sensors_bottom.svg';

//bricks event
import bricksEventImage from './bricksevent/event_center.png'
import bricksEventInsetImage from './bricksevent/event_bottom.svg'

//robot img
import robotImgImage from './robotimg/img_center.png'
import robotImgInsetImage from './robotimg/img_bottom.svg'

//robot move
import robotmoveImage from './robotmove/move_center.png'
import robotmoveInsetImage from './robotmove/move_bottom.svg'

//robot sensors
import robotsensorsImage from './robotsensors/sensors_center.png'
import robotsensorsInsetImage from './robotsensors/sensors_bottom.svg'

//robot event
import roboteventImage from './robotevent/event_center.png'
import roboteventInsetImage from './robotevent/event_bottom.svg'

//robot wifi
import robotwifiImage from './robotwifi/wifi_center.png'
import robotwifiInsetImage from './robotwifi/wifi_bottom.svg'

//robot emote
import robotemoteImage from './robotemote/emote_center.png'
import robotemoteInsetImage from './robotemote/emote_bottom.svg'

//robot show
import robotshowImage from './robotshow/show_center.png'
import robotshowInsetImage from './robotshow/show_bottom.svg'

//robot sound
import robotsoundImage from './robotsound/sound_center.png'
import robotsoundInsetImage from './robotsound/sound_bottom.svg'

//robot actuator
import robotactuatorImage from './robotactuator/actuator_center.png'
import robotactuatorInsetImage from './robotactuator/actuator_bottom.svg'

//robot apriltag
import robotapriltagImage from './robotapriltag/apriltag_center.png'
import robotapriltagInsetImage from './robotapriltag/apriltag_bottom.svg'

//robot colordete
import robotcolordeteImage from './robotcolordete/colordete_center.png'

//robot qr
import robotqrImage from './robotqr/qr_center.png'

//robot good
import robotgoodImage from './robotgood/good_center.png'

//robot face
import robotfaceImage from './robotface/face_center.png'

//robot colorplace
import robotcolorplaceImage from './robotcolorplace/colorplace_center.png'

//robot colorxy
import robotcolorxyImage from './robotcolorxy/colorxy_center.png'

//robot colorxy
import robotcatImage from './robotcat/cat_center.png'

//robot traffic
import robottrafficImage from './robottraffic/traffic_center.png'

//matrix
import matrixImage from './matrix/matrix_center.png'
import matrixInsetImage from './matrix/matrix_bottom.svg'

//robot ble
import robotbleImage from './robotble/ble_center.png'
import robotbleInsetImage from './robotble/ble_bottom.svg'

//robot teachable
import robotteachableImage from './robotteachable/teachable_center.png'
import robotteachableInsetImage from './robotteachable/teachable_bottom.svg'


//deepseek
import deepseekImage from './deepseek/deep_center.png'
import deepseekInsetImage from './deepseek/deep_bottom.svg'

//艾克瑞特 microbite
import ICmicrobitIconURL from './ICreate_Microbit/microbit.png';
import ICmicrobitInsetIconURL from './ICreate_Microbit/microbit-small.svg';
import ICmicrobitConnectionIconURL from './ICreate_Microbit/microbit-illustration.svg';
import ICmicrobitConnectionSmallIconURL from './ICreate_Microbit/microbit-small.svg';

import twIcon from './tw/tw.svg';
import customExtensionIcon from './custom/custom.svg';
import returnIcon from './custom/return.svg';
import galleryIcon from './gallery/gallery.svg';
import {APP_NAME} from '../../brand';

export default [

    //robot teachable
    {
        name: (
            <FormattedMessage
                defaultMessage="机器学习"
                description="Name for the 'robotteachable' extension"
                id="gui.extension.robotteachable.name"
            />
        ),
        extensionId: 'robotteachable',
        iconURL: robotteachableImage, 
        // insetIconURL: robotteachableInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="机器学习."
                description="Description for the 'robotteachable' extension"
                id="gui.extension.robotteachable.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['main'],
        featured: true
    },
   
    //robot img
    {
        name: (
            <FormattedMessage
                defaultMessage="摄像头"
                description="Name for the 'robotimg' extension"
                id="gui.extension.robotimg.name"
            />
        ),
        extensionId: 'robotimg',
        iconURL: robotImgImage, 
        // insetIconURL: robotImgInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="摄像头."
                description="Description for the 'robotimg' extension"
                id="gui.extension.robotimg.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['main'],
        featured: true
    },


    //robot apriltag
    {
        name: (
            <FormattedMessage
                defaultMessage="apriltag识别"
                description="Name for the 'robotapriltag' extension"
                id="gui.extension.robotapriltag.name"
            />
        ),
        extensionId: 'robotapriltag',
        iconURL: robotapriltagImage, 
        // insetIconURL: robotImgInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="apriltag识别."
                description="Description for the 'robotapriltag' extension"
                id="gui.extension.robotapriltag.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['main'],
        featured: true
    },

     //robot colordete
    {
        name: (
            <FormattedMessage
                defaultMessage="颜色识别"
                description="Name for the 'robotcolordete' extension"
                id="gui.extension.robotcolordete.name"
            />
        ),
        extensionId: 'robotcolordete',
        iconURL: robotcolordeteImage, 
        // insetIconURL: robotImgInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="颜色识别."
                description="Description for the 'robotcolordete' extension"
                id="gui.extension.robotcolordete.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['main'],
        featured: true
    },

      //robot qr
    {
        name: (
            <FormattedMessage
                defaultMessage="二维码识别"
                description="Name for the 'robotqr' extension"
                id="gui.extension.robotqr.name"
            />
        ),
        extensionId: 'robotqr',
        iconURL: robotqrImage, 
        // insetIconURL: robotImgInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="二维码识别."
                description="Description for the 'robotqr' extension"
                id="gui.extension.robotqr.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['main'],
        featured: true
    },
    

     //robot good
    {
        name: (
            <FormattedMessage
                defaultMessage="物体识别"
                description="Name for the 'robotgood' extension"
                id="gui.extension.robotgood.name"
            />
        ),
        extensionId: 'robotgood',
        iconURL: robotgoodImage, 
        // insetIconURL: robotImgInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="物体识别."
                description="Description for the 'robotgood' extension"
                id="gui.extension.robotgood.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['main'],
        featured: true
    },


     //robot face
    {
        name: (
            <FormattedMessage
                defaultMessage="人脸识别"
                description="Name for the 'robotface' extension"
                id="gui.extension.robotface.name"
            />
        ),
        extensionId: 'robotface',
        iconURL: robotfaceImage, 
        // insetIconURL: robotImgInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="人脸识别."
                description="Description for the 'robotface' extension"
                id="gui.extension.robotface.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['main'],
        featured: true
    },

    //robot colorplace
    {
        name: (
            <FormattedMessage
                defaultMessage="颜色位置追踪"
                description="Name for the 'robotcolorplace' extension"
                id="gui.extension.robotcolorplace.name"
            />
        ),
        extensionId: 'robotcolorplace',
        iconURL: robotcolorplaceImage, 
        // insetIconURL: robotImgInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="颜色位置追踪."
                description="Description for the 'robotcolorplace' extension"
                id="gui.extension.robotcolorplace.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['main'],
        featured: true
    },

    //robot colorxy
    {
        name: (
            <FormattedMessage
                defaultMessage="颜色坐标追踪"
                description="Name for the 'robotcolorxy' extension"
                id="gui.extension.robotcolorxy.name"
            />
        ),
        extensionId: 'robotcolorxy',
        iconURL: robotcolorxyImage, 
        // insetIconURL: robotImgInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="颜色坐标追踪."
                description="Description for the 'robotcolorxy' extension"
                id="gui.extension.robotcolorxy.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['main'],
        featured: true
    },
     //robot cat
    {
        name: (
            <FormattedMessage
                defaultMessage="猫脸识别"
                description="Name for the 'robotcat' extension"
                id="gui.extension.robotcat.name"
            />
        ),
        extensionId: 'robotcat',
        iconURL: robotcatImage, 
        // insetIconURL: robotImgInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="猫脸识别."
                description="Description for the 'robotcat' extension"
                id="gui.extension.robotcat.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['main'],
        featured: true
    },
     //robot traffic
    {
        name: (
            <FormattedMessage
                defaultMessage="路标识别"
                description="Name for the 'robottraffic' extension"
                id="gui.extension.robottraffic.name"
            />
        ),
        extensionId: 'robottraffic',
        iconURL: robottrafficImage, 
        // insetIconURL: robotImgInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="路标识别."
                description="Description for the 'robottraffic' extension"
                id="gui.extension.robottraffic.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['main'],
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Video Sensing"
                description="Name for the 'Video Sensing' extension"
                id="gui.extension.videosensing.name"
            />
        ),
        extensionId: 'videoSensing',
        iconURL: videoSensingIconURL,
        insetIconURL: videoSensingInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Sense motion with the camera."
                description="Description for the 'Video Sensing' extension"
                id="gui.extension.videosensing.description"
            />
        ),
        tags: ['scratch'],
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Text to Speech"
                description="Name for the Text to Speech extension"
                id="gui.extension.text2speech.name"
            />
        ),
        extensionId: 'text2speech',
        collaborator: 'Amazon Web Services',
        iconURL: text2speechIconURL,
        insetIconURL: text2speechInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Make your projects talk."
                description="Description for the Text to speech extension"
                id="gui.extension.text2speech.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Translate"
                description="Name for the Translate extension"
                id="gui.extension.translate.name"
            />
        ),
        extensionId: 'translate',
        collaborator: 'Google',
        iconURL: translateIconURL,
        insetIconURL: translateInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Translate text into many languages."
                description="Description for the Translate extension"
                id="gui.extension.translate.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: 'Makey Makey',
        extensionId: 'makeymakey',
        collaborator: 'JoyLabz',
        iconURL: makeymakeyIconURL,
        insetIconURL: makeymakeyInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Make anything into a key."
                description="Description for the 'Makey Makey' extension"
                id="gui.extension.makeymakey.description"
            />
        ),
        tags: ['scratch'],
        featured: true
    },
    {
        name: 'micro:bit',
        extensionId: 'microbit',
        collaborator: 'micro:bit',
        iconURL: microbitIconURL,
        insetIconURL: microbitInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Connect your projects with the world."
                description="Description for the 'micro:bit' extension"
                id="gui.extension.microbit.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: microbitConnectionIconURL,
        connectionSmallIconURL: microbitConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their micro:bit."
                id="gui.extension.microbit.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/microbit'
    },
    {
        name: 'LEGO MINDSTORMS EV3',
        extensionId: 'ev3',
        collaborator: 'LEGO',
        iconURL: ev3IconURL,
        insetIconURL: ev3InsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Build interactive robots and more."
                description="Description for the 'LEGO MINDSTORMS EV3' extension"
                id="gui.extension.ev3.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: ev3ConnectionIconURL,
        connectionSmallIconURL: ev3ConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting. Make sure the pin on your EV3 is set to 1234."
                description="Message to help people connect to their EV3. Must note the PIN should be 1234."
                id="gui.extension.ev3.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/ev3'
    },
    {
        name: 'LEGO BOOST',
        extensionId: 'boost',
        collaborator: 'LEGO',
        iconURL: boostIconURL,
        insetIconURL: boostInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Bring robotic creations to life."
                description="Description for the 'LEGO BOOST' extension"
                id="gui.extension.boost.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: true,
        connectionIconURL: boostConnectionIconURL,
        connectionSmallIconURL: boostConnectionSmallIconURL,
        connectionTipIconURL: boostConnectionTipIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their BOOST."
                id="gui.extension.boost.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/boost'
    },
    {
        name: 'LEGO Education WeDo 2.0',
        extensionId: 'wedo2',
        collaborator: 'LEGO',
        iconURL: wedo2IconURL,
        insetIconURL: wedo2InsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Build with motors and sensors."
                description="Description for the 'LEGO WeDo 2.0' extension"
                id="gui.extension.wedo2.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: true,
        connectionIconURL: wedo2ConnectionIconURL,
        connectionSmallIconURL: wedo2ConnectionSmallIconURL,
        connectionTipIconURL: wedo2ConnectionTipIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their WeDo."
                id="gui.extension.wedo2.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/wedo'
    },
    {
        name: 'Go Direct Force & Acceleration',
        extensionId: 'gdxfor',
        collaborator: 'Vernier',
        iconURL: gdxforIconURL,
        insetIconURL: gdxforInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Sense push, pull, motion, and spin."
                description="Description for the Vernier Go Direct Force and Acceleration sensor extension"
                id="gui.extension.gdxfor.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: gdxforConnectionIconURL,
        connectionSmallIconURL: gdxforConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their force and acceleration sensor."
                id="gui.extension.gdxfor.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/vernier'
    },
    {
        // not really an extension, but it's easiest to present it as one
        name: (
            <FormattedMessage
                defaultMessage="Custom Reporters"
                description="Name of custom reporters extension"
                id="tw.customReporters.name"
            />
        ),
        extensionId: 'procedures_enable_return',
        iconURL: returnIcon,
        description: (
            <FormattedMessage
                defaultMessage="Allow custom blocks to output values and be used as inputs."
                description="Description of custom reporters extension"
                id="tw.customReporters.description"
            />
        ),
        tags: ['tw'],
        incompatibleWithScratch: true,
        featured: true
    },


    //hello world
	// {
    //     name: (
    //         <FormattedMessage
    //             defaultMessage="hello world"
    //             description="Name for the 'hello world' extension"
    //             id="gui.extension.helloworld.name"
    //         />
    //     ),
    //     extensionId: 'helloWorld',
    //     iconURL: helloworldImage,
    //     insetIconURL: helloworldInsetImage,
    //     description: (
    //         <FormattedMessage
    //             defaultMessage="hello world."
    //             description="Description for the 'hello world' extension"
    //             id="gui.extension.helloworld.description"
    //         />
    //     ),
    //     // generator:'./helloworld/generator.js',
    //     tags: ['scratch'],
    //     featured: true
    // },

    //bricks motor  id=12
    {
        name: (
            <FormattedMessage
                defaultMessage="电机"
                description="Name for the 'motor' extension"
                id="gui.extension.bricksmotor.name"
            />
        ),
        extensionId: 'bricksmotor',
        iconURL: bricksMotorImage, 
        insetIconURL: bricksMotorInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="电机."
                description="Description for the 'bricksmotor' extension"
                id="gui.extension.bricksmotor.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    //bricks two motor
    {
        name: (
            <FormattedMessage
                defaultMessage="运动"
                description="Name for the 'brickstwomotor' extension"
                id="gui.extension.brickstwomotor.name"
            />
        ),
        extensionId: 'brickstwomotor',
        iconURL: bricksTwoMotorImage, 
        insetIconURL: bricksTwoMotorInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="运动."
                description="Description for the 'brickstwomotor' extension"
                id="gui.extension.brickstwomotor.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    //bricks light
    {
        name: (
            <FormattedMessage
                defaultMessage="声光"
                description="Name for the 'brickslight' extension"
                id="gui.extension.brickslight.name"
            />
        ),
        extensionId: 'brickslight',
        iconURL: bricksLightImage, 
        insetIconURL: bricksLightInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="声光."
                description="Description for the 'brickslight' extension"
                id="gui.extension.brickslight.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    //bricks sensors
    {
        name: (
            <FormattedMessage
                defaultMessage="传感器"
                description="Name for the 'brickssensors' extension"
                id="gui.extension.brickssensors.name"
            />
        ),
        extensionId: 'brickssensors',
        iconURL: bricksSensorsImage, 
        insetIconURL: bricksSensorsInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="传感器."
                description="Description for the 'brickssensors' extension"
                id="gui.extension.brickssensors.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    //bricks event
    {
        name: (
            <FormattedMessage
                defaultMessage="事件"
                description="Name for the 'bricksevent' extension"
                id="gui.extension.bricksevent.name"
            />
        ),
        extensionId: 'bricksevent',
        iconURL: bricksEventImage, 
        insetIconURL: bricksEventInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="事件."
                description="Description for the 'bricksevent' extension"
                id="gui.extension.bricksevent.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    {
        name: (
            <FormattedMessage
                defaultMessage="Pen"
                description="Name for the 'Pen' extension"
                id="gui.extension.pen.name"
            />
        ),
        extensionId: 'pen',
        iconURL: penIconURL,
        insetIconURL: penInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Draw with your sprites."
                description="Description for the 'Pen' extension"
                id="gui.extension.pen.description"
            />
        ),
        tags: ['scratch'],
        featured: true
    },
     //robot move
     {
        name: (
            <FormattedMessage
                defaultMessage="运动"
                description="Name for the 'robotmove' extension"
                id="gui.extension.robotmove.name"
            />
        ),
        extensionId: 'robotmove',
        iconURL: robotmoveImage, 
        insetIconURL: robotmoveInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="运动."
                description="Description for the 'robotmove' extension"
                id="gui.extension.robotmove.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },


     //robot sensors
     {
        name: (
            <FormattedMessage
                defaultMessage="传感器"
                description="Name for the 'robotsensors' extension"
                id="gui.extension.robotsensors.name"
            />
        ),
        extensionId: 'robotsensors',
        iconURL: robotsensorsImage, 
        insetIconURL: robotsensorsInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="传感器."
                description="Description for the 'robotsensors' extension"
                id="gui.extension.robotsensors.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },


    //robot event
    {
        name: (
            <FormattedMessage
                defaultMessage="事件"
                description="Name for the 'robotevent' extension"
                id="gui.extension.robotevent.name"
            />
        ),
        extensionId: 'robotevent',
        iconURL: roboteventImage, 
        insetIconURL: roboteventInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="事件."
                description="Description for the 'robotevent' extension"
                id="gui.extension.robotevent.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    //robot wifi
    {
        name: (
            <FormattedMessage
                defaultMessage="wifi"
                description="Name for the 'robotwifi' extension"
                id="gui.extension.robotwifi.name"
            />
        ),
        extensionId: 'robotwifi',
        iconURL: robotwifiImage, 
        insetIconURL: robotwifiInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="wifi."
                description="Description for the 'robotwifi' extension"
                id="gui.extension.robotwifi.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    //robot emote
    {
        name: (
            <FormattedMessage
                defaultMessage="emote"
                description="Name for the 'robotemote' extension"
                id="gui.extension.robotemote.name"
            />
        ),
        extensionId: 'robotemote',
        iconURL: robotemoteImage, 
        insetIconURL: robotemoteInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="emote."
                description="Description for the 'robotemote' extension"
                id="gui.extension.robotemote.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    //robot show 
    {
        name: (
            <FormattedMessage
                defaultMessage="show"
                description="Name for the 'robotshow' extension"
                id="gui.extension.robotshow.name"
            />
        ),
        extensionId: 'robotshow',
        iconURL: robotshowImage, 
        insetIconURL: robotshowInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="show."
                description="Description for the 'robotshow' extension"
                id="gui.extension.robotshow.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    //robot sound
    {
        name: (
            <FormattedMessage
                defaultMessage="sound"
                description="Name for the 'robotsound' extension"
                id="gui.extension.robotsound.name"
            />
        ),
        extensionId: 'robotsound',
        iconURL: robotsoundImage, 
        insetIconURL: robotsoundInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="sound."
                description="Description for the 'robotsound' extension"
                id="gui.extension.robotsound.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    //robot actuator
    {
        name: (
            <FormattedMessage
                defaultMessage="actuator"
                description="Name for the 'robotactuator' extension"
                id="gui.extension.robotactuator.name"
            />
        ),
        extensionId: 'robotactuator',
        iconURL: robotactuatorImage, 
        insetIconURL: robotactuatorInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="actuator."
                description="Description for the 'robotactuator' extension"
                id="gui.extension.robotactuator.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },


    //matrix
    // {
    //     name: (
    //         <FormattedMessage
    //             defaultMessage="matrix"
    //             description="Name for the 'matrix' extension"
    //             id="gui.extension.matrix.name"
    //         />
    //     ),
    //     extensionId: 'matrix',
    //     iconURL: matrixImage, 
    //     insetIconURL: matrixInsetImage,
    //     description: (
    //         <FormattedMessage
    //             defaultMessage="matrix."
    //             description="Description for the 'matrix' extension"
    //             id="gui.extension.matrix.description"
    //         />
    //     ),
    //     // generator:'./helloworld/generator.js',
    //     tags: ['main'],
    //     featured: true
    // },


    //robot ble
    {
        name: (
            <FormattedMessage
                defaultMessage="ble"
                description="Name for the 'robotble' extension"
                id="gui.extension.robotble.name"
            />
        ),
        extensionId: 'robotble',
        iconURL: robotbleImage, 
        insetIconURL: robotbleInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="ble."
                description="Description for the 'robotble' extension"
                id="gui.extension.robotble.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    
    {
        name: (
            <FormattedMessage
                defaultMessage="Music"
                description="Name for the 'Music' extension"
                id="gui.extension.music.name"
            />
        ),
        extensionId: 'music',
        iconURL: musicIconURL,
        insetIconURL: musicInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Play instruments and drums."
                description="Description for the 'Music' extension"
                id="gui.extension.music.description"
            />
        ),
        tags: ['scratch'],
        featured: true
    },
    //deepseek
    {
        name: (
            <FormattedMessage
                defaultMessage="deepseek"
                description="Name for the 'deepseek' extension"
                id="gui.extension.deepseek.name"
            />
        ),
        extensionId: 'deepseek',
        iconURL: deepseekImage, 
        insetIconURL: deepseekInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="deepseek."
                description="Description for the 'deepseek' extension"
                id="gui.extension.deepseek.description"
            />
        ),
        // generator:'./helloworld/generator.js',
        tags: ['scratch'],
        featured: true
    },

    {
        name: 'Micro:bit',
        extensionId: 'MicrobitIcreate',
        collaborator: 'ICreatRobot',
        iconURL: ICmicrobitIconURL,
        insetIconURL: ICmicrobitInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="I create world!"
                description="Description for the 'micro:bit' extension"
                id="gui.extension.MicrobitIcreate.name"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: false,//关闭导入扩展后的连接
        useAutoScan: false,
        connectionIconURL: ICmicrobitConnectionIconURL,
        connectionSmallIconURL: ICmicrobitConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description=""
                id="gui.extension.MicrobitIcreate.description"
            />
        )
    },

    {
        name: 'Micro:bit-外设',
        extensionId: 'MicrobiteIcreateP',
        collaborator: 'ICreatRobot',
        iconURL: ICmicrobitIconURL,
        insetIconURL: ICmicrobitInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="I create world!"
                description="Description for the 'micro:bit' extension"
                id="gui.extension.MicrobiteIcreateP.name"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: false,//关闭导入扩展的连接
        useAutoScan: true,
        connectionIconURL: ICmicrobitConnectionIconURL,
        connectionSmallIconURL: ICmicrobitConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description=""
                id="gui.extension.MicrobiteIcreateP.description"
            />
        )
    },


    {
        name: (
            <FormattedMessage
                defaultMessage="{APP_NAME} Blocks"
                description="Name of the strange 'TurboWarp Blocks' extension"
                id="tw.twExtension.name"
                values={{
                    APP_NAME
                }}
            />
        ),
        extensionId: 'tw',
        iconURL: twIcon,
        description: (
            <FormattedMessage
                defaultMessage="Weird new blocks."
                description="Description of the strange 'TurboWarp Blocks' extension"
                id="tw.twExtension.description"
            />
        ),
        incompatibleWithScratch: true,
        tags: ['tw'],
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Custom Extension"
                description="Name of library item to load a custom extension from a remote source"
                id="tw.customExtension.name"
            />
        ),
        extensionId: 'custom_extension',
        iconURL: customExtensionIcon,
        description: (
            <FormattedMessage
                defaultMessage="Load custom extensions from URLs, files, or JavaScript source code."
                description="Description of library item to load a custom extension from a custom source"
                id="tw.customExtension.description"
            />
        ),
        tags: ['tw'],
        featured: true
        // Not marked as incompatible with Scratch so that clicking on it doesn't show a prompt
    }
];

export const galleryLoading = {
    name: (
        <FormattedMessage
            defaultMessage="{APP_NAME} Extension Gallery"
            description="Name of extensions.turbowarp.org in extension library"
            id="tw.extensionGallery.name"
            values={{
                APP_NAME
            }}
        />
    ),
    href: 'https://extensions.turbowarp.org/',
    extensionId: 'gallery',
    iconURL: galleryIcon,
    description: (
        <FormattedMessage
            // eslint-disable-next-line max-len
            defaultMessage="Loading extension gallery..."
            description="Appears while loading extension list from the custom extension gallery"
            id="tw.extensionGallery.loading"
        />
    ),
    tags: ['tw'],
    featured: true
};

export const galleryMore = {
    name: (
        <FormattedMessage
            defaultMessage="{APP_NAME} Extension Gallery"
            description="Name of extensions.turbowarp.org in extension library"
            id="tw.extensionGallery.name"
            values={{
                APP_NAME
            }}
        />
    ),
    href: 'https://extensions.turbowarp.org/',
    extensionId: 'gallery',
    iconURL: galleryIcon,
    description: (
        <FormattedMessage
            // eslint-disable-next-line max-len
            defaultMessage="Learn more about extensions at extensions.turbowarp.org."
            description="Appears after the extension list from the gallery was loaded successfully"
            id="tw.extensionGallery.more"
        />
    ),
    tags: ['tw'],
    featured: true
};

export const galleryError = {
    name: (
        <FormattedMessage
            defaultMessage="{APP_NAME} Extension Gallery"
            description="Name of extensions.turbowarp.org in extension library"
            id="tw.extensionGallery.name"
            values={{
                APP_NAME
            }}
        />
    ),
    href: 'https://extensions.turbowarp.org/',
    extensionId: 'gallery',
    iconURL: galleryIcon,
    description: (
        <FormattedMessage
            // eslint-disable-next-line max-len
            defaultMessage="Error loading extension gallery. Visit extensions.turbowarp.org to find more extensions."
            description="Appears when an error occurred loading extension list from the custom extension gallery"
            id="tw.extensionGallery.error"
        />
    ),
    tags: ['tw'],
    featured: true
};
