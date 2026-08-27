import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { resolveRoleName } from "@/lib/roleUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  IdCard,
  GraduationCap,
  Building2,
  Calendar,
  Briefcase,
  Award,
  History,
  ShieldCheck,
  ShieldAlert,
  Key,
  UserRound,
  Pencil,
  Check,
  X,
} from "lucide-react";
import type { UserData } from "@/hooks/useAuthActions";
import {
  NamedOption,
  useCollegeLookups,
  useUpdateStudentProfile,
} from "@/hooks/students/useApiActions";

const COLLEGE_ID = 1;

interface EditFormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  birth_date: string;
  department_id: string;
  year_id: string;
  student_number: string;
  admission_type: string;
  password: string;
  password_confirmation: string;
}

const emptyEditForm: EditFormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  birth_date: "",
  department_id: "",
  year_id: "",
  student_number: "",
  admission_type: "",
  password: "",
  password_confirmation: "",
};

const toDateInputValue = (value?: string | null): string => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const buildEditForm = (profile: UserData | null): EditFormState => ({
  ...emptyEditForm,
  name: profile?.name ?? "",
  email: profile?.email ?? "",
  phone: profile?.phone ?? "",
  address: profile?.address ?? "",
  birth_date: toDateInputValue(profile?.birth_date),
  department_id: profile?.department_id != null ? String(profile.department_id) : "",
  year_id: profile?.year_id != null ? String(profile.year_id) : "",
  student_number: profile?.student_number ?? "",
  admission_type: profile?.admission_type ?? "",
});

