import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAccessToken } from '@/lib/db/auth';

export const dynamic = 'force-dynamic';

const AMENITIES = [
  {
    id: 'wifi',
    name: 'Wi-Fi',
    icon: 'Wifi',
    available: true,
    description: '24/7 high-speed Wi-Fi in all rooms and common areas',
  },
  {
    id: 'gym',
    name: 'Gymnasium',
    icon: 'Dumbbell',
    available: true,
    description: 'Fully equipped gym with cardio and weights section',
  },
  {
    id: 'library',
    name: 'Reading Room',
    icon: 'BookOpen',
    available: true,
    description: 'Quiet reading room with reference books and newspapers',
  },
  {
    id: 'laundry',
    name: 'Laundry Service',
    icon: 'Shirt',
    available: true,
    description: 'Coin-operated washing machines and dry-cleaning service',
  },
  {
    id: 'canteen',
    name: 'Canteen',
    icon: 'FlaskConical',
    available: true,
    description: 'In-house canteen serving snacks, beverages, and meals',
  },
  {
    id: 'sports',
    name: 'Indoor Sports',
    icon: 'TableTennis',
    available: true,
    description: 'Table tennis, chess, carrom, and badminton courts',
  },
  {
    id: 'parking',
    name: 'Parking',
    icon: 'Car',
    available: true,
    description: 'Secured parking for bicycles and motorcycles',
  },
  {
    id: 'generator',
    name: 'Power Backup',
    icon: 'Zap',
    available: true,
    description: '24/7 generator backup for uninterrupted power supply',
  },
];

const MESS_MENU = {
  breakfast: [
    { day: 'Monday', items: ['Aloo Paratha', 'Curd', 'Butter', 'Tea/Coffee'] },
    { day: 'Tuesday', items: ['Poha', 'Jalebi', 'Banana', 'Milk'] },
    { day: 'Wednesday', items: ['Chole Bhature', 'Onion Salad', 'Tea/Coffee'] },
    { day: 'Thursday', items: ['Idli', 'Sambhar', 'Coconut Chutney', 'Tea'] },
    { day: 'Friday', items: ['Pur Bhaji', 'Bread Slice', 'Tea/Coffee'] },
    { day: 'Saturday', items: ['Masala Dosa', 'Sambhar', 'Chutney', 'Coffee'] },
    { day: 'Sunday', items: ['Egg Curry', 'Pav Bhaji', 'Bread', 'Tea/Coffee'] },
  ],
  lunch: [
    { day: 'Monday', items: ['Dal Tadka', 'Jeera Rice', 'Roti', 'Mix Veg', 'Salad', 'Ice Cream'] },
    { day: 'Tuesday', items: ['Rajma Chawal', 'Roti', 'Boondi Raita', 'Papad', 'Salad'] },
    { day: 'Wednesday', items: ['Kadhi Pakora', 'Steamed Rice', 'Roti', 'Aloo Gobhi', 'Salad'] },
    { day: 'Thursday', items: ['Chole', 'Rice', 'Roti', 'Raita', 'Pickle', 'Gulab Jamun'] },
    { day: 'Friday', items: ['Dal Makhani', 'Naan', 'Rice', 'Mix Veg', 'Salad', 'Kheer'] },
    { day: 'Saturday', items: ['Veg Biryani', 'Raita', 'Roti', 'Dal Fry', 'Salad', 'Fruit'] },
    { day: 'Sunday', items: ['Paneer Butter Masala', 'Butter Naan', 'Rice', 'Dal', 'Salad', 'Pastry'] },
  ],
  snacks: [
    { day: 'Monday', items: ['Samosa', 'Green Chutney', 'Tea/Coffee'] },
    { day: 'Tuesday', items: ['Bread Pakora', 'Tomato Sauce', 'Tea/Coffee'] },
    { day: 'Wednesday', items: ['Vada Pav', 'Green Chilli', 'Tea'] },
    { day: 'Thursday', items: ['Onion Pakora', 'Chutney', 'Coffee'] },
    { day: 'Friday', items: ['Kachori', 'Sabzi', 'Tea/Coffee'] },
    { day: 'Saturday', items: ['Spring Roll', 'Sauce', 'Tea/Coffee'] },
    { day: 'Sunday', items: ['Mix Pakora', 'Chai', 'Biscuits'] },
  ],
  dinner: [
    { day: 'Monday', items: ['Dal Palak', 'Roti', 'Rice', 'Salad', 'Pickle'] },
    { day: 'Tuesday', items: ['Besan Chilla', 'Roti', 'Rice', 'Aloo Matar', 'Salad'] },
    { day: 'Wednesday', items: ['Kadai Vegetable', 'Roti', 'Jeera Rice', 'Salad', 'Papad'] },
    { day: 'Thursday', items: ['Dal Dhokli', 'Roti', 'Rice', 'Bhendi Fry', 'Salad'] },
    { day: 'Friday', items: ['Matar Paneer', 'Roti', 'Rice', 'Salad', 'Rasgulla'] },
    { day: 'Saturday', items: ['Lemon Rice', 'Roti', 'Dal', 'Cabbage Curry', 'Salad'] },
    { day: 'Sunday', items: ['Special Thali', 'Roti', 'Rice', 'Dal Makhani', 'Mix Veg', 'Raita', 'Dessert'] },
  ],
};

const EMERGENCY_CONTACTS = [
  { id: 'warden', name: 'Chief Warden', phone: '+91 1800 123 4567', available: true },
  { id: 'security', name: 'Security Desk', phone: '+91 1800 123 4568', available: true },
  { id: 'medical', name: 'Medical Centre', phone: '+91 1800 123 4569', available: true },
  { id: 'caretaker', name: 'Caretaker', phone: '+91 1800 123 4570', available: false },
  { id: 'helpline', name: 'Student Helpline', phone: '+91 1800 123 4571', available: true },
];

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    let targetStudentId: string;
    if (payload.role === 'student') {
      targetStudentId = payload.userId;
    } else if (studentId) {
      targetStudentId = studentId;
    } else {
      return NextResponse.json({ error: 'studentId query parameter is required' }, { status: 400 });
    }

    const currentAllocation = db.prepare(`
      SELECT * FROM hostel_allocations WHERE student_id = ? AND status = 'current' LIMIT 1
    `).get(targetStudentId) || null;

    const history = db.prepare(`
      SELECT * FROM hostel_allocations WHERE student_id = ? ORDER BY year DESC, semester DESC
    `).all(targetStudentId);

    return NextResponse.json({
      success: true,
      data: {
        currentAllocation,
        history,
        amenities: AMENITIES,
        messMenu: MESS_MENU,
        emergencyContacts: EMERGENCY_CONTACTS,
      },
    });
  } catch (error: any) {
    console.error('Get hostel data error:', error);
    return NextResponse.json({ error: 'Failed to get hostel data' }, { status: 500 });
  }
}
