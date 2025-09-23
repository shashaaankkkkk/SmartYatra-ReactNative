import AsyncStorage from '@react-native-async-storage/async-storage'
import { Stack } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, StyleSheet, Text, useColorScheme, View } from 'react-native'

import AuthGuard from '@/components/AuthGuard'



export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [isReady, setIsReady] = useState(false)
  const [initialRoute, setInitialRoute] = useState<string | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const init = async () => {
      const access = await AsyncStorage.getItem('access')
      setInitialRoute(access ? 'tabs' : 'login')

      // Splash animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start()

      await new Promise(res => setTimeout(res, 2000))
      setIsReady(true)
    }

    init()
  }, [])

  if (!isReady) {
    return (
      <View style={styles.splash}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Image
            source={require('../assets/images/icon.png'  )}
            style={styles.logo}
          />
          <Text style={styles.title}>Bus Tracking & Ticketing</Text>
        </Animated.View>
      </View>
    )
  }

  return (

        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }} initialRouteName={initialRoute || 'login'}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="tabs" />
          </Stack>
        </AuthGuard>

  )
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
})
