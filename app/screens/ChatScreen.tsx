import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getEventSource } from '../utils/event-source';
import Dots from '../components/ui/Dots';

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
    // Add artificial delay to slow down the text appearance
    setTimeout(() => {
      setHistory(currentHistory => {
        const historyLength = currentHistory.length;
        if (historyLength > 0 && currentHistory[historyLength -1].author === 'ai') {
          let newHistory = [...currentHistory];
          newHistory[historyLength -1].message += newMessageContent;
          return newHistory;
        } else {
          return [...currentHistory, { author: 'ai', message: newMessageContent }];
        }
      });
    }, 100); // Add 100ms delay for each token
  }

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    scrollDown();
    setHistory([...history, { author: 'user', message: currentMessage }]);
    setCurrentMessage('');
    setIsThinking(true); // Show thinking animation immediately

    // Add a slight delay before starting the AI response
    setTimeout(() => {
      let tokenIndex = 0;
      const prompt = {
        prompt: currentMessage
      }
      const es = getEventSource(prompt)

      es.addEventListener('open', () => {
        console.log('SSE Connection opened');
      })

      es.addEventListener('error', e => {
        console.log('Error SSE Connection', e);
        setIsThinking(false);
      })

      es.addEventListener('message', async (e: any) => {
        setIsThinking(false); // Hide thinking animation when first message arrives
        tokenIndex++;
        try {
          const response = await JSON.parse(e.data);
          switch (response.event) {
            case 'TYPING':
              setIsTyping(true);
              updateHistoryWithTyping(response.message);
              break;
            case 'DONE':
              setIsTyping(false);
              scrollDown();
              es.close();
              break;
            default:
              updateHistoryWithTyping(response.message);
              break;
          }
        } catch (e) {
          console.log(e);
        }
      });
    }, 1500); // 1.5 second delay
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-900'>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? "padding" : "height"} 
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* Header */}
        <View className="px-4 py-3 border-b border-gray-800">
          <Text className="text-xl font-semibold text-white">AI Assistant</Text>
          <Text className="text-sm text-gray-400">Always here to help</Text>
        </View>

        {/* Chat Area */}
        <ScrollView 
          className='flex-1 px-4'
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome message if no history */}
          {history.length === 0 && (
            <View className="flex items-center justify-center py-8">
              <Text className="text-gray-400 text-center">
                👋 Hi! I'm your AI assistant.{'\n'}How can I help you today?
              </Text>
            </View>
          )}

          {/* Messages */}
          {history.map((msg, i) => (
            <View 
              key={i} 
              className={`flex ${msg.author === 'user' ? 'flex-row justify-end' : 'flex-row justify-start'} my-2`}
            >
              <View 
                className={`max-w-[80%] rounded-2xl ${
                  msg.author === 'user' 
                    ? 'bg-blue-600 rounded-tr-none' 
                    : 'bg-gray-700 rounded-tl-none'
                } px-4 py-3`}
              >
                <Text className='text-white text-[15px] leading-[22px]'>{msg.message}</Text>
              </View>
            </View>
          ))}

          {/* Thinking animation */}
          {isThinking && (
            <View className="flex flex-row my-2">
              <View className="px-4 py-3">
                <Dots />
              </View>
            </View>
          )}

          {/* Typing animation with message */}
          {isTyping && history.length > 0 && (
            <View className="flex flex-row my-2">
              <View className="max-w-[80%] rounded-2xl bg-gray-700 rounded-tl-none px-4 py-3">
                <Text className='text-white text-[15px] leading-[22px]'>
                  {history[history.length - 1].message}
                </Text>
                <View className="mt-2">
                  <Dots />
                </View>
              </View>
            </View>
          )}

          {/* Extra padding at bottom for better scrolling */}
          <View className="h-4" />
        </ScrollView>

        {/* Input Area */}
        <View className='px-4 py-2 border-t border-gray-800'>
          <View className='flex flex-row items-center space-x-2'>
            <View className='flex-1 bg-gray-800 rounded-full'>
              <TextInput 
                onChangeText={e => setCurrentMessage(e)}
                className='px-4 py-3 text-white'
                placeholder='Type your message...'
                placeholderTextColor="#666"
                value={currentMessage}
                multiline
                maxHeight={100}
              />
            </View>
            <TouchableOpacity 
              onPress={sendMessage}
              disabled={!currentMessage.trim() || isThinking || isTyping}
              className={`w-10 h-10 rounded-full ${
                !currentMessage.trim() || isThinking || isTyping 
                  ? 'bg-gray-800' 
                  : 'bg-blue-600'
              } items-center justify-center`}
            >
              <AntDesign 
                name='arrowup' 
                size={20} 
                color={!currentMessage.trim() || isThinking || isTyping ? '#666' : '#fff'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatScreen;