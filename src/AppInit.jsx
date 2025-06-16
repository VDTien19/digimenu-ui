import { useEffect } from 'react';
import { getTables } from '~/api/tableApi';
import socket from '~/socket';
import { connectSocket, joinAllRoomTables } from '~/socket/socketServices';

function AppInit() {
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) return;

        connectSocket();

        socket.once('connect', async () => {
            console.log('🔄 Socket auto-connected from AppInit');
            try {
                const { data: tables } = await getTables();
                joinAllRoomTables(tables);
            } catch (err) {
                console.error('❌ Failed to join rooms after reload:', err);
            }
        });
    }, []);

    return null;
}

export default AppInit;
