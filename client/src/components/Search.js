import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import RoomBooking from './RoomBooking'


const Search = () => {
    const [time, setTime] = useState('')
    const [rooms, setRooms] = useState([])
    const [selectedRoom, setSelectedRoom] = useState('')
    const [showSearch, setShowSearch] = useState(false)

    useEffect(() => {
        const tokenValue = Cookies.get('token')
        const setToken = async () => {
            const { data } = await axios.get('http://localhost:5000/api/room/token')
            Cookies.set('token', data)
        }
        if (!tokenValue) setToken()
    }, [])

    const handleSubmit = async () => {
        const startTime = time.split('-')[0]
        const endTime = time.split('-')[1]

        const { data } = await axios.post('http://localhost:5000/api/room/', { start: startTime, end: endTime })
        setShowSearch(true)
        setRooms(data)
    }

    const handleMeetSelection = async (room) => {
        setSelectedRoom(room)
    }

    const handleBookedRoom = (id) => {
        setRooms(rooms.filter(room => room._id !== id));
    }


    const formatTimeDifference = (milliseconds) => {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
        const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        return `${seconds} second${seconds > 1 ? 's' : ''}`;
    };

    const parseTimeString = (timeString) => {
        const [time, modifier] = timeString.split(/(?=[APM])/);
        let [hours, minutes] = time.split(':');

        if (modifier === 'PM' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        }
        if (modifier === 'AM' && hours === '12') {
            hours = '00';
        }
        return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) || 0 };
    };

    const calculateMeetingStartTime = (date, time) => {
        const { hours, minutes } = parseTimeString(time);
        const meetingStartTime = new Date(date);
        meetingStartTime.setHours(hours, minutes, 0, 0);
        return meetingStartTime;
    };



    return (

        <>
            <div className='search'>
                <input
                    type='text'
                    placeholder='start time'
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
                <button onClick={handleSubmit}>Search</button>
            </div>

            {showSearch && (
                <div className='rooms-container'>
                    {rooms.map((room, indx) => {
                        const meetingStartTime = calculateMeetingStartTime(room.on, room.start);
                        const timeDifference = formatTimeDifference(meetingStartTime - new Date());

                        return (
                            <div key={indx} className='room' onClick={() => handleMeetSelection(room)}>
                                <div style={{ fontStyle: 'italic', fontSize: '1.8rem' }}>{room.RoomName}</div>
                                <div style={{ marginTop: '2rem' }}>Starts in: {timeDifference}</div>
                            </div>
                        );
                    })}
                </div >
            )}

            {
                selectedRoom && (
                    <RoomBooking
                        id={selectedRoom._id}
                        on={selectedRoom.on}
                        start={selectedRoom.start}
                        end={selectedRoom.end}
                        selectedRoom={selectedRoom}
                        rooms={rooms}
                        onBook={handleBookedRoom}
                    />
                )
            }
        </>
    )
}

export default Search
