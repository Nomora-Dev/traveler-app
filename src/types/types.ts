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
