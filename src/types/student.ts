// Filter yang diterima dari URL
export interface StudentQuery {
  page?: string;
  limit?: string;
  search?: string;      // Pencarian berdasarkan Nama atau Username
  departmentId?: string;   // Filter per jurusan
  classId?: string;     // Filter per kelas
}

// Struktur Meta Data untuk Pagination
export interface PaginationMeta {
  totalData: number;
  totalPage: number;
  currentPage: number;
  limit: number;
}