// https://stackoverflow.com/a/77459822
import { useContext as _useContext, createContext as _createContext } from 'react'

// Wrapper functions
export function useContext<T>(context: React.Context<T>) {
  const value = _useContext(context);
  if (value === undefined) {
    throw new Error("Context must be within provider");
  }
  return value;
}

export function createContext<T>(value: T | undefined = undefined) {
  return _createContext<T | undefined>(value);
}
