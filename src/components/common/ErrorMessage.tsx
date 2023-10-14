import "./ErrorMessage.css";

import React from "react";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error">
      <p>{message}</p>
    </div>
  );
}
