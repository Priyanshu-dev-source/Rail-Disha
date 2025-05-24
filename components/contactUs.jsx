import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
  Roboto_100Thin,
} from "@expo-google-fonts/roboto";

export default function ContactScreen() {
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Roboto_100Thin,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    subject: "",
    message: "",
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add your form submission logic here
    alert("Message sent successfully!");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>How can we help you?</Text>

          <View style={styles.containerValues}>
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Your Name <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputContainer}>
                  <Feather
                    name="user"
                    size={18}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    value={formData.name}
                    onChangeText={(text) => handleChange("name", text)}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Your Email <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputContainer}>
                  <Feather
                    name="mail"
                    size={18}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Your Email"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => handleChange("email", text)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Your Phone</Text>
                <View style={styles.inputContainer}>
                  <Feather
                    name="phone"
                    size={18}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Your Phone"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(text) => handleChange("phone", text)}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Your Company</Text>
                <View style={styles.inputContainer}>
                  <Feather
                    name="briefcase"
                    size={18}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Your Company"
                    value={formData.company}
                    onChangeText={(text) => handleChange("company", text)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.formFullWidth}>
              <Text style={styles.label}>Your Website</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="globe"
                  size={18}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Your Website"
                  keyboardType="url"
                  value={formData.website}
                  onChangeText={(text) => handleChange("website", text)}
                />
              </View>
            </View>

            <View style={styles.formFullWidth}>
              <Text style={styles.label}>Subject</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="message-square"
                  size={18}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Subject"
                  value={formData.subject}
                  onChangeText={(text) => handleChange("subject", text)}
                />
              </View>
            </View>

            <View style={styles.formFullWidth}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Message"
                multiline
                numberOfLines={5}
                value={formData.message}
                onChangeText={(text) => handleChange("message", text)}
              />
            </View>

            <View style={styles.attachFileContainer}>
              <Feather name="paperclip" size={16} color="#1E88E5" />
              <Text style={styles.attachFileText}>Attach File</Text>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerValues: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "full",
    marginTop:50
    // backgroundColor:"red"
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 40,
    // fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20,
    fontFamily: "Roboto_700Bold",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 20,
    paddingLeft: 5,
    fontFamily: "Roboto_400Regular",
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    gap:15
    // paddingTop:30
  },
  formGroup: {
    width: "48%",
  },
  formFullWidth: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
    fontFamily: "Roboto_700Bold",
  },
  required: {
    color: "red",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#333",
    fontFamily: "Roboto_400Regular",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    fontFamily: "Roboto_400Regular",
  },
  attachFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"start",
    width:350,
    marginBottom: 20,
    // backgroundColor:"red"
  },
  attachFileText: {
    marginLeft: 5,
    color: "#1E88E5",
    fontFamily: "Roboto_400Regular",
  },
  submitButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 20,
    width:350
  },
  submitButtonText: {
    color: "#fff",
    // fontWeight: 'bold',
    fontFamily: "Roboto_700Bold",
  },
});
