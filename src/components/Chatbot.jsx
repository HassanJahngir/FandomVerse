import { useEffect, useRef, useState } from "react";
import { answerQuestion, bot } from "../lib/catalog";
import Icon from "./Icon";
import { Modal } from "./UI";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: bot.greeting, links: [] },
  ]);
  const end = useRef(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, open]);
  function ask(text) {
    if (!text.trim()) return;
    setMessages((previous) => [
      ...previous.slice(-28),
      { role: "you", text },
      { role: "bot", ...answerQuestion(text) },
    ]);
    setQuestion("");
  }
  return (
    <>
      <button
        className="chat-launcher"
        onClick={() => setOpen(true)}
        aria-label="Ask Orbit, scripted assistant"
      >
        <span className="orbit-face" aria-hidden="true">
          ✦
        </span>
        <span>Ask Orbit</span>
        <span className="online-dot" />
      </button>
      {open && (
        <Modal title="Meet Orbit" onClose={() => setOpen(false)}>
          <p className="muted small-text">
            Your local, scripted fandom guide. No live AI.
          </p>
          <div
            className="chat-messages"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.role}`}>
                <strong>{message.role === "bot" ? "Orbit" : "You"}</strong>
                <p>{message.text}</p>
                {message.links?.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                    <Icon name="arrow" size={15} />
                  </a>
                ))}
              </div>
            ))}
            <span ref={end} />
          </div>
          <div className="quick-replies">
            {bot.suggestions.map((suggestion) => (
              <button key={suggestion} onClick={() => ask(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              ask(question);
            }}
          >
            <label className="sr-only" htmlFor="chat-question">
              Ask Orbit a question
            </label>
            <input
              id="chat-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Which world are you exploring?"
              maxLength={300}
            />
            <button
              className="icon-button"
              aria-label="Send question"
              disabled={!question.trim()}
            >
              <Icon name="arrow" />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
