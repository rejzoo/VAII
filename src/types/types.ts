export interface Tank {
    tank_id: number;
    name: string;
    type: string;
    nation: string;
    tier: number;
    description: string;
    is_premium: boolean;
    price_credit: number;
    price_gold: number;
}

export interface TankImages {
    tank_id: number;
    images: {
        big_icon: string;
        small_icon: string;
        contour_icon: string;
    }
}

export interface FavouriteTank {
    TankList: Tank[];
} 

export interface ServerData {
    server: string;
    players_online: number;
}