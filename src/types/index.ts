export type RoleName =   'admin'| 'dean'| 'academic_doctor'| 'lab_technician'| 'warehouse_manager' | 'student'| 'nurse'| 'employee'  | 'medical_doctor' | 'university_admin'  ;

export interface Role {
  id: number;
  name: RoleName;
  label: string;
}

export interface User {
  id: number;
  name: string;
  nameEn?: string;
  email: string;
  password?: string;
  role_id: number;
  college_id: number | null;
  department_id: number | null;
  hospitalRole?: boolean;
  role?: Role;
  college?: College;
  department?: Department;
}

export interface College {
  id: number;
  years: number;
  name: string;
  nameEn?: string;
  slug?: string;
  description?: string;
  descriptionEn?: string;
}

export interface Department {
  id: number; 
  name: string;
  nameEn?: string;
  college_id: number;
  college?: College;
}

export interface Course {
  id: number;
  collegeId: number;
  year: number;
  name: string;
  nameEn?: string;
  department_id: number;
  doctor_id: number;
  department?: Department;
  doctor?: User;
}

export interface Laboratory {
  id: number;
  name: string;
  nameEn?: string;
  department_id: number;
  technician_id: number;
  
  department?: Department;
  technician?: User;
}

export interface Warehouse {
  id: number;
  name: string;
  nameEn?: string;
  location: string;
  locationEn?: string;
}

export interface Supply {
  id: number;
  name: string;
  nameEn?: string;
  quantity: number;
  warehouse_id: number;
  warehouse?: Warehouse;
}

export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'delivered' | 'purchase' | 'completed';

export interface Order {
  id: number;
  requester_id: number;
  warehouse_manager_id: number | null;
   lab_id: number | null;
   college_id: number | null; 
  status: OrderStatus;
  created_at: string;
  rejection_note?: string;
    warehouse_note?: string;
    dean_id?: number | null;
  requester?: User;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  supply_id: number;
  quantity: number;
  supply?: Supply;
}

export interface Hospital {
  id: number;
  name: string;
  nameEn?: string;
  location?: string;
  locationEn?: string;
}

export interface HospitalDepartment {
  id: number;
  name: string;
  nameEn?: string;
  hospital_id: number;
  hospital?: Hospital;
}

export interface Announcement {
  id: number;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  created_by: number;
  created_at: string;
  author?: User;
}
