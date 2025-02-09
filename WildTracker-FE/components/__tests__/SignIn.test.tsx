import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignIn from '../../app/auth/SignIn'; // Adjust the path to your component
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useRouter } from 'expo-router';

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock storeUserData utility
jest.mock('../../utils/auth', () => ({
  storeUserData: jest.fn(),
}));

describe('SignIn Component', () => {
  test('renders the sign-in form', () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Create New Account')).toBeTruthy();
  });

  test('displays error for empty email', () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    fireEvent.changeText(getByPlaceholderText('Email'), '');
    fireEvent.press(getByText('Sign In'));
    expect(getByText('Email is required')).toBeTruthy();
  });

  test('displays error for invalid email', () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.press(getByText('Sign In'));
    expect(getByText('Invalid email format')).toBeTruthy();
  });

  test('displays error for empty password', () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    fireEvent.changeText(getByPlaceholderText('Password'), '');
    fireEvent.press(getByText('Sign In'));
    expect(getByText('Password is required')).toBeTruthy();
  });

  test('displays error for short password', () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    fireEvent.changeText(getByPlaceholderText('Password'), '123');
    fireEvent.press(getByText('Sign In'));
    expect(getByText('Password must be at least 6 characters')).toBeTruthy();
  });

  
  test('calls Firebase sign-in with valid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: '123' },
    });

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
    });
  });
  test('handles Firebase errors', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');

    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({
      code: 'auth/wrong-password',
    });

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(getByText('Incorrect password')).toBeTruthy();
    });
  });

  test('navigates to Dashboard on success', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    const router = useRouter();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: '123' },
    });

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/pages/Dashboard');
    });
  });

  test('disables button during loading', () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    fireEvent.press(getByText('Sign In'));
    expect(getByText('Signing In...')).toBeTruthy();
  });
});