import React from 'react';
import { colorForName, initialsForName } from '../utils/avatarColor';
import ThemeToggle from './ThemeToggle';

export default function ChatHeader({ username, isOnline, onSignOut }) {
  return (
    <header className="chat-header">
      <div className="chat-header__title">
        <span className="chat-header__logo" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="18" height="18" fill="none">
            <circle cx="8" cy="16" r="3.5" stroke="currentColor" strokeWidth="2" />
            <circle cx="24" cy="16" r="3.5" stroke="currentColor" strokeWidth="2" />
            <line x1="11.5" y1="16" x2="20.5" y2="16" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        <div>
          <h1>Openline</h1>
          <span className={`chat-header__status ${isOnline ? 'is-online' : ''}`}>
            {isOnline ? 'Live' : 'Connecting…'}
          </span>
        </div>
      </div>

      <div className="chat-header__user">
        <div
          className="avatar avatar--sm"
          style={{ backgroundColor: colorForName(username) }}
          aria-hidden="true"
        >
          {initialsForName(username)}
        </div>
        <span className="chat-header__username">{username}</span>
        <ThemeToggle />
        <button className="btn btn--ghost" onClick={onSignOut}>
          Sign Out
        </button>
      </div>
    </header>
  );
}
