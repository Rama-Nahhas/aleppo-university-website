import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Loader2,
  Inbox,
  Paperclip,
  FileText,
  Download,
  Building2,
  GraduationCap,
  Search,
  Library,
} from "lucide-react";
import {
  AllSubjectItem,
  NamedOption,
  useBrowseSubjects,
  useCollegeLookups,
} from "@/hooks/students/useApiActions";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

const PAGE_SIZE = 9;
const COLLEGE_ID = 1;

const YEAR_OPTIONS = [
  { id: 1, ar: "السنة الأولى", en: "First Year" },
  { id: 2, ar: "السنة الثانية", en: "Second Year" },
  { id: 3, ar: "السنة الثالثة", en: "Third Year" },
  { id: 4, ar: "السنة الرابعة", en: "Fourth Year" },
  { id: 5, ar: "السنة الخامسة", en: "Fifth Year" },
];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const BrowseMaterialsPage: React.FC = () => {
  const { lang } = useLanguage();
  const isArabic = lang === "ar";
  const { fetchAllSubjects, loading } = useBrowseSubjects();
  const { fetchDepartments } = useCollegeLookups();

  const [subjects, setSubjects] = useState<AllSubjectItem[]>([]);
  const [departments, setDepartments] = useState<NamedOption[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [departmentId, setDepartmentId] = useState<string>("all");
  const [yearId, setYearId] = useState<string>("all");
  const [q, setQ] = useState("");

  const [filesDialogSubject, setFilesDialogSubject] = useState<AllSubjectItem | null>(null);

  useEffect(() => {
    (async () => {
      const [subs, deps] = await Promise.all([fetchAllSubjects(), fetchDepartments(COLLEGE_ID)]);
      setSubjects(subs);
      setDepartments(deps);
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const withFiles = useMemo(() => subjects.filter((s) => s.media.length > 0), [subjects]);

  const filtered = useMemo(
    () =>
      withFiles.filter((s) => {
        if (departmentId !== "all" && String(s.department_id) !== departmentId) return false;
        if (yearId !== "all" && String(s.year_id) !== yearId) return false;
        if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && !(s.doctor?.name ?? "").toLowerCase().includes(q.toLowerCase())) {
          return false;
        }
        return true;
      }),
    [withFiles, departmentId, yearId, q],
  );

  const { page, setPage, totalPages, paginated } = usePagination(filtered, PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Library className="w-6 h-6 text-primary" />
          {isArabic ? "تصفح المواد والملفات" : "Browse Subjects & Materials"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isArabic
            ? "تصفح وحمّل محاضرات ومرفقات أي مادة بأي قسم أو سنة، حتى لو لم تكن مسجلاً فيها"
            : "Browse and download lecture files for any subject in any department or year, even if you're not enrolled in it"}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <Select value={departmentId} onValueChange={setDepartmentId}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder={isArabic ? "كل الأقسام" : "All Departments"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isArabic ? "كل الأقسام" : "All Departments"}</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={yearId} onValueChange={setYearId}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={isArabic ? "كل السنوات" : "All Years"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isArabic ? "كل السنوات" : "All Years"}</SelectItem>
            {YEAR_OPTIONS.map((y) => (
              <SelectItem key={y.id} value={String(y.id)}>{isArabic ? y.ar : y.en}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pr-9"
            placeholder={isArabic ? "بحث باسم المادة أو الدكتور..." : "Search by subject or doctor..."}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {!loaded || loading ? (
        <Loader2 className="animate-spin" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">
            {isArabic ? "لا توجد مواد فيها ملفات مرفقة حالياً" : "No subjects with attached files yet"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((s) => (
            <Card key={s.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground truncate">{s.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{s.department.name}</span>
                    </div>
                    {s.doctor && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {isArabic ? "المدرس: " : "Instructor: "}
                        {s.doctor.name}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {s.year.name}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 mt-3"
                      onClick={() => setFilesDialogSubject(s)}
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      {isArabic ? "الملفات" : "Files"}
                      <Badge variant="secondary" className="ms-1 px-1.5">{s.media.length}</Badge>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* نافذة الملفات */}
      <Dialog open={!!filesDialogSubject} onOpenChange={(open) => !open && setFilesDialogSubject(null)}>
        <DialogContent className="max-w-md" dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              {isArabic ? "الملفات المرفقة" : "Attached Files"}
            </DialogTitle>
            <DialogDescription>{filesDialogSubject?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {filesDialogSubject?.media.map((file) => (
              <a
                key={file.id}
                href={file.original_url}
                target="_blank"
                rel="noopener noreferrer"
                download={file.file_name}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Download className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowseMaterialsPage;
