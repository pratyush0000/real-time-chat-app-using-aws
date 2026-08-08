import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

function dayLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MessageList({ messages, username, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className="message-list message-list--empty">
        <div className="spinner" aria-label="Loading messages" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="message-list message-list--empty">
        <p className="empty-state">No messages yet. Start the conversation.</p>
      </div>
    );
  }

  let lastDay = null;
  let lastSender = null;

  return (
    <div className="message-list">
      {messages.map((msg, idx) => {
        const day = dayLabel(msg.createdAt);
        const showDivider = day !== lastDay;
        lastDay = day;

        const showMeta = msg.sender !== lastSender || showDivider;
        lastSender = msg.sender;

        return (
          <React.Fragment key={msg.id ?? idx}>
            {showDivider && (
              <div className="day-divider">
                <span>{day}</span>
              </div>
            )}
            <MessageBubble
              message={msg}
              isOwn={msg.sender === username}
              showMeta={showMeta}
            />
          </React.Fragment>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
