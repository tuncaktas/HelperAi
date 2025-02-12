import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getEventSource } from '../utils/event-source';

interface Message {
  author: 'user' | 'ai'
  message: string
}

const ChatScreen = () => {
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [history, setHistory] = useState<Message[]>([]);


  const scrollRef = useRef<ScrollView>(null);

  const scrollDown = () => {
    scrollRef.current?.scrollToEnd({ animated: false });    
  }

  const updateHistoryWithTyping = (newMessageContent: string) => {
    setHistory(currentHistory => {
      const historyLength = currentHistory.length;
      if (historyLength > 0 && currentHistory[historyLength -1].
      author === 'ai') {
            let newHistory = [...currentHistory];
            newHistory[historyLength -1].message += newMessageContent
            return newHistory
      }else {
        return [...currentHistory, { author: 'ai', message: newMessageContent }]
      }
    })
  }

  const sendMessage = () => {
    scrollDown()
    setHistory([...history, { author: 'user', message: currentMessage}])
    setCurrentMessage('')

    let tokenIndex = 0;
    const prompt = {
      prompt: currentMessage
    }
    const es = getEventSource(prompt)
    es.addEventListener('open', () => {
      setIsThinking(true)
    })

    es.addEventListener('message', async (e: any) => {
      tokenIndex++;
      setIsThinking(false)
      try {
        const response = await JSON.parse(e.data);
        switch (response.event) {
          case 'TYPING':
            setIsTyping(true)
            updateHistoryWithTyping(response.message)
            break;
          case 'DONE':
            setIsTyping(false)
            scrollDown()
            es.close()
            break;
          default:
            updateHistoryWithTyping(response.message)
            break;
        }
      } catch (e) {
        console.log(e)
      }
      es.addEventListener('error', e => {
        console.log('Error SSE Connection', e)
        setIsThinking(false)
      })
    })
    
  }




  return (
    <SafeAreaView className='flex-1 bg-gray-900'>
     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height" } className="flex-1 px-4" >
      <ScrollView className='mt-2 mb-4 h-[90%]' ref={scrollRef}>
        {history.map((msg, i) => {
          return <View key={i} className={`flex ${msg.author === 'user'? 'flex-row' : 'flex-row-reverse'} mt-2`}>
              <View className={`w-[80%] rounded-md ${msg.author === 'user'? 'bg-blue-500' : 'bg-gray-400'} p-4`}>
                <Text className='text-white'>{msg.message}</Text>
              </View>
            </View>
      })}
      </ScrollView>
      <View className='flex flex-row space-x-2 item-center'>
        <View className='w-[90%]'>
          <TextInput 
            onChangeText={e => setCurrentMessage (e)}
            className='p-4 rounded-md bg-gray-300'
            placeholder='Ask something...'
            value={currentMessage}
          />
        </View>
        <View>
          <TouchableOpacity onPress={sendMessage}>
            <AntDesign name='caretright' 
            size={24} 
            color='grey'
            disabled={isThinking || isTyping} />
          </TouchableOpacity>
        </View>
      </View>
     </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatScreen