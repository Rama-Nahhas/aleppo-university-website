import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { laboratories, supplies } from '@/data/mockData';
import { Package } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 10;

const EquipmentPage: React.FC = () => {
  const { lang } = useLanguage();
  const { page, setPage, totalPages, paginated } = usePagination(supplies, PAGE_SIZE);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Package className="w-6 h-6" />{lang === 'ar' ? 'المعدات والأجهزة' : 'Equipment & Devices'}</h1>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lang === 'ar' ? 'المادة' : 'Item'}</TableHead>
                <TableHead>{lang === 'ar' ? 'الكمية' : 'Qty'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{lang === 'ar' ? s.name : s.nameEn}</TableCell>
                  <TableCell>{s.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />
    </div>
  );
};

export default EquipmentPage;
