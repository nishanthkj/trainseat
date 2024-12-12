"use client";

import { Seat } from '@/lib/types';
import { ROWS, SEATS_PER_ROW, LAST_ROW_SEATS } from '@/lib/seatUtils';
import { cn } from '@/lib/utils';

interface SeatGridProps {
  seats: Seat[];
  selectedSeats: number[];
  onSeatClick?: (seatId: number) => void;
}

export function SeatGrid({ seats, selectedSeats, onSeatClick }: SeatGridProps) {
  const renderSeat = (seatId: number) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return null;

    return (
      <button
        key={seat.id}
        onClick={() => onSeatClick?.(seat.id)}
        disabled={seat.isBooked}
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
          seat.isBooked
            ? "bg-red-200 text-red-700 cursor-not-allowed"
            : selectedSeats.includes(seat.id)
            ? "bg-blue-500 text-white"
            : "bg-green-200 text-green-700 hover:bg-green-300"
        )}
      >
        {seat.id}
      </button>
    );
  };

  const renderRow = (rowNumber: number) => {
    const seatsInRow = rowNumber === ROWS ? LAST_ROW_SEATS : SEATS_PER_ROW;
    const startSeat = (rowNumber - 1) * SEATS_PER_ROW + 1;
    
    return (
      <div key={rowNumber} className="flex gap-2 justify-center">
        {Array.from({ length: seatsInRow }, (_, index) => (
          renderSeat(startSeat + index)
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: ROWS }, (_, index) => renderRow(index + 1))}
    </div>
  );
}