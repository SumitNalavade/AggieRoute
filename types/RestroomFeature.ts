type RestroomFeature = {
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

export default RestroomFeature;