import { z } from "zod";

export const leadFormSchema = z.object({
  parentName: z
    .string()
    .min(3, { message: "Nama orang tua/wali minimal 3 karakter" }),
  studentName: z
    .string()
    .min(3, { message: "Nama siswa minimal 3 karakter" }),
  parentPhone: z
    .string()
    .min(9, { message: "Nomor WhatsApp minimal 9 digit" })
    .regex(/^[0-9+\-\s]+$/, { message: "Nomor telepon hanya boleh angka dan tanda +" }),
  gradeLevel: z.string().min(1, { message: "Pilih jenjang pendidikan" }),
  learningMode: z.string().min(1, { message: "Pilih mode belajar" }),
  targetSubject: z.string().optional(),
  notes: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
