// socketService.js
import socket from '~/socket';

/**
 * Emit sự kiện join vào tất cả các room bàn theo danh sách table
 * @param {Array} tables - Danh sách table từ API
 */
export function joinAllRoomTables(tables = []) {
    const rooms = tables
        .map(table => `room_table_${table._id}`)
        .filter(Boolean);

    if (rooms.length > 0) {
        socket.emit('join_all_rooms', rooms);
        console.log(`✅ Joined rooms: ${rooms.join(', ')}`);
    } else {
        console.warn('⚠️ No valid rooms to join.');
    }
}

export function connectSocket() {
    if (!socket.connected) {
        socket.connect();

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error);
        });
    }
}