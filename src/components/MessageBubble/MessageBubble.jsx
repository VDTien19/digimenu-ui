import React from 'react';
import classNames from 'classnames/bind';
import styles from './MessageBubble.module.scss';

const cx = classNames.bind(styles);

function MessageBubble({ isCustomer, message, orderData }) {
  return (
    <div className={cx('bubble', { customer: isCustomer })}>
      <p>{message}</p>
      {orderData && (
        <div className={cx('order-details')}>
          <h4>Chi tiết đơn hàng:</h4>
          <ul>
            {orderData.items.map((item) => (
              <li key={item._id}>
                {item.item_id.name} x {item.quantity} - {item.price.toLocaleString()} VNĐ
              </li>
            ))}
          </ul>
          <p>Tổng tiền: {orderData.total_cost.toLocaleString()} VNĐ</p>
          <p>Trạng thái: {orderData.status}</p>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;