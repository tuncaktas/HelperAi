import { Text, SafeAreaView, TouchableWithoutFeedback, View, TouchableNativeFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouterProps } from '../types/navigation'
import Button from '../components/ui/Button'

const HomeScreen = ({ navigation }: RouterProps ) => {

    const texts = [
        "Hello",
        "Let's chat",
        "Let's code",
        "Let's create",
        "Let's go!",
    ]

    //Logic to handle the typing effect
    const [isTyping, setIsTyping] = useState<boolean>(false)

    //This next state is the state of the current word
    const [currentText, setCurrentText] = useState("")

    //This next state is the state of the current index
    const [currentIndex, setCurrentIndex] = useState(0)
    
    useEffect(() => {
       let timeout: any;

       if (isTyping) {
        if (currentText.length < texts[currentIndex].length) {
            timeout = setTimeout(() => {
                setCurrentText(texts[currentIndex].substring(0, currentText.length + 1))
            }, 100)
        } else {
            setTimeout(() => {
                setIsTyping(false)
            }, 2000)
        }
       } else {
        if (currentText.length > 0) {
            timeout = setTimeout(() => {
                setCurrentText(currentText.substring(0, currentText.length - 1))
            },30)

        }else {
            timeout = setTimeout(() => {
                setIsTyping(true);
                setCurrentIndex((currentIndex + 1) % texts.length)
            }, 1000) // Pause before typing the next text
        }
       }
    }, [isTyping, currentIndex, currentText])
    
    

  return (
    <SafeAreaView className='flex-1 bg-gray-900'>
        <View className='mt-44 px-4'>
            <Text className='text-white text-center text-4xl font-bold'>{currentText}</Text>
        </View>
        <View className='absolute top-[400px] px-4 w-full'>
            <Button label='Login' onPress={() => navigation.navigate('Login')} />
            <TouchableNativeFeedback onPress={() => navigation.navigate('Register')}>
                <Text className='text-white text-center mt-4 text-lg font-bold'>Create an account</Text>
            </TouchableNativeFeedback>
        </View>
    </SafeAreaView>
  )
}

export default HomeScreen
