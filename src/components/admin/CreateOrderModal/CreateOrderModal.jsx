import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './CreateOrderModal.module.scss';

const cx = classNames.bind(styles);

function CreateOrderModal () {
    return (
        <div className={cx('wrapper')}>
            <h1>CreateOrderModal</h1>
        </div>
    );
}

export default CreateOrderModal;
