import React, { useMemo, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
// UI
import { Button } from "@heroui/react";
import { Card, CardHeader, CardBody } from "@heroui/react";
// Icons
import { Copy } from "lucide-react";

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  value,
  title,
  language = "json",
  maxHeight = 420,
  wrap = false,
  showLineNumbers = false,
  prettyJson = true,
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const codeStr = useMemo(() => {
    // 1) если пришло code — берём его как есть
    if (typeof code === "string") return code;

    // 2) если пришёл value — сериализуем
    if (value !== undefined) {
      if (language === "json") {
        try {
          return JSON.stringify(value, null, 2);
        } catch {
          return String(value);
        }
      }
      return String(value);
    }

    // 3) иначе смотрим на children
    if (typeof children === "string") {
      if (language === "json" && prettyJson) {
        try {
          const parsed = JSON.parse(children);
          return JSON.stringify(parsed, null, 2);
        } catch {
          // невалидный json → оставляем как есть
          return children;
        }
      }
      return children;
    }

    // 4) если прокинули React-узлы/объекты — последняя страховка
    try {
      if (language === "json") return JSON.stringify(children, null, 2);
    } catch {}
    return String(children ?? "");
  }, [code, value, children, language, prettyJson]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Фолбэк через textarea (на случай, если clipboard API недоступен)
      const ta = document.createElement("textarea");
      ta.value = codeStr;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } finally {
        document.body.removeChild(ta);
      }
    }
  };
  return (
    <Card shadow="none" radius="sm" className="bg-content2">
      <CardHeader className="flex items-center justify-between gap-2 p-1 px-3">
        <span className="truncate">{title}</span>
        <Button
          size="sm"
          variant="light"
          isIconOnly
          aria-label={copied ? "Copied" : "Copy"}
          onPress={handleCopy}
          className={copied ? "text-success" : ""}
        >
          <Copy size={16} />
        </Button>
      </CardHeader>
      <CardBody className="p-0">
        <div
          style={{
            maxHeight:
              typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
            overflow: "auto",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Highlight
            theme={themes.github}
            code={codeStr}
            language={(language === "js" ? "javascript" : language) as any}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => {
              const mono = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace`;

              return (
                <pre
                  className={className}
                  style={{
                    ...style,
                    margin: 0,
                    padding: "12px 14px",
                    fontSize: 13,
                    lineHeight: 1.55,
                    whiteSpace: wrap ? "pre-wrap" : "pre",
                    wordBreak: wrap ? "break-word" : "normal",
                    tabSize: 2,
                    fontFamily: mono,
                  }}
                >
                  {tokens.map((line, i) => {
                    const ln = i + 1;
                    return (
                      <div
                        key={i}
                        {...getLineProps({ line })}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        {showLineNumbers && (
                          <span
                            aria-hidden
                            style={{
                              width: "3ch",
                              textAlign: "right",
                              paddingRight: 12,
                              opacity: 0.55,
                              userSelect: "none",
                              fontVariantNumeric: "tabular-nums",
                              fontFamily: mono,
                              lineHeight: 1.55,
                            }}
                          >
                            {ln}
                          </span>
                        )}
                        <span
                          style={{
                            display: "inline-block",
                            minWidth: 0,
                            fontFamily: mono,
                            lineHeight: 1.55,
                          }}
                        >
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </span>
                      </div>
                    );
                  })}
                </pre>
              );
            }}
          </Highlight>
        </div>
      </CardBody>
    </Card>
  );
};

export default CodeBlock;

type CodeBlockProps = {
  code?: string;
  value?: unknown;
  title?: string;
  language?:
    | "json"
    | "javascript"
    | "js"
    | "typescript"
    | "ts"
    | "html"
    | "css"
    | "bash"
    | "text";
  maxHeight?: number | string;
  wrap?: boolean;
  showLineNumbers?: boolean;
  prettyJson?: boolean;
  children?: React.ReactNode;
};
