export async function wait(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export class helper {
  /**
   * Mengembalikan bulan saat ini dalam format angka (1–12)
   */
  getCurrentMonth(): number {
    return new Date().getMonth() + 1; // Months are zero-based
  }

  /**
   * Mengembalikan nama bulan saat ini (Bahasa Indonesia)
   */
  getCurrentMonthName(): string {
    const monthNamesID = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    return monthNamesID[new Date().getMonth()];
  }

  /**
   * Mengembalikan bulan format 2 digit (01–12)
   */
  getCurrentMonthTwoDigit(): string {
    return String(new Date().getMonth() + 1).padStart(2, '0');
  }
}