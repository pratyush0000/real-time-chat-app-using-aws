import React from 'react';
import { colorForName, initialsForName } from '../utils/avatarColor';

export default function MessageBubble({ message, isOwn, showMeta }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`message-row ${isOwn ? 'message-row--own' : ''}`}>
      {!isOwn && (
        <div
          className="avatar avatar--sm message-row__avatar"
          style={{
            backgroundColor: colorForName(message.sender),
            visibility: showMeta ? 'visible' : 'hidden',
          }}
          aria-hidden="true"
        >
          {initialsForName(message.sender)}
        </div>
      )}

      <div className={`bubble ${isOwn ? 'bubble--own' : 'bubble--other'}`}>
        {!isOwn && showMeta && <div className="bubble__sender">{message.sender}</div>}
        <div className="bubble__content">{message.content}</div>
        <div className="bubble__time">{time}</div>
      </div>
    </div>
  );
}
