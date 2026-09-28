"use client";

import { Component, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ErrorToastBoundaryProps {
  children: ReactNode;
}

interface ErrorToastBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorToastBoundary extends Component<
  ErrorToastBoundaryProps,
  ErrorToastBoundaryState
> {
  state: ErrorToastBoundaryState = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: Error): ErrorToastBoundaryState {
    return {
      hasError: true,
      message: error.message,
    };
  }

  componentDidCatch(error: Error) {
    const unauthorized =
      error.message.toLowerCase().includes("unauthorized") ||
      error.message.includes("401");

    toast({
      variant: "destructive",
      title: unauthorized ? "Access denied" : "Something went wrong",
      description: unauthorized
        ? "You need to be the owner or a member of this document's organization."
        : error.message,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
          <h2 className="text-xl font-semibold">Could not open this document</h2>
          <p className="text-sm text-muted-foreground max-w-md text-center">
            {this.state.message.toLowerCase().includes("unauthorized")
              ? "You need to be the owner or a member of this document's organization."
              : this.state.message}
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            Back to all documents
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
