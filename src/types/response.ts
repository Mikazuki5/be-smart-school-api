export interface ApiResponse<T = any> {
  success: boolean;      // Status utama (true/false)
  message: string;      // Pesan human-readable
  data?: T;             // Payload (opsional jika error)
  errors?: string[];    // Detail error (opsional jika sukses)
  meta?: {              // Untuk pagination atau info tambahan
    page?: number;
    limit?: number;
    total?: number;
  };
  timestamp: string;    // Waktu response dikirim
}