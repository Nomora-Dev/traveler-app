export interface LocationSuggestion {
    success: boolean;
    message: string | null;
    data: {
        description: string;
        place_id: string;
    }[];
}

export interface TransferBooking {
    service_type: string;
    pickup_location_query: string;
    drop_location_query: string;
    pax_count: number;
    is_ac_preference: boolean;
    pickup_time_type: 'now' | 'schedule';
    pickup_date: string | null;
    pickup_time: string | null;
}
