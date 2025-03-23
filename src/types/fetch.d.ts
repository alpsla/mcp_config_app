// Global augmentation of the RequestInit interface to make headers more flexible
interface RequestInit {
  headers?: Record<string, string> | HeadersInit;
}
