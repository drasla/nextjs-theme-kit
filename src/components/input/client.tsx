"use client";

import {
    ChangeEvent,
    ChangeEventHandler,
    ForwardedRef,
    KeyboardEvent,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";

type InputClientProps = {
    inputRef: ForwardedRef<HTMLInputElement>;
    value?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    formatMode?: "numeric" | "uppercase" | "lowercase" | "alphanumeric";
    inputPrefix?: string;
    inputSuffix?: string;
    shrink?: boolean;
    prefix?: ReactNode;
    error?: string;
    label?: string;
};

function InputClient({
    inputRef,
    value = "",
    onChange,
    onKeyDown,
    formatMode,
    inputPrefix = "",
    inputSuffix = "",
    shrink: shrinkProp,
    prefix,
    error,
    label,
}: InputClientProps) {
    const shrink = shrinkProp || !!prefix;
    const [isFocused, setIsFocused] = useState(shrink);
    const localInputRef = useRef<HTMLInputElement>(null);
    const hasPrefixSuffix = inputPrefix || inputSuffix;

    // ref 동기화
    useEffect(() => {
        if (typeof inputRef === "function") {
            inputRef(localInputRef.current);
        } else if (inputRef && "current" in inputRef) {
            inputRef.current = localInputRef.current;
        }
    }, [inputRef]);

    // DOM 요소 찾기 및 이벤트 리스너 등록
    useEffect(() => {
        const inputElement = localInputRef.current;
        if (!inputElement) return;

        // 기존 prefixSuffixUtils 로직
        const prefixSuffixUtils = hasPrefixSuffix
            ? {
                  getValidRange: () => {
                      const prefixLength = inputPrefix.length;
                      const valueLength = value.length;
                      return {
                          start: prefixLength,
                          end: prefixLength + valueLength,
                          total: prefixLength + valueLength + inputSuffix.length,
                      };
                  },

                  enforceCursorPosition: () => {
                      if (!inputElement) return;

                      const cursorStart = inputElement.selectionStart || 0;
                      const cursorEnd = inputElement.selectionEnd || 0;
                      if (prefixSuffixUtils) {
                          const range = prefixSuffixUtils.getValidRange();

                          if (cursorStart !== cursorEnd) {
                              const newStart = Math.max(cursorStart, range.start);
                              const newEnd = Math.min(cursorEnd, range.end);

                              if (newStart !== cursorStart || newEnd !== cursorEnd) {
                                  inputElement.setSelectionRange(newStart, newEnd);
                              }
                          } else if (cursorStart < range.start) {
                              inputElement.setSelectionRange(range.start, range.start);
                          } else if (cursorStart > range.end) {
                              inputElement.setSelectionRange(range.end, range.end);
                          }
                      }
                  },
              }
            : null;

        // 핸들러 정의
        const handleFocus = () => {
            setIsFocused(true);
            if ((inputPrefix || inputSuffix) && prefixSuffixUtils) {
                prefixSuffixUtils.enforceCursorPosition();
            }

            // 포커스 스타일 업데이트
            const container = inputElement.closest(".relative");
            const fieldset = container?.querySelector("fieldset");
            const labelElement = container?.querySelector("label");

            if (fieldset && !error) {
                fieldset.classList.add("border-primary-main");
                fieldset.classList.remove("border-disabled-main");
            }

            if (labelElement && !error) {
                labelElement.classList.add("text-primary-main");
            }
        };

        const handleBlur = () => {
            const shouldStayFocused = value !== "" || !!prefix;
            setIsFocused(shouldStayFocused);

            // 블러 스타일 업데이트
            const container = inputElement.closest(".relative");
            const fieldset = container?.querySelector("fieldset");
            const labelElement = container?.querySelector("label");

            if (fieldset && !error) {
                fieldset.classList.remove("border-primary-main");
                fieldset.classList.add("border-disabled-main");
            }

            if (labelElement && !error) {
                labelElement.classList.remove("text-primary-main");
            }
        };

        const isAllowedKeyCombo = (e: KeyboardEvent<HTMLInputElement>) => {
            const isCtrlOrCmd = e.ctrlKey || e.metaKey;
            if (isCtrlOrCmd && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) {
                return true;
            }

            const navigationKeys = [
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                "Backspace",
                "Delete",
                "Enter",
                "Tab",
                "Escape",
                "Home",
                "End",
                "PageUp",
                "PageDown",
            ];

            return navigationKeys.includes(e.key);
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (hasPrefixSuffix && prefixSuffixUtils) {
                const range = prefixSuffixUtils.getValidRange();

                if (
                    e.key === "Backspace" &&
                    inputElement.selectionStart === range.start &&
                    inputElement.selectionEnd === range.start &&
                    value === ""
                ) {
                    e.preventDefault();
                    return;
                }

                if (
                    e.key === "Delete" &&
                    inputElement.selectionStart === range.end &&
                    inputElement.selectionEnd === range.end
                ) {
                    e.preventDefault();
                    return;
                }
            }

            if (onKeyDown) {
                onKeyDown(e);
            } else if (formatMode === "numeric") {
                if (isAllowedKeyCombo(e)) return;
                if ((e.key >= "0" && e.key <= "9") || e.key === "-" || e.key === ".") return;
                e.preventDefault();
            } else if (formatMode === "uppercase") {
                if (isAllowedKeyCombo(e)) return;
                if (e.key.length === 1) {
                    e.preventDefault();
                    const start = inputElement.selectionStart ?? 0;
                    const end = inputElement.selectionEnd ?? 0;

                    const newValue =
                        value.substring(0, start - inputPrefix.length) +
                        e.key.toUpperCase() +
                        value.substring(end - inputPrefix.length);

                    if (onChange) {
                        onChange({
                            target: { value: newValue },
                            currentTarget: { value: newValue },
                        } as ChangeEvent<HTMLInputElement>);

                        setTimeout(() => {
                            inputElement.setSelectionRange(start + 1, start + 1);
                        }, 0);
                    }
                }
            } else if (formatMode === "lowercase") {
                if (isAllowedKeyCombo(e)) return;
                if (e.key.length === 1) {
                    e.preventDefault();
                    const start = inputElement.selectionStart ?? 0;
                    const end = inputElement.selectionEnd ?? 0;

                    const newValue =
                        value.substring(0, start - inputPrefix.length) +
                        e.key.toLowerCase() +
                        value.substring(end - inputPrefix.length);

                    if (onChange) {
                        onChange({
                            target: { value: newValue },
                            currentTarget: { value: newValue },
                        } as ChangeEvent<HTMLInputElement>);

                        setTimeout(() => {
                            inputElement.setSelectionRange(start + 1, start + 1);
                        }, 0);
                    }
                }
            } else if (formatMode === "alphanumeric") {
                if (isAllowedKeyCombo(e)) return;
                if (!/^[a-zA-Z0-9.-]$/.test(e.key)) {
                    e.preventDefault();
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
            if (
                ["Home", "End", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                    e.key,
                ) &&
                prefixSuffixUtils
            ) {
                prefixSuffixUtils.enforceCursorPosition();
            }
        };

        const handleClick =
            hasPrefixSuffix && prefixSuffixUtils
                ? () => {
                      prefixSuffixUtils.enforceCursorPosition();
                  }
                : null;

        // 이벤트 리스너 등록
        if (!shrink) {
            inputElement.addEventListener("focus", handleFocus);
            inputElement.addEventListener("blur", handleBlur);
        }

        if (onKeyDown || formatMode) {
            inputElement.addEventListener("keydown", handleKeyDown as any);
        }

        if (handleKeyUp) {
            inputElement.addEventListener("keyup", handleKeyUp as any);
        }

        if (handleClick) {
            inputElement.addEventListener("click", handleClick);
            inputElement.addEventListener("mouseup", handleClick);
        }

        // 정리
        return () => {
            if (!shrink) {
                inputElement.removeEventListener("focus", handleFocus);
                inputElement.removeEventListener("blur", handleBlur);
            }

            if (onKeyDown || formatMode) {
                inputElement.removeEventListener("keydown", handleKeyDown as any);
            }

            if (handleKeyUp) {
                inputElement.removeEventListener("keyup", handleKeyUp as any);
            }

            if (handleClick) {
                inputElement.removeEventListener("click", handleClick);
                inputElement.removeEventListener("mouseup", handleClick);
            }
        };
    }, [value, onChange, onKeyDown, formatMode, inputPrefix, inputSuffix, shrink, prefix, error]);

    // 레이블 및 필드셋 상태 업데이트
    useEffect(() => {
        const inputElement = localInputRef.current;
        if (!inputElement) return;

        const isActive = isFocused || value !== "" || !!prefix;
        const container = inputElement.closest(".relative");
        const labelElement = container?.querySelector("label") as HTMLElement;
        const legend = container?.querySelector("legend") as HTMLElement;

        if (labelElement && label) {
            if (isActive) {
                labelElement.classList.add("text-xs", "-top-2", "transform-none");
                labelElement.classList.remove("text-base", "top-1/2", "-translate-y-1/2");
            } else {
                labelElement.classList.remove("text-xs", "-top-2", "transform-none");
                labelElement.classList.add("text-base", "top-1/2", "-translate-y-1/2");
            }
        }

        if (legend && label) {
            legend.style.visibility = isActive ? "visible" : "hidden";
        }
    }, [isFocused, value, prefix, label]);

    return null;
}

export default InputClient;
