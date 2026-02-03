// app/client/dispute/[bookingId].tsx
// Client dispute filing screen

import { DisputeReportForm } from '@/components/dispute';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function DisputeScreen() {
  const router = useRouter();
  const { bookingId, artisanId, artisanName } = useLocalSearchParams();

  return (
    <DisputeReportForm
      bookingId={bookingId as string || 'unknown'}
      artisanId={artisanId as string || 'unknown'}
      artisanName={artisanName as string || 'Artisan'}
      onSubmit={(disputeId) => {
        router.replace('/client/(tabs)/bookings');
      }}
      onCancel={() => router.back()}
    />
  );
}
