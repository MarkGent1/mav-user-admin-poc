interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
      <p>Error: {message}</p>
    </div>
  );
}
