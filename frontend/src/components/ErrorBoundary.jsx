import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error("Cozy Garden UI error:", error);
  }

  render() {
    if (this.state.failed) {
      return <main className="error-boundary-screen" role="alert"><h1>The garden needs a moment.</h1><p>Your saved progress is kept on your account. Reload to try again.</p><button onClick={() => window.location.reload()} type="button">Reload Cozy Garden</button><a href="/">Return home</a></main>;
    }
    return this.props.children;
  }
}
