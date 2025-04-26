import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { graphqlOperation } from '@aws-amplify/api-graphql';
import { listMessages } from './graphql/queries';
import { onCreateMessage } from './graphql/subscriptions';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
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

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

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
          "anonymous";
        setUsername(actualUsername);
      } catch (err) {
        console.error("Error getting user info:", err);
        setError("Failed to get user info.");
      }
    }

    getUserInfo();
  }, []);

  const fetchMessages = async () => {
    try {
      const result = await client.graphql({
        query: listMessages,
        authMode: 'userPool'
      });
      const items = result.data?.listMessages?.items || [];
      const sorted = items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(sorted);
    } catch (err) {
      console.error("Error fetching messages:", JSON.stringify(err, null, 2));
      setError("Failed to fetch messages.");
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !username) return;
  
    try {
      const input = {
        content: message,
        sender: username,
        createdAt: new Date().toISOString()
      };
  
      const result = await client.graphql(
        graphqlOperation(safeCreateMessage, { input })
      );
  
      console.log("Message sent successfully:", result);
  
      setMessage('');
      await fetchMessages(); // 🔥 manually reload message list
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err?.message || "Failed to send message.");
    }
  };
  
  
  

  useEffect(() => {
    if (!username) return;
  
    fetchMessages();
  
    const subscription = client.graphql({
      query: onCreateMessage,
      authMode: 'userPool'
    }).subscribe({
      next: async () => {
        await fetchMessages(); // 🔥 reload message list for everyone
      },
      error: (err) => {
        console.error("Subscription error:", JSON.stringify(err, null, 2));
        setError("Real-time updates failed.");
      }
    });
  
    return () => subscription.unsubscribe();
  }, [username]);
  
  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Sign-out failed.");
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Real-Time Chat</h1>
        <div>
          <strong>{username}</strong>
          <button onClick={handleSignOut} style={{ marginLeft: '15px' }}>Sign Out</button>
        </div>
      </header>

      {error && (
        <div style={{ backgroundColor: '#fdd', padding: '10px', borderRadius: '5px' }}>
          <strong>Error:</strong> {error}
          <button onClick={() => setError('')} style={{ float: 'right' }}>✕</button>
        </div>
      )}

      <div style={{
        height: '500px',
        overflowY: 'auto',
        padding: '16px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#f7f7f7',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.sender === username ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === username ? '#DCF8C6' : '#FFF',
            margin: '5px 0',
            padding: '10px 15px',
            borderRadius: '18px',
            maxWidth: '70%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{msg.sender}</div>
            <div>{msg.content}</div>
            <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px', textAlign: 'right' }}>
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flexGrow: 1,
            padding: '12px',
            borderRadius: '20px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          style={{
            padding: '12px 20px',
            borderRadius: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            fontWeight: 'bold',
            cursor: message.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
