import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DoctorUnderReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguage();
  const location = useLocation();
  const fromOtp = (location.state as { fromOtp?: boolean } | null)?.fromOtp;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-1 mb-4">
          {lang === "ar" ? "English" : "العربية"}
        </Button>
        <br />
        <Link
          to={fromOtp ? "/register/doctor" : "/register"}
          className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "ar" ? "العودة" : "Back"}
        </Link>
      </div>

      <Card className="w-full max-w-2xl shadow-2xl border-0 my-8">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg ring-1 ring-emerald-200">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {lang === "ar" ? "تم إرسال طلبك بنجاح" : "Request Sent Successfully"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center px-8 pb-10">
          <p className="text-lg leading-8 text-muted-foreground sm:text-xl">
            {lang === "ar"
              ? "تم إرسال طلبك بنجاح! سيتم مراجعة حسابك وطلبك خلال 24 ساعة. يعمل فريقنا على مدار 24 ساعة لخدمتكم."
              : "Your request has been sent successfully! Your account and request will be reviewed within 24 hours. Our team works 24/7 to support you."}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Button className="h-12 text-base font-semibold" onClick={() => navigate("/")}> 
              {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Button>
            <Button
              className="h-12 text-base font-semibold"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              {lang === "ar" ? "تسجيل الخروج" : "Log Out"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorUnderReviewPage;
