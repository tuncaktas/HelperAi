import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Button = ({ onPress, label, className }: {   
    onPress: () => void,
    label: string,
    className?: string
 }) => {
  return (
    <TouchableOpacity className={'border-gray-300 border-2 p-4 rounded-md' + className} onPress={onPress}>
      <Text className='text-center text-xl text-white'>{label}</Text>
    </TouchableOpacity>
  )
}

export default Button