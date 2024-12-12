import { NextResponse } from 'next/server';
import { initializeSeats } from '@/lib/seatUtils';

let seats = initializeSeats();

export async function GET() {
  return NextResponse.json({ seats });
}

export async function POST(request: Request) {
  const { seatIds } = await request.json();
  
  seats = seats.map((seat) => ({
    ...seat,
    isBooked: seatIds.includes(seat.id) ? true : seat.isBooked,
  }));

  return NextResponse.json({ success: true, seats });
}