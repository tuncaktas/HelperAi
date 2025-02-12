import EventSource from 'react-native-event-source'

export const getEventSource = (prompt: {prompt: string}) => {
    const es= new EventSource('http://192.168.1.103:8000/chat', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(prompt)
    })
    return es
}