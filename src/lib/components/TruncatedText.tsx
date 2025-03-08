import React from "react";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, maxLength = 200 }) => {
  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  const truncated = text.substring(0, maxLength) + "...";
  return <p>{truncated}</p>;
};

export default TruncatedText;