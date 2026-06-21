import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ApiError } from '../../api/client';

interface StateAction {
  label: string;
  onPress: () => void;
}

interface StateFrameProps {
  icon?: string;
  title?: string;
  message: string;
  primaryAction?: StateAction;
  secondaryAction?: StateAction;
  fullScreen?: boolean;
  children?: React.ReactNode;
}

function StateFrame({
  icon,
  title,
  message,
  primaryAction,
  secondaryAction,
  fullScreen = false,
  children,
}: StateFrameProps) {
  return (
    <View style={[styles.frame, fullScreen ? styles.fullScreen : styles.card]}>
      {children}
      {icon && <Text style={styles.icon}>{icon}</Text>}
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.message}>{message}</Text>
      {primaryAction && (
        <TouchableOpacity style={styles.primaryButton} onPress={primaryAction.onPress}>
          <Text style={styles.primaryButtonText}>{primaryAction.label}</Text>
        </TouchableOpacity>
      )}
      {secondaryAction && (
        <TouchableOpacity style={styles.secondaryButton} onPress={secondaryAction.onPress}>
          <Text style={styles.secondaryButtonText}>{secondaryAction.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function LoadingState({
  message = 'Loading...',
  fullScreen = false,
}: {
  message?: string;
  fullScreen?: boolean;
}) {
  return (
    <StateFrame message={message} fullScreen={fullScreen}>
      <ActivityIndicator size="small" color="#818cf8" />
    </StateFrame>
  );
}

export function EmptyState({
  icon = '◇',
  title,
  message,
  action,
  fullScreen = false,
}: {
  icon?: string;
  title: string;
  message: string;
  action?: StateAction;
  fullScreen?: boolean;
}) {
  return (
    <StateFrame
      icon={icon}
      title={title}
      message={message}
      primaryAction={action}
      fullScreen={fullScreen}
    />
  );
}

export function OfflineState({
  message,
  onRetry,
  secondaryAction,
  fullScreen = false,
}: {
  message?: string;
  onRetry?: () => void;
  secondaryAction?: StateAction;
  fullScreen?: boolean;
}) {
  return (
    <StateFrame
      icon="!"
      title="YOU'RE OFFLINE"
      message={message || 'Check your connection and confirm the Sellio API is reachable.'}
      primaryAction={onRetry ? { label: 'TRY AGAIN', onPress: onRetry } : undefined}
      secondaryAction={secondaryAction}
      fullScreen={fullScreen}
    />
  );
}

export function ErrorState({
  error,
  title = 'SOMETHING WENT WRONG',
  fallbackMessage = 'We could not complete this request.',
  onRetry,
  secondaryAction,
  fullScreen = false,
}: {
  error: unknown;
  title?: string;
  fallbackMessage?: string;
  onRetry?: () => void;
  secondaryAction?: StateAction;
  fullScreen?: boolean;
}) {
  const message = error instanceof Error ? error.message : fallbackMessage;

  if (error instanceof ApiError && error.status === null) {
    return (
      <OfflineState
        message={message}
        onRetry={onRetry}
        secondaryAction={secondaryAction}
        fullScreen={fullScreen}
      />
    );
  }

  return (
    <StateFrame
      icon="!"
      title={title}
      message={message}
      primaryAction={onRetry ? { label: 'TRY AGAIN', onPress: onRetry } : undefined}
      secondaryAction={secondaryAction}
      fullScreen={fullScreen}
    />
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 28,
    backgroundColor: '#070708',
  },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 28,
    backgroundColor: '#121214',
  },
  fullScreen: {
    flex: 1,
  },
  icon: {
    color: '#818cf8',
    fontSize: 40,
    fontWeight: '900',
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  message: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 4,
    borderRadius: 999,
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: '#a5b4fc',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
