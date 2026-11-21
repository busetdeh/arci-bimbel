export interface PortalUpcomingClass {
  id: string;
  title: string;
  topic: string;
  tutor: string;
  room: string;
  timeSlot: string;
  timeLabel: string;
  sessionDate: string;
  zoomUrl?: string;
  isToday?: boolean;
}

export interface PortalAttendanceSummary {
  rateStr: string;
  detailStr: string;
  percent: number;
  presentCount: number;
  totalCount: number;
}

export interface PortalEvaluationSummary {
  scoreStr: string;
  trendStr: string;
  percent: number;
  predicate: string;
  noteTitle: string;
  noteAuthor: string;
  noteDate: string;
  noteBody: string;
  subjectScores: { subject: string; score: number }[];
  rankText?: string;
}

export interface PortalInvoiceItem {
  id: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  amountFormatted: string;
  status: "paid" | "unpaid" | "overdue" | "verify";
  statusLabel: string;
  statusBadgeClass: string;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
}

export interface PortalScheduleItem {
  id: string;
  dateStr: string;
  dayLabel: string;
  timeSlot: string;
  title: string;
  topic: string;
  tutor: string;
  room: string;
  zoomUrl?: string;
  isToday: boolean;
}

export interface PortalMaterialItem {
  id: string;
  title: string;
  type: "PDF" | "VID" | "DOC";
  fileSize: string;
  fileUrl: string;
  category: string;
  createdAt: string;
}

export interface PortalStudentProfile {
  id: string;
  shortName: string;
  fullName: string;
  nisn: string;
  grade: string;
  schoolOrigin: string;
  initials: string;
  className: string;
  classCode: string;
  parentName: string;
  parentPhone: string;
  parentRelationship: string;
  upcomingClass: PortalUpcomingClass;
  attendance: PortalAttendanceSummary;
  evaluation: PortalEvaluationSummary;
  billing: {
    statusBadge: string;
    statusClass: string;
    invoiceTitle: string;
    invoiceMeta: string;
    totalPaidFormatted: string;
    unpaidCount: number;
  };
  schedules: PortalScheduleItem[];
  materials: PortalMaterialItem[];
  invoices: PortalInvoiceItem[];
}

export interface PortalDataResult {
  success: boolean;
  students: PortalStudentProfile[];
  activeStudentId: string;
  message?: string;
}

export interface AbsenceNoticePayload {
  studentId: string;
  studentName: string;
  sessionTitle: string;
  reason: string;
  notes: string;
}
