export function addMessage(name: string): string {
  return `feat: add ${name} subscription`;
}

export function updateMessage(name: string): string {
  return `chore: update ${name} subscription`;
}

export function cancelMessage(name: string): string {
  return `chore: cancel ${name} subscription`;
}
