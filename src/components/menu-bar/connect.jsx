import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {MenuItem} from '../menu/menu.jsx';

import styles from './settings-menu.css';

const Connect = props => (
    <MenuItem onClick={props.onClick}>
        <div className={styles.option}>
            {/* <img
                src={logo}
                draggable={false}
                width={24}
                height={24}
                alt=""
            /> */}
            <FormattedMessage
                defaultMessage="连接"
                description="Button in menu bar under settings to open desktop app settings"
                id="connect"
            />
        </div>
    </MenuItem>
);

Connect.propTypes = {
    onClick: PropTypes.func
};

export default Connect;
