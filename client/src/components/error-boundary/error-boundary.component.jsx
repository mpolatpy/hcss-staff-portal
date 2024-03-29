import React from 'react';
import ErrorDisplay from './error-display.component';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.log(error);
    }
  
    render() {
      if (this.state.hasError) {
        return <ErrorDisplay />;
      }
  
      return this.props.children; 
    }
  }

  export default ErrorBoundary;