"use client";

import { useState, useEffect } from 'react';
import { Seat } from '@/lib/types';
import { SeatGrid } from '@/components/ui/seat-grid';
import { findBestAvailableSeats } from '@/lib/seatUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Home() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [numberOfSeats, setNumberOfSeats] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    const response = await fetch('/api/seats');
    const data = await response.json();
    setSeats(data.seats);
  };

  const handleBooking = async () => {
    const num = parseInt(numberOfSeats);
    if (isNaN(num) || num < 1 || num > 7) {
      toast.error('Please enter a valid number of seats (1-7)');
      return;
    }

    setLoading(true);
    const bestSeats = findBestAvailableSeats(seats, num);
    
    if (bestSeats.length < num) {
      toast.error('Not enough seats available');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatIds: bestSeats }),
      });

      const data = await response.json();
      if (data.success) {
        setSeats(data.seats);
        toast.success(`Successfully booked seats: ${bestSeats.join(', ')}`);
        setNumberOfSeats('');
        setSelectedSeats([]);
      }
    } catch (error) {
      toast.error('Failed to book seats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Train Coach Seat Booking</h1>
          
          <div className="flex gap-4 justify-center mb-8">
            <Input
              type="number"
              min="1"
              max="7"
              value={numberOfSeats}
              onChange={(e) => setNumberOfSeats(e.target.value)}
              placeholder="Number of seats (1-7)"
              className="w-48"
            />
            <Button
              onClick={handleBooking}
              disabled={loading || !numberOfSeats}
            >
              {loading ? 'Booking...' : 'Book Seats'}
            </Button>
          </div>

          <div className="mb-8">
            <div className="flex justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-200" />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-200" />
                <span className="text-sm">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span className="text-sm">Selected</span>
              </div>
            </div>
          </div>

          <SeatGrid
            seats={seats}
            selectedSeats={selectedSeats}
          />
        </div>
      </div>
    </div>
  );
}