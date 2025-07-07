import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';



import LanguageMenu from './language-menu.jsx';
import MenuBarMenu from './menu-bar-menu.jsx';
import {MenuSection} from '../menu/menu.jsx';
import MenuLabel from './tw-menu-label.jsx';
import TWAccentThemeMenu from './tw-theme-accent.jsx';
import TWGuiThemeMenu from './tw-theme-gui.jsx';
import TWBlocksThemeMenu from './tw-theme-blocks.jsx';
import TWDesktopSettings from './tw-desktop-settings.jsx';
import SerialConnect from 'scratch-gui/src/components/menu-bar/serial-connect.jsx';
import DownloadCode from 'scratch-gui/src/components/menu-bar/download-code.jsx';
import SerialDisconnect from 'scratch-gui/src/components/menu-bar/serial-disconnect.jsx';
import EspSend from 'scratch-gui/src/components/menu-bar/esp-send.jsx';
import BleConnect from 'scratch-gui/src/components/menu-bar/ble-connect.jsx';
import SendWifi from 'scratch-gui/src/components/menu-bar/send-wifi.jsx';

import menuBarStyles from './menu-bar.css';
import styles from './settings-menu.css';

import dropdownCaret from './dropdown-caret.svg';
import settingsIcon from './icon--settings.svg';


// const { ipcRenderer } = require('electron')

const SettingsMenu = ({
    canChangeLanguage,
    canChangeTheme,
    isRtl,
    onClickDesktopSettings,
    onOpenCustomSettings,
    onRequestClose,
    onRequestOpen,
    settingsMenuOpen,
    clickSerialConnect,
    clickDownloadCode,
    clickBleConnect,
    clickEspSend,
    clickSendWifi
}) => (
    <MenuLabel
        open={settingsMenuOpen}
        onOpen={onRequestOpen}
        onClose={onRequestClose}
    >
        <img
            src={settingsIcon}
            draggable={false}
            width={20}
            height={20}
        />
        {/* <span className={styles.dropdownLabel}>
            <FormattedMessage
                defaultMessage="Settings"
                description="Settings menu"
                id="gui.menuBar.settings"
            />
        </span> */}
        <img
            src={dropdownCaret}
            draggable={false}
            width={8}
            height={5}
        />
        <MenuBarMenu
            className={menuBarStyles.menuBarMenu}
            open={settingsMenuOpen}
            place={isRtl ? 'left' : 'right'}
        >
            <MenuSection>
                {canChangeLanguage && <LanguageMenu onRequestCloseSettings={onRequestClose} />}
                {canChangeTheme && (
                    <React.Fragment>
                        {/* <TWGuiThemeMenu />
                        <TWBlocksThemeMenu
                            onOpenCustomSettings={onOpenCustomSettings}
                        /> */}
                        <TWAccentThemeMenu isRtl={true} />
                    </React.Fragment>
                )}
                {/* {onClickDesktopSettings && <TWDesktopSettings onClick={onClickDesktopSettings} />}
                {clickSerialConnect && <SerialConnect onClick={clickSerialConnect} />}
                {clickBleConnect && <BleConnect onClick={clickBleConnect} />}
                {<SerialDisconnect onClick={clickSerialDisconnect} />}
                {clickDownloadCode && <DownloadCode onClick={clickDownloadCode} />}
                {clickEspSend && <EspSend onClick={clickEspSend} />}
                {clickSendWifi && <SendWifi onClick={clickSendWifi} />} */}
                
            </MenuSection>
        </MenuBarMenu>
    </MenuLabel>
);

// async function bleConnect(){
//     const devices = await navigator.bluetooth.getDevices();
//     alert(devices);
//     console.log(devices);
// }



SettingsMenu.propTypes = {
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    isRtl: PropTypes.bool,
    onClickDesktopSettings: PropTypes.func,
    onOpenCustomSettings: PropTypes.func,
    onRequestClose: PropTypes.func,
    onRequestOpen: PropTypes.func,
    settingsMenuOpen: PropTypes.bool,
    clickSerialConnect: PropTypes.func,
    clickDownloadCode: PropTypes.func,
    clickBleConnect: PropTypes.func,
    clickEspSend: PropTypes.func,
    clickSendWifi: PropTypes.func
};

export default SettingsMenu;
