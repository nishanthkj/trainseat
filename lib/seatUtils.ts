import { Seat } from './types';

export const ROWS = 12;
export const SEATS_PER_ROW = 7;
export const LAST_ROW_SEATS = 3;
export const TOTAL_SEATS = 80;

export function initializeSeats(): Seat[] {
  const seats: Seat[] = [];
  let seatId = 1;

  for (let row = 1; row <= ROWS; row++) {
    const seatsInRow = row === ROWS ? LAST_ROW_SEATS : SEATS_PER_ROW;
    for (let seat = 1; seat <= seatsInRow; seat++) {
      seats.push({
        id: seatId++,
        row,
        isBooked: false,
      });
    }
  }
  return seats;
}

export function findBestAvailableSeats(
  seats: Seat[],
  numberOfSeats: number
): number[] {
  // First try to find contiguous seats in the same row
  for (let row = 1; row <= ROWS; row++) {
    const rowSeats = seats.filter((seat) => seat.row === row && !seat.isBooked);
    const seatsInRow = row === ROWS ? LAST_ROW_SEATS : SEATS_PER_ROW;
    
    if (rowSeats.length >= numberOfSeats) {
      const contiguousSeats = findContiguousSeats(rowSeats, numberOfSeats);
      if (contiguousSeats.length === numberOfSeats) {
        return contiguousSeats.map((seat) => seat.id);
      }
    }
  }

  // If no contiguous seats found, get nearest available seats
  const availableSeats = seats
    .filter((seat) => !seat.isBooked)
    .slice(0, numberOfSeats)
    .map((seat) => seat.id);

  return availableSeats;
}

function findContiguousSeats(seats: Seat[], count: number): Seat[] {
  for (let i = 0; i <= seats.length - count; i++) {
    const contiguous = seats.slice(i, i + count);
    if (isContiguous(contiguous)) {
      return contiguous;
    }
  }
  return [];
}

function isContiguous(seats: Seat[]): boolean {
  for (let i = 1; i < seats.length; i++) {
    if (seats[i].id !== seats[i - 1].id + 1) {
      return false;
    }
  }
  return true;
}