"use client";

import {
    ChangeEvent,
    ChangeEventHandler,
    ForwardedRef,
    KeyboardEvent,
    ReactNode,
    useEffect,
    useState,
} from "react";
import { THEME_COLOR } from "../../types/theme";

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
    name?: string;
    placeholder?: string;
    color?: THEME_COLOR;
};

function InputClient({
    value = "",
    onChange,
    onKeyDown,
    formatMode,
    inputPrefix = "",
    inputSuffix = "",
    shrink,
    prefix,
    error,
    label,
    name,
    placeholder,
    color,
}: InputClientProps) {
    const [isFocused, setIsFocused] = useState(false);
    const hasPrefixSuffix = inputPrefix || inputSuffix;

    // 이벤트 핸들러 등록
    useEffect(() => {
        if (!name) return;

        const inputElement = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
        if (!inputElement) {
            return;
        }

        const handleFocus = () => {
            setIsFocused(true);
        };

        const handleBlur = () => {
            setIsFocused(false);
        };

        inputElement.addEventListener("focus", handleFocus);
        inputElement.addEventListener("blur", handleBlur);

        return () => {
            inputElement.removeEventListener("focus", handleFocus);
            inputElement.removeEventListener("blur", handleBlur);
        };
    }, [name]);

    // 포맷팅 및 기타 핸들러
    useEffect(() => {
        if (!name) return;

        const inputElement = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
        if (!inputElement) return;

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
                ? () => prefixSuffixUtils.enforceCursorPosition()
                : null;

        if (onKeyDown || formatMode) {
            inputElement.addEventListener("keydown", handleKeyDown as any);
        }
        if (hasPrefixSuffix && prefixSuffixUtils) {
            inputElement.addEventListener("keyup", handleKeyUp as any);
        }
        if (handleClick) {
            inputElement.addEventListener("click", handleClick);
            inputElement.addEventListener("mouseup", handleClick);
        }

        return () => {
            if (onKeyDown || formatMode) {
                inputElement.removeEventListener("keydown", handleKeyDown as any);
            }
            if (hasPrefixSuffix && prefixSuffixUtils) {
                inputElement.removeEventListener("keyup", handleKeyUp as any);
            }
            if (handleClick) {
                inputElement.removeEventListener("click", handleClick);
                inputElement.removeEventListener("mouseup", handleClick);
            }
        };
    }, [value, onChange, onKeyDown, formatMode, inputPrefix, inputSuffix, hasPrefixSuffix, name]);

    // UI 상태 제어
    useEffect(() => {
        if (!name) return;

        const inputElement = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
        if (!inputElement) return;

        // 컨테이너 요소 찾기
        const container = inputElement.closest(".relative");
        if (!container) return;

        // 요소 찾기
        const labelElement = container.querySelector("label") as HTMLElement;
        const legend = container.querySelector("legend") as HTMLElement;
        const fieldset = container.querySelector("fieldset") as HTMLElement;
        if (!labelElement || !legend || !fieldset || !label) return;

        // 상태 확인
        const hasValue = value !== "";
        const hasPrefix = !!prefix;
        const shouldFloatLabel = isFocused || hasValue || hasPrefix || shrink === true;

        console.log(shouldFloatLabel);

        // legend 상태 업데이트 (값이 있거나, 포커스되었거나, prefix가 있거나, shrink가 true일 때 보임)
        if (shouldFloatLabel) {
            legend.classList.remove("hidden");
            legend.classList.add("invisible");
        } else {
            legend.classList.remove("invisible");
            legend.classList.add("hidden");
        }

        // label 상태 업데이트
        if (shouldFloatLabel) {
            // 상단으로 이동하는 애니메이션 적용
            labelElement.classList.add("text-xs", "-top-2", "transform-none");
            labelElement.classList.remove("text-base", "top-1/2", "-translate-y-1/2");
        } else {
            // 기본 위치로 이동
            labelElement.classList.remove("text-xs", "-top-2", "transform-none");
            labelElement.classList.add("text-base", "top-1/2", "-translate-y-1/2");
            labelElement.style.opacity = "1";
        }

        // 테두리 색상 업데이트
        if (!error) {
            if (isFocused) {
                const borderColor = color ? `border-${color}-main` : "border-primary-main";
                fieldset.classList.add(borderColor);
                fieldset.classList.remove("border-disabled-main");
            } else {
                fieldset.classList.remove("border-primary-main");
                if (color) {
                    fieldset.classList.remove(`border-${color}-main`);
                }
                fieldset.classList.add("border-disabled-main");
            }
        }

        // 텍스트 색상 업데이트
        if (!error) {
            if (isFocused) {
                const textColor = color ? `text-${color}-main` : "text-primary-main";
                labelElement.classList.add(textColor);
            } else {
                labelElement.classList.remove("text-primary-main");
                if (color) {
                    labelElement.classList.remove(`text-${color}-main`);
                }
            }
        }

        // placeholder 업데이트
        inputElement.placeholder = shouldFloatLabel ? placeholder || "" : "";
    }, [isFocused, value, prefix, label, placeholder, shrink, error, name, color]);

    return null;
}

export default InputClient;
