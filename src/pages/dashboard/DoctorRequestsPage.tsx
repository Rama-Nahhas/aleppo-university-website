import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserCheck, Check, X, Loader2, Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  PendingDoctor,
  useDoctorAdminActions,
} from "@/hooks/useDoctorAdminActions";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

const PAGE_SIZE = 10;

const DoctorRequestsPage: React.FC = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const { fetchPendingDoctors, acceptDoctor, rejectDoctor, loading } =
    useDoctorAdminActions();

  const [data, setData] = useState<PendingDoctor[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [actingId, setActingId] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PendingDoctor | null>(null);
  const [rejecting, setRejecting] = useState(false);

  const { page, setPage, totalPages, paginated } = usePagination(
    data,
    PAGE_SIZE,
  );

  const loadPending = async () => {
    const result = await fetchPendingDoctors();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const notifySuccess = (description: string) => {
    toast({
      title: lang === "ar" ? "تم بنجاح" : "Success",
      description,
      className: "bg-green-600 text-white font-semibold",
    });
  };

  const notifyError = (description: string) => {
    toast({
      title: lang === "ar" ? "حدث خطأ" : "Error",
      description,
      variant: "destructive",
    });
  };

  const handleAccept = async (doctor: PendingDoctor) => {
    setActingId(doctor.id);
    const ok = await acceptDoctor(doctor.id);
    setActingId(null);
    if (ok) {
      notifySuccess(
        lang === "ar" ? "تم قبول الدكتور بنجاح" : "Doctor accepted successfully",
      );
      await loadPending();
    } else {
      notifyError(
        lang === "ar" ? "حدث خطأ أثناء قبول الطلب" : "Failed to accept request",
      );
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    setRejecting(true);
    const ok = await rejectDoctor(rejectTarget.id);
    setRejecting(false);
    if (ok) {
      setRejectTarget(null);
      notifySuccess(
        lang === "ar" ? "تم رفض الطلب بنجاح" : "Request rejected successfully",
      );
      await loadPending();
    } else {
      notifyError(
        lang === "ar" ? "حدث خطأ أثناء رفض الطلب" : "Failed to reject request",
      );
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <UserCheck className="w-6 h-6 text-primary" />
        {lang === "ar" ? "طلبات الدكاترة  المدرسين" : "Doctor Requests"}
      </h1>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">
            {lang === "ar"
              ? "لا توجد طلبات معلّقة حالياً"
              : "No pending requests"}
          </p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{lang === "ar" ? "الاسم" : "Name"}</TableHead>
                  <TableHead>{lang === "ar" ? "البريد" : "Email"}</TableHead>
                  <TableHead>
                    {lang === "ar" ? "التخصص" : "Specialization"}
                  </TableHead>
                  <TableHead>
                    {lang === "ar" ? "الجامعة" : "University"}
                  </TableHead>
                  <TableHead>
                    {lang === "ar" ? "سنة التخرج" : "Graduation Year"}
                  </TableHead>
                  <TableHead>{lang === "ar" ? "إجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell>{d.email}</TableCell>
                    <TableCell>{d.specialization ?? "-"}</TableCell>
                    <TableCell>{d.university ?? "-"}</TableCell>
                    <TableCell>{d.graduation_year ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleAccept(d)}
                          disabled={loading}
                        >
                          {actingId === d.id ? (
                            <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4 ml-1" />
                          )}
                          {/* {lang === 'ar' ? 'قبول' : 'Accept'} */}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setRejectTarget(d)}
                          disabled={loading}
                        >
                          <X className="w-4 h-4 ml-1" />
                          {/* {lang === 'ar' ? 'رفض' : 'Reject'} */}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        lang={lang}
      />

      {/* Reject confirmation dialog */}
      <Dialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
      >
        <DialogContent dir={lang === "ar" ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>
              {lang === "ar" ? "تأكيد رفض الطلب" : "Confirm Rejection"}
            </DialogTitle>
            <DialogDescription>
              {lang === "ar"
                ? `هل أنت متأكد من رغبتك في رفض طلب "${rejectTarget?.name}"؟`
                : `Are you sure you want to reject "${rejectTarget?.name}"'s request?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={rejecting}
            >
              {rejecting
                ? lang === "ar"
                  ? "جاري الرفض..."
                  : "Rejecting..."
                : lang === "ar"
                  ? "تأكيد الرفض"
                  : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorRequestsPage;
