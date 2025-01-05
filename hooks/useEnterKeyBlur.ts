import { KeyboardEvent } from 'react';

export function useEnterKeyBlur() {
  return function handleEnterKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      (e.target as HTMLInputElement).blur();
    }
  };
}
