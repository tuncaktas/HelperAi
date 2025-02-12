import { SafeAreaView, View, Text, TouchableWithoutFeedback, Alert } from 'react-native'
import React, { useState } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { RouterProps } from '../types/navigation'
import { FIREBASE_AUTH } from '../firebase-config'
import { createUserWithEmailAndPassword } from 'firebase/auth'


const RegisterScreen = ({navigation}: RouterProps) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const auth = FIREBASE_AUTH

    const submitRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch (e: any) {
            Alert.alert('There was an error', e.message)
        }
    }

  return (
    <SafeAreaView className='bg-gray-900 h-full'>
       <View className='flex-1 justify-center flex-col space-y-6 m-6'> 
            <Text className='text-4xl text-white text-center mb-10 font-bold'>Create New Account</Text>
            <View className='mb-4 bg-gray-300 rounded-md'>
                <Input inputProps={{ 
                    placeholder: 'Email', 
                    keyboardType: 'email-address',
                    autoCapitalize: 'none',
                    placeholderTextColor: 'gray',
                    }} 
                    onChange={(e) => setEmail(e)} value={email}
                />
            </View>
            <View className='mb-4 bg-gray-300 rounded-md'>
                <Input inputProps={{ 
                    placeholder: 'Password', 
                    keyboardType: 'default',
                    placeholderTextColor: 'gray',
                    secureTextEntry: true,
                }}
                onChange={(e) => setPassword(e)} value={password}
                />
            </View>
            <Button label='Register' onPress={submitRegister} />
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')} >
                <Text className='text-white text-center underline mt-4'>Already have an account?</Text>    
            </TouchableWithoutFeedback>
       </View>
    </SafeAreaView>  
  )
}
 
export default RegisterScreen