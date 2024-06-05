import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios'



const timings = ['10AM-11AM', '11AM-12PM', '12PM-1PM', '1PM-2PM', '2PM-3PM', '4PM-5PM',
    '5PM-6PM', '6PM-7PM', '4PM-6PM'
]

const RoomBooking = ({ id, on, start, end, selectedRoom, rooms, onBook }) => {
    const [unavailableTimings, setUnavailableTimings] = useState([])
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [bookedTimings, setBookedTimings] = useState([]);


    const events = rooms.map(room => ({
        title: room.RoomName,
        start: new Date(room.on)
    }))


    const getFilledTimings = async () => {
        const { data } = await axios.post('http://localhost:5000/api/room/times',
            { on, start, end })
        setUnavailableTimings(data)
    }


    useEffect(() => {
        getFilledTimings()
    }, [selectedRoom])


    const handleBook = async () => {
        const { data } = await axios.put(`http://localhost:5000/api/room/${id}`, { on: selectedDate, time: selectedTime })
        setBookedTimings(prev => [...prev, selectedTime]);
        onBook(id)
    }


    const handleDateClick = (dateInfo) => {
        setSelectedDate(dateInfo.dateStr)
    }

    const renderEventContent = (eventInfo) => (
        <div>
            <i className='event-title'> {eventInfo.event.title}</i>
        </div >
    );


    return (
        <div className='room-booking'>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView='dayGridMonth'
                weekends={false}
                events={events}
                height={'350px'}
                dateClick={handleDateClick}
                eventContent={renderEventContent}
            />


            <div className='timings-list'>
                {timings.map((time, indx) => (
                    <div
                        className='time'
                        key={indx}
                        onClick={() => setSelectedTime(time)}
                        style={{
                            backgroundColor: bookedTimings.includes(time) ? 'green' : unavailableTimings.includes(time) ? 'tomato' : 'white',
                            color: bookedTimings.includes(time) || unavailableTimings.includes(time) ? 'white' : 'black',
                            padding: '4px',
                        }}
                    >
                        {time}
                    </div>
                ))}
            </div>
            <button onClick={() => handleBook(id)} className='book'>book</button>
        </div>
    )
}

export default RoomBooking
