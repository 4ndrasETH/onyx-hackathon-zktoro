import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function noop() {
  return;
}

export function truncateAddress(address: string, startLength = 6, endLength = 4) {
  return `${address.slice(0, startLength)}...${address.slice(address.length - endLength)}`;
}

export function truncateDidKey(didKey: string) {
  const [didString, keyString, address] = didKey.split(":");
  const truncatedAdddress =
    address.length <= 20 ? address : truncateAddress(address);
  
    return `${didString}:${keyString}:${truncatedAdddress}`;
}

export function delay(t: number) {
  return new Promise(resolve => setTimeout(resolve, t));
}