const ProfilePage: React.FC = () => {
  const { user: cachedUser, updateUser } = useAuth();
  const { lang } = useLanguage();
  const { toast } = useToast();
  const isArabic = lang === "ar";

  const [profile, setProfile] = useState<UserData | null>(cachedUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<EditFormState>(emptyEditForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<NamedOption[]>([]);

  const { fetchDepartments } = useCollegeLookups();
  const { updateProfile, loading: isSaving, error: saveError } = useUpdateStudentProfile();

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get<UserData>("/profile");
        if (!ignore) setProfile(data);
      } catch {
        if (!ignore) {
          setError(
            isArabic
              ? "تعذّر تحميل بيانات الملف الشخصي. حاول مجدداً."
              : "Failed to load profile data. Please try again.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void loadProfile();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roleName = resolveRoleName(profile as any);
  const isStudent = roleName === "student";
  const roleLabel = profile?.role?.label ?? profile?.role?.name ?? "-";
  const displayName = (isArabic ? profile?.name : profile?.nameEn || profile?.name) ?? "-";
  const initials = (profile?.name || "?").trim().slice(0, 2);
  const isActive = Number(profile?.is_active) === 1;

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString(isArabic ? "ar-SY" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // تحميل قائمة الأقسام (من الـ API) مرة وحدة لما الطالب يفتح وضع التعديل
  useEffect(() => {
    if (!isStudent || !isEditing || departments.length > 0) return;
    (async () => {
      const deps = await fetchDepartments(COLLEGE_ID);
      setDepartments(deps);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStudent, isEditing]);

  const startEditing = () => {
    setEditForm(buildEditForm(profile));
    setFormError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormError(null);
  };

  const handleFieldChange = (field: keyof EditFormState, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setFormError(null);

    if (editForm.password && editForm.password !== editForm.password_confirmation) {
      setFormError(
        isArabic ? "كلمتا المرور غير متطابقتين" : "Passwords do not match",
      );
      return;
    }

    const payload: Record<string, string> = {};
    (Object.keys(editForm) as (keyof EditFormState)[]).forEach((key) => {
      if (key === "password_confirmation") return;
      const value = editForm[key].trim();
      if (!value) return;
      if (key === "password" && !editForm.password) return;
      payload[key] = value;
    });
    if (payload.password) {
      payload.password_confirmation = editForm.password_confirmation;
    }

    const updated = await updateProfile(payload);
    if (updated) {
      setProfile(updated);
      updateUser(updated);
      toast({
        title: isArabic ? "تم تحديث البيانات بنجاح" : "Profile updated successfully",
        className: "bg-green-600 text-white font-semibold",
      });
      setIsEditing(false);
    } else {
      setFormError(
        saveError ||
          (isArabic ? "حدث خطأ أثناء تحديث البيانات." : "Something went wrong."),
      );
    }
  };

  interface InfoRow {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
  }

  const infoRows: InfoRow[] = [
    { icon: Mail, label: isArabic ? "البريد الإلكتروني" : "Email", value: profile?.email },
    { icon: Phone, label: isArabic ? "رقم الهاتف" : "Phone", value: profile?.phone },
    { icon: MapPin, label: isArabic ? "العنوان" : "Address", value: profile?.address },
    { icon: Calendar, label: isArabic ? "تاريخ الميلاد" : "Birth Date", value: profile?.birth_date ? formatDate(profile.birth_date) : null },
    { icon: IdCard, label: isArabic ? "الرقم الجامعي" : "Student Number", value: profile?.student_number },
    { icon: GraduationCap, label: isArabic ? "نوع القبول" : "Admission Type", value: profile?.admission_type },
    { icon: Award, label: isArabic ? "الاختصاص" : "Specialization", value: profile?.specialization },
    { icon: Building2, label: isArabic ? "الجامعة" : "University", value: profile?.university },
    { icon: GraduationCap, label: isArabic ? "سنة التخرج" : "Graduation Year", value: profile?.graduation_year },
    { icon: Briefcase, label: isArabic ? "سنة التعيين" : "Employment Year", value: profile?.employment_year },
    { icon: History, label: isArabic ? "الخبرة العملية" : "Work History", value: profile?.work_history },
  ].filter((row) => row.value !== null && row.value !== undefined && row.value !== "");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        {isArabic ? "الملف الشخصي" : "My Profile"}
      </h1>

      {loading ? (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center text-destructive font-medium">
            {error}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-l from-primary to-primary/70" />
            <CardContent className="p-6 -mt-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                  {profile?.image && <AvatarImage src={profile.image} alt={displayName} />}
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-foreground truncate">{displayName}</h2>
                  <p className="text-sm text-muted-foreground truncate">{profile?.email}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <UserRound className="w-3.5 h-3.5" />
                    {roleLabel}
                  </Badge>
                  {isActive ? (
                    <Badge className="gap-1 border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {isArabic ? "حساب نشط" : "Active"}
                    </Badge>
                  ) : (
                    <Badge className="gap-1 border-transparent bg-amber-100 text-amber-700 hover:bg-amber-100">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {isArabic ? "قيد المراجعة" : "Pending Review"}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">
                  {isArabic ? "المعلومات الشخصية" : "Personal Information"}
                </h3>
                {isStudent && !isEditing && (
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={startEditing}>
                    <Pencil className="w-3.5 h-3.5" />
                    {isArabic ? "تعديل البيانات" : "Edit Profile"}
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-name">{isArabic ? "الاسم الكامل" : "Full Name"}</Label>
                      <Input id="edit-name" value={editForm.name} onChange={(e) => handleFieldChange("name", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-email">{isArabic ? "البريد الإلكتروني" : "Email"}</Label>
                      <Input id="edit-email" type="email" value={editForm.email} onChange={(e) => handleFieldChange("email", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-phone">{isArabic ? "رقم الهاتف" : "Phone"}</Label>
                      <Input id="edit-phone" value={editForm.phone} onChange={(e) => handleFieldChange("phone", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-address">{isArabic ? "العنوان" : "Address"}</Label>
                      <Input id="edit-address" value={editForm.address} onChange={(e) => handleFieldChange("address", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-birth_date">{isArabic ? "تاريخ الميلاد" : "Birth Date"}</Label>
                      <Input id="edit-birth_date" type="date" value={editForm.birth_date} onChange={(e) => handleFieldChange("birth_date", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-student_number">{isArabic ? "الرقم الجامعي" : "Student Number"}</Label>
                      <Input id="edit-student_number" value={editForm.student_number} onChange={(e) => handleFieldChange("student_number", e.target.value)} />
                    </div>

                    <div className="space-y-1.5">
                      <Label>{isArabic ? "القسم" : "Department"}</Label>
                      <Select value={editForm.department_id} onValueChange={(v) => handleFieldChange("department_id", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder={isArabic ? "اختر القسم" : "Select Department"} />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dep) => (
                            <SelectItem key={dep.id} value={String(dep.id)}>
                              {dep.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>{isArabic ? "السنة" : "Year"}</Label>
                      <Select value={editForm.year_id} onValueChange={(v) => handleFieldChange("year_id", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder={isArabic ? "اختر السنة" : "Select Year"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">{isArabic ? "السنة الأولى" : "First Year"}</SelectItem>
                          <SelectItem value="2">{isArabic ? "السنة الثانية" : "Second Year"}</SelectItem>
                          <SelectItem value="3">{isArabic ? "السنة الثالثة" : "Third Year"}</SelectItem>
                          <SelectItem value="4">{isArabic ? "السنة الرابعة" : "Fourth Year"}</SelectItem>
                          <SelectItem value="5">{isArabic ? "السنة الخامسة" : "Fifth Year"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>{isArabic ? "نوع القبول" : "Admission Type"}</Label>
                      <Select value={editForm.admission_type} onValueChange={(v) => handleFieldChange("admission_type", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder={isArabic ? "اختر نوع القبول" : "Select admission type"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="عام">{isArabic ? "عام" : "General"}</SelectItem>
                          <SelectItem value="خاص">{isArabic ? "خاص" : "Private"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                    <div className="space-y-1.5 pt-4">
                      <Label htmlFor="edit-password">
                        {isArabic ? "كلمة مرور جديدة (اختياري)" : "New Password (optional)"}
                      </Label>
                      <Input id="edit-password" type="password" value={editForm.password} onChange={(e) => handleFieldChange("password", e.target.value)} placeholder="••••••••" />
                    </div>
                    <div className="space-y-1.5 pt-4">
                      <Label htmlFor="edit-password_confirmation">
                        {isArabic ? "تأكيد كلمة المرور" : "Confirm Password"}
                      </Label>
                      <Input id="edit-password_confirmation" type="password" value={editForm.password_confirmation} onChange={(e) => handleFieldChange("password_confirmation", e.target.value)} placeholder="••••••••" />
                    </div>
                  </div>

                  {formError && (
                    <p className="text-sm text-destructive font-medium">{formError}</p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" className="gap-1.5" onClick={cancelEditing} disabled={isSaving}>
                      <X className="w-3.5 h-3.5" />
                      {isArabic ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button type="button" className="gap-1.5" onClick={handleSave} disabled={isSaving}>
                      <Check className="w-3.5 h-3.5" />
                      {isSaving ? (isArabic ? "جاري الحفظ..." : "Saving...") : (isArabic ? "حفظ التعديلات" : "Save Changes")}
                    </Button>
                  </div>
                </div>
              ) : infoRows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {isArabic ? "لا توجد معلومات إضافية بعد" : "No additional information yet"}
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {infoRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <row.icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{row.label}</p>
                        <p className="text-sm font-semibold text-foreground truncate">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isEditing && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
                  <span>
                    {isArabic ? "عضو منذ" : "Member since"} {formatDate(profile?.created_at)}
                  </span>
                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <Link to="/dashboard/change-password">
                      <Key className="w-3.5 h-3.5" />
                      {isArabic ? "تغيير كلمة المرور" : "Change Password"}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
