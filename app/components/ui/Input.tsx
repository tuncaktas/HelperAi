import { View, TextInput, TextInputProps } from 'react-native'
import React from 'react'

const Input = ({ inputProps, onChange, value, className }: { 
    inputProps?: TextInputProps,
    onChange: (e: string) => void, 
    value: any,
    className?: string  
}) => {

  return (
    <View className='flex flex-row items-center justify-between'>
        <TextInput 
        className={'p-4 rounded-md bg-gray-300' + className}
        onChangeText={onChange} 
        {...inputProps} 
        value={value}/>
    </View>
  )
}

export default Input