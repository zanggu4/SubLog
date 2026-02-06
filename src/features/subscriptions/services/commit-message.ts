export function addMessage(name: string): string {
  return `feat: add ${name} subscription`;
}

export function updateMessage(name: string): string {
  return `chore: update ${name} subscription`;
}

export function cancelMessage(name: string): string {
  return `chore: cancel ${name} subscription`;
}

export function pauseMessage(name: string): string {
  return `chore: pause ${name} subscription`;
}

export function resumeMessage(name: string): string {
  return `chore: resume ${name} subscription`;
}
