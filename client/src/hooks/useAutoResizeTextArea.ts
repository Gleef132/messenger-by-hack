import { useEffect } from "react";

export const useAutoResizeTextArea = (
	textAreaRef: HTMLTextAreaElement | null,
	value: string,
	maxHeight: number) => {
	useEffect(() => {
		if (textAreaRef) {
			if (textAreaRef.scrollHeight > maxHeight) {
				textAreaRef.style.overflowY = 'scroll'
			} else {
				textAreaRef.style.overflowY = 'hidden'
			};
			textAreaRef.style.height = "43px";
			const scrollHeight = textAreaRef.scrollHeight;

			textAreaRef.style.height = scrollHeight + "px";
		}
	}, [textAreaRef, value]);
};