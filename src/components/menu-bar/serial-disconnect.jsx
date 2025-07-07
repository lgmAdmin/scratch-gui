import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {MenuItem} from '../menu/menu.jsx';
import icon from './tw-desktop-icon.svg';
import styles from './settings-menu.css';

const SerialDisconnect = props => (
    <MenuItem onClick={props.onClick}>
        <div className={styles.option}>
            <img
                src={icon}
                draggable={false}
                width={24}
                height={24}
                alt=""
            />
            <FormattedMessage
                defaultMessage="串口断开"
                description="Button in menu bar under settings to open desktop app settings"
                id="serialDisconnect"
            />
        </div>
    </MenuItem>
);

SerialDisconnect.propTypes = {
    onClick: PropTypes.func
};

export default SerialDisconnect;
