import React, { Component, ReactNode, ErrorInfo } from 'react';
import './PokemonErrorBoundary.scss';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class PokemonErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(_: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('🚨 Pokédex Error caught:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1 className="title">Oh No! A Wild Error Appeared!</h1>
          <div className="error-actions">
            <button className="btn home" onClick={this.handleGoHome}>🏠 Return to Pokédex</button>
          </div>

          <div className="tip">
            💡 <span>Tip: Try refreshing the page or check your internet connection!</span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PokemonErrorBoundary;
