import { useEffect } from "react";

declare global {
  interface Window {
    chatbase: any;
  }
}

type ChatbaseFuncType = ((...args: any[]) => void) & { q?: any[][] };

const ChatbaseWidget = () => {
  useEffect(() => {
    if (
      !window.chatbase ||
      window.chatbase("getState") !== "initialized"
    ) {
      const chatbaseFunc: ChatbaseFuncType = (...args: any[]) => {
        if (!chatbaseFunc.q) chatbaseFunc.q = [];
        chatbaseFunc.q.push(args);
      };

      const proxy = new Proxy(chatbaseFunc, {
        get(target, prop) {
          if (prop === "q") return target.q;
          return (...args: any[]) => target(prop, ...args);
        },
      });

      window.chatbase = proxy;

      const onLoad = () => {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "oIc5s7yJmsZcZElZ364ZV";
        script.setAttribute("domain", "www.chatbase.co");
        document.body.appendChild(script);
      };

      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
      }
    }
  }, []);

  return null;
};

export default ChatbaseWidget;
