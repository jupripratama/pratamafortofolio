import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-6 border border-red-500/20 rounded-xl bg-red-500/5 text-slate-300 font-mono text-xs">
            <span className="text-amber-400 font-bold mb-1">3D Component Error</span>
            <span className="text-slate-400 text-[11px] max-w-sm text-center">
              {this.state.error?.message || 'Gagal memuat komponen 3D.'}
            </span>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
