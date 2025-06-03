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

export interface TerminalTransferBooking {
    terminal_type: string;
    terminal_name: string;
    district_location_query: string;
    pax_count: number;
    is_ac_preference: boolean;
    pickup_time_type: 'now' | 'schedule';
    pickup_date: string | null;
    pickup_time: string | null;
    mode?: 'pickup' | 'drop';
}

export interface HourlySupplierCategoryPricing {
    base_price: number | null;
    included_kms: number | null;
    price_per_km: number | null;
    driver_allowance: number | null;
    final_price: number | null;
}

export interface HourlySupplierCategoryDistanceInfo {
    total_distance_km: number;
    included_kms: number | null;
    extra_kms: number | null;
}

export interface HourlySupplierCategory {
    id: number;
    name: string;
    seating_capacity: number;
    pricing: HourlySupplierCategoryPricing;
    distance_info: HourlySupplierCategoryDistanceInfo;
}

export interface HourlySupplier {
    id: number;
    name: string;
    avg_rating: string;
    review_count: number;
    phone_number: string | null;
    categories: {
        [categoryId: string]: HourlySupplierCategory;
    };
}

export interface HourlyRouteInfo {
    pickup_location: string;
    drop_location: string;
    distance_km: number;
    duration: string;
}

export interface HourlySearchResponse {
    success: boolean;
    data: {
        suppliers: HourlySupplier[];
        route_info: HourlyRouteInfo;
    };
}

export interface MultidayRouteInfo {
    pickup_location: string;
    drop_location: string;
    distance_km: number;
    duration: string;
}

export interface MultidaySupplierCategory {
    id: string;
    name: string;
    seating_capacity: number;
    pricing: {
        base_price: number;
        included_kms: number;
        price_per_km: number;
        driver_allowance: number;
        night_driving_fee: number;
        included_hours_day: number;
        price_per_hour: number;
        dead_return_cost: number;
        final_price: number;
    };
    distance_info: {
        total_distance_km: number;
        included_kms: number;
        extra_kms: number;
        total_hours: number;
        included_hours: number;
        extra_hours: number;
    };
}

export interface MultidaySupplier {
    id: number;
    name: string;
    avg_rating: number;
    review_count: number;
    phone_number: string;
    categories: Record<string, MultidaySupplierCategory>;
}

export interface MultidaySearchResponse {
    success: boolean;
    data: {
        suppliers: MultidaySupplier[];
        route_info: MultidayRouteInfo;
    };
}
