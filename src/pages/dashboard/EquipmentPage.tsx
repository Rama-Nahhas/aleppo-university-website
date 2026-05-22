import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { laboratories, supplies } from '@/data/mockData';
import { Package } from 'lucide-react';

const EquipmentPage: React.FC = () => {
  const { lang } = useLanguage();

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
              {supplies.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{lang === 'ar' ? s.name : s.nameEn}</TableCell>
                  <TableCell>{s.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentPage;
