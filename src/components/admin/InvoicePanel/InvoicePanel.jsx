import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import { CloseIconThin, AddIcon } from '~/components/Icons';
import styles from './InvoicePanel.module.scss';
import InvoiceModal from '~/components/InvoiceModal';
import * as invoiceApi from '~/api/invoiceApi';

const cx = classNames.bind(styles);

function InvoicePanel({ date, onClose }) {
    const [invoices, setInvoices] = useState([]);
    const [invoiceItem, setInvoiceItem] = useState([]);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchInvoicesByDate = async () => {
            try {
                const response = await invoiceApi.getInvoicesByDate(date);
                setInvoices(response.data);
                console.log("response.data: ", response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchInvoicesByDate();
    }, [date])

    const fetchInvoiceById = async (id) => {
        try {
            const response = await invoiceApi.getInvoiceById(id);
            setInvoiceItem(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div
            className={cx(
                'wrapper',
                'bg-opacity-40',
                'flex',
                'items-center',
                'justify-center',
                'z-50',
            )}
        >
            <div className="bg-white rounded-lg w-[400px] shadow-xl relative">
                <div
                    className={cx(
                        'modal-header',
                        'flex',
                        'items-center',
                        'justify-between',
                    )}
                >
                    <h3 className={cx('text-xl', 'font-bold', 'px-2')}>
                        Hóa đơn ngày {date}
                    </h3>
                    <button
                        onClick={onClose}
                        className={cx('close-btn', 'absolute', 'top-2', 'right-2', 'text-gray-600', 'p-2')}
                    >
                        <CloseIconThin className={cx('close-icon')} fill="#26272a" />
                    </button>
                </div>
                {invoices.length === 0 ? (
                    <p
                        className={cx(
                            'text-gray-500',
                            'pb-4',
                            'text-center',
                            'mt-2',
                        )}
                    >
                        Không có hóa đơn nào.
                    </p>
                ) : (
                    <ul className="space-y-2 pt-0 rounded-b-2xl">
                        {invoices.map((invoice) => (
                            <li
                                key={invoice._id}
                                className={cx(
                                    'invoice-item',
                                    'flex',
                                    'justify-between',
                                    'items-center',
                                    'text-2xl',
                                )}
                                onClick={() => {
                                    setShowModal(true);
                                    fetchInvoiceById(invoice._id);
                                    console.log("showModal: ", showModal);
                                }}
                            >
                                <span className={cx('font-medium')}>
                                    Mã: {invoice.invoice_number}
                                </span>
                                <span>
                                    {invoice.total_cost.toLocaleString()} VND
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <InvoiceModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                item={invoiceItem}
            />
        </div>
    );
}

export default InvoicePanel;