"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native"
import axios from "axios"
import styles from "./TwoFactorAuth.style"

const TwoFactorAuth = ({ userId }) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [secret, setSecret] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEnable2FA = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post("http://votre-api.com/api/enable-2fa", { userId })
      setSecret(response.data.secret)
      setQrCode(response.data.qrCode)
      setIsEnabled(true)
    } catch (error) {
      Alert.alert("Erreur", error.response?.data?.message || "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify2FA = async () => {
    if (!verificationCode) {
      Alert.alert("Erreur", "Veuillez entrer le code de vérification")
      return
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      Alert.alert("Erreur", "Le code doit contenir 6 chiffres.")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post("http://votre-api.com/api/verify-2fa", { userId, token: verificationCode })
      Alert.alert("Succès", response.data.message)
      setVerificationCode(""); // Réinitialiser le champ
    } catch (error) {
      Alert.alert("Erreur", error.response?.data?.message || "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentification à deux facteurs</Text>
      {!isEnabled ? (
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleEnable2FA}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? "Activation en cours..." : "Activer la 2FA"}</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.secretText}>Votre secret : {secret}</Text>
          {qrCode && <Image source={{ uri: qrCode }} style={styles.qrCode} />}
          <TextInput
            style={styles.input}
            placeholder="Entrez le code à 6 chiffres"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleVerify2FA}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>{isLoading ? "Vérification..." : "Vérifier le code"}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

export default TwoFactorAuth