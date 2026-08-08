import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { withAuthenticator, ThemeProvider as AmplifyThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/api';
import { graphqlOperation } from '@aws-amplify/api-graphql';
import { listMessages } from './graphql/queries';
import { onCreateMessage } from './graphql/subscriptions';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';

import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import ErrorBanner from './components/ErrorBanner';
import amplifyTheme from './theme';
import { useTheme } from './ThemeContext';
import './App.css';

const client = generateClient();

const safeCreateMessage = /* GraphQL */ `
  mutation SafeCreateMessage($input: CreateMessageInput!) {
    safeCreateMessage(input: $input) {
      id
      content
      sender
      createdAt
    }
  }
`;

function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function getUserInfo() {
      try {
        const session = await fetchAuthSession();
        const payload = session.tokens?.idToken?.payload || {};
        const actualUsername =
          payload['cognito:username'] ||
          payload.username ||
          payload.preferred_username ||
          payload.email?.split('@')[0] ||
          'anonymous';
        setUsername(actualUsername);
      } catch (err) {
        console.error('Error getting user info:', err);
        setError('Failed to get user info.');
      }
    }

    getUserInfo();
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const result = await client.graphql({
        query: listMessages,
        authMode: 'userPool',
      });
      const items = result.data?.listMessages?.items || [];
      const sorted = [...items].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setMessages(sorted);
    } catch (err) {
      console.error('Error fetching messages:', JSON.stringify(err, null, 2));
      setError('Failed to fetch messages.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || !username || isSending) return;

    setIsSending(true);
    try {
      const input = {
        content: trimmed,
        sender: username,
        createdAt: new Date().toISOString(),
      };

      const result = await client.graphql(
        graphqlOperation(safeCreateMessage, { input })
      );

      console.log('Message sent successfully:', result);

      setMessage('');
      await fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err?.message || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!username) return;

    fetchMessages();

    const subscription = client
      .graphql({
        query: onCreateMessage,
        authMode: 'userPool',
      })
      .subscribe({
        next: async () => {
          setIsOnline(true);
          await fetchMessages();
        },
        error: (err) => {
          console.error('Subscription error:', JSON.stringify(err, null, 2));
          setIsOnline(false);
          setError('Real-time updates failed.');
        },
      });

    setIsOnline(true);

    return () => subscription.unsubscribe();
  }, [username, fetchMessages]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Sign-out failed.');
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-app__panel">
        <ChatHeader username={username} isOnline={isOnline} onSignOut={handleSignOut} />

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        <MessageList messages={messages} username={username} isLoading={isLoading} />

        <MessageInput
          value={message}
          onChange={setMessage}
          onSend={sendMessage}
          disabled={!message.trim() || isSending}
        />
      </div>
    </div>
  );
}

const formFields = {
  signUp: {
    email: {
      order: 2,
      isRequired: true,
      label: 'Email',
      placeholder: 'Enter your email',
    },
  },
};

const AuthenticatedChat = withAuthenticator(Chat, {
  hideSignUp: false,
  formFields,
});

export default function ChatApp() {
  const { theme } = useTheme();

  return (
    <AmplifyThemeProvider theme={amplifyTheme} colorMode={theme}>
      <AuthenticatedChat />
    </AmplifyThemeProvider>
  );
}
