import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React UI Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full rounded-3xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-6 text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold font-display text-white mb-2">Something went wrong</h2>
            <p className="text-xs text-rose-200/80 mb-6 leading-relaxed">
              An unexpected error occurred in the application view. Don't worry, your portfolio data is safe.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-[11px] text-rose-300 text-left overflow-x-auto mb-6 max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs text-white transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 font-bold text-xs text-white shadow-lg shadow-pink-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <Home className="w-3.5 h-3.5" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
