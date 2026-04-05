export type RegionT = { latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number }

export type RestroomFeatureT = {
    attributes: {
        OBJECTID: number;
        BldgNum?: string;
        Name?: string;
        Type?: string;
        Notes?: string;
        MapDisplay?: string;
        showOnAggieMap?: string;
    };
    geometry: {
        x: number; // longitude
        y: number; // latitude
    };
};