-- ARCI Bimbel — API privileges patch
-- Jalankan setelah schema.sql jika schema sudah pernah diterapkan.
-- RLS tetap menjadi lapisan pembatas data per baris.

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.branches, public.programs TO anon, authenticated;
GRANT INSERT ON public.leads TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.profiles,
  public.branches,
  public.programs,
  public.leads,
  public.classes,
  public.students,
  public.parents,
  public.student_parents,
  public.enrollments,
  public.attendance_sessions,
  public.attendance_records,
  public.invoices,
  public.payments,
  public.materials,
  public.announcements,
  public.audit_logs
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.profiles,
  public.branches,
  public.programs,
  public.leads,
  public.classes,
  public.students,
  public.parents,
  public.student_parents,
  public.enrollments,
  public.attendance_sessions,
  public.attendance_records,
  public.invoices,
  public.payments,
  public.materials,
  public.announcements,
  public.audit_logs
TO service_role;
