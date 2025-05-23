import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface LoginPageStyles {
  container: ViewStyle;
  formContainer: ViewStyle;
  logoContainer: ViewStyle;
  loginLogo: ImageStyle;
  logoText: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  inputContainer: ViewStyle;
  inputWrapper: ViewStyle;
  input: ViewStyle & TextStyle;
  inputError: ViewStyle;
  errorText: TextStyle;
  clearButton: ViewStyle;
  inputIcons: ViewStyle;
  passwordToggle: ViewStyle;
  loginButton: ViewStyle;
  loginButtonText: TextStyle;
  createAccountButton: ViewStyle;
  createAccountText: TextStyle;
  disabledButton: ViewStyle;
}

export const styles = StyleSheet.create<LoginPageStyles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginLogo: {
    width: 200,
    height: 100,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgb(25, 153, 100)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgb(25, 153, 100)',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  inputIcons: {
    position: 'absolute',
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordToggle: {
    padding: 5,
  },
  loginButton: {
    height: 50,
    backgroundColor: 'rgb(25, 153, 100)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  createAccountText: {
    color: 'rgb(25, 153, 100)',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